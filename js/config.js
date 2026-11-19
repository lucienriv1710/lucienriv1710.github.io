/**
 * Configuration centrale du portfolio.
 * C'est le seul fichier à modifier pour brancher le formulaire.
 */

export const CONTACT = {
  /** Adresse de réception des messages */
  email: 'lucienriv1710@gmail.com',

  /**
   * Service d'envoi : 'formspree' | 'formsubmit'
   *
   * ▸ 'formspree' (recommandé) :
   *    1. Crée un compte gratuit sur https://formspree.io avec lucienriv1710@gmail.com
   *    2. "New form" → copie l'identifiant (ex. https://formspree.io/f/xyzabcd → "xyzabcd")
   *    3. Colle-le dans `formspreeId` ci-dessous.
   *
   * ▸ 'formsubmit' (sans compte) :
   *    Fonctionne immédiatement. Au 1er envoi, FormSubmit envoie un e-mail
   *    d'activation à lucienriv1710@gmail.com : il suffit de cliquer sur le lien.
   */
  provider: 'formspree',
  formspreeId: 'TON_ID_FORMSPREE',

  /** Sujet de l'e-mail reçu */
  subject: 'Nouveau message depuis le portfolio',
};

/** Retourne l'URL d'envoi en fonction du service choisi */
export function getContactEndpoint() {
  const { provider, formspreeId, email } = CONTACT;

  // Si Formspree n'est pas encore configuré, on bascule sur FormSubmit
  if (provider === 'formspree' && formspreeId && !formspreeId.startsWith('TON_')) {
    return `https://formspree.io/f/${formspreeId}`;
  }
  return `https://formsubmit.co/ajax/${email}`;
}
