# Audit front ↔ back (analyse statique)

Méthode : extraction AST de tous les appels `axios.*` / `callApi` / `fetch` du front, rapprochés des 1 369 routes de `routes/api.php` (chemin, méthode, middleware de rôle). **Aucune requête réelle n'a été exécutée** (pas de PHP/BDD) : un appel signalé est un appel dont aucune route compatible n'existe pour le rôle, pas une panne constatée. Les chemins dynamiques (variables) ne sont pas analysables.

## Rôles et accès API (middlewares du back)

| role_id | Profil | Middleware | Espace front |
|---|---|---|---|
| 3 | Cfp | isCfp / isEmployeCfp | /cfp |
| 8 | Sous-référent Cfp | isEmployeCfp | /cfp |
| 6 | Référent (client) | isReferent | /etp |
| 9 | Sous-référent entreprise | **aucun groupe dédié** (voir ci-dessous) | /etp |
| 5 | Formateur | isFormateur | /formateur |
| 4 | Employé (apprenant) | isEmploye | /particulier |
| 10 | Particulier | isEmpOrParticulier uniquement (19 routes) | /particulier |
| 7, 1, 2 | Formateur interne, SuperAdmin, Admin | aucun dans api.php | — |

## Points à traiter côté back (non modifié)

- `isReferent` n'accepte que le rôle 6 : les sous-référents entreprise (rôle 9) reçoivent un 403 sur toute l'API `/etp`.
- Aucun groupe de `api.php` pour `isParticulier` (rôle 10), `isFormateurInterne` (7) ni `isSuperAdmin` (1).
- Les routes `routes/cfps|entreprises|…/*.php` sont montées sans préfixe `/api` : inaccessibles au SPA.

## Appels interdits au rôle (403 probable) — 19

| Espace | Fichier:ligne | Appel |
|---|---|---|
| etp | `components/Modals/agenda/annuelModalEtp/EtpFormateurAjouter.jsx:43` | `GET /cfp/projets/{}/formateur` |
| etp | `components/Modals/agenda/annuelModalEtp/EtpFormateurAjouter.jsx:53` | `? /cfp/projets/{}/{}/form/assign` |
| etp | `components/Modals/learner/BatchUploadModal.jsx:22` | `GET /cfp/apprenants/entreprise` |
| etp | `components/Modals/learner/BatchUploadStep3Modal.jsx:70` | `POST /cfp/apprenants/excel` |
| etp | `components/Modals/learner/EditApprenant.jsx:219` | `POST /cfp/apprenants/{}/updatePhoto` |
| etp | `components/Modals/learner/entreprise-modal.jsx:23` | `GET /cfp/etp-drawers/apprenant/{}` |
| etp | `components/Modals/learner/learner-entreprise-modal.jsx:24` | `GET /cfp/etp-drawer/{}` |
| etp | `pages/Etp/bon_commande/BonCommandeTableEtp.jsx:246` | `GET /cfp/etp-drawer/{}` |
| etp | `pages/Etp/bon_commande/StatusDropdown.jsx:43` | `POST /cfp/bon-commande/{}/changeStatus/{}` |
| etp | `pages/Etp/projet/detail.jsx:274` | `POST /cfp/projets/{}/{}/{}/fraisprojet/assign` |
| etp | `pages/Etp/projet/detail.jsx:295` | `POST /cfp/projets/{}/update-taxe` |
| etp | `pages/Etp/projet/detail.jsx:322` | `POST /cfp/projets/update-frais` |
| etp | `pages/Etp/projet/detail.jsx:340` | `DELETE /cfp/projets/{}/{}/removeEtpFraisProjet` |
| etp | `pages/Etp/projet/detail.jsx:381` | `POST /cfp/projet/apprenants/{}/{}` |
| etp | `pages/Etp/projet/projetEtp.jsx:167` | `GET /cfp/dossier/document/projets/{}` |
| particular | `pages/Apprenants/Photo/folder-appr.jsx:21` | `GET /form/gallery/folder/{}` |
| particular, trainer | `pages/Apprenants/Projet/projet.jsx:202` | `GET /etp/projets/filter/item` |
| trainer | `pages/Formateur/attendance/index.jsx:45` | `GET /cfp/etp-drawer/{}` |
| trainer | `pages/Formateur/refresh/EditContentCard.jsx:207` | `GET /contents/content/{}/edit` |

## Appels vers une route inexistante (404 probable) — 38

