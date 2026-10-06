import { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { Plus } from "lucide-react";

export const NavBarProforma = () => {
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navLinks = [
    {
      to: "/cfp/proforma",
      label: "Tous les proforma",
      exact: true,
    },
    {
      to: "/cfp/proforma/brouillons",
      label: "Brouillons",
      exact: true,
    },
    {
      to: "/cfp/proforma/converti",
      label: "Convertis",
      exact: true,
    },
  ];

  return (
    <>
      {/* Navbar */}
      <div className="w-full mb-4 bg-white rounded-md backdrop-blur-md">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Titre proforma à gauche */}
          <h1 className="text-xl font-bold text-slate-800">Proforma</h1>

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
            <div className="relative">
              <NavLink to="/cfp/proforma/nouveau-proforma">
                <button
                  onClick={() => setShowNewMenu(!showNewMenu)}
                  className="inline-flex gap-1 items-center rounded bg-gray-100 hover:bg-purple-500 hover:text-white px-3 !py-2 transition duration-200 ease-in-out text-gray-600"
                >
                  <Plus className="w-5" />
                  <span className="hidden md:inline">Nouveau</span>
                </button>
              </NavLink>
            </div>
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
