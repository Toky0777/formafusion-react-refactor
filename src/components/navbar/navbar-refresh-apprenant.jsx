import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IMAGE_URL } from "../../config/env";

function NavbarRefreshApprenant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfilOpen, setIsProfilOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const endpoint =
    IMAGE_URL;
  const { t } = useTranslation();
  const storedUserString = localStorage.getItem("user");
  const sary = storedUserString ? JSON.parse(storedUserString) : null;
  const [showModaly, setShowModaly] = useState(false);
  const gridMenuRef = useRef(null);
  const gridProfilRef = useRef(null);
  const [showMessage, setShowMessage] = useState(false);
  const betaRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Détection de la taille d'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fermeture des menus au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (betaRef.current && !betaRef.current.contains(event.target)) {
        setShowMessage(false);
      }
      if (gridMenuRef.current && !gridMenuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (
        gridProfilRef.current &&
        !gridProfilRef.current.contains(event.target)
      ) {
        setIsProfilOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/particulier/refresh");
  };

  return (
    <header className="bg-white shadow-sm w-full">
      <div className="px-2 sm:px-4 h-[60px] flex items-center">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-4 sm:gap-10 flex-1 min-w-0">
            <div
              className="relative flex items-center gap-1 sm:gap-2"
              ref={betaRef}
            >
              <h1 className="relative text-lg sm:text-2xl font-semibold text-gray-800 overflow-visible">
                Refresh
              </h1>
            </div>

            <Link
              to="formateur/refresh"
              title="Module"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs sm:text-sm font-medium rounded-md transition hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 text-gray-700 bg-gray-200"
              onClick={handleClick}
            >
              <i className="text-base sm:text-lg fa-solid fa-grip-vertical"></i>
              <span className="hidden sm:inline">Module</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavbarRefreshApprenant;
