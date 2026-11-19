import { $, prefersReducedMotion } from '../utils.js';

/**
 * Fond animé : constellation de particules sur <canvas>.
 * - les particules dérivent lentement et se relient entre elles
 * - elles s'écartent du pointeur et s'y relient par des fils lumineux
 * - les blobs de couleur (CSS) suivent légèrement la souris (parallaxe)
 */
export function initBackground() {
  const canvas = $('#bg-canvas');
  const blobs = $('.bg__blobs');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const reduce = prefersReducedMotion();
  const COLORS = ['139, 92, 246', '34, 211, 238', '244, 114, 182'];
  const LINK_DIST = 120;
  const MOUSE_DIST = 170;

  let width = 0;
  let height = 0;
  let particles = [];
  let rafId = null;
  const mouse = { x: -9999, y: -9999 };

  const createParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r: Math.random() * 1.5 + 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  });

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Densité proportionnelle à la surface, plafonnée pour les performances
    const count = Math.round(Math.min(95, (width * height) / 15000));
    particles = Array.from({ length: count }, createParticle);
    if (reduce) draw(false);
  }

  function draw(animate = true) {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (animate) {
        p.x += p.vx;
        p.y += p.vy;

        // Répulsion douce autour du pointeur
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_DIST && dist > 0) {
          const force = (1 - dist / MOUSE_DIST) * 0.9;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Rebouclage sur les bords
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }

      // Liens entre particules proches
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < LINK_DIST) {
          ctx.strokeStyle = `rgba(${p.color}, ${(1 - d / LINK_DIST) * 0.16})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      // Liens vers le pointeur
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < MOUSE_DIST) {
        ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - dm / MOUSE_DIST) * 0.35})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }

      ctx.fillStyle = `rgba(${p.color}, 0.75)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    draw();
    rafId = requestAnimationFrame(loop);
  }

  const start = () => { if (!rafId && !reduce) loop(); };
  const stop = () => { cancelAnimationFrame(rafId); rafId = null; };

  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Parallaxe des blobs de couleur
    if (blobs && !reduce) {
      const px = (e.clientX / width - 0.5) * 60;
      const py = (e.clientY / height - 0.5) * 60;
      blobs.style.setProperty('--mx', `${px}px`);
      blobs.style.setProperty('--my', `${py}px`);
    }
  }, { passive: true });

  document.documentElement.addEventListener('pointerleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Recalcul (debounce) au redimensionnement
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  // Pause quand l'onglet n'est pas visible (économie de batterie)
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  resize();
  start();
}
