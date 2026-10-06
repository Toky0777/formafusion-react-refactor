import { useEffect, useState } from "react";
import { AjoutClient } from "./AjoutClient";
import { Search } from "./search";
import { Count } from "./count";
import { useNavigate } from "react-router-dom";
import { FooterFacture } from "./footer-facture";
import axios from "../../../../config/axios";
import { SearchSolde } from "../Solde/components/SearchSolde";
import { API_URL } from "../../../../config/env";

export function FactTemplate({ data, isNature, isEdit, dataProfil }) {
  const [company, setCompany] = useState(
    isEdit ? data.invoice.idCompany : null
  );

  const [idEtp, setIdEtp] = useState(null);
  const [sumFolder, setSumFolder] = useState(0);
  const [sumProject, setSumProject] = useState(0);
  const [sumItems, setSumItems] = useState(0);
  const [sumTotal, setSumTotal] = useState(0);
  const [sumCours, setSumCours] = useState(0);
  const [errors, setErrors] = useState({});
  const [selectPaymentValue, setSelectPaymentValue] = useState(1);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceBc, setInvoiceBc] = useState("");
  const [selectedBc, setSelectedBc] = useState(isEdit ? data.invoice?.invoice_bc : "");
  const [soldeData, setSoldeData] = useState([]);
  //calcul date
  const [joursAvantPaiementSelect, setJoursAvantPaiementSelect] = useState(10);
  const [invoiceDatePm, setInvoiceDatePm] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [invoice_date, setInvoice_date] = useState(
    new Date().toISOString().split("T")[0]
  );

  // États pour les bons de commande
  const [bonCommandes, setBonCommandes] = useState([]);
  const [loadingBc, setLoadingBc] = useState(false);

  // Détection du type de facture
  const isProforma = isEdit === "proforma" || isNature === "proforma";
  const isAcompte = isEdit === "acompte" || isNature === "acompte";
  const isSolde = isEdit === "solde" || isNature === "solde";
  const isStandard = !isProforma && !isAcompte && !isSolde;

  const setting = JSON.parse(sessionStorage.getItem("setting"));

  // Récupérer les bons de commande quand l'entreprise change
  useEffect(() => {
    if ((isAcompte || isSolde) && idEtp) {
      fetchBonCommandes(idEtp);
    } else {
      setBonCommandes([]);
    }
  }, [idEtp, isAcompte, isSolde]);

  const fetchBonCommandes = async (entrepriseId) => {
    try {
      setLoadingBc(true);
      const response = await axios.get(`cfp/bon-commande/getBcByIdEtp/${entrepriseId}`);
      setBonCommandes(response.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des bons de commande:", error);
      setBonCommandes([]);
    } finally {
      setLoadingBc(false);
    }
  };

  useEffect(() => {
    if (isEdit && data?.invoice) {
      setInvoiceNumber(data.invoice.invoice_number || "");
      setInvoiceBc(data.invoice.invoice_bc || "");
      setInvoice_date(data.invoice.invoice_date || "");
      setInvoiceDatePm(data.invoice.invoice_date_pm || "");
      setSelectPaymentValue(data.invoice.idTypePm);
    }
  }, [isEdit, data]);

  useEffect(() => {
    const total = parseInt(
      Number(sumProject) +
      Number(sumItems) +
      Number(sumFolder) +
      Number(sumCours)
    );
    setSumTotal(total);
  }, [sumProject, sumItems, sumFolder, sumCours]);

  useEffect(() => {
    if (!invoice_date || !joursAvantPaiementSelect) return;

    const dateFacture = new Date(invoice_date);
    const jours = parseInt(joursAvantPaiementSelect, 10);

    if (isNaN(dateFacture.getTime()) || isNaN(jours)) return;

    const datePaiement = new Date(dateFacture);
    datePaiement.setDate(datePaiement.getDate() + jours);

    setInvoiceDatePm(datePaiement.toISOString().split("T")[0]);
  }, [invoice_date, joursAvantPaiementSelect]);

  const [openDiv, setOpenDiv] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      if (isEdit) {
        const response = await axios.put(
          `${API_URL}/cfp/factures/${data.invoice.idInvoice}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        navigate(`/cfp/facture/details/${response.data.idInvoice}`);
      } else {
        const response = await axios.post(
          `${API_URL}/cfp/factures`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        navigate(`/cfp/facture/details/${response.data.idInvoice}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Erreur serveur :", error);
      }
    }
  };

  // Fonction pour déterminer le type de facture
  const getFactureType = () => {
    if (isProforma) return 2;
    if (isAcompte) return 3;
    if (isSolde) return 4;
    return 1; // Standard
  };

  // Fonction pour déterminer le titre
  const getFactureTitle = () => {
    if (isProforma) return "Facture Proforma";
    if (isAcompte) return "Facture d'Acompte";
    if (isSolde) return "facture finale";
    return "Facture";
  };

  // Modifier la gestion du changement de BC
  const handleBcChange = (bcId) => {
    setSelectedBc(bcId);
    setInvoiceBc(bcId);
  };

  return (
    <>
      <form action={handleSubmit} className="flex flex-col gap-4">
        {isEdit && (
          <div className="flex items-center justify-between mx-12">
            <div className="inline-flex items-center gap-4">
              <h1 className="font-sans text-xl font-semibold text-gray-700 uppercase">
                {data.invoice.typeFacture}#
                <span className="font-sans text-xl font-semibold text-gray-700">
                  {data.invoice.invoice_number}
                </span>
              </h1>
            </div>
            <div className="">
              <button
                type="submit"
                className="px-3 py-2 text-base rounded-full border-[1px] border-gray-400 bg-gray-600 text-white"
              >
                Sauver et apercevoir
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col mx-12 bg-white rounded-md shadow-sm">
          {Object.keys(errors).length > 0 && (
            <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">
              <ul className="list-disc list-inside">
                {Object.entries(errors).map(([field, messages]) =>
                  messages.map((msg, index) => (
                    <li key={`${field}-${index}`}>{msg}</li>
                  ))
                )}
              </ul>
            </div>
          )}
          {/*Header*/}
          <div
            className="inline-flex justify-between px-12 py-8"
            onClick={() => setOpenDiv(false)}
          >
            <AjoutClient
              idEtp={idEtp}
              setIdEtp={setIdEtp}
              isEdit={isEdit}
              data={data}
            />
            {/* RIGHT */}
            <div className="flex flex-col w-full gap-2">
              <div className="flex justify-end mb-4">
                <p className="text-4xl font-semibold text-gray-600">
                  {getFactureTitle()}
                </p>
                <input
                  type="hidden"
                  name="idTypeFacture"
                  id="idTypeFacture"
                  value={getFactureType()}
                />
              </div>

              <div className="inline-flex items-center gap-4">
                <div className="flex justify-end w-1/3">
                  <label className="flex-1 text-base font-semibold text-right text-gray-500">
                    <span className="text-lg text-red-500">* </span>
                    Adresse de facturation :
                  </label>
                </div>
                <div className="flex flex-col justify-start w-2/3">
                  <select
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    name="idCompany"
                    id="idCompany"
                    className="p-2 border rounded-lg focus:outline-none focus:ring-purple-500 focus:ring-1"
                  >
                    {dataProfil.companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        Nom : {company.name}- {setting?.nif_name} :{" "}
                        {company.nif}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="inline-flex items-center gap-4">
                <div className="flex justify-end w-1/3">
                  <label
                    htmlFor="invoice_number"
                    className="flex-1 text-base font-semibold text-right text-gray-500"
                  >
                    <span className="text-lg text-red-500">* </span>
                    Numero de facture :
                  </label>
                </div>
                <div
                  className="flex flex-col justify-start w-2/3"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDiv(true);
                  }}
                >
                  <input
                    type="text"
                    id="invoice_number"
                    name="invoice_number"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="Fact-001"
                    required
                    className="w-full p-2 text-base text-gray-900 border rounded-lg placeholder:italic focus:outline-none focus:ring-purple-500 focus:ring-1"
                  />
                </div>
              </div>

              {/* Last Invoice */}
              {openDiv &&
                data.number_invoice &&
                data.number_invoice.length > 0 && (
                  <div className="inline-flex items-center gap-4">
                    <div className="flex justify-end w-1/3"></div>
                    <div className="flex flex-col justify-start w-2/3">
                      <div
                        id="lastInvoice"
                        className="w-full px-2 py-1 border rounded-lg "
                      >
                        <div className="px-2 font-semibold text-gray-500">
                          Trois derniers numéros de factures :
                        </div>
                        {data.number_invoice.map((invoice, index) => (
                          <div className="px-2 text-gray-500" key={index}>
                            {invoice.invoice_number} -{" "}
                            {new Date(
                              invoice.invoice_date
                            ).toLocaleDateString()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              {/* Gestion différente pour invoice_bc selon le type */}
              {!isProforma && (
                <div
                  id="invoice_bc_container"
                  className="inline-flex items-center gap-4">
                  <div className="flex justify-end w-1/3">
                    <label
                      htmlFor="invoice_bc"
                      className="flex-1 text-base font-semibold text-right text-gray-500"
                    >
                      {(isAcompte || isSolde) && <span className="text-lg text-red-500">* </span>}
                      Numero B.C :
                    </label>
                  </div>
                  <div className="flex flex-col justify-start w-2/3">
                    {(isAcompte || isSolde) ? (
                      <select
                        id="invoice_bc"
                        name="invoice_bc"
                        value={selectedBc}
                        onChange={(e) => handleBcChange(e.target.value)}
                        required={(isAcompte || isSolde)}
                        disabled={loadingBc || !idEtp}
                        className="w-full p-2 text-base text-gray-900 border rounded-lg focus:outline-none focus:ring-purple-500 focus:ring-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {loadingBc
                            ? "Chargement des bons de commande..."
                            : !idEtp
                              ? "Sélectionnez d'abord une entreprise"
                              : "Sélectionnez un bon de commande"}
                        </option>
                        {bonCommandes.map((bc) => (
                          <option key={bc.idBC} value={bc.idBC}>
                            N°: {bc.numero_bc} - {bc.date_bc} - {bc.montant_bc} {setting?.currency_code}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        id="invoice_bc"
                        name="invoice_bc"
                        value={invoiceBc}
                        onChange={(e) => setInvoiceBc(e.target.value)}
                        className="w-full p-2 text-base text-gray-900 border rounded-lg placeholder:italic focus:outline-none focus:ring-purple-500 focus:ring-1"
                        placeholder=""
                      />
                    )}
                  </div>
                </div>
              )}

              {isProforma && (
                <input type="hidden" name="invoice_bc" id="invoice_bc" />
              )}

              <div className="inline-flex items-center gap-4">
                <div className="flex justify-end w-1/3">
                  <label
                    htmlFor="invoice_date"
                    className="flex-1 text-base font-semibold text-right text-gray-500"
                  >
                    <span className="text-lg text-red-500">* </span>
                    Date de facture :
                  </label>
                </div>

                <div className="flex flex-col justify-start w-2/3">
                  <input
                    type="date"
                    id="invoice_date"
                    name="invoice_date"
                    className="w-full p-2 text-base text-gray-900 border rounded-lg placeholder:italic focus:outline-none focus:ring-purple-500 focus:ring-1"
                    placeholder=""
                    value={invoice_date}
                    onChange={(e) => setInvoice_date(e.target.value)}
                  />
                </div>
              </div>
              <div className="inline-flex items-center gap-4">
                <div className="flex justify-end w-1/3">
                  <label
                    htmlFor="invoice_date_pm"
                    className="flex-1 text-base font-semibold text-right text-gray-500"
                  >
                    <span className="text-lg text-red-500">*</span> Date de
                    paiement :
                  </label>
                </div>

                <div className="flex flex-col justify-start w-2/3">
                  <div className="flex items-center justify-start gap-2">
                    <select
                      id="joursAvantPaiement"
                      className="p-2 border rounded-lg focus:outline-none focus:ring-purple-500 focus:ring-1"
                      value={joursAvantPaiementSelect}
                      onChange={(e) =>
                        setJoursAvantPaiementSelect(e.target.value)
                      }
                    >
                      <option value="10">10 jours</option>
                      <option value="20">20 jours</option>
                      <option value="30">30 jours</option>
                    </select>
                    <input
                      type="date"
                      id="invoice_date_pm"
                      name="invoice_date_pm"
                      required
                      value={invoiceDatePm}
                      onChange={(e) => setInvoiceDatePm(e.target.value)}
                      className="w-full p-2 text-base text-gray-900 border rounded-lg placeholder:italic focus:outline-none focus:ring-purple-500 focus:ring-1"
                    />
                  </div>
                </div>
              </div>
              <input
                type="hidden"
                id="invoice_status"
                name="invoice_status"
                value="1"
              />
              <input
                type="hidden"
                id="idCustomer"
                name="idCustomer"
                value={data.customer.idCustomer}
              />
            </div>
          </div>
          {/* --SERVICE-- */}
          {isSolde ? (
            <SearchSolde
              idEtp={idEtp}
              data={data}
              setSumItems={setSumItems}
              selectedBc={selectedBc}
              onSoldeDataChange={setSoldeData}
            />
          ) : (
            <Search
              idEtp={idEtp}
              data={data}
              setSumFolder={setSumFolder}
              setSumItems={setSumItems}
              setSumProject={setSumProject}
              setSumCours={setSumCours}
              isNature={isNature}
              isEdit={isEdit}
              isAcompte={isAcompte}
            />
          )}
          {/*-- AFFICHAGE COUNT -- */}
          <Count sumTotal={sumTotal} data={data} isEdit={isEdit} />

          {/* -- MODE DE PAIEMENT --*/}
          <div className="px-12 py-8 text-base font-normal border-b">
            <div>
              <label
                htmlFor="idPaiement"
                className="block mb-2 text-base font-medium"
              >
                Choisissez le mode de paiement :{" "}
                <span className="text-lg text-red-500">* </span>
              </label>
              <select
                id="idPaiement"
                name="idPaiement"
                required
                value={selectPaymentValue}
                onChange={(e) => setSelectPaymentValue(e.target.value)}
                className="p-2 mb-4 text-base border rounded focus:outline-none focus:ring-purple-500 focus:ring-1"
              >
                {data.pm.map((p) => (
                  <option key={p.idTypePm} value={p.idTypePm}>
                    {p.pm_type_name}
                  </option>
                ))}
              </select>
            </div>
            {isEdit && (
              <input
                type="hidden"
                id="idPay"
                name="idPay"
                value={data.invoice.idPaiement}
              />
            )}
            {selectPaymentValue != 3 && (
              <div id="bank-acount">
                <label
                  htmlFor="idBankAcount"
                  className="block mb-2 text-base font-medium"
                >
                  Choisissez un compte bancaire :{" "}
                  <span className="text-lg text-red-500">* </span>
                </label>
                <select
                  id="idBankAcount"
                  name="idBankAcount"
                  defaultValue={isEdit ? data.invoice.idBankAcount : ""}
                  className="p-2 mb-4 text-base border rounded focus:outline-none focus:ring-purple-500 focus:ring-1"
                >
                  <option disabled>Sélectionner un compte</option>
                  {data.accounts.map((account) => (
                    <option key={account.id} value={account.id} selected>
                      {account.ba_titulaire} - {account.ba_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-2 py-2">
              <p className="text-base font-semibold text-gray-700">
                Condition de paiement :
              </p>
              <textarea
                id="invoice_condition"
                name="invoice_condition"
                className="w-1/3 p-2 text-base text-gray-500 border rounded-md outline-none"
                placeholder="Exemple : (50% avant la formation - 50% après la formation)"
              ></textarea>
            </div>
          </div>
        </div>
        {/*Footer */}
        <FooterFacture data={data} />
        {isEdit ? (
          <div className="flex items-center justify-end gap-3 mx-12 mt-2 mb-12">
            <div id="multi-error"></div>
            <button
              type="submit"
              className="px-3 py-2 text-base text-white transition-colors bg-gray-600 border border-gray-400 rounded-full hover:bg-gray-700"
            >
              Sauver et apercevoir
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3 m-12">
            <button
              className="px-4 py-2 rounded-md bg-[#A462A4] text-white hover:bg-[#8e4f8e] transition-colors"
              type="submit"
            >
              Sauver et apercevoir
            </button>
          </div>
        )}
      </form>
    </>
  );
}