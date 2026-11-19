/** Icônes SVG (trait) utilisées dans les cards — viewBox 24x24 */
const svg = (paths) => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;

export const ICONS = {
  map: svg('<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>'),
  parking: svg('<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M9.5 17V7h3.5a3 3 0 0 1 0 6H9.5"/>'),
  flame: svg('<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.4-4 2.5-5 .3 2 1.3 3 2.5 3 0-3-1-5.5 0-8Z"/>'),
  wave: svg('<path d="M3 12h1M7 8v8M11 4v16M15 8v8M19 10v4M22 12h-1"/>'),
  chart: svg('<path d="M3 20h18M6 16v-4M11 16V7M16 16v-6M21 4l-5 4-4-3-6 5"/>'),
  code: svg('<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>'),
  arrow: svg('<path d="M7 17 17 7M8 7h9v9"/>'),
};
