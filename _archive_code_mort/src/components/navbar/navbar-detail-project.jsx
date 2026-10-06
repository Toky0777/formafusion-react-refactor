import React, { useState, useEffect } from 'react';
import { FaEarthAmericas, FaList, FaFilter, FaUser, FaGear, FaPowerOff } from 'react-icons/fa6';
import { BsGrid3X3GapFill } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProjectCreation from '../drawer/project/project-creation';
import { useTranslation } from "react-i18next";


const NavbarProjectDetail = () => {
    const [showPage, setShowPage] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("fr");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isAppsOpen, setIsAppsOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const setting = JSON.parse(sessionStorage.getItem("setting"));
    const countryCode = setting?.country_code?.toLowerCase();
    const [launcher, setLauncher] = useState([]);
    const { t } = useTranslation();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLanguageSelect = (lang) => {
        setSelectedLanguage(lang);
        // setDropdownOpen(false);
    };

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const toggleApps = () => {
        setIsAppsOpen(!isAppsOpen);
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };


    const navigate = useNavigate();

    return (
        <nav className='fixed top-0 left-0 w-full shadow-xl bg-gray-50 z-1'>
            <div className="w-[98%] m-auto flex justify-between navbar mx-auto p-[2px]">
                <div className="inline-flex items-center gap-4">
                    <a href="/" className="flex items-center gap-2">
                        <img src="https://projets.forma-fusion.com/img/icones/Projets.png" className="mb-0 w-7"></img>
                        <h1 className="text-xl font-semibold text-gray-700">Projets</h1>
                    </a>
                    <span
                        onClick={() => setShowMessage((prev) => !prev)}
                        className="cursor-pointer text-sm px-2 py-0.5 bg-green-500 text-white rounded-full border border-gray-300 dark:border-gray-600"
                    >
                        Beta
                    </span>
                    {showMessage && (
                        <div className="absolute z-10 p-4 mt-2 text-sm text-gray-700 bg-white border rounded shadow-lg top-2 left-45 w-72 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
                            <p className="mb-1 font-semibold">
                                🚧 {t("navbar.open")}
                            </p>
                            <p>
                                {t("navbar.message")} 💬
                                <span
                                    onClick={() =>
                                        window.open("https://forma-fusion.com/contact", "_blank")
                                    }
                                    className="text-purple-600 underline cursor-pointer dark:text-purple-400"
                                >
                                    {t("navbar.contactLink")}
                                </span>
                                .
                            </p>
                        </div>
                    )}



                </div>



                <>
                    <div className="flex items-center gap-4">
                        <div className="mt-1">
                            <img
                                src={`https://flagcdn.com/${countryCode}.svg`}
                                alt={setting?.country_name || "Drapeau"}
                                title={`Bienvenue dans Forma Fusion ${setting?.country_name || ""}`}
                                className="w-8 h-8 rounded-full cursor-pointer"
                            />
                        </div>
                        <div className="">
                            <button
                                onClick={() => setShowPage(true)}
                                className="flex items-center justify-center w-8 h-8 mt-1 text-green-500 transition duration-300 ease-in-out border border-green-500 rounded-full hover:bg-green-500 hover:text-white"
                            >
                                <FiPlus />
                            </button>

                            <AnimatePresence>
                                {showPage && (
                                    <>
                                        {/* Overlay noir semi-transparent */}
                                        <motion.div
                                            className="fixed inset-0 z-40 bg-gray-800/60"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setShowPage(false)} // clic sur fond = fermeture
                                        />

                                        {/* Panneau de formulaire */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 300 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 300 }}
                                            transition={{ duration: 1 }}

                                            className="fixed right-0 top-0 h-full bg-white  w-[1010px] z-50 shadow-lg "
                                        >
                                            <ProjectCreation setShowPage={setShowPage} ></ProjectCreation>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative inline-block dropdown dropdown-end">
                            <div tabIndex="0" role="button" className="p-1 btn btn-ghost btn-square">
                                <button
                                    className='items-center p-1 mt-2 text-xl transition transition-colors duration-700 ease-in-out rounded-md hover:bg-slate-200'
                                    aria-label="Applications"
                                    onClick={toggleApps}
                                >
                                    <BsGrid3X3GapFill />
                                </button>
                            </div>
                            <AnimatePresence>
                                {isAppsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-10 mt-3 w-[440px] h-[495.33px]  rounded-2xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30 p-5 border border-gray-100 "
                                    >
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>


                        <div className="relative">
                            <div tabIndex="0" role="button" className="p-1 btn btn-ghost btn-square">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center gap-2 p-1 mt-2 text-xl transition-colors rounded-md hover:bg-slate-200"
                                    aria-label="Langue"
                                >
                                    <FaEarthAmericas size={20} />
                                    <span className="text-xs font-semibold">{selectedLanguage}</span>
                                </button>
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute left-0 top-full mt-2 w-[120px] bg-gray-100 shadow z-40 p-2 rounded-md">
                                    <div
                                        className="w-full p-1 text-sm font-bold rounded-md cursor-pointer hover:bg-slate-200 hover:text-blue-600"
                                        onClick={() => handleLanguageSelect("fr")}
                                    >
                                        Français
                                    </div>
                                    <div
                                        className="w-full p-1 text-sm font-bold rounded-md cursor-pointer hover:bg-slate-200 hover:text-blue-600"
                                        onClick={() => handleLanguageSelect("ang")}
                                    >
                                        English
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative inline-block">

                        </div>
                    </div>
                </>
            </div>
        </nav>
    );
};

export default NavbarProjectDetail;