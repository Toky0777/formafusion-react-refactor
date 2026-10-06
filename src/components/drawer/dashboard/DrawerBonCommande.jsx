import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Eye, HandCoins, Folder } from "lucide-react";
import { useDashboardCfp } from "../../../contexts/cfp/DashboardCfpProvider";
import LoadingSpinner from "../../ui/loading-spinner";
import { Link } from "react-router-dom";

export default function DrawerBonCommande({
  onClose,
  isOpen,
  data,
  isLoading,
}) {
  const { formatNumber } = useDashboardCfp();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !onClose) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/30   z-[9994]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] lg:w-[800px] bg-white shadow-2xl z-[9995] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="relative px-6 py-3 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 shadow-sm">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Détails bon de commande
                  </h2>
                  {data && (
                    <div className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm">
                      {data?.month} {data?.year}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="flex items-center space-x-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="p-2 bg-blue-50 rounded-lg text-gray-400">
                      <HandCoins />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">
                        Montant total
                      </div>
                      <span className="text-lg font-semibold text-gray-800">
                        {data?.bc?.total && formatNumber(data?.bc?.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 rounded-full bg-white border border-gray-200 p-2 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 shadow-sm"
                aria-label="Fermer"
              >
                <X />
              </button>
            </div>

            <div className="flex-1 w-full overflow-x-auto bg-white p-5">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-sm text-gray-500 border-b bg-gray-50">
                    <th className="p-2 text-left">Numéro BC</th>
                    <th className="p-2 text-left">Date BC</th>
                    <th className="p-2 text-left">Montant BC</th>
                    <th className="p-2 text-left">Entreprise</th>
                    <th className="p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8">
                        <LoadingSpinner />
                      </td>
                    </tr>
                  ) : !data?.bc ||
                    !data?.bc?.details_bc ||
                    data?.bc?.details_bc.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-10 text-gray-500"
                      >
                        <Folder
                          size={48}
                          className="mx-auto mb-3 text-gray-300"
                        />
                        <p>Aucun bon de commande trouvé pour ce mois</p>
                      </td>
                    </tr>
                  ) : (
                    data?.bc?.details_bc?.map((el, i) => (
                      <tr
                        key={i}
                        className="transition border-b hover:bg-gray-50"
                      >
                        <td className="p-2 font-semibold text-purple-700">
                          {el.numero_bc}
                        </td>
                        <td className="p-2"> {el.date_bc} </td>
                        <td className="p-2"> {formatNumber(el.montant_bc)} </td>
                        <td className="p-2">{el.etp_name}</td>
                        <td className="px-5">
                          <Link to="/cfp/bon-commande">
                            <Eye className="text-gray-400 h-5 w-5 hover:text-gray-500" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
