import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner } from "../../../../../components/ui/spinner";
import { useAuth } from "../../../../../contexts/AuthContext";
import { FactTemplate } from "../../Formulaire/fact-template";
import { useParams } from "react-router-dom";
import { API_URL } from "../../../../../config/env";

export function EditAcompte() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // optionnel
  const [error, setError] = useState(null); // optionnel
  const isEdit = "acompte";
  const [dataProfil, setDataProfil] = useState([]);
  const { id } = useParams();
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async (user, id) => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_URL}/cfp/factures/${id}/edit`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const response = await axios.get(
          `${API_URL}/cfp/profils/${user?.id}/index`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDataProfil(response.data);
        setData(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData(user, id);
  }, [id, user]);
  if (loading) return <Spinner />;
  if (error) return <p>Erreur : {error.message}</p>;
  return (
    <>
      <div className="flex flex-col w-full h-full">
        <div className="sm:w-[1280px] lg:w-full">
          {!isEdit && (
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
          <FactTemplate data={data} isEdit={isEdit} dataProfil={dataProfil} />
        </div>
      </div>
    </>
  );
}
