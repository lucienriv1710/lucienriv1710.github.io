# Portfolio — Développeur Web & Data

HTML + CSS moderne (nesting natif, `@layer`) + JavaScript ES modules. Aucune dépendance, aucun build.

## Lancer en local
Les ES modules exigent un serveur (pas d'ouverture directe en `file://`) :
```bash
npx serve .          # ou : python3 -m http.server 8000
```
Avec VS Code : extension **Live Server** → clic droit sur `index.html` → *Open with Live Server*.

## À personnaliser
| Quoi | Où |
|---|---|
| Nom, initiales, liens de contact | `index.html` |
| Projets (texte, stack, liens et captures) | `js/data/projects.js` |
| Catégories de filtres | `CATEGORIES` dans `js/data/projects.js` |
| Aperçu du CV | remplacer `CV-Lucien-Riviere.jpeg` (garder le nom) |
| CV à télécharger | remplacer `assets/cv/CV.pdf` (garder le nom) |
| Formulaire de contact | `js/config.js` |
| Couleurs, polices, rayons | `css/base/_tokens.css` |

## Formulaire de contact → lucienriv1710@gmail.com
- **Par défaut (sans rien faire)** : envoi via FormSubmit. Au premier message, un e-mail d'activation arrive sur lucienriv1710@gmail.com → cliquer sur le lien. Ensuite tout fonctionne.
- **Formspree (recommandé)** : créer un compte sur formspree.io avec lucienriv1710@gmail.com, créer un formulaire, puis coller son identifiant dans `formspreeId` (`js/config.js`).

## Structure
```
index.html
css/
  main.css                 → point d'entrée (@import + @layer)
  base/        tokens, reset, typographie
  layout/      container, nav, footer
  components/  fond animé, curseur, boutons, card projet, filtres, formulaire
  sections/    hero, bandeau, projets, cv, contact
  utilities/   animations + prefers-reduced-motion
js/
  main.js                  → initialise tous les modules
  config.js                → réglages du formulaire
  utils.js
  data/        projects.js, icons.js
  modules/     background, cursor (+ magnétique), tilt, projects (filtres FLIP), contact, ui
assets/cv/CV.pdf
tria28.png, astbad.png,
resonances.png, culture.png,
bloom.png                     → captures des projets
```

## Accessibilité & perfs
- Curseur custom et tilt désactivés sur écran tactile ; animations réduites si `prefers-reduced-motion`.
- Canvas mis en pause quand l'onglet est masqué, densité de particules plafonnée.
- Navigation clavier, `aria-pressed` sur les filtres, annonces `aria-live`, contenu visible sans JS (hors projets).
