import { useEffect, useState } from "react";
import axios from "../../../../config/axios";
import { Spinner } from "../../../../components/ui/spinner";
import { FactTemplate } from "../Formulaire/fact-template";
import { useAuth } from "../../../../contexts/AuthContext";

export function NewAcompte() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // optionnel
  const [error, setError] = useState(null); // optionnel
  let isNature = "acompte";
  const [dataProfil, setDataProfil] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async (user) => {
      try {
        setLoading(true);
        const res = await axios.get("/cfp/factures/create");
        const response = await axios.get(`/cfp/profils/${user.id}/index`);
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
