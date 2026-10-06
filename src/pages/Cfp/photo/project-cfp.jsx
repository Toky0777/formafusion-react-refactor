import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../config/axios";
import { PhotoContext } from "../../../contexts/Apprenants/PhotoProvider";
import { Spinner } from "../../../components/ui/spinner";

export function ProjetCfp() {
  const location = useLocation();
  const idDossier = location.state?.idFolder;
  const folder_name = location.state?.folder_name;

  const [loading, setLoading] = useState(false);
  const [projectsFolder, setProjectsFolder] = useState({
    nomDossier: "",
    minDate: null,
    maxDate: null,
    projets: []
  });
  const { searchTerm } = useContext(PhotoContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!idDossier) return;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/cfp/gallery/project/${idDossier}`);
        // ✅ Structure sécurisée avec valeurs par défaut
        setProjectsFolder({
          nomDossier: response.data?.nomDossier || folder_name || "",
          minDate: response.data?.minDate || null,
          maxDate: response.data?.maxDate || null,
          projets: response.data?.projets || []
        });
      } catch (err) {
        console.error("Erreur lors du chargement des projets:", err);
        setProjectsFolder({
          nomDossier: folder_name || "",
          minDate: null,
          maxDate: null,
          projets: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [idDossier, folder_name]);

  // ✅ Fonction de formatage sécurisée
  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    // Vérification que c'est une date valide
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr; // Retourne la chaîne originale si invalide
    }

    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  if (loading) return <Spinner />;

  // ✅ Filtrage sécurisé
  const results = projectsFolder.projets.filter((item) => {
    if (!item) return false;

    const searchFields = [
      item.moduleName,
      item.ville_name,
      item.dateDebut,
      item.dateFin,
    ].filter(Boolean); // Retire les valeurs null/undefined

    return searchFields.some((field) =>
      field.toLowerCase().includes(searchTerm?.toLowerCase() || "")
    );
  });

  // ✅ Passez `loading` en prop à Dashboard
  return (
    <Dashboard
      nomDossier={projectsFolder.nomDossier}
      minDate={formatDate(projectsFolder.minDate)}
      maxDate={formatDate(projectsFolder.maxDate)}
      projets={results}
      loading={loading} // ← Ajoutez cette ligne
    />
  );
}

// ✅ Ajoutez `loading` comme prop dans Dashboard
const Dashboard = ({ nomDossier, minDate, maxDate, projets = [], loading }) => {
  const navigate = useNavigate();

  return (
    <main className="px-4 py-6 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4"
      >
        <button
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => navigate(-1)}
        >
          <svg
            className="w-6 h-6 lucide lucide-chevron-left"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{nomDossier || "Dossier"}</h1>
          {(minDate || maxDate) && (
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
              <span>
                {minDate || "Date inconnue"}
                {(minDate && maxDate) && " - "}
                {maxDate || ""}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Liste des projets */}
      {projets.length > 0 ? (
        <div className="grid gap-4 justify-center grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
          {projets.map((projet, index) => (
            <motion.div
              key={projet.idProjet || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="transition-all duration-300 bg-white shadow-md cursor-pointer rounded-xl hover:shadow-xl"
              onClick={() =>
                navigate(`/cfp/photos/ajout/${projet.idProjet}`, {
                  state: {
                    project_titre: projet.moduleName,
                    start_date: projet.dateDebut,
                    end_date: projet.dateFin,
                  },
                })
              }
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-gray-100 aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  {projet.image ? (
                    <img
                      src={projet.image}
                      alt={projet.moduleName || "Projet"}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {projet.moduleName || "Nom du projet"}
                </h3>
                {projet.ville_name && (
                  <p className="text-sm text-gray-600 truncate">
                    {projet.ville_name}
                  </p>
                )}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
                    </svg>
                    <span>{projet.countImage || 0} photos</span>
                  </div>
                  {(projet.dateDebut || projet.dateFin) && (
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <path d="M3 10h18" />
                      </svg>
                      <span>
                        {projet.dateDebut || ""}
                        {(projet.dateDebut && projet.dateFin) && " - "}
                        {projet.dateFin || ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-500"
        >
          {loading ? "Chargement..." : "Aucun projet"} {/* ← Ici vous utilisez loading */}
        </motion.p>
      )}
    </main>
  );
};