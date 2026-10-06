import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Users, Building2 } from "lucide-react";
import LoadingSpinner from "../../ui/loading-spinner";
import { IMAGE_URL } from "../../../config/env";

const DrawerLearner = ({ onClose, isOpen, learners, isLoading }) => {
  const imgUrl = IMAGE_URL + "/img/employes/";

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !onClose) return null;

  const renderEmployees = (employees) => {
    return Object.values(employees).map((employee, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100  transition-all duration-300"
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            {employee.photo ? (
              <img
                src={`${imgUrl}${employee.photo}`}
                className="object-cover w-14 h-14 rounded-full ring-2 ring-white shadow-lg"
                alt={`${employee.firstName} ${employee.name}`}
              />
            ) : (
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg">
                <span className="text-lg font-semibold text-white">
                  {employee.firstName?.charAt(0)}
                  {employee.name?.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-gray-900 truncate">
              {employee.firstName} {employee.name}
            </h4>
          </div>
        </div>
      </motion.div>
    ));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30  z-[9994]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] lg:w-[600px] bg-white shadow-2xl z-[9995] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="relative px-6 py-5  bg-gray-100 border-b-2 border-gray-20 ">
              <button
                onClick={onClose}
                className="absolute top-5 right-6 rounded-full   p-2 transition-all hover:bg-white/30 hover:scale-110 active:scale-95"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center space-x-3 pr-12">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Users size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold ">Apprenants</h2>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="p-6">
                  {learners && learners.results.length !== 0 ? (
                    <div className="space-y-6">
                      {Object.entries(learners.results).map(
                        ([companyName, employees]) => (
                          <motion.div
                            key={companyName}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                          >
                            <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Building2
                                    size={18}
                                    className="text-blue-600"
                                  />
                                </div>
                                <div>
                                  <h3 className="text-base font-semibold text-gray-900">
                                    {companyName}
                                  </h3>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {Object.values(employees).length} apprenant
                                    {Object.values(employees).length > 1
                                      ? "s"
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 space-y-3">
                              {renderEmployees(employees)}
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-96">
                      <div className="p-4 bg-gray-100 rounded-full mb-4">
                        <Users size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        Aucune donnée disponible
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DrawerLearner;
