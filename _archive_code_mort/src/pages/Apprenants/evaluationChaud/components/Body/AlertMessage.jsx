import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function AlertMessage({ type, message, visible, onClose }) {
  
  // Fonction pour fermer automatiquement ou manuellement
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`fixed top-6 -right-2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-xl flex items-center gap-4 text-white ${
            type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {type === "success" ? (
            <CheckCircle className="w-6 h-6 animate-pulse" />
          ) : (
            <AlertTriangle className="w-6 h-6 animate-bounce" />
          )}
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={handleClose}
            className="ml-4 text-white transition-colors hover:text-gray-200 focus:outline-none"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}