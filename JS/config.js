/**
 * Configuración del formulario de Contacto S4P.
 *
 * ADVERTENCIA DE SEGURIDAD:
 * Este token es fijo y viaja en el JavaScript del sitio, por lo que
 * CUALQUIER persona puede verlo abriendo las DevTools del navegador
 * (pestaña Network o "Ver código fuente"), sin importar que esté en
 * este archivo separado. Esto NO es una medida de seguridad real,
 * solo mantiene el archivo principal (contacto.js) más limpio.
 *
 * La protección real debe estar del lado de la API (CORS restringido
 * al dominio, rate limiting, y privilegios mínimos para este token).
 */
window.S4P_CONTACT_CONFIG = {
  API_ENDPOINT: "https://api20.s4p.cl:442/api/Contacto/CargaContacto", // <-- reemplazar por la URL real (siempre HTTPS)
  TOKEN: "YeJub+[k\"hH4!m\"RY*s]i?(I+Gv?:clMa@eQG9p|uPbfK{v[tAMq\"2617zx;Bph5.1u},sr=eL!:*WT31e8I@=srjRks02\"L6DQ@D46U;\"bWDS|2v;\\{43ByC.=kZ\/bBGS5U.[DgJoK\/KHGzFbxCB-M?4s(aIBY:HAx\\.E{\"W1KRzZ\"dcT\\9x|B9r-0[IvL:h}{YrJhhGLv#-+vu.]e\"52K{*b47zk0Cw4\"T\/w85R(zFR[8u-kX(*ILz{s[vdKqsWLi" // <-- reemplazar por el token fijo real
};
