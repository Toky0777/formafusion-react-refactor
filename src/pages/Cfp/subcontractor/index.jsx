import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import NavbarSubcontractor from "../../../components/navbar/navbar-subcontractor";
import SousTraitantListe from "./SousTraitantListe";
import SoustraitantAjout from "./SoustraitantAjout";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import axios from "../../../config/axios";

function SubcontractorList() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [soustraitants, setsoustraitants] = useState([]);
  const [count, setCount] = useState(0);
  const [showModalAjout, setShowModalAjout] = useState(false);
  const navigate = useNavigate();

  // Fonction pour charger les soustraitants depuis l'API
  const fetchsoustraitants = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`/sub-contractors/index`);

      setsoustraitants(result.data.subcontractors || []);
      setCount(result.data.count || 0);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/user");
      }
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // console.log(error.response.data.message);
      } else {
        alert("Une erreur est survenue.");
      }
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  // Chargement des soustraitants à l'initialisation
  useEffect(() => {
    fetchsoustraitants();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col w-full ">
      <NavbarSubcontractor
        setShowModalAjout={setShowModalAjout}
        search={search}
        setSearch={setSearch}
      />

      <div className="w-full flex-1 mt-4">
        <div className="flex flex-col w-full h-full px-6">
          <div className="w-full h-full mx-auto max-w-[1920px]">
            <section id="content" className="py-4">
              {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <LoaderCircle className="w-12 h-12 text-purple-600 animate-spin" />
                </div>
              ) : (
                <SousTraitantListe
                  soustraitants={soustraitants}
                  count={count}
                  search={search}
                />
              )}
            </section>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModalAjout && (
          <SoustraitantAjout
            setShowModalAjout={setShowModalAjout}
            refreshData={fetchsoustraitants}
            soustraitants={soustraitants}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default SubcontractorList;