/**
 * Point d'entrée JavaScript (ES modules, aucune dépendance).
 * Chaque fonctionnalité vit dans son propre module.
 */
import { $$ } from './utils.js';
import { initBackground } from './modules/background.js';
import { initCursor, initMagnetic } from './modules/cursor.js';
import { initTilt } from './modules/tilt.js';
import { initProjects } from './modules/projects.js';
import { initContact } from './modules/contact.js';
import { initNav, initReveal, initTypewriter, initYear } from './modules/ui.js';

initBackground();
initCursor();
initNav();
initProjects();          // doit précéder initMagnetic / initReveal (génère du DOM)
initTilt($$('[data-tilt]'));
initMagnetic();
initReveal();
initTypewriter();
initContact();
initYear();
