// components/drawers/ApprenantDrawer.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark, FaPlus, FaUser } from "react-icons/fa6";
import { IMAGE_URL } from "../../../config/env";

const ApprenantDrawer = ({ data, onClose }) => {
  const { idEtp, idProjet, apprenants = [] } = data;
  const [showAddApprenant, setShowAddApprenant] = useState(false);

  console.log("apprenant", apprenants);
  
  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 z-[40000]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Drawer principal */}
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-full h-full max-w-4xl bg-white shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out">
          <div className="flex flex-col h-full">
            <DrawerHeader
              title={`Apprenants (${apprenants?.getAppr?.length})`}
              onClose={onClose}
              onAdd={() => setShowAddApprenant(true)}
            />

             {/* Content */}
            <div className="flex-1 p-4">
                {/* Formation Info */}
                <div className="w-full p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-[116px] h-[77px] rounded-xl overflow-hidden bg-white shadow-sm">
                            <img
                                src={`${IMAGE_URL}/img/modules/670636d5ab27f.webp`}
                                alt="Formation"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="mb-1 text-2xl font-bold text-gray-800">
                                Excel Power Query
                            </h3>
                            <p className="text-base text-gray-600">
                                Formation avancée en analyse de données
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enterprises Section */}
                {apprenants.getEtps && apprenants.getEtps.length > 0 && (
                    <div className="mb-6">
                        <h4 className="mb-3 text-xl font-semibold text-gray-700">Entreprises participantes</h4>
                        <div className="space-y-2">
                            {apprenants.getEtps.map((enterprise, index) => (
                                <div key={enterprise.id || index} className="p-3 rounded-lg bg-blue-50">
                                    <p className="text-lg font-medium text-blue-800">
                                        {enterprise.etp_name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Learners Section */}
                <div>
                    <h4 className="mb-4 text-xl font-semibold text-gray-700">Liste des apprenants</h4>

                    {apprenants.getAppr && apprenants.getAppr.length > 0 ? (
                        <ul className="space-y-4">
                            {apprenants.getAppr.map((learner, index) => (
                                <li key={learner.id || index} className="p-4 transition-shadow duration-200 bg-white border border-gray-200 rounded-lg hover:shadow-md">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="flex items-center justify-center font-bold text-white rounded-full shadow-sm w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600">
                                            <FaUser size={24} />
                                        </div>

                                        {/* Learner Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-lg font-semibold text-gray-800 truncate">
                                                    {learner.emp_name}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <p className="text-lg text-gray-600 truncate">
                                                    {learner.emp_firstname}
                                                </p>

                                                {/* Progress Indicators */}
                                                <div className="flex items-center gap-2">
                                                    <div className="relative">
                                                        <div className="flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md">
                                                            0
                                                        </div>
                                                        <div className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 bg-gray-700 bg-opacity-50 rounded-md"></div>
                                                    </div>
                                                    <div className="relative">
                                                        <div className="flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md">
                                                            0
                                                        </div>
                                                        <div className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 bg-purple-500 bg-opacity-50 rounded-md"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="py-12 text-center">
                            <FaUser className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg text-gray-500">Aucun apprenant trouvé</p>
                            <p className="mt-1 text-sm text-gray-400">Les apprenants apparaîtront ici une fois ajoutés</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
      </motion.div>

      {/* Drawer secondaire : ajout d'apprenants */}
      <AnimatePresence>
        {showAddApprenant && (
          <AddApprenantDrawer
            onClose={() => setShowAddApprenant(false)}
            projectId={idProjet}
            entrepriseId={idEtp}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

const DrawerHeader = ({ title, onClose, onAdd }) => (
  <div className="flex items-center justify-between w-full px-4 py-4 border-b bg-gray-50">
    <p className="text-lg font-medium text-gray-700">{title}</p>
    <div className="flex items-center gap-2">
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <FaPlus size={16} />
        Ajouter un apprenant
      </button>
      <button
        onClick={onClose}
        className="flex items-center justify-center w-10 h-10 hover:bg-gray-200 rounded-md transition"
      >
        <FaXmark size={20} />
      </button>
    </div>
  </div>
);

const AddApprenantDrawer = ({ onClose, idProjet, idEtp }) => (
  <motion.div
    initial={{ opacity: 0, x: 300 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 300 }}
    className="fixed top-0 right-0 z-[50000] w-full h-screen max-w-5xl bg-white shadow-xl overflow-y-auto"
  >
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between w-full px-4 py-3 bg-gray-100 border-b">
        <p className="text-lg font-medium text-gray-600">
          Ajouter des apprenants
        </p>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-200 transition"
        >
          <FaXmark />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {/* Contenu de sélection ici */}
        <p className="text-gray-500">
          Interface pour rechercher et ajouter des apprenants (à implémenter)
        </p>
      </div>

      <div className="flex justify-end gap-2 p-4 border-t bg-white">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Annuler
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-white bg-[#A462A4] hover:bg-[#924a92] rounded-md"
        >
          Fermer
        </button>
      </div>
    </div>
  </motion.div>
);

export default ApprenantDrawer;
