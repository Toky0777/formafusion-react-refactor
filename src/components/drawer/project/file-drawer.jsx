import { AnimatePresence, motion } from "framer-motion";
import { FaDownload, FaBuilding, FaUsers, FaCalendar, FaMapMarkerAlt, FaBook, FaFileAlt, FaMoneyBillWave } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

export function FileDrawer({ data, onClose }) {
  
  const details = data?.detailDossier;
  const setting = JSON.parse(sessionStorage.getItem("setting"));
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="h-full bg-white w-[1010px] shadow-lg overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header du drawer */}
          <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 p-6 shadow-lg z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">{details?.nomDossier || "Dossier"}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <FaXmark className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Contenu du drawer */}
          <div className="p-6">
            {details ? (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-xl border border-blue-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                        <FaUsers className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Apprenants</p>
                        <p className="text-2xl font-bold text-gray-900">{details.apprenants}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                        <FaMoneyBillWave className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Montant Total</p>
                        <p className="text-2xl font-bold text-gray-900">
                           {(isNaN(parseInt(details?.montantTotal)) ? 0 : parseInt(details.montantTotal)).toLocaleString('fr-FR')} {setting.currency_unit}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                        <FaFileAlt className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Projets</p>
                        <p className="text-2xl font-bold text-gray-900">{details.projet_count[0]}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-4 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                        <FaDownload className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Documents</p>
                        <p className="text-2xl font-bold text-gray-900">{details.nombreDocument[0]}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Entreprises */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                      <FaBuilding className="w-5 h-5 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Entreprises</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {details.nomsEntreprises.filter(e => e).map((entreprise, i) => (
                      <span 
                        key={i}
                        className="px-4 py-2 bg-blue-50 text-gray-700 rounded-full text-sm font-medium border border-blue-200"
                      >
                        {entreprise}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Types de Projet */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Types de Projet</h3>
                  <div className="flex gap-3">
                    {details.project_types.map((type, i) => (
                      <div 
                        key={i}
                        className="flex-1 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg border"
                      >
                        <p className="text-cyan-900 font-semibold text-center">{type.project_type}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Dates */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                      <FaCalendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Période du Projet</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg ">
                      <p className="text-sm text-gray-600 font-medium mb-1">Date de début</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(details.dateMinProjet[0]).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium mb-1">Date de fin</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(details.dateMaxProjet[0]).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Villes */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                      <FaMapMarkerAlt className="w-5 h-5 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Villes</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {details.villes.map((ville, i) => (
                      <span 
                        key={i}
                        className="px-4 py-2 bg-purple-50 text-gray-700 rounded-full text-sm font-medium border border-purple-200"
                      >
                        {ville.ville}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Modules */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                      <FaBook className="w-5 h-5 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Modules de Formation</h3>
                  </div>
                  <div className="space-y-2">
                    {details.module_names.map((module, i) => (
                      <div 
                        key={i}
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 transition-colors"
                      >
                        <p className="text-gray-600 font-medium">{module.module_name}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                  <FaFileAlt className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-4">Aucune donnée de dossier disponible</p>
                <button 
                  onClick={onClose}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}