import { useEffect, useState } from "react";

import useApi from "../../../../hooks/Api";
import { Spinner } from "../../../../components/ui/spinner";
import { FactTemplate } from "./fact-template";
import { useAuth } from "../../../../contexts/AuthContext";
import { useParams } from "react-router-dom";

export function EditInvoice() {
  const [data, setData] = useState(null);
  const [dataProfil, setDataProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isEdit = "facture";
  const { id } = useParams();
  const { callApi } = useApi();
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async (user, id) => {
      try {
        setLoading(true);
        if (!user?.id) throw new Error("Utilisateur non identifié");

        const [invoiceRes, profilRes] = await Promise.all([
          callApi(`/cfp/factures/${id}/edit`, { method: "GET" }),
          callApi(`/cfp/profils/${user.id}/index`, { method: "GET" }),
        ]);

        setData(invoiceRes);
        setDataProfil(profilRes);
      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchData(user, id);
  }, [id, callApi, user]);

  if (loading) return <Spinner />;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="sm:w-[1280px] lg:w-full">
        {/* Affichage d’un message si aucune facture à éditer, à adapter si besoin */}
        {!id && (
          <div className="inline-flex items-center justify-center gap-2 px-3 py-2 text-center bg-yellow-100 rounded">
            <i className="text-lg bi bi-info-circle"></i>
            <p className="text-gray-700 text-md">
              Veuillez ajouter un{" "}
              <span className="font-semibold text-gray-700 uppercase text-md">
                client
              </span>{" "}
              en premier, avant de remplir les autres champs. Merci.
            </p>
          </div>
        )}

        <div className="flex justify-center w-full mt-2 bg-white rounded-md"></div>

        <FactTemplate
          data={data}
          isFacture={true}
          isEdit={isEdit}
          dataProfil={dataProfil}
        />
      </div>
    </div>
  );
}
