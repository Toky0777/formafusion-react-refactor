# Refactoring FormaFusion React

Vérifié par `react-scripts build` (exit 0, ESLint actif) après chaque grande étape.
Bundle principal : **1,76 Mo → 515 Ko**. Fichiers source : 1 362 → ~1 010.

## Ce qui a changé

| Sujet | Avant | Après |
|---|---|---|
| Configuration | `process.env.REACT_APP_*` dispersé (~400 usages), `localhost:8000` / `127.0.0.1` en dur (~100), `import.meta.env.VITE_*` (inopérant sous CRA) | **`src/config/env.js`** = source unique (`API_URL`, `API_ORIGIN`, `STORAGE_URL`, `IMAGE_URL`, `PROJET_URL`, `DOC_IMAGE_URL`, `GOOGLE_CONFIG`…) |
| Code mort | ~300 fichiers non importés, 17 fichiers vides, `src/app` (reste Next.js) | déplacés dans **`_archive_code_mort/`** (même arborescence, récupérables) |
| Imports | 1 190 imports inutilisés, 2 imports cassés (build en échec) | supprimés / corrigés |
| Clés dupliquées | 5 objets (`icone.js`, `ModalContext`, `useReferent`) | doublons antérieurs retirés (comportement identique) |
| Routes | 310 pages importées d'emblée | `lazyPage()` (`src/routes/lazyPage.jsx`) : 1 `Suspense` par page |
| package.json | `date-fns`, `lodash.debounce`, `@radix-ui/react-slot` importés mais non déclarés | déclarés |

## Factorisations (base commune + wrappers minces, imports existants inchangés)

- `pages/shared/testing/*` : evaluation, bareme, details-results, 4 étapes de campagne. Cfp et Formateur ne diffèrent que par `basePath` (`/cfp/prequal` ↔ `/formateur/testing`).
- `pages/shared/bon_commande/*` : 5 fichiers Cfp/Etp identiques (re-export côté Etp).
- `components/project/ProjectListBase`, `hooks/useProjectStatusData`, `components/navbar/ProjectFilterNavbar`, drawer formateur, `ProjectSearchResults` (5 recherches), `components/content/ActiveFilters`.
- Doublons exacts fusionnés : `moduleLevel`, `domaines`, `Marketplace/Contact`.

## Volontairement NON fusionné (a divergé fonctionnellement)

16 paires Cfp/Formateur de `Testing` (UI/logique différentes), `refresh/*` (API et logique différentes, fichiers qui s'importent entre voisins), `CourseCard` (`course.theme` vs `course.module_image`).
Règle appliquée : une fusion n'est faite que si le texte est identique après substitution ET si les imports de voisins résolvent vers les mêmes fichiers.

## Reste à faire / à décider

- `vite.config.js` est inutilisé (le projet tourne sous `react-scripts`) et contient un chemin `F:/…` : à supprimer ou à migrer vraiment vers Vite.
- Dépendances déclarées mais jamais importées (à valider avant retrait) : `@emotion/*`, `@mui/material`, `@floating-ui/react-dom`, `@fortawesome/*` (3), `@radix-ui/react-dialog`, `geist`, `html-react-parser`, `i18next`, `jszip`, `lottie-react`, `quill`, `react-quill`, `react-country-flag`, `use-debounce`.
- ~730 avertissements `no-unused-vars` (variables locales) et ~226 `react-hooks/exhaustive-deps` : à traiter à la main.
- Fichiers au nom douteux (`ExportButtons .jsx`, `folder-formateur..jsx`, `Company..jsx`, dossiers avec accents/espaces).
- `.env` : non inclus dans cette archive (contient une clé API) ; voir `.env.example`.

## Rôles, redirections et navigation (itération 2)

- `src/config/roles.js` : correspondance `role_id` / `user_type` du back ↔ espaces front (`/cfp`, `/etp`, `/formateur`, `/particulier`). Utilisé par la connexion, les gardes et les boutons « tableau de bord ».
- Connexion : redirection vers l'espace du rôle ; la page demandée avant connexion n'est reprise que si elle appartient à cet espace.
- `/formateur` et `/particulier` sont désormais protégés (`ProtectedRoute`).
- `NotFound` / `UnauthorizedAccess` : le bouton « Aller au tableau de bord » mène à l'espace de l'utilisateur (hook `useHomeLink`) ; il pointait vers `/app/dashboard` (inexistant).
- `AuthContext` : `roleId` conservé ; un token expiré ne bloque plus sur un loader infini.
- Menus : liens cassés corrigés ; entrées sans route front **et** sans route back retirées (Etp : LMS, Factures, Évaluation Froid ; Particulier : Lieu & Salle ; top-menus Formateur/Particulier).
- Arbre `/formateur` : routes d'apprenant imbriquées par erreur sous `/formateur/agenda` supprimées.
- Fix : `ProjectCard is not defined` (régression de la factorisation de `ProjectListBase`).
- `AUDIT_API.md` : appels du front sans route back compatible pour le rôle (analyse statique, non exécutée).
