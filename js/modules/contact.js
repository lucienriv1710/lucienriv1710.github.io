import { $ } from '../utils.js';
import { CONTACT, getContactEndpoint } from '../config.js';

const RULES = {
  nom: { min: 2, message: 'Merci d’indiquer votre nom.' },
  prenom: { min: 2, message: 'Merci d’indiquer votre prénom.' },
  email: { email: true, message: 'Merci d’indiquer une adresse e-mail valide.' },
  message: { min: 10, message: 'Votre message doit contenir au moins 10 caractères.' },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Formulaire de contact : validation côté client + envoi AJAX
 * vers Formspree ou FormSubmit (voir js/config.js).
 */
export function initContact() {
  const form = $('[data-contact-form]');
  if (!form) return;

  const status = $('[data-form-status]', form);
  const submit = $('.form__submit', form);
  const submitText = $('.form__submit-text', submit);

  // Validation à la volée une fois qu'un champ a été touché
  form.addEventListener('input', (e) => {
    if (e.target.getAttribute('aria-invalid') === 'true') validateField(e.target);
  });
  form.addEventListener('focusout', (e) => {
    if (e.target.name in RULES && e.target.value) validateField(e.target);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields = Object.keys(RULES).map((name) => form.elements[name]);
    const invalid = fields.filter((f) => !validateField(f));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    // Honeypot rempli = robot : on simule un succès sans rien envoyer
    if (form.elements.website.value) {
      showStatus('success', 'Merci, votre message a bien été envoyé !');
      form.reset();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    delete data.website;
    const payload = {
      ...data,
      _subject: `${CONTACT.subject} — ${data.prenom} ${data.nom}`,
      _replyto: data.email,
      _template: 'table', // FormSubmit : mise en forme de l'e-mail
      _captcha: 'false',  // FormSubmit : pas de captcha (envoi AJAX)
    };

    setLoading(true);
    try {
      const res = await fetch(getContactEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === 'false' || json.success === false) {
        throw new Error(json.message || `Erreur ${res.status}`);
      }

      showStatus('success', `Merci ${data.prenom}, votre message a bien été envoyé ! Je vous réponds rapidement.`);
      form.reset();
    } catch (err) {
      console.error('[contact]', err);
      const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(CONTACT.subject)}&body=${encodeURIComponent(data.message)}`;
      showStatus(
        'error',
        `Oups, l’envoi a échoué. Vous pouvez m’écrire directement à <a href="${mailto}">${CONTACT.email}</a>.`,
      );
    } finally {
      setLoading(false);
    }
  });

  function validateField(field) {
    const rule = RULES[field.name];
    const value = field.value.trim();
    const error = $(`#${field.id}-error`, form);

    let ok = value.length > 0;
    if (ok && rule.min) ok = value.length >= rule.min;
    if (ok && rule.email) ok = EMAIL_RE.test(value);

    field.setAttribute('aria-invalid', String(!ok));
    if (ok) {
      field.removeAttribute('aria-describedby');
      error.textContent = '';
    } else {
      field.setAttribute('aria-describedby', error.id);
      error.textContent = rule.message;
    }
    return ok;
  }

  function setLoading(isLoading) {
    submit.disabled = isLoading;
    submit.classList.toggle('is-loading', isLoading);
    submitText.textContent = isLoading ? 'Envoi en cours' : 'Envoyer le message';
  }

  function showStatus(type, html) {
    status.className = `form__status is-${type}`;
    status.innerHTML = html;
  }
}
