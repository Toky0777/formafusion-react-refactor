import React, { useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ApprenantDrawer = ({ isOpen, onClose, module }) => {
  const drawerRef = useRef(null);

  // Gestion du click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const groupes = useMemo(() => {
    return (
      module?.apprs?.reduce((acc, apprenant) => {
        const cle = apprenant.etp_name;
        if (!acc[cle]) acc[cle] = [];
        acc[cle].push(apprenant);
        return acc;
      }, {}) || {}
    );
  }, [module?.apprs]);

  const listeEntreprisesEtApprenants = Object.entries(groupes);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.4 }}
          className="fixed top-0 right-0 z-50 h-full w-full max-w-[60rem] bg-white shadow-2xl overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Drawer container with ref */}
          <div ref={drawerRef} className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 shadow-sm sticky top-0 z-10">
              <p className="text-lg font-medium text-gray-700">
                Nombre d'apprenants :{" "}
                <span className="font-bold">{module?.apprs?.length || 0}</span>
              </p>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-600"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-6 px-6 py-6 overflow-y-auto">
              {/* Module info card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl shadow p-4 flex gap-4 items-center"
              >
                <div className="w-[116px] h-[77px] rounded-xl overflow-hidden border">
                  <img
                    src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/modules/${module?.module_image}`}
                    alt="Module"
                    className="object-cover w-full h-full rounded-xl"
                  />
                </div>
                <div className="flex flex-col justify-center w-full">
                  <h3 className="text-2xl font-semibold text-slate-800 line-clamp-2">
                    {module?.module_name ?? "Nom du module"}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-3">
                    {module?.description ?? "Description du module"}
                  </p>
                </div>
              </motion.div>

              {/* Apprenants groupés */}
              {listeEntreprisesEtApprenants.map(([etpName, apprenants], i) => (
                <motion.div
                  key={etpName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                >
                  <p className="text-xl font-medium text-purple-700 mt-6 mb-3 border-b pb-1">
                    {etpName}
                  </p>
                  <ul className="divide-y divide-dashed divide-gray-200">
                    {apprenants.map((apprenant, idx) => (
                      <li key={idx} className="py-4">
                        <div className="flex items-start gap-4">
                          {apprenant.emp_photo ? (
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100">
                              <img
                                src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/employes/${apprenant?.emp_photo}`}
                                alt={apprenant.emp_name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-xl">
                              {apprenant.emp_initial_name}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-lg text-gray-700 font-semibold">
                              {apprenant.emp_name}
                            </p>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-500">
                                {apprenant.emp_firstname}
                              </p>
                              <div className="flex gap-2">
                                {[apprenant.score1, apprenant.score2].map(
                                  (score, i) => (
                                    <div
                                      key={i}
                                      className="relative w-[27px] h-[35px] border border-gray-200 rounded-md flex items-center justify-center text-sm text-gray-800"
                                    >
                                      {score}
                                      <span
                                        className={`absolute bottom-0 left-0 w-full z-[-1] rounded-md ${
                                          i === 0
                                            ? "bg-gray-700/50"
                                            : "bg-[#a462a4]/50"
                                        }`}
                                        style={{ height: `${score}%` }}
                                      ></span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ApprenantDrawer;
