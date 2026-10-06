import { Search } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import TabsFormateur from '../tabs/tabsFormateur';

   

const NavbarTrainer = ({ setShowModalAjout, search, setSearch }) => {
    const { t } = useTranslation();
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="px-4 py-2">
                <div className="flex items-center justify-between w-full px-2 py-2 mx-auto NavbarHome">
                       <div className="relative flex items-center bg-white rounded  border border-gray-100 transition-all duration-200 hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/20">
                           <Search className="absolute right-2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher nom..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="px-4 py-1 text-black bg-white border rounded"
                            />
                        </div>

                        <TabsFormateur/>
                        <button onClick={() => setShowModalAjout(true)} className="bg-white font-semibold flex items-center px-3 py-2 text-gray-500 hover:border-purple-600 cursor-pointer rounded" >
                            <span className="text-lg text-gray-500">+</span>
                            <span className="hidden md:block text-gray-600">Ajouter Nouveau Formateur</span>
                        </button>
                    </div>
                </div>
            

        </>
    );
};

export default NavbarTrainer;
