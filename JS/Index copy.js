const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = 'logo2500x2600.png'; // Ruta de tu imagen

let particles = [];
const particleGap = 6; // Tamaño/distancia de partículas
let exploded = true;   // Empieza desarmada

img.onload = () => {
  // Ajustar el tamaño del canvas proporcionalmente
  const scale = Math.min(window.innerWidth * 1.2 / img.width, window.innerHeight * 0.9 / img.height);
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  // Dibujar imagen temporalmente para extraer píxeles
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Crear partículas
  for (let y = 0; y < canvas.height; y += particleGap) {
    for (let x = 0; x < canvas.width; x += particleGap) {
      const index = (y * canvas.width + x) * 4;
      const alpha = imgData.data[index + 3];

      if (alpha > 128) {
        const red = imgData.data[index];
        const green = imgData.data[index + 1];
        const blue = imgData.data[index + 2];

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.5) * 12,
          size: particleGap - 1,
          color: `rgb(${red},${green},${blue})`
        });
      }
    }
  }

  // Iniciar el bucle de renderizado en pantalla
  animate();

  // Iniciar la secuencia de animación por fases
  setTimeout(toggleExplode, 500);
};

function toggleExplode() {
  if (exploded) {
    // FASE 1: LE TOCA ARMARSE
    exploded = false;

    // Tardan ~1.2s en juntarse + 3.3s de imagen completa estática = 4500 ms
    setTimeout(() => {
      toggleExplode();
    }, 6500); 

  } else {
    // FASE 2: LE TOCA DESARMARSE / EXPLOTAR
    exploded = true;
    
    // Asigna dirección aleatoria para la explosión
    particles.forEach(p => {
      p.vx = (Math.random() - 0.5) * 18;
      p.vy = (Math.random() - 0.5) * 18;
    });

    // Tiempo que duran las partículas volando dispersas antes de comenzar a armarse (2.5 segundos)
    setTimeout(() => {
      toggleExplode();
    }, 2500);
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    if (!exploded) {
      // Reconstruye la imagen atrayendo las partículas a su origen
      const dx = p.originX - p.x;
      const dy = p.originY - p.y;
      p.x += dx * 0.08;
      p.y += dy * 0.08;
    } else {
      // Dispersa las partículas
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95; // Fricción suave
      p.vy *= 0.95;
    }

    // Dibujar la partícula
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });

  requestAnimationFrame(animate);
}