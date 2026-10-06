import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import T from "../translate/AutoTranslator";

export default function DrawerParent({ isOpen, onClose, children, title }) {
  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const drawerVariants = {
    closed: { x: "100%" },
    open: { x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.1 }}
            onClick={(e) => {
              e.stopPropagation(); // Aza alefa any amin'ny parent
              onClose();           // mikatona ny drawer
            }}
          />

          {/* Drawer Content */}
          <motion.div
            className="fixed right-0 top-0 h-full w-[800px] bg-white shadow-lg z-50 flex flex-col"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{
              type: "tween",
              ease: "easeOut",
              duration: 0.3,
            }}
            onClick={(e) => e.stopPropagation()} // tsy hiakatra any amin'ny tr
          >
            {/* En-tête fixe */}
            <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                <T>{title}</T>
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Contenu principal avec gestion du scroll interne */}
            <div className="flex-1 min-h-0 p-4 overflow-hidden">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