| Espace | Fichier:ligne | Appel |
|---|---|---|
| cfp | `components/Modals/folder/DossierManagement.jsx:77` | `GET /cfp/dossier/projets/folder` |
| cfp | `pages/Cfp/Testing/qcm-edit-cfp.jsx:431` | `POST /qcm/question/{}/upload-image` |
| cfp | `pages/Cfp/Testing/qcm-edit-cfp.jsx:443` | `DELETE /qcm/question-image/{}/delete` |
| cfp | `pages/Cfp/Testing/qcm-edit-cfp.jsx:458` | `POST /qcm/question-image/{}/replace` |
| cfp | `pages/Cfp/Testing/section/search-category-cfp.jsx:31` | `GET /ct-reponses/search` |
| cfp | `pages/Cfp/Testing/section/search-category-cfp.jsx:58` | `POST /ct-reponses/create` |
| cfp | `pages/Cfp/agenda/formateurs/FormateurCalendar.jsx:504` | `PATCH /cfp/agendas/events_updateForm_agenda` |
| cfp | `pages/Cfp/invoice/Compte/Formulaire/new-mobile-money.jsx:32` | `POST /cfp/mobilemoneyAcount` |
| cfp | `pages/Cfp/invoice/Compte/type/liste-facturation.jsx:26` | `PUT /companies/{}` |
| cfp | `pages/Cfp/invoice/Compte/type/liste-facturation.jsx:47` | `DELETE /companies/{}` |
| cfp | `pages/Cfp/invoice/Compte/type/mobile-money.jsx:29` | `PUT /cfp/mobilemoneyAcount/update` |
| cfp | `pages/Cfp/invoice/Compte/type/mobile-money.jsx:50` | `DELETE /cfp/mobilemoneyAcount/{}` |
| cfp | `pages/Cfp/recovery/index.jsx:169` | `GET /recouvrement{}` |
| cfp | `pages/Cfp/recovery/index.jsx:170` | `GET /purchase_order{}` |
| cfp | `services/projectService.js:74` | `GET /cfp/projet/detail/{}` |
| cfp, etp | `contexts/cfp/SearchFolderContext.jsx:29` | `GET /search-global` |
| cfp, etp | `services/apiEvent.js:18` | `GET /marketplace{}` |
| cfp, etp | `services/centerService.js:18` | `GET /marketplace{}` |
| cfp, trainer | `contexts/Apprenants/TestProvider.jsx:36` | `GET /search` |
| etp | `components/Modals/agenda/annuelModalEtp/EtpFormateurAjouter.jsx:33` | `GET /etp/forms/` |
| etp | `components/Modals/agenda/annuelModalEtp/EtpParticipantAjouter.jsx:36` | `GET /etp/projet/inter/getEtpAdded/{}` |
| etp | `pages/Etp/bon_commande/hooks/useBonCommandeETP.js:122` | `GET /etp/bon_commande/getAllEtpDevis` |
| etp | `pages/Etp/bon_commande/hooks/useBonCommandeETP.js:123` | `GET /etp/bon_commande/getDevis/{}` |
| etp | `pages/Etp/bon_commande/hooks/useBonCommandeETP.js:143` | `GET /etp/bon_commande/getDevis/{}` |
| etp | `pages/Etp/bon_commande/hooks/useBonCommandeETP.js:195` | `PUT /etp/bon_commande/{}` |
| etp | `pages/Etp/bon_commande/hooks/useBonCommandeETP.js:236` | `GET /etp/bon_commande/getAllEtpDevis` |
| etp | `pages/Etp/bon_commande/hooks/useBonCommandeETP.js:237` | `GET /etp/bon_commande/getDevis/{}` |
| etp | `pages/Etp/bon_commande/hooks/useBonCommandeETP.js:243` | `GET /etp/bon_commande/getAllEtpDevis` |
| etp | `pages/Etp/bon_commande/hooks/useBonCommandeETP.js:255` | `DELETE /etp/bon_commande/{}` |
| etp | `pages/Etp/evaluationFroid/index.jsx:12` | `GET /etp/eval-froid` |
| etp | `pages/Etp/evaluationFroid/index.jsx:20` | `GET /etp/eval-froid/detail/{}` |
| etp | `pages/Etp/evaluationFroid/index.jsx:42` | `GET /etp/eval-froid/result/{}/{}` |
| trainer | `contexts/cfp/SearchContextEvaluation.jsx:35` | `GET /search` |
| trainer | `pages/Formateur/Testing/qcm-edit-formateur.jsx:431` | `POST /qcm/question/{}/upload-image` |
| trainer | `pages/Formateur/Testing/qcm-edit-formateur.jsx:443` | `DELETE /qcm/question-image/{}/delete` |
| trainer | `pages/Formateur/Testing/qcm-edit-formateur.jsx:458` | `POST /qcm/question-image/{}/replace` |
| trainer | `pages/Formateur/Testing/section/search-category-formateur.jsx:31` | `GET /ct-reponses/search` |
| trainer | `pages/Formateur/Testing/section/search-category-formateur.jsx:58` | `POST /ct-reponses/create` |

## Mauvaise méthode HTTP (405 probable) — 8

| Espace | Fichier:ligne | Appel |
|---|---|---|
| cfp | `pages/Cfp/attendance/emargement.jsx:81` | `GET /cfp/presence/delete` |
| cfp | `pages/Cfp/invoice/Compte/Formulaire/new-adresse-invoice.jsx:20` | `POST /companies` |
| cfp | `pages/Cfp/invoice/Modal/historyPayements.jsx:70` | `DELETE /payments/{}` |
| cfp | `pages/Cfp/photo/crud-image-cfp.jsx:337` | `DELETE /cfp/gallery/update/{}` |
| cfp, etp, particular | `services/profilService.js:44` | `GET /cfp/bankAccount/{}` |
| etp | `pages/Etp/bon_commande/hooks/useBonCommandeETP.js:197` | `POST /etp/bon_commande` |
| etp | `pages/Etp/projet/detail.jsx:252` | `DELETE /cfp/seances/{}` |
| trainer | `pages/Formateur/photo/crud-image-formateur.jsx:352` | `DELETE /form/gallery/update/{}` |
