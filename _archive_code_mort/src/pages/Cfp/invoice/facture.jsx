import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/fr";
import { Pagination } from "./Pagination";
import { DropdownButton } from "../../../components/Dropdown/dropdown-boutton";
import DropdownItem from "../../../components/Dropdown/dropdown-item";
import { PaiementModal } from "../../../components/Modals/paiment-modal";
import {
  getStatusColor,
  handleApprouve,
  handleCancel,
  handleSendEmail,
} from "../../../services/service-action";
import { EntreprisePopoverCell } from "./liste-facture";
import LoadingModal from "../../../components/Modals/loading-modal";
import DeleteConfirmationModal from "../../../components/Modals/delete-modal";
import { InvoiceContext } from "../../../contexts/invoice";
import useApi from "../../../hooks/Api";
import { Spinner } from "../../../components/ui/spinner";
import { FiTrash2, FiEdit, FiX } from "react-icons/fi";
dayjs.locale("fr");
dayjs.extend(localizedFormat);
export function ResultCherche({ filters, idInvoice, perPage }) {
  const { isPaid } = useContext(InvoiceContext);
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
    currency_unit: "Ariary",
    id_nif_name: 1,
    nif_name: "NIF",
    nif_description: "Numéro d'Identification Fiscale",
    id_stat_name: 1,
    stat_name: "STAT",
  };

  //recuperation donnees
  useEffect(() => {
    const fetchData = async () => {
      let isMounted = true;
      const res = await callApi(`/cfp/factures/id/${idInvoice}`, {
        method: "GET",
        params: {
          ...filters,
          page: pagination.current_page,
          perPage: perPage.perPage,
        },
      });

      if (isMounted && res?.invoices) {
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

    fetchData();
  }, [idInvoice, isPaid, callApi, filters, pagination.current_page, perPage]);

  if (loading || data === null || !setting) return <Spinner />;
  if (error) return <p>Erreur : {error.message}</p>;

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current_page: newPage }));
  };
  return (
    <>
      <div id="contentInvoice" className="">
        <div className="flex flex-col gap-2" id="subContentInvoice">
          <table id="invoiceTable">
            <thead>
              <tr className="border-b-[1px] border-gray-100 hover:bg-gray-50 duration-150 cursor-pointer">
                <th className="p-2 text-base font-semibold text-gray-500">#</th>
                <th className="p-2 text-base font-semibold text-gray-500">
                  Statut
                </th>
                <th className="p-2 text-base font-semibold text-gray-500">
                  Echue
                </th>
                <th className="p-2 text-base font-semibold text-gray-500">
                  Date d'échéance
                </th>
                <th className="p-2 text-base font-semibold text-gray-500">
                  Date facture
                </th>
                <th className="p-2 text-base font-semibold text-center text-gray-500">
                  N° Facture
                </th>
                <th className="p-2 text-base font-semibold text-gray-500">
                  Entreprise
                </th>
                <th className="p-2 text-base font-semibold text-right text-gray-500">
                  Montant dû
                </th>
                <th className="p-2 text-base font-semibold text-right text-gray-500">
                  Restant dû
                </th>
                <th className="p-2 text-base font-semibold text-right text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.invoices.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-2 text-center text-gray-500">
                    Vous n'avez pas de facture pour l'instant
                  </td>
                </tr>
              ) : (
                data.invoices.map((invoice, index) => (
                  <tr
                    key={invoice.idInvoice}
                    className="transition duration-150 border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">
                      <span
                        className="px-3 py-1 text-sm text-white rounded-md"
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
                          <span className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded-md">
                            Echue
                          </span>
                        )}
                    </td>
                    <td className="p-2">
                      {dayjs(invoice.invoice_date_pm).format("D MMMM YYYY")}
                    </td>
                    <td className="p-2">
                      {dayjs(invoice.invoice_date).format("D MMMM YYYY")}
                    </td>
                    <td className="text-center">{invoice.invoice_number}</td>
                    <EntreprisePopoverCell invoice={invoice} />
                    <td className="text-right">
                      {setting?.currency_unit}{" "}
                      {Number(invoice.invoice_total_amount).toLocaleString(
                        "fr-FR"
                      )}
                    </td>
                    <td className="text-right">
                      {setting?.currency_unit}{" "}
                      {Number(invoice.remaining).toLocaleString("fr-FR")}
                    </td>
                    <InvoiceActions
                      invoice={invoice}
                      data={data}
                      setData={setData}
                      index={index}
                    />
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 3. Pagination */}
          {pagination?.last_page > 1 && (
            <Pagination
              setCurrentPage={handlePageChange}
              lastPage={pagination.last_page}
              currentPage={pagination.current_page}
            />
          )}
        </div>
      </div>
    </>
  );
}
function InvoiceActions({ invoice, data, setData, index }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Fonction pour fermer la modale
  const [loading, setLoading] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  // Fonction pour ouvrir la modale
  const openModal = () => setIsModalOpen(true);
  const openOffcanvas = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const closeOffcanvas = () => {
    setSelectedInvoice(null);
  };

  return (
    <>
      {(invoice.invoice_status === 1 || invoice.invoice_status === 2) && (
        <td className="flex justify-end">
          <div className="flex flex-1 btn-group dropdown w-max">
            <div className="inline-flex items-center justify-end w-full">
              {invoice.invoice_status === 1 && (
                <>
                  <button
                    onClick={() =>
                      handleApprouve(
                        invoice.idInvoice,
                        setData,
                        index,
                        setLoading
                      )
                    }
                    className="text-base text-white px-3 py-1 hover:bg-rose-400 bg-rose-500 transition duration-200 outline-none border-[1px] capitalize"
                  >
                    Approuver
                  </button>
                  <LoadingModal
                    visible={loading}
                    message="Approbation en cours ..."
                  />
                </>
              )}
              {invoice.invoice_status === 2 && (
                <>
                  <button
                    onClick={() =>
                      handleSendEmail(
                        invoice.idInvoice,
                        setData,
                        index,
                        setLoading
                      )
                    }
                    className="text-base text-white px-3 py-1 hover:bg-teal-500 bg-teal-600 transition duration-200 outline-none border-[1px] capitalize"
                  >
                    Envoyer
                  </button>
                  <LoadingModal
                    visible={loading}
                    message="Envoie email en cours ..."
                  />
                </>
              )}
              <button
                type="button"
                className={
                  invoice.invoice_status === 1
                    ? "text-white px-3 py-1 h-full hover:bg-rose-500 bg-rose-500 transition-all border-none dropdown-toggle focus:bg-rose-500 border-[1px]"
                    : "text-white px-3 py-1 h-full hover:bg-teal-600 bg-teal-600 transition-all border-none dropdown-toggle focus:bg-teal-600 border-[1px]"
                }
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="visually-hidden">Toggle Dropdown</span>
              </button>
              <ul className="bg-white border-none shadow-md dropdown-menu">
                <DropdownItem
                  type="lien"
                  titre="Voir"
                  idInvoice={invoice.idInvoice}
                />
                {invoice.invoice_status === 1 && (
                  <DropdownItem
                    type="lien"
                    titre="Editer"
                    nature="EditerInvoice"
                    idInvoice={invoice.idInvoice}
                  />
                )}
                <DropdownItem
                  type="lien"
                  titre="Exporter en PDF"
                  idInvoice={invoice.idInvoice}
                />
                <li className="z-50">
                  <button
                    onClick={() =>
                      handleCancel(invoice.idInvoice, setData, index)
                    }
                    className="text-base text-gray-600 transition duration-150 cursor-pointer dropdown-item hover:bg-gray-50 focus:bg-gray-500 focus:text-white"
                  >
                    Annuler
                  </button>
                </li>
                <DropdownItem
                  type="lien"
                  titre="Supprimer"
                  data={data}
                  setData={setData}
                  idInvoice={invoice.idInvoice}
                />
                {invoice.invoice_status === 2 && (
                  <>
                    <DropdownItem
                      type="drawer"
                      titre="Historique de paiement"
                      drawerClick={() => openOffcanvas(invoice)}
                    />
                    <li className="btn-group">
                      <button
                        onClick={openModal}
                        className="text-base text-gray-600 transition duration-150 dropdown-item hover:bg-gray-50 focus:bg-gray-500 focus:text-white"
                      >
                        Paiement
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div
              className="modal fade"
              id={`record${invoice.idInvoice}`}
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex={-1}
            >
              {/* Include modal content here */}
            </div>
          </div>
          {isModalOpen && (
            <div className="modal fade show" style={{ display: "block" }}>
              <div>
                <PaiementModal
                  invoice={invoice}
                  data={data}
                  closeModal={closeModal}
                  setData={setData}
                  index={index}
                />
              </div>
            </div>
          )}
        </td>
      )}
      {(invoice.invoice_status === 4 || invoice.invoice_status === 9) && (
        <td className="flex justify-end p-2 text-base text-gray-500">
          <DropdownButton
            type="simple"
            first="Voir"
            idInvoice={invoice.idInvoice}
          >
            <DropdownItem
              type="lien"
              titre="Exporter en PDF"
              idInvoice={invoice.idInvoice}
            />
            <DropdownItem
              type="drawer"
              titre="Historique de paiement"
              drawerClick={() => openOffcanvas(invoice)}
            />
            <DropdownItem
              type="lien"
              titre="Supprimer"
              data={data}
              setData={setData}
              idInvoice={invoice.idInvoice}
            />
          </DropdownButton>
        </td>
      )}
      {(invoice.invoice_status === 3 ||
        invoice.invoice_status === 5 ||
        invoice.invoice_status === 6 ||
        invoice.invoice_status === 7 ||
        invoice.invoice_status === 8) && (
        <td className="flex justify-end p-2 text-base text-gray-500">
          <DropdownButton type="modal">
            <div className="inline-flex items-center justify-end w-full">
              <button
                onClick={openModal}
                className="text-base text-white px-3 py-1 hover:bg-[#A462A4] bg-[#A462A4] transition duration-200 outline-none border-[1px] capitalize"
              >
                Paiement
              </button>
              {isModalOpen && (
                <div className="modal fade show" style={{ display: "block" }}>
                  <div>
                    <PaiementModal
                      invoice={invoice}
                      data={data}
                      setData={setData}
                      closeModal={closeModal}
                      index={index}
                    />
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              className="text-white px-3 py-1 text-sm hover:bg-[#A462A4] bg-[#A462A4] transition-all border-[#A462A4] dropdown-toggle focus:bg-[#A462A4] border-[1px]"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul className="dropdown-menu border-none bg-white border-[1px] border-[#A462A4] shadow">
              <DropdownItem
                type="lien"
                titre="Voir"
                idInvoice={invoice.idInvoice}
              />
              <DropdownItem
                type="lien"
                titre="Exporter en PDF"
                idInvoice={invoice.idInvoice}
              />
              <DropdownItem
                type="drawer"
                titre="Historique de paiement"
                drawerClick={() => openOffcanvas(invoice)}
              />
              <DropdownItem
                type="lien"
                titre="Supprimer"
                idInvoice={invoice.idInvoice}
                data={data}
                setData={setData}
              />
            </ul>
          </DropdownButton>
        </td>
      )}
      {invoice.invoice_status === null && (
        <td className="text-center">Statut non défini</td>
      )}
      {selectedInvoice && (
        <td>
          <PaymentHistoryOffcanvas
            invoice={selectedInvoice}
            onClose={closeOffcanvas}
            setData={setData}
            index={index}
          />
        </td>
      )}
    </>
  );
}

const PaymentHistoryOffcanvas = ({ invoice, onClose, setData, index }) => {
  const [payments, setPayments] = useState(invoice.payments);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const wrapperRef = useRef(null);
  const modalRef = useRef(null);

  const setting = JSON.parse(sessionStorage.getItem("setting"));
  const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount), 0);
  const remaining = invoice.invoice_total_amount - totalPaid;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const openModal = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };
  const onEdit = (payment) => {
    setSelectedPayment(payment);
    setEditModalOpen(true);
  };

  const onDeletePayment = async (paymentId) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success === true) {
        setData((prevData) => ({
          ...prevData,
          invoices: prevData.invoices.map((invoiceItem, i) => {
            if (i === index) {
              const deletedPayment = invoiceItem.payments.find(
                (p) => p.id === paymentId
              );
              const newPayments = invoiceItem.payments.filter(
                (p) => p.id !== paymentId
              );
              const toNumber = (value) =>
                isNaN(parseFloat(value)) ? 0 : parseFloat(value);
              const newRemaining =
                toNumber(invoiceItem.remaining) +
                toNumber(deletedPayment.amount);
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

        setPayments((prev) => prev.filter((p) => p.id !== paymentId));
        setModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression. Veuillez réessayer.");
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideOffcanvas =
        wrapperRef.current && !wrapperRef.current.contains(event.target);

      const clickedOutsideDeleteModal =
        !modalOpen ||
        (modalRef.current && !modalRef.current.contains(event.target));

      const editModalIsOpen = editModalOpen; // 🔒 On vérifie si edit modal est ouverte

      // ❌ Ne pas fermer l'offcanvas si la modale d'édition est ouverte
      if (
        !editModalIsOpen &&
        clickedOutsideOffcanvas &&
        clickedOutsideDeleteModal
      ) {
        onClose();
      }
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
        `http://127.0.0.1:8000/api/payments/${paymentId}`,
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
    <>
      <div
        ref={wrapperRef}
        className="fixed top-0 right-0 h-full w-[40em] bg-white z-50 overflow-y-auto shadow-lg"
      >
        <div className="flex flex-col w-full h-full bg-white">
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

          <div className="p-6 space-y-6 overflow-y-auto bg-white">
            {totalPaid === 0 ? (
              <p className="font-medium text-center text-black">
                Aucun paiement effectué sur cette facture.
              </p>
            ) : (
              payments.map((payment, i) => (
                <div
                  key={payment.id}
                  className="p-4 space-y-2 bg-white border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-black">
                      {i + 1}e Paiement
                    </p>
                    <div className="flex items-center gap-3 text-black">
                      <button
                        onClick={() => onEdit(payment.id)}
                        title="Modifier"
                      >
                        <FiEdit className="hover:text-blue-600" />
                      </button>
                      <button
                        onClick={() => openModal(payment.id)}
                        title="Supprimer"
                      >
                        <FiTrash2 className="hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                  <hr />
                  <p className="text-sm text-black">
                    Date :{" "}
                    {new Date(payment.payment_date).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
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
        </div>
      </div>
      <EditPaymentModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onConfirm={onConfirmEdit}
        payment={selectedPayment}
      />
    </>
  );
};
const EditPaymentModal = ({ isOpen, onClose, onConfirm, payment }) => {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (payment) {
      setAmount(payment.amount);
    }
  }, [payment]);

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md p-6 space-y-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Modifier Paiement</h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-red-500"
          >
            &times;
          </button>
        </div>

        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Nouveau montant
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded outline-none focus:ring focus:border-purple-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(payment, amount)}
            className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-500"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};
