import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { profilService } from "../../services/profilService";
import { Button } from "../ui/button-customized";

export const EditBankAccountDrawer = ({
  isOpen,
  onClose,
  villes,
  account,
  onUpdate,
}) => {
  const [form, setForm] = useState({
    ba_titulaire: "",
    ba_name: "",
    ba_quartier: "",
    ba_idPostal: "",
    ba_account_number: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

console.log(account)

  // Pré-remplir les champs quand on ouvre le drawer avec un compte
  useEffect(() => {
    if (account) {
      setForm({
        ba_titulaire: account.ba_titulaire || "",
        ba_name: account.ba_name || "",
        ba_quartier: account.ba_quartier || "",
        ba_idPostal: account.ba_idPostal || villes?.[0]?.id || "",
        ba_account_number: account.ba_account_number || "",
      });
    }
  }, [account, villes]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async () => {
    console.log(account);

    setSubmitting(true);
    setErrors({});
    try {
      await profilService.updateBankAccount(account.id, form);
      onUpdate({ ...account, ...form });
      onClose();
    } catch (err) {
      if (err.response?.data?.error) {
        const backendErrors = err.response.data.error;
        const newErrors = {};
        for (const key in backendErrors) {
          newErrors[key] = backendErrors[key][0];
        }
        setErrors(newErrors);
      } else {
        alert("Erreur inconnue, vérifiez la console.");
        console.error(err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative ml-auto w-[60em] bg-white h-full overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
          <p className="text-lg font-medium text-gray-700">
            Modifier un compte bancaire
          </p>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-200"
          >
            <X className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Titulaire */}
          <div>
            <label className="text-sm font-medium">Titulaire *</label>
            <input
              type="text"
              name="ba_titulaire"
              value={form.ba_titulaire}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
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
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Modification en cours..." : "Modifier"}
          </Button>
        </div>
      </div>
    </div>
  );
};
