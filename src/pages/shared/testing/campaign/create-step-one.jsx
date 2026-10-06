/**
 * Page partagée Cfp / Formateur.
 * `basePath` : racine des routes du module (/cfp/prequal ou /formateur/testing).
 */
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "../../../../config/axios";

export default function CampaignStepOnePage({ basePath }) {
  const [campainName, setCampainName] = useState(
    sessionStorage.getItem("campaign_name") || ""
  );
  const navigate = useNavigate();

  const handleCampaignNameChange = async (e) => {
    setCampainName(e.target.value);
    sessionStorage.setItem("campaign_name", e.target.value);
  };

  const StoreCampaignName = async (e) => {
    e.preventDefault();
    const payload = {
      campaign_name: campainName,
    };
    const url = `/qcm/invitation/cfp/campaign/step-one`;

    try {
      await axios.post(url, payload);
      navigate(`${basePath}/qcm/campaign/create-2`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div class="">
        <div class="container px-4 mt-16 mx-auto">
          <div class="max-w-2xl p-8 mx-auto bg-white rounded-xl shadow-lg">
            {/* Progress Indicator */}
            <div class="flex justify-center mb-10 space-x-4 progress-indicator">
              <div class="w-16 h-2 bg-purple-600 rounded-full"></div>
              <div class="w-16 h-2 bg-gray-200 rounded-full"></div>
              <div class="w-16 h-2 bg-gray-200 rounded-full"></div>
              <div class="w-16 h-2 bg-gray-200 rounded-full"></div>
            </div>

            {/* Title */}
            <h2 class="mb-8 text-3xl font-bold text-center text-gray-800">
              Créer une invitation par campagne
            </h2>

            {/* Form */}
            <form
              id="stepOneForm"
              onSubmit={StoreCampaignName}
              class="space-y-6"
            >
              {/* Campaign Name */}
              <div class="space-y-2">
                <label
                  for="campaign_name"
                  class="block text-sm font-semibold text-gray-700"
                >
                  Nom de la campagne
                </label>
                <input
                  type="text"
                  name="campaign_name"
                  id="campaign_name"
                  class="w-full px-4 py-3 transition duration-150 ease-in-out border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a462a4] focus:border-transparent"
                  value={campainName}
                  onChange={handleCampaignNameChange}
                  placeholder="Entrer une nouvelle campagne"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                class="w-full px-6 py-3 text-lg font-medium text-white transition duration-300 transform bg-purple-600 rounded-lg hover:bg-purple-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#a462a4] focus:ring-offset-2"
              >
                Étape suivante
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
