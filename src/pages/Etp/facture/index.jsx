import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/fr";
import axios from "../../../config/axios";
import { Spinner } from "../../../components/ui/spinner";
import { Pagination } from "../../Cfp/invoice/Pagination";
import { getStatusColor } from "../../../services/service-action";
import { useAuth } from "../../../contexts/AuthContext";
import {
  CalendarDays,
  CircleDollarSign,
  Eye,
  FileDown,
  Funnel,
  ReceiptText,
  RotateCw,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { downloadEtpInvoicePdf } from "../../../services/etp-invoice";

dayjs.extend(localizedFormat);
dayjs.locale("fr");

const formatDate = (date) =>
  date && dayjs(date).isValid() ? dayjs(date).format("D MMMM YYYY") : "—";

const EMPTY_FILTERS = {
  invoice_status: "",
  idTypeFacture: "",
  invoice_number: "",
  invoice_date_debut: "",
  invoice_date_fin: "",
};

export function ListeFactureEtp() {
  const { currencyUnit, symbol } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ statuses: [], types: [] });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("/etp/factures", {
        params: {
          page,
          perPage,
          ...Object.fromEntries(
            Object.entries(appliedFilters).filter(([, value]) => value !== "")
          ),
        },
      });
      const payload =
        response.data?.invoices ?? response.data?.factures ?? response.data;
      const rows = Array.isArray(payload) ? payload : payload?.data;

      if (!Array.isArray(rows)) {
        throw new Error("Le format de la réponse des factures est invalide.");
      }

      setInvoices(rows);
      setFilterOptions({
        statuses: response.data?.filter_options?.statuses ?? [],
        types: response.data?.filter_options?.types ?? [],
      });
      setPagination({
        current_page: Number(payload.current_page) || page,
        last_page: Number(payload.last_page) || 1,
        total: Number(payload.total) || rows.length,
      });
    } catch (fetchError) {
      console.error("Erreur lors du chargement des factures ETP :", fetchError);
      setError(
        fetchError.response?.data?.message ||
        fetchError.message ||
        "Impossible de charger les factures."
      );
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, page, perPage]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const applyFilters = (event) => {
    event.preventDefault();
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  const resetFilters = () => {
    setFilters({ ...EMPTY_FILTERS });
    setPage(1);
    setAppliedFilters({ ...EMPTY_FILTERS });
  };
  const activeFiltersCount = Object.values(appliedFilters).filter(Boolean).length;

  return (
    <div className="min-h-full rounded-2xl bg-slate-50/70 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
        <header className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:px-7 md:py-6">
          <div className="flex items-start gap-4">
            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700 sm:flex">
              <ReceiptText className="h-7 w-7" />
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
                Espace entreprise
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Mes factures
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Consultez vos factures, leurs échéances et les montants restants.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-start rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 md:self-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-violet-700 shadow-sm">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Factures trouvées</p>
              <p className="text-lg font-bold leading-tight text-slate-900">
                {pagination.total.toLocaleString("fr-FR")}
              </p>
            </div>
          </div>
        </header>

        <form
          onSubmit={applyFilters}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-violet-700" />
              <h2 className="text-sm font-semibold text-slate-900">
                Filtrer les factures
              </h2>
              {activeFiltersCount > 0 && (
                <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
                  {activeFiltersCount} actif{activeFiltersCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Affinez les résultats selon vos critères
            </p>
          </div>
          <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-slate-600">
            Statut
            <select
              value={filters.invoice_status}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  invoice_status: event.target.value,
                }))
              }
              className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            >
              <option value="">Tous les statuts</option>
              {filterOptions.statuses.map((status) => (
                <option
                  key={status.idInvoiceStatus}
                  value={status.idInvoiceStatus}
                >
                  {status.invoice_status_name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-slate-600">
            Type de facture
            <select
              value={filters.idTypeFacture}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  idTypeFacture: event.target.value,
                }))
              }
              className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            >
              <option value="">Tous les types</option>
              {filterOptions.types.map((type) => (
                <option key={type.idTypeFacture} value={type.idTypeFacture}>
                  {type.typeFacture}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-slate-600 sm:col-span-2 xl:col-span-1">
            Numéro de facture
            <input
              type="search"
              maxLength={255}
              value={filters.invoice_number}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  invoice_number: event.target.value,
                }))
              }
              placeholder="Rechercher un numéro"
              className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-slate-600">
            Échéance à partir du
            <input
              type="date"
              value={filters.invoice_date_debut}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  invoice_date_debut: event.target.value,
                }))
              }
              className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-slate-600">
            Échéance jusqu’au
            <input
              type="date"
              min={filters.invoice_date_debut || undefined}
              value={filters.invoice_date_fin}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  invoice_date_fin: event.target.value,
                }))
              }
              className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </label>

          <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-slate-600">
            Lignes par page
            <select
              value={perPage}
              onChange={(event) => {
                setPerPage(Number(event.target.value));
                setPage(1);
              }}
              className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              {[10, 25, 50, 100].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </label>

          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-500">
            {activeFiltersCount > 0
              ? `${activeFiltersCount} filtre${activeFiltersCount > 1 ? "s" : ""} appliqué${activeFiltersCount > 1 ? "s" : ""}`
              : "Aucun filtre appliqué"}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <RotateCw className="h-4 w-4" />
              Réinitialiser
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-violet-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800 focus:outline-none focus:ring-4 focus:ring-violet-200"
            >
              <Funnel className="h-4 w-4" />
              Appliquer les filtres
            </button>
          </div>
          </div>
        </form>

        {error && (
          <p className="p-3 text-sm text-red-700 rounded bg-red-50" role="alert">
            Erreur : {error}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center p-8">
            <Spinner />
          </div>
        ) : !error ? (
          <>
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 md:px-6">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Historique des factures
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {pagination.total.toLocaleString("fr-FR")} résultat
                    {pagination.total === 1 ? "" : "s"}
                    {activeFiltersCount > 0 ? " · filtres appliqués" : ""}
                  </p>
                </div>
                {pagination.last_page > 1 && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Page {pagination.current_page} sur {pagination.last_page}
                  </span>
                )}
              </div>
              <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Statut</th>
                    <th className="px-4 py-3 text-left">Échéance</th>
                    <th className="px-4 py-3 text-left">Date facture</th>
                    <th className="px-4 py-3 text-left">N° Facture</th>
                    <th className="px-4 py-3 text-left">Centre de formation</th>
                    <th className="px-4 py-3 text-right">Montant dû</th>
                    <th className="px-4 py-3 text-right">Restant dû</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-16 text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <ReceiptText className="h-6 w-6" />
                          </span>
                          <span className="font-semibold text-slate-800">
                            Aucune facture à afficher
                          </span>
                          <span className="mt-1 text-sm text-slate-500">
                            {activeFiltersCount > 0
                              ? "Aucun résultat. Modifiez vos critères ou réinitialisez les filtres."
                              : "Vos factures apparaîtront ici dès qu’elles seront disponibles."}
                          </span>
                          {activeFiltersCount > 0 && (
                            <button
                              type="button"
                              onClick={resetFilters}
                              className="mt-4 text-sm font-semibold text-violet-700 hover:text-violet-900"
                            >
                              Réinitialiser les filtres
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    invoices.map((invoice, index) => {
                      const total = Number(invoice.invoice_total_amount) || 0;
                      const paid = Array.isArray(invoice.payments)
                        ? invoice.payments.reduce(
                          (sum, payment) => sum + (Number(payment.amount) || 0),
                          0
                        )
                        : 0;
                      const remaining =
                        invoice.remaining != null
                          ? Number(invoice.remaining)
                          : total - paid;
                      const statusId =
                        invoice.status?.idInvoiceStatus ?? invoice.invoice_status;
                      const overdue =
                        invoice.invoice_date_pm &&
                        dayjs(invoice.invoice_date_pm).isBefore(dayjs(), "day") &&
                        ![1, 4, 9].includes(Number(statusId));

                      return (
                        <tr
                          key={invoice.idInvoice ?? `${invoice.invoice_number}-${index}`}
                          className="border-b border-slate-100 transition-colors last:border-0 hover:bg-violet-50/30"
                        >
                          <td className="px-4 py-4 text-xs font-medium text-slate-400">
                            {(pagination.current_page - 1) * perPage + index + 1}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow-sm"
                              style={{ backgroundColor: getStatusColor(statusId) }}
                            >
                              {invoice.status?.invoice_status_name ??
                                invoice.invoice_status_name ??
                                "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {overdue ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                En retard
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">À jour</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 whitespace-nowrap text-slate-600">
                              <CalendarDays className="h-4 w-4 text-slate-400" />
                              {formatDate(invoice.invoice_date_pm)}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {formatDate(invoice.invoice_date)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-slate-800">
                              {invoice.invoice_number ?? "—"}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-400">
                              {invoice.typeFacture?.typeFacture ??
                                (Number(invoice.idTypeFacture) === 3
                                  ? "Acompte"
                                  : Number(invoice.idTypeFacture) === 4
                                    ? "Solde"
                                    : "Facture")}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">
                                {(invoice.customer?.customerName ?? "C")
                                  .trim()
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                              <span className="max-w-[220px] truncate font-medium text-slate-700">
                                {invoice.customer?.customerName ?? "—"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="font-semibold tabular-nums text-slate-800">
                              {total.toLocaleString("fr-FR")}
                            </span>
                            <span className="ml-1 text-xs text-slate-400">
                              {symbol || currencyUnit || "Ar"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="font-semibold tabular-nums text-slate-800">
                              {Math.max(remaining, 0).toLocaleString("fr-FR")}
                            </span>
                            <span className="ml-1 text-xs text-slate-400">
                              {symbol || currencyUnit || "Ar"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/etp/facture/details/${invoice.idInvoice}`
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-violet-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
                                aria-label={`Voir la facture ${invoice.invoice_number ?? ""}`}
                              >
                                <Eye className="w-4 h-4" />
                                Voir
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await downloadEtpInvoicePdf(invoice.idInvoice);
                                  } catch (downloadError) {
                                    console.error(
                                      "Erreur lors de l'export PDF de la facture ETP :",
                                      downloadError
                                    );
                                    toast.error(
                                      downloadError.response?.data?.message ||
                                      "Impossible d'exporter la facture en PDF."
                                    );
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                                aria-label={`Exporter la facture ${invoice.invoice_number ?? ""} en PDF`}
                              >
                                <FileDown className="w-4 h-4" />
                                PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            </section>
            {pagination.last_page > 1 && (
              <Pagination
                currentPage={pagination.current_page}
                lastPage={pagination.last_page}
                totalItems={pagination.total}
                onPageChange={setPage}
              />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
