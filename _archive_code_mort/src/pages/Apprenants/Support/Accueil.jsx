import { useEffect, useState } from "react";
import { fetchHomeEmp } from "../../../hooks/SupportApi";
import CardProgramme from "../../../components/card/CardProgramme";
import { Link } from "react-router-dom";

function Accueil() {
  const [loading, setLoading] = useState(true);
  const [countCfp, setCountCfp] = useState(0);
  const [countProg, setCountProg] = useState(0);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHomeEmp()
      .then((res) => {
        setCountCfp(res.data.count_cfp || 0);
        setCountProg(res.data.count_prog || 0);
        setProjects(res.data.projects || []);
        setError(null);
      })
      .catch(() => {
        setError("Vous devez être connecté pour voir cette page.");
        setCountCfp(0);
        setCountProg(0);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#A462A4]/5 backdrop-brightness-50">
        <div className="px-8 py-5 bg-white rounded-3xl border border-white/20 shadow-lg">
          <div className="flex flex-col items-center">
            {/* Spinner personnalisé */}
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute inset-0 border-4 border-transparent border-t-[#A462A4] border-r-[#A462A4] rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-transparent border-b-[#A462A4] border-l-[#A462A4] rounded-full animate-spin-reverse"></div>
            </div>
            <span className="text-sm font-light tracking-widest">
              VEUILLEZ PATIENTER
            </span>
            {/* Points animés */}
            <div className="flex mt-4 space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-[#A462A4] rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/70">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md mx-auto">
          <div className="text-red-500 text-center text-5xl animate-bounce">
            ⚠️
          </div>
          <h3 className="text-xl text-center font-semibold text-red-500 mb-4">
            Une erreur est survenue
          </h3>
          <p className="text-gray-600 text-center mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 pb-10 overflow-y-auto pt-8">
      <div className="container mx-auto">
        <div className="space-y-8">
          {/* Cartes des stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Link
              to="/particulier/support/centre"
              className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-md group"
            >
              <div className="flex items-center">
                <div className="p-3 transition-colors rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100">
                  {/* Icône Centre */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-building"
                  >
                    <rect
                      width="16"
                      height="20"
                      x="4"
                      y="2"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M9 22v-4h6v4"></path>
                    <path d="M8 6h.01"></path>
                    <path d="M16 6h.01"></path>
                    <path d="M12 6h.01"></path>
                    <path d="M12 10h.01"></path>
                    <path d="M12 14h.01"></path>
                    <path d="M16 10h.01"></path>
                    <path d="M16 14h.01"></path>
                    <path d="M8 10h.01"></path>
                    <path d="M8 14h.01"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Centres
                  </h3>
                  <p className="text-gray-500">{countCfp} centre partenaire</p>
                </div>
              </div>
            </Link>

            <Link
              to="/particulier/support/programmes"
              className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-md group"
            >
              <div className="flex items-center">
                <div className="p-3 transition-colors rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200">
                  {/* Icône Programme */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-book-open"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Programmes
                  </h3>
                  <p className="text-gray-500">
                    {countProg} programme disponible
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Programmes récents */}
          <div className="pt-6">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 text-center">
                Programmes récemment terminés (moins de 3 mois)
              </h2>
              {projects.length === 0 ? (
                <p className="text-center">Aucun programme</p>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-center">
                  {projects.map((pro) => (
                    <CardProgramme
                      key={pro.idProjet}
                      route={`/particulier/support/programmes/${pro.idProjet}`}
                      module_name={pro.module_name}
                      cfp_name={pro.cfp_name}
                      description={pro.project_description}
                      dateDebut={pro.dateDebut}
                      nb_module_ressources={pro.nb_module_ressources}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Accueil;
