import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Plus,
  List,
  Coins,
  History,
  Mail,
  Home,
  ShoppingCart,
  Menu,
  X,
  BookOpen,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../config/axios";
import { useAuth } from "../../contexts/AuthContext";

export function NavBarTestEmp() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [walletAuthUser, setWalletAuthUser] = useState(null);
  const { user } = useAuth();
  const role = localStorage.getItem("rle_d");

  // Navigation states
  const dropdownMenuRef = useRef(null);
  const [titleMenu, setTitleMenu] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const WalletReq = async () => {
    try {
      const response = await axios.get(`/credits-wallet/${user?.id}`, {});
      setWalletAuthUser(response.data.solde);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  useEffect(() => {
    WalletReq();
  }, []);

  // ✅ Menus
  const menus = [
    {
      menu_title: "Accueil",
      menu_icon: "home",
      menu: 1,
      label: "Accueil",
      endpoint: "qcm/index",
      route: "/particulier/test",
      icon: "home",
    },
    {
      menu_title: "Campagnes et invitations",
      menu_icon: "envelope",
      menu: 2,
      label: "Liste des campagnes",
      endpoint: "qcm/invitations-index",
      route: "/particulier/test/qcm/invitations-index",
      icon: "list",
    },
  ];

  // Grouper les menus
  function groupMenusByLabelTC(menus) {
    return menus.reduce((grouped, menu) => {
      const title = menu.menu_title;
      if (!grouped[title]) {
        grouped[title] = {
          items: [],
          icon: menu.menu_icon || null,
        };
      }
      grouped[title].items.push(menu);
      return grouped;
    }, {});
  }

  const groupMenus = groupMenusByLabelTC(menus);

  // Gérer dropdown
  const toggleDropdown = (title) => {
    setTitleMenu(titleMenu === title ? null : title);
    setOpenMenu(titleMenu !== title || !openMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target)
      ) {
        setOpenMenu(false);
        setTitleMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Rendu icônes
  const getIcon = (iconName) => {
    switch (iconName) {
      case "home":
        return <Home className="w-4 h-4" />;
      case "plus":
        return <Plus className="w-4 h-4" />;
      case "list":
        return <List className="w-4 h-4" />;
      case "coins":
        return <Coins className="w-4 h-4" />;
      case "history":
        return <History className="w-4 h-4" />;
      case "mail":
        return <Mail className="w-4 h-4" />;
      case "shopping-cart":
        return <ShoppingCart className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* NavBar */}
      <motion.div
        className="relative bg-white shadow-sm border-b border-gray-100 fixed top-0 "
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient de fond subtil */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/30 via-white to-blue-50/30 pointer-events-none" />

        <div className="relative px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between w-full mx-auto">
            {/* Section gauche - Logo et titre */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>

                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Testing Center
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Centre de tests particuliers
                  </p>
                </div>
              </div>

              {/* Solde wallet - Version desktop */}
              {role === 9 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="hidden lg:flex"
                >
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm p-3 border border-indigo-100">
                    <div className="flex items-center space-x-2 text-sm">
                      <Coins className="w-4 h-4 text-indigo-500" />
                      <span className="text-gray-600">Solde :</span>
                      <span className="font-bold text-indigo-600">
                        {walletAuthUser} crédits
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Section centrale - Navigation desktop */}
            <div className="hidden lg:flex items-center gap-2">
              {Object.entries(groupMenus).map(([menuTitle, group]) =>
                group.items.length > 1 ? (
                  <div
                    key={menuTitle}
                    className="relative"
                    ref={dropdownMenuRef}
                  >
                    <motion.button
                      onClick={() => toggleDropdown(menuTitle)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium shadow-sm text-sm
                        ${
                          openMenu && titleMenu === menuTitle
                            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-200"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md"
                        }`}
                    >
                      {getIcon(group.items[0].icon)}
                      <span>{menuTitle}</span>
                      <motion.div
                        animate={{
                          rotate: openMenu && titleMenu === menuTitle ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {titleMenu === menuTitle && openMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-50 w-64 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden"
                        >
                          {group.items.map((menu, index) => (
                            <Link
                              key={index}
                              to={menu.route}
                              className="flex items-center px-4 py-3 text-gray-600 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600 border-b border-gray-50 last:border-b-0"
                            >
                              <div className="p-1 rounded-lg bg-gray-100 mr-3">
                                {getIcon(menu.icon)}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {menu.label}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div key={menuTitle}>
                    <Link
                      to={group.items[0].route}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium shadow-sm text-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md"
                    >
                      {getIcon(group.items[0].icon)}
                      <span>{menuTitle}</span>
                    </Link>
                  </motion.div>
                )
              )}
            </div>

            {/* Section droite - Bouton menu mobile */}
            <div className="flex items-center gap-3">
              {user && (
                <motion.button
                  onClick={toggleMobileMenu}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium shadow-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md"
                  aria-label="Menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                  <span className="hidden sm:block text-sm">Menu</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-b shadow-lg overflow-hidden"
          >
            <div className="p-4 space-y-3 bg-gradient-to-b from-gray-50/50 to-white">
              {/* Solde mobile */}
              {role === 9 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mb-4"
                >
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm p-3 border border-indigo-100">
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <Coins className="w-4 h-4 text-indigo-500" />
                      <span className="text-gray-600">Solde :</span>
                      <span className="font-bold text-indigo-600">
                        {walletAuthUser} crédits
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {Object.entries(groupMenus).map(([menuTitle, group]) =>
                group.items.length > 1 ? (
                  <div key={menuTitle} className="space-y-2">
                    <motion.button
                      onClick={() => toggleDropdown(menuTitle)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex items-center justify-between w-full px-4 py-3 text-left bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                          <div className="text-white w-4 h-4 flex items-center justify-center">
                            {getIcon(group.items[0].icon)}
                          </div>
                        </div>
                        <span className="font-medium text-gray-700">
                          {menuTitle}
                        </span>
                      </div>
                      <motion.div
                        animate={{
                          rotate: openMenu && titleMenu === menuTitle ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {titleMenu === menuTitle && openMenu && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-4 space-y-2 overflow-hidden"
                        >
                          {group.items.map((menu, index) => (
                            <Link
                              key={index}
                              to={menu.route}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-gray-600 bg-white border border-gray-100 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 shadow-sm"
                            >
                              <div className="p-1 rounded bg-gray-100">
                                {getIcon(menu.icon)}
                              </div>
                              <span className="text-sm font-medium">
                                {menu.label}
                              </span>
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
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                      <div className="text-white w-4 h-4 flex items-center justify-center">
                        {getIcon(group.items[0].icon)}
                      </div>
                    </div>
                    <span className="font-medium text-gray-700">
                      {menuTitle}
                    </span>
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
