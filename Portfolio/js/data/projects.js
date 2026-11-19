/**
 * Données des projets — modifie ce fichier pour ajouter / éditer un projet.
 * Les descriptions sont des exemples : adapte-les à tes vrais projets.
 *
 * categories : clés de CATEGORIES (un projet peut en avoir plusieurs)
 * image      : chemin vers l'illustration de couverture
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
    image: 'Portfolio/tria28.png',
    colors: ['#7c3aed', '#06b6d4'],
    links: { code: 'https://triathlonacademy28.fr', demo: '#' },
  },
  {
    title: 'AST Badminton',
    year: '2026',
    summary:
      "Association sportive de badminton, j'ai réalisé l'entiereté de leur site internet dans le cadre d'un stage",
    categories: ['DEV'],
    stack: ['Html', 'CSS', 'PHP'],
    image: 'Portfolio/astbad.png',
    colors: ['#2563eb', '#22d3ee'],
    links: { code: 'https://ast-bad.vercel.app', demo: '#' },
  },
  {
    title: 'Résonances',
    year: '2026',
    summary:
      "Site d'un festival de musique : programmation filtrable, billetterie, et analyse de la fréquentation des éditions passées.",
    categories: ['DESIGN'],
    stack: ['Vue.js', 'Python', 'Pandas'],
    image: 'Portfolio/resonances.png',
    colors: ['#a855f7', '#f472b6'],
    links: { code: 'https://github.com/ton-pseudo/resonances', demo: '#' },
  },
  {
    title: 'Culture & Co',
    year: '2025',
    summary:
      'Analyse exploratoire et dashboard décisionnel à partir de données de ventes : nettoyage, KPI et visualisations interactives.',
    categories: ['DESIGN'],
    stack: ['Python', 'SQL', 'Power BI'],
    image: 'Portfolio/culture.png',
    colors: ['#059669', '#22d3ee'],
    links: { code: 'https://github.com/ton-pseudo/insight-lab', demo: null },
  },
  {
    title: 'Bloom & Co',
    year: '2026',
    summary:
      'Portfolio immersif en JavaScript natif : fond en canvas, curseur custom, cards en tilt 3D et filtres animés (technique FLIP).',
    categories: ['DESIGN'],
    stack: ['HTML', 'CSS moderne', 'JS (ES modules)', 'Canvas'],
    image: 'Portfolio/bloom.png',
    colors: ['#8b5cf6', '#22d3ee'],
    links: { code: 'https://github.com/ton-pseudo/portfolio', demo: null },
  },
];
