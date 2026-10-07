import { useAuth } from "../contexts/AuthContext";
import { resolveSpace } from "../config/roles";

/**
 * Lien « retour à mon espace » adapté à l'utilisateur courant.
 *  - connecté avec un espace  → son tableau de bord (/cfp, /etp, /formateur, /particulier)
 *  - connecté sans espace     → accueil
 *  - non connecté             → accueil public
 */
export default function useHomeLink() {
  const { token, user, userType, roleId } = useAuth();

  if (token && user) {
    const space = resolveSpace({ userType, roleId });
    if (space) return { to: space.path, label: "Aller au tableau de bord" };
    return { to: "/", label: "Retour à l'accueil" };
  }
  return { to: "/", label: "Retour à l'accueil" };
}
