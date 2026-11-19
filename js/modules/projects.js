import { $, prefersReducedMotion, EASE_OUT } from '../utils.js';
import { PROJECTS, CATEGORIES } from '../data/projects.js';
import { ICONS } from '../data/icons.js';
import { initTilt } from './tilt.js';

/**
 * Rendu des cards projets + filtres par catégorie.
 * Les transitions de filtrage utilisent la technique FLIP
 * (First, Last, Invert, Play) avec la Web Animations API.
 */
export function initProjects() {
  const grid = $('[data-projects-grid]');
  const filtersEl = $('[data-filters]');
  const status = $('[data-filter-status]');
  if (!grid || !filtersEl) return;

  const indicator = $('.filters__indicator', filtersEl);
  const reduce = prefersReducedMotion();

  let current = 'all';
  let busy = false;
  let pending = null;

  /* ---------- Rendu ---------- */
  grid.innerHTML = PROJECTS.map(cardTemplate).join('');
  filtersEl.insertAdjacentHTML('beforeend', filtersTemplate());

  const cards = [...grid.children];
  const buttons = [...filtersEl.querySelectorAll('.filter')];

  initTilt(cards);
  moveIndicator(false);

  /* ---------- Événements ---------- */
  filtersEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn || btn.dataset.filter === current) return;
    setFilter(btn.dataset.filter);
  });

  window.addEventListener('resize', () => moveIndicator(false));
  // Les polices peuvent changer la largeur des boutons après chargement
  document.fonts?.ready.then(() => moveIndicator(false));

  /* ---------- Logique de filtre ---------- */
  function setFilter(category) {
    if (busy) {
      pending = category;
      return;
    }
    current = category;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === category)));
    moveIndicator(true);
    applyFilter(category).then(() => {
      if (pending && pending !== current) {
        const next = pending;
        pending = null;
        setFilter(next);
      } else {
        pending = null;
      }
    });
  }

  const matches = (card, category) =>
    category === 'all' || card.dataset.categories.split(' ').includes(category);

  async function applyFilter(category) {
    busy = true;
    const toHide = cards.filter((c) => !c.hidden && !matches(c, category));
    const toShow = cards.filter((c) => c.hidden && matches(c, category));
    const staying = cards.filter((c) => !c.hidden && matches(c, category));

    // 1. Disparition des cards exclues
    if (!reduce && toHide.length) {
      await Promise.all(
        toHide.map((c) =>
          c.animate(
            [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.92)' }],
            { duration: 220, easing: 'ease-in', fill: 'forwards' },
          ).finished,
        ),
      );
    }

    // 2. FIRST : position des cards qui restent
    const first = new Map(staying.map((c) => [c, c.getBoundingClientRect()]));

    // 3. Mise à jour du DOM
    toHide.forEach((c) => {
      c.hidden = true;
      c.getAnimations().forEach((a) => a.cancel());
    });
    toShow.forEach((c) => (c.hidden = false));

    const visibleCount = cards.filter((c) => !c.hidden).length;
    status.textContent = `${visibleCount} projet${visibleCount > 1 ? 's' : ''} affiché${visibleCount > 1 ? 's' : ''}`;

    if (reduce) {
      busy = false;
      return;
    }

    // 4. LAST + INVERT + PLAY : les cards restantes glissent vers leur nouvelle place
    const moves = staying.map((c) => {
      const f = first.get(c);
      const l = c.getBoundingClientRect();
      const dx = f.left - l.left;
      const dy = f.top - l.top;
      if (!dx && !dy) return null;
      return c.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
        { duration: 600, easing: EASE_OUT },
      ).finished;
    });

    // 5. Apparition des nouvelles cards en cascade
    const appears = toShow.map(
      (c, i) =>
        c.animate(
          [
            { opacity: 0, transform: 'translateY(24px) scale(0.95)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 550, delay: 80 + i * 70, easing: EASE_OUT, fill: 'backwards' },
        ).finished,
    );

    await Promise.all([...moves, ...appears].filter(Boolean));
    busy = false;
  }

  /* ---------- Indicateur glissant ---------- */
  function moveIndicator(animate) {
    const active = buttons.find((b) => b.dataset.filter === current);
    if (!active || !indicator) return;
    if (!animate) indicator.style.transition = 'none';
    indicator.style.width = `${active.offsetWidth}px`;
    indicator.style.height = `${active.offsetHeight}px`;
    indicator.style.translate = `${active.offsetLeft}px ${active.offsetTop}px`;
    if (!animate) {
      indicator.offsetWidth; // force le reflow
      indicator.style.transition = '';
    }
  }
}

/* ---------- Templates ---------- */
function filtersTemplate() {
  return Object.entries(CATEGORIES)
    .map(([key, label]) => {
      const count =
        key === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.categories.includes(key)).length;
      if (!count) return '';
      return `
        <button class="filter" type="button" data-filter="${key}" aria-pressed="${key === 'all'}">
          ${label}<span class="filter__count">${count}</span>
        </button>`;
    })
    .join('');
}

function cardTemplate(project, index) {
  const { title, year, summary, categories, stack, image, colors, links = {} } = project;
  const num = String(index + 1).padStart(2, '0');

  const tags = categories.map((c) => `<li>${CATEGORIES[c] ?? c}</li>`).join('');
  const techs = stack.map((t) => `<li>${t}</li>`).join('');

  const linkItems = [
    links.code && `<a class="project-card__link" href="${links.code}" target="_blank" rel="noopener">Code source ${ICONS.arrow}</a>`,
    links.demo && `<a class="project-card__link" href="${links.demo}" target="_blank" rel="noopener">Voir le projet ${ICONS.arrow}</a>`,
  ].filter(Boolean).join('');

  return `
    <article class="project-card" data-categories="${categories.join(' ')}" data-tilt data-tilt-max="7" data-cursor-label="Voir">
      <div class="project-card__inner" data-tilt-inner style="--c1: ${colors[0]}; --c2: ${colors[1]};">
        <div class="project-card__visual">
          <img class="project-card__cover" src="${image}" alt="Capture d’écran du projet ${title}" loading="lazy">
          <span class="project-card__index">${num}</span>
          <span class="project-card__year">${year}</span>
        </div>
        <div class="project-card__body">
          <ul class="project-card__tags" aria-label="Catégories">${tags}</ul>
          <h3 class="project-card__title">${title}</h3>
          <p class="project-card__desc">${summary}</p>
          <ul class="project-card__stack" aria-label="Technologies">${techs}</ul>
          ${linkItems ? `<div class="project-card__links">${linkItems}</div>` : ''}
        </div>
        <div class="project-card__glare" aria-hidden="true"></div>
      </div>
    </article>`;
}
