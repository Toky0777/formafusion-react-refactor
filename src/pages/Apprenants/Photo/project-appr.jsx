import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import useApi from "../../../hooks/Api";
import { PhotoContext } from "../../../contexts/Apprenants/PhotoProvider";
import { Spinner } from "../../../components/ui/spinner";

export function ProjectAppr() {
  const location = useLocation();
  const idDossier = location.state?.idFolder;
  const folder_name = location.state?.folder_name;
  const { loading, error, callApi } = useApi();
  const [projectsFolder, setProjectsFolder] = useState(null);
  const { searchTerm } = useContext(PhotoContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!idDossier) return;

    const fetchProjects = async () => {
      try {
        const url = `/employes/projets/dossiers/${idDossier}`;
        const responseData = await callApi(url, { method: "GET" });
        setProjectsFolder(responseData);
      } catch (err) {
        console.error("Erreur lors du chargement des projets:", err);
      }
    };

    fetchProjects();
  }, [idDossier, callApi]);

  if (loading || projectsFolder === null) return <Spinner />;
  if (error) return <div>Erreur : {error}</div>;

  const results =
    projectsFolder.projects?.filter((item) =>
      [
        item.project_title?.replace(/\s+/g, ""),
        item.project_name?.replace(/\s+/g, ""),
        item.project_start_date?.replace(/\s+/g, ""),
        item.project_end_date?.replace(/\s+/g, ""),
        item.ville_name?.replace(/\s+/g, ""),
      ].some((field) =>
        field
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase().replace(/\s+/g, "") || "")
      )
    ) || [];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <main className="py-6 mx-auto space-y-8  sm:px-6 lg:px-8">
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
        <h1 className="text-3xl font-bold text-gray-900">{folder_name}</h1>
      </motion.div>

      {/* Liste des projets */}
      {results.length > 0 ? (
        <div className="grid gap-4 justify-center grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {results.map((projet, index) => (
            <motion.div
              key={projet.idProjet}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="transition-all duration-300 bg-white shadow-md cursor-pointer rounded-2xl hover:shadow-xl"
              onClick={() =>
                navigate("/particulier/photo/ajout", {
                  state: {
                    idProjet: projet.idProjet,
                    project_titre: projet.project_title,
                    start_date: formatDate(projet.project_start_date),
                    end_date: formatDate(projet.project_end_date),
                  },
                })
              }
            >
              {/* Image */}
              <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden rounded-t-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  {projet.image ? (
                    <img
                      src={projet.image}
                      alt={projet.project_title}
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
              <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {projet.project_title || projet.project_name}
                </h3>
                <p className="text-xs text-gray-600 truncate">
                  {projet.ville_name}
                </p>
                <div className="flex items-center text-xs text-gray-500">
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
                    {formatDate(projet.project_start_date)} –{" "}
                    {formatDate(projet.project_end_date)}
                  </span>
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
          Aucun projet
        </motion.p>
      )}
    </main>
  );
}
