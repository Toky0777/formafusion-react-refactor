import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { FiMoreVertical } from "react-icons/fi";

import { Thead } from "../../../../../components/table/header-invoice";
import NewDropdownItem from "../../../../../components/Dropdown/new-dropdown-item";
import { getStatusColor } from "../../../../../services/service-action";
import { EntreprisePopoverCell } from "../../liste-facture";
import axios from "../../../../../config/axios";

dayjs.locale("fr");

export function Brouillons({ data, setReload }) {
  console.log(data);
  const setting = JSON.parse(sessionStorage.getItem("setting"));
  const [openMenuId, setOpenMenuId] = useState(null);

  // Ref pour gérer le click outside
  const menuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuId &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId].contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const handleApprouveDraft = async (idInvoice) => {
    try {
      const response = await axios.post(
        `/cfp/factures/${idInvoice}/approve`,
        {}
      );
      if (response.data.message === "OK") setReload((u) => u + 1);
    } catch (error) {
      console.error("Erreur lors de l’approbation :", error);
    }
  };

  return (
    <div className="flex flex-col" id="subContentInvoice">
      <table id="invoiceTable" className="w-full border-collapse">
        <Thead />
        <tbody>
          {data.invoicesDraft.length <= 0 ? (
            <tr>
              <td colSpan="9" className="p-4 text-center text-gray-500">
                Vous n'avez pas de facture pour l'instant
              </td>
            </tr>
          ) : (
            data.invoicesDraft.map((invoice, index) => {
              const isOpen = openMenuId === invoice.idInvoice;

              return (
                <tr
                  key={invoice.idInvoice}
                  className="duration-150 border-b border-gray-100 hover:bg-gray-50"
                >
                  {/* Index */}
                  <td className="p-2 text-base text-gray-500">{index + 1}</td>

                  {/* Statut */}
                  <td className="p-2 text-base text-gray-500">
                    <span
                      className="px-3 py-1 text-sm text-white rounded-md"
                      style={{
                        backgroundColor: getStatusColor(invoice.invoice_status),
                      }}
                    >
                      {invoice.status?.invoice_status_name || ""}
                    </span>
                  </td>

                  {/* Échue */}
                  <td className="p-2 text-base text-gray-500">
                    {new Date(invoice.invoice_date_pm) < new Date() &&
                      ![1, 4, 9].includes(invoice.invoice_status) ? (
                      <span className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded-md">
                        Echue
                      </span>
                    ) : null}
                  </td>

                  {/* Dates */}
                  <td className="p-2 text-base text-gray-500">
                    {dayjs(invoice.invoice_date_pm).format("D MMMM YYYY")}
                  </td>
                  <td className="p-2 text-base text-gray-500">
                    {dayjs(invoice.invoice_date).format("D MMMM YYYY")}
                  </td>

                  {/* Numéro facture */}
                  <td className="text-center text-gray-500">
                    {invoice.invoice_number}
                  </td>

                  {/* Entreprise */}
                  <EntreprisePopoverCell invoice={invoice} />

                  {/* Montant total */}
                  <td className="text-right text-gray-500">
                    {setting?.currency_unit}{" "}
                    {Number(invoice.invoice_total_amount).toLocaleString(
                      "fr-FR"
                    )}
                  </td>

                  {/* Montant restant */}
                  <td
                    id={`remainingAmount_${invoice.idInvoice}`}
                    className="text-right text-gray-500"
                  >
                    {(() => {
                      const total = Number(invoice.invoice_total_amount);
                      const paid =
                        invoice.payments?.reduce(
                          (acc, p) => acc + p.amount,
                          0
                        ) || 0;
                      const remaining = total - paid;

                      return `${setting?.currency_unit
                        } ${remaining.toLocaleString("fr-FR", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}`;
                    })()}
                  </td>

                  {/* Actions */}
                  <td className="relative p-2 text-base text-right text-gray-500">
                    <div
                      className="inline-flex items-center gap-2"
                      ref={(el) => (menuRefs.current[invoice.idInvoice] = el)}
                    >
                      {/* Bouton approuver/envoyé */}
                      <button
                        onClick={() => handleApprouveDraft(invoice.idInvoice)}
                        className="px-3 py-1 text-base text-gray-600 transition duration-200 bg-gray-100 border rounded hover:bg-gray-200"
                      >
                        {invoice.invoice_status === 1 ? "Approuver" : "Envoyé"}
                      </button>

                      {/* Bouton pour ouvrir menu */}
                      <button
                        onClick={() =>
                          setOpenMenuId(isOpen ? null : invoice.idInvoice)
                        }
                        className="p-2 bg-gray-100 border rounded hover:bg-gray-200"
                      >
                        <FiMoreVertical className="text-gray-600" />
                      </button>

                      {/* Dropdown menu */}
                      {isOpen && (
                        <ul className="absolute right-0 z-50 w-48 mt-2 bg-white border rounded-md shadow-lg top-full">
                          <NewDropdownItem
                            type="lien"
                            titre="Voir"
                            idInvoice={invoice.idInvoice}
                          />
                          {invoice.invoice_status === 1 && (
                            <NewDropdownItem
                              type="lien"
                              titre="Editer"
                              nature="EditerProforma"
                              idInvoice={invoice.idInvoice}
                            />
                          )}
                          <NewDropdownItem
                            type="lien"
                            titre="Exporter en PDF"
                            idInvoice={invoice.idInvoice}
                          />
                          <li>
                            <button
                              type="button"
                              onClick={() =>
                                alert(
                                  `Annuler facture ${invoice.idInvoice} (à brancher sur API)`
                                )
                              }
                              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                            >
                              Annuler
                            </button>
                          </li>
                        </ul>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
