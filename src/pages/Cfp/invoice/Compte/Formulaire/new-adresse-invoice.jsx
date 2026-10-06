import { useAuth } from "../../../../../contexts/AuthContext";
import useApi from "../../../../../hooks/Api";
import { InputField } from "../gestion-compte";
export function NewAdresseInvoice({
  isOpen,
  onClose,
  setSuccessMsg,
  setType,
  setReload,
}) {
  const setting = JSON.parse(sessionStorage.getItem("setting"));
  const { callApi } = useApi();
  const { user } = useAuth();
  const onAction = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await callApi("/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        setType("success");
        setSuccessMsg(response.message);
        setTimeout(() => {
          setReload((u) => u + 1);
        }, 1000);
      } else {
        console.log(response.message);
      }
    } catch (err) {
      if (err.response?.status === 422) {
        console.log(
          "Erreurs de validation Laravel :",
          err.response.data.errors
        );
      } else {
        console.error("❌ Erreur :", err);
      }
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
            Créer une adresse de facturation
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
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <InputField
                  type="text"
                  name="name"
                  label="Raison social"
                  required={true}
                  obli
                />
              </div>
              <div className="flex flex-col gap-1">
                <InputField
                  type="text"
                  name="nif"
                  label={setting?.nif_name}
                  required={false}
                />
              </div>
              <div className="flex flex-col gap-1">
                <InputField
                  type="text"
                  name="stat"
                  label={setting?.stat_name}
                  required={false}
                />
              </div>
              <div className="flex flex-col gap-1">
                <InputField
                  type="text"
                  name="rcs"
                  label="RCS"
                  required={true}
                  obli
                />
              </div>
              <div className="flex flex-col gap-1">
                <InputField
                  type="text"
                  name="adresse"
                  label="Adresse"
                  required={true}
                  obli
                />
              </div>
              <div className="flex flex-col gap-1">
                <InputField
                  type="email"
                  name="mail"
                  label="email"
                  required={true}
                  obli
                />
              </div>

              <div className="flex flex-col gap-1">
                <InputField
                  type="text"
                  name="phone"
                  label="Téléphone"
                  required={true}
                  obli
                />
              </div>
              <div className="flex flex-col gap-1">
                <InputField type="text" name="website" label="Site Web" obli />
              </div>
              <input type="hidden" name="idCustomer" value={user?.id} />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Retourner
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
