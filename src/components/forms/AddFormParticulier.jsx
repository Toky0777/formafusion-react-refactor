import { useState } from "react";
import InputForm from "../ui/Input-form";
import Button from "../button/Button";
import ButtonSecondary from "../ui/button-secondary";
import "toastr/build/toastr.min.css";
import toastr from "toastr";

export default function AddFormParticulier({ onClose, onAdd }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    part_name: "",
    part_firstname: "",
    part_email: "",
    part_cin: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.part_name.trim()) {
      newErrors.part_name = "Le nom est requis";
    }
    if (!formData.part_firstname.trim()) {
      newErrors.part_firstname = "Le prénom est requis";
    }
    if (!formData.part_email.trim()) {
      newErrors.part_email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.part_email)) {
      newErrors.part_email = "Format d'email invalide";
    }
    if (!formData.part_cin.trim()) {
      newErrors.part_cin = "Le CIN est requis";
    } else if (formData.part_cin.length < 12) {
      newErrors.part_cin = "Le CIN doit contenir au moins 12 chiffres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleServerErrors = (serverErrors) => {
    const formattedErrors = {};

    if (typeof serverErrors === "object" && serverErrors !== null) {
      Object.keys(serverErrors).forEach((key) => {
        const formKey = key;
        formattedErrors[formKey] = Array.isArray(serverErrors[key])
          ? serverErrors[key][0]
          : serverErrors[key];
      });
    }

    setErrors(formattedErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return null;
    }

    try {
      const res = await onAdd(formData);
      if (res.data.status === 200) {
        toastr.success(res.data.message || "Particulier ajouté avec succès");
        setFormData({
          part_name: "",
          part_firstname: "",
          part_email: "",
          part_cin: "",
        });
        setErrors({});

        onClose();
      } else {
        if (res.data.errors) {
          handleServerErrors(res.data.errors);
        } else {
          toastr.error(res.data.message || "Une erreur s'est produite");
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputForm
            label="Nom"
            name="part_name"
            placeholder="Rakoto"
            value={formData.part_name}
            onChange={handleInputChange("part_name")}
            error={errors.part_name}
          />
          <InputForm
            label="Prénom"
            name="part_firstname"
            placeholder="Mendrika"
            value={formData.part_firstname}
            onChange={handleInputChange("part_firstname")}
            error={errors.part_firstname}
          />
        </div>

        <div>
          <InputForm
            label="Email"
            name="part_email"
            type="email"
            placeholder="rakoto@gmail.com"
            value={formData.part_email}
            onChange={handleInputChange("part_email")}
            error={errors.part_email}
          />
        </div>

        <div>
          <InputForm
            label="CIN"
            name="part_cin"
            placeholder="101245687325"
            value={formData.part_cin}
            onChange={handleInputChange("part_cin")}
            error={errors.part_cin}
            maxLength="12"
          />
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <ButtonSecondary type="button" onClick={onClose}>
            Annuler
          </ButtonSecondary>
          <Button type="submit"> {loading ? "Ajout..." : "Ajouter"} </Button>
        </div>
      </form>
    </div>
  );
}
