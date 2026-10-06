import { useState, useEffect, useRef, useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { SearchContext } from "../../contexts/cfp/SearchFolderContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NabvarFolder = () => {
  // Contexts
  const { searchTerm, setSearchTerm } = useContext(SearchContext);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // State
  const [uiState, setUiState] = useState({
    showReconnectModal: false
  });
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Refs
  const searchRef = useRef(null);

  useEffect(() => {
    const protectedRoutes = ["/home-cfp", "/dossier/:id", "/home-etp"];
    if (protectedRoutes.includes(location.pathname)) {
      setUiState((prev) => ({ ...prev, showReconnectModal: true }));
    }
  }, [location.pathname]);

  useEffect(() => {
    setShowSearchResults(false);
    setSearchTerm("");
  }, [location.pathname, setSearchTerm]);

  // Handlers
  const handleReconnect = () => {
    setUiState((prev) => ({ ...prev, showReconnectModal: false }));
    navigate("/login", {
      state: {
        from: location.pathname,
        message: "Veuillez vous reconnecter pour accéder à cette page",
      },
    });
  };

  const handleSearchFocus = () => {
    if (searchTerm.trim().length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    setShowSearchResults(value.trim().length > 0);
  };

  return (
<header className="sticky top-0 z-20 w-full bg-gray-50">
  <div className="max-w-6xl px-4 mx-auto">
    <div className="flex flex-wrap items-center justify-center gap-8 mx-auto text-center">
      {/* <LogoLink user={user} t={t} />

      {user && <HomeLink user={user} location={location} t={t} />} */}

      <SearchBar
        searchRef={searchRef}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchFocus={handleSearchFocus}
        onClearSearch={() => {
          setSearchTerm("");
          setShowSearchResults(false);
        }}
        t={t}
      />
    </div>
  </div>
</header>

  );
};

// Sous-composants pour une meilleure lisibilité
const ReconnectModal = ({ onClose, onReconnect, navigate }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40"
    role="dialog"
    aria-modal="true"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-sm p-6 text-center bg-white rounded-lg shadow-xl dark:bg-gray-800"
    >
      <div className="flex items-center justify-center mb-4">
        <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
          <FaUserCircle className="text-3xl text-white" />
        </div>
      </div>
      <h3 className="mb-2 text-2xl font-bold text-center text-gray-800 dark:text-white">
        Reconnectez-vous pour poursuivre votre expérience 💫
      </h3>
      <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
        Votre session a expiré. Revenez et profitez pleinement de nos fonctionnalités !
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button
          onClick={() => {
            onClose();
            navigate("/");
          }}
          className="cursor-pointer px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium hover:scale-105 transform"
        >
          🏠 Revenir à l'accueil
        </button>
        <button
          onClick={onReconnect}
          className="cursor-pointer px-5 py-2.5 rounded-lg bg-[#A462A4] hover:bg-[#923A92] text-white font-medium transition-colors flex items-center justify-center gap-2 hover:scale-105 transform"
        >
          🔑 Accéder à mon compte
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const LogoLink = ({ user, t }) => {
  const getHomePath = (roleId) => {
    const routes = {
      6: "/home-etp",
      3: "/home-cfp",
      8: "/home-cfp",
      1: "/homeAdmin",
      4: "/homeEmp",
      5: "/homeForm",
      7: "/homeFormInterne",
      10: "/homeParticulier"
    };
    return routes[roleId] || "/login";
  };

  return (
    <Link
      to={getHomePath(user?.role_id)}
      className="flex items-center space-x-3 transition-opacity hover:opacity-80"
      title={`${t("navbar.title")}\n${t("navbar.open")}\n${t("navbar.message")}\n${t("navbar.contactLink")}`}
    >
    </Link>
  );
};

const HomeLink = ({ user, location, t }) => {
  const getHomePath = (roleId) => {
    const routes = {
      6: "/home-etp",
      3: "/home-cfp",
      8: "/home-cfp",
      1: "/homeAdmin",
      4: "/homeEmp",
      5: "/homeForm",
      7: "/homeFormInterne",
      10: "/homeParticulier"
    };
    return routes[roleId] || "/login";
  };

  const isActive = [
    "/",
    "/home-cfp",
    "/home-etp",
    "/homeAdmin",
    "/homeEmp",
    "/homeForm",
    "/home-FormInterne",
    "/homeParticulier"
  ].includes(location.pathname);

  return (
    <nav className="flex items-center space-x-6">
      <Link
        to={getHomePath(user.role_id)}
        className={`flex items-center gap-2 text-lg font-semibold transition-colors -ml-65 ${isActive
          ? "text-gray-800 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
      >
        {/* <FaHome className="text-xl" /> */}
        {t("table_headers.home")}
      </Link>

    </nav>
  );
};

const SearchBar = ({
  searchRef,
  searchTerm,
  theme,
  onSearchChange,
  onSearchFocus,
  onClearSearch,
  t
}) => (
  <div className="relative flex-1 w-full max-w-xl" ref={searchRef}>
    <div className="relative max-w-md overflow-hidden border-2 border-gray-200 rounded-md">
      <input
        type="text"
        placeholder={t("recherche")}
        value={searchTerm}
        onChange={onSearchChange}
        onFocus={onSearchFocus}
        className="w-full py-2 pl-10 pr-4 text-sm transition border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-100"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <FontAwesomeIcon
          icon={faSearch}
          className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        />
      </div>
      {searchTerm && (
        <button
          onClick={onClearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-3 transition-colors hover:text-purple-500"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  </div>
);

export default NabvarFolder;