import React, { useEffect, useRef } from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from '../../config/axios';

import { useModal } from '../../contexts/cfp/ModalContext';
import { useSearchForm } from '../../contexts/SearchFormContext';
import { FaSearch } from 'react-icons/fa';
import { useStateContext } from '../../contexts/formateurs/ContextProvider';


function NavbarLearnerForm() {
  const endpoint = 'https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg';
  const [isOpen, setIsOpen] = useState(false);
  const storedUserString = localStorage.getItem("user");
  const sary = storedUserString ? JSON.parse(storedUserString) : null;
  const [isProfilOpen, setIsProfilOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [showModaly, setShowModaly] = useState(false);
  const { token, setUser, setToken } = useStateContext();
  const { openModal } = useModal();
  const [isOpenLanguage, setIsOpenLanguage] = useState(false);
  const { searchTerm, setSearchTerm } = useSearchForm()
  const [menuItems, setMenuItems] = useState([]);
  const menuRef = useRef(null);
  const profilMenuRef = useRef(null);
  const langMenuRef = useRef(null);
  const [showMessage, setShowMessage] = useState(false);
  const hideTimeout = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout.current);
    setShowMessage(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setShowMessage(false);
    }, 150); // petit délai pour éviter une fermeture brutale
  };

  const toggleMenuProfil = () => {
    setIsProfilOpen(!isProfilOpen); // Utilisation de isProfilOpen ici pour l'incohérence
  };

  const onLogout = (ev) => {
    ev.preventDefault();
    axios.get("/logout").then(({ }) => {
      setUser(null);

      setToken(null);
      localStorage.removeItem("user");
      sessionStorage.removeItem("setting");


      setTimeout(() => {
        window.location.reload();
      }, 800);

    });
  };
  const toggleMenu = () => {
    setIsOpenLanguage(!isOpenLanguage);
  };
  const baseImageUrl = "https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/";

  useEffect(() => {
    axios.get('/appLauncher')
      .then(response => {
        if (response.data.status === 'success') {
          setMenuItems(response.data.data);
        }
      })
      .catch(err => {
        console.error('Erreur chargement menu:', err);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false); // Ferme le menu si clic à l'extérieur
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideLang = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsOpenLanguage(false); // Ferme le menu de langue
      }
    };

    document.addEventListener("mousedown", handleClickOutsideLang);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideLang);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideProfil = (event) => {
      if (profilMenuRef.current && !profilMenuRef.current.contains(event.target)) {
        setIsProfilOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideProfil);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideProfil);
    };
  }, []);


  return (
    <div>

      <div className="w-full  px-4 h-16 flex items-center">
        <div className="w-full flex justify-between items-center">


          <div className="relative inline-block ml-60">
            <p className="flex items-center gap-2">

              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
              </div>

            </p>
          </div>

          <div class="flex gap-6" ref={langMenuRef}>

            <div className="  relative max-w-md border-2 border-gray-200 rounded-md overflow-hidden">
              <input
                type="text"
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 pr-10 w-full focus:outline-none border-0 focus:ring-0 bg-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <FaSearch className="text-gray-800" />
              </div>
            </div>


            {/* <div tabIndex={0} role="button" onClick={toggleMenu} className="flex items-center space-x-2 cursor-pointer">
              <i className="fa-solid fa-earth text-2xl"></i>
              <span>{i18n.language.toUpperCase()}</span>
            </div> */}




            <button
              onClick={() => openModal('addApprenantForm')}
              className=" flex gap-2 inline-flex items-center rounded bg-gray-300  px-6 !py-2 transition duration-200 ease-in-out !text-black"
            >
              <i className="fa-solid fa-user-plus "></i>

              <span className="hidden md:inline mr-2">{t('nouveau')}</span>
            </button>



            <div className="relative mt-1" ref={menuRef}>


            </div>

            <div className="mr-40 relative" ref={profilMenuRef}>

            </div>
          </div>


        </div>
      </div>

    </div>
  )
}

export default NavbarLearnerForm