import { useState } from "react";
import {
  User2,
  Mail,
  Phone,
  Briefcase,
  FileText,
  MapPin,
  Send,
  AlertCircle,
} from "lucide-react";
import axios from "../../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const Individual = () => {
  const { idModule } = useParams();
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    professionalStatus: "",
    madality: 1,
    startDate: "",
    endDate: "",
    location: "",
    notes: "",
  });

  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    timeOut: "3000",
  };

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email doit être valide";
    }

    if (!formData.professionalStatus) {
      newErrors.professionalStatus = "La situation professionnelle est requise";
    }

    if (!formData.startDate) {
      newErrors.startDate = "La date de début est requise";
    }

    if (!formData.endDate) {
      newErrors.endDate = "La date de fin est requise";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (/^[+]?[0-9 ]{8,20}$/.test(formData.phone)) {
      newErrors.phone = "Numéro de téléphone invalide";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.endDate = "La date de fin doit être après la date de début";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = { ...formData, idModule };
      const response = await axios.post("/quote/individual", payload);

      if (response.status === 200 && response.data.success) {
        toastr.success("Demande de devis envoyée avec succès");
        setFormData({
          lastName: "",
          firstName: "",
          email: "",
          phone: "",
          professionalStatus: "",
          startDate: "",
          endDate: "",
          location: "",
          notes: "",
          madality: 1,
        });
      } else {
        toastr.error("Erreur lors de l'envoi de la demande");
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toastr.error("Une erreur est survenue");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <User2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Demande de formation individuelle
              </h1>
            </div>
            <p className="text-blue-50 ml-11">
              Merci de remplir les informations ci-dessous
            </p>
          </div>

          <div className="px-8 py-4">
            <button
              type="button"
              onClick={() => navigate(-1)} // <- Retour à la page précédente
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            >
              ← Retour
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-8 space-y-6 py-2">
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <User2 className="w-5 h-5 text-blue-600" />
                Vos informations
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Nom */}
                <div>
                  <label className="block text-sm mb-2">Nom *</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.lastName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Prénom */}
                <div>
                  <label className="block text-sm mb-2">Prénom *</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.firstName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {/* Email */}
                <div>
                  <label className="block text-sm mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                        errors.email
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                  </div>

                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm mb-2">Téléphone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ex : 034 12 345 67"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                        errors.phone
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                  </div>

                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Situation pro */}
              <div className="mt-4">
                <label className="block text-sm mb-2">
                  Situation professionnelle *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <select
                    name="professionalStatus"
                    value={formData.professionalStatus}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                      errors.professionalStatus
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="salarie">Salarié</option>
                    <option value="independant">Indépendant</option>
                    <option value="etudiant">Étudiant</option>
                    <option value="demandeur_emploi">Demandeur d’emploi</option>
                  </select>
                </div>
                {errors.professionalStatus && (
                  <p className="text-red-600 text-sm mt-1 flex gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.professionalStatus}
                  </p>
                )}
              </div>
            </section>

            {/* ================= FORMATION ================= */}
            <section className="border-t pt-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                Détails de la formation
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Date début *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.startDate
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">Date fin *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.endDate
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {/* Modalité */}
                <div>
                  <label className="block text-sm mb-2">Modalité </label>
                  <select
                    name="modality"
                    value={formData.modality}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.modality
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="1">Présentielle</option>
                    <option value="2">En ligne</option>
                    <option value="3">Blended</option>
                  </select>
                  {errors.modality && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.modality}
                    </p>
                  )}
                </div>

                {/* Lieu */}
                <div>
                  <label className="block text-sm mb-2">
                    Lieu de formation
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      name="location"
                      placeholder="Lieu de formation"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                        errors.location
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ================= NOTES ================= */}
            <section className="border-t pt-6">
              <label className="block text-sm mb-2">Notes</label>
              <textarea
                name="notes"
                rows={5}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Décrivez vos besoins ou attentes..."
              />
            </section>

            {/* ================= SUBMIT ================= */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Individual;
