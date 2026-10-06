import React, { useContext, useEffect, useState, useRef } from "react";
import { SearchLearnerContext } from "../../contexts/cfp/SearchLearnerContext";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faThLarge as faGrid,
  faFilter,
  faUpload,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa";
import { useModal, MODAL_TYPES } from "../../contexts/cfp/ModalContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

library.add(faGrid, faFilter, faUpload, faUserPlus);

function NavbarLearner({ onFilterToggle, isFilterVisible }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { setSearchTerm } = useContext(SearchLearnerContext);
  const { openModal } = useModal();
  const [isLocalFilterVisible, setIsLocalFilterVisible] =
    useState(isFilterVisible);

  const menuRef = useRef(null);
  const profilMenuRef = useRef(null);
  const langMenuRef = useRef(null);

  const [isOpenL, setIsOpenL] = useState(false);
  const [isProfilOpen, setIsProfilOpen] = useState(false);

  const { t } = useTranslation();

  // --- Hooks de fermeture de menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target))
        setIsOpenL(false);
      if (
        profilMenuRef.current &&
        !profilMenuRef.current.contains(event.target)
      )
        setIsProfilOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setSearchTerm(event.target.value);
  };

  const toggleFilterVisibility = () => {
    setIsLocalFilterVisible(!isLocalFilterVisible);
    onFilterToggle(!isLocalFilterVisible);
  };

  return (
    <div className="flex items-center w-full h-16 px-6">
      <div className="flex items-center justify-between w-full">
        {/* Logo / Titre */}
        <div className="relative inline-block">
          <Link to="#" className="relative inline-block text-2xl text-gray-700">
            Apprenants
          </Link>
        </div>

        {/* Partie droite */}
        <div className="flex items-center  gap-x-5">
          {/* Recherche */}
          <div className="relative max-w-md overflow-hidden border-2 border-gray-200 rounded-md">
            <input
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 pr-10 bg-transparent border-0 focus:outline-none focus:ring-0"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <FaSearch className="text-gray-800" />
            </div>
          </div>

          {/* Nouveau apprenant */}
          <button
            onClick={() => openModal("addApprenant")}
            className="flex items-center gap-2 px-3 py-2 text-black transition duration-200 ease-in-out bg-gray-300 rounded"
          >
            <i className="mr-2 fa-solid fa-user-plus" />
            <span className="hidden md:inline">{t("nouveau")}</span>
          </button>

          {/* Filtre */}
          <div className="relative" ref={menuRef}>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isFilterVisible
                  ? "bg-[#A462A4] text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={toggleFilterVisibility}
              title={t("filtre")}
            >
              <i className="text-xl fa-solid fa-filter" />
              <span className="hidden sm:inline">{t("filter")}</span>
              {isFilterVisible ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavbarLearner;
