import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

const NavbarReporting = () => {
  const location = useLocation();

  // État pour gérer le menu mobile et le dropdown 'Chiffre d'affaire'
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const mobileMenuRef = useRef(null);
  const chiffreDAffaireRef = useRef(null);
  const dropdownRef = useRef(null);

  // Mettre à jour la position du dropdown
  const updateDropdownPosition = useCallback(() => {
    if (chiffreDAffaireRef.current) {
      const rect = chiffreDAffaireRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

  // Fermer tous les dropdowns
  const closeAllDropdowns = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  // Gérer l'ouverture/fermeture des menus
  const toggleDropdown = useCallback(
    (menuName) => {
      setOpenDropdown((prev) => (prev === menuName ? null : menuName));
      if (menuName === "chiffreAffaire") {
        updateDropdownPosition();
      }
    },
    [updateDropdownPosition]
  );

  // Effet pour fermer les menus au clic extérieur et au scroll
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideMobileMenu =
        mobileMenuRef.current && mobileMenuRef.current.contains(event.target);
      const isInsideChiffreAffaire =
        dropdownRef.current && dropdownRef.current.contains(event.target);
      const isToggleButton =
        event.target.closest('button[aria-label="Toggle mobile menu"]') ||
        event.target.closest('button[aria-label="Menu Chiffre d\'affaire"]');

      if (!isInsideMobileMenu && !isInsideChiffreAffaire && !isToggleButton) {
        closeAllDropdowns();
      }
    };

    const handleScroll = () => {
      if (openDropdown === "chiffreAffaire") {
        updateDropdownPosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [openDropdown, updateDropdownPosition, closeAllDropdowns]);

  // Fonction pour déterminer si un lien est actif
  const isNavLinkActive = useCallback(
    (path) => {
      const currentPath = location.pathname;
      if (path === "/cfp/reporting") {
        return currentPath === "/cfp/reporting";
      }
      return currentPath.startsWith(path);
    },
    [location.pathname]
  );

  const mainNavigation = useMemo(
    () => [
      { name: "Formation", to: "/cfp/reporting" },
      { name: "Apprenants", to: "/cfp/reporting/apprenant" },
      { name: "Clients", to: "/cfp/reporting/client" },
      { name: "Cours", to: "/cfp/reporting/cours" },
    ],
    []
  );
  const isMobileMenuOpen = openDropdown === "mobile";

  return (
    <nav className="w-full shadow-sm bg-white/90 text-slate-600 backdrop-blur-lg backdrop-saturate-150">
      <div className="container px-4 py-3 mx-auto">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-4 lg:hidden">
            <button
              onClick={() => toggleDropdown("mobile")}
              className="p-2 rounded-md text-slate-600 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              aria-label="Toggle mobile menu"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="justify-center flex-grow hidden lg:flex">
            <ul className="flex items-center space-x-2">
              {mainNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className={`capitalize px-3 py-2 rounded-md transition-colors duration-200 ${
                      isNavLinkActive(item.to)
                        ? "bg-[#87388C]/10 text-[#87388C] border-b-2 border-[#87388C]"
                        : "text-slate-600 hover:bg-[#87388C]/5 hover:text-[#87388C]"
                    }`}
                    onClick={closeAllDropdowns}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute left-0 z-50 w-full bg-white shadow-lg lg:hidden top-16"
        >
          <div className="container px-4 py-2 mx-auto">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={`block px-4 py-3 text-sm rounded-md ${
                  isNavLinkActive(item.to)
                    ? "bg-[#87388C] text-white"
                    : "text-slate-700 hover:bg-gray-100"
                }`}
                onClick={closeAllDropdowns}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarReporting;
