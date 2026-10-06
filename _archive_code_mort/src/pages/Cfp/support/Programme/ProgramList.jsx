import { useEffect, useState } from "react";
import { fetchProgrammes } from "../../hooks/Api";
import CardProgramme from "../../components/CardProgramme";

function ProgramList() {
    const [loading, setLoading] = useState(true);
    const [programmes, setProgrammes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProgrammes()
            .then(res => {
                setProgrammes(res.data.programmes || []);
                setError(null);
            })
            .catch(() => {
                setError("Erreur lors du chargement des programmes.");
                setProgrammes([]);
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
                <span className=" text-sm font-light tracking-widest">CHARGEMENT</span>
             
              </div>
            </div>
          </div>
  );
    }

    if (error) {
        return <div className="flex items-center justify-center text-red-500 h-96">{error}</div>;
    }

    return (
        <main className="flex-1 pb-10 overflow-y-auto">
            <div className="container px-4 py-6 mx-auto">
                <div className="pt-6 pb-8">
                    <h2 className="mb-6 text-xl font-bold text-gray-800">Programmes de formation</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {programmes.length === 0 ? (
                            <p>Aucun programme</p>
                        ) : (
                            programmes.map((pro) => (
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
        </main>
    );
}

export default ProgramList;