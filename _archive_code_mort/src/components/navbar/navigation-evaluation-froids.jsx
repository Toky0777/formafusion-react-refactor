import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Plus, List, Coins, History, Mail, Home, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NavigationListFroid({ isMobile = false, onItemClick }) {
    // const { t } = useTranslation();
    const location = useLocation();
    const dropdownMenuRef = useRef(null);
    const [titleMenu, setTitleMenu] = useState(null);
    const [openMenu, setOpenMenu] = useState(false);

    let menus = [];

    // menus.push(
    //     {
    //         menu_title: "Evaluation à chaud",
    //         menu_icon: 'diagram-project',
    //         menu: 1,
    //         label: "Evaluation à chaud",
    //         endpoint: 'cfp/evaluation',
    //         route: '/cfp/evaluation/chaud',
    //         icon: 'home',
    //     }
    // )
    menus.push(
        {
            menu_title: "Evaluation à froid",
            menu_icon: 'diagram-project',
            menu: 1,
            label: "Evaluation à froid",
            endpoint: 'cfp/evaluation/froids',
            route: '/cfp/evaluation/froids',
            icon: 'history',
        }
    )
    // menus.push(
    //     {
    //         menu_title: "Avis",
    //         menu_icon: 'diagram-project',
    //         menu: 1,
    //         label: "Avis",
    //         endpoint: 'cfp/evaluation/avis',
    //         route: '/cfp/evaluation/avis',
    //         icon: 'mail',
    //     }
    // )

    function groupMenusByLabelTC(menus) {
        return menus.reduce((grouped, menu) => {
            const title = menu.menu_title;
            if (!grouped[title]) {
                grouped[title] = {
                    items: [],
                    icon: menu.menu_icon || null
                };
            }
            grouped[title].items.push(menu);
            return grouped;
        }, {});
    }

    const groupMenus = groupMenusByLabelTC(menus);

    // Fonction pour vérifier si un menu est actif
    const isMenuActive = (menuRoute) => {
        return location.pathname === menuRoute;
    };

    // Fonction pour vérifier si un groupe de menu contient l'item actif
    const isGroupActive = (group) => {
        return group.items.some(item => isMenuActive(item.route));
    };

    const toggleDropdown = (title) => {
        if (isMobile) {
            setTitleMenu(titleMenu === title ? null : title);
            setOpenMenu(titleMenu !== title);
        } else {
            setTitleMenu(titleMenu === title ? null : title);
            setOpenMenu(!openMenu);
        }
    };

    useEffect(() => {
        if (!isMobile) {
            const handleClickOutside = (event) => {
                if (dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target)) {
                    setOpenMenu(false);
                    setTitleMenu(null);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isMobile]);

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'home': return <Home className="w-4 h-4" />;
            case 'plus': return <Plus className="w-4 h-4" />;
            case 'list': return <List className="w-4 h-4" />;
            case 'coins': return <Coins className="w-4 h-4" />;
            case 'history': return <History className="w-4 h-4" />;
            case 'mail': return <Mail className="w-4 h-4" />;
            case 'shopping-cart': return <ShoppingCart className="w-4 h-4" />;
            default: return <i className="w-4 h-4" data-lucide={iconName}></i>;
        }
    };

    const handleItemClick = () => {
        if (isMobile && onItemClick) {
            onItemClick();
        }
    };

    if (isMobile) {
        return (
            <div className="space-y-2">
                {Object.entries(groupMenus).map(([menuTitle, group]) => (
                    group.items.length > 1 ? (
                        <div key={menuTitle} className="space-y-1">
                            <button
                                onClick={() => toggleDropdown(menuTitle)}
                                className={`flex items-center justify-between w-full px-4 py-3 text-left transition-all duration-200 rounded-xl relative overflow-hidden group ${isGroupActive(group)
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
                                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-600 hover:shadow-md'
                                    }`}
                            >
                                {/* Effet de brillance */}
                                <div className="absolute inset-0 transition-transform duration-700 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full"></div>

                                <div className="relative z-10 flex items-center">
                                    <div className={`p-1.5 rounded-lg transition-colors duration-200 ${isGroupActive(group)
                                        ? 'bg-white/20'
                                        : 'group-hover:bg-purple-100'
                                        }`}>
                                        {getIcon(group.items[0].icon)}
                                    </div>
                                    <span className="ml-3 font-semibold">{menuTitle}</span>
                                    {/* Indicateur actif */}
                                    {isGroupActive(group) && (
                                        <div className="w-2 h-2 ml-2 bg-white rounded-full shadow-lg animate-pulse"></div>
                                    )}
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 relative z-10 ${openMenu && titleMenu === menuTitle ? 'rotate-180' : ''
                                    } ${isGroupActive(group) ? 'text-white' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {titleMenu === menuTitle && openMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: "auto", y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -10 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="ml-4 space-y-1 overflow-hidden"
                                    >
                                        {group.items.map((menu, index) => (
                                            <Link
                                                key={index}
                                                to={menu.route}
                                                onClick={handleItemClick}
                                                className={`flex items-center px-4 py-3 text-sm transition-all duration-200 rounded-lg relative group ${isMenuActive(menu.route)
                                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md transform translate-x-1'
                                                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600 hover:translate-x-1'
                                                    }`}
                                            >
                                                {/* Barre indicatrice à gauche */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-200 ${isMenuActive(menu.route)
                                                    ? 'bg-white shadow-lg'
                                                    : 'bg-transparent group-hover:bg-purple-400'
                                                    }`}></div>

                                                <div className={`p-1.5 rounded-lg transition-colors duration-200 ${isMenuActive(menu.route)
                                                    ? 'bg-white/20'
                                                    : 'group-hover:bg-purple-100'
                                                    }`}>
                                                    {getIcon(menu.icon)}
                                                </div>
                                                <span className="ml-3 font-medium">{menu.label}</span>

                                                {/* Point indicateur pour item actif */}
                                                {isMenuActive(menu.route) && (
                                                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-lg"></div>
                                                )}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link
                            key={menuTitle}
                            to={group.items[0].route}
                            onClick={handleItemClick}
                            className={`flex items-center px-4 py-3 transition-all duration-200 rounded-xl relative overflow-hidden group ${isMenuActive(group.items[0].route)
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-600 hover:shadow-md'
                                }`}
                        >
                            {/* Effet de brillance */}
                            <div className="absolute inset-0 transition-transform duration-700 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full"></div>

                            <div className={`p-1.5 rounded-lg transition-colors duration-200 relative z-10 ${isMenuActive(group.items[0].route)
                                ? 'bg-white/20'
                                : 'group-hover:bg-purple-100'
                                }`}>
                                {getIcon(group.items[0].icon)}
                            </div>
                            <span className="relative z-10 ml-3 font-semibold">{menuTitle}</span>

                            {/* Indicateur actif */}
                            {isMenuActive(group.items[0].route) && (
                                <div className="relative z-10 w-2 h-2 ml-auto bg-white rounded-full shadow-lg animate-pulse"></div>
                            )}
                        </Link>
                    )
                ))}
            </div>
        );
    }

    // Desktop version
    return (
        <div className="items-center hidden space-x-2 lg:flex">
            {Object.entries(groupMenus).map(([menuTitle, group]) => (
                group.items.length > 1 ? (
                    <div key={menuTitle} className="relative" ref={dropdownMenuRef}>
                        <button
                            onClick={() => toggleDropdown(menuTitle)}
                            className={`flex items-center px-4 py-2 text-sm transition-all duration-200 rounded-xl relative overflow-hidden group ${isGroupActive(group)
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-600 hover:shadow-md'
                                }`}
                        >
                            {/* Effet de brillance */}
                            <div className="absolute inset-0 transition-transform duration-700 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full"></div>

                            <span className="relative z-10 font-semibold">{menuTitle}</span>

                            {/* Indicateur actif */}
                            {isGroupActive(group) && (
                                <div className="w-1.5 h-1.5 ml-2 bg-white rounded-full shadow-lg animate-pulse relative z-10"></div>
                            )}

                            <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-300 relative z-10 ${openMenu && titleMenu === menuTitle ? 'rotate-180' : ''
                                }`} />
                        </button>

                        <AnimatePresence>
                            {titleMenu === menuTitle && openMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute z-50 w-64 mt-2 overflow-hidden border border-purple-100 shadow-2xl bg-white/95 backdrop-blur-xl rounded-2xl"
                                >
                                    <div className="p-1">
                                        {group.items.map((menu, index) => (
                                            <Link
                                                key={index}
                                                to={menu.route}
                                                className={`flex items-center px-4 py-3 text-sm transition-all duration-200 rounded-xl relative group ${isMenuActive(menu.route)
                                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-600'
                                                    }`}
                                            >
                                                {/* Barre indicatrice à gauche */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-200 ${isMenuActive(menu.route)
                                                    ? 'bg-white shadow-lg'
                                                    : 'bg-transparent group-hover:bg-purple-400'
                                                    }`}></div>

                                                <div className={`p-1.5 rounded-lg transition-colors duration-200 ${isMenuActive(menu.route)
                                                    ? 'bg-white/20'
                                                    : 'group-hover:bg-purple-100'
                                                    }`}>
                                                    {getIcon(menu.icon)}
                                                </div>
                                                <span className="ml-3 font-medium">{menu.label}</span>

                                                {/* Point indicateur pour item actif */}
                                                {isMenuActive(menu.route) && (
                                                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-lg"></div>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <Link
                        key={menuTitle}
                        to={group.items[0].route}
                        className={`flex items-center px-4 py-2 text-sm transition-all duration-200 rounded-xl relative overflow-hidden group ${isMenuActive(group.items[0].route)
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-600 hover:shadow-md'
                            }`}
                    >
                        {/* Effet de brillance */}
                        <div className="absolute inset-0 transition-transform duration-700 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full"></div>

                        <div className={`p-1.5 rounded-lg transition-colors duration-200 relative z-10 ${isMenuActive(group.items[0].route)
                            ? 'bg-white/20'
                            : 'group-hover:bg-purple-100'
                            }`}>
                            {getIcon(group.items[0].icon)}
                        </div>
                        <span className="relative z-10 ml-2 font-semibold">{menuTitle}</span>

                        {/* Indicateur actif */}
                        {isMenuActive(group.items[0].route) && (
                            <div className="ml-2 w-1.5 h-1.5 bg-white rounded-full shadow-lg animate-pulse relative z-10"></div>
                        )}
                    </Link>
                )
            ))}
        </div>
    );
}