import axios from "../../config/axios";
import AOS from "aos";
import "aos/dist/aos.css";
import Tabs from "../../components/tabs/Tabs";
import Catalogue from "../../pages/Cfp/catalogue/catalogue";
import icons from "../../components/icons/icone";
import Modal from "../../components/Modals/catalog/Modal";
import { useSearch } from "../../contexts/SearchCatalogContext";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextcatalogProvider";
import { Plus } from 'lucide-react';

export default function CatalogLayout() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const [offlineModules, setOfflineModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //beta
  const [isBetaOpen, setIsBetaOpen] = useState(false);
  const toogleBeta = () => {
    setIsBetaOpen(!isBetaOpen);
  };

  //zone de recherche
  const { searchTerm, setSearchTerm } = useSearch();

  //Animation AOS
  useEffect(() => {
    AOS.init({
      duration: 1000, // durée de l'animation
      once: true, // l'animation se joue une seule fois
    });
  }, []);

  const [activeTab, setActiveTab] = useState("disponible");

  const location = useLocation();
  const [data, setData] = useState();

  const { token,updateModuleCounts,counts } = useStateContext();

  // affichage formation disponible, en préparation, corbeille
  const [modules, setModules] = useState([]);

  const fetchModules = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/cfp/modules");
      const onlineData = response.data.offlineModules || [];
      setOfflineModules(onlineData);
    } catch (error) {
      console.error("Erreur lors de la récupération:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleModuleAdded = (newModule) => {
    const stored = JSON.parse(localStorage.getItem("onlineModules")) || [];
    const updatedStored = [...stored];

    // Chercher le domaine correspondant
    const domainIndex = updatedStored.findIndex(
      (d) => d.domaine === newModule.domaine
    );
    if (domainIndex !== -1) {
      updatedStored[domainIndex].modules.unshift(newModule);
      updatedStored[domainIndex].count_module += 1;
    } else {
      updatedStored.unshift({
        domaine: newModule.domaine,
        modules: [newModule],
        count_module: 1,
      });
    }

    setOfflineModules(updatedStored);
    localStorage.setItem("onlineModules", JSON.stringify(updatedStored));

    updateModuleCounts({
      online : counts.online+1,
      offline: Math.max(counts.offline-1,0),
      trash: Math.max(counts.trash-1,0),
    })
    fetchModules();
  };

  if (!token) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* HEADER */}
        <header className="sticky top-0 z-40 bg-gray-50">
          <div className="w-full px-6 py-4">
            <nav className="flex flex-wrap items-center justify-between gap-y-4">
              {/* LOGO / TITRE */}
              <div className="inline-flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-wide text-gray-800">
                  Catalogue
                </h1>
              </div>

              {/* Navigation par onglets */}
              {(location.pathname === "/cfp/catalogue" ||
                location.pathname === "/cfp/catalogue/preparation" ||
                location.pathname === "/cfp/catalogue/corbeille") && (
                <Tabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  modules={modules}
                />
              )}

              {/* BARRE DE RECHERCHE */}
              {(location.pathname === "/cfp/catalogue" ||
                location.pathname === "/cfp/catalogue/preparation" ||
                location.pathname === "/cfp/catalogue/corbeille") && (
                <div className="w-full sm:w-[25em]">
                  <div className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 shadow-sm rounded-xl ">
                    <input
                      type="text"
                      placeholder="Que cherchez-vous ?"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                    />
                    <icons.search className="ml-2 text-xl text-gray-400" />
                  </div>
                </div>
              )}

              {/* BOUTON AJOUTER */}
              {(location.pathname === "/cfp/catalogue" ||
                location.pathname === "/cfp/catalogue/preparation" ||
                location.pathname === "/cfp/catalogue/corbeille") && (
                <div className="z-50">
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 shadow-md rounded "
                  >
                    <Plus className="text-[14px] text-gray-500" />
                    <span className="hidden sm:inline text-[14px] ">
                      Ajouter un cours
                    </span>
                  </button>
                </div>
              )}

              <Modal
                show={isFormOpen}
                handleClose={() => setIsFormOpen(false)}
                onModuleAdded={handleModuleAdded}
                userType={userType}
              />
            </nav>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-grow">
          <div className="flex flex-col min-h-screen px-4 sm:px-6 lg:px-8">
            {location.pathname === "/cfp/catalogue" ? (
              <Catalogue
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                data={data}
                setData={setData}
                modules={modules}
              />
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
