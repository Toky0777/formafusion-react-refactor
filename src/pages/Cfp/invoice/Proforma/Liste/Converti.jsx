import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { FiMoreVertical } from "react-icons/fi";
import NewDropdownItem from "../../../../../components/Dropdown/new-dropdown-item";
import { EntreprisePopoverCell } from "../../liste-facture";
import axios from "../../../../../config/axios";
import { Thead } from "../../../../../components/table/header-invoice";
import {
  getStatusColor,
  VoirProforma,
} from "../../../../../services/service-action";
import { useNavigate } from "react-router-dom";

dayjs.locale("fr");

export function Converti({ data, setReload }) {
  const setting = JSON.parse(sessionStorage.getItem("setting"));
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});
  const navigate = useNavigate();
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

  const handleCancelInvoice = async (idInvoice) => {
    try {
      const response = await axios.post(
        `/cfp/factures/${idInvoice}/cancel`,
        {}
      );
      if (response.data.message === "OK") setReload((u) => u + 1);
    } catch (error) {
      console.error("Erreur lors de l’annulation :", error);
    }
  };
  return (
    <div className="flex flex-col" id="subContentInvoice">
      <table id="invoiceTable" className="w-full border-collapse">
        <Thead />
        <tbody>
          {data.invoicesConvertis.length === 0 ? (
            <tr>
              <td colSpan="9" className="p-4 text-center text-gray-500">
                Vous n'avez pas de facture pour l'instant
              </td>
            </tr>
          ) : (
            data.invoicesConvertis.map((invoice, index) => {
              const isOpen = openMenuId === invoice.idInvoice;

              const total = Number(invoice.invoice_total_amount) || 0;
              const paid =
                invoice.payments?.reduce((acc, p) => acc + p.amount, 0) || 0;
              const remaining = total - paid;

              return (
                <tr
                  key={invoice.idInvoice}
                  className="border-b border-gray-100 hover:bg-gray-50 duration-150"
                >
                  {/* Index */}
                  <td className="p-2 text-base text-gray-500">{index + 1}</td>

                  {/* Statut */}
                  <td className="p-2 text-base text-gray-500">
                    <span
                      className="px-3 py-1 text-sm text-white rounded-md"
                      style={{
                        backgroundColor:
                          getStatusColor(invoice.invoice_status) || "#999",
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
                    {setting?.currency_unit} {total.toLocaleString("fr-FR")}
                  </td>

                  {/* Montant restant */}
                  <td
                    id={`remainingAmount_${invoice.idInvoice}`}
                    className="text-right text-gray-500"
                  >
                    {`${setting?.currency_unit} ${remaining.toLocaleString(
                      "fr-FR"
                    )}`}
                  </td>

                  {/* Actions */}
                  <td className="p-2 text-base text-gray-500 text-right relative">
                    <div
                      className="inline-flex items-center gap-2"
                      ref={(el) => (menuRefs.current[invoice.idInvoice] = el)}
                    >
                      {/* Bouton Voir */}
                      <button
                        onClick={() =>
                          VoirProforma(invoice.idInvoice, navigate)
                        }
                        className="text-base text-gray-600 px-3 py-1 bg-gray-100 hover:bg-gray-200 border rounded transition duration-200"
                      >
                        Voir
                      </button>

                      {/* Bouton pour ouvrir menu */}
                      <button
                        onClick={() =>
                          setOpenMenuId(isOpen ? null : invoice.idInvoice)
                        }
                        className="p-2 bg-gray-100 hover:bg-gray-200 border rounded"
                      >
                        <FiMoreVertical className="text-gray-600" />
                      </button>

                      {/* Dropdown menu */}
                      {isOpen && (
                        <ul className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                          <NewDropdownItem
                            type="lien"
                            titre="Exporter en PDF"
                            idInvoice={invoice.idInvoice}
                          />
                          <li>
                            <button
                              type="button"
                              onClick={() =>
                                handleCancelInvoice(invoice.idInvoice)
                              }
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
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
