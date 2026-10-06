import { useRef, useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PaiementModal } from "../../Modals/paiment-modal";
import {
  handleApprouve,
  handleCancel,
  handleSendEmail,
} from "../../../services/service-action";
import { ExportPdf } from "../../../services/export-pdf";
import LoadingModal from "../../Modals/loading-modal";
import { PaymentHistoryDrawer } from "./PaymentHistoryDrawer";
import axios from "../../../config/axios";

const DropdownButton = ({ onClick, children, danger = false }) => (
  <button
    onClick={onClick}
    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
      danger ? "text-red-600" : "text-gray-800"
    }`}
  >
    {children}
  </button>
);

export const InvoiceActions = ({ invoice, setInvoices, index, setIsPaid }) => {
  const [open, setOpen] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!showPaymentModal) return;

      try {
        const [pmTypesRes, baAccountsRes] = await Promise.all([
          axios.get("/cfp/factures_acounts/getTypePaiements"),
          axios.get("/cfp/factures_acounts/getBankAcounts"),
        ]);

        setPaymentData({
          pm_types: pmTypesRes.data || [],
          ba_accounts: baAccountsRes.data || [],
        });
      } catch (error) {
        console.error("Erreur chargement paiements :", error);
        setPaymentData({ pm_types: [], ba_accounts: [] });
      }
    };

    fetchPaymentData();
  }, [showPaymentModal]);

  const closeMenu = () => setOpen(false);

  return (
    <td className="relative p-2 text-right" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded hover:bg-gray-200 transition"
      >
        <FiMoreVertical className="text-gray-600" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-20">
          {invoice.invoice_status === 2 && (
            <DropdownButton
              onClick={() => {
                handleSendEmail(
                  invoice.idInvoice,
                  setInvoices,
                  index,
                  setLoading,
                  setMessage
                );
                closeMenu();
              }}
            >
              Envoyer Email
            </DropdownButton>
          )}

          {invoice.invoice_status === 1 && (
            <>
              <DropdownButton
                onClick={() => {
                  handleApprouve(
                    invoice.idInvoice,
                    setInvoices,
                    index,
                    setLoading,
                    setMessage
                  );
                  closeMenu();
                }}
              >
                Approuver
              </DropdownButton>

              <DropdownButton
                onClick={() => {
                  navigate(`/cfp/facture/modifie-facture/${invoice.idInvoice}`);
                  closeMenu();
                }}
              >
                Modifier
              </DropdownButton>

              <DropdownButton
                danger
                onClick={() => {
                  handleCancel(invoice.idInvoice, setInvoices, index);
                  closeMenu();
                }}
              >
                Annuler
              </DropdownButton>
            </>
          )}

          {(invoice.invoice_status === 3 || invoice.invoice_status === 5) && (
            <DropdownButton
              onClick={() => {
                setShowPaymentModal(true);
                closeMenu();
              }}
            >
              Paiement
            </DropdownButton>
          )}

          {(invoice.invoice_status === 4 || invoice.invoice_status === 5) && (
            <DropdownButton
              onClick={() => {
                setShowPayments(true);
                closeMenu();
              }}
            >
              Historique paiements
            </DropdownButton>
          )}

          <DropdownButton
            onClick={() => {
              navigate(`/cfp/facture/details/${invoice.idInvoice}`);
              closeMenu();
            }}
          >
            Voir détails
          </DropdownButton>

          <DropdownButton
            onClick={() => {
              ExportPdf(invoice.idInvoice);
              closeMenu();
            }}
          >
            Export PDF
          </DropdownButton>
        </div>
      )}

      <LoadingModal visible={loading} message={message} />

      <AnimatePresence>
        {showPayments && (
          <PaymentHistoryDrawer
            invoice={invoice}
            onClose={() => setShowPayments(false)}
            setData={setInvoices}
            index={index}
          />
        )}
      </AnimatePresence>

      {showPaymentModal && paymentData && (
        <PaiementModal
          invoice={invoice}
          data={paymentData}
          setData={setInvoices}
          index={index}
          closeModal={() => setShowPaymentModal(false)}
          setIsPaid={setIsPaid}
        />
      )}
    </td>
  );
};
