import axios from "../../../config/axios";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/fr";
import { Pagination } from "./Pagination";
import {
  getStatusColor,
  handleApprouve,
  handleCancel,
  handleSendEmail,
} from "../../../services/service-action";
import { EntreprisePopoverCell } from "./liste-facture";
import useApi from "../../../hooks/Api";
import { Spinner } from "../../../components/ui/spinner";
import { FiMoreVertical } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiEdit, FiTrash2 } from "react-icons/fi";
import DeleteConfirmationModal from "../../../components/Modals/delete-modal";
import { PaiementModal } from "../../../components/Modals/paiment-modal";
import LoadingModal from "../../../components/Modals/loading-modal";
import { useNavigate } from "react-router-dom";
import { ExportPdf } from "../../../services/export-pdf";
import { InvoiceStatusChanger } from "./InvoiceStatusChanger";
import { PaiementModalGrouped } from "../../../components/Modals/paiment-modal-grouped";
import { EditPaymentModal } from "./Modal/editPayements";
import { HistoryPayements } from "./Modal/historyPayements";
import { FileUp, HandCoins } from "lucide-react";
import { API_URL } from "../../../config/env";
dayjs.locale("fr");
dayjs.extend(localizedFormat);

export function ResultCherche({ filters, idInvoice, perPage }) {
  const [isPaid, setIsPaid] = useState(0);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 0,
    total: 0,
  });
  const { callApi, loading, error } = useApi();
  const [data, setData] = useState(null);

  const setting = {
    country_name: "Madagascar",
    country_code: "MG",
    currency_code: "MGA",
    currency_unit: "Ar",
    id_nif_name: 1,
    nif_name: "NIF",
    nif_description: "Numéro d'Identification Fiscale",
    id_stat_name: 1,
    stat_name: "STAT",
  };

  // Récupération des données
  useEffect(() => {
    const fetchData = async (perPage) => {
      const res = await callApi(`/cfp/factures/id/${idInvoice}`, {
        method: "GET",
        params: {
          ...filters,
          page: pagination.current_page,
          perPage: perPage,
        },
      });

      if (res?.invoices) {
        const updatedInvoices = res.invoices.data.map((invoice) => {
          const total = Number(invoice.invoice_total_amount) || 0;
          const paid = Array.isArray(invoice.payments)
            ? invoice.payments.reduce(
                (acc, p) => acc + (Number(p.amount) || 0),
                0
              )
            : 0;
          const remaining = total - paid;
          return { ...invoice, remaining };
        });

        setData({
          ...res,
          invoices: updatedInvoices,
        });
        setPagination({
          current_page: res.invoices.current_page,
          last_page: res.invoices.last_page,
          total: res.invoices.total,
        });
      }
    };

    fetchData(perPage);
  }, [idInvoice, isPaid, callApi, filters, pagination.current_page, perPage]);

  if (loading || data === null || !setting) return <Spinner />;
  if (error) return <p>Erreur : {error.message}</p>;

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current_page: newPage }));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 border-b bg-gray-50">
              <th className="p-2 ">#</th>
              <th className="p-2 text-left">Statut</th>
              <th className="p-2 text-left">Échue</th>
              <th className="p-2 text-left">Date d'échéance</th>
              <th className="p-2 text-left">Date facture</th>
              <th className="p-2 text-left">N° Facture</th>
              <th className="p-2 text-left">Entreprise</th>
              <th className="p-2 text-right">Montant HT</th>
              <th className="p-2 text-right">Réduction</th>
              <th className="p-2 text-right">TVA</th>
              <th className="p-2 text-right">Montant dû</th>
              <th className="p-2 text-right">Restant dû</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.invoices.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="p-4 italic text-center text-gray-500"
                >
                  Vous n'avez pas de facture pour l'instant
                </td>
              </tr>
            ) : (
              data.invoices.map((invoice, index) => (
                <tr
                  key={invoice.idInvoice}
                  className="transition border-b hover:bg-gray-50"
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">
                    <span
                      className="px-3 py-1 text-xs text-white rounded-md"
                      style={{
                        backgroundColor: getStatusColor(
                          invoice.status?.idInvoiceStatus
                        ),
                      }}
                    >
                      {invoice.status?.invoice_status_name || ""}
                    </span>
                  </td>
                  <td className="p-2">
                    {new Date(invoice.invoice_date_pm) < new Date() &&
                      ![1, 4, 9].includes(invoice.invoice_status) && (
                        <span className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded">
                          Échue
                        </span>
                      )}
                  </td>
                  <td className="p-2">
                    {dayjs(invoice.invoice_date_pm).format("D MMMM YYYY")}
                  </td>
                  <td className="p-2">
                    {dayjs(invoice.invoice_date).format("D MMMM YYYY")}
                  </td>
                  <td className="p-2 text-center">
                    {invoice.idTypeFacture === 3 ? (
                      <span className="inline-flex items-center gap-1">
                        <div className="relative group">
                          <HandCoins className="w-5 h-5 text-orange-700 bg-orange-100 rounded-full" />
                          <div className="absolute z-50 px-2 py-1 mb-2 text-xs text-white transition-opacity duration-200 transform -translate-x-1/2 bg-orange-800 rounded opacity-0 bottom-full left-1/2 group-hover:opacity-100 whitespace-nowrap">
                            Facture Acompte
                            <div className="absolute transform -translate-x-1/2 border-4 border-transparent top-full left-1/2 border-t-orange-800"></div>
                          </div>
                        </div>
                        {invoice.invoice_number}
                      </span>
                    ) : invoice.idTypeFacture === 4 ? (
                      <span className="inline-flex items-center gap-1">
                        <div className="relative group">
                          <FileUp className="w-5 h-5 text-green-700 bg-green-100 rounded-full" />
                          <div className="absolute z-50 px-2 py-1 mb-2 text-xs text-white transition-opacity duration-200 transform -translate-x-1/2 bg-green-800 rounded opacity-0 bottom-full left-1/2 group-hover:opacity-100 whitespace-nowrap">
                            Facture Solde
                            <div className="absolute transform -translate-x-1/2 border-4 border-transparent top-full left-1/2 border-t-green-800"></div>
                          </div>
                        </div>
                        {invoice.invoice_number}
                      </span>
                    ) : (
                      invoice.invoice_number
                    )}
                  </td>
                  <td className="p-2">
                    <EntreprisePopoverCell invoice={invoice} />
                  </td>
                  <td className="p-2 text-right">
                    {setting?.currency_unit}{" "}
                    {Number(invoice.invoice_sub_total).toLocaleString("fr-FR")}
                  </td>
                  <td className="p-2 text-right">
                    {setting?.currency_unit}{" "}
                    {Number(invoice.invoice_reduction).toLocaleString("fr-FR")}
                  </td>
                  <td className="p-2 text-right">
                    {setting?.currency_unit}{" "}
                    {Number(invoice.invoice_tva).toLocaleString("fr-FR")}
                  </td>
                  <td className="p-2 text-right">
                    {setting?.currency_unit}{" "}
                    {Number(invoice.invoice_total_amount).toLocaleString(
                      "fr-FR"
                    )}
                  </td>
                  <td className="p-2 text-right">
                    {setting?.currency_unit}{" "}
                    {invoice.status?.idInvoiceStatus === 4
                      ? "0"
                      : Number(invoice.remaining).toLocaleString("fr-FR")}
                  </td>
                  <td className="flex items-center justify-end">
                    <InvoiceActions
                      invoice={invoice}
                      data={data}
                      setData={setData}
                      index={index}
                      setIsPaid={setIsPaid}
                    />
                    <InvoiceStatusChanger
                      idInvoice={invoice.idInvoice}
                      onStatusChanged={(newStatusId) => {
                        setData((prevData) => ({
                          ...prevData,
                          invoices: prevData.invoices.map((inv, i) =>
                            i === index
                              ? {
                                  ...inv,
                                  invoice_status: newStatusId,
                                  status: {
                                    ...inv.status,
                                    idInvoiceStatus: newStatusId,
                                    invoice_status_name:
                                      [
                                        "",
                                        "Brouillon",
                                        "Non envoyé",
                                        "Envoyé",
                                        "Payé",
                                        "Partiel",
                                        "Impayé",
                                        "Convertis",
                                        "Expiré",
                                        "Annulé",
                                        "En relance active",
                                        "Douteuse",
                                        "En litige",
                                        "Irrecouvrable",
                                        "Transmis à huissier",
                                        "En poursuite judiciaire",
                                      ][newStatusId] ||
                                      inv.status.invoice_status_name,
                                  },
                                }
                              : inv
                          ),
                        }));
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination?.last_page > 1 && (
          <Pagination
            onPageChange={handlePageChange}
            lastPage={pagination.last_page}
            currentPage={pagination.current_page}
            totalItems={pagination.total}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------
   InvoiceActions (dropdown + modales intégrées)
--------------------------------- */
function InvoiceActions({ invoice, data, setData, index, setIsPaid }) {
  const [open, setOpen] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const dropdownRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenPayementGrouped, setIsModalOpenPayementGrouped] =
    useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const VoirDetails = (idInvoice) => {
    navigate(`/cfp/facture/details/${idInvoice}`);
  };

  const handleEdit = (idInvoice, idTypeFacture) => {
    if (idTypeFacture === 1) {
      navigate(`/cfp/facture/modifie-facture/${idInvoice}`);
    } else if (idTypeFacture === 2) {
      navigate(`/cfp/proforma/modifie-proforma/${idInvoice}`);
    } else if (idTypeFacture === 3) {
      navigate(`/cfp/facture/modifie-acompte/${idInvoice}`);
    } else if (idTypeFacture === 4) {
      navigate(`/cfp/facture/modifie-solde/${idInvoice}`);
    }
  };

  // Suppression de facture
  const handleDeleteInvoice = async (idInvoice) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await axios.get(`/cfp/factures/${idInvoice}/destroy`);

      if (response.data.status === 200) {
        // Supprimer de l'affichage immédiatement
        setData((prevData) => ({
          ...prevData,
          invoices: prevData.invoices.filter(
            (inv) => inv.idInvoice !== idInvoice
          ),
        }));
        setMessage("Facture archivée avec succès.");
      } else {
        throw new Error(response.data.message || "Erreur lors de l'archivage");
      }
    } catch (error) {
      console.error("Erreur archivage:", error);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Erreur lors de l'archivage de la facture."
      );
    } finally {
      setLoading(false);
      setOpen(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <td className="relative p-2 text-right" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 transition rounded hover:bg-gray-200"
      >
        <FiMoreVertical className="text-gray-600" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 w-56 mt-2 bg-white border rounded-lg shadow-lg">
          {/*bouton envoie email*/}
          {invoice.invoice_status === 2 && (
            <>
              <button
                onClick={() => {
                  handleSendEmail(
                    invoice.idInvoice,
                    setData,
                    index,
                    setLoading,
                    setMessage
                  );
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
              >
                Envoyer Email
              </button>
            </>
          )}

          {/*bouton approuver facture*/}
          {invoice.invoice_status === 1 && (
            <>
              <button
                onClick={() => {
                  handleApprouve(
                    invoice.idInvoice,
                    setData,
                    index,
                    setLoading,
                    setMessage
                  );
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
              >
                Approuver
              </button>

              <button
                onClick={() => {
                  handleEdit(invoice.idInvoice, invoice.idTypeFacture);
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
              >
                Modifier
              </button>
              <button
                onClick={() => handleCancel(invoice.idInvoice, setData, index)}
                className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
              >
                Annuler
              </button>
            </>
          )}

          {/*bouton  de paiement facture*/}
          {invoice.invoice_status !== 1 &&
            invoice.invoice_status !== 9 &&
            invoice.invoice_status !== 4 && (
              <>
                <button
                  onClick={openModal}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  Paiement
                </button>
                <button
                  onClick={() => setIsModalOpenPayementGrouped(true)}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  Paiement groupée
                </button>
              </>
            )}
          {/*bouton historique de paiement facture*/}
          {(invoice.invoice_status === 4 || invoice.invoice_status === 5) && (
            <>
              <button
                onClick={() => {
                  setShowPayments(true);
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
              >
                Historique de paiements
              </button>
            </>
          )}

          {isModalOpen && (
            <div className="modal fade show" style={{ display: "block" }}>
              <div>
                <PaiementModal
                  invoice={invoice}
                  data={data}
                  closeModal={closeModal}
                  setData={setData}
                  index={index}
                  setIsPaid={setIsPaid}
                />
              </div>
            </div>
          )}
          {isModalOpenPayementGrouped && (
            <div className="modal fade show" style={{ display: "block" }}>
              <div>
                <PaiementModalGrouped
                  invoice={invoice}
                  data={data}
                  closeModal={() => setIsModalOpenPayementGrouped(false)}
                  setData={setData}
                  index={index}
                  setIsPaid={setIsPaid}
                />
              </div>
            </div>
          )}
          {/*voir details facture */}
          <button
            onClick={() => VoirDetails(invoice.idInvoice)}
            className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
          >
            Voir
          </button>
          <button
            onClick={() => {
              ExportPdf(invoice.idInvoice);
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
          >
            Export pdf
          </button>
          <button
            onClick={() => handleDeleteInvoice(invoice.idInvoice)}
            className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
          >
            Supprimer
          </button>
        </div>
      )}
      <LoadingModal visible={loading} message={message} />
      {/* Drawer Paiements */}
      {showPayments && (
        <HistoryPayements
          index={index}
          onClose={() => setShowPayments(false)}
          invoice={invoice}
          setData={setData}
        />
      )}
      {/* Modale Edition Paiement */}
      <EditPaymentModal
        show={showEdit}
        onClose={() => setShowEdit(false)}
        payment={selectedPayment}
      />
    </td>
  );
}

/* ------------------------------
   PaymentHistoryOffcanvas
--------------------------------- */

export function PaymentHistoryDrawer({ invoice, onClose, setData, index }) {
  console.log("invoice", invoice);
  const [payments, setPayments] = useState(invoice.payments);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState({
    idPayement: null,
    idInvoice: null,
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const wrapperRef = useRef(null);
  const modalRef = useRef(null);

  const setting = JSON.parse(sessionStorage.getItem("setting"));
  const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount), 0);
  const remaining = invoice.invoice_total_amount - totalPaid;

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
      const response = await axios.delete(
        `${API_URL}/invoice/${item.idInvoice}/payments/${item.idPayement}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        setData((prevData) => ({
          ...prevData,
          invoices: prevData.invoices.map((invoiceItem, i) => {
            if (i === index) {
              const deletedPayment = invoiceItem.payments.find(
                (p) => p.id === item.idPayement
              );
              const newPayments = invoiceItem.payments.filter(
                (p) => p.id !== item.idPayement
              );
              const newRemaining =
                Number(invoiceItem.remaining) + Number(deletedPayment.amount);
              const newStatus = newRemaining === 0 ? 4 : 5;

              return {
                ...invoiceItem,
                payments: newPayments,
                remaining: newRemaining,
                invoice_status: newStatus,
                status: {
                  ...invoiceItem.status,
                  idInvoiceStatus: newStatus,
                  invoice_status_name: newStatus === 4 ? "Payé" : "Partiel",
                },
              };
            }
            return invoiceItem;
          }),
        }));

        setPayments((prev) => prev.filter((p) => p.id !== item.idPayement));
        setModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression. Veuillez réessayer.");
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
        (acc, p) => acc + Number(p.amount),
        0
      );
      const newRemaining = invoice.invoice_total_amount - newTotalPaid;
      const newStatusCode = newRemaining === 0 ? 4 : 5;

      // Requête API : envoi de amount, payment_status et invoice_status
      const response = await axios.put(
        `${API_URL}/payments/${paymentId}`,
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
          {totalPaid === 0 ? (
            <p className="font-medium text-center text-black">
              Aucun paiement effectué sur cette facture.
            </p>
          ) : (
            payments.map((payment, i) => (
              <div
                key={payment.id ?? `payment-${i}`}
                className="p-4 space-y-2 bg-white border rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-black">
                    {i + 1}e Paiement
                  </p>
                  <div className="flex items-center gap-3 text-black">
                    <button onClick={() => onEdit(payment.id)} title="Modifier">
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
                    {payment.mode_paiement.pm_type_name}
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
                  value={payment.payment_description}
                  readOnly
                />
                <div className="text-lg font-bold text-right text-black">
                  {Number(payment.amount).toLocaleString("fr-FR")}{" "}
                  {setting?.currency_unit}
                </div>
              </div>
            ))
          )}

          {/* Totaux */}
          <div className="pt-4 space-y-2 border-t">
            <div className="flex justify-between font-semibold text-black">
              <span>Total payé :</span>
              <span>
                {totalPaid.toLocaleString("fr-FR")} {setting?.currency_unit}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-black">
              <span>Reste à payer :</span>
              <span>
                {remaining.toLocaleString("fr-FR")} {setting?.currency_unit}
              </span>
            </div>
            <div className="flex justify-between pt-2 font-bold text-black border-t">
              <span>Total :</span>
              <span>
                {Number(invoice.invoice_total_amount).toLocaleString("fr-FR")}{" "}
                {setting?.currency_unit}
              </span>
            </div>
          </div>
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
