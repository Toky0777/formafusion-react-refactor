/**
 * Page partagée Cfp / Formateur.
 * `basePath` : racine des routes du module (/cfp/prequal ou /formateur/testing).
 */
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "../../../../config/axios";
import { Spinner } from "../../../../components/ui/spinner";
import AlertMessage from "../../../../components/Modals/AlertMessage";

export default function CampaignStepFourPage({ basePath }) {
  const [isLoading, setIsLoading] = useState(false);
  const selectedApprenants = sessionStorage.getItem("selectedEmployees");
  const employees_id = JSON.parse(selectedApprenants || "[]").map(
    (apprenant) => apprenant.idEmploye
  );
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    show: false,
  });

  const navigate = useNavigate();

  function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const now = new Date();
  now.setMinutes(0);
  now.setSeconds(0);
  now.setHours(now.getHours() + 1);

  const tomorrow = new Date(now);
  tomorrow.setHours(tomorrow.getHours() + 24);

  const [validFromInput, setValidFromInput] = useState(formatDateTime(now));
  const [validFromUntil, setValidFromUntil] = useState(
    formatDateTime(tomorrow)
  );
  const [message, setMessage] = useState("");

  sessionStorage.setItem("valid_from", validFromInput);
  sessionStorage.setItem("valid_until", validFromUntil);

  const handleValidFromInputChange = (e) => {
    setValidFromInput(e.target.value);
    sessionStorage.setItem("valid_from", e.target.value);
  };

  const handleValidFromUntilChange = (e) => {
    setValidFromUntil(e.target.value);
    sessionStorage.setItem("valid_until", e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    sessionStorage.setItem("custom_message", e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        campaign_name: sessionStorage.getItem("campaign_name"),
        idQCM: sessionStorage.getItem("idQCM"),
        selectedEmployees: employees_id,
        valid_from: sessionStorage.getItem("valid_from"),
        valid_until: sessionStorage.getItem("valid_until"),
      };
      const url = `/qcm/invitation/cfp/campaign/create`;
      const res = await axios.post(url, payload);
      console.log(res.data);
      setNotification({
        type: "success",
        message: "Campagne réussi!",
        show: true,
      });
      sessionStorage.removeItem("campaign_name");
      sessionStorage.removeItem("idQCM");
      sessionStorage.removeItem("custom_message");
      sessionStorage.removeItem("selectedEmployees");
      sessionStorage.removeItem("valid_from");
      sessionStorage.removeItem("valid_until");
      setTimeout(() => {
        setNotification({ type: "", message: "", show: false });
        navigate(`${basePath}/qcm/invitation/campaign`);
      }, 1000);
    } catch (error) {
      if (error.status === 500) {
        setNotification({
          type: "error",
          message: "Réseau non connécté au serveur",
          show: true,
        });
      } else {
        setNotification({
          type: "error",
          message: "Campagne raté! " + error.message,
          show: true,
        });
      }
      setIsLoading(false);
      setTimeout(() => {
        setNotification({ type: "", message: "", show: false });
      }, 3000);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) return <Spinner />;
  return (
    <>
      <AlertMessage
        type={notification.type}
        message={notification.message}
        visible={notification.show}
      />
      <div class="container px-4  mt-16 mx-auto">
        <div class="max-w-2xl p-8 mx-auto bg-white rounded-xl shadow-lg">
          {/* Progress Indicator */}
          <div class="flex justify-center mb-10 space-x-4 progress-indicator">
            <div class="w-16 h-2 bg-purple-600 rounded-full"></div>
            <div class="w-16 h-2 bg-purple-600 rounded-full"></div>
            <div class="w-16 h-2 bg-purple-600 rounded-full"></div>
            <div class="w-16 h-2 bg-purple-600 rounded-full"></div>
          </div>

          <h2 class="mb-10 text-3xl font-bold text-center text-gray-800">
            Details de l'invitation
          </h2>

          <form onSubmit={handleSubmit} class="space-y-6">
            <div class="space-y-6">
              <div class="space-y-2">
                <label
                  for="valid_from"
                  class="block text-sm font-semibold text-gray-700"
                >
                  Valable à partir de
                </label>
                <input
                  type="datetime-local"
                  name="valid_from"
                  id="valid_from"
                  class="w-full px-4 py-3 transition duration-150 ease-in-out border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-purple-700"
                  min="2025-05-22T21:37"
                  step="60"
                  value={validFromInput}
                  onChange={handleValidFromInputChange}
                  required
                />
              </div>

              <div class="space-y-2">
                <label
                  for="valid_until"
                  class="block text-sm font-semibold text-gray-700"
                >
                  Valable jusqu'au
                </label>
                <input
                  type="datetime-local"
                  name="valid_until"
                  id="valid_until"
                  class="w-full px-4 py-3 transition duration-150 ease-in-out border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-purple-700"
                  value={validFromUntil}
                  onChange={handleValidFromUntilChange}
                  min="2025-05-22T21:37"
                  step="60"
                  required
                />
              </div>

              <div class="space-y-2">
                <label
                  for="custom_message"
                  class="block text-sm font-semibold text-gray-700"
                >
                  Message personnalisé (facultatif)
                </label>
                <textarea
                  name="custom_message"
                  id="custom_message"
                  rows="4"
                  class="w-full px-4 py-3 transition duration-150 ease-in-out border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-purple-700"
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Enter a custom message for the invitation"
                />
              </div>
            </div>

            <div class="flex justify-between mt-10 space-x-4">
              <Link
                to={`${basePath}/qcm/campaign/create-3`}
                class="px-6 py-3 text-lg font-medium text-white transition duration-300 bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Précédente
              </Link>
              <button
                type="submit"
                class="px-6 py-3 text-lg font-medium text-white transition duration-300 transform bg-purple-600 rounded-lg hover:bg-purple-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2"
              >
                Créer une campagne
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
