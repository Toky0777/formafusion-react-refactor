import { useEffect, useRef, useState } from "react";
import axios from "../../../../config/axios";
import { motion, AnimatePresence } from "framer-motion";
import DeleteConfirmationModal from "../../../../components/Modals/delete-modal";
import { FiEdit, FiTrash2, FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { EditPaymentModal } from "./editPayements";

// Composant de loading card
function LoadingCard() {
  return (
    <div className="p-4 space-y-3 bg-white border rounded-lg animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="flex gap-3">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="h-px bg-gray-200"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-6 bg-gray-200 rounded w-1/4 ml-auto"></div>
    </div>
  );
}

export function HistoryPayements({ invoice, onClose, setData, index }) {
  const [payments, setPayments] = useState([]);
  const [paymentsGrouped, setPaymentsGrouped] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showGroupedDetails, setShowGroupedDetails] = useState(false);
  
  const [selectedId, setSelectedId] = useState({
    idPayement: null,
    idInvoice: null,
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const wrapperRef = useRef(null);
  const modalRef = useRef(null);

  const setting = JSON.parse(sessionStorage.getItem("setting"));
  
  // Correction du problème NaN - utilisation de Number() et vérification
  const totalPaid = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const remaining = (Number(invoice.invoice_total_amount) || 0) - totalPaid;

  // Calcul du total des paiements groupés avec vérification
  const totalGrouped = paymentsGrouped.reduce((acc, pg) => acc + (Number(pg.amount) || 0), 0);

  const openModal = (idPay, idInvoice) => {
    setSelectedId({
      idPayement: idPay,
      idInvoice: idInvoice,
    });
    setModalOpen(true);
  };

  const onEdit = (payment) => {
    setSelectedPayment(payment);
    setEditModalOpen(true);
  };

  const onDeletePayment = async (item) => {
    try {
      const response = await axios.delete(`/payments/${item.idPayement}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        // Recalculer le reste après suppression
        const updatedPayments = payments.filter(p => p.id !== item.idPayement);
        const newTotalPaid = updatedPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
        const newRemaining = (Number(invoice.invoice_total_amount) || 0) - newTotalPaid;
        const newStatusCode = newRemaining === 0 ? 4 : newRemaining === Number(invoice.invoice_total_amount) ? 1 : 5;

        // Mettre à jour le state global
        setData((prevData) => ({
          ...prevData,
          invoices: prevData.invoices.map((invoiceItem, i) => {
            if (i === index) {
              return {
                ...invoiceItem,
                payments: updatedPayments,
                remaining: newRemaining,
                invoice_status: newStatusCode,
                status: {
                  ...invoiceItem.status,
                  idInvoiceStatus: newStatusCode,
                  invoice_status_name: newStatusCode === 4 ? "Payé" : newStatusCode === 1 ? "Impayé" : "Partiel",
                },
              };
            }
            return invoiceItem;
          }),
        }));

        // Mettre à jour le state local
        setPayments(updatedPayments);
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du paiement.");
    }
  };

  // Fermer le drawer si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideOffcanvas =
        wrapperRef.current && !wrapperRef.current.contains(event.target);
      const clickedOutsideDeleteModal =
        !modalOpen ||
        (modalRef.current && !modalRef.current.contains(event.target));
      if (
        !editModalOpen &&
        clickedOutsideOffcanvas &&
        clickedOutsideDeleteModal
      )
        onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, modalOpen, editModalOpen]);

  const onConfirmEdit = async (paymentId, newAmount, newPaymentStatus) => {
    try {
      // Calcul anticipé du nouveau statut de la facture
      const updatedPayments = payments.map((p) =>
        p.id === paymentId ? { ...p, amount: newAmount } : p
      );
      const newTotalPaid = updatedPayments.reduce(
        (acc, p) => acc + (Number(p.amount) || 0),
        0
      );
      const newRemaining = (Number(invoice.invoice_total_amount) || 0) - newTotalPaid;
      const newStatusCode = newRemaining === 0 ? 4 : 5;

      // Requête API : envoi de amount, payment_status et invoice_status
      const response = await axios.put(
        `/payments/${paymentId}`,
        {
          amount: newAmount,
          payment_status: newPaymentStatus,
          invoice_status: newStatusCode,
          invoice_id: invoice.idInvoice,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        // Mise à jour du state global
        setData((prevData) => ({
          ...prevData,
          invoices: prevData.invoices.map((invoiceItem, i) => {
            if (i === index) {
              const updatedPayments = invoiceItem.payments.map((p) =>
                p.id === paymentId
                  ? {
                    ...p,
                    amount: newAmount,
                    payment_status: newPaymentStatus,
                  }
                  : p
              );

              return {
                ...invoiceItem,
                payments: updatedPayments,
                remaining: newRemaining,
                invoice_status: newStatusCode,
                status: {
                  ...invoiceItem.status,
                  idInvoiceStatus: newStatusCode,
                  invoice_status_name: newStatusCode === 4 ? "Payé" : "Partiel",
                },
              };
            }
            return invoiceItem;
          }),
        }));

        // Mise à jour du state local
        setPayments((prev) =>
          prev.map((p) =>
            p.id === paymentId
              ? {
                ...p,
                amount: newAmount,
                payment_status: newPaymentStatus,
              }
              : p
          )
        );

        setEditModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la modification.");
    }
  };

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        setLoading(true);
        const res = await axios.get(`/payments/${id}`);
        setPayments(res.data.payments || []);
        setPaymentsGrouped(res.data.payments_grouped || []);
      } catch (error) {
        console.error("Erreur lors du chargement des paiements:", error);
        setPayments([]);
        setPaymentsGrouped([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData(invoice.idInvoice);
  }, [invoice]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        ref={wrapperRef}
        className="fixed top-0 right-0 z-50 flex flex-col w-full h-full max-w-2xl overflow-y-auto bg-white shadow-xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
      >
        <div ref={modalRef}>
          <DeleteConfirmationModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={onDeletePayment}
            itemId={selectedId}
          />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-black">
            Paiements | Facture N°: {invoice.invoice_number}
          </h2>
          <button onClick={onClose} className="hover:text-red-600">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 bg-white">
          {loading ? (
            // Affichage du loading
            <div className="space-y-4">
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </div>
          ) : payments.length === 0 ? (
            <p className="font-medium text-center text-black">
              Aucun paiement effectué sur cette facture.
            </p>
          ) : (
            payments.map((payment, i) => (
              <div
                key={i}
                className="p-4 space-y-2 bg-white border rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-black">
                    {i + 1}e Paiement
                  </p>
                  <div className="flex items-center gap-3 text-black">
                    <button onClick={() => onEdit(payment)} title="Modifier">
                      <FiEdit className="hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => openModal(payment.id, invoice.idInvoice)}
                      title="Supprimer"
                    >
                      <FiTrash2 className="hover:text-red-600" />
                    </button>
                  </div>
                </div>
                <hr />
                <p className="text-sm text-black">
                  Date:{" "}
                  {new Date(payment.payment_date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-black">
                  <span className="font-medium uppercase">
                    {payment.pm_type_name}
                  </span>
                  {payment.payment_method_id !== 4 ? (
                    payment.payment_method_id === 3 ? null : (
                      <span>
                        -{" "}
                        {payment.bankacount
                          ? `${payment.bankacount.ba_titulaire} ${payment.bankacount.ba_name}`
                          : "aucun compte bancaire associé"}
                      </span>
                    )
                  ) : (
                    <span>
                      - {payment.mobilemoneyacount?.mm_phone}{" "}
                      {payment.mobilemoneyacount?.mm_operateur}
                    </span>
                  )}
                </div>
                <input
                  className="w-full text-sm text-black bg-transparent outline-none"
                  name="payment_description"
                  value={payment.payment_description || ""}
                  readOnly
                />
                <div className="text-lg font-bold text-right text-black">
                  {(Number(payment.amount) || 0).toLocaleString("fr-FR")}{" "}
                  {setting?.currency_unit}
                </div>
              </div>
            ))
          )}

          {/* Section des paiements groupés */}
          {!loading && paymentsGrouped.length > 0 && (
            <div className="p-4 space-y-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Paiement Groupé
                  </p>
                  <p className="text-sm text-gray-700">
                    {paymentsGrouped.length} facture(s) regroupée(s)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowGroupedDetails(!showGroupedDetails)}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    title={showGroupedDetails ? "Masquer les détails" : "Voir les détails"}
                  >
                    {showGroupedDetails ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    {showGroupedDetails ? "Masquer" : "Voir"}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between text-gray-900">
                <span className="font-medium">Montant total groupé :</span>
                <span className="font-bold">
                  {totalGrouped.toLocaleString("fr-FR")} {setting?.currency_unit}
                </span>
              </div>

              {/* Détails des paiements groupés */}
              <AnimatePresence>
                {showGroupedDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 space-y-2 border-t border-gray-200"
                  >
                    <p className="text-sm font-medium text-gray-800">Détails des factures :</p>
                    {paymentsGrouped.map((groupedPayment, index) => (
                      <div
                        key={groupedPayment.id}
                        className="p-3 bg-white border border-gray-100 rounded-md"
                      >
                        <div className="flex justify-between text-sm text-gray-900">
                          <span>Facture N°: {groupedPayment.invoice_number}</span>
                          <span className="font-semibold">
                            {(Number(groupedPayment.amount) || 0).toLocaleString("fr-FR")} {setting?.currency_unit}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Date: {new Date(groupedPayment.payment_date).toLocaleDateString("fr-FR")}
                        </div>
                        <div className="text-xs text-gray-600">
                          Méthode: {groupedPayment.payment_method_id === 1 ? "Virement" : 
                                   groupedPayment.payment_method_id === 2 ? "Chèque" :
                                   groupedPayment.payment_method_id === 3 ? "Espèces" : "Mobile Money"}
                        </div>
                        {groupedPayment.payment_description && (
                          <div className="text-xs text-gray-600">
                            Description: {groupedPayment.payment_description}
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Totaux */}
          {!loading && (
            <div className="pt-4 space-y-2 border-t">
              <div className="flex justify-between font-semibold text-black">
                <span>Total paiment simple :</span>
                <span>
                  {totalPaid.toLocaleString("fr-FR")} {setting?.currency_unit}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-black">
                <span>Reste à payer :</span>
                <span>
                  {paymentsGrouped.length > 0 ? "0" : remaining.toLocaleString("fr-FR")} {setting?.currency_unit}
                </span>
              </div>
              <div className="flex justify-between pt-2 font-bold text-black border-t">
                <span>Total facture :</span>
                <span>
                  {(Number(invoice.invoice_total_amount) || 0).toLocaleString("fr-FR")}{" "}
                  {setting?.currency_unit}
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <EditPaymentModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onConfirm={onConfirmEdit}
        payment={selectedPayment}
      />
    </AnimatePresence>
  );
}