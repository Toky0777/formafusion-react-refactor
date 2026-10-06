import { useState, useEffect, useRef, useContext } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { FiMoreVertical } from "react-icons/fi";
import { Pagination } from "../../Pagination";
import {
  getStatusColor,
  handleApprouve,
  handleCancel,
  handleSendEmail,
} from "../../../../../services/service-action";
import NewDropdownItem from "../../../../../components/Dropdown/new-dropdown-item";
import { Thead } from "../../../../../components/table/header-invoice";
import LoadingModal from "../../../../../components/loading-modal";
import { EntreprisePopoverCell } from "../../liste-facture";

import axios from "../../../../../config/axios";
import { useNavigate } from "react-router-dom";

dayjs.locale("fr");

export function TousAcompte({
  data,
  setData,
  pagination,
  setPagination,
  setReload,
}) {
  const setting = JSON.parse(sessionStorage.getItem("setting"));
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});
  const navigate = useNavigate();
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current_page: newPage }));
  };

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Vérifier si le clic est en dehors de tous les menus ouverts
      if (
        openMenuId &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId].contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleShowInvoice = async (idInvoice) => {
    navigate(`/cfp/facture/details/${idInvoice}`);
  };
  const handleChangeStatus = async (idInvoice) => {
    try {
      const res = await axios.post(`/cfp/factures/${idInvoice}/changeStatus/3`);
      // console.log(res.data);
      setReload((u) => u + 1);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col" id="subContentInvoice">
      <table id="invoiceTable" className="w-full">
        <thead>
          <tr id="" className="border-b-[1px] border-gray-100 hover:bg-gray-50 duration-150 cursor-pointer ">
            <th className="p-2 text-base font-semibold text-gray-500 ">#</th>
            <th className="p-2 text-base font-semibold text-gray-500 ">Statut</th>
            <th className="p-2 text-base font-semibold text-gray-500 ">Echue</th>
            <th className="p-2 text-base font-semibold text-gray-500 ">Date d'échéance</th>
            <th className="p-2 text-base font-semibold text-gray-500 ">Date facture</th>
            <th className="p-2 text-base font-semibold text-center text-gray-500">N° Facture</th>
            <th className="p-2 text-base font-semibold text-gray-500 ">Entreprise</th>
            <th className="p-2 text-base font-semibold text-right text-gray-500">Total</th>
            <th className="p-2 text-base font-semibold text-right text-gray-500">Montant dû</th>
            <th className="p-2 text-base font-semibold text-right text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.invoices?.length <= 0 ? (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan="9">
                Vous n'avez pas de facture pour l'instant
              </td>
            </tr>
          ) : (
            data?.invoices?.map((invoice, index) => {
              const isOpen = openMenuId === invoice.idInvoice;

              return (
                <tr
                  key={invoice.idInvoice}
                  className="duration-150 border-b border-gray-100 hover:bg-gray-50"
                >
                  {/* Index */}
                  <td className="p-2 text-base text-gray-500">
                    {index + 1 + (pagination.current_page - 1) * 10}
                  </td>

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
                    {setting?.currency_unit}{" "}
                    {invoice.payments?.reduce((acc, p) => acc + p.amount, 0) ===
                      0
                      ? Number(invoice.invoice_total_amount).toLocaleString(
                        "fr-FR"
                      )
                      : Number(
                        invoice.invoice_total_amount -
                        invoice.payments.reduce(
                          (acc, p) => acc + p.amount,
                          0
                        )
                      ).toLocaleString("fr-FR")}
                  </td>

                  {/* Actions */}
                  <td className="relative p-2 text-base text-right text-gray-500">
                    <div className="inline-flex items-center gap-2">
                      {/* Boutons Approuver / Envoyer */}
                      {invoice.invoice_status === 1 ? (
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
                            className="px-3 py-1 text-base text-gray-600 transition bg-gray-100 border rounded hover:bg-gray-200"
                          >
                            Approuver
                          </button>
                          <LoadingModal
                            visible={loading}
                            message="Approbation en cours ..."
                          />
                        </>
                      ) : invoice.invoice_status === 2 ? (
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
                            className="px-3 py-1 text-base text-gray-600 transition bg-gray-100 border rounded hover:bg-gray-200"
                          >
                            Envoyer
                          </button>
                          <LoadingModal
                            visible={loading}
                            message="Envoi email en cours ..."
                          />
                        </>
                      ) : invoice.invoice_status === 7 ||
                        invoice.invoice_status === 9 ? (
                        <>
                          <button
                            onClick={() => handleChangeStatus(invoice.idInvoice)}
                            className="px-3 py-1 text-base text-gray-600 transition bg-gray-100 border rounded hover:bg-gray-200"
                          >
                            Annuler
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleShowInvoice(invoice.idInvoice)}
                            className="px-3 py-1 text-base text-gray-600 transition bg-gray-100 border rounded hover:bg-gray-200"
                          >
                            Voir
                          </button>
                        </>
                      )}

                      {/* Menu dropdown */}
                      <div
                        className="relative"
                        ref={(el) => (menuRefs.current[invoice.idInvoice] = el)}
                      >
                        <button
                          onClick={() =>
                            setOpenMenuId(isOpen ? null : invoice.idInvoice)
                          }
                          className="p-2 bg-gray-100 border rounded hover:bg-gray-200"
                        >
                          <FiMoreVertical className="text-gray-600" />
                        </button>

                        {isOpen && (
                          <ul className="absolute right-0 z-50 w-48 mt-2 bg-white border rounded-md shadow-lg top-full">
                            <NewDropdownItem
                              type="lien"
                              titre="Voir"
                              nature="showAcompte"
                              idInvoice={invoice.idInvoice}
                            />
                            {invoice.invoice_status === 1 && (
                              <>
                                <NewDropdownItem
                                  type="lien"
                                  titre="Editer"
                                  idInvoice={invoice.idInvoice}
                                  nature="EditerAcompte"
                                />
                                <li>
                                  <button
                                    onClick={() =>
                                      handleCancel(
                                        invoice.idInvoice,
                                        setData,
                                        index
                                      )
                                    }
                                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                  >
                                    Annuler
                                  </button>
                                </li>
                              </>
                            )}
                            <NewDropdownItem
                              type="lien"
                              titre="Exporter en PDF"
                              idInvoice={invoice.idInvoice}
                            />

                            <NewDropdownItem
                              type="lien"
                              titre="Supprimer"
                              data={data}
                              setData={setData}
                              idInvoice={invoice.idInvoice}
                            />
                          </ul>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {pagination?.last_page > 1 && (
        <Pagination
          onPageChange={handlePageChange}
          lastPage={pagination.last_page}
          currentPage={pagination.current_page}
          totalItems={pagination.total}
        />
      )}
    </div>
  );
}
