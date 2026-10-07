import { useEffect, useState } from "react";
import CardCentre from "../../../../components/card/CardCentre";
import { fetchCentres } from "../../../../hooks/SupportApi";

function CentreList() {
  const [loading, setLoading] = useState(true);
  const [centres, setCentres] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCentres()
      .then((res) => {
        setCentres(res.data.cfp || []);
        setError(null);
      })
      .catch(() => {
        setError("Erreur lors du chargement des centres.");
        setCentres([]);
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
      <div className="flex items-center justify-center text-red-500 h-96">
        {error}
      </div>
    );
  }
  return (
    <main className="flex-1 pb-10 overflow-y-auto">
      <div className="container px-4 py-6 mx-auto">
        <div className="pt-6">
          <h2 className="mb-6 text-xl font-bold text-gray-800 text-center">
            Centres de formation
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-center">
            {centres.length === 0 ? (
              <p className="col-span-full text-center">Aucun centre</p>
            ) : (
              centres.map((c) => (
                <CardCentre
                  key={c.idCfp}
                  route={`/particulier/support/centre/${c.idCfp}`}
                  cfpName={c.cfp_name}
                  lieu={c.lieu}
                  slogan={c.slogan}
                  nb_projet={c.nb_projet}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default CentreList;
