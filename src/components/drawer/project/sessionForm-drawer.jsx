import { FaChevronRight, FaClock } from "react-icons/fa";
import { FaCalendarDays, FaXmark } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { IMAGE_URL } from "../../../config/env";

export function SessionDrawer({data , onClose }) {
  const { idProjet, heureDetail = [] } = data;

  console.log("session", heureDetail);

   const totalHeures = heureDetail?.sessions?.reduce((total, s) => {
        const start = new Date(s.start);
        const end = new Date(s.end);
        const diffHeures = (end - start) / (1000 * 60 * 60);
        return total + diffHeures;
    }, 0);

  const heures = Math.floor(totalHeures);
  const minutes = Math.round((totalHeures - heures) * 60);

  return (
   <AnimatePresence>
      <>
        {/* Overlay noir semi-transparent */}
        <motion.div
          className="fixed inset-0 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Panneau de formulaire */}
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 1 }}
          className=""
        >
          <div className="inset-0 z-50 overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full max-w-4xl overflow-y-auto bg-white shadow-xl">
              {/* Header avec gradient */}
              <div className="relative p-6 text-black bg-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  {/* Boutons d'action */}
                  <div className="flex justify-end gap-3 mb-6">
                    <button
                      onClick={onClose}
                      className="p-2 text-black transition-all duration-200 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl hover:scale-105"
                    >
                      <FaXmark size={20} />
                    </button>
                  </div>

                  {/* Informations du module */}
                  <div className="flex items-center gap-6">
                    <div className="relative group z-2">
                      <div className="h-20 overflow-hidden w-28 rounded-2xl ring-2 ring-white/20">
                        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-purple-500">
                          <span className="text-xs font-bold text-white">
                            <img
                              src={`${IMAGE_URL}/img/modules/${heureDetail.module?.module_image}`}
                              className="w-full h-full rounded-xl"
                            />
                          </span>
                        </div>
                      </div>
                      <div className="absolute z-2 inset-0 transition-opacity duration-200 opacity-0 bg-white/20 rounded-2xl group-hover:opacity-100"></div>
                    </div>

                    <div className="flex-1">
                      <h2 className="mb-2 text-3xl font-bold leading-tight">
                        {heureDetail?.module?.moduleName || "Aucun module"}
                      </h2>
                      <div className="flex items-center gap-2 text-black">
                        <FaClock size={18} />
                        <span className="text-lg font-medium">
                          {heureDetail?.totalSessionHours?.sumHourSession}
                          heures
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenu principal */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold text-gray-800">
                    <FaCalendarDays className="text-blue-600" size={20} />
                    Planning des séances
                  </h3>
                </div>

                {/* Liste des séances avec design moderne */}
                <div className="space-y-3">
                 {Array.isArray(heureDetail?.sessions) &&
                    heureDetail.sessions.map((s, i) => {
                        return (
                        <div
                            key={i}
                            className="group relative bg-gradient-to-r from-gray-50 to-blue-50/30 hover:from-blue-50 hover:to-purple-50/40 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer border border-gray-100/50"
                            style={{
                            animationDelay: `${i * 100}ms`,
                            }}
                        >
                            <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                <h4 className="text-lg font-semibold text-gray-800 capitalize">
                                    {s.dateSeance}
                                </h4>
                                </div>

                                <div className="flex items-center gap-4 text-gray-600">
                                <span className="flex items-center gap-2 font-medium">
                                    <FaClock size={16} className="text-blue-500" />
                                    {s.heureDebut} - {s.heureFin}
                                </span>
                                <span className="px-3 py-1 text-sm font-medium text-gray-500 rounded-full bg-white/80">
                                    3h00
                                </span>
                                </div>
                            </div>

                            <FaChevronRight
                                size={20}
                                className="text-gray-400 transition-all duration-200 group-hover:text-blue-500 group-hover:translate-x-1"
                            />
                            </div>

                            {/* Barre de progression décorative */}
                            <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden bg-gray-200/50 rounded-b-2xl">
                            <div
                                className="h-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl group-hover:w-full"
                                style={{ width: "0%" }}
                            ></div>
                            </div>
                        </div>
                        );
                    })}

                </div>

                {/* Statistiques en bas */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl">
                    <div className="mb-1 text-2xl font-bold text-blue-600">
                      {heureDetail?.sessions?.length ?? 0}
                    </div>
                    <div className="text-sm text-gray-600">Séances</div>
                  </div>
                  <div className="p-4 text-center bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl">
                    <div className="mb-1 text-2xl font-bold text-purple-600">
                       {heureDetail?.totalSessionHours?.sumHourSession}
                    </div>
                    <div className="text-sm text-gray-600">Durée totale</div>
                  </div>
                  <div className="p-4 text-center bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl">
                    <div className="mb-1 text-2xl font-bold text-indigo-600">
                      100%
                    </div>
                    <div className="text-sm text-gray-600">Progression</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </>
   </AnimatePresence>
  );
}
