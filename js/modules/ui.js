import { $, $$, prefersReducedMotion } from '../utils.js';

/* =========================================================
   Petits modules d'interface : navigation, apparition au
   scroll, effet machine à écrire, année du footer.
   ========================================================= */

/** Navigation : fond au scroll, lien actif, menu mobile */
export function initNav() {
  const nav = $('[data-nav]');
  if (!nav) return;

  const toggle = $('.nav__toggle', nav);
  const menu = $('#nav-menu');
  const links = $$('.nav__link', nav);

  // Fond flouté dès qu'on quitte le haut de page
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  links.forEach((l) => l.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));

  // Lien actif selon la section visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) =>
          l.classList.toggle('is-active', l.getAttribute('href') === `#${entry.target.id}`),
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  $$('[data-section]').forEach((s) => observer.observe(s));
}

/** Apparition des éléments .reveal quand ils entrent dans l'écran */
export function initReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -12% 0px' },
  );
  items.forEach((el) => observer.observe(el));
}

/** Effet machine à écrire : <span data-typewriter='["phrase 1", "phrase 2"]'> */
export function initTypewriter() {
  const el = $('[data-typewriter]');
  if (!el) return;

  let words;
  try {
    words = JSON.parse(el.dataset.typewriter);
  } catch {
    return;
  }
  if (prefersReducedMotion()) {
    el.textContent = words[0];
    return;
  }

  let w = 0;
  let i = 0;
  let deleting = false;

  (function tick() {
    const word = words[w];
    i += deleting ? -1 : 1;
    el.textContent = word.slice(0, i);

    let delay = deleting ? 28 : 55 + Math.random() * 40;
    if (!deleting && i === word.length) {
      delay = 2200;
      deleting = true;
    } else if (deleting && i === 0) {
      deleting = false;
      w = (w + 1) % words.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  })();
}

export function initYear() {
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
}
