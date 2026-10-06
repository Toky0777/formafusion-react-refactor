import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function DrawerAddCfp({ isOpen, onClose, children }) {
  // Variants pour l'overlay
  const overlayVariants = {
    closed: {
      opacity: 0,
    },
    open: {
      opacity: 1,
    },
  };

  // Variants pour le drawer
  const drawerVariants = {
    closed: {
      x: "100%",
    },
    open: {
      x: 0,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.1 }}
            onClick={onClose}
          />

          <motion.div
            className={`fixed right-0 top-0 h-full w-[600px] bg-white shadow-lg z-50 overflow-hidden`}
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 120,
              duration: 0.1,
            }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Ajouter un centre de formation
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-4 h-full overflow-y-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
