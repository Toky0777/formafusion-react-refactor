import T from "../translate/AutoTranslator";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          <T>Confirmer la suppression</T>
        </h2>
        <p className="text-gray-600 mb-6">
          <T>Êtes-vous sûr de vouloir supprimer cet élément ?</T>
        </p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            <T>Annuler</T>
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={() => onConfirm(itemId)}
          >
            <T>Supprimer</T>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
