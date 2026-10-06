
import { motion, AnimatePresence } from "framer-motion";

const ConfirmModal = ({ show, title, message, onCancel, onConfirm }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-lg text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              {title || "Confirmation"}
            </h2>
            <p className="text-sm text-gray-600 mb-5">{message}</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={onCancel}
                className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
