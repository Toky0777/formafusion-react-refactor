import { Search, Plus } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NavbarSubcontractor = ({ setShowModalAjout, search, setSearch }) => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="px-6 py-4">
        <div className="flex items-center justify-between w-full gap-4 px-6 py-4 mx-auto NavbarHome rounded-2xl">
          {/* Barre de recherche améliorée */}
          <div className="relative flex items-center flex-1 max-w-md group">
            <Search className="absolute text-gray-400 transition-colors left-4 group-hover:text-purple-500" size={20} />
            <input
              type="text"
              placeholder="Rechercher un sous-traitant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-3 pl-12 pr-4 text-gray-700 transition-all duration-300 bg-gray-50 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100 hover:bg-white"
            />
          </div>

          {/* Bouton d'ajout amélioré */}
          <button
            onClick={() => setShowModalAjout(true)}
            className="flex items-center gap-2 px-5 py-3 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl hover:from-gray-700 hover:to-gray-800 hover:scale-105 active:scale-95"
          >
            <Plus size={20} className="font-bold" />
            <span className="hidden md:block whitespace-nowrap">
              Ajouter un Sous-traitant
            </span>
            <span className="block md:hidden">Ajouter</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default NavbarSubcontractor;