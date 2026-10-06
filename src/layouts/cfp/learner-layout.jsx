import { useState } from "react";
import { Outlet } from "react-router-dom";
import Search from "../../components/search/search";
import { useSearch } from "../../hooks/cfp/skill/useSearch";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import { Plus } from "lucide-react";
import AddLearnerDrawer from "../../components/drawer/learners/add-leaner-drawer";
import { useLearnerCfp } from "../../hooks/cfp/useLearnerCfp";
import T from "../../components/translate/AutoTranslator";

export default function LeanerLayoutCfp() {
  const { searchTerm, handleChange } = useSearch();
  const {
    learners,
    getAllLearnears,
    homeLoading,
    editLearner,
    updateLearner,
    updatePhotoLearner,
    addLearner,
    deleteLearner,
    moduleQuery,
    villes,
    addAppExcel,
    getAllModuleQuery,
    showEtp,
  } = useLearnerCfp();
  const [isShowAddLearner, setIsShowAddLearner] = useState(false);

  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent mb-2">
          <T>Apprenants</T>
        </h1>
        <div className="flex justify-end gap-5">
          <Search
            placeholder="Recherche apprenant"
            value={searchTerm}
            onChange={handleChange}
          />

          <ButtonPrimary onClick={() => setIsShowAddLearner(true)}>
            <Plus />
            <T>Nouveau</T>
          </ButtonPrimary>
        </div>
      </div>
      <div className="py-10">
        <Outlet
          context={{
            searchTerm,
            handleChange,
            learners,
            getAllLearnears,
            homeLoading,
            editLearner,
            updateLearner,
            updatePhotoLearner,
            showEtp,
            deleteLearner,
            moduleQuery,
            villes,
            getAllModuleQuery,
          }}
        />
      </div>
      {isShowAddLearner && (
        <AddLearnerDrawer
          isOpen={isShowAddLearner}
          onClose={() => setIsShowAddLearner(false)}
          onAdd={addLearner}
          addExcel={addAppExcel}
        />
      )}
    </div>
  );
}
