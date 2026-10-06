import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { profilService } from "../../services/profilService";
import { Button } from "../ui/button-customized";

export const EditMobileAccountDrawer = ({
  isOpen,
  onClose,
  account,
  onUpdate,
}) => {
  const [form, setForm] = useState({
    mm_titulaire: "",
    mm_operateur: "",
    mm_phone: "",
  });
  const [errors, setErrors] = useState({});

  // Remplir le formulaire quand un compte est sélectionné
  useEffect(() => {
    if (account) {
      setForm({
        mm_titulaire: account.mm_titulaire || "",
        mm_operateur: account.mm_operateur || "",
        mm_phone: account.mm_phone || "",
      });
    }
  }, [account]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    let newErrors = {};
    if (!form.mm_titulaire) newErrors.mm_titulaire = "Titulaire requis";
    if (!form.mm_operateur) newErrors.mm_operateur = "Opérateur requis";
    if (!form.mm_phone) newErrors.mm_phone = "Numéro requis";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await profilService.updateMobileAccount(account.id, form);
      onUpdate({ ...account, ...form });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du compte Mobile Money");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      ></div>
      <div className="relative ml-auto w-[60em] bg-white shadow-xl flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
          <p className="text-lg font-medium text-gray-700">
            Modifier un compte Mobile Money
          </p>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-md"
          >
            <X className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <input
            type="text"
            name="mm_titulaire"
            placeholder="Titulaire"
            value={form.mm_titulaire}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
          {errors.mm_titulaire && (
            <p className="text-sm text-red-500">{errors.mm_titulaire}</p>
          )}

          <input
            type="text"
            name="mm_operateur"
            placeholder="Opérateur"
            value={form.mm_operateur}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
          {errors.mm_operateur && (
            <p className="text-sm text-red-500">{errors.mm_operateur}</p>
          )}

          <input
            type="text"
            name="mm_phone"
            placeholder="Numéro de téléphone"
            value={form.mm_phone}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
          {errors.mm_phone && (
            <p className="text-sm text-red-500">{errors.mm_phone}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t p-3">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>Enregistrer</Button>
        </div>
      </div>
    </div>
  );
};
