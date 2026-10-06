import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/ui/loading-spinner";
import { IMAGE_URL } from "../config/env";

const GuestLayout = () => {
  const { isLoading, userType, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const navigationLinks = [
    {
      to: "/formations",
      label: "Formations à venir",
      shortLabel: "Formations",
      description: "Découvrez nos prochaines sessions de formation",
    },
    {
      to: "/cours",
      label: "Cours disponibles",
      shortLabel: "Cours",
      description: "Parcourez notre catalogue de cours",
    },
    {
      to: "/centres",
      label: "Centres de formation",
      shortLabel: "Centres",
      description: "Trouvez un centre près de chez vous",
    },
  ];

  const redirectToEspace = (type) => {
    switch (type) {
      case "superAdminCfp":
      case "adminCfp":
        return "/cfp";
      case "superAdminEtp":
      case "adminEtp":
        return "/etp";
      case "formateur":
        return "/formateur";
      case "particulier":
        return "/particulier";
      default:
        return "/";
    }
  };

  useEffect(() => setIsMobileMenuOpen(false), [location]);
  useEffect(() => {
    const handleEscape = (e) =>
      e.key === "Escape" && setIsMobileMenuOpen(false);
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const imgUrl = IMAGE_URL + "/img/referents";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 shadow-sm bg-white/95 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo à gauche */}
            <Link
              to="/"
              className="flex items-center space-x-3 transition-all duration-300 group hover:scale-105"
            >
              <div className="relative">
                <img
                  className="w-8 h-6 rounded shadow-sm"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Madagascar.svg/800px-Flag_of_Madagascar.svg.png"
                  alt="Madagascar"
                />
              </div>
              <span className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text">
                FormaFusion
              </span>
            </Link>

            {/* Navigation centrée */}
            <nav className="hidden lg:flex space-x-6 justify-center flex-1">
              {navigationLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-purple-600 hover:bg-purple-50"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* User / Login à droite */}
            <div className="hidden lg:flex items-center space-x-4">
              {userType && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-purple-600 hover:bg-purple-50 focus:outline-none"
                  >
                    <img
                      src={
                        user.photo
                          ? imgUrl + "/" + user.photo
                          : "https://i.pravatar.cc/32"
                      }
                      alt="Avatar"
                      className="w-8 h-8 rounded-full border border-gray-300"
                    />
                    <span>{user.name || "Utilisateur"}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 w-48 mt-2 bg-white border rounded-md shadow-lg z-50">
                      <Link
                        to={redirectToEspace(userType)}
                        className="block px-4 py-2 text-gray-700 hover:bg-purple-50"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Votre espace
                      </Link>
                      <button
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50"
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Se connecter
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative p-2 text-gray-400 transition-all duration-300 rounded-lg lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white shadow-md border-t border-gray-200">
            <nav className="flex flex-col space-y-1 p-4">
              {navigationLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="px-4 py-2 rounded hover:bg-purple-50"
                >
                  {label}
                </Link>
              ))}

              {userType && user ? (
                <>
                  <Link
                    to={redirectToEspace(userType)}
                    className="px-4 py-2 rounded hover:bg-purple-50"
                  >
                    Votre espace
                  </Link>
                  <button
                    className="px-4 py-2 text-left w-full rounded hover:bg-purple-50"
                    onClick={logout}
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                >
                  Se connecter
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative flex-1">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default GuestLayout;
