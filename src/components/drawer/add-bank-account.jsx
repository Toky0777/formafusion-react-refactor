import { useState } from "react";
import { X } from "lucide-react";
import { profilService } from "../../services/profilService";
import { Button } from "../ui/button-customized";

export const AddBankAccountDrawer = ({ isOpen, onClose, villes, onAdd }) => {
  const [form, setForm] = useState({
    ba_titulaire: "",
    ba_name: "",
    ba_quartier: "",
    ba_idPostal: villes?.[0]?.id || "",
    ba_account_number: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validation du titulaire
    if (!form.ba_titulaire.trim()) {
      newErrors.ba_titulaire = "Le nom du titulaire est obligatoire";
      isValid = false;
    } else if (form.ba_titulaire.trim().length < 2) {
      newErrors.ba_titulaire = "Le nom du titulaire doit contenir au moins 2 caractères";
      isValid = false;
    }

    // Validation du nom de la banque
    if (!form.ba_name.trim()) {
      newErrors.ba_name = "Le nom de la banque est obligatoire";
      isValid = false;
    } else if (form.ba_name.trim().length < 2) {
      newErrors.ba_name = "Le nom de la banque doit contenir au moins 2 caractères";
      isValid = false;
    }

    // Validation du quartier
    if (!form.ba_quartier.trim()) {
      newErrors.ba_quartier = "Le quartier est obligatoire";
      isValid = false;
    } else if (form.ba_quartier.trim().length < 2) {
      newErrors.ba_quartier = "Le quartier doit contenir au moins 2 caractères";
      isValid = false;
    }

    // Validation du code postal
    if (!form.ba_idPostal) {
      newErrors.ba_idPostal = "Veuillez sélectionner un code postal";
      isValid = false;
    }

    // Validation du numéro de compte
    if (!form.ba_account_number.trim()) {
      newErrors.ba_account_number = "Le numéro de compte est obligatoire";
      isValid = false;
    } else {
      // Nettoyer le numéro de compte (supprimer les espaces)
      const cleanedAccountNumber = form.ba_account_number.replace(/\s+/g, "");
      
      // Validation basique du numéro de compte
      if (!/^\d+$/.test(cleanedAccountNumber)) {
        newErrors.ba_account_number = "Le numéro de compte ne doit contenir que des chiffres";
        isValid = false;
      } else if (cleanedAccountNumber.length < 8) {
        newErrors.ba_account_number = "Le numéro de compte doit contenir au moins 8 chiffres";
        isValid = false;
      } else if (cleanedAccountNumber.length > 34) { // IBAN maximum length
        newErrors.ba_account_number = "Le numéro de compte est trop long";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    // Validation côté client
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setErrors({});
    
    try {
      // Préparation des données pour l'envoi
      const formData = {
        ...form,
        ba_account_number: form.ba_account_number.replace(/\s+/g, ""), // Nettoyer le numéro de compte
      };

      const response = await profilService.addAccountBank(formData);
      onAdd(response.data);
      onClose();
      setForm({
        ba_titulaire: "",
        ba_name: "",
        ba_quartier: "",
        ba_idPostal: villes?.[0]?.id || "",
        ba_account_number: "",
      });
     } catch (err) {
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const newErrors = {};
        for (const key in backendErrors) {
          newErrors[key] = backendErrors[key][0];
        }
        setErrors(newErrors);
      }
      // Vérification spécifique pour le message "Ce numéro de compte existe déjà"
      else if (err.response?.data?.message === "Ce numéro de compte existe déjà") {
        setErrors({
          ba_account_number: "Ce numéro de compte existe déjà. Veuillez en choisir un autre."
        });
      }
      else if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Une erreur est survenue lors de l'ajout du compte bancaire. Veuillez réessayer.");
        console.error("Erreur lors de l'ajout du compte bancaire:", err);
      }
    }  finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative ml-auto w-[700px] bg-white h-full overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
          <p className="text-lg font-medium text-gray-700">
            Ajouter un compte bancaire
          </p>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-200"
          >
            <X className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4" onKeyPress={handleKeyPress}>
          {/* Titulaire */}
          <div>
            <label className="text-sm font-medium">Titulaire *</label>
            <input
              type="text"
              name="ba_titulaire"
              value={form.ba_titulaire}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              placeholder="Nom complet du titulaire"
              maxLength={100}
            />
            {errors.ba_titulaire && (
              <p className="text-red-500 text-sm mt-1">{errors.ba_titulaire}</p>
            )}
          </div>

          {/* Banque */}
          <div>
            <label className="text-sm font-medium">Nom de la banque *</label>
            <input
              type="text"
              name="ba_name"
              value={form.ba_name}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              placeholder="Ex: BICIS, Ecobank, etc."
              maxLength={100}
            />
            {errors.ba_name && (
              <p className="text-red-500 text-sm mt-1">{errors.ba_name}</p>
            )}
          </div>

          {/* Quartier */}
          <div>
            <label className="text-sm font-medium">Quartier *</label>
            <input
              type="text"
              name="ba_quartier"
              value={form.ba_quartier}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              placeholder="Quartier de l'agence"
              maxLength={100}
            />
            {errors.ba_quartier && (
              <p className="text-red-500 text-sm mt-1">{errors.ba_quartier}</p>
            )}
          </div>

          {/* Code postal */}
          <div>
            <label className="text-sm font-medium">Code postal *</label>
            <select
              name="ba_idPostal"
              value={form.ba_idPostal}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="">Sélectionnez un code postal</option>
              {villes.map((ville) => (
                <option key={ville.id} value={ville.id}>
                  {ville.vi_code_postal} - {ville.ville_name}
                </option>
              ))}
            </select>
            {errors.ba_idPostal && (
              <p className="text-red-500 text-sm mt-1">{errors.ba_idPostal}</p>
            )}
          </div>

          {/* Numéro de compte */}
          <div>
            <label className="text-sm font-medium">Numéro de compte *</label>
            <input
              type="text"
              name="ba_account_number"
              value={form.ba_account_number}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              placeholder="Entrez uniquement les chiffres"
              maxLength={34}
            />
            {errors.ba_account_number && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ba_account_number}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-3 border-t">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {submitting ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </div>
      </div>
    </div>
  );
};