// src/components/common/Drawer.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Drawer = ({ isOpen, onClose, title, children, size = "lg" }) => {
  // Définir les tailles maximales en fonction de la prop size
  const getMaxWidth = () => {
    switch(size) {
      case "sm": return "max-w-md";
      case "md": return "max-w-2xl";
      case "lg": return "max-w-4xl"; // Taille augmentée
      case "xl": return "max-w-6xl";
      case "full": return "max-w-full";
      default: return "max-w-4xl";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Surcouche de fond */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panneau du drawer */}
          <motion.div
            className={`fixed inset-y-0 right-0 w-full ${getMaxWidth()} bg-white shadow-xl z-50 overflow-y-auto`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }} // Animation de sortie
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Fermer"
                >
                  <FontAwesomeIcon icon={faXmark} size="lg" />
                </button>
              </div>
              
              {/* Le contenu spécifique du drawer est affiché ici */}
              <div className="flex-grow pt-4 overflow-y-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;