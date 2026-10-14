import { useEffect, useState } from "react";
import { ArrowLeft, FileDown } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../../config/axios";
import { IMAGE_URL } from "../../../config/env";
import { Spinner } from "../../../components/ui/spinner";
import { useAuth } from "../../../contexts/AuthContext";
import { downloadEtpInvoicePdf } from "../../../services/etp-invoice";

dayjs.locale("fr");

const formatDate = (date) =>
  date && dayjs(date).isValid() ? dayjs(date).format("D MMMM YYYY") : "—";
const formatAmount = (value) =>
  (Number(value) || 0).toLocaleString("fr-FR");

const firstDefined = (...values) =>
  values.find((value) => value !== null && value !== undefined && value !== "");

export function DetailFactureEtp() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { currencyUnit, symbol } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchInvoice = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`/etp/factures/${invoiceId}`);
        const payload = response.data?.data ?? response.data;
        if (!payload?.invoice) {
          throw new Error("Les détails de cette facture sont indisponibles.");
        }
        if (!cancelled) setData(payload);
      } catch (fetchError) {
        console.error("Erreur lors du chargement de la facture ETP :", fetchError);
        if (!cancelled) {
          setError(
            fetchError.response?.data?.message ||
              fetchError.message ||
              "Impossible de charger cette facture."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchInvoice();
    return () => {
      cancelled = true;
    };
  }, [invoiceId]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadEtpInvoicePdf(invoiceId);
    } catch (exportError) {
      console.error("Erreur lors de l'export PDF de la facture ETP :", exportError);
      toast.error(
        exportError.response?.data?.message ||
          "Impossible d'exporter la facture en PDF."
      );
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <button
          type="button"
          onClick={() => navigate("/etp/facture")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux factures
        </button>
        <p className="p-3 text-sm text-red-700 bg-red-50 rounded" role="alert">
          Erreur : {error}
        </p>
      </div>
    );
  }

  const invoice = data.invoice;
  const details = [
    ...(Array.isArray(data.invoiceDetails) ? data.invoiceDetails : []),
    ...(Array.isArray(data.invoiceDetailsOther) ? data.invoiceDetailsOther : []),
  ];
  const currency = symbol || currencyUnit || "Ar";
  const total = Number(invoice.invoice_total_amount) || 0;
  const subtotal = firstDefined(invoice.invoice_sub_total, total);
  const reduction = Number(invoice.invoice_reduction) || 0;
  const tax = Number(invoice.invoice_tva) || 0;
  const issuerAddress = [
    invoice.customer_addr_lot,
    invoice.customer_addr_quartier,
    invoice.customer_addr_code_postal,
  ]
    .filter(Boolean)
    .join(" ");
  const customer = data.entreprise ?? data.customer ?? {};
  const customerName = firstDefined(
    customer.etp_name,
    customer.name,
    invoice.etp_name,
    invoice.customer_name,
    "Entreprise"
  );
  const customerAddress = [
    customer.etp_addr_lot,
    customer.etp_addr_quartier,
    customer.etp_addr_code_postal,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col w-full gap-3 px-4 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/etp/facture")}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition bg-gray-500 rounded-md hover:bg-purple-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <h1 className="text-xl font-semibold text-gray-700 uppercase">
            {invoice.typeFacture || "Facture"} #{invoice.invoice_number}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 transition border border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-60"
        >
          <FileDown className="w-4 h-4" />
          {exporting ? "Export en cours..." : "Exporter en PDF"}
        </button>
      </div>

      <div className="flex flex-col w-full gap-6 py-8 bg-white border-t border-gray-100 rounded-sm">
        <div className="flex flex-wrap items-start justify-between gap-6 px-4 lg:px-8">
          <div className="w-full lg:w-1/3">
            {invoice.logo && (
              <img
                src={`${IMAGE_URL}/img/entreprises/${invoice.logo}`}
                alt={`Logo ${invoice.name || "du centre de formation"}`}
                className="h-[88px] max-w-full rounded-md object-contain"
              />
            )}
          </div>
          <div className="flex flex-col w-full gap-2 text-right lg:w-1/2">
            <h2 className="text-3xl font-medium text-gray-700">
              {invoice.typeFacture || "Facture"}
            </h2>
            <h3 className="text-lg font-semibold text-gray-700">
              {invoice.name || "Centre de formation"}
            </h3>
            <p className="text-gray-600">{issuerAddress || "Adresse non renseignée"}</p>
            <p className="text-gray-500">
              {invoice.nif ? `NIF : ${invoice.nif}` : ""}
              {invoice.stat ? `  ·  STAT : ${invoice.stat}` : ""}
            </p>
          </div>
        </div>

        <hr className="border" />

        <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-3 lg:px-8">
          <div className="flex flex-col gap-1 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 uppercase">
              {customerName}
            </h3>
            <p className="text-gray-700">{customerAddress || "Adresse non renseignée"}</p>
            <p className="text-gray-700">
              {customer.etp_nif ? `NIF : ${customer.etp_nif}` : ""}
              {customer.etp_stat ? `  ·  STAT : ${customer.etp_stat}` : ""}
            </p>
            {invoice.contact_name && (
              <p className="text-gray-700">
                Contact : {invoice.contact_name}
                {invoice.contact_mail ? ` · ${invoice.contact_mail}` : ""}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <InvoiceInfo label="Numéro de facture" value={invoice.invoice_number} />
            {invoice.invoice_bc && (
              <InvoiceInfo label="Numéro B.C" value={invoice.invoice_bc} />
            )}
            <InvoiceInfo label="Date de facture" value={formatDate(invoice.invoice_date)} />
            <InvoiceInfo
              label={invoice.idTypeFacture === 2 ? "Valable jusqu'au" : "Date de paiement"}
              value={formatDate(invoice.invoice_date_pm)}
            />
            <div className="flex justify-between gap-2 p-2 font-semibold text-gray-700 bg-gray-100 rounded-sm">
              <span>Montant dû</span>
              <span>{currency} {formatAmount(total)}</span>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#CE9D13]">
                <th className="px-4 py-2 text-left text-white lg:px-8">Services</th>
                <th className="px-4 py-2 text-left text-white lg:px-8">Description</th>
                <th className="px-4 py-2 text-center text-white">Quantité</th>
                <th className="px-4 py-2 text-center text-white">Unité</th>
                <th className="px-4 py-2 text-right text-white">Prix unitaire</th>
                <th className="px-4 py-2 text-right text-white">Montant</th>
              </tr>
            </thead>
            <tbody>
              {details.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    Aucun détail de facture disponible.
                  </td>
                </tr>
              ) : (
                details.map((detail, index) => (
                  <tr key={detail.id ?? detail.idItems ?? index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-700 lg:px-8">
                      {detail.module_name
                        ? `Projet : ${detail.module_name}`
                        : detail.item_service ?? detail.Frais ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700 lg:px-8">
                      {detail.item_description ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {detail.item_qty ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {detail.unit_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {currency} {formatAmount(detail.item_unit_price)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {currency} {formatAmount(detail.item_total_price)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 px-4 lg:px-8">
          <InvoiceInfo label="Sous-total" value={`${currency} ${formatAmount(subtotal)}`} />
          <InvoiceInfo label="Réduction" value={`${currency} ${formatAmount(reduction)}`} />
          <InvoiceInfo label="TVA" value={`${currency} ${formatAmount(tax)}`} />
          <hr className="my-2 border" />
          <InvoiceInfo
            label="Total"
            value={`${currency} ${formatAmount(total)}`}
            strong
          />
        </div>

        {invoice.invoice_letter && (
          <p className="px-4 text-gray-700 lg:px-8">
            Arrêtée la présente facture à la somme de{" "}
            <span className="font-semibold uppercase">{invoice.invoice_letter}</span>{" "}
            {currency}
          </p>
        )}

        {invoice.pm_type_name && (
          <div className="px-4 lg:px-8">
            <h3 className="font-bold text-gray-700">Notes / Termes</h3>
            <p className="text-gray-700">Paiement par {invoice.pm_type_name}</p>
            {invoice.invoice_condition && (
              <p className="mt-1 text-gray-700">
                Condition de paiement : {invoice.invoice_condition}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InvoiceInfo({ label, value, strong = false }) {
  return (
    <div className="flex justify-between gap-3">
      <span className={strong ? "font-bold text-gray-800" : "text-gray-600"}>
        {label} :
      </span>
      <span className={strong ? "font-semibold text-gray-800" : "text-gray-700"}>
        {value || "—"}
      </span>
    </div>
  );
}
