import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Sparkles,
  GraduationCap,
  BookOpen,
  Users,
} from "lucide-react";
import { authService } from "../services/authService";
import { useApiAuth } from "../hooks/useApiAuth";
import StepHeader from "../components/steps/StepHeader";
import ProgressBar from "../components/ui/ProgressBar";
import NavigationButtons from "../components/ui/NavigationButtons";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import EmailStep from "../components/steps/EmailStep";
import AccountTypeStep from "../components/steps/AccountTypeStep";
import GeneralInfoStep from "../components/steps/GeneralInfoStep";
import AdminStep from "../components/steps/AdminStep";
import ConfirmationStep from "../components/steps/ConfirmationStep";
import { Link, useNavigate } from "react-router-dom";

const Register = ({ onLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepAnimation, setStepAnimation] = useState("fade-in");
  const navigate = useNavigate();
  const [particles, setParticles] = useState([]);
  const { execute } = useApiAuth();
  const [formData, setFormData] = useState({
    email: "",
    accountType: "",
    subAccountType: "",
    entityName: "",
    firstName: "",
    lastName: "",
    password: "",
    phone: "",
    adminFirstName: "",
    adminLastName: "",
    adminFunction: "",
    acceptTerms: false,
  });
  const [validations, setValidations] = useState({
    email: { isValid: false, message: "" },
    entityName: { isValid: false, message: "" },
    firstName: { isValid: false, message: "" },
    lastName: { isValid: false, message: "" },
    password: { isValid: false, message: "" },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Initialize floating particles
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
        icon: [GraduationCap, BookOpen, Users, Sparkles][
          Math.floor(Math.random() * 4)
        ],
      });
    }
    setParticles(newParticles);
  }, []);

  // Step change animation
  const changeStep = (newStep) => {
    setStepAnimation("fade-out");
    setTimeout(() => {
      setCurrentStep(newStep);
      setStepAnimation("fade-in");
    }, 150);
  };

  // Email validation with animation
  const validateEmail = async (email) => {
    setIsLoading(true);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidFormat = emailRegex.test(email);

      if (!isValidFormat) {
        setValidations((prev) => ({
          ...prev,
          email: {
            isValid: false,
            message: "Format d'email invalide",
          },
        }));
        return;
      }

      const result = await execute(() =>
        authService.checkEmailAvailability(email)
      );

      setValidations((prev) => ({
        ...prev,
        email: {
          isValid: result.available,
          message: result.available ? "Email validé ✨" : result.message,
        },
      }));
    } catch (error) {
      setValidations((prev) => ({
        ...prev,
        email: {
          isValid: false,
          message: "Erreur lors de la vérification de l'email",
        },
      }));
    }
    setIsLoading(false);
  };

  // Entity name validation with animation
  const validateEntityName = async (name, fieldType = "entityName") => {
    if (!name.trim()) return;

    setIsLoading(true);

    try {
      if (name.length < 2) {
        setValidations((prev) => ({
          ...prev,
          [fieldType]: {
            isValid: false,
            message: "Le nom doit contenir au moins 2 caractères",
          },
        }));
        setIsLoading(false);
        return;
      }

      // Pour les particuliers, on valide juste la longueur
      if (formData.accountType === "particulier") {
        setValidations((prev) => ({
          ...prev,
          [fieldType]: {
            isValid: true,
            // message: 'Valide ✨'
          },
        }));
        setIsLoading(false);
        return;
      }

      // Pour les centres et entreprises, on vérifie la disponibilité
      const result = await execute(() =>
        authService.checkEntityNameAvailability(name, formData.accountType)
      );

      setValidations((prev) => ({
        ...prev,
        [fieldType]: {
          isValid: result.available,
          message: result.available ? "Nom validé ✨" : result.message,
        },
      }));
    } catch (error) {
      setValidations((prev) => ({
        ...prev,
        [fieldType]: {
          isValid: false,
          message: "Erreur lors de la vérification",
        },
      }));
    }
    setIsLoading(false);
  };

  // Password validation with animation
  const validatePassword = (password) => {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isValid =
      hasLength && hasUpper && hasLower && hasNumber && hasSpecial;

    setValidations((prev) => ({
      ...prev,
      password: {
        isValid,
        message: isValid
          ? "Mot de passe sécurisé 🔐"
          : "Le mot de passe doit contenir 8+ caractères, majuscules, minuscules, chiffres et caractères spéciaux",
      },
    }));
  };

  // Validation effects
  useEffect(() => {
    if (formData.email) {
      const timer = setTimeout(() => validateEmail(formData.email), 500);
      return () => clearTimeout(timer);
    }
  }, [formData.email]);

  useEffect(() => {
    if (formData.entityName) {
      const timer = setTimeout(
        () => validateEntityName(formData.entityName),
        500
      );
      return () => clearTimeout(timer);
    }
  }, [formData.entityName]);

  useEffect(() => {
    if (formData.firstName && formData.accountType === "particulier") {
      const timer = setTimeout(
        () => validateEntityName(formData.firstName, "firstName"),
        500
      );
      return () => clearTimeout(timer);
    }
  }, [formData.firstName, formData.accountType]);

  useEffect(() => {
    if (formData.lastName && formData.accountType === "particulier") {
      const timer = setTimeout(
        () => validateEntityName(formData.lastName, "lastName"),
        500
      );
      return () => clearTimeout(timer);
    }
  }, [formData.lastName, formData.accountType]);
  useEffect(() => {
    if (formData.password) {
      validatePassword(formData.password);
    }
  }, [formData.password]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Adresse e-mail";
      case 2:
        return "Type de compte";
      case 3:
        return "Informations générales";
      case 4:
        return formData.accountType === "particulier"
          ? "Confirmation"
          : "Administrateur principal";
      case 5:
        return "Confirmation";
      default:
        return "";
    }
  };

  const getEntityLabel = () => {
    if (formData.accountType === "centre") return "Nom du centre de formation";
    return "Nom de l'entreprise";
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return validations.email.isValid;
      case 2:
        return (
          formData.accountType &&
          (formData.accountType !== "entreprise" || formData.subAccountType)
        );
      case 3:
        if (formData.accountType === "particulier") {
          return (
            validations.firstName.isValid &&
            validations.lastName.isValid &&
            validations.password.isValid &&
            formData.phone
          );
        }
        return (
          validations.entityName.isValid &&
          validations.password.isValid &&
          formData.phone
        );
      case 4:
        if (formData.accountType === "particulier") return formData.acceptTerms;
        return (
          formData.adminFirstName &&
          formData.adminLastName &&
          formData.adminFunction
        );
      case 5:
        return formData.acceptTerms;
      default:
        return true;
    }
  };

  const getMaxSteps = () => {
    return formData.accountType === "particulier" ? 4 : 5;
  };

  const handleCreateAccount = async () => {
    setSubmitLoading(true);

    try {
      const accountData = {
        ...formData,
        // Pour les particuliers, on combine prénom et nom dans entity_name
        ...(formData.accountType === "particulier" && {
          entity_name: `${formData.firstName} ${formData.lastName}`.trim(),
        }),
      };

      const result = await execute(() =>
        authService.createAccount(accountData)
      );

      const { status, user, profilCfp, type_customer, user_type } = result.data;

      if (status == 200) {
        const userWithType = {
          ...user,
          type_customer: type_customer || user.type_customer || 1,
        };
        localStorage.setItem("token", result.data.token);

        // Appeler onLogin AVANT la navigation
        onLogin?.(userWithType, profilCfp || userWithType);
        // Redirect based on account type
        let redirectUrl;
        if (user_type === "superAdminCfp") {
          redirectUrl = "/cfp";
        } else if (user_type === "superAdminEtp") {
          redirectUrl = "/etp";
        } else if (user_type === "particular") {
          redirectUrl = "/particulier";
        }

        setTimeout(() => {
          navigate(redirectUrl);
        }, 100);
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      alert(
        "❌ Une erreur est survenue lors de la création du compte. Veuillez réessayer."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      validations,
      isLoading,
      stepAnimation,
      handleInputChange,
      getEntityLabel,
    };

    switch (currentStep) {
      case 1:
        return <EmailStep {...stepProps} />;
      case 2:
        return <AccountTypeStep {...stepProps} />;
      case 3:
        return <GeneralInfoStep {...stepProps} />;
      case 4:
        if (formData.accountType === "particulier") {
          return (
            <ConfirmationStep {...stepProps} getEntityLabel={getEntityLabel} />
          );
        }
        return <AdminStep {...stepProps} />;
      case 5:
        return (
          <ConfirmationStep {...stepProps} getEntityLabel={getEntityLabel} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50">
      <AnimatedBackground particles={particles} />

      <div className="relative w-full max-w-lg p-8 border shadow-2xl bg-white/70 backdrop-blur-xl rounded-3xl border-white/20 shadow-purple-100/50">
        {/* Back to home button */}
        <Link
          to="/"
          className="flex text-gray-400 transition-all duration-200 hover:text-blue-600"
        >
          {" "}
          <ChevronLeft></ChevronLeft> Retour à l'accueil
        </Link>

        <StepHeader />

        <ProgressBar
          currentStep={currentStep}
          maxSteps={getMaxSteps()}
          stepTitle={getStepTitle()}
        />

        {/* Step Content */}
        <div className="mb-8 min-h-[400px]">{renderCurrentStep()}</div>

        <NavigationButtons
          currentStep={currentStep}
          maxSteps={getMaxSteps()}
          canProceedToNext={canProceedToNext()}
          submitLoading={submitLoading}
          onPrevious={() => changeStep(Math.max(1, currentStep - 1))}
          onNext={() => changeStep(currentStep + 1)}
          onCreateAccount={handleCreateAccount}
        />

        {/* Footer */}
        <div className="pt-6 mt-8 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Déjà un compte ?
            <Link
              to="/login"
              className="ml-1 font-semibold text-purple-600 transition-all duration-200 hover:text-purple-700 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
