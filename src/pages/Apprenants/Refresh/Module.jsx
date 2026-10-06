import  { useEffect, useState } from "react";
import axios from "../../../config/axios";
import { useModuleContext } from "../../../contexts/ModuleContext";
import { useNavigate } from "react-router-dom";
import { IMAGE_URL } from "../../../config/env";

const digitalOceanBaseUrl =
  IMAGE_URL;

export default function ModuleApprenant({ key }) {
  const { setIdModule } = useModuleContext();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const moduleData = [
    {
      key: 1,
      url: "apprenant/refresh/getModuleApprenant",
    },
  ];

  const getUrl = (key) => {
    console.log(moduleData[0]);

    let result = moduleData.find((m) => m.key === key)?.url;
    if (result == null) {
      result = moduleData[0].url;
    }
    return result;
  };

  const redirectToModule = (id) => {
    setIdModule(id);
    localStorage.setItem("idModule", id);
    navigate("/apprenant/refresh/creer");
  };  

  useEffect(() => {
    async function fetchModules() {
      try {
        // Simulation de progression (remplacer par votre logique réelle)
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 80) {
              clearInterval(interval);
              return prev;
            }
            return prev + 10;
          });
        }, 300);

        const response = await axios.get(getUrl(key));
        setModules(response.data.modules);
        console.log(response.data.modules);

        setProgress(100);
        setTimeout(() => setLoading(false), 500); // Petit délai pour l'animation
      } catch (error) {
        console.log("Erreur lors de la récupération des modules");
        console.log(error);

        setLoading(false);
      }
    }

    fetchModules();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <div
            className={`relative ${
              progress >= 100 ? "opacity-0 scale-90" : "opacity-100"
            } transition-all duration-500`}
          >
            <div
              className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                progress >= 100 ? "border-green-500" : "border-purple-500"
              }`}
            ></div>
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <div className="w-6 h-6 rounded-full animate-pulse bg-purple-400/30"></div>
            </div>
          </div>

          <p className="text-lg font-medium text-gray-700 animate-pulse">
            {progress >= 100 ? (
              <span className="flex items-center text-green-600"> </span>
            ) : (
              `Chargement des modules...${progress}% `
            )}
          </p>

          <div className="w-48 h-2.5 bg-gray-200 rounded-full overflow-hidden relative">
            <div
              className="h-full transition-all duration-300 ease-out bg-gradient-to-r from-purple-400 to-blue-500"
              style={{ width: `${progress}%` }}
            ></div>

            {/* Animation de complétion */}
            {progress >= 100 && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 animate-pulse-scale"></div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4 sm:p-6 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Liste des modules
        </h1>
        <div className="text-sm text-gray-500">
          {modules.length} module{modules.length > 1 ? "s" : ""} disponible
          {modules.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {modules.map((module) => (
          <div
            key={module.idModule}
            className="group p-4 sm:p-5 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md hover:border-blue-100 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => redirectToModule(module.idModule)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-3">
                <p className="mb-1 text-xs font-medium text-gray-500 truncate sm:text-sm">
                  {module.module_name}
                </p>
                <p className="text-base font-bold text-gray-900 truncate sm:text-xl">
                  {module.project_reference || "--"}
                </p>
              </div>

              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 overflow-hidden transition-colors border-2 border-blue-200 rounded-lg sm:w-12 sm:h-12 bg-blue-50 group-hover:border-blue-300">
                  {module.module_image ? (
                    <img
                      src={`${digitalOceanBaseUrl}/img/modules/${module.module_image}`}
                      alt={`Image du module ${module.module_name}`}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  ) : (
                    <DefaultModuleIcon />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modules.length === 0 && (
        <div className="py-12 text-center">
          {/* <DefaultModuleIcon /> */}
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Aucun module disponible
          </h3>
        </div>
      )}
    </div>
  );
}

function DefaultModuleIcon() {
  return (
    <svg
      className="w-5 h-5 text-blue-400 sm:w-6 sm:h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );
}
