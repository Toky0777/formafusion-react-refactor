import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { EditPaymentModal } from "./EditPaymentModal";
import axios from "axios";
import DeleteConfirmationModal from "../../Modals/delete-modal";
import { API_URL } from "../../../config/env";

export function PaymentHistoryDrawer({ invoice, onClose, setData, index }) {
  const safeInvoice = invoice || {};
  const safePayments = Array.isArray(safeInvoice.payments)
    ? safeInvoice.payments
    : [];
  const [payments, setPayments] = useState(safePayments);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const wrapperRef = useRef(null);
  const modalRef = useRef(null);
  const setting = JSON.parse(sessionStorage.getItem("setting")) || {
    currency_unit: "Ar",
  };
  const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const remaining = Number(safeInvoice.invoice_total_amount || 0) - totalPaid;

  const openDeleteModal = (payment) => {
    setSelectedId(payment);
    setModalOpen(true);
  };
  const openEditModal = (payment) => {
    setSelectedPayment(payment);
    setEditModalOpen(true);
  };

  const handleDeletePayment = async () => {
    if (!selectedId) return;
    try {
      const response = await axios.delete(
        `${API_URL}/invoice/${safeInvoice.idInvoice}/payments/${selectedId.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        const updatedPayments = payments.filter((p) => p.id !== selectedId.id);
        const deletedPayment = selectedId;
        const newRemaining =
          Number(remaining) + Number(deletedPayment?.amount || 0);
        const newStatus = newRemaining === 0 ? 4 : 5;

        setData((prev) =>
          prev.map((inv, i) =>
            i === index
              ? {
                  ...inv,
                  payments: updatedPayments,
                  remaining: newRemaining,
                  invoice_status: newStatus,
                  status: {
                    ...inv.status,
                    idInvoiceStatus: newStatus,
                    invoice_status_name: newStatus === 4 ? "Payé" : "Partiel",
                  },
                }
              : inv
          )
        );
        setPayments(updatedPayments);
        setModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du paiement.");
    }
  };

  const handleConfirmEdit = async (paymentId, newAmount, newPaymentStatus) => {
    try {
      const updatedPayments = payments.map((p) =>
        p.id === paymentId ? { ...p, amount: newAmount } : p
      );
      const newTotalPaid = updatedPayments.reduce(
        (acc, p) => acc + Number(p.amount || 0),
        0
      );
      const newRemaining =
        Number(safeInvoice.invoice_total_amount || 0) - newTotalPaid;
      const newStatus = newRemaining === 0 ? 4 : 5;

      const response = await axios.put(
        `${API_URL}/payments/${paymentId.id}`,
        {
          amount: newAmount,
          payment_status: newPaymentStatus,
          invoice_status: newStatus,
          invoice_id: safeInvoice.idInvoice,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        setData((prev) =>
          prev.map((inv, i) =>
            i === index
              ? {
                  ...inv,
                  payments: updatedPayments,
                  remaining: newRemaining,
                  invoice_status: newStatus,
                  status: {
                    ...inv.status,
                    idInvoiceStatus: newStatus,
                    invoice_status_name: newStatus === 4 ? "Payé" : "Partiel",
                  },
                }
              : inv
          )
        );
        setPayments(updatedPayments);
        setEditModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la modification du paiement.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        !modalOpen &&
        !editModalOpen
      )
        onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, modalOpen, editModalOpen]);

  if (!invoice) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        ref={wrapperRef}
        className="fixed top-0 right-0 w-full max-w-2xl h-full bg-white z-50 flex flex-col overflow-y-auto shadow-xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
      >
        <div ref={modalRef}>
          <DeleteConfirmationModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleDeletePayment}
            itemId={selectedId}
          />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-black">
            Paiements | Facture N°: {safeInvoice.invoice_number}
          </h2>
          <button onClick={onClose} className="hover:text-red-600">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 bg-white">
          {payments.length === 0 ? (
            <p className="font-medium text-center text-black">
              Aucun paiement effectué pour cette facture.
            </p>
          ) : (
            payments.map((payment, i) => (
              <div
                key={payment.id ?? `payment-${i}`}
                className="p-4 bg-white border rounded-lg space-y-2"
              >
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-black">
                    Paiement {i + 1}
                  </p>
                  <div className="flex gap-3 text-black">
                    <button
                      onClick={() => openEditModal(payment)}
                      title="Modifier"
                    >
                      <FiEdit className="hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(payment)}
                      title="Supprimer"
                    >
                      <FiTrash2 className="hover:text-red-600" />
                    </button>
                  </div>
                </div>
                <hr />
                <p className="text-sm text-black">
                  Date :{" "}
                  {payment.payment_date
                    ? new Date(payment.payment_date).toLocaleDateString(
                        "fr-FR",
                        { day: "2-digit", month: "long", year: "numeric" }
                      )
                    : "Non spécifiée"}
                </p>
                <div className="text-sm text-black">
                  <span className="font-medium uppercase">
                    {payment.mode_paiement?.pm_type_name}
                  </span>{" "}
                  -{" "}
                  {payment.payment_method_id === 4
                    ? `${payment.mobilemoneyacount?.mm_phone ?? ""} ${
                        payment.mobilemoneyacount?.mm_operateur ?? ""
                      }`
                    : payment.bankacount
                    ? `${payment.bankacount.ba_titulaire} ${payment.bankacount.ba_name}`
                    : "Aucun compte associé"}
                </div>
                <p className="text-sm italic text-gray-700">
                  {payment.payment_description || ""}
                </p>
                <div className="text-lg font-bold text-right text-black">
                  {Number(payment.amount || 0).toLocaleString("fr-FR")}{" "}
                  {setting.currency_unit}
                </div>
              </div>
            ))
          )}

          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between font-semibold text-black">
              <span>Total payé :</span>
              <span>
                {totalPaid.toLocaleString("fr-FR")} {setting.currency_unit}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-black">
              <span>Reste à payer :</span>
              <span>
                {remaining.toLocaleString("fr-FR")} {setting.currency_unit}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t font-bold text-black">
              <span>Total :</span>
              <span>
                {Number(safeInvoice.invoice_total_amount || 0).toLocaleString(
                  "fr-FR"
                )}{" "}
                {setting.currency_unit}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {editModalOpen && (
        <EditPaymentModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onConfirm={handleConfirmEdit}
          payment={selectedPayment}
        />
      )}
    </AnimatePresence>
  );
}
