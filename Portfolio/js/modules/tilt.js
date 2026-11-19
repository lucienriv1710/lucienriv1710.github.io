import { hasFinePointer, prefersReducedMotion } from '../utils.js';

/**
 * Inclinaison 3D au survol (tilt) + reflet qui suit le pointeur.
 *
 * Markup attendu :
 *   <div data-tilt data-tilt-max="8">            ← zone de détection
 *     <div data-tilt-inner> … </div>             ← élément qui s'incline
 *   </div>
 *
 * Variables CSS exposées sur l'élément interne :
 *   --rx / --ry : rotation (deg)       --gx / --gy : position du pointeur (%)
 *   --px / --py : position normalisée [-1, 1] (pour des effets de parallaxe)
 * La classe .is-tilting est ajoutée sur la zone pendant le survol.
 */
export function initTilt(elements) {
  if (!hasFinePointer() || prefersReducedMotion()) return;

  elements.forEach((el) => {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = 'true';

    const inner = el.querySelector('[data-tilt-inner]') || el;
    const max = parseFloat(el.dataset.tiltMax) || 8;
    let frame = null;
    let state = { x: 0.5, y: 0.5 };

    const render = () => {
      frame = null;
      const { x, y } = state;
      inner.style.setProperty('--rx', `${((0.5 - y) * max * 2).toFixed(2)}deg`);
      inner.style.setProperty('--ry', `${((x - 0.5) * max * 2).toFixed(2)}deg`);
      inner.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
      inner.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
      inner.style.setProperty('--px', ((x - 0.5) * 2).toFixed(3));
      inner.style.setProperty('--py', ((y - 0.5) * 2).toFixed(3));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    el.addEventListener('pointerenter', () => el.classList.add('is-tilting'));

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      state = {
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
      };
      schedule();
    });

    el.addEventListener('pointerleave', () => {
      el.classList.remove('is-tilting');
      state = { x: 0.5, y: 0.5 };
      schedule();
    });
  });
}
