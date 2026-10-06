import { useEffect, useState } from "react";
import CardProgramme from "../../../../components/card/CardProgramme";
import { fetchProgrammes } from "../../../../hooks/SupportApi";
import { Spinner } from "../../../../components/ui/spinner";
import { useSearchSupport } from "../../../../contexts/Apprenants/support-search-context";

function ProgramList() {
  const [loading, setLoading] = useState(true);
  const [programmes, setProgrammes] = useState([]);
  const [error, setError] = useState(null);
  const { search } = useSearchSupport();

  useEffect(() => {
    fetchProgrammes()
      .then((res) => {
        setProgrammes(res.data.projects || []);
        setError(null);
      })
      .catch(() => {
        setError("Erreur lors du chargement des programmes.");
        setProgrammes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="flex items-center justify-center text-red-500 h-96">
        {error}
      </div>
    );

  // 🔍 filtrage basé sur le contexte
  const filteredProgrammes = programmes.filter((pro) =>
    (pro.module_name + " " + pro.cfp_name + " " + pro.project_description)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="flex-1 pb-10 overflow-y-auto">
      <div className="container px-4 py-6 mx-auto">
        <div className="pt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-center">
            {filteredProgrammes.length === 0 ? (
              <p className="col-span-full text-center">
                Aucun programme trouvé
              </p>
            ) : (
              filteredProgrammes.map((pro) => (
                <CardProgramme
                  key={pro.idProjet}
                  route={`/particulier/support/programmes/${pro.idProjet}`}
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
