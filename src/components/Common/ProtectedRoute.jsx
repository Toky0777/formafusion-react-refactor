import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import UnauthorizedAccess from "./UnauthorizedAccess";

const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
  </div>
);

const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const { user, userType, isLoading, token, isLoggingOut } = useAuth();
  const location = useLocation();

  // 1. Chargement global (token présent mais utilisateur pas encore chargé).
  //    NB : on ne teste plus `userType === null` : le back renvoie null pour
  //    certains rôles, ce qui bloquait le loader indéfiniment.
  if (isLoading || isLoggingOut || (token && !user)) {
    return <LoadingScreen />;
  }

  // 2. Pas connecté → redirection vers Login
  if (!token) {
    const redirectPath = location.pathname + location.search;
    return <Navigate to="/login" state={{ from: redirectPath }} replace />;
  }

  // 3. Pas de restriction (route ouverte aux connectés)
  if (allowedUserTypes.length === 0) {
    return children;
  }

  // 4. Vérifier les permissions
  const isAllowed = allowedUserTypes.includes(userType);

  if (!isAllowed) {
    return (
      <UnauthorizedAccess
        allowedUserTypes={allowedUserTypes}
        currentPath={location.pathname}
      />
    );
  }

  // 5. OK 👍
  return children;
};

export default ProtectedRoute;
