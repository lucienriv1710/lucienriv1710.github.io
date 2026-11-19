import { $, lerp, hasFinePointer, prefersReducedMotion } from '../utils.js';

const INTERACTIVE = 'a, button, [data-cursor-label], input, textarea, label';

/**
 * Curseur personnalisé : un point qui suit exactement la souris
 * et un cercle qui le rattrape avec inertie. Il change d'état
 * au survol des éléments interactifs (lien, card, champ texte).
 */
export function initCursor() {
  const root = $('.cursor');
  if (!root || !hasFinePointer()) return;

  const dot = $('.cursor__dot', root);
  const ring = $('.cursor__ring', root);
  const label = $('.cursor__label', root);

  document.body.classList.add('has-cursor');

  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { ...mouse };
  const smoothing = prefersReducedMotion() ? 1 : 0.18;
  let started = false;

  window.addEventListener(
    'pointermove',
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;

      if (!started) {
        started = true;
        ringPos.x = mouse.x;
        ringPos.y = mouse.y;
      }
      root.classList.remove('is-hidden');
    },
    { passive: true },
  );

  document.documentElement.addEventListener('pointerleave', () => root.classList.add('is-hidden'));
  window.addEventListener('pointerdown', () => root.classList.add('is-down'));
  window.addEventListener('pointerup', () => root.classList.remove('is-down'));

  // Changement d'état selon l'élément survolé (délégation d'événements)
  document.addEventListener('pointerover', (e) => setState(e.target.closest(INTERACTIVE)));

  function setState(el) {
    root.classList.remove('is-hover', 'is-label', 'is-text');
    if (!el) return;

    if (el.matches('input, textarea')) {
      root.classList.add('is-text');
    } else if (el.dataset.cursorLabel) {
      label.textContent = el.dataset.cursorLabel;
      root.classList.add('is-label');
    } else {
      root.classList.add('is-hover');
    }
  }

  // Boucle d'animation : le cercle suit le point avec inertie
  (function loop() {
    ringPos.x = lerp(ringPos.x, mouse.x, smoothing);
    ringPos.y = lerp(ringPos.y, mouse.y, smoothing);
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    requestAnimationFrame(loop);
  })();
}

/**
 * Effet "magnétique" : l'élément est attiré vers le pointeur.
 * Usage : ajouter l'attribut data-magnetic (optionnel : data-magnetic="0.4").
 */
export function initMagnetic(scope = document) {
  if (!hasFinePointer() || prefersReducedMotion()) return;

  scope.querySelectorAll('[data-magnetic]').forEach((el) => {
    if (el.dataset.magnetBound) return;
    el.dataset.magnetBound = 'true';
    const strength = parseFloat(el.dataset.magnetic) || 0.3;

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.classList.add('is-magnet');
      el.style.setProperty('--tx', `${x}px`);
      el.style.setProperty('--ty', `${y}px`);
    });

    el.addEventListener('pointerleave', () => {
      el.classList.remove('is-magnet');
      el.style.setProperty('--tx', '0px');
      el.style.setProperty('--ty', '0px');
    });
  });
}
