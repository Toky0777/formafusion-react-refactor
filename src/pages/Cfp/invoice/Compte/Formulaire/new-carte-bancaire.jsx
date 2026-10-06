import { useAuth } from "../../../../../contexts/AuthContext";
import useApi from "../../../../../hooks/Api";
import { InputField } from "../gestion-compte";
import { useEffect } from "react";

export function NewCarteBancaire({
  data,
  isOpen,
  onClose,
  setSuccessMsg,
  setReload,
}) {
  const { callApi } = useApi();
  const { user } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const onAction = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }

      const response = await callApi("/cfp/bankAccount", {
        method: "POST",
        body: payload,
      });

      if (response.success) {
        console.log("✅ Succès :", response.success);
        setSuccessMsg(response.success);
        setTimeout(() => {
          setReload((u) => u + 1);
        }, 1000);
      } else {
        console.log("❌ Erreur :", response.error);
      }
    } catch (err) {
      console.error("❌ Erreur :", err);
    }
  };

  return (
    <>
      {/* Overlay sombre */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Panneau latéral */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[700px] bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b">
          <p className="text-lg font-medium text-gray-700">
            Ajouter un compte bancaire
          </p>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="text-xl fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="h-full p-6 overflow-y-auto">
          <form onSubmit={onAction}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <InputField
                  type="text"
                  name="ba_titulaire"
                  label="Titulaire du compte"
                  required={true}
                />
                <div className="text-sm text-red-500 error_ba_titulaire"></div>
              </div>
              <div className="flex flex-col gap-1">
                <InputField
                  type="text"
                  name="ba_name"
                  label="Nom de votre banque"
                  required={true}
                />
              </div>
              <div className="flex flex-col gap-1">
                <InputField
                  type="text"
                  name="ba_quartier"
                  label="Quartier de votre banque"
                  required={true}
                />
                <div className="text-sm text-red-500 error_ba_quartier"></div>
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="ba_idPostal"
                  className="text-base font-medium text-gray-700"
                >
                  Code postal de votre banque{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="ba_idPostal"
                  id="ba_idPostal"
                  className="border rounded h-[35px] text-base focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  {data.ville_codeds.map((ville) => (
                    <option key={ville.id} value={ville.id}>
                      {ville.ville_name} - {ville.vi_code_postal}
                    </option>
                  ))}
                </select>
                <div className="text-sm text-red-500 error_ba_idPostal"></div>
              </div>
              <div className="flex flex-col gap-1">
                <InputField
                  type="text"
                  name="ba_account_number"
                  label="Numero de compte"
                  required={true}
                />
                <div className="text-sm text-red-500 error_ba_account_number"></div>
              </div>
              <input
                type="hidden"
                id="ba_idCustomer"
                name="ba_idCustomer"
                value={user?.id}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white rounded-md bg-[#A462A4] hover:bg-[#944a94] transition-colors duration-200"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
