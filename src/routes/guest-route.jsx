import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const GuestRoute = ({ children }) => {
  const { token, userType, isLoading } = useAuth();
  const location = useLocation();

  // Loader pendant le fetch /user
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Si l’utilisateur est déjà connecté et tente d’accéder à login/register
  if (token && userType) {
    const routes = {
      superAdminCfp: "/cfp",
      adminCfp: "/cfp",
      superAdminEtp: "/etp",
      adminEtp: "/etp",
      formateur: "/formateur",
      particulier: "/particulier",
    };

    const defaultRoute = routes[userType] || "/";
    return <Navigate to={location.state?.from || defaultRoute} replace />;
  }

  return children;
};

export default GuestRoute;
