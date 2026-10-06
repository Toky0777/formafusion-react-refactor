import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaUserCog } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { BookCheck, ChevronDown, FileText, FileUp, HandCoins, Plus } from "lucide-react";

export const NavBarFacture = () => {
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef(null);

  const navLinks = [
    {
      to: "/cfp/facture/tableau-de-bord",
      label: "Dashboard",
      exact: true,
    },
    {
      to: "/cfp/facture",
      label: "Toutes les factures",
      exact: true,
    },
    {
      to: "/cfp/facture/non-paye",
      label: "Non payées",
      exact: true,
    },
    {
      to: "/cfp/facture/echue",
      label: "Échues",
      exact: true,
    },
    {
      to: "/cfp/facture/brouillons",
      label: "Brouillons",
      exact: true,
    },
    {
      to: "/cfp/facture/facture-acompte",
      label: "Acomptes",
      exact: true,
    },
  ];

  return (
    <>
      {/* Navbar */}
      <div className="z-10 w-full mb-4 bg-white rounded-md backdrop-blur-md">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Titre Facture à gauche */}
          <h1 className="text-xl font-bold text-slate-800">Facture</h1>

          {/* Bouton menu mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {showMobileMenu ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>

          {/* Liens de navigation (desktop) */}
          <div className="hidden gap-3 lg:flex">
            {navLinks.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `relative flex items-center justify-center w-44 px-4 py-2 border rounded-lg shadow-sm font-medium text-sm transition-all
                ${isActive
                    ? `border-purple-600 text-purple-600`
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Actions à droite */}
          <div className="flex items-center space-x-3">
            {/* Bouton Nouveau */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowNewMenu(!showNewMenu)}
                className="inline-flex gap-1 items-center rounded bg-gray-100 hover:bg-purple-500 hover:text-white px-3 !py-2 transition duration-200 ease-in-out text-gray-600"
              >
                <Plus className="w-5" />
                <span className="hidden md:inline">Nouveau</span>
                <ChevronDown className="w-4" />
              </button>

              {/* Dropdown Menu */}
              {showNewMenu && (
                <div className="absolute left-0 w-48 mt-1 bg-white border border-gray-200 rounded-md shadow-lg top-full">
                  <NavLink
                    to="/cfp/facture/nouveau-facture"
                    className="block px-4 py-2 text-sm text-gray-700 transition duration-150 ease-in-out hover:bg-purple-50 hover:text-purple-700"
                    onClick={() => setShowNewMenu(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Facture</span>
                    </div>
                  </NavLink>

                  <NavLink
                    to="/cfp/facture/nouveau-facture-acompte"
                    className="block px-4 py-2 text-sm text-gray-700 transition duration-150 ease-in-out hover:bg-purple-50 hover:text-purple-700"
                    onClick={() => setShowNewMenu(false)}
                  >
                    <div className="flex items-center gap-2">
                      <HandCoins className="w-4 h-4" />
                      <span>Facture d'acompte</span>
                    </div>
                  </NavLink>
                  <NavLink
                    to="/cfp/facture/nouveau-facture-solde"
                    className="block px-4 py-2 text-sm text-gray-700 transition duration-150 ease-in-out hover:bg-purple-50 hover:text-purple-700"
                    onClick={() => setShowNewMenu(false)}
                  >
                    <div className="flex items-center gap-2">
                      <FileUp className="w-4 h-4" />
                      <span>facture finale</span>
                    </div>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Mon compte */}
            <NavLink
              to="/cfp/facture/compte"
              className="flex gap-2 items-center rounded border-[1px] border-gray-200 px-3 text-gray-600 !py-2 transition duration-200 ease-in-out hover:bg-purple-100 hover:text-purple-600"
            >
              <BookCheck className="w-5" />
              <span className="hidden md:inline">Mes compte</span>
            </NavLink>
          </div>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white border-t shadow-md lg:hidden"
            >
              <div className="flex flex-col p-3 space-y-2">
                {navLinks.map(({ to, label, exact }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={exact}
                    onClick={() => setShowMobileMenu(false)}
                    className={({ isActive }) =>
                      `block w-full px-4 py-2 rounded-md font-medium text-sm transition-all
                    ${isActive
                        ? `border-purple-600 text-purple-600`
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}

                {/* Mon compte (mobile) */}
                <NavLink
                  to="/cfp/facture/compte"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex gap-2 items-center rounded bg-gray-300 px-3 py-2 transition duration-200 ease-in-out !text-black"
                >
                  <FaUserCog />
                  <span>Mes compte</span>
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
