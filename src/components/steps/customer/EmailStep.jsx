import axios from "../../../config/axios";
import { useState, useEffect } from "react";
import ButtonSecondary from "../../ui/button-secondary";
import ButtonAdd from "../../ui/button-add";

export default function EmailStepCustomer({
  customerData,
  updateCustomerData,
  onPrevious,
  onNext,
}) {
  const [email, setEmail] = useState(customerData?.email || "");
  const [emailError, setEmailError] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [hasCheckedEmail, setHasCheckedEmail] = useState(false);

  // Validation de l'email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Vérification de l'email via l'API
  const checkEmailAvailability = async (email) => {
    if (!validateEmail(email)) {
      setEmailExists(false);
      setHasCheckedEmail(false);
      return;
    }

    setIsCheckingEmail(true);

    try {
      const response = await axios.post("auth/check-email", { email });

      // Supposons que l'API retourne { exists: true/false }
      setEmailExists(response.data);
      setHasCheckedEmail(true);

      // Mettre à jour les données partagées
      updateCustomerData({
        email,
        emailExists: response.data,
      });
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      setEmailError("Erreur lors de la vérification de l'email");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Debounce pour la vérification de l'email
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (email && validateEmail(email)) {
        checkEmailAvailability(email);
      } else {
        setHasCheckedEmail(false);
        setEmailExists(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [email]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setHasCheckedEmail(false);

    // Validation de base
    if (value && !validateEmail(value)) {
      setEmailError("Format d'email invalide");
    } else {
      setEmailError("");
    }

    updateCustomerData({ email: value });
  };

  const handleSubmit = () => {
    if (!email.trim()) {
      setEmailError("L'email est requis");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Format d'email invalide");
      return;
    }

    if (!hasCheckedEmail || isCheckingEmail) {
      setEmailError("Vérification de l'email en cours");
      return;
    }

    onNext();
  };

  const canSubmit =
    email.trim() &&
    validateEmail(email) &&
    !emailError &&
    hasCheckedEmail &&
    emailExists &&
    !isCheckingEmail;

  return (
    <div className="space-y-6">
      {/* Formulaire email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Adresse email de contact
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className={`w-full px-2 py-2 border shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              emailError
                ? "border-red-300 focus:border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
            placeholder="exemple@entreprise.com"
          />
          {isCheckingEmail && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Messages d'état */}
        <div className="mt-2 space-y-1">
          {/* Message d'erreur */}
          {emailError && (
            <div className="flex items-center text-red-600 text-sm">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {emailError}
            </div>
          )}

          {/* Email valide */}
          {email &&
            validateEmail(email) &&
            !emailError &&
            hasCheckedEmail &&
            !emailExists && (
              <div className="flex items-center text-red-600 text-sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Cet email est déjà associé à un compte
              </div>
            )}

          {/* Email déjà utilisé */}
          {hasCheckedEmail && emailExists && (
            <div className="flex items-center text-green-600 text-sm">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Email valide
            </div>
          )}
        </div>
      </div>

      {/* Boutons de navigation */}
      <div className="flex justify-between pt-6">
        <ButtonSecondary onClick={onPrevious}>Précédent</ButtonSecondary>

        <ButtonAdd onClick={handleSubmit} disabled={!canSubmit}>
          Suivant
        </ButtonAdd>
      </div>
    </div>
  );
}
