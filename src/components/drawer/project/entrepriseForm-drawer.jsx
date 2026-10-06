// components/drawer/project/entreprise-drawer.jsx
import { motion } from "framer-motion";
import { FaXmark, FaUser, FaEnvelope, FaPhone } from "react-icons/fa6";

export const EntrepriseDrawer = ({
  data,
  onClose,
  activeTab,
  setActiveTab,
}) => {
  const { idEtp, idProjet, etpDetail, tousEtp: drawerTousEtp, etp } = data;  

  return (
    <>
      <motion.div
        className="fixed inset-0 backdrop-blur-sm z-400000"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        <div className="absolute top-0 right-0 w-full h-full max-w-4xl overflow-y-auto bg-white shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Détails de l'entreprise
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-10 h-10 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                >
                  <FaXmark className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Company Profile */}
            <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <h3 className="mb-2 text-3xl font-bold">
                    {etpDetail?.customer?.customerName || "Entreprise non spécifiée"}
                  </h3>
                  <p className="text-black">Partenaire formation</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h4 className="mb-4 text-xl font-semibold text-gray-800">
                Informations de contact
              </h4>
              {etpDetail.referents.map((r, i) => (
                 <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                    <FaUser className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                        <div className="flex items-center gap-2 text-gray-600">
                        <FaUser className="w-4 h-4" />
                        <span>{r.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                        <FaEnvelope className="w-4 h-4" />
                        <span>{r.email || "Non spécifié"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                        <FaPhone className="w-4 h-4" />
                        <span>{r.phone || "Non spécifié"}</span>
                        </div>
                    </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

