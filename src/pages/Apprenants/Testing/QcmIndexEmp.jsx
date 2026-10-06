import { useEffect, useState } from "react";
import { CardQcmEmploye } from "../../../components/card/CardQcmEmploye";
import { DomainFilter } from "../../../components/filters/DomainFilter";
import axios from "../../../config/axios";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { PlusCircle, Filter, Search, RotateCcw } from "lucide-react";
import { DeleteModalQcm } from "../../../components/Modals/DeleteModalQcm";
import AlertMessage from "../../../components/Modals/AlertMessage";
import { useAuth } from "../../../contexts/AuthContext";
import { Spinner } from "../../../components/ui/spinner";

export default function QcmIndexEmp() {
  const [qcms, setQcms] = useState([]);
  const [filteredQcms, setFilteredQcms] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [qcmToDelete, setQcmToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    if (user) {
      QcmRequest();
    }
  }, [user]);

  useEffect(() => {
    let filtered = qcms;

    if (selectedDomain && selectedDomain !== "" && selectedDomain !== "all") {
      filtered = filtered.filter(
        (qcm) =>
          qcm.idDomaine == parseInt(selectedDomain) ||
          qcm.domaine_id == parseInt(selectedDomain)
      );
    }

    if (searchValue && searchValue.trim() !== "") {
      const searchTerm = searchValue.toLowerCase().trim();
      filtered = filtered.filter((qcm) => {
        const titleMatch = qcm.intituleQCM?.toLowerCase().includes(searchTerm);
        const domainMatch =
          qcm.domaine?.nomDomaine?.toLowerCase().includes(searchTerm) ||
          qcm.nomDomaine?.toLowerCase().includes(searchTerm);
        const descriptionMatch = qcm.description
          ?.toLowerCase()
          .includes(searchTerm);

        return titleMatch || domainMatch || descriptionMatch;
      });
    }

    setFilteredQcms(filtered);
  }, [selectedDomain, searchValue, qcms]);

  const QcmRequest = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/qcm/index`, {});
      setQcms(res.data.all_qcm);
      setFilteredQcms(res.data.all_qcm);
      setDomaines(res.data.domaines);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (qcmId) => {
    try {
      await axios.delete(`qcm/${qcmId}/delete`, {});
      setQcms((prev) => prev.filter((q) => q.idQCM !== qcmId));
      setQcmToDelete(null);
      setNotification({
        show: true,
        message: "Test supprimé avec succès",
        type: "success",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      setNotification({
        show: true,
        message: "Erreur lors de la suppression du QCM" + `: ${error}`,
        type: "error",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  const handleDomainChange = (domainId) => {
    setSelectedDomain(domainId);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const resetFilter = () => {
    setSelectedDomain("");
    setSearchValue("");
  };

  const getEmptyMessage = () => {
    if (searchValue && selectedDomain) {
      return {
        title: "Aucun test trouvé",
        description:
          "Aucun test ne correspond à votre recherche et au domaine sélectionné",
        buttonText: "Réinitialiser les filtres",
        icon: Search,
      };
    } else if (searchValue) {
      return {
        title: "Aucun test trouvé",
        description: "Aucun test ne correspond à " + `"${searchValue}"`,
        buttonText: "Effacer la recherche",
        icon: Search,
      };
    } else if (selectedDomain) {
      return {
        title: "Aucun test dans ce domaine",
        description:
          "Essayez de sélectionner un autre domaine ou réinitialisez le filtre",
        buttonText: "Voir tous les tests",
        icon: Filter,
      };
    } else {
      return {
        title: "Aucun test disponible",
        description: "Créez votre premier test pour commencer",
        buttonText: "Créer un test",
        icon: PlusCircle,
      };
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  const emptyMessage = getEmptyMessage();
  const IconComponent = emptyMessage.icon;

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <AlertMessage
        type={notification.type}
        message={notification.message}
        visible={notification.show}
      />
      {qcmToDelete && (
        <DeleteModalQcm
          onClose={() => setQcmToDelete(null)}
          onConfirm={() => handleDelete(qcmToDelete)}
        />
      )}

      {/* Main Content */}
      <div className=" bg-gray-50">
        <div className="container px-4 py-8 mx-auto">
          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-2xl"
          >
            <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Filter className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Filtres et recherche
                </h2>
              </div>

              {(selectedDomain || searchValue) &&
                filteredQcms.length !== qcms.length && (
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 text-sm font-medium text-indigo-700 rounded-full bg-indigo-50">
                      {filteredQcms.length}{" "}
                      {filteredQcms.length > 1 ? "résultats" : "résultat"}
                    </div>
                    <button
                      onClick={resetFilter}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Réinitialiser
                    </button>
                  </div>
                )}
            </div>

            <DomainFilter
              domaines={domaines}
              selectedDomain={selectedDomain}
              onDomainChange={handleDomainChange}
            />
          </motion.div>

          {/* Tests Grid */}
          {filteredQcms.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredQcms.map((qcm, index) => (
                <motion.div
                  key={qcm.idQCM}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="transition-all duration-200 transform"
                >
                  <CardQcmEmploye
                    qcm={qcm}
                    onDeleteModalOpen={setQcmToDelete}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="flex flex-col items-center justify-center p-12 mt-8 text-center bg-white border border-gray-100 shadow-sm rounded-2xl"
              >
                <div className="relative mb-6">
                  <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl">
                    <IconComponent className="w-12 h-12 text-indigo-500" />
                  </div>
                  <div className="absolute flex items-center justify-center w-6 h-6 bg-purple-500 rounded-full -top-2 -right-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                <h3 className="mb-3 text-2xl font-bold text-gray-800">
                  {emptyMessage.title}
                </h3>
                <p className="max-w-md mb-8 leading-relaxed text-gray-500">
                  {emptyMessage.description}
                </p>
              </motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
