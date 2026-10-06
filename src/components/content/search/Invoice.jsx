import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/fr";
import { Spinner } from "../../ui/spinner";
import { Pagination } from "../../../pages/Cfp/invoice/Pagination";
import { EntreprisePopoverCell } from "../../../pages/Cfp/invoice/liste-facture";
import { getStatusColor } from "../../../services/service-action";
import { InvoiceActions } from "./InvoiceActions";
import { toast } from "react-toastify";
import { searchService } from "../../../services/searchService";
import { PaymentHistoryDrawer } from "./PaymentHistoryDrawer";

dayjs.locale("fr");
dayjs.extend(localizedFormat);

export function Invoice({ searchQuery }) {
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [drawerInvoice, setDrawerInvoice] = useState(null);
  const [drawerIndex, setDrawerIndex] = useState(null);

  const setting = {
    country_name: "Madagascar",
    currency_unit: "Ariary",
  };

  const fetchInvoices = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const res = await searchService.getInvoice(searchQuery, page);
        const { data, current_page, last_page, total } =
          res.data?.invoices ?? {};

        if (!data) {
          setInvoices([]);
          return;
        }

        const formatted = data.map((invoice) => {
          const totalAmount = Number(invoice.invoice_total_amount) || 0;
          const paid = Array.isArray(invoice.payments)
            ? invoice.payments.reduce(
                (acc, p) => acc + (Number(p.amount) || 0),
                0
              )
            : 0;
          return { ...invoice, remaining: totalAmount - paid };
        });

        setInvoices(formatted);
        setPagination({ current_page, last_page, total });
      } catch (err) {
        console.error(err);
        setError(err);
        toast.error("Erreur lors du chargement des factures");
      } finally {
        setLoading(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    fetchInvoices(1);
  }, [fetchInvoices]);

  const handlePageChange = (newPage) => fetchInvoices(newPage);
  const openPaymentDrawer = (invoice, index) => {
    setDrawerInvoice(invoice);
    setDrawerIndex(index);
  };
  const closePaymentDrawer = () => {
    setDrawerInvoice(null);
    setDrawerIndex(null);
  };

  if (loading) return <Spinner />;
  if (error)
    return <p className="text-center text-red-600">Erreur de chargement</p>;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600">
              <th className="p-2 text-left font-semibold">#</th>
              <th className="p-2 text-left font-semibold">Statut</th>
              <th className="p-2 text-left font-semibold">Échue</th>
              <th className="p-2 text-left font-semibold">Date d'échéance</th>
              <th className="p-2 text-left font-semibold">Date facture</th>
              <th className="p-2 text-left font-semibold">N° Facture</th>
              <th className="p-2 text-left font-semibold">Entreprise</th>
              <th className="p-2 text-right font-semibold">Montant dû</th>
              <th className="p-2 text-right font-semibold">Restant dû</th>
              <th className="p-2 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="p-4 text-center italic text-gray-500"
                >
                  Vous n'avez pas de facture pour l'instant
                </td>
              </tr>
            ) : (
              invoices.map((invoice, index) => (
                <tr
                  key={invoice.idInvoice ?? index}
                  className="border-b hover:bg-gray-50 transition"
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
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
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
                  <td className="p-2 text-center">{invoice.invoice_number}</td>
                  <td className="p-2">
                    <EntreprisePopoverCell invoice={invoice} />
                  </td>
                  <td className="p-2 text-right">
                    {Number(invoice.invoice_total_amount).toLocaleString(
                      "fr-FR"
                    )}{" "}
                    {setting.currency_unit}
                  </td>
                  <td className="p-2 text-right">
                    {Number(invoice.remaining).toLocaleString("fr-FR")}{" "}
                    {setting.currency_unit}
                  </td>
                  <td className="p-2 text-right">
                    <InvoiceActions
                      invoice={invoice}
                      invoices={invoices}
                      setInvoices={setInvoices}
                      index={index}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {pagination.last_page > 1 && (
          <Pagination
            onPageChange={handlePageChange}
            lastPage={pagination.last_page}
            currentPage={pagination.current_page}
            totalItems={pagination.total}
          />
        )}
      </div>

      {drawerInvoice && drawerIndex !== null && (
        <PaymentHistoryDrawer
          invoice={drawerInvoice}
          onClose={closePaymentDrawer}
          setData={setInvoices}
          index={drawerIndex}
        />
      )}
    </div>
  );
}
