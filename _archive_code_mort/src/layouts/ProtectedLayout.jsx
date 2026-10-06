import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import {
    Search, X, Grid3x3, Bell, Users, GraduationCap, CheckCircle, BarChart3,
    BookOpen, Target, Monitor, Award, Clipboard, Rocket, Calendar, Building,
    PenTool, Folder, Camera, User, CreditCard, TrendingUp, FileBarChart,
    ShoppingCart, Settings, LogOut, UserCog, Shield, HelpCircle, ChevronDown,
    Menu, Home, TestTube, Briefcase, MapPin, UserCheck, DollarSign, FileText,
    Globe, Phone, Mail, Star, Clock, Key, Database, Cloud
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/loading-spinner';
import { getMicroservicesForUserType } from './microServiceData';
import { u } from 'framer-motion/client';

const ProtectedLayout = () => {
    const { user, userType, setUser, logout, isLoading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');
    const [showGlobalSearch, setShowGlobalSearch] = useState(false);
    const [showAppLauncher, setShowAppLauncher] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [isAccountActive, setIsAccountActive] = useState(false);
    const [notifications] = useState([
        { id: 1, message: "Nouvelle formation disponible", type: "info", unread: true },
        { id: 2, message: "Évaluation en attente", type: "warning", unread: true }
    ]);

    const location = useLocation();
    console.log(userType);

    const microservicesData = getMicroservicesForUserType(userType);

    const navigationLinks = [
        { to: "/app/dashboard", label: "Tableau de bord" },
        { to: "/app/formations", label: "Formations" },
        { to: "/app/cours", label: "Cours" },
        { to: "/app/centres", label: "Centre de formation" },
        { to: "/app/account", label: "Mon compte" },
    ];

    useEffect(() => {
        setIsAccountActive(location.pathname === '/app/account');
    }, [location.pathname]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setShowAppLauncher(false);
        setShowUserDropdown(false);
        if (!globalSearchTerm) setShowGlobalSearch(false);
    }, [location, globalSearchTerm]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('#global-search-input') && !e.target.closest('.global-search-button')) {
                if (!globalSearchTerm) setShowGlobalSearch(false);
            }
            if (!e.target.closest('.app-launcher-dropdown') && !e.target.closest('.app-launcher-button')) {
                setShowAppLauncher(false);
            }
            if (!e.target.closest('.user-dropdown') && !e.target.closest('.user-dropdown-button')) {
                setShowUserDropdown(false);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowAppLauncher(false);
                setShowUserDropdown(false);
                setIsMobileMenuOpen(false);
                if (!globalSearchTerm) setShowGlobalSearch(false);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setShowGlobalSearch(true);
                setTimeout(() => document.getElementById('global-search-input')?.focus(), 100);
            }
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [globalSearchTerm]);

    const handleLogout = useCallback(async () => {
        try {
            setShowUserDropdown(false);
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
            setUser(null);
            localStorage.removeItem('token');
        }
    }, [logout, setUser]);

    const handleServiceNavigation = useCallback((service) => {
        console.log(`Navigation vers ${service.name} - ${service.route}`);
        setShowAppLauncher(false);
        setIsMobileMenuOpen(false);
        // Here you would typically navigate to the service route
        // navigate(service.route);
    }, []);

    const handleGlobalSearch = useCallback((searchTerm) => {
        console.log('Recherche globale:', searchTerm);
        setGlobalSearchTerm('');
        setShowGlobalSearch(false);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="space-y-4 text-center">
                    <LoadingSpinner size="xl" />
                    <p className="text-sm text-gray-600 animate-pulse">
                        Chargement de votre espace...
                    </p>
                </div>
            </div>
        );
    }

    console.log('User data:', user);


    if (!user) {
        return <Navigate to="/" replace />;
    }

    const unreadNotifications = notifications.filter(n => n.unread).length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-gray-200 shadow-sm bg-white/95 backdrop-blur-sm">
                <div className="px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/app/dashboard" className="flex items-center space-x-3 transition-all duration-300 group hover:scale-105">
                            <img
                                className="w-8 h-6 transition-shadow duration-300 rounded shadow-sm group-hover:shadow-md"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Madagascar.svg/800px-Flag_of_Madagascar.svg.png"
                                alt="Madagascar Flag"
                                loading="lazy"
                            />
                            <span className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                                FormaFusion
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="items-center hidden space-x-1 lg:flex">
                            {navigationLinks.map(({ to, label }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-300 relative group ${isActive
                                            ? 'text-purple-600'
                                            : 'text-gray-700 hover:text-purple-600'
                                        }`
                                    }
                                >
                                    <span>{label}</span>
                                </NavLink>
                            ))}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-400 transition-all duration-300 rounded-lg lg:hidden hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            aria-label="Toggle menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        {/* Desktop Tools */}
                        <div className="items-center hidden space-x-2 lg:flex">
                            {/* Global Search */}
                            {!showGlobalSearch ? (
                                <button
                                    onClick={() => {
                                        setShowGlobalSearch(true);
                                        setTimeout(() => {
                                            document.getElementById('global-search-input')?.focus();
                                        }, 100);
                                    }}
                                    className="p-2 text-gray-400 transition-all duration-300 rounded-lg global-search-button hover:text-gray-600 hover:bg-gray-100 group"
                                    title="Recherche globale (Ctrl+K)"
                                >
                                    <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                </button>
                            ) : (
                                <div className="relative">
                                    <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                    <input
                                        id="global-search-input"
                                        type="text"
                                        placeholder="Rechercher... (Échap pour fermer)"
                                        value={globalSearchTerm}
                                        onChange={(e) => setGlobalSearchTerm(e.target.value)}
                                        onBlur={() => {
                                            if (!globalSearchTerm) {
                                                setTimeout(() => setShowGlobalSearch(false), 200);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') {
                                                setGlobalSearchTerm('');
                                                setShowGlobalSearch(false);
                                            } else if (e.key === 'Enter' && globalSearchTerm.trim()) {
                                                handleGlobalSearch(globalSearchTerm.trim());
                                            }
                                        }}
                                        className="w-64 py-2 pl-10 pr-10 transition-all duration-300 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:w-72"
                                        autoComplete="off"
                                    />
                                    {globalSearchTerm && (
                                        <button
                                            onClick={() => {
                                                setGlobalSearchTerm('');
                                                document.getElementById('global-search-input')?.focus();
                                            }}
                                            className="absolute text-gray-400 transition-colors duration-200 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                                            aria-label="Effacer la recherche"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Notifications */}
                            <button
                                className="relative p-2 text-gray-400 transition-all duration-300 rounded-lg hover:text-gray-600 hover:bg-gray-100 group"
                                title={`${unreadNotifications} notification${unreadNotifications !== 1 ? 's' : ''} non lue${unreadNotifications !== 1 ? 's' : ''}`}
                            >
                                <Bell className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                {unreadNotifications > 0 && (
                                    <>
                                        <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1 animate-pulse"></span>
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium">
                                            {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                        </span>
                                    </>
                                )}
                            </button>

                            {/* App Launcher */}
                            <button
                                onClick={() => setShowAppLauncher(!showAppLauncher)}
                                className={`app-launcher-button p-2 rounded-lg transition-all duration-300 group ${showAppLauncher
                                    ? 'bg-purple-100 text-purple-600'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                                title="Lancer une application"
                                aria-expanded={showAppLauncher}
                            >
                                <Grid3x3 className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    className="flex items-center py-2 pl-3 pr-2 space-x-3 transition-all duration-300 rounded-lg user-dropdown-button hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    aria-expanded={showUserDropdown}
                                >
                                    <div className="relative">
                                        <img
                                            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=ffffff`}
                                            alt={user?.name || 'Utilisateur'}
                                            className="w-8 h-8 transition-transform duration-300 border-2 border-white rounded-full shadow-sm hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                                            {user?.name?.split(' ')[0] || 'Utilisateur'}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate max-w-32">
                                            {user?.role || user?.userType || 'Utilisateur'}
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showUserDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* User Dropdown */}
                                {showUserDropdown && (
                                    <div className="absolute right-0 z-50 mt-2 duration-200 bg-white border border-gray-200 rounded-lg shadow-xl w-72 user-dropdown animate-in fade-in slide-in-from-top-2">
                                        <div className="p-4 border-b border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1&color=ffffff`}
                                                    alt={user?.name || 'Utilisateur'}
                                                    className="w-12 h-12 rounded-full"
                                                    loading="lazy"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                                                        {user?.name || 'Utilisateur'}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {user?.email || 'email@example.com'}
                                                    </p>
                                                    <p className="text-xs font-medium text-purple-600">
                                                        {user?.role || user?.userType || 'Utilisateur'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            <Link
                                                to="/app/profile"
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50 group"
                                                onClick={() => setShowUserDropdown(false)}
                                            >
                                                <UserCog className="w-4 h-4 mr-3 text-gray-400 transition-colors duration-200 group-hover:text-purple-500" />
                                                Mon profil
                                            </Link>
                                            <Link
                                                to="/app/settings"
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50 group"
                                                onClick={() => setShowUserDropdown(false)}
                                            >
                                                <Settings className="w-4 h-4 mr-3 text-gray-400 transition-colors duration-200 group-hover:text-purple-500" />
                                                Paramètres
                                            </Link>
                                            <Link
                                                to="/app/security"
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50 group"
                                                onClick={() => setShowUserDropdown(false)}
                                            >
                                                <Shield className="w-4 h-4 mr-3 text-gray-400 transition-colors duration-200 group-hover:text-purple-500" />
                                                Sécurité
                                            </Link>
                                            <Link
                                                to="/app/help"
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50 group"
                                                onClick={() => setShowUserDropdown(false)}
                                            >
                                                <HelpCircle className="w-4 h-4 mr-3 text-gray-400 transition-colors duration-200 group-hover:text-purple-500" />
                                                Aide et support
                                            </Link>
                                        </div>
                                        <div className="p-2 border-t border-gray-100">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 transition-all duration-200 rounded-md hover:bg-red-50 group"
                                            >
                                                <LogOut className="w-4 h-4 mr-3 transition-transform duration-200 group-hover:scale-110" />
                                                Se déconnecter
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {isMobileMenuOpen && (
                        <div className="py-4 duration-300 border-t border-gray-200 lg:hidden bg-white/95 backdrop-blur-sm animate-in slide-in-from-top">
                            <nav className="flex flex-col space-y-2">
                                {navigationLinks.map(({ to, label }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all duration-300 ${isActive
                                                ? 'text-purple-600 bg-purple-50'
                                                : 'text-gray-700 hover:text-purple-600'
                                            }`
                                        }
                                    >
                                        <span>{label}</span>
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Quick Access Bar - Only show on account page */}
            {/* {isAccountActive && (
                <div className="border-b border-gray-200 bg-gray-50">
                    <div className="px-4 mx-auto sm:px-6 lg:px-8">
                        <div className="flex items-center py-2 space-x-1 overflow-x-auto scrollbar-hide">
                            {microservicesData.map((category, categoryIndex) => (
                                <div key={categoryIndex} className="flex items-center">
                                    {categoryIndex > 0 && (
                                        <div className="w-px h-6 mx-2 bg-gray-300"></div>
                                    )}
                                    <div className="flex items-center space-x-1">
                                        {category.services.slice(0, 4).map((service, serviceIndex) => (
                                            <button
                                                key={serviceIndex}
                                                onClick={() => handleServiceNavigation(service)}
                                                className="flex items-center px-2 py-1 space-x-1 transition-all duration-200 rounded-md hover:bg-white hover:shadow-sm group"
                                                title={`${service.name} - ${category.category}`}
                                            >
                                                <service.icon className="w-3 h-3 text-gray-500 transition-all duration-200 group-hover:text-gray-700 group-hover:scale-110" />
                                                <span className="text-xs font-medium text-gray-500 transition-colors duration-200 whitespace-nowrap group-hover:text-gray-700">
                                                    {service.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )} */}

            {/* App Launcher Dropdown */}
            {showAppLauncher && (
                <div className="fixed top-16 right-4 sm:right-6 lg:right-8 w-96 max-h-[32rem] bg-white border border-gray-200 rounded-lg shadow-xl app-launcher-dropdown z-50 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                        <p className="text-sm text-gray-500">
                            Accédez rapidement à vos outils de travail
                            {userType && (
                                <span className="px-2 py-1 ml-2 text-xs text-purple-700 bg-purple-100 rounded-full">
                                    {userType === 'etp' ? 'Entreprise' :
                                        userType === 'cfp' ? 'Centre de formation' :
                                            'Particulier'}
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="p-4">
                        {microservicesData.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="mb-6 last:mb-0">
                                <h4 className="px-2 mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                    {category.category}
                                </h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {category.services.map((service, serviceIndex) => (
                                        <button
                                            key={serviceIndex}
                                            onClick={() => handleServiceNavigation(service)}
                                            className="flex flex-col items-center p-3 transition-all duration-300 rounded-lg hover:bg-gray-50 group focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            title={service.name}
                                        >
                                            <div className={`w-10 h-10 bg-gradient-to-br ${service.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-md`}>
                                                <service.icon className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <span className="max-w-full text-xs font-medium leading-tight text-center text-gray-700 line-clamp-2">
                                                {service.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1">
                <div className="px-4 mx-auto sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
};

export default ProtectedLayout;