import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExportPdf } from "../../../../services/export-pdf";
import { FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { PaiementModal } from "../../../../components/Modals/paiment-modal";
import { PaymentHistoryDrawer } from "../result-recherche";
import axios from "../../../../config/axios";
import useApi from "../../../../hooks/Api";
import { Spinner } from "../../../../components/ui/spinner";
import InvoiceStatusDropdown from "../components/InvoiceStatusDropdown";

export function HeaderInvoice({ data, onDataUpdate }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentData, setPaymentData] = useState(null);
  const { callApi } = useApi();
  const dropdownRef = useRef(null);

  // Fermer dropdown au clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Charger les données pour le modal de paiement
  useEffect(() => {
    const fetchPaymentData = async () => {
      if (showPaymentModal && data?.invoice?.idInvoice) {
        try {
          const [pmTypesRes, baAccountsRes] = await Promise.all([
            callApi('/cfp/factures_acounts/getTypePaiements'),
            callApi('/cfp/factures_acounts/getBankAcounts'),
          ]);

          setPaymentData({
            pm_types: pmTypesRes || [],
            ba_accounts: baAccountsRes || [],
          });
        } catch (error) {
          console.error("Erreur lors du chargement des données de paiement:", error);
          setPaymentData({
            pm_types: [],
            ba_accounts: [],
          });
        }
      }
    };

    fetchPaymentData();
  }, [showPaymentModal, data?.invoice?.idInvoice, callApi]);

  // Fonction pour supprimer la facture
  const handleDeleteInvoice = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.get(`/cfp/factures/${data.invoice.idInvoice}/destroy`);

      if (response.data.status === 200) {
        setMessage("Facture archivée avec succès.");
        setTimeout(() => {
          navigate("/cfp/facture");
        }, 1500);
      } else {
        throw new Error(response.data.message || "Erreur lors de la suppression.");
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
      setShowDeleteModal(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Fonction pour ouvrir le modal de paiement
  const openPaymentModal = () => {
    setShowPaymentModal(true);
    setDropdownOpen(false);
  };

  // Fonction pour ouvrir l'historique des paiements
  const openPaymentHistory = () => {
    setShowPaymentHistory(true);
    setDropdownOpen(false);
  };

  // Fonction pour ouvrir la modal de suppression
  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setDropdownOpen(false);
  };

  // Fonction pour gérer la mise à jour après paiement
  const handlePaymentSuccess = () => {
    if (onDataUpdate) {
      onDataUpdate();
    }
  };

  // Fonction pour fermer le modal de paiement avec rechargement
  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentData(null);
    handlePaymentSuccess();
  };

  return (
    <div className="flex items-center justify-between w-full pt-4">
      {/* Titre et retour */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center px-3 py-1 text-sm font-medium text-white transition bg-gray-400 rounded-md cursor-pointer hover:bg-blue-700"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-700 uppercase">
            {data.invoice.typeFacture} #
            <span className="text-xl font-semibold text-gray-700">
              {data.invoice.invoice_number}
            </span>
          </h1>

          <InvoiceStatusDropdown
            invoice={data.invoice}
            onStatusChange={(invoiceId, newStatusId) => {
              if (onDataUpdate) {
                onDataUpdate();
              }
            }}
            mode="show"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="relative flex items-center gap-2 bg-white">
        {/* Boutons Edit / Dropdown */}
        <div
          className="flex overflow-hidden border border-gray-400 rounded-full"
          ref={dropdownRef}
        >
          <button
            onClick={() => {
              if (data.invoice.idTypeFacture === 1) {
                navigate(`/cfp/facture/modifie-facture/${data.invoice?.idInvoice}`);
              } else if (data.invoice.idTypeFacture === 2) {
                navigate(`/cfp/proforma/modifie-proforma/${data.invoice?.idInvoice}`);
              } else if (data.invoice.idTypeFacture === 3) {
                navigate(`/cfp/facture/modifie-acompte/${data.invoice?.idInvoice}`);
              } else if (data.invoice.idTypeFacture === 4) {
                navigate(`/cfp/facture/modifie-solde/${data.invoice?.idInvoice}`);
              }
            }}
            className="px-4 py-2 text-gray-600 transition hover:text-gray-700"
          >
            Editer
          </button>

          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center px-3 py-2 text-gray-600 transition hover:bg-gray-200"
          >
            <FiChevronDown size={18} />
          </button>

          {/* Dropdown Tailwind */}
          {dropdownOpen && (
            <ul className="absolute left-0 z-20 bg-white border border-gray-200 rounded-md shadow-md mt-11 w-55">
              <li>
                <div
                  onClick={() => ExportPdf(data.invoice.idInvoice)}
                  className="px-4 py-2 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  Exporter en PDF
                </div>
              </li>

              {/* Option Paiement */}
              {data.invoice.idTypeFacture === 1 && (
                <>
                  {data.invoice.invoice_status !== 1 && data.invoice.invoice_status !== 9 && (
                    <li>
                      <div
                        onClick={openPaymentModal}
                        className="px-4 py-2 text-gray-600 cursor-pointer hover:bg-gray-100"
                      >
                        Paiement
                      </div>
                    </li>
                  )}

                  {/* Option Historique de paiement */}
                  {(data.invoice.invoice_status === 4 || data.invoice.invoice_status === 5) && (
                    <li>
                      <div
                        onClick={openPaymentHistory}
                        className="px-4 py-2 text-gray-600 cursor-pointer hover:bg-gray-100"
                      >
                        Historique de paiement
                      </div>
                    </li>
                  )}

                  {/* Option Supprimer */}
                  <li>
                    <div
                      onClick={openDeleteModal}
                      className="px-4 py-2 text-red-600 cursor-pointer hover:bg-gray-100"
                    >
                      Supprimer
                    </div>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>

        {/* Créer une autre facture */}
        <div
          onClick={() => {
            data.invoice.idTypeFacture !== 2
              ? navigate("/cfp/facture/nouveau-facture")
              : navigate("/new-proforma");
          }}
          className="px-4 py-2 text-white transition bg-gray-600 border border-gray-400 rounded-full cursor-pointer hover:bg-gray-700"
        >
          Créer une autre facture
        </div>
      </div>

      {/* Modal de Paiement */}
      {showPaymentModal && paymentData && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <PaiementModal
              invoice={data.invoice}
              data={paymentData}
              closeModal={closePaymentModal}
              setIsPaid={handlePaymentSuccess}
            />
          </div>
        </>
      )}

      {/* Historique des Paiements */}
      <AnimatePresence>
        {showPaymentHistory && (
          <PaymentHistoryDrawer
            invoice={data.invoice}
            onClose={() => setShowPaymentHistory(false)}
            setData={() => { }}
            index={0}
          />
        )}
      </AnimatePresence>

      {/* Modal de Confirmation de Suppression */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="w-full max-w-md bg-white shadow-lg rounded-xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-semibold">Confirmation de suppression</h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4">
                  <p className="text-gray-700">
                    Êtes-vous sûr de vouloir supprimer la facture <strong>{data.invoice.invoice_number}</strong> ?
                    Cette action est irréversible.
                  </p>
                </div>

                <div className="flex justify-end gap-2 p-4 border-t">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDeleteInvoice}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de Chargement */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-lg">
            <Spinner />
            <p className="text-gray-700">{message || "Traitement en cours..."}</p>
          </div>
        </div>
      )}
    </div>
  );
}