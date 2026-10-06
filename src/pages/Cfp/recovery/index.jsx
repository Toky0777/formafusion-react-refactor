import React, { useEffect, useState, useCallback } from "react";
import axios from "../../../config/axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { InvoiceActions } from "../../../components/content/search/InvoiceActions";

export function Recovery() {
  const [recovery, setRecovery] = useState([]);
  const [totalDue, setTotalDue] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaid, setIsPaid] = useState(0);

  const formatNumber = (num) =>
    new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(
      num || 0
    );

  const formatDate = (date) => format(date, "dd MMMM yyyy", { locale: fr });

  const InvoicesTable = ({ invoices }) => (
    <div className="mt-2">
      <h3 className="font-semibold text-gray-700 mb-1">Factures</h3>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-1">N° facture</th>
            <th className="border px-3 py-1">Échéance</th>
            <th className="border px-3 py-1">Montant</th>
            <th className="border px-3 py-1">Payé</th>
            <th className="border px-3 py-1">Restant dû</th>
            <th className="border px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.idInvoice}>
              <td className="border px-3 py-1 text-center">
                {inv.invoice_number}
              </td>
              <td className="border px-3 py-1 text-center">
                {formatDate(new Date(inv.invoice_date_pm))}
              </td>
              <td className="border px-3 py-1 text-right">
                {formatNumber(inv.invoice_total_amount)} Ar
              </td>
              <td className="border px-3 py-1 text-right">
                {formatNumber(inv.total_paid)} Ar
              </td>
              <td className="border px-3 py-1 text-right text-red-600">
                {formatNumber(inv.remaining_amount)} Ar
              </td>
              <td className="border px-2 py-1 flex justify-center items-center">
                <InvoiceActions
                  invoice={inv}
                  invoices={invoices}
                  setData={setRecovery}
                  setIsPaid={setIsPaid}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const PurchaseOrdersTable = ({ orders }) => (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-2 text-gray-700">
        Bons de commande
      </h3>
      <table className="w-full text-xs border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">N° BC</th>
            <th className="border px-2 py-1">Échéance</th>
            <th className="border px-2 py-1">Montant</th>
            <th className="border px-2 py-1">Contact</th>
            <th className="border px-2 py-1">Détails</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.idBC} className="hover:bg-gray-50">
              <td className="border px-2 py-1 text-center">
                {order.numero_bc}
              </td>
              <td className="border px-2 py-1 text-center">
                {formatDate(order.date_paiement)}
              </td>
              <td className="border px-2 py-1 text-right">
                {formatNumber(order.montant_bc)} Ar
              </td>
              <td className="border px-2 py-1 text-center">
                {order.contact_name || "—"} <br />
                <span className="text-xs text-gray-500">
                  {order.contact_phone || ""} {order.contact_mail || ""}
                </span>
              </td>
              <td className="border px-2 py-1 text-center">
                <Link
                  to={`/cfp/bon-commande/view/${order.idBC}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const [expandedClient, setExpandedClient] = useState(null);
  const [expandedClientByDate, setExpandedClientByDate] = useState({
    id: null,
    dateKey: null,
  });
  const [clientData, setClientData] = useState({});
  const today = new Date();

  const fetchRecovery = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/recouvrement");
      setRecovery(data.due_by_customer || []);
      setTotalDue(data.total_due_by_slice || {});
    } catch (error) {
      setError("Impossible de charger les données de recouvrement.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecovery();
  }, [fetchRecovery]);

  useEffect(() => {
    if (isPaid > 0) {
      fetchRecovery();
      setExpandedClientByDate({ id: null, dateKey: null });
      setExpandedClient(null);
    }
  }, [isPaid, fetchRecovery]);

  const fetchClientData = useCallback(async (idEntreprise, dateKey = "all") => {
    setClientData((prev) => ({
      ...prev,
      [idEntreprise]: {
        ...prev[idEntreprise],
        [dateKey]: {
          loading: true,
          error: null,
          invoices: [],
          purchaseOrders: [],
        },
      },
    }));

    try {
      const query =
        dateKey === "all" ? `/${idEntreprise}` : `/${idEntreprise}/${dateKey}`;
      const [invoiceRes, poRes] = await Promise.all([
        axios.get(`/recouvrement${query}`),
        axios.get(`/purchase_order${query}`),
      ]);

      setClientData((prev) => ({
        ...prev,
        [idEntreprise]: {
          ...prev[idEntreprise],
          [dateKey]: {
            loading: false,
            error: null,
            invoices: invoiceRes.data.invoices || [],
            purchaseOrders: poRes.data.purchase_orders || [],
          },
        },
      }));
    } catch {
      setClientData((prev) => ({
        ...prev,
        [idEntreprise]: {
          ...prev[idEntreprise],
          [dateKey]: {
            loading: false,
            error: "Erreur de chargement.",
            invoices: [],
            purchaseOrders: [],
          },
        },
      }));
    }
  }, []);

  const toggleClient = (idEntreprise) => {
    if (expandedClient === idEntreprise) {
      setExpandedClient(null);
    } else {
      setExpandedClient(idEntreprise);
      setExpandedClientByDate({ id: null, dateKey: null });
      fetchClientData(idEntreprise, "all");
    }
  };

  const toggleClientByDate = (idEntreprise, dateKey) => {
    if (
      expandedClientByDate.id === idEntreprise &&
      expandedClientByDate.dateKey === dateKey
    ) {
      setExpandedClientByDate({ id: null, dateKey: null });
    } else {
      setExpandedClient(null);
      setExpandedClientByDate({ id: idEntreprise, dateKey });
      fetchClientData(idEntreprise, dateKey);
    }
  };

  const getFullDateByKey = (dateKey) => {
    if (dateKey == "due_before_60") {
      return formatDate(new Date(today.getTime() - 61 * 86400000));
    }
    if (dateKey == "due_minus60_30") {
      return getDateRange(today, -60, -31);
    }
    if (dateKey == "due_minus30_15") {
      return getDateRange(today, -30, -16);
    }
    if (dateKey == "due_minus15_0") {
      return getDateRange(today, -15, -1);
    }
    if (dateKey == "due_0_15") {
      return getDateRange(today, 1, 15);
    }
    if (dateKey == "due_16_30") {
      return getDateRange(today, 16, 30);
    }
    if (dateKey == "due_31_60") {
      return getDateRange(today, 31, 60);
    }
    if (dateKey == "due_after_60") {
      return formatDate(new Date(today.getTime() + 61 * 86400000));
    }
  };

  const renderClientDetails = (idEntreprise, dateKey = "all") => {
    const client = clientData[idEntreprise]?.[dateKey];
    if (!client) return null;
    if (client.loading)
      return <div className="text-center text-gray-500">Chargement...</div>;
    if (client.error)
      return <div className="text-center text-red-500">{client.error}</div>;

    const { invoices, purchaseOrders } = client;
    if (!invoices.length && !purchaseOrders.length)
      return (
        <div className="text-center text-gray-400 italic">
          Aucune donnée trouvée.
        </div>
      );

    return (
      <div>
        {dateKey !== "all" && (
          <div className="mb-2 text-sm text-blue-600 font-medium">
            📆 Période : {getFullDateByKey(dateKey)}
          </div>
        )}
        {invoices.length > 0 && <InvoicesTable invoices={invoices} />}
        {purchaseOrders.length > 0 && (
          <PurchaseOrdersTable orders={purchaseOrders} />
        )}
      </div>
    );
  };

  const getDateRange = (today, startOffset, endOffset) => {
    const start = new Date(today);
    const end = new Date(today);
    start.setDate(today.getDate() + startOffset);
    end.setDate(today.getDate() + endOffset);
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const echusAvantRanges = [
    {
      key: "due_before_60",
      label: "< 60j",
      color: "bg-red-400/50",
      date: `Avant ${formatDate(new Date(today.getTime() - 61 * 86400000))}`,
    },
    {
      key: "due_minus60_30",
      label: "31 - 60j",
      color: "bg-red-300/50",
      date: getDateRange(today, -60, -31),
    },
    {
      key: "due_minus30_15",
      label: "16 - 30j",
      color: "bg-red-200/50",
      date: getDateRange(today, -30, -16),
    },
    {
      key: "due_minus15_0",
      label: "0 - 15j",
      color: "bg-red-100/50",
      date: getDateRange(today, -15, -1),
    },
  ];

  const echusApresRanges = [
    {
      key: "due_0_15",
      label: "1 - 15j",
      color: "bg-green-100/50",
      date: getDateRange(today, 1, 15),
    },
    {
      key: "due_16_30",
      label: "16 - 30j",
      color: "bg-green-200/50",
      date: getDateRange(today, 16, 30),
    },
    {
      key: "due_31_60",
      label: "31 - 60j",
      color: "bg-green-300/50",
      date: getDateRange(today, 31, 60),
    },
    {
      key: "due_after_60",
      label: "> 60j",
      color: "bg-green-400/50",
      date: `Après ${formatDate(new Date(today.getTime() + 61 * 86400000))}`,
    },
  ];

  if (loading)
    return <div className="text-center py-10 text-gray-500">Chargement...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-2xl mb-6 text-gray-800 font-semibold">
          Analyse de recouvrement ({formatDate(today)})
        </h1>

        <div className="overflow-x-auto shadow rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th rowSpan="2" className="border bg-gray-100 px-4 py-3">
                  Client
                </th>
                <th
                  colSpan={echusAvantRanges.length}
                  className="border bg-red-100 px-4 py-3"
                >
                  Retard
                </th>
                <th
                  colSpan={echusApresRanges.length}
                  className="border bg-green-100 px-4 py-3"
                >
                  Après échéance
                </th>
                <th rowSpan="2" className="border bg-gray-100 px-4 py-3">
                  Total retard
                </th>
                <th rowSpan="2" className="border bg-blue-100 px-4 py-3">
                  Encours total
                </th>
              </tr>
              <tr>
                {[...echusAvantRanges, ...echusApresRanges].map((r) => (
                  <th key={r.key} className={`border ${r.color} px-4 py-2`}>
                    {r.label} <br />
                    <span className="text-xs">{r.date}</span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {recovery.map((row) => {
                const isExpandedAll = expandedClient === row.idEntreprise;
                const isExpandedByDate =
                  expandedClientByDate.id === row.idEntreprise &&
                  expandedClientByDate.dateKey !== null;

                return (
                  <React.Fragment key={row.idEntreprise}>
                    <tr
                      className={`hover:bg-gray-50 ${
                        isExpandedAll || isExpandedByDate ? "bg-gray-100" : ""
                      }`}
                    >
                      <td
                        className="border px-4 py-2 font-medium text-gray-800 cursor-pointer"
                        onClick={() => toggleClient(row.idEntreprise)}
                      >
                        {row?.entreprise_name || "—"}
                      </td>

                      {[...echusAvantRanges, ...echusApresRanges].map((r) => (
                        <td
                          key={r.key}
                          className={`border px-4 py-2 text-center ${
                            row[r.key] > 0
                              ? "hover:bg-blue-50 cursor-pointer"
                              : ""
                          }`}
                          onClick={() => {
                            if (row[r.key] > 0) {
                              toggleClientByDate(row.idEntreprise, r.key);
                            }
                          }}
                        >
                          {row[r.key] > 0
                            ? formatNumber(row[r.key]) + "Ar"
                            : ""}
                        </td>
                      ))}

                      <td className="border px-4 py-2 text-center">
                        {formatNumber(row.total_due)} Ar
                      </td>
                      <td className="border px-4 py-2 text-center font-medium">
                        {formatNumber(row.total_all)} Ar
                      </td>
                    </tr>

                    {(isExpandedAll || isExpandedByDate) && (
                      <tr>
                        <td
                          colSpan={11}
                          className="border bg-gray-50 px-6 py-3"
                        >
                          {isExpandedAll
                            ? renderClientDetails(row.idEntreprise, "all")
                            : renderClientDetails(
                                row.idEntreprise,
                                expandedClientByDate.dateKey
                              )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              <tr className="bg-gray-100 font-semibold text-gray-700">
                <td className="border px-4 py-2 text-right">TOTAL</td>
                {[...echusAvantRanges, ...echusApresRanges].map((r) => (
                  <td key={r.key} className="border px-4 py-2 text-center">
                    {formatNumber(totalDue[r.key])} Ar
                  </td>
                ))}
                <td className="border px-4 py-2 text-center">
                  {formatNumber(totalDue.total_due)} Ar
                </td>
                <td className="border px-4 py-2 text-center">
                  {formatNumber(totalDue.total_all)} Ar
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
