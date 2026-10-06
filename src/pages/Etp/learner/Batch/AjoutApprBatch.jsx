import Drawer from "../../../../components/drawer/learners/Drawer";
import ApprenantsBatch from "./ApprenantsBatch";

function AjoutApprBatch({ isOpen, onClose, batch }) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Ajouter des apprenants">
      <div className="flex flex-col gap-4 w-full min-w-[650px]">
        <ApprenantsBatch batch={batch} />
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            Terminer
          </button>
        </div>
      </div>
    </Drawer>
  );
}

export default AjoutApprBatch;