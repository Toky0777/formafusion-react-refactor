import { useState } from "react";
import {
  Building2,
  User,
  MapPin,
  FileText,
  Send,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../config/axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const Company = () => {
  const { idModule } = useParams();
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    contactLastName: "",
    contactFirstName: "",
    projectType: "1",
    modality: "1",
    learnerCount: "",
    fundingType: "1",
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

  const FIELD_LABELS = {
    companyName: "Nom de l'entreprise",
    companyEmail: "Email",
    companyPhone: "Téléphone",
    contactLastName: "Nom du responsable",
    projectType: "Type de projet",
    learnerCount: "Nombre d'apprenants",
    fundingType: "Type de financement",
    startDate: "Date de début",
    endDate: "Date de fin",
    location: "Lieu de formation",
    notes: "Commentaires",
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) newErrors.companyName = "Nom requis";
    if (!formData.companyEmail.trim()) newErrors.companyEmail = "Email requis";
    if (!formData.companyPhone.trim())
      newErrors.companyPhone = "Téléphone requis";
    if (!formData.contactLastName.trim())
      newErrors.contactLastName = "Nom du responsable requis";
    if (!formData.startDate) newErrors.startDate = "Date de début requise";
    if (!formData.endDate) newErrors.endDate = "Date de fin requise";
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.endDate = "La date de fin doit être après la date de début";
    }
    if (!formData.projectType) newErrors.projectType = "Type de projet requis";
    if (!formData.modality) newErrors.modality = "Modalité requise";
    if (!formData.learnerCount)
      newErrors.learnerCount = "Nombre d'apprenants requis";
    if (!formData.fundingType)
      newErrors.fundingType = "Type de financement requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = { ...formData, idModule };
      const response = await axios.post("/quote/company", payload);

      if (response.status === 200 && response.data.success) {
        toastr.success("Demande de devis envoyée avec succès");
        setFormData({
          companyName: "",
          companyEmail: "",
          companyPhone: "",
          contactLastName: "",
          contactFirstName: "",
          projectType: "1",
          modality: "1",
          learnerCount: "",
          fundingType: "1",
          startDate: "",
          endDate: "",
          location: "",
          notes: "",
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
      <div className="mx-auto">
        <div className="bg-white rounded-2xl shadow-xl pb-2 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-10">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Quelques mots pour mieux vous connaître
              </h1>
            </div>
            <p className="text-blue-50 ml-11">
              Remplissez le formulaire pour votre demande de formation en
              entreprise
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

          <form onSubmit={handleSubmit} className="px-8 space-y-8">
            {/* Infos entreprise */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Building2 className="w-5 h-5 text-blue-600" />
                Informations de l'entreprise
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">
                    Nom de l'entreprise *
                  </label>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.companyName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.companyName && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">
                      Email entreprise *
                    </label>
                    <input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.companyEmail
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.companyEmail && (
                      <p className="text-red-600 text-sm mt-1 flex gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.companyEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Téléphone *</label>
                    <input
                      name="companyPhone"
                      value={formData.companyPhone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        errors.companyPhone
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.companyPhone && (
                      <p className="text-red-600 text-sm mt-1 flex gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.companyPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Responsable */}
            <section className="border-t pt-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <User className="w-5 h-5 text-blue-600" />
                Responsable du projet
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Nom */}
                <div>
                  <label className="block text-sm mb-2">Nom *</label>
                  <input
                    name="contactLastName"
                    value={formData.contactLastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.contactLastName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.contactLastName && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.contactLastName}
                    </p>
                  )}
                </div>

                {/* Prénom */}
                <div>
                  <label className="block text-sm mb-2">Prénom *</label>
                  <input
                    name="contactFirstName"
                    value={formData.contactFirstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.contactFirstName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
            </section>

            {/* Formation */}
            <section className="border-t pt-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                Détails de la formation
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Type de projet */}
                <div>
                  <label className="block text-sm mb-2">Type de projet *</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.projectType
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="1">Intra</option>
                    <option value="2">Inter</option>
                  </select>
                  {errors.projectType && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.projectType}
                    </p>
                  )}
                </div>

                {/* Modalité */}
                <div>
                  <label className="block text-sm mb-2">Modalité *</label>
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
                    <option value="">-- Sélectionner --</option>
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

                {/* Nombre d’apprenants */}
                <div>
                  <label className="block text-sm mb-2">
                    Nombre d'apprenants *
                  </label>
                  <input
                    type="number"
                    name="learnerCount"
                    value={formData.learnerCount}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.learnerCount
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Nombre d'apprenants"
                  />
                  {errors.learnerCount && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.learnerCount}
                    </p>
                  )}
                </div>

                {/* Type de financement */}
                <div>
                  <label className="block text-sm mb-2">
                    Type de financement *
                  </label>
                  <select
                    name="fundingType"
                    value={formData.fundingType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg ${
                      errors.fundingType
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="1">FMFP</option>
                    <option value="2">Fond propre</option>
                    <option value="3">Autres</option>
                  </select>
                  {errors.fundingType && (
                    <p className="text-red-600 text-sm mt-1 flex gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fundingType}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Date début */}
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

                {/* Date fin */}
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

              {/* Lieu */}
              <div className="mt-4 relative">
                <label className="block text-sm mb-2">Lieu de formation</label>
                <MapPin className="absolute left-3 top-10 w-5 h-5 text-gray-400" />
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                    errors.location
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Lieu de formation"
                />
                {errors.location && (
                  <p className="text-red-600 text-sm mt-1 flex gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.location}
                  </p>
                )}
              </div>
            </section>

            {/* Notes */}
            <section className="border-t pt-6">
              <label className="block text-sm mb-2">Notes</label>
              <textarea
                name="notes"
                rows={5}
                value={formData.notes}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.notes ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Décrivez vos besoins..."
              />
              {errors.notes && (
                <p className="text-red-600 text-sm mt-1 flex gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.notes}
                </p>
              )}
            </section>

            {/* Submit */}
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

export default Company;
