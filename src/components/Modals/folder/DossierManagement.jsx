import { useState, useEffect } from "react";
import { PlusIcon, MinusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import axios from "../../../config/axios";

const DossierManagement = ({ isOpen, onClose, dossierName = "AGL", dossierId = null, onProjectChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchSans, setSearchSans] = useState("");
  const [searchAvec, setSearchAvec] = useState("");
  const [projetsSansDossier, setProjetsSansDossier] = useState([]);
  const [projetsDansDossier, setProjetsDansDossier] = useState([]);
  const [loadingActions, setLoadingActions] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    setIsVisible(true);
    fetchProjects();
  }, [isOpen, dossierId]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Veuillez vous connecter pour accéder aux projets.");
        return;
      }

const formatProjet = (p) => {
  let clientName = "Client inconnu";

  // CORRECTION : Vérifier d'abord si etp_name existe directement
  if (p.etp_name) {
    clientName = p.etp_name;
  } 
  // CORRECTION : Vérifier le tableau entreprises
  else if (p.entreprises && Array.isArray(p.entreprises) && p.entreprises.length > 0 && p.entreprises[0].etp_name) {
    clientName = p.entreprises[0].etp_name;
  }
  // Garder les autres fallbacks
  else if (p.client_name) {
    clientName = p.client_name;
  } else if (p.entreprise) {
    clientName = p.entreprise;
  } else if (p.name) {
    clientName = p.name;
  }

  return {
    id: p.idProjet,
    nom: p.module_name || "Projet sans nom",
    ref: p.reference || p.project_reference || "N/A",
    client: clientName,
    dates: `${p.dateDebut ? new Date(p.dateDebut).toLocaleDateString() : "N/A"} - ${p.dateFin ? new Date(p.dateFin).toLocaleDateString() : "N/A"}`,
  };
};

      if (dossierId !== null) {
        const resDans = await axios.get(`/cfp/dossier/projets/folder/${dossierId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const projetsDans = Array.isArray(resDans.data)
          ? resDans.data
          : resDans.data?.projets || resDans.data?.data || [];

        setProjetsDansDossier(Array.isArray(projetsDans) ? projetsDans.map(formatProjet) : []);
      } else {
        setProjetsDansDossier([]);
      }

      const resSans = await axios.get(`/cfp/dossier/projets/folder`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { noDossier: true }
      });
      const projetsSans = Array.isArray(resSans.data)
        ? resSans.data
        : resSans.data?.projets || resSans.data?.data || [];

      setProjetsSansDossier(Array.isArray(projetsSans) ? projetsSans.map(formatProjet) : []);
    } catch (error) {
      console.error("Erreur lors du chargement des projets :", error);
      toast.error(`Erreur lors du chargement des projets : ${error.message}`);
    }
  };

  const filterProjet = (projets, search) =>
    projets.filter((p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.ref.toLowerCase().includes(search.toLowerCase())
    );

  const onAdd = async (projet) => {
    // Mise à jour IMMÉDIATE de l'UI
    setProjetsSansDossier((prev) => prev.filter((p) => p.id !== projet.id));
    setProjetsDansDossier((prev) => [...prev, projet]);
    
    setLoadingActions(prev => ({ ...prev, [projet.id]: true }));
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/cfp/dossier/document/ajouter/${dossierId}/${projet.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Projet ajouté avec succès !");
        if (typeof onProjectChange === "function") {
          onProjectChange(); // Rafraîchissement silencieux du parent
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du projet :", error);
      toast.error(`Erreur lors de l'ajout du projet : ${error.message}`);
      // Rollback en cas d'erreur
      setProjetsSansDossier((prev) => [...prev, projet]);
      setProjetsDansDossier((prev) => prev.filter((p) => p.id !== projet.id));
    } finally {
      setLoadingActions(prev => ({ ...prev, [projet.id]: false }));
    }
  };

  const onRemove = async (projet) => {
    // Mise à jour IMMÉDIATE de l'UI
    setProjetsDansDossier((prev) => prev.filter((p) => p.id !== projet.id));
    setProjetsSansDossier((prev) => [...prev, projet]);
    
    setLoadingActions(prev => ({ ...prev, [projet.id]: true }));
    
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/cfp/dossier/document/supprimer/${dossierId}/${projet.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Projet retiré avec succès !");
      if (typeof onProjectChange === "function") {
        onProjectChange(); // Rafraîchissement silencieux du parent
      }
    } catch (error) {
      console.error("Erreur lors du retrait du projet :", error);
      toast.error(`Erreur lors du retrait du projet : ${error.message}`);
      // Rollback en cas d'erreur
      setProjetsDansDossier((prev) => [...prev, projet]);
      setProjetsSansDossier((prev) => prev.filter((p) => p.id !== projet.id));
    } finally {
      setLoadingActions(prev => ({ ...prev, [projet.id]: false }));
    }
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className={`absolute inset-0 backdrop-blur-sm bg-black/40 transition-opacity duration-500 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      />
      <div
        className={`bg-white w-full md:w-3/4 lg:w-2/3 xl:w-1/2 h-full ml-auto shadow-lg transform transition-all duration-500 ease-in-out ${isOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"
          }`}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b border-gray-300 shadow-sm">
          <p className="text-xl font-semibold text-gray-700">
            Gestion du dossier : <span className="font-bold text-purple-600">{dossierName}</span>
          </p>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 transition-colors rounded-md hover:bg-gray-200"
            disabled={Object.values(loadingActions).some(loading => loading)}
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-[calc(100%-64px)]">
          {/* Colonne Projets sans dossier */}
          <div className="flex flex-col w-full p-4 overflow-hidden border-r border-gray-200 md:w-1/2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-6 bg-red-500 rounded-sm" />
              <h2 className="text-lg font-bold text-gray-700">Projets sans dossier</h2>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher un projet"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={searchSans}
                onChange={(e) => setSearchSans(e.target.value)}
              />
              <p className="mt-1 text-sm text-gray-500">
                {filterProjet(projetsSansDossier, searchSans).length} projet(s) trouvé(s)
              </p>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="h-full pr-2 overflow-y-auto custom-scrollbar">
                {filterProjet(projetsSansDossier, searchSans).length > 0 ? (
                  <ul className="space-y-3">
                    {filterProjet(projetsSansDossier, searchSans).map((projet) => (
                      <li
                        key={projet.id}
                        className="flex items-center justify-between p-3 transition border rounded-md shadow-sm cursor-pointer bg-gray-50 hover:bg-white group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{projet.nom}</p>
                          <div className="flex flex-wrap justify-between mt-1 text-xs text-gray-500">
                            <span className="truncate">Ref: {projet.ref}</span>
                            <span className="truncate">{projet.client}</span>
                          </div>
                          <p className="mt-1 text-xs text-gray-600">{projet.dates}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAdd(projet);
                          }}
                          disabled={loadingActions[projet.id]}
                          className="flex items-center justify-center w-8 h-8 ml-3 text-green-600 transition-colors bg-green-100 rounded-full opacity-0 hover:bg-green-200 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Ajouter au dossier"
                        >
                          {loadingActions[projet.id] ? (
                            <div className="w-4 h-4 border-t-2 border-b-2 border-green-600 rounded-full animate-spin"></div>
                          ) : (
                            <PlusIcon className="w-4 h-4" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <i className="mb-2 text-4xl fa-regular fa-folder-open"></i>
                    <p>Aucun projet trouvé</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colonne Projets dans ce dossier */}
          <div className="flex flex-col w-full p-4 overflow-hidden md:w-1/2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-6 bg-green-500 rounded-sm" />
              <h2 className="text-lg font-bold text-gray-700">Projets dans ce dossier</h2>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher un projet"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={searchAvec}
                onChange={(e) => setSearchAvec(e.target.value)}
              />
              <p className="mt-1 text-sm text-gray-500">
                {filterProjet(projetsDansDossier, searchAvec).length} projet(s) dans ce dossier
              </p>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="h-full pr-2 overflow-y-auto custom-scrollbar">
                {filterProjet(projetsDansDossier, searchAvec).length > 0 ? (
                  <ul className="space-y-3">
                    {filterProjet(projetsDansDossier, searchAvec).map((projet) => (
                      <li
                        key={projet.id}
                        className="flex items-center justify-between p-3 transition border rounded-md shadow-sm cursor-pointer bg-gray-50 hover:bg-white group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{projet.nom}</p>
                          <div className="flex flex-wrap justify-between mt-1 text-xs text-gray-500">
                            <span className="truncate">Ref: {projet.ref}</span>
                            <span className="truncate">{projet.client}</span>
                          </div>
                          <p className="mt-1 text-xs text-gray-600">{projet.dates}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(projet);
                          }}
                          disabled={loadingActions[projet.id]}
                          className="flex items-center justify-center w-8 h-8 ml-3 text-red-600 transition-colors bg-red-100 rounded-full opacity-0 hover:bg-red-200 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Retirer du dossier"
                        >
                          {loadingActions[projet.id] ? (
                            <div className="w-4 h-4 border-t-2 border-b-2 border-red-600 rounded-full animate-spin"></div>
                          ) : (
                            <MinusIcon className="w-4 h-4" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <i className="mb-2 text-4xl fa-regular fa-folder-open"></i>
                    <p>Aucun projet dans ce dossier</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c4b5fd;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #8b5cf6;
        }
      `}</style>
    </div>
  );
};

export default DossierManagement;