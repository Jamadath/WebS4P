/**
 * Integración segura del formulario de Contacto S4P con la API.
 *
 * JSON esperado por el backend:
 * {
 *   "Nombre": "...",
 *   "Paterno": "...",
 *   "Email": "...",
 *   "Pais": "...",
 *   "Motivo": "...",
 *   "DetalleContacto": "...",
 *   "token": "..."
 * }
 */
(function () {
  "use strict";

  // -----------------------------------------------------------------
  // CONFIGURACIÓN — leída desde JS/config.js (ver advertencia de seguridad ahí)
  // -----------------------------------------------------------------
  const CONFIG = window.S4P_CONTACT_CONFIG || {};
  const API_ENDPOINT = CONFIG.API_ENDPOINT;
  const REQUEST_TIMEOUT_MS = 10000;

  /**
   * Token fijo leído desde config.js.
   * Ver advertencia de seguridad en ese archivo: un token fijo en un
   * sitio estático (HTML+JS puro) siempre es visible para quien inspeccione
   * la red del navegador. La protección real debe estar en la API
   * (CORS restringido al dominio, rate limiting, privilegios mínimos).
   */
  async function getToken() {
    return CONFIG.TOKEN;
  }

  const form = document.getElementById("contactForm");
  if (!form) return; // seguridad: si no existe el formulario, no seguir

  if (!API_ENDPOINT) {
    console.error("Falta configurar JS/config.js (API_ENDPOINT).");
  }

  const submitBtn = document.getElementById("submitBtn");
  const statusMsg = document.getElementById("statusMsg");

  const inputs = {
    nombre: document.getElementById("nombre"),
    paterno: document.getElementById("apellido-paterno"),
    email: document.getElementById("email"),
    confirmarEmail: document.getElementById("confirmar-email"),
    pais: document.getElementById("pais"),
    motivo: document.getElementById("motivo"),
    detalle: document.getElementById("detalle")
  };

  const mayorEdadCheckbox = form.querySelector('input[name="mayor-edad"]');
  const consentimientoCheckbox = form.querySelector('input[name="consentimiento"]');

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // --- Sanitización básica: elimina etiquetas HTML y recorta espacios ---
  function sanitize(value) {
    return String(value || "")
      .replace(/<[^>]*>/g, "")
      .trim();
  }

  function setStatus(message, type) {
    statusMsg.textContent = message;
    statusMsg.className = "form-status" + (type ? " " + type : "");
  }

  function clearFieldErrors() {
    form.querySelectorAll(".field-error").forEach(function (el) {
      el.remove();
    });
    form.querySelectorAll(".input-invalid").forEach(function (el) {
      el.classList.remove("input-invalid");
    });
  }

  function showFieldError(inputEl, message) {
    inputEl.classList.add("input-invalid");
    const errorEl = document.createElement("small");
    errorEl.className = "field-error";
    errorEl.style.color = "#c0392b";
    errorEl.textContent = message;
    inputEl.insertAdjacentElement("afterend", errorEl);
  }

  function validate(values) {
    let valid = true;

    if (!values.nombre) {
      showFieldError(inputs.nombre, "El nombre es obligatorio.");
      valid = false;
    }
    if (!values.paterno) {
      showFieldError(inputs.paterno, "El apellido paterno es obligatorio.");
      valid = false;
    }
    if (!values.email || !EMAIL_REGEX.test(values.email)) {
      showFieldError(inputs.email, "Ingresa un email válido.");
      valid = false;
    }
    if (values.email !== values.confirmarEmail) {
      showFieldError(inputs.confirmarEmail, "Los correos no coinciden.");
      valid = false;
    }
    if (!values.pais) {
      showFieldError(inputs.pais, "Selecciona un país.");
      valid = false;
    }
    if (!values.motivo) {
      showFieldError(inputs.motivo, "Selecciona un motivo.");
      valid = false;
    }
    if (!values.detalle) {
      showFieldError(inputs.detalle, "El detalle de contacto es obligatorio.");
      valid = false;
    }
    if (!mayorEdadCheckbox.checked) {
      valid = false;
      setStatus("Debes declarar que eres mayor de edad.", "fail");
    }
    if (!consentimientoCheckbox.checked) {
      valid = false;
      setStatus("Debes aceptar la política de protección de datos.", "fail");
    }

    return valid;
  }

  // --- fetch con timeout mediante AbortController ---
  async function fetchWithTimeout(url, options, timeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(function () {
      controller.abort();
    }, timeoutMs);

    try {
      return await fetch(url, Object.assign({}, options, { signal: controller.signal }));
    } finally {
      clearTimeout(timeoutId);
    }
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearFieldErrors();
    setStatus("", "");

    const values = {
      nombre: sanitize(inputs.nombre.value),
      paterno: sanitize(inputs.paterno.value),
      email: sanitize(inputs.email.value),
      confirmarEmail: sanitize(inputs.confirmarEmail.value),
      pais: sanitize(inputs.pais.value),
      motivo: sanitize(inputs.motivo.value),
      detalle: sanitize(inputs.detalle.value)
    };

    if (!validate(values)) {
      return;
    }

    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Enviando...";

    try {
      const token = await getToken();

      const payload = {
        Nombre: values.nombre,
        Paterno: values.paterno,
        Email: values.email,
        Pais: values.pais,
        Motivo: values.motivo,
        DetalleContacto: values.detalle,
        token: token
      };

      const response = await fetchWithTimeout(
        API_ENDPOINT,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        },
        REQUEST_TIMEOUT_MS
      );

      if (!response.ok) {
        // No se expone el código/detalle crudo del servidor al usuario final
        throw new Error("HTTP_" + response.status);
      }

      setStatus("¡Tu consulta fue enviada correctamente!", "ok");
      form.reset();

    } catch (err) {
      let userMessage = "Ocurrió un error al enviar tu consulta. Intenta nuevamente.";
      if (err && err.name === "AbortError") {
        userMessage = "La solicitud demoró demasiado. Verifica tu conexión e intenta de nuevo.";
      }
      setStatus(userMessage, "fail");
      // El detalle técnico solo se registra en consola, nunca en el DOM visible.
      console.error("Error al enviar formulario de contacto:", err);

    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
})();
