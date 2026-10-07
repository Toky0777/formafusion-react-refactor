import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPostLoginPath, resolveSpace } from "../config/roles";

const GuestRoute = ({ children }) => {
  const { token, user, userType, roleId, isLoading } = useAuth();
  const location = useLocation();

  // Loader pendant le fetch /user
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Déjà connecté et tente d'accéder à login/register : on l'envoie dans SON
  // espace (jamais celui d'un autre rôle). Sans espace dédié, on laisse la
  // page s'afficher pour qu'il puisse se connecter avec un autre compte.
  if (token && user && resolveSpace({ userType, roleId })) {
    const target = getPostLoginPath({
      userType,
      roleId,
      from: location.state?.from,
    });
    return <Navigate to={target} replace />;
  }

  return children;
};

export default GuestRoute;
