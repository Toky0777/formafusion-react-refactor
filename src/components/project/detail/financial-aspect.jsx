import {
  Banknote,
  Calculator,
  ChevronDown,
  ChevronUp,
  CreditCard,
  DollarSign,
  Edit3,
  Minus,
  Percent,
  Plus,
  Receipt,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../../config/axios";
import { projectService } from "../../../services/projectService";
import toast from "react-hot-toast";

export const FinancialAspect = ({
  id,
  AfficheApprenants,
  setSelectedPaiement,
  idSubContractor,
  selectedPaiement,
  totalHt,
  setTotalHt,
  totalTtc,
  setTotalTtc,
  payment,
  setPayment,
  taxe,
  setTaxe,
}) => {
  const [tousFrais, setTousFrais] = useState({ frais: [] });
  const [costAdded, setCostAdded] = useState([]);
  const [showDrawerFinacial, setDrawerFinancial] = useState(false);
  const [AfficheFinancier, setAfficheFinancier] = useState(true);
  const setting = JSON.parse(sessionStorage.getItem("setting"));
  const [fraisValues, setFraisValues] = useState({});
  const getFinancementIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "entreprise":
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case "cpf":
        return <Banknote className="w-5 h-5 text-green-600" />;
      case "pole emploi":
        return <Receipt className="w-5 h-5 text-orange-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-purple-600" />;
    }
  };

  const getTypeFinancial = (type) => {
    switch (type) {
      case 1:
        return "Fonds propres";
      case 2:
        return "Fmfp";
      case 3:
        return "Autres";
      default:
        return "Autres";
    }
  };

  const fetchCostProject = async () => {
    const costs = await axios.get(`/cfp/projets/frais-formations/all`);
    setTousFrais(costs.data || []);
  };

  const fetchCostAssigneInProject = async () => {
    const isEtp = idSubContractor ? 2 : 0;
    const costs = await axios.get(`/cfp/projets/${id}/${isEtp}/frais`);
    setCostAdded(costs.data.fraisdetails || []);
  };

  const fraisRemove = async (method, id, idFraisProjet) => {
    if (method === "post") {
      try {
        await axios.post(`/cfp/projets/${id}/${idFraisProjet}/delete-frais`);

        fetchCostAssigneInProject();
        toast("Frais suprimé avec succès");
      } catch (error) {
        console.error("Erreur lors de la supression du frais :", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!showDrawerFinacial) return;

      await Promise.all([fetchCostProject(), fetchCostAssigneInProject()]);
    };

    fetchData();
  }, [showDrawerFinacial]);

  const handleFieldChange = (idFraisProjet, field, value) => {
    setFraisValues((prev) => ({
      ...prev,
      [idFraisProjet]: {
        ...prev[idFraisProjet],
        [field]: value,
      },
    }));

    clearTimeout(window[`timeout_${idFraisProjet}_${field}`]);
    window[`timeout_${idFraisProjet}_${field}`] = setTimeout(() => {
      updateFrais(idFraisProjet, field, value);
      updateTotalFrais(id);
      fetchTotalCostProject();
    }, 800);
  };

  const fetchTotalCostProject = async () => {
    try {
      const { data } = await axios.get(`/cfp/projets/${id}/get-total-cost`);
      setTotalHt(data.total_ht);
      setTotalTtc(data.total_ttc);
    } catch (error) {
      console.error(error);
    }
  };

  const updatetaxe = async (taxe) => {
    try {
      await axios.post(`/cfp/projets/${id}/update-taxe`, {
        taxe,
      });
      setTaxe(taxe);
      toast.success("Taxe modifié avec succès");
      fetchTotalCostProject();
    } catch (error) {
      console.error("Erreur de l'ajout de taxe :", error);
    }
  };

  const updateFinancement = async (id, idPaiement) => {
    try {
      await axios.patch(`/cfp/projets/update/financement/${id}`, {
        idPaiement,
      });
      setSelectedPaiement(idPaiement);
      setPayment(getTypeFinancial(idPaiement));
    } catch (error) {
      setSelectedPaiement(payment);
    }
  };

  const manageFrais = async (id, idFrais) => {
    try {
      await projectService.manageFrais(id, idFrais, idSubContractor);
      fetchCostAssigneInProject(id, idSubContractor);
      toast("Frais ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du frais :", error);
    }
  };

  const updateFrais = async (idFraisProjet, field, value) => {
    try {
      const current = fraisValues[idFraisProjet] || {};
      const montantValue =
        field === "montant"
          ? parseFloat(value)
          : parseFloat(current.montant || 0);
      if (isNaN(montantValue)) {
        alert("Le montant doit être un nombre valide !");
        return;
      }
      const data = {
        idFraisProjet,
        montant: montantValue,
        description:
          field === "description" ? value : current.description || "",
      };
      const response = await axios.post(`/cfp/projets/update-frais`, data);
      updateTotalFrais(id);
    } catch (error) {
      console.error(
        "❌ Erreur lors de la mise à jour du frais :",
        error.response?.data || error.message
      );

      if (error.response) {
        if (error.response.status === 422 && error.response.data.errors) {
          const errors = Object.values(error.response.data.errors)
            .flat()
            .join(", ");
          alert("Erreur de validation : " + errors);
        } else if (error.response.status === 400) {
          alert(
            "Erreur backend : " +
              (error.response.data.message || "Erreur inconnue")
          );
        } else {
          alert(
            "Erreur inattendue : " +
              (error.response.data?.error || error.message)
          );
        }
      } else {
        alert("Erreur réseau ou serveur : " + error.message);
      }
    }
  };

  const updateTotalFrais = async (idProjet) => {
    try {
      const response = await axios.post(`/cfp/projets/${idProjet}/total-frais`);
    } catch (error) {
      if (error.response) {
      } else {
        console.error("❌ Erreur réseau :", error.message);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl p-4 mx-auto">
      <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl">
        <h2 className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
            <button
              onClick={() => setAfficheFinancier((prev) => !prev)}
              className="flex items-center gap-3 text-gray-700 transition-colors duration-200 hover:text-purple-600 group"
            >
              <div className="p-2 transition-shadow duration-200 bg-white rounded-lg shadow-sm group-hover:shadow-md">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Espace financiers
                  </h2>
                  <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                    Actifs
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Gérez vos financement de formation
                </p>
              </div>
              <div className="ml-2 transition-transform duration-200 group-hover:scale-110">
                {AfficheApprenants ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
            <div className="flex justify-end pr-4">
              <button
                onClick={() => setDrawerFinancial(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-300 bg-transparent border-2 border-gray-600 shadow-sm rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-medium">Éditer</span>
              </button>
              <AnimatePresence>
                {showDrawerFinacial && (
                  <>
                    {/* Overlay noir semi-transparent */}
                    <motion.div
                      className="fixed inset-0 bg-gray-800/60 "
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />

                    {/* Panneau de formulaire */}
                    <motion.div
                      initial={{ opacity: 0, x: 300 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 300 }}
                      transition={{ duration: 0 }}
                      className=""
                    >
                      <div className="fixed inset-0 z-50 overflow-hidden bg-black/20 backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-full h-full max-w-6xl transition-transform duration-300 ease-out transform bg-white shadow-2xl">
                          {/* Header */}
                          <div className="flex items-center justify-between px-6 py-4 text-white bg-gradient-to-r from-purple-600 to-blue-600">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                                <Calculator className="w-5 h-5" />
                              </div>
                              <div>
                                <h2 className="text-lg font-semibold">
                                  Gestion des Frais
                                </h2>
                                <p className="text-sm text-purple-100">
                                  Configurez les frais de votre projet
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setDrawerFinancial(false)}
                              className="p-2 transition-colors duration-200 rounded-lg hover:bg-white/20"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="h-[calc(100vh-80px)] overflow-y-auto">
                            <div className="p-6 space-y-6">
                              <div className="flex flex-col gap-2">
                                <h1 className="text-slate-700 text-[13px] font-semibold">
                                  Type de financement
                                </h1>
                                <div className="flex items-center p-5 space-x-6">
                                  {[
                                    {
                                      value: 1,
                                      label: "Fonds Propres",
                                    },
                                    { value: 2, label: "FMFP" },
                                    {
                                      value: 3,
                                      label: "Autres",
                                    },
                                  ].map((option) => (
                                    <label
                                      key={option.value}
                                      className="flex items-center space-x-2 cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        name="paiement"
                                        value={option.value}
                                        checked={
                                          selectedPaiement === option.value
                                        }
                                        onChange={() => {
                                          setSelectedPaiement(option.value);
                                          updateFinancement(id, option.value);
                                        }}
                                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 focus:ring-2"
                                      />
                                      <span className="text-sm text-gray-700">
                                        {option.label}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 h-96">
                              <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
                                <div className="flex items-center gap-3 p-4 border-b border-red-200 bg-gradient-to-r from-red-50 to-red-100 rounded-t-xl">
                                  <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                                  <h4 className="font-semibold text-gray-800">
                                    Frais disponibles
                                  </h4>
                                </div>

                                <div className="p-4 h-[80rem] overflow-y-auto">
                                  <div className="space-y-3">
                                    {/* List items here with className instead of class */}
                                    {tousFrais.frais.map((f, index) => (
                                      <div
                                        key={index}
                                        className="p-4 transition-all duration-200 border border-gray-200 rounded-lg group bg-gray-50 hover:bg-gray-100 hover:shadow-md"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex-1">
                                            <h5 className="mb-1 font-medium text-gray-800">
                                              {f.Frais}
                                            </h5>
                                            <p className="text-sm text-gray-500">
                                              {f.exemple}
                                            </p>
                                          </div>
                                          <button
                                            onClick={() =>
                                              manageFrais(id, f.idFrais)
                                            }
                                            className="p-2 text-green-600 transition-colors duration-200 transform bg-green-100 rounded-full opacity-0 hover:bg-green-200 group-hover:opacity-100 group-hover:scale-110"
                                          >
                                            <Plus className="w-4 h-4" />
                                          </button>
                                        </div>{" "}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
                                <div className="flex items-center gap-3 p-4 border-b border-green-200 bg-gradient-to-r from-green-50 to-green-100 rounded-t-xl">
                                  <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                                  <h4 className="font-semibold text-gray-800">
                                    Frais sélectionnés
                                  </h4>
                                </div>

                                <div className="w-full h-full mt-2 overflow-y-auto">
                                  <div className="flex items-center gap-6 p-4 mb-4 rounded-lg shadow-sm bg-gray-50">
                                    <label
                                      htmlFor="tvaRadio20"
                                      className="flex items-center cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        id="tvaRadio20"
                                        name="tvaRadio"
                                        value="20"
                                        checked={taxe == 20}
                                        onChange={() => {
                                          updatetaxe(20);
                                        }}
                                        className="w-5 h-5 text-purple-600 cursor-pointer form-radio accent-purple-600 focus:ring-purple-500 focus:outline-none"
                                      />
                                      <span className="ml-3 text-lg font-medium text-gray-700 select-none label-text">
                                        TVA 20%
                                      </span>
                                    </label>

                                    <label
                                      htmlFor="tvaRadio0"
                                      className="flex items-center cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        id="tvaRadio0"
                                        name="tvaRadio"
                                        value="0"
                                        checked={taxe == 0}
                                        onChange={() => {
                                          updatetaxe(0);
                                        }}
                                        className="w-5 h-5 text-purple-600 cursor-pointer form-radio accent-purple-600 focus:ring-purple-500 focus:outline-none"
                                      />
                                      <span className="ml-3 text-lg font-medium text-gray-700 select-none label-text">
                                        TVA 0%
                                      </span>
                                    </label>
                                  </div>

                                  <div className="p-4 mb-4 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
                                    <div className="flex items-center gap-2 mb-3">
                                      <DollarSign className="w-4 h-4 text-green-600" />
                                      <span className="font-medium text-gray-800">
                                        Résumé financier
                                      </span>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                          Total HT :
                                        </span>
                                        <span className="font-semibold text-gray-800">
                                          {parseInt(totalHt).toLocaleString(
                                            "fr-FR"
                                          )}{" "}
                                          {setting.currency_unit}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                        <span className="text-sm text-gray-600">
                                          Total TTC :
                                        </span>
                                        <span className="text-lg font-bold text-green-600">
                                          {parseInt(totalTtc).toLocaleString(
                                            "fr-FR"
                                          )}{" "}
                                          {setting.currency_unit}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {Array.isArray(costAdded) &&
                                  costAdded.length > 0 ? (
                                    costAdded.map((frais, index) => (
                                      <ul
                                        key={index}
                                        className="flex flex-row flex-wrap w-full gap-2 p-2 overflow-y-auto list-none select-list"
                                      >
                                        <ul id="fraisList">
                                          <li className="grid justify-between grid-cols-5 gap-2 px-3 py-2 duration-200 bg-white border border-gray-100 rounded-md cursor-pointer hover:bg-gray-50">
                                            <div className="col-span-4">
                                              <div className="inline-flex items-center gap-2">
                                                <div className="grid-cols-2 gap-0">
                                                  <div className="inline-flex items-center gap-3">
                                                    <h3 className="text-base font-semibold text-gray-700">
                                                      {frais.frais}
                                                    </h3>
                                                  </div>
                                                  <div className="grid col-span-1">
                                                    <div className="grid items-center grid-cols-2 px-2">
                                                      <span className="text-gray-400">
                                                        Coût:
                                                      </span>
                                                      <div className="inline-flex items-center justify-end gap-1">
                                                        <span className="font-medium text-right text-gray-600">
                                                          {" "}
                                                          {
                                                            setting?.currency_unit
                                                          }
                                                        </span>
                                                        <input
                                                          type="number"
                                                          onChange={(e) =>
                                                            handleFieldChange(
                                                              frais.idFraisProjet,
                                                              "montant",
                                                              e.target.value
                                                            )
                                                          }
                                                          placeholder={
                                                            frais.montant
                                                          }
                                                          className="flex h-10 pl-2 font-medium text-right text-gray-600 duration-200 bg-transparent border-b outline-none appearance-none coutFrais border-gray-50 hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                                                        />
                                                      </div>
                                                    </div>
                                                    <div className="grid items-center grid-cols-2 px-2">
                                                      <span className="text-gray-400">
                                                        Description:
                                                      </span>
                                                      <div className="inline-flex items-center justify-end gap-1">
                                                        <input
                                                          type="text"
                                                          onChange={(e) =>
                                                            handleFieldChange(
                                                              frais.idFraisProjet,
                                                              "description",
                                                              e.target.value
                                                            )
                                                          }
                                                          placeholder="Description"
                                                          maxLength={200}
                                                          className="flex h-10 pl-2 font-medium text-right text-gray-600 duration-200 bg-transparent border-b outline-none appearance-none descriptionFrais border-gray-50 hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div
                                              onClick={() =>
                                                fraisRemove(
                                                  "post",
                                                  id,
                                                  frais.idFraisProjet
                                                )
                                              }
                                              className="grid items-center justify-center col-span-1"
                                            >
                                              <div className="flex items-center justify-center w-10 h-10 duration-150 bg-red-100 rounded-full cursor-pointer icon hover:bg-red-50 group/icon">
                                                <Minus className="text-sm text-red-500 duration-150 group-hover/icon:text-red-600" />
                                              </div>
                                            </div>
                                          </li>
                                        </ul>
                                      </ul>
                                    ))
                                  ) : (
                                    <div className="px-4 py-4 text-center text-gray-500">
                                      Aucun frais ajouté pour ce projet.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Footer */}
                          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button
                              onClick={() => setDrawerFinancial(false)}
                              className="px-6 py-2 font-medium text-gray-600 transition-colors duration-200 rounded-lg hover:text-gray-800 hover:bg-gray-100"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={() => setDrawerFinancial(false)}
                              className="px-6 py-2 font-medium text-white transition-all duration-200 transform rounded-lg shadow-md bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:scale-105"
                            >
                              Enregistrer
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </span>
        </h2>
        {AfficheFinancier && (
          <div className="p-6 space-y-6">
            {/* Financing Type Card */}
            <div
              className={`bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5`}
            >
              <div className="flex items-center gap-3 mb-3">
                {getFinancementIcon(payment)}
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Mode de financement
                  </h3>
                  <p className="text-sm text-gray-600">
                    Type de prise en charge
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Financé par :</span>
                <span className="px-4 py-2 font-semibold text-gray-800 bg-white rounded-lg shadow-sm">
                  {payment}
                </span>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="p-5 border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-800">
                  Récapitulatif financier
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full">
                    <Receipt className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Base HT</p>
                  <p className="font-bold text-blue-600">
                    {parseInt(totalHt || 0).toLocaleString("fr-FR")}{" "}
                    {setting?.currency_unit}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-full">
                    <Percent className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-600">TVA</p>
                  <p className="font-bold text-orange-600">{taxe}</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-emerald-100">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-sm text-gray-600">Total TTC</p>
                  <p className="font-bold text-emerald-600">
                    {parseInt(totalTtc).toLocaleString("fr-FR")}{" "}
                    {setting?.currency_unit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
