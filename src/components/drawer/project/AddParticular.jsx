import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import axios from "../../../config/axios";
import { useState } from "react";
import toast from "react-hot-toast";
import InputForm from "../../ui/Input-form";
import ButtonSecondary from "../../ui/button-secondary";
import Button from "../../button/Button";

export default function AddParticular({ isOpen, onClose, manageLearner }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    part_name: "",
    part_firstname: "",
    part_email: "",
    part_cin: "",
  });

  /* ------------------ Animations ------------------ */
  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const drawerVariants = {
    closed: { x: "100%" },
    open: { x: 0 },
  };

  /* ------------------ Validation client ------------------ */
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
    } else if (!/^\d{12}$/.test(formData.part_cin)) {
      newErrors.part_cin = "Le CIN doit contenir exactement 12 chiffres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ------------------ Input change ------------------ */
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

  /* ------------------ Server errors (Laravel 422) ------------------ */
  const handleServerErrors = (serverErrors) => {
    const formattedErrors = {};

    Object.keys(serverErrors || {}).forEach((key) => {
      formattedErrors[key] = Array.isArray(serverErrors[key])
        ? serverErrors[key][0]
        : serverErrors[key];
    });

    setErrors(formattedErrors);
  };

  /* ------------------ Submit ------------------ */
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/particulier", formData);

      manageLearner(res.data.particular_id);
      toast.success("Particulier ajouté avec succès");

      setFormData({
        part_name: "",
        part_firstname: "",
        part_email: "",
        part_cin: "",
      });
      setErrors({});
      onClose();
    } catch (error) {
      if (error.response?.status === 422) {
        handleServerErrors(error.response.data.errors);
      } else {
        toast.error("Erreur serveur");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Render ------------------ */
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-lg z-50"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Ajouter un particulier</h2>
              <button onClick={onClose}>
                <X />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputForm
                    label="Nom"
                    value={formData.part_name}
                    onChange={handleInputChange("part_name")}
                    error={errors.part_name}
                  />

                  <InputForm
                    label="Prénom"
                    value={formData.part_firstname}
                    onChange={handleInputChange("part_firstname")}
                    error={errors.part_firstname}
                  />
                </div>

                <InputForm
                  label="Email"
                  type="email"
                  value={formData.part_email}
                  onChange={handleInputChange("part_email")}
                  error={errors.part_email}
                />

                <InputForm
                  label="CIN"
                  value={formData.part_cin}
                  maxLength={12}
                  onChange={handleInputChange("part_cin")}
                  error={errors.part_cin}
                />

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <ButtonSecondary type="button" onClick={onClose}>
                    Annuler
                  </ButtonSecondary>

                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Ajout..." : "Ajouter"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
