import { useAuth } from "../../../../../contexts/AuthContext";
import useApi from "../../../../../hooks/Api";
import { InputField } from "../gestion-compte";
import { useEffect } from "react";

export function NewMobileMoney({
  isOpen,
  onClose,
  setSuccessMsg,
  setType,
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

      const response = await callApi("/cfp/mobilemoneyAcount", {
        method: "POST",
        body: payload,
      });

      if (response.success) {
        setType("success");
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
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panneau latéral */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[700px] bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b">
          <p className="text-lg font-medium text-gray-700">
            Ajouter un compte mobile money
          </p>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="p-6 overflow-y-auto h-full">
          <form onSubmit={onAction}>
            <div className="flex flex-col justify-start w-full gap-2">
              <div className="flex flex-col w-full gap-1">
                <InputField
                  type="text"
                  name="mm_titulaire"
                  label="Titulaire du compte"
                  required={true}
                  obli={true}
                />
              </div>
              <div className="flex flex-col gap-1">
                <InputField
                  type="text"
                  name="mm_operateur"
                  label="Nom de votre operateur"
                  required={true}
                  obli={true}
                />
              </div>
              <div className="flex flex-col gap-1">
                <InputField
                  type="text"
                  name="mm_phone"
                  label="Numero téléphone de votre compte"
                  required={true}
                  obli={true}
                />
              </div>
              <input type="hidden" name="mm_idCustomer" value={user?.id} />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
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
