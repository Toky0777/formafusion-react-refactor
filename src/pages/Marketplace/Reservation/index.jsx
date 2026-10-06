import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, Trash2, UserPlus } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "../../../config/axios";
import { API_URL } from "../../../config/env";

// Validation des emails
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validation du téléphone malagasy
const isValidPhone = (phone) => {
  return /^(0|(\+261))\s?34\s\d{2}\s\d{3}\s\d{2}$/.test(phone);
};

// Composant d'alerte réutilisable
const AlertMessage = ({ type, message }) => (
  <div
    className={`p-4 rounded-lg mb-6 ${type === "success"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800"
      } flex items-center gap-2`}
  >
    {type === "success" ? (
      <CheckCircle className="w-5 h-5" />
    ) : (
      <AlertTriangle className="w-5 h-5" />
    )}
    <p>{message}</p>
  </div>
);

// Composant pour les champs de formulaire
const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
}) => (
  <label className="w-full">
    <div className="label">
      <span
        className={`label-text ${required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""
          }`}
      >
        {label}
      </span>
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500`}
      required={required}
    />
    <div className="label">
      <span className="text-red-500 label-text-alt">{error || ""}</span>
    </div>
  </label>
);

export default function ReservationForm() {
  const [searchParams] = useSearchParams();
  const { projectId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // État des données du formulaire
  const [formData, setFormData] = useState({
    responsable: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      fonction: "",
    },
    participants: [{ nom: "", prenom: "", email: "", fonction: "" }],
  });

  // État pour les erreurs de validation
  const [errors, setErrors] = useState({
    responsable: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      fonction: "",
    },
    participants: [{ nom: "", prenom: "", email: "", fonction: "" }],
  });

  // État pour les données de module
  const [moduleInfo, setModuleInfo] = useState({
    name: "Chargement...",
    dateRange: { begin: "", end: "" },
  });

  // État pour les notifications
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Vérifier les paramètres d'URL pour les notifications
    if (searchParams.get("success")) {
      setAlert({
        type: "success",
        message: "Réservation effectuée avec succès!",
      });
    } else if (searchParams.get("error")) {
      setAlert({
        type: "error",
        message:
          searchParams.get("message") || "Erreur lors de la réservation!",
      });
    }

    // Charger les détails du module
    fetchModuleDetails();
  }, [projectId, searchParams]);

  // Temporisateur pour les alertes
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Récupération des données du module depuis l'API
  const fetchModuleDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/marketplace/reservation/detail/${projectId}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des détails du module");
      }

      // Vérifier si la réponse contient du JSON
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Si ce n'est pas du JSON, obtenir le texte de la réponse
        const text = await response.text();
        // Utiliser des valeurs par défaut
        data = {
          moduleName: "Module non spécifié",
          dateDebut: "",
          dateFin: "",
        };
      }

      setModuleInfo({
        name: data.moduleName || "Module non spécifié",
        dateRange: {
          begin: data.dateDebut || "",
          end: data.dateFin || "",
        },
      });
    } catch (error) {
      setAlert({
        type: "error",
        message:
          "Impossible de charger les détails du module. Veuillez réessayer plus tard.",
      });
      // Utiliser des valeurs par défaut en cas d'erreur
      setModuleInfo({
        name: "Module non disponible",
        dateRange: { begin: "", end: "" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion des modifications du responsable
  const handleResponsableChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      responsable: {
        ...prev.responsable,
        [name]: value,
      },
    }));

    // Réinitialiser l'erreur lors de la modification
    setErrors((prev) => ({
      ...prev,
      responsable: {
        ...prev.responsable,
        [name]: "",
      },
    }));
  };

  // Gestion des modifications des participants
  const handleParticipantChange = (index, e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedParticipants = [...prev.participants];
      updatedParticipants[index] = {
        ...updatedParticipants[index],
        [name]: value,
      };
      return {
        ...prev,
        participants: updatedParticipants,
      };
    });

    // Réinitialiser l'erreur lors de la modification
    setErrors((prev) => {
      const updatedParticipants = [...prev.participants];
      if (updatedParticipants[index]) {
        updatedParticipants[index] = {
          ...updatedParticipants[index],
          [name]: "",
        };
      }
      return {
        ...prev,
        participants: updatedParticipants,
      };
    });
  };

  // Ajouter un participant
  const addParticipant = () => {
    setFormData((prev) => ({
      ...prev,
      participants: [
        ...prev.participants,
        { nom: "", prenom: "", email: "", fonction: "" },
      ],
    }));

    setErrors((prev) => ({
      ...prev,
      participants: [
        ...prev.participants,
        { nom: "", prenom: "", email: "", fonction: "" },
      ],
    }));
  };

  // Supprimer un participant
  const removeParticipant = (index) => {
    if (formData.participants.length > 1) {
      setFormData((prev) => {
        const updatedParticipants = [...prev.participants];
        updatedParticipants.splice(index, 1);
        return {
          ...prev,
          participants: updatedParticipants,
        };
      });

      setErrors((prev) => {
        const updatedParticipants = [...prev.participants];
        updatedParticipants.splice(index, 1);
        return {
          ...prev,
          participants: updatedParticipants,
        };
      });
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    let isValid = true;
    let newErrors = {
      responsable: {
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        fonction: "",
      },
      participants: [
        ...formData.participants.map(() => ({
          nom: "",
          prenom: "",
          email: "",
          fonction: "",
        })),
      ],
    };

    // Validation du responsable
    const resp = formData.responsable;

    if (!resp.nom.trim()) {
      newErrors.responsable.nom = "Le nom est requis";
      isValid = false;
    }

    if (!resp.prenom.trim()) {
      newErrors.responsable.prenom = "Le prénom est requis";
      isValid = false;
    }

    if (!resp.email.trim()) {
      newErrors.responsable.email = "L'email est requis";
      isValid = false;
    } else if (!isValidEmail(resp.email)) {
      newErrors.responsable.email = "Format d'email invalide";
      isValid = false;
    }

    if (!resp.telephone.trim()) {
      newErrors.responsable.telephone = "Le téléphone est requis";
      isValid = false;
    } else if (!isValidPhone(resp.telephone)) {
      newErrors.responsable.telephone = "Format de téléphone invalide";
      isValid = false;
    }

    if (!resp.fonction.trim()) {
      newErrors.responsable.fonction = "La fonction est requise";
      isValid = false;
    }

    // Validation des participants
    formData.participants.forEach((participant, index) => {
      if (!participant.nom.trim()) {
        newErrors.participants[index].nom = "Le nom est requis";
        isValid = false;
      }

      if (!participant.prenom.trim()) {
        newErrors.participants[index].prenom = "Le prénom est requis";
        isValid = false;
      }

      if (!participant.email.trim()) {
        newErrors.participants[index].email = "L'email est requis";
        isValid = false;
      } else if (!isValidEmail(participant.email)) {
        newErrors.participants[index].email = "Format d'email invalide";
        isValid = false;
      }

      if (!participant.fonction.trim()) {
        newErrors.participants[index].fonction = "La fonction est requise";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlert({
        type: "error",
        message: "Veuillez corriger les erreurs dans le formulaire.",
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      projectId: projectId,
      responsable: formData.responsable,
      participants: formData.participants,
    };

    try {
      const response = await axios.post(`/marketplace/reservation`, payload);
      const reservationId = response.data.data[0].reservation_id;

      setAlert({
        type: "success",
        message: response.data.message || "Réservation effectuée avec succès !",
      });

      resetForm();
      navigate(`/marketplace/reservation/recap/${reservationId}`);
    } catch (error) {
      const status = error.response?.status;

      const backendMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        null;

      if (status === 403) {
        setAlert({
          type: "error",
          message: backendMessage || "Accès non autorisé.",
        });
      } else if (status === 409) {
        setAlert({
          type: "error",
          message:
            backendMessage ||
            "Vous avez déjà effectué une réservation pour ce projet.",
        });
      } else {
        setAlert({
          type: "error",
          message:
            backendMessage ||
            error.message ||
            "Une erreur inconnue est survenue.",
        });
      }

      console.error("Erreur API :", error.response || error);
    } finally {
      setIsSubmitting(false);
    }
  };


  // Fonction utilitaire pour réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      responsable: {
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        fonction: "",
      },
      participants: [
        {
          nom: "",
          prenom: "",
          email: "",
          fonction: "",
        },
      ],
    });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-screen-md px-6 py-6 mx-auto my-16 text-center">
        <p className="text-lg">Chargement des détails du module...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-md px-6 py-6 mx-auto my-16 space-y-6 bg-white border rounded-lg shadow-md">
      {alert && <AlertMessage type={alert.type} message={alert.message} />}

      <div className="flex flex-col items-center py-4 bg-gray-800 rounded-lg">
        <p className="text-2xl font-semibold text-white">{moduleInfo.name}</p>
        <p className="mt-2 text-white">
          Du {moduleInfo.dateRange.begin} au {moduleInfo.dateRange.end}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <h2 className="pb-2 text-lg font-semibold uppercase border-b border-gray-200">
            Information du responsable
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField
              label="Nom"
              name="nom"
              value={formData.responsable.nom}
              onChange={handleResponsableChange}
              error={errors.responsable.nom}
              required
            />

            <FormField
              label="Prénom(s)"
              name="prenom"
              value={formData.responsable.prenom}
              onChange={handleResponsableChange}
              error={errors.responsable.prenom}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.responsable.email}
              onChange={handleResponsableChange}
              error={errors.responsable.email}
              required
            />

            <FormField
              label="Téléphone"
              name="telephone"
              value={formData.responsable.telephone}
              onChange={handleResponsableChange}
              error={errors.responsable.telephone}
              required
            />
          </div>

          <FormField
            label="Fonction"
            name="fonction"
            value={formData.responsable.fonction}
            onChange={handleResponsableChange}
            error={errors.responsable.fonction}
            required
          />
        </div>

        <div className="space-y-6">
          <h2 className="pb-2 text-lg font-semibold uppercase border-b border-gray-200">
            Participants
          </h2>

          {formData.participants.map((participant, index) => (
            <div
              key={index}
              className="p-4 space-y-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Participant {index + 1}</h3>
                {formData.participants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="p-1 text-red-500 transition-colors hover:text-red-700"
                    aria-label="Supprimer participant"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <FormField
                  label="Nom"
                  name="nom"
                  value={participant.nom}
                  onChange={(e) => handleParticipantChange(index, e)}
                  error={errors.participants[index]?.nom}
                  required
                />

                <FormField
                  label="Prénom(s)"
                  name="prenom"
                  value={participant.prenom}
                  onChange={(e) => handleParticipantChange(index, e)}
                  error={errors.participants[index]?.prenom}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={participant.email}
                  onChange={(e) => handleParticipantChange(index, e)}
                  error={errors.participants[index]?.email}
                  required
                />

                <FormField
                  label="Fonction"
                  name="fonction"
                  value={participant.fonction}
                  onChange={(e) => handleParticipantChange(index, e)}
                  error={errors.participants[index]?.fonction}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={addParticipant}
            className="flex items-center gap-2 rounded-xl border border-[#87388C] hover:bg-purple-50 text-[#87388C] px-4 py-2 transition-colors"
          >
            <UserPlus size={18} />
            Ajouter un participant
          </button>

          <button
            className="flex items-center gap-2 hover:bg-[#87388C]/80 text-white bg-[#87388C] px-4 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Traitement en cours..." : "Réserver ma place"}
          </button>
        </div>
      </form>
    </div>
  );
}
