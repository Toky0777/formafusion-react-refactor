import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCentreDetail } from "../../hooks/Api";
import CardProgramme from "../../components/CardProgramme";

function CentreDetail() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [centre, setCentre] = useState(null);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCentreDetail(id)
            .then(res => {
                setCentre(res.data.centre);
                setProjects(res.data.projects || []);
                setError(null);
            })
            .catch(() => setError("Erreur lors du chargement du centre."))
            .finally(() => setLoading(false));
    }, [id]);

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
                <span className=" text-sm font-light tracking-widest">CHARGEMENT</span>
             
              </div>
            </div>
          </div>
  );
    }

    if (error) {
        return <div className="flex items-center justify-center text-red-500 h-96">{error}</div>;
    }

    if (!centre) {
        return <div className="flex items-center justify-center h-96">Aucun détail trouvé.</div>;
    }

    // Pour le lien du site web
    let siteWeb = centre.siteWeb || "";
    if (siteWeb && !siteWeb.startsWith("http")) {
        siteWeb = "https://" + siteWeb;
    }

    return (
        <main className="flex-1 pb-10 overflow-y-auto">
            <div className="container px-4 py-6 mx-auto">
                <div className="space-y-8">
                    <div className="mb-4">
                        <Link to="/centre" className="inline-flex items-center mb-4 text-purple-600 hover:text-purple-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="mr-1 lucide lucide-arrow-left">
                                <path d="m12 19-7-7 7-7"></path>
                                <path d="M19 12H5"></path>
                            </svg>
                            Retour à la liste
                        </Link>
                    </div>
                    <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
                        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
                                <span className="text-2xl font-bold text-gray-500">
                                    {centre.cfp_name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h1 className="mb-1 text-2xl font-bold text-gray-900">{centre.cfp_name}</h1>
                                <p className="mb-2 text-gray-500">{centre.lieu}</p>
                                <p className="mb-4 text-gray-700">{centre.slogan}</p>
                                {siteWeb && (
                                    <a
                                        href={siteWeb}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700"
                                    >
                                        Visiter le site web
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                            fill="none" stroke="currentColor" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round"
                                            className="ml-1 lucide lucide-external-link">
                                            <path d="M15 3h6v6"></path>
                                            <path d="M10 14 21 3"></path>
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                        </svg>
                                    </a>
                                )}
                            </div>
                            <div className="px-4 py-2 text-center text-blue-700 rounded-lg bg-blue-50">
                                <div className="text-2xl font-bold">{centre.nb_projet}</div>
                                <div className="text-sm">
                                    {centre.nb_projet <= 2 ? "Cours disponible" : "Cours disponibles"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4">
                        <div className="space-y-6">
                            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Cours de {centre.cfp_name}
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {projects.length === 0 ? (
                                    <p>Aucun cours</p>
                                ) : (
                                    projects.map((pro) => (
                                        <CardProgramme
                                            key={pro.idProjet}
                                            route={`/programmes/${pro.idProjet}`}
                                            module_name={pro.module_name}
                                            cfp_name={pro.cfp_name}
                                            description={pro.project_description}
                                            dateDebut={pro.dateDebut}
                                            nb_module_ressources={pro.nb_module_ressources}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default CentreDetail;