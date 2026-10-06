import { useState } from "react";

import PaymentSuccessModal from "./payment-sucess";
import axios from "../../config/axios";

export function PaiementModal({ invoice, data, closeModal, setIsPaid }) {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMesssage] = useState();

  const setting = JSON.parse(sessionStorage.getItem("setting"));
  // console.log(localStorage.getItem("token"));
  const handleSubmit = async (formData) => {
    try {
      
      const response = await axios.post(
        `/payment/store`,
        formData,
      );
      if (response.data.status === 200) {
        setMesssage(response.data.message);
        setSuccessMessageVisible(true);
        setErrorMessage(""); // Réinitialiser les erreur
        setTimeout(() => {
          setSuccessMessageVisible(false);
          closeModal();
          setIsPaid((prev) => prev + 1);
        }, 2000);
      }
    } catch (error) {
      console.error("Erreur d’envoi :", error.response?.data || error.message);
      setErrorMessage("Erreur lors de l'envoi des données.");
      setTimeout(() => {
        setErrorMessage(""); // Efface le message après 2s
      }, 2000);
      setSuccessMessageVisible(false); // Si une erreur survient, on cache le message de succès
    }
  };

  return (
    <>
      {!successMessageVisible && (
        <div className="fixed inset-0 z-40 flex items-center justify-center max-w-screen-md mx-auto overflow-hidden modal-dialog faster">
          <div className="border border-teal-500 modal-container bg-white w-[75%] mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="px-6 py-4 text-left modal-content">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-700">
                  Enregistrer le paiement de cette facture
                </h1>
                <div className="z-50 cursor-pointer" onClick={closeModal}>
                  <i className="text-gray-400 fa-solid fa-xmark text-md"></i>
                </div>
              </div>
              <form action={handleSubmit}>
                <div className="flex flex-col gap-3 my-3 mr-10">
                  <p className="text-lg font-semibold text-gray-700">
                    Reste à payer :{" "}
                    <span className="text-lg font-semibold text-gray-700">
                      {" "}
                      {(
                        (Number(invoice.invoice_total_amount) || 0) -
                        (Array.isArray(invoice.payments)
                          ? invoice.payments.reduce(
                            (sum, p) => sum + (Number(p.amount) || 0),
                            0
                          )
                          : 0)
                      ).toLocaleString("fr-FR", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}{" "}
                      {setting?.currency_unit}
                    </span>
                  </p>
                  <input
                    type="hidden"
                    name="invoice_id"
                    value={invoice.idInvoice}
                  />
                  <div className="inline-flex items-center w-full gap-4">
                    <div className="flex items-center justify-end w-2/5">
                      <p className="text-base font-semibold text-gray-700">
                        Date
                        <span className="text-red-500">*</span>
                      </p>
                    </div>
                    <div className="flex items-center w-3/5">
                      <input
                        type="date"
                        name="payment_date"
                        required
                        className="px-3 py-2 border-[1px] border-gray-200 rounded-md hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 duration-200 text-gray-400"
                      />
                    </div>
                  </div>
                  <div className="inline-flex items-center w-full gap-4">
                    <div className="flex items-center justify-end w-2/5">
                      <p className="text-base font-semibold text-gray-700">
                        Montant<span className="text-red-500">*</span>
                      </p>
                    </div>
                    <div className="w-3/5 flex items-center px-3 py-2 gap-2 border-[1px] border-gray-200 rounded-md hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 duration-200 text-gray-400">
                      <p>{setting?.currency_unit}</p>
                      <input
                        type="number"
                        name="amount"
                        className="w-full outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="inline-flex items-center w-full gap-4">
                    <div className="flex items-center justify-end w-2/5">
                      <p className="text-base font-semibold text-gray-700">
                        Méthode<span className="text-red-500">*</span>
                      </p>
                    </div>
                    <div className="flex items-center w-3/5">
                      <select
                        name="payment_method_id"
                        id="payment_method_id"
                        required
                        className="w-full p-2 text-base border rounded focus:outline-none focus:ring-purple-500 focus:ring-1"
                      >
                        {data.pm_types.map((type) => (
                          <option key={type.idTypePm} value={type.idTypePm}>
                            Par {type.pm_type_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="inline-flex items-center w-full gap-4">
                    <div className="flex items-center justify-end w-2/5">
                      <p className="text-base font-semibold text-gray-700">
                        Compte<span className="text-red-500">*</span>
                      </p>
                    </div>
                    <div
                      className="flex items-center w-3/5 payment_acompte_container"
                      id=""
                    >
                      <select
                        name="payment_bank_id"
                        id="payment_bank_id"
                        className="w-full p-2 text-base border rounded focus:outline-none focus:ring-purple-500 focus:ring-1"
                      >
                        <option value="">
                          Sélectionner un compte bancaire...
                        </option>
                        {data.ba_accounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.ba_titulaire} - {account.ba_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="inline-flex items-start w-full gap-4">
                    <div className="flex items-center justify-end w-2/5">
                      <p className="text-base font-semibold text-gray-700">
                        Memo / notes
                      </p>
                    </div>
                    <div className="flex items-center w-3/5">
                      <textarea
                        name="payment_description"
                        rows="10"
                        cols="50"
                        className="w-full h-20 p-2 text-base border rounded focus:outline-none focus:ring-purple-500 focus:ring-1"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 mr-3 text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-[#A462A4] rounded-md hover:bg-[#8e4f8e] transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Message de succès */}
      {successMessageVisible && <PaymentSuccessModal message={message} />}

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 text-center bg-white shadow-lg rounded-2xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-red-600">
              Paiement échoué
            </h2>
          </div>
        </div>
      )}
    </>
  );
}
