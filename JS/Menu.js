document.addEventListener('DOMContentLoaded', () => {
  // 1. Estructura HTML del menú
  const menuHTML = `
    <div class="burger-menu-container">
      <input type="checkbox" id="burger-toggle" class="burger-checkbox">
      
      <label for="burger-toggle" class="burger-icon" aria-label="Abrir menú">
        <span></span>
        <span></span>
        <span></span>
      </label>

      <nav class="burger-nav">
        <ul>
          <li><a href="index.html"><i class="fa-solid fa-house"></i> <span>Home</span></a></li>
          <li><a href="https://www.s4p.cl" target="_blank"><i class="fa-solid fa-file-lines"></i> <span>Informes</span></a></li>
          <li><a href="Contacto.html"><i class="fa-solid fa-user"></i> <span>Contacto</span></a></li>
          <li><a href="PoliticaPrivacidad.html"><i class="fa-solid fa-gear"></i> <span>Política de Privacidad</span></a></li>
        </ul>
      </nav>
    </div>
  `;

  // 2. Buscar el contenedor objetivo o insertarlo al inicio del body
  const menuPlaceholder = document.getElementById('menu-placeholder');
  
  if (menuPlaceholder) {
    menuPlaceholder.innerHTML = menuHTML;
  } else {
    document.body.insertAdjacentHTML('afterbegin', menuHTML);
  }

  // 3. Resaltar automáticamente la página activa en la que se encuentra el usuario
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const menuLinks = document.querySelectorAll('.burger-nav a');

  menuLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });
});