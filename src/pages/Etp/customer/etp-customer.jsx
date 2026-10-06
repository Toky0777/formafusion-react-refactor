import { useEffect, useState, useCallback } from "react";
import CustomerCard from "../../../components/card/CustomerCard";
import customerService from "../../../services/cfp/customer/customerService";
import DrawerAddCfp from "../../../components/drawer/customer/entreprises/add-cfp";
import {
  inviteCentreDeFormation,
  inviteNewCentreDeFormation,
} from "../../../services/cfp/customer/addCustomerService";
import axios from "../../../config/axios";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import { ArrowRight, Loader2, Plus, Save } from "lucide-react";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import ButtonPrimary from "../../../components/button/ButtonPrimary";
import { IMAGE_URL } from "../../../config/env";

export default function EtpCustomer() {
  const endpoint = IMAGE_URL;

  const [submittingInviteNew, setSubmittingInviteNew] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [invitingCustomer, setInvitingCustomer] = useState(null);
  const [selectedFromSuggestion, setSelectedFromSuggestion] = useState(false);

  // États pour la vérification d'email
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [hasCheckedEmail, setHasCheckedEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailDebounceTimeout, setEmailDebounceTimeout] = useState(null);

  // États pour la vérification du nom
  const [nameExists, setNameExists] = useState(false);
  const [nameWarning, setNameWarning] = useState("");

  const totalSteps = 2;

  const fetchCustomer = async () => {
    try {
      const res = await customerService.getAllCfp();
      setCustomers(res.cfps);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchSuggestions = useCallback(async (name) => {
    if (!name || name.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const response = await customerService.getCfpByName(name);

      if (response.status === 200) {
        setSuggestions(
          response.customers.filter(
            (c) => c.is_customer_in_collaboration !== true
          )
        );
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  // Fonction de validation d'email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Fonction de vérification de disponibilité d'email
  const checkEmailAvailability = async (email) => {
    if (!validateEmail(email)) {
      setEmailExists(false);
      setHasCheckedEmail(false);
      setEmailError("");
      return;
    }

    setIsCheckingEmail(true);
    setEmailError("");

    try {
      const response = await axios.post("auth/check-email", { email });

      // Supposons que l'API retourne { exists: true/false }
      setEmailExists(response.data);
      setHasCheckedEmail(true);

      // Mettre à jour les données partagées
      setCustomerData((prev) => ({
        ...prev,
        email,
        emailExists: response.data,
      }));
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      setEmailError("Erreur lors de la vérification de l'email");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Fonction de vérification du nom dans les customers existants
  const checkNameInCustomers = (name) => {
    if (!name || name.trim().length < 2) {
      setNameExists(false);
      setNameWarning("");
      return;
    }

    const trimmedName = name.trim().toLowerCase();
    const existingCustomer = customers.find(
      (customer) =>
        customer.cfp_name && customer.cfp_name.toLowerCase() === trimmedName
    );

    if (existingCustomer) {
      setNameExists(true);
      setNameWarning(
        `Ce nom existe déjà dans vos clients (${existingCustomer.cfp_name})`
      );
    } else {
      setNameExists(false);
      setNameWarning("");
    }
  };

  // Debounced email check
  const debouncedEmailCheck = useCallback(
    (email) => {
      if (emailDebounceTimeout) {
        clearTimeout(emailDebounceTimeout);
      }

      const timeout = setTimeout(() => {
        checkEmailAvailability(email);
      }, 500);

      setEmailDebounceTimeout(timeout);
    },
    [emailDebounceTimeout]
  );

  const debouncedSearch = useCallback(
    (name) => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      const timeout = setTimeout(() => {
        fetchSuggestions(name);
      }, 300);

      setDebounceTimeout(timeout);
    },
    [debounceTimeout, fetchSuggestions]
  );

  const handleNameChange = (value) => {
    setCustomerData((prev) => ({ ...prev, name: value }));
    debouncedSearch(value);
    setSelectedFromSuggestion(false);

    // Vérifier si le nom existe déjà dans les customers
    checkNameInCustomers(value);
  };
  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setCurrentStep(1);
    setCustomerData({ name: "", email: "" });
    setSuggestions([]);
    setSelectedFromSuggestion(false);

    setIsCheckingEmail(false);
    setEmailExists(false);
    setHasCheckedEmail(false);
    setEmailError("");

    setNameExists(false);
    setNameWarning("");

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    if (emailDebounceTimeout) {
      clearTimeout(emailDebounceTimeout);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCustomerData((prev) => ({
      ...prev,
      name: suggestion.customer_name,
      email: suggestion.customer_email || "",
    }));
    setSuggestions([]);
    setSelectedFromSuggestion(true);

    // Vérifier le nom sélectionné
    checkNameInCustomers(suggestion.customer_name);
  };

  const handleInviteCustomer = async (suggestion) => {
    if (!suggestion.idCustomer) return;

    setInvitingCustomer(suggestion.idCustomer);
    try {
      const response = await inviteCentreDeFormation(suggestion.idCustomer);

      if (response && response.status === 200) {
        setSuggestions((prev) =>
          prev.filter((s) => s.idCustomer !== suggestion.idCustomer)
        );
        handleCloseDrawer();
        await fetchCustomer();
        toastr.success(response.data.message);
      } else {
        toastr.error(response.data.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'invitation:", error);
    } finally {
      setInvitingCustomer(null);
    }
  };

  const handleDeleteCfp = async (idCfp) => {
    try {
      const res = await customerService.deleteCentreDeFormation(idCfp);

      if (res.status === 200) {
        setCustomers((prev) => prev.filter((c) => c.idCfp !== idCfp));
        toastr.success(res.message);
      } else {
        toastr.error(res.message);
      }
    } catch (error) {
      toastr.error(error.response.data.message);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setSuggestions([]);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return customerData.name.trim().length >= 2;
      case 2:
        return (
          customerData.email.trim().length > 0 &&
          validateEmail(customerData.email) &&
          hasCheckedEmail &&
          !isCheckingEmail &&
          !emailError
        );
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setSubmittingInviteNew(true);
    try {
      const res = await inviteNewCentreDeFormation(
        customerData.name,
        customerData.email
      );
      if (res.status === 200) {
        handleCloseDrawer();
        await fetchCustomer();
        toastr.success(res.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
    } finally {
      setSubmittingInviteNew(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Étape 1 : Nom
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Commencez par saisir le nom du centre de formation
              </p>
            </div>

            <div className="relative">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nom <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={customerData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="block w-full px-4 py-3 text-lg border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all"
                  placeholder="test"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              <div className="mt-2 min-h-[1.25rem]">
                {nameWarning && (
                  <p className="text-sm text-orange-600"> {nameWarning}</p>
                )}

                {customerData.name.length >= 2 &&
                  !nameExists &&
                  !nameWarning && (
                    <p className="text-sm text-green-600"> Nom valide</p>
                  )}
              </div>
              {(suggestions.length > 0 || loadingSuggestions) &&
                !nameExists && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-64 overflow-auto">
                    {loadingSuggestions ? (
                      <div className="px-4 py-3 text-sm text-gray-500 flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                        Recherche en cours...
                      </div>
                    ) : (
                      <div className="py-2">
                        <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                          Centres de formation trouvés
                        </div>
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div
                                className="flex-1 cursor-pointer"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                              >
                                <div className="font-medium text-gray-800">
                                  {suggestion.customer_name}
                                </div>
                                {suggestion.customer_email && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    {suggestion.customer_email}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => handleInviteCustomer(suggestion)}
                                disabled={
                                  invitingCustomer === suggestion.idCustomer
                                }
                                className="ml-3 px-3 py-1.5 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                              >
                                {invitingCustomer === suggestion.idCustomer ? (
                                  <span className="flex items-center">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-white mr-1"></div>
                                    Invitation...
                                  </span>
                                ) : (
                                  <span>Inviter</span>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Étape 2: Email du CFP
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Maintenant, saisissez l'adresse email du contact
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">
                    Nom confirmé: {customerData.name}
                  </p>
                  {selectedFromSuggestion && (
                    <p className="text-xs text-blue-600 mt-1">
                      ✨ Sélectionné depuis les suggestions
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email du CFP <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={customerData.email}
                  onChange={(e) => {
                    const email = e.target.value;
                    setCustomerData((prev) => ({ ...prev, email }));
                    setHasCheckedEmail(false);
                    setEmailError("");
                    debouncedEmailCheck(email);
                  }}
                  className="block w-full px-4 py-3 text-lg border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="exemple@cfp.com"
                  autoFocus
                />
              </div>

              {/* Messages de statut */}
              <div className="mt-2 mb-5 min-h-[1.25rem]">
                {isCheckingEmail && (
                  <p className="text-sm text-blue-600 flex items-center">
                    <span className="animate-spin rounded-full h-3 w-3 border-b border-blue-500 mr-2"></span>
                    Vérification de la disponibilité...
                  </p>
                )}

                {emailError && (
                  <p className="text-sm text-red-600"> {emailError}</p>
                )}

                {customerData.email.length > 0 &&
                  !validateEmail(customerData.email) &&
                  !isCheckingEmail && (
                    <p className="text-sm text-red-600">
                      Veuillez saisir une adresse email valide
                    </p>
                  )}

                {hasCheckedEmail &&
                  !isCheckingEmail &&
                  !emailError &&
                  validateEmail(customerData.email) && (
                    <p
                      className={`text-sm ${
                        emailExists ? "text-green-600" : "text-orange-600"
                      }`}
                    >
                      {emailExists ? (
                        <> Email valide</>
                      ) : (
                        <> Cet email existe déjà dans le système</>
                      )}
                    </p>
                  )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      ) : customers?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-gray-500 mb-4">Aucun client trouvé</div>
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-6">
            <ButtonPrimary onClick={() => setShowDrawer(true)}>
              <Plus />
              Nouveau
            </ButtonPrimary>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customers?.map((c) => (
              <CustomerCard
                data={c}
                account="etp"
                handleDelete={() => handleDeleteCfp(c.idCfp)}
              />
            ))}
          </div>
        </div>
      )}

      {showDrawer && (
        <DrawerAddCfp
          isOpen={showDrawer}
          onClose={handleCloseDrawer}
          onSubmit={currentStep === totalSteps ? handleSubmit : handleNextStep}
          title={`Ajouter un nouveau CFP - ${currentStep}/${totalSteps}`}
        >
          <div className="min-h-[400px] flex flex-col">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">
                  Étape {currentStep} sur {totalSteps}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step content */}
            <div className="flex-1">{renderStepContent()}</div>

            {/* Navigation buttons */}
            <div className="flex justify-between pt-6 mt-auto border-t border-gray-200">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={
                    currentStep === totalSteps ? handleSubmit : handleNextStep
                  }
                  disabled={
                    submittingInviteNew ||
                    (currentStep === totalSteps
                      ? !canProceedToNextStep() ||
                        (hasCheckedEmail && !emailExists)
                      : !canProceedToNextStep() || nameExists)
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center disabled:cursor-not-allowed transition-colors"
                >
                  {submittingInviteNew ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : currentStep === totalSteps ? (
                    <Save size={18} />
                  ) : (
                    <ArrowRight size={18} />
                  )}
                  <span className="ml-2 text-sm font-medium">
                    {submittingInviteNew
                      ? "Ajout en cours..."
                      : currentStep === totalSteps
                      ? "Ajouter le CFP"
                      : "Suivant"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </DrawerAddCfp>
      )}
    </div>
  );
}
