import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { X } from "lucide-react"; // Icône X

export default function Drawer({ isOpen, onClose, children }) {
  useEffect(() => {
    document.body.className = "overflow-hidden";

    return () => {
      document.body.className = "overflow-auto";
    };
  }, []);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[9994]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 h-full w-[350px] lg:w-[900px] bg-white shadow-xl z-[9995] p-5 "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Bouton X */}
            <button
              onClick={onClose}
              className="absolute z-[800] top-4 right-10 rounded-full bg-gray-500 text-white p-2 transition hover:scale-105"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
