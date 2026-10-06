import { AnimatePresence, motion } from "framer-motion";
import EditFormustomer from "../../forms/EditFormCustomer";

export default function ModalEditCustomer({
  onClose,
  isLoading,
  editData,
  updateEtp,
  loadingUpdate,
  updateLogo,
  getAllEtps,
}) {
  return (
    <div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[700] overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div className="fixed inset-0 bg-black/20" onClick={onClose} />

            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:p-6 max-w-2xl w-full mx-auto"
            >
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : editData ? (
                <EditFormustomer
                  dataEdit={editData}
                  updateEtp={updateEtp}
                  onClose={onClose}
                  loadingUpdate={loadingUpdate}
                  updateLogo={updateLogo}
                />
              ) : (
                <div className="text-center py-10">
                  <p>Erreur lors du chargement des données</p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
