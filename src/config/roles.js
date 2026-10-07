/**
 * Rôles, types d'utilisateur et espaces (arbres de routes) de l'application.
 *
 * Source unique de vérité : connexion, gardes de routes, redirections et
 * boutons « Aller au tableau de bord » passent tous par ce fichier.
 *
 * Correspondance avec le back (table `roles` + RoleService::getUserType) :
 *
 *   role_id | rôle back          | user_type renvoyé      | espace front
 *   --------+--------------------+------------------------+--------------
 *      3    | Cfp                | superAdminCfp          | /cfp
 *      8    | EmployeCfp         | adminCfp               | /cfp
 *      6    | Referent (client)  | superAdminEtp          | /etp
 *      9    | EmployeEtp         | adminEtp               | /etp
 *      5    | Formateur          | formateur              | /formateur
 *      4    | Employe (apprenant)| particulier            | /particulier
 *     10    | Particulier        | particulier            | /particulier
 *      1,2,7 (SuperAdmin, Admin, Formateur interne) : pas d'espace dans le SPA
 */

export const ROLE_IDS = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  CFP: 3,
  APPRENANT: 4,
  FORMATEUR: 5,
  REFERENT_ETP: 6,
  FORMATEUR_INTERNE: 7,
  CFP_ADMIN: 8,
  ETP_ADMIN: 9,
  PARTICULIER: 10,
};

export const USER_TYPES = {
  SUPER_ADMIN_CFP: "superAdminCfp",
  ADMIN_CFP: "adminCfp",
  SUPER_ADMIN_ETP: "superAdminEtp",
  ADMIN_ETP: "adminEtp",
  FORMATEUR: "formateur",
  PARTICULIER: "particulier",
};

/** Un « espace » = un arbre de routes du front (/cfp, /etp, ...). */
export const SPACES = {
  cfp: {
    key: "cfp",
    path: "/cfp",
    label: "Centre de formation",
    userTypes: [USER_TYPES.SUPER_ADMIN_CFP, USER_TYPES.ADMIN_CFP],
    roleIds: [ROLE_IDS.CFP, ROLE_IDS.CFP_ADMIN],
  },
  etp: {
    key: "etp",
    path: "/etp",
    label: "Entreprise",
    userTypes: [USER_TYPES.SUPER_ADMIN_ETP, USER_TYPES.ADMIN_ETP],
    roleIds: [ROLE_IDS.REFERENT_ETP, ROLE_IDS.ETP_ADMIN],
  },
  formateur: {
    key: "formateur",
    path: "/formateur",
    label: "Formateur",
    userTypes: [USER_TYPES.FORMATEUR],
    roleIds: [ROLE_IDS.FORMATEUR],
  },
  particulier: {
    key: "particulier",
    path: "/particulier",
    label: "Apprenant / Particulier",
    userTypes: [USER_TYPES.PARTICULIER],
    roleIds: [ROLE_IDS.APPRENANT, ROLE_IDS.PARTICULIER],
  },
};

const SPACE_LIST = Object.values(SPACES);

/** Libellés lisibles des user_type renvoyés par le back. */
const USER_TYPE_LABELS = {
  [USER_TYPES.SUPER_ADMIN_CFP]: "Centre de formation (administrateur principal)",
  [USER_TYPES.ADMIN_CFP]: "Centre de formation (administrateur)",
  [USER_TYPES.SUPER_ADMIN_ETP]: "Entreprise (référent principal)",
  [USER_TYPES.ADMIN_ETP]: "Entreprise (administrateur)",
  [USER_TYPES.FORMATEUR]: "Formateur",
  [USER_TYPES.PARTICULIER]: "Apprenant / Particulier",
};

export const getUserTypeLabel = (userType) =>
  USER_TYPE_LABELS[userType] || "Utilisateur";

/** Libellé d'une liste de user_type (ex. pour « réservé aux … »). */
export const getUserTypesLabel = (userTypes = []) => {
  const labels = [...new Set(userTypes.map(getUserTypeLabel))];
  return labels.join(" ou ");
};

/**
 * Retrouve l'espace de l'utilisateur à partir de son user_type et/ou de son
 * role_id. Le role_id est prioritaire pour les cas où user_type est ambigu ou
 * absent (le back renvoie null pour certains rôles).
 * @returns {object|null} un élément de SPACES, ou null si aucun espace.
 */
export const resolveSpace = ({ userType, roleId } = {}) => {
  const id = roleId === null || roleId === undefined ? NaN : Number(roleId);
  if (!Number.isNaN(id)) {
    const byRole = SPACE_LIST.find((s) => s.roleIds.includes(id));
    if (byRole) return byRole;
  }
  return SPACE_LIST.find((s) => s.userTypes.includes(userType)) || null;
};

/** URL du tableau de bord de l'utilisateur ("/" si aucun espace). */
export const getHomePath = (auth) => resolveSpace(auth)?.path || "/";

/** `pathname` est-il à l'intérieur de l'espace donné ? */
export const isInsideSpace = (pathname, space) =>
  !!space &&
  typeof pathname === "string" &&
  (pathname === space.path || pathname.startsWith(`${space.path}/`));

/**
 * Où envoyer l'utilisateur après connexion ?
 * - la page demandée avant la connexion (`from`) si elle appartient à SON espace ;
 * - sinon le tableau de bord de son espace (jamais l'espace d'un autre rôle).
 */
export const getPostLoginPath = ({ userType, roleId, from } = {}) => {
  const space = resolveSpace({ userType, roleId });
  if (!space) return "/";
  const fromPath = typeof from === "string" ? from : from?.pathname;
  return isInsideSpace(fromPath, space) ? fromPath : space.path;
};
