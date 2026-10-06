import { useEffect, useState } from "react";
import { HeaderInvoice } from "./header-invoice";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import useApi from "../../../../hooks/Api";
import { Spinner } from "../../../../components/ui/spinner";
import { useParams } from "react-router-dom";
import axios from "../../../../config/axios";
import { Link } from "react-router-dom";
import { IMAGE_URL } from "../../../../config/env";
dayjs.locale("fr");
export function VoirDetails() {
  const setting = JSON.parse(sessionStorage.getItem("setting"));
  const { id } = useParams();
  const digitalOcean =
    IMAGE_URL;
  const [data, setData] = useState(null);
  const formatDate = (date) => dayjs(date).format("D MMMM YYYY");
  const formatNumber = (number) => Number(number).toLocaleString("fr-FR");
  const { loading, error, callApi } = useApi();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fonction pour recharger les données apres paiement dans headerInvoice
  const reloadData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const res = await callApi(`/cfp/factures/${id}`);
        setData(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData(id);
  }, [id, callApi, refreshTrigger]);

  if (loading || data === null) return <Spinner />;
  if (error) return <p>Erreur : {error.message}</p>;

  const handlePreview = async (idDocument) => {
    try {
      const response = await axios.get(`/bon-commandes/doc/${idDocument}/preview`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], {
        type: response.headers['content-type']
      });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de la prévisualisation:", error);
    }
  };
  return (
    <>
      <div className="flex flex-col w-full sm:w-[1280px] lg:w-full gap-3 px-8">
        <HeaderInvoice data={data} onDataUpdate={reloadData} />
        <div className="border-t-[1px] border-gray-100 rounded-sm w-full bg-white py-10 flex flex-col gap-6">
          <div className="inline-flex justify-between w-full px-8">
            <div className="w-full">
              <img
                src={`${digitalOcean}/img/entreprises/${data.invoice.logo || ""
                  }`}
                alt="Logo-Organisme_de_Formation"
                className="h-[88px] rounded-md"
              />
            </div>

            <div className="flex flex-col w-full gap-3">
              <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-medium text-right text-gray-700">
                  {data.invoice.typeFacture}
                </h1>
                <h4 className="text-lg font-semibold text-right text-gray-700">
                  {data.invoice.name ? data.invoice.name : "Pas de nom"}
                </h4>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-end gap-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-700">Adresse :</p>
                    <p className="text-gray-600">
                      {data.invoice.customer_addr_lot ||
                        data.invoice.customer_addr_quartier
                        ? `${data.invoice.customer_addr_lot || ""} ${data.invoice.customer_addr_quartier || ""
                          }`.trim()
                        : "pas d'adresse"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-700">
                      {setting?.nif_name} :
                    </p>
                    <p className="text-gray-500">
                      {" "}
                      {data.invoice.nif
                        ? data.invoice.nif
                        : "pas de numero nif"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-700">
                      {setting?.stat_name} :
                    </p>
                    <p className="text-gray-500">
                      {data.invoice.stat
                        ? data.invoice.stat
                        : "pas de numero stat"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="border" />
          <div className="inline-flex justify-between w-full px-8">
            <div className="flex flex-col w-[41%]">
              <h4 className="text-lg font-bold text-gray-800 uppercase">
                {data.entreprise.etp_name || "pas de nom d'entreprise"}
              </h4>

              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-700">Adresse :</p>
                <p className="text-gray-700">
                  {data.entreprise.etp_addr_lot ||
                    data.entreprise.etp_addr_quartier
                    ? `${data.entreprise.etp_addr_lot || ""} ${data.entreprise.etp_addr_quartier || ""
                    }`
                    : "pas d'adresse"}, {data.entreprise.etp_addr_code_postal}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-700">
                  {" "}
                  {setting?.nif_name} :
                </p>
                <p className="text-base text-gray-700">
                  {data.entreprise.etp_nif || "Pas de numero NIF"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-700">
                  {" "}
                  {setting?.stat_name} :
                </p>
                <p className="text-base text-gray-700">
                  {data.entreprise.etp_stat || "Pas de numero NIF"}
                </p>
              </div>
            </div>
            <div className="flex flex-col w-[27%]">
              <h4 className="text-lg font-bold text-gray-800 uppercase">
                Personne à contacter
              </h4>

              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-700">Nom :</p>
                <p className="text-gray-700">
                  {data.invoice.contact_name || "Pas de nom"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-700">Email :</p>
                <p className="text-base text-gray-700">
                  {data.invoice.contact_mail || "Pas d'email"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-700">Numero téléphone :</p>
                <p className="text-base text-gray-700">
                  {data.invoice.contact_phone || "Pas de numero"}
                </p>
              </div>
            </div>

            <div className="flex flex-col w-[32%] gap-3">
              <div className="flex flex-col items-start">
                <div className="inline-flex items-center justify-between w-full gap-2">
                  <h4 className="w-full text-lg font-semibold text-left text-gray-700">
                    Numéro de facture :
                  </h4>
                  <p className="w-full text-lg text-right text-gray-700">
                    {data.invoice.invoice_number}
                  </p>
                </div>

                {data.invoice.idTypeFacture !== 2 && (
                  <div className="inline-flex items-center justify-between w-full gap-2">
                    <h4 className="w-full text-lg font-semibold text-left text-gray-700">
                      Numéro B.C :
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(
                          data.invoice.idTypeFacture === 3 && data.acompteInfo
                            ? data.acompteInfo.idBC
                            : data.invoice.idTypeFacture === 4
                              ? data.soldeInfo.idBC
                              : data.invoice.invoice_bc
                        );
                      }}
                      className="w-full text-lg text-right text-gray-700 hover:text-blue-700"
                    >
                      {data.invoice.idTypeFacture === 3 && data.acompteInfo
                        ? data.acompteInfo.numero
                        : data.invoice.idTypeFacture === 4 ? data.soldeInfo.numero
                          : data.invoice.invoice_bc
                      }
                    </button>
                  </div>
                )}

                <div className="inline-flex items-center justify-between w-full gap-2">
                  <h4 className="w-full text-lg font-semibold text-left text-gray-700">
                    Date de facture :
                  </h4>
                  <p className="w-full text-lg text-right text-gray-700 capitalize">
                    {formatDate(data.invoice.invoice_date)}
                  </p>
                </div>

                <div className="inline-flex items-center justify-between w-full gap-2">
                  <h4 className="w-full text-lg font-semibold text-left text-gray-700">
                    {data.invoice.idTypeFacture !== 2
                      ? "Date de paiement :"
                      : "Valable jusqu'au :"}
                  </h4>
                  <p className="w-full text-lg text-right text-gray-700 capitalize">
                    {formatDate(data.invoice.invoice_date_pm)}
                  </p>
                </div>

                <div className="inline-flex items-center justify-between w-full gap-2 py-2 bg-gray-100 rounded-sm">
                  <h4 className="w-full text-lg font-semibold text-left text-gray-700">
                    Montant dû ( {setting?.currency_code}) :
                  </h4>
                  <p className="w-full text-lg font-semibold text-right text-gray-700">
                    {setting?.currency_code}{" "}
                    {Number(data.invoice.invoice_total_amount).toLocaleString(
                      "fr-FR"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Fin sub header*/}
          {/*Content */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#CE9D13]">
                <th className="px-8 py-2 w-[20%] text-white">Services</th>
                <th className="px-8 py-2 w-[20%] text-white">Description</th>
                <th className="px-8 py-2 w-[10%] text-white text-center">
                  Quantité
                </th>
                <th className="px-8 py-2 w-[10%] text-white text-center">
                  Unité
                </th>
                <th className="px-8 py-2 w-[10%] text-white text-right">
                  Prix Unitaire
                </th>
                <th className="px-8 py-2 w-[11%] text-white text-right">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody>
              {data.invoiceDetails.map((detail, index) => (
                <tr
                  key={`main-${index}`}
                  className="hover:bg-gray-50 border-b-[2px]"
                >
                  <td className="px-8 py-3">
                    {data.invoice.idTypeFacture === 1 ? (
                      <>
                        <div className="flex flex-col gap-1 text-base font-semibold text-gray-700">
                          <Link to={`/cfp/projet/detail/${detail.idProjet}`}>
                            Projet : {detail.module_name}
                          </Link>
                          {detail.numero_bc && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreview(detail.idDocument);
                              }}
                              className="text-start"
                              title="Prévisualiser le document"
                            >
                              N° BC: {detail.numero_bc}
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {data.invoice.idTypeFacture === 3
                          ? `Acompte`
                          : data.invoice.idTypeFacture === 4
                            ? `${detail.item_service}`
                            : `Projet : ${detail.module_name}`
                        }
                      </>
                    )}
                  </td>
                  <td className="px-8 py-3 text-base font-semibold text-gray-700">
                    {detail.item_description}
                  </td>
                  <td className="px-8 py-3 text-base font-semibold text-center text-gray-700">
                    {detail.item_qty}
                  </td>
                  <td className="px-8 py-3 text-base font-semibold text-center text-gray-700">
                    {detail.unit_name}
                  </td>
                  <td className="px-8 py-3 text-base font-semibold text-right text-gray-700">
                    {setting?.currency_code}{" "}
                    {formatNumber(detail.item_unit_price)}
                  </td>
                  <td className="px-8 py-3 text-base font-semibold text-right text-gray-700">
                    {setting?.currency_code}{" "}
                    {formatNumber(detail.item_total_price)}
                  </td>
                </tr>
              ))}

              {data.invoiceDetailsOther.map((detail, index) => (
                <tr
                  key={`other-${index}`}
                  className="hover:bg-gray-50 border-b-[2px]"
                >
                  <td className="px-8 py-3 text-base font-semibold text-gray-700">
                    {data.invoice.idTypeFacture === 4 ?
                      `Solde` :
                      detail?.Frais ?? ''
                    }
                  </td>
                  <td className="px-8 py-3 text-base font-semibold text-gray-700">
                    {detail.item_description}
                  </td>
                  <td className="px-8 py-3 text-base font-semibold text-center text-gray-700">
                    {detail.item_qty}
                  </td>
                  <td className="px-8 py-3 text-base font-semibold text-center text-gray-700">
                    {detail.unit_name}
                  </td>
                  <td className="px-8 py-3 text-base font-semibold text-right text-gray-700">
                    {setting?.currency_code}{" "}
                    {formatNumber(detail.item_unit_price)}
                  </td>
                  <td className="px-8 py-3 text-base font-semibold text-right text-gray-700">
                    {setting?.currency_code}{" "}
                    {formatNumber(detail.item_total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col gap-2 px-8 py-2 pr-3">
            <div className="inline-flex justify-end w-full items-center gap-[70px] px-4">
              <p className="text-base font-bold text-right text-gray-800">
                Sous-total :
              </p>
              <p className="text-base font-semibold text-right text-gray-700">
                {setting?.currency_code}{" "}
                {formatNumber(data.invoice.invoice_sub_total)}
              </p>
            </div>

            <div className="inline-flex justify-end w-full items-center gap-[80px] px-4">
              <p className="text-base font-medium text-right text-gray-600">
                Réduction :
              </p>
              <p className="text-base font-semibold text-right text-gray-700">
                {setting?.currency_code}{" "}
                {formatNumber(data.invoice.invoice_reduction)}
              </p>
            </div>
            <div className="inline-flex justify-end w-full items-center gap-[80px] px-4">
              <p className="text-base font-medium text-right text-gray-600">
                Tva :
              </p>
              <p className="text-base font-semibold text-right text-gray-700">
                {setting?.currency_code}{" "}
                {formatNumber(data.invoice.invoice_tva)}
              </p>
            </div>

            {data.invoice.invoice_tva === 0 && (
              <div className="inline-flex justify-end w-full items-center gap-[80px] px-4">
                <p className="text-base font-medium text-right text-gray-600">
                  TVA 20% :
                </p>
                <p className="text-base font-semibold text-right text-gray-700">
                  {setting?.currency_code}{" "}
                  {formatNumber(data.invoice.invoice_tva)}
                </p>
              </div>
            )}

            <div className="inline-flex justify-end my-3">
              <hr className="border w-[240px]" />
            </div>

            <div className="inline-flex justify-end w-full items-center gap-[70px] px-4">
              <p className="text-base font-bold text-right text-gray-800">
                Total :
              </p>
              <p className="text-base font-semibold text-right text-gray-700">
                {setting?.currency_code}{" "}
                {formatNumber(data.invoice.invoice_total_amount)}
              </p>
            </div>

            <div className="inline-flex justify-end my-3">
              <hr className="border w-[240px]" />
            </div>
          </div>
          <div className="px-8 py-8">
            <p className="text-base font-semibold text-gray-700">
              Arrêtée la présente facture à la somme de{" "}
              <span className="uppercase">{data.invoice.invoice_letter}</span>{" "}
              {setting?.currency_code}
            </p>
          </div>
          {/*FIN CONTENT*/}
          {/*CONTENT MODE DE PAIEMENT */}

          <div className="flex justify-between gap-8 px-8">
            {/* Notes / Termes à gauche */}
            <div className="flex flex-col w-1/2 gap-3">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <p className="text-base font-bold text-gray-700">
                    Notes / Termes
                  </p>
                  <p className="text-base text-gray-700 normal-case">
                    Paiement par {data.invoice.pm_type_name}
                  </p>
                </div>

                {data.invoice.idTypePm === 1 ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-base text-gray-700">
                      Veuillez libeller le chèque à l'ordre de "
                      {data.invoice.ba_titulaire}"
                    </p>
                    {data.invoice.invoice_condition && (
                      <p className="text-base text-gray-700">
                        Condition de paiement : {data.invoice.invoice_condition}
                      </p>
                    )}
                  </div>
                ) : data.invoice.idTypePm === 2 ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <p className="text-base font-semibold text-gray-700">
                        RIB
                      </p>
                      <p className="text-base text-gray-700">
                        Titulaire du compte {data.invoice.ba_titulaire}
                      </p>
                      <p className="text-base text-gray-700">
                        Banque {data.invoice.ba_name} {data.invoice.ba_quartier}
                        , {data.invoice.ville_name}{" "}
                        {data.invoice.vi_code_postal}
                      </p>
                      <p className="text-base text-gray-700">
                        Compte N° {data.invoice.ba_account_number}
                      </p>
                    </div>
                    {data.invoice.invoice_condition && (
                      <p className="text-base text-gray-700">
                        Condition de paiement : {data.invoice.invoice_condition}
                      </p>
                    )}
                  </div>
                ) : (
                  data.invoice.invoice_condition && (
                    <div>
                      <p className="mt-4 text-base text-gray-700">
                        Condition de paiement : {data.invoice.invoice_condition}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Signature à droite */}
            {/* <div className="flex flex-col items-end w-1/2 gap-3">
                            <p className="text-base font-bold text-gray-700">Signature</p>
                            <img
                              src={`${data.invoice.signature || 'Pas de signature'}`}
                              alt="Signature"
                              className="w-32 h-auto"
                            />
                          </div> */}
          </div>

          {/* FIN CONTENT MODE DE PAIEMENT*/}
          <div className="flex flex-col gap-2 py-8">
            <div className="inline-flex flex-wrap justify-center w-full gap-4 px-8">
              <div className="inline-flex items-center justify-center gap-2">
                <p className="text-lg text-gray-400">
                  {data.invoice.name || "Pas de nom"}
                </p>
              </div>
              <span className="text-lg text-gray-400">|</span>
              <div className="inline-flex items-center justify-center gap-2">
                <p className="text-lg text-gray-400"> {setting?.nif_name} :</p>
                <p className="text-lg text-gray-400">
                  {data.invoice.nif || "Pas de numero NIF"}
                </p>
              </div>
              <span className="text-lg text-gray-400">|</span>
              <div className="inline-flex items-center justify-center gap-2">
                <p className="text-lg text-gray-400"> {setting?.stat_name} :</p>
                <p className="text-lg text-gray-400">
                  {data.invoice.stat || "Pas de numero STAT"}
                </p>
              </div>
              <span className="text-lg text-gray-400">|</span>
              <div className="inline-flex items-center justify-center gap-2">
                <p className="text-lg text-gray-400">RCS :</p>
                <p className="text-lg text-gray-400">
                  {data.invoice.rcs || "Pas de numero rcs"}
                </p>
              </div>
            </div>

            <div className="inline-flex flex-wrap justify-center w-full gap-4 px-8">
              <div className="inline-flex items-center justify-center gap-2">
                <p className="text-lg text-gray-400">MAIL :</p>
                <p className="text-lg text-gray-400">
                  {data.invoice.mail || "Pas d'adresse email"}
                </p>
              </div>
              <span className="text-lg text-gray-400">|</span>
              <div className="inline-flex items-center justify-center gap-2">
                <p className="text-lg text-gray-400">ADRESSE :</p>
                <p className="text-lg text-gray-400">
                  {data.invoice.customer_addr_lot ||
                    data.invoice.customer_addr_quartier ||
                    data.invoice.customer_addr_code_postal
                    ? `${data.invoice.customer_addr_lot ?? ""} ${data.invoice.customer_addr_quartier ?? ""
                    } ${data.invoice.customer_addr_code_postal ?? ""}`
                    : "pas d'adresse"}
                </p>
              </div>
              <span className="text-lg text-gray-400">|</span>
              <div className="inline-flex items-center justify-center gap-2">
                <p className="text-lg text-gray-400">TELEPHONE :</p>
                <p className="text-lg text-gray-400">
                  {data.invoice.phone || "pas de numero téléphone"}
                </p>
              </div>
              <span className="text-lg text-gray-400">|</span>
              <div className="inline-flex items-center justify-center gap-2">
                <p className="text-lg text-gray-400">SITE WEB :</p>
                <p className="text-lg text-gray-400">
                  {data.invoice.website || "pas de lien site web"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
