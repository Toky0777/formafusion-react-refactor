import { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import LearnerCard from "../../../components/card/learner-card-cfp";
import Pagination from "../../../components/skills/Pagination";
import { useOutletContext } from "react-router-dom";
import LeanerCfpFilter from "../../../components/filters/LeanerCfpFilter";
import { Users } from "lucide-react";
import T from "../../../components/translate/AutoTranslator";

export default function LearnerCfpIndex() {
  const {
    learners,
    getAllLearnears,
    homeLoading,
    editLearner,
    updateLearner,
    updatePhotoLearner,
    searchTerm,
    deleteLearner,
    showEtp,
    moduleQuery,
    villes,
    getAllModuleQuery,
  } = useOutletContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const [activeFilters, setActiveFilters] = useState({
    entreprise: "",
    module: "",
    ville: "",
  });

  const filteredLearners = learners.filter((learner) => {
    const matchesSearch = searchTerm
      ? [learner.emp_name, learner.emp_firstname]
          .filter(Boolean)
          .some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
          )
      : true;
    const matchesEntreprise = activeFilters?.entreprise
      ? learner.etp_name?.toLowerCase() ===
        activeFilters.entreprise.toLowerCase()
      : true;
    const matchesVille = activeFilters?.ville
      ? learner.ville?.toLowerCase() === activeFilters.ville.toLowerCase()
      : true;
    const matchesModule = activeFilters?.module
      ? moduleQuery?.some(
          (mq) =>
            mq.idEmploye === learner.idEmploye &&
            mq.module_name?.toLowerCase() === activeFilters.module.toLowerCase()
        )
      : true;

    return matchesSearch && matchesEntreprise && matchesModule && matchesVille;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLearner = filteredLearners.slice(startIndex, endIndex);

  useEffect(() => {
    getAllLearnears();
    getAllModuleQuery();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);

  return (
    <div>
      <div className="mb-5">
        <LeanerCfpFilter
          onFilterChange={(newFilters) => setActiveFilters(newFilters)}
          moduleQuery={moduleQuery}
          villes={villes}
        />
      </div>
      {homeLoading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : currentLearner.length === 0 ? (
        <div className="flex justify-center items-center h-[30vh] gap-5">
          <Users size={30} />
          <h1 className="">
            <T>Aucune résulat trouvée</T>
          </h1>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-5">
            {currentLearner?.map((l, index) => (
              <div key={index}>
                <LearnerCard
                  learner={l}
                  editLearner={editLearner}
                  showEtp={showEtp}
                  updateLearner={updateLearner}
                  updatePhotoLearner={updatePhotoLearner}
                  deleteLearner={deleteLearner}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {currentLearner.length !== 0 && (
        <div className="flex justify-end mt-5">
          <Pagination
            totalItems={filteredLearners.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
