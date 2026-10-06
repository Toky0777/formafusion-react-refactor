// components/drawers/ApprenantDrawer.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark, FaUser } from "react-icons/fa6";
import { IMAGE_URL } from "../../../config/env";

const ApprenantDrawer = ({ data, onClose }) => {
  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 backdrop-blur-sm z-[40]"
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
        className="fixed inset-0 z-[50] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-full h-full max-w-4xl bg-white shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out">
          <div className="flex flex-col h-full">
            <DrawerHeader
              title={`Apprenants (${data?.length})`}
              onClose={onClose}
            />

            {/* Content */}
            <div className="flex-1 p-4">
              {/* Enterprises Section */}
              {/* {apprenants.getEtps && apprenants.getEtps.length > 0 && (
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
                )} */}

              {/* Learners Section */}
              <div>
                <h4 className="mb-4 text-xl font-semibold text-gray-700">
                  Liste des apprenants
                </h4>

                {data && data.length > 0 ? (
                  <ul className="space-y-4">
                    {data.map((learner, index) => (
                      <li
                        key={learner.id || index}
                        className="p-4 transition-shadow duration-200 bg-white border border-gray-200 rounded-lg hover:shadow-md"
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          {learner.photo ? (
                            <div className="relative group transition-transform duration-300 hover:scale-110 hover:z-10">
                              <img
                                src={`${IMAGE_URL}/img/employes/${learner.photo}`}
                                alt="Employé"
                                className="object-cover w-9 h-9 rounded-full ring-2 ring-white shadow-md"
                                title="Apprenant"
                              />
                              <div className="absolute inset-0 rounded-full bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          ) : (
                            <div className="relative group flex items-center justify-center w-9 h-9 font-bold text-xs uppercase rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 ring-2 ring-white text-cyan-700 shadow-md transition-transform duration-300 hover:scale-110 hover:z-10">
                              {learner.name.charAt(0) || "A"}
                              <div className="absolute inset-0 rounded-full bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          )}
                          {/* Learner Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start mb-2">
                              <p className="text-lg font-semibold text-gray-800 truncate">
                                {learner.name} {learner.firstName}
                              </p>
                            </div>

                            {/* <div className="flex items-center justify-end">
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
                            </div> */}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-12 text-center">
                    <FaUser className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg text-gray-500">
                      Aucun apprenant trouvé
                    </p>
                    <p className="mt-1 text-sm text-gray-400">
                      Les apprenants apparaîtront ici une fois ajoutés
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Drawer secondaire : ajout d'apprenants */}
      {/* <AnimatePresence>
        {showAddApprenant && (
          <AddApprenantDrawer
            onClose={() => setShowAddApprenant(false)}
            projectId={idProjet}
            entrepriseId={idEtp}
          />
        )}
      </AnimatePresence> */}
    </AnimatePresence>
  );
};

const DrawerHeader = ({ title, onClose, onAdd }) => (
  <div className="flex items-center justify-between w-full px-4 py-4 border-b bg-gray-50">
    <p className="text-lg font-medium text-gray-700">{title}</p>
    <div className="flex items-center gap-2">
      <button
        onClick={onClose}
        className="flex items-center justify-center w-10 h-10 hover:bg-gray-200 rounded-md transition"
      >
        <FaXmark size={20} />
      </button>
    </div>
  </div>
);

export default ApprenantDrawer;
