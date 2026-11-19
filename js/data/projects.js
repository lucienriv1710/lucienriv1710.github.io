/**
 * Données des projets — modifie ce fichier pour ajouter / éditer un projet.
 * categories : clés de CATEGORIES (un projet peut en avoir plusieurs)
 * image      : chemin vers la capture de couverture
 * colors     : deux couleurs pour les effets visuels de la card
 * links      : mets null pour masquer un lien
 */

export const CATEGORIES = {
  all: 'Tous',
  DEV: 'DEV',
  DESIGN: 'DESIGN',
};

export const PROJECTS = [
  {
    title: 'Triathlon Academy 28',
    year: '2026',
    summary:
      "Association sportive de Triathlon, j'ai réalisé l'entiereté de leur site internet, de la première ligne de code jusqu'a la mise en ligne sur l'hébergeur, dans le cadre d'un stage",
    categories: ['DEV'],
    stack: ['HTML', 'CSS', 'PHP'],
    image: './tria28.png',
    colors: ['#7c3aed', '#06b6d4'],
    links: { code: null, demo: 'https://triathlonacademy28.fr' },
  },
  {
    title: 'AST Badminton',
    year: '2026',
    summary:
      "Association sportive de badminton, j'ai réalisé l'entiereté de leur site internet dans le cadre d'un stage",
    categories: ['DEV'],
    stack: ['Html', 'CSS', 'PHP'],
    image: './astbad.png',
    colors: ['#2563eb', '#22d3ee'],
    links: {
      code: 'https://github.com/lucienriv1710/AST-BAD',
      demo: 'https://ast-bad.vercel.app',
    },
  },
  {
    title: 'Résonances',
    year: '2026',
    summary:
      "Site d'un festival de musique : programmation filtrable, billetterie, et analyse de la fréquentation des éditions passées.",
    categories: ['DESIGN'],
    stack: ['Vue.js', 'Python', 'Pandas'],
    image: './resonances.png',
    colors: ['#a855f7', '#f472b6'],
    links: {
      code: 'https://github.com/lucienriv1710/Resonance',
      demo: 'https://resonance-seven-pi.vercel.app',
    },
  },
  {
    title: 'Culture & Co',
    year: '2025',
    summary:
      'Analyse exploratoire et dashboard décisionnel à partir de données de ventes : nettoyage, KPI et visualisations interactives.',
    categories: ['DESIGN'],
    stack: ['Python', 'SQL', 'Power BI'],
    image: './culture.png',
    colors: ['#059669', '#22d3ee'],
    links: { code: null, demo: null },
  },
  {
    title: 'Bloom & Co',
    year: '2026',
    summary:
      'Portfolio immersif en JavaScript natif : fond en canvas, curseur custom, cards en tilt 3D et filtres animés (technique FLIP).',
    categories: ['DESIGN'],
    stack: ['HTML', 'CSS moderne', 'JS (ES modules)', 'Canvas'],
    image: './bloom.png',
    colors: ['#8b5cf6', '#22d3ee'],
    links: { code: null, demo: null },
  },
];
