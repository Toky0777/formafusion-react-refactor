import { FaTimes, FaAward, FaBook, FaInfoCircle, FaTag } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGE_URL } from "../../config/env";

export default function ViewBadgeModal({ isOpen, closeModal, badge }) {
  if (!isOpen || !badge) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="w-full max-w-2xl overflow-hidden bg-white rounded-2xl shadow-2xl dark:bg-gray-800"
        >
          {/* Header avec dégradé */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FaAward className="text-2xl text-yellow-300" />
                <h3 className="text-2xl font-bold font-sans">Description du Badge</h3>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-white/20 transition-all duration-200"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="p-6 space-y-6">
            {/* Image badge */}
            <div className="flex justify-center">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative"
                >
                  <img
                    src={`${IMAGE_URL}/${badge.image_path}`}
                    alt={badge.titre}
                    className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-xl ring-4 ring-indigo-100 dark:ring-gray-700"
                  />
                  <div className="absolute inset-0 rounded-full bg-indigo-100/30 dark:bg-purple-900/30 animate-pulse" />
                </motion.div>
              </div>
            </div>

            {/* Section Titre et Sous-titre regroupés */}
            <motion.div
              className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"
              whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-2">
                <FaTag className="mr-2 flex-shrink-0" />
                <h4 className="font-semibold text-sm uppercase tracking-wider">Badge</h4>
              </div>
              <div className="pl-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {badge.titre}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {badge.sous_titre}
                </p>
              </div>
            </motion.div>

            {/* Module */}
            <motion.div
              className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"
              whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
                <FaBook className="mr-2 flex-shrink-0" />
                <h4 className="font-semibold text-sm uppercase tracking-wider">Module</h4>
              </div>
              <p className="text-gray-800 dark:text-gray-200 pl-6 font-medium">{badge.module_titre}</p>
            </motion.div>

            {/* Description */}
            <motion.div
              className="bg-white dark:bg-gray-700 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center text-pink-600 dark:text-pink-400 mb-3">
                <FaInfoCircle className="mr-2 text-lg" />
                <h4 className="font-semibold">Description</h4>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{badge.description}</p>
            </motion.div>
          </div>

          {/* Footer */}
          {/* <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end border-t border-gray-200 dark:border-gray-600">
            <motion.button
              onClick={closeModal}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium flex items-center"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              Fermer
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div> */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}