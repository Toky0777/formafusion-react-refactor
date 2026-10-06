import {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
} from "react";
import { createPortal } from "react-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const NavbarReportingEtp = () => {
    const location = useLocation();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isChiffreDAffaireOpen, setIsChiffreDAffaireOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const mobileMenuRef = useRef(null);
    const chiffreDAffaireRef = useRef(null);
    const chiffreDAffaireButtonRef = useRef(null);

    const dropdownStates = useMemo(
        () => [
            {
                ref: mobileMenuRef,
                setter: setIsMobileMenuOpen,
                name: "mobile",
                toggleButtonSelector: 'button[aria-label="Toggle mobile menu"]',
            },
            {
                ref: chiffreDAffaireRef,
                setter: setIsChiffreDAffaireOpen,
                name: "chiffreAffaire",
                toggleButtonSelector: 'button[aria-label="Menu Chiffre d\'affaire"]',
            },
        ],
        []
    );

    const closeAllDropdownsExcept = useCallback(
        (dropdownToKeepOpen = null) => {
            dropdownStates.forEach(({ name, setter }) => {
                if (name !== dropdownToKeepOpen) {
                    setter(false);
                }
            });
            setActiveDropdown(dropdownToKeepOpen);
        },
        [dropdownStates]
    );

    const toggleMobileMenu = useCallback(() => {
        closeAllDropdownsExcept("mobile");
        setIsMobileMenuOpen((prev) => !prev);
    }, [closeAllDropdownsExcept]);

    const toggleChiffreDAffaire = useCallback(() => {
        closeAllDropdownsExcept("chiffreAffaire");
        setIsChiffreDAffaireOpen((prev) => !prev);
    }, [closeAllDropdownsExcept]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            dropdownStates.forEach(({ ref, setter, toggleButtonSelector }) => {
                const toggleButton = document.querySelector(toggleButtonSelector);
                if (
                    ref.current &&
                    !ref.current.contains(event.target) &&
                    (!toggleButton || !toggleButton.contains(event.target))
                ) {
                    setter(false);
                    setActiveDropdown(null);
                }
            });
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownStates]);

    const isNavLinkActive = useCallback(
        (path) => {
            const currentPath = location.pathname;
            // La logique a été corrigée ici
            if (path === "/etp/reporting") {
                return currentPath === path;
            }
            return currentPath.startsWith(path);
        },
        [location.pathname]
    );

    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const mainNavigation = useMemo(() => {
        return [
            {
                name: "Formation",
                to: "/etp/reporting",
                icon: "📊"
            },
            {
                name: "Employé",
                to: "/etp/reporting/employe",
                icon: "👥"
            },
            {
                name: "Centre de formation",
                to: "/etp/reporting/client",
                icon: "🏢"
            },
            {
                name: "Cours",
                to: "/etp/reporting/cours",
                icon: "📚"
            },
            {
                name: "Coûts de formation",
                to: "/etp/reporting/cout",
                icon: "💰"
            },
        ];
    }, []);

    const chiffreDAffaireNavigation = useMemo(() => {
        return [
            { name: "Global", to: "/etp/reporting/chiffre-affaire" },
            { name: "Par Employé", to: "/etp/reporting/chiffre-affaire/employe" },
            { name: "Par Centre de formation", to: "/etp/reporting/chiffre-affaire/client" },
        ];
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
        setIsChiffreDAffaireOpen(false);
    }, [location.pathname]);

    return (
        <>
            <nav className="w-full shadow-sm bg-white/95 text-slate-700 backdrop-blur-lg backdrop-saturate-150 border-b border-gray-200 sticky top-0 z-50">
                <div className="container px-4 py-3 mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="lg:hidden">
                                <button
                                    onClick={toggleMobileMenu}
                                    className="p-2 rounded-md text-slate-700 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    aria-label="Toggle mobile menu"
                                >
                                    {isMobileMenuOpen ? (
                                        <FiX className="w-6 h-6" />
                                    ) : (
                                        <FiMenu className="w-6 h-6" />
                                    )}
                                </button>
                            </div>
                            <Link
                                to="/"
                                className="flex items-center gap-2 font-semibold text-lg"
                                onClick={() => closeAllDropdownsExcept()}
                            >
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-lg">
                                    📈
                                </span>
                                <span className="hidden sm:block">Reporting</span>
                            </Link>
                        </div>

                        {/* Menu mobile */}
                        {isMobileMenuOpen && (
                            <div
                                ref={mobileMenuRef}
                                className="absolute left-0 z-50 w-full bg-white shadow-xl lg:hidden top-full border-t border-gray-200 animate-fade-in"
                            >
                                <div className="container px-4 py-3 mx-auto">
                                    <div className="space-y-1">
                                        {/* Dropdown for "Chiffre d'affaire" in mobile */}
                                        <div className="relative">
                        
                                            {isChiffreDAffaireOpen && (
                                                <div className="pl-6 pt-1 space-y-1 animate-fade-in">
                                                    {chiffreDAffaireNavigation.map((subItem) => (
                                                        <Link
                                                            key={subItem.name}
                                                            to={subItem.to}
                                                            className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                                                                isNavLinkActive(subItem.to)
                                                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                                                    : "text-slate-700 hover:bg-gray-50 hover:text-purple-600"
                                                            }`}
                                                            onClick={() => {
                                                                setIsMobileMenuOpen(false);
                                                                setIsChiffreDAffaireOpen(false);
                                                            }}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Main navigation links for mobile */}
                                        {mainNavigation.map((item) => {
                                            const isActive = isNavLinkActive(item.to);
                                            return (
                                                <Link
                                                    key={item.name}
                                                    to={item.to}
                                                    className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                                                        isActive
                                                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                                            : "text-slate-700 hover:bg-gray-50 hover:text-purple-600"
                                                    }`}
                                                    onClick={() => {
                                                        setIsMobileMenuOpen(false);
                                                        setActiveDropdown(null);
                                                    }}
                                                >
                                                    <span className="mr-3 text-lg">{item.icon}</span>
                                                    <span className="font-medium">{item.name}</span>
                                                    {isActive && (
                                                        <span className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Menu desktop */}
                        <div className="justify-center flex-grow hidden lg:flex">
                            <ul className="flex items-center space-x-1">
                                {/* Dropdown for "Chiffre d'affaire" in desktop */}
                                <li className="relative">
                                    {isChiffreDAffaireOpen && (
                                        <div
                                            ref={chiffreDAffaireRef}
                                            className="absolute top-full mt-2 w-48 bg-white shadow-lg rounded-lg animate-fade-in"
                                        >
                                            <ul className="py-1">
                                                {chiffreDAffaireNavigation.map((subItem) => (
                                                    <li key={subItem.name}>
                                                        <Link
                                                            to={subItem.to}
                                                            className={`block px-4 py-2 text-sm transition-all duration-200 ${
                                                                isNavLinkActive(subItem.to)
                                                                    ? "bg-gray-100 text-purple-600 font-semibold"
                                                                    : "text-slate-700 hover:bg-gray-100"
                                                            }`}
                                                            onClick={() => {
                                                                setIsChiffreDAffaireOpen(false);
                                                            }}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>

                                {/* Main navigation links for desktop */}
                                {mainNavigation.map((item) => {
                                    const isActive = isNavLinkActive(item.to);
                                    return (
                                        <li key={item.name} className="relative">
                                            <Link
                                                to={item.to}
                                                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 group ${
                                                    isActive
                                                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                                                        : "text-slate-700 hover:bg-gray-100 hover:text-purple-600"
                                                }`}
                                                onClick={() => closeAllDropdownsExcept()}
                                            >
                                                <span className="mr-2">{item.icon}</span>
                                                <span className="font-medium">{item.name}</span>
                                                {isActive && (
                                                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-ping"></span>
                                                )}
                                            </Link>
                                            {isActive && (
                                                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Indicateur de page active pour mobile */}
                        <div className="lg:hidden">
                            {mainNavigation.find(item => isNavLinkActive(item.to)) && (
                                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Overlay pour mobile */}
            {isMobileMenuOpen && createPortal(
                <div
                    className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
                    onClick={() => {
                        setIsMobileMenuOpen(false);
                        setActiveDropdown(null);
                    }}
                />,
                document.body
            )}
        </>
    );
};

export default NavbarReportingEtp;
