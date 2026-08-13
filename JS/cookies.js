document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('cookie-banner');
  const modal = document.getElementById('cookie-modal');

  const btnAccept = document.getElementById('btn-accept-cookies');
  const btnReject = document.getElementById('btn-reject-cookies');
  const btnConfig = document.getElementById('btn-config-cookies');
  const btnSaveConfig = document.getElementById('btn-save-cookie-config');

  const chkAnalytics = document.getElementById('cookie-analytics');
  const chkMarketing = document.getElementById('cookie-marketing');

  // Comprobar si el usuario ya tomó una decisión previa
  const cookieConsent = localStorage.getItem('s4p_cookie_consent');

  if (!cookieConsent) {
    // Si no hay registro previo, mostramos el banner
    banner.classList.add('show');
  }

  // 1. ACEPTAR TODAS
  btnAccept.addEventListener('click', () => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true
    });
  });

  // 2. RECHAZAR TODAS (Solo quedan activas las necesarias)
  btnReject.addEventListener('click', () => {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false
    });
  });

  // 3. ABRIR MODAL DE CONFIGURACIÓN
  btnConfig.addEventListener('click', () => {
    modal.classList.add('show');
  });

  // 4. GUARDAR CONFIGURACIÓN PERSONALIZADA
  btnSaveConfig.addEventListener('click', () => {
    saveConsent({
      essential: true,
      analytics: chkAnalytics.checked,
      marketing: chkMarketing.checked
    });
    modal.classList.remove('show');
  });

  // Función interna para guardar preferencias en localStorage
  function saveConsent(preferences) {
    localStorage.setItem('s4p_cookie_consent', JSON.stringify(preferences));
    banner.classList.remove('show');
  }
});