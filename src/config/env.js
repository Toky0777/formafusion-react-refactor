/**
 * Source unique de la configuration d'environnement.
 *
 * Projet Create React App : seules les variables préfixées REACT_APP_ sont
 * exposées au navigateur. N'utilisez PAS `import.meta.env.VITE_*` ni
 * `process.env.VITE_*` (réservés à Vite : valeur `undefined` ici).
 *
 * Toutes les URLs d'API / de médias doivent passer par ces constantes
 * (plus aucune URL `localhost` en dur dans le code).
 */

const trimSlash = (value = "") => String(value).replace(/\/+$/, "");

/** API Laravel, ex. https://api.exemple.io/api */
export const API_URL = trimSlash(process.env.REACT_APP_API_URL);

/** Origine du back (sans /api) : sanctum/csrf-cookie, storage, ... */
export const API_ORIGIN = API_URL.replace(/\/api$/, "");

/** Fichiers publics servis par Laravel (storage:link) */
export const STORAGE_URL = `${API_ORIGIN}/storage`;

/** CDN des images (photos, logos, documents) */
export const IMAGE_URL = trimSlash(process.env.REACT_APP_URL_IMAGE);

/** Application « projet » (liens vers le détail d'un projet) */
export const PROJET_URL = trimSlash(process.env.REACT_APP_URL_Projet);

/** Dossier des captures d'écran de la documentation (finit par « / ») */
export const DOC_IMAGE_URL = process.env.REACT_APP_IMAGE_DOCUMENTATION;

/** Clé API des jours fériés */
export const HOLIDAYS_API_KEY = process.env.REACT_APP_API_KEY_FERIE;

/** Google Calendar */
export const GOOGLE_CONFIG = {
  DISCOVERY_DOC: process.env.REACT_APP_GOOGLE_DISCOVERY_DOC,
  SCOPES: process.env.REACT_APP_GOOGLE_SCOPES,
  CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  API_KEY: process.env.REACT_APP_GOOGLE_API_KEY,
};

if (process.env.NODE_ENV !== "production" && !API_URL) {
  // eslint-disable-next-line no-console
  console.error("[env] REACT_APP_API_URL est manquant dans le fichier .env");
}
