import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import {
  Search,
  Users,
  Calendar,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
} from "lucide-react";
import axios from "../../../../config/axios";
// import axios from "../../../../config/axios";

export default function CreateCampaignCfp() {
  const [step, setStep] = useState(1);

  // ---- State global pour toutes les étapes ----
  const [campaignName, setCampaignName] = useState("");
  const [qcms, setQcms] = useState([]);
  const [selectedQcm, setSelectedQcm] = useState("");
  const [apprenants, setApprenants] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedApprenants, setSelectedApprenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnterprise, setSelectedEnterprise] = useState("");
  const [filteredApprenants, setFilteredApprenants] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [validFromInput, setValidFromInput] = useState("");
  const [validUntilInput, setValidUntilInput] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    show: false,
  });

  // ---- Step One : Campaign Name ----
  const handleCampaignNameChange = (e) => setCampaignName(e.target.value);
  const goStepOneNext = () => {
    if (!campaignName.trim()) return;
    setStep(2);
  };

  // ---- Step Two : QCM ----
  const fetchQcms = async () => {
    setIsLoading(true);
    const url = `/qcm/invitation/cfp/campaign/step-two`;

    try {
      const { data } = await axios.get(url);
      setQcms(data.qcms);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const goStepTwoNext = () => {
    if (!selectedQcm) return;
    setStep(3);
  };

  // ---- Step Three : Apprenants ----
  const fetchApprenants = async () => {
    setIsLoading(true);
    const url = `/qcm/invitation/cfp/campaign/step-three`;

    try {
      const { data } = await axios.get(url);
      setApprenants(data.employees);
      setCustomers(data.etps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Correction déplacement apprenants
  const handleAddApprenant = (apprenant) => {
    setSelectedApprenants((prev) => [...prev, apprenant]);

    setApprenants((prev) =>
      prev.filter((emp) => emp.idEmploye !== apprenant.idEmploye)
    );
  };

  const handleRemoveApprenant = (id) => {
    setSelectedApprenants((prevSelected) => {
      const apprenant = prevSelected.find((a) => a.idEmploye === id);
      if (!apprenant) return prevSelected;

      setApprenants((prevApprenants) => {
        // éviter les doublons
        if (
          !prevApprenants.some((emp) => emp.idEmploye === apprenant.idEmploye)
        ) {
          return [...prevApprenants, apprenant];
        }
        return prevApprenants;
      });

      return prevSelected.filter((a) => a.idEmploye !== id);
    });
  };

  const handleSearch = useCallback(
    debounce((searchValue, enterpriseValue = selectedEnterprise) => {
      const term = searchValue.toLowerCase();
      let results = apprenants;
      if (enterpriseValue) {
        results = results.filter((emp) => emp.idEtp == enterpriseValue);
      }
      if (term.length >= 2) {
        results = results.filter(
          (emp) =>
            (emp.emp_email && emp.emp_email.toLowerCase().includes(term)) ||
            (emp.emp_name && emp.emp_name.toLowerCase().includes(term)) ||
            (emp.emp_firstname &&
              emp.emp_firstname.toLowerCase().includes(term))
        );
      }
      if (term.length >= 2 || enterpriseValue) {
        setFilteredApprenants(results);
        setShowResults(true);
      } else {
        setShowResults(false);
        setFilteredApprenants([]);
      }
    }, 300),
    [apprenants, selectedEnterprise]
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, selectedEnterprise, handleSearch]);

  const apprenantsToDisplay = useMemo(() => {
    let results = apprenants;
    if (selectedEnterprise) {
      results = results.filter((emp) => emp.idEtp == selectedEnterprise);
    }
    if (searchTerm.length >= 2) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (emp) =>
          emp.emp_email?.toLowerCase().includes(term) ||
          emp.emp_name?.toLowerCase().includes(term) ||
          emp.emp_firstname?.toLowerCase().includes(term)
      );
    }
    return results;
  }, [apprenants, selectedEnterprise, searchTerm]);

  const goStepThreeNext = () => {
    if (selectedApprenants.length < 1) return;
    setStep(4);
  };

  // ---- Step Four : Validation ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        campaign_name: campaignName,
        idQCM: selectedQcm,
        selectedEmployees: selectedApprenants.map((a) => a.idEmploye),
        valid_from: validFromInput,
        valid_until: validUntilInput,
        custom_message: message,
      };
      const url = `qcm/invitation/cfp/campaign/create`;

      await axios.post(url, payload);

      setNotification({
        type: "success",
        message: "Campagne créée !",
        show: true,
      });
      setTimeout(
        () => setNotification({ type: "", message: "", show: false }),
        2000
      );
      setStep(1);
      setCampaignName("");
      setSelectedQcm("");
      setSelectedApprenants([]);
      setMessage("");
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: "Erreur lors de la création",
        show: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Lifecycle ----
  useEffect(() => {
    if (step === 2) fetchQcms();
    if (step === 3) fetchApprenants();
    if (step === 4) {
      const now = new Date();
      now.setHours(now.getHours() + 1, 0, 0, 0);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setValidFromInput(now.toISOString().slice(0, 16));
      setValidUntilInput(tomorrow.toISOString().slice(0, 16));
    }
  }, [step]);

  // ---- Progress Steps ----
  const steps = [
    { number: 1, title: "Campagne", icon: MessageSquare },
    { number: 2, title: "QCM", icon: Check },
    { number: 3, title: "Participants", icon: Users },
    { number: 4, title: "Finalisation", icon: Calendar },
  ];

  const ProgressIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {steps.map((stepItem, index) => {
        const Icon = stepItem.icon;
        const isActive = step >= stepItem.number;
        const isCurrent = step === stepItem.number;

        return (
          <div key={stepItem.number} className="flex items-center">
            <div
              className={`flex flex-col items-center ${
                index !== steps.length - 1 ? "mr-8" : ""
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isActive
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "border-gray-300 text-gray-400"
                } ${isCurrent ? "ring-4 ring-purple-200" : ""}`}
              >
                <Icon size={20} />
              </div>
              <span
                className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                  isActive ? "text-purple-600" : "text-gray-400"
                }`}
              >
                {stepItem.title}
              </span>
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mb-6 transition-colors duration-300 ${
                  step > stepItem.number ? "bg-purple-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <Check size={20} />
            {notification.message}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Créer une campagne d'invitation
            </h1>
            <p className="text-gray-600 text-lg">
              Configurez votre campagne en quelques étapes simples
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <ProgressIndicator />

            {/* Step One - Campaign Name */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Nommez votre campagne
                  </h2>
                  <p className="text-gray-600">
                    Choisissez un nom descriptif pour identifier facilement
                    votre campagne
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Nom de la campagne *
                    </label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={handleCampaignNameChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-lg"
                      placeholder="Ex: Formation React Q4 2024"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={goStepOneNext}
                    disabled={!campaignName.trim()}
                    className="w-full py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-lg"
                  >
                    Continuer
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step Two - QCM Selection */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Sélectionnez le QCM
                  </h2>
                  <p className="text-gray-600">
                    Choisissez le questionnaire que les participants devront
                    compléter
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-4">
                  {qcms.map((qcm) => (
                    <label
                      key={qcm.idQCM}
                      className={`block p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedQcm == qcm.idQCM
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          value={qcm.idQCM}
                          checked={selectedQcm == qcm.idQCM}
                          onChange={(e) => setSelectedQcm(e.target.value)}
                          className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {qcm.intituleQCM}
                          </h3>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex justify-between max-w-2xl mx-auto">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Précédent
                  </button>
                  <button
                    onClick={goStepTwoNext}
                    disabled={!selectedQcm}
                    className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                  >
                    Continuer
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step Three - Participants Selection */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Sélectionnez les participants
                  </h2>
                  <p className="text-gray-600">
                    Ajoutez les apprenants qui recevront l'invitation à ce QCM
                  </p>
                </div>

                {/* Search and Filter Controls */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Rechercher par nom ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                    />
                  </div>
                  <select
                    value={selectedEnterprise}
                    onChange={(e) => setSelectedEnterprise(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white"
                  >
                    <option value="">Toutes les entreprises</option>
                    {customers.map((customer) => (
                      <option key={customer.idEtp} value={customer.idEtp}>
                        {customer.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Available Participants */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Users size={20} />
                      Apprenants disponibles ({apprenantsToDisplay.length})
                    </h3>
                    <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 max-h-96 overflow-y-auto">
                      {apprenantsToDisplay.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          Aucun apprenant trouvé
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {apprenantsToDisplay.map((apprenant) => (
                            <div
                              key={apprenant.idEmploye}
                              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {apprenant.emp_firstname} {apprenant.emp_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {apprenant.emp_email}
                                </p>
                              </div>
                              <button
                                onClick={() => handleAddApprenant(apprenant)}
                                className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors duration-200"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Participants */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Check size={20} />
                      Participants sélectionnés ({selectedApprenants.length})
                    </h3>
                    <div className="border-2 border-purple-200 rounded-xl p-4 bg-purple-50 max-h-96 overflow-y-auto">
                      {selectedApprenants.length === 0 ? (
                        <p className="text-purple-600 text-center py-8">
                          Aucun participant sélectionné
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {selectedApprenants.map((apprenant) => (
                            <div
                              key={apprenant.idEmploye}
                              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {apprenant.emp_firstname} {apprenant.emp_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {apprenant.emp_email}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveApprenant(apprenant.idEmploye)
                                }
                                className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Précédent
                  </button>
                  <button
                    onClick={goStepThreeNext}
                    disabled={selectedApprenants.length === 0}
                    className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                  >
                    Continuer
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step Four - Final Details */}
            {step === 4 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Finaliser votre campagne
                  </h2>
                  <p className="text-gray-600">
                    Définissez la période de validité et ajoutez un message
                    personnalisé
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Campaign Summary */}
                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-4">
                      Résumé de la campagne
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Nom de la campagne :</p>
                        <p className="font-medium">{campaignName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">QCM sélectionné :</p>
                        <p className="font-medium">
                          {
                            qcms.find((q) => q.idQCM == selectedQcm)
                              ?.intituleQCM
                          }
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600">
                          Participants sélectionnés :
                        </p>
                        <p className="font-medium">
                          {selectedApprenants.length} apprenant(s)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Date inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date de début
                      </label>
                      <input
                        type="datetime-local"
                        value={validFromInput}
                        onChange={(e) => setValidFromInput(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date de fin
                      </label>
                      <input
                        type="datetime-local"
                        value={validUntilInput}
                        onChange={(e) => setValidUntilInput(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message personnalisé (optionnel)
                    </label>
                    <textarea
                      placeholder="Ajoutez un message personnalisé pour vos participants..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      onClick={() => setStep(3)}
                      type="button"
                      className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
                    >
                      <ArrowLeft size={20} />
                      Précédent
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 min-w-[140px] justify-center"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check size={20} />
                          Créer la campagne
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
