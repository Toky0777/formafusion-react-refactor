import { motion,AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function EditPaymentModal({ isOpen, onClose, payment, onConfirm }) {
  const [amount, setAmount] = useState(payment?.amount || "");

  useEffect(() => {
    setAmount(payment?.amount || "");
  }, [payment]);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Modifier le paiement</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <div className="p-4">
                <label className="block mb-1 text-sm font-medium">
                  Montant
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
                />
              </div>

              <div className="flex justify-end gap-2 p-4 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={() => onConfirm(payment, amount)}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
