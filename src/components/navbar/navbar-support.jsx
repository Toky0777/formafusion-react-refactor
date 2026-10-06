import { useState } from "react";
import { useSearchSupport } from "../../contexts/Apprenants/support-search-context";

const NavbarSupportEmploye = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { search, setSearch } = useSearchSupport();

  return (
    <div className="top-0 z-50 w-full bg-gray-100/10 text-slate-600 backdrop-blur-lg h-14 backdrop-saturate-150">
      <div className="flex items-center justify-between w-full h-full px-4">
        {/* Gauche : logo + burger */}
        <div className="flex items-center">
          {/* Mobile menu */}
          <div className="relative dropdown lg:hidden">
            <button
              aria-label="Menu"
              className="btn btn-ghost"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>
          </div>

          {/* Logo */}
          <span className="ml-4 text-xl font-semibold text-gray-700">
            Support de cours
          </span>
        </div>

        <div className="flex-1 flex justify-end ">
          <input
            type="text"
            placeholder="Rechercher un programme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl px-3 py-1.5 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-300 focus:outline-none"
          />
        </div>
        {/* Droite : actions si besoin */}
        <div className="w-12" />
      </div>
    </div>
  );
};

export default NavbarSupportEmploye;
