import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProgrammeDetail } from "../../../../hooks/SupportApi";
import { Spinner } from "../../../../components/ui/spinner";
import { API_URL } from "../../../../config/env";

function ProgramDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [programme, setProgramme] = useState(null);
  const [moduleRessources, setModuleRessources] = useState([]);
  const [sumHourSession, setSumHourSession] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProgrammeDetail(id)
      .then((res) => {
        setProgramme(res.data.projects);
        setModuleRessources(res.data.module_ressources || []);
        setSumHourSession(res.data.sumHourSession || "");
        // console.log(res.data.sumHourSession);

        setError(null);
      })
      .catch(() => setError("Erreur lors du chargement du programme."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center text-red-500 h-96">
        {error}
      </div>
    );
  }

  if (!programme) {
    return (
      <div className="flex items-center justify-center h-96">
        Aucun détail trouvé.
      </div>
    );
  }

  // Couleurs pour la modalité
  const modaliteColors = {
    Présentielle: "bg-[rgba(160,90,160,0.6)]/10 text-fuchsia-900",
    "En ligne": "bg-[#fca311]/20 text-[#fca311]",
    Blended: "bg-[#005f73]/20 text-[#005f73]",
  };
  const modaliteClass =
    modaliteColors[programme.modalite] || "bg-gray-100 text-gray-600";

  return (
    <main className="flex-1 pb-10 overflow-y-auto">
      <div className="container px-4 py-6 mx-auto">
        <div className="space-y-8">
          <div className="mb-4">
            <Link
              to="/particulier/support"
              className="inline-flex items-center mb-4 text-fuchsia-800 hover:text-purple-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 lucide lucide-arrow-left"
              >
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              Retour à la liste
            </Link>
          </div>
          <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm">
            <div className="h-2 bg-gradient-to-r from-fuchsia-700 to-fuchsia-700"></div>
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {programme.module_name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-xl w-max text-sm ${modaliteClass}`}
                >
                  {programme.modalite || "Non renseignée"}
                </span>
              </div>
              <div className="flex flex-wrap mb-4 text-sm text-gray-600 gap-x-6 gap-y-2">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-calendar mr-1.5 text-blue-900"
                  >
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                    <path d="M3 10h18"></path>
                  </svg>
                  <span>{programme.dateDebut}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-clock mr-1.5 text-fuchsia-900"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>

                  <span>Durée: {sumHourSession}</span>
                </div>
              </div>
              <p className="mb-6 text-sm text-gray-700">
                {programme.project_description}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-purple-50 text-purple-700">
                  Centre: {programme.cfp_name}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Supports de cours
              </h2>
              {moduleRessources.length > 0 && (
                <a
                  href={`${API_URL}/projetsEmp/${programme.idProjet}/download-all`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-purple-600 rounded-md hover:bg-purple-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-download mr-1.5"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" x2="12" y1="15" y2="3"></line>
                  </svg>
                  Tout télécharger
                </a>
              )}
            </div>
            <div className="space-y-4">
              {moduleRessources.length === 0 ? (
                <p className="italic text-gray-600">Aucun support disponible</p>
              ) : (
                moduleRessources.map((module) => (
                  <div
                    key={module.idModuleRessource}
                    className="overflow-hidden transition-all duration-200 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5 text-gray-500 lucide lucide-file-text"
                        >
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                          <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                          <path d="M10 9H8"></path>
                          <path d="M16 13H8"></path>
                          <path d="M16 17H8"></path>
                        </svg>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {module.name}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-1 text-xs font-medium text-red-700 rounded-full bg-red-50">
                          {module.ext}
                        </span>
                        <a
                          className="inline-flex items-center text-gray-400 text-center cursor-pointer hover:text-[#A462A4]"
                          href={`${API_URL}/projetsEmp/${module.idModuleRessource}/download`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-download mr-1.5"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" x2="12" y1="15" y2="3"></line>
                          </svg>
                          Télécharger
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProgramDetail;
