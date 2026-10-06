import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "../../../../../components/ui/spinner";
import { FactTemplate } from "../../Formulaire/fact-template";
import { useAuth } from "../../../../../contexts/AuthContext";
import { API_URL } from "../../../../../config/env";
export function NewProforma() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // optionnel
  const [error, setError] = useState(null); // optionnel
  let isNature = "proforma";
  const [dataProfil, setDataProfil] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async (user) => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_URL}/cfp/factureProfo/create`,
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
        setData(res.data);
        setDataProfil(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData(user);
  }, [user]);

  if (loading) return <Spinner />;
  if (error) return <p>Erreur : {error.message}</p>;
  return (
    <>
      <div className="flex flex-col w-full h-full">
        <div className="sm:w-[1280px] lg:w-full">
          <FactTemplate
            data={data}
            isNature={isNature}
            dataProfil={dataProfil}
          />
        </div>
      </div>
    </>
  );
}
