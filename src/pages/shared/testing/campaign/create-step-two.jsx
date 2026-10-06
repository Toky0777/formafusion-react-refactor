/**
 * Page partagée Cfp / Formateur.
 * `basePath` : racine des routes du module (/cfp/prequal ou /formateur/testing).
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../../config/axios";
import { Spinner } from "../../../../components/ui/spinner";

export default function CampaignStepTwoPage({ basePath }) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [qcms, setQcms] = useState([]);
  const [selectedQcm, setSelectedQcm] = useState(
    sessionStorage.getItem("idQCM") || ""
  );

  const QcmRequest = async () => {
    setIsLoading(true);

    const url = `qcm/invitation/cfp/campaign/step-two`;

    try {
      const { data } = await axios.get(url);
      setQcms(data.qcms);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleQcmChange = (e) => {
    setSelectedQcm(e.target.value);
    sessionStorage.setItem("idQCM", e.target.value);
  };

  const StoreQcmId = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      idQCM: selectedQcm,
    };
    const url = `/qcm/invitation/cfp/campaign/step-two`;

    try {
      await axios.post(url, payload);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      navigate(`${basePath}/qcm/campaign/create-3`);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    QcmRequest();
  }, []);
  if (isLoading) return <Spinner />;
  return (
    <>
      <div class="">
        <div class="container px-4  mt-16 mx-auto">
          <div class="max-w-2xl p-8 mx-auto bg-white rounded-xl shadow-lg">
            {/* Progress Indicator */}
            <div class="flex justify-center mb-10 space-x-4 progress-indicator">
              <div class="w-16 h-2 bg-purple-600 rounded-full"></div>
              <div class="w-16 h-2 bg-purple-600 rounded-full"></div>
              <div class="w-16 h-2 bg-gray-200 rounded-full"></div>
              <div class="w-16 h-2 bg-gray-200 rounded-full"></div>
            </div>

            <h2 class="mb-10 text-3xl font-bold text-center text-gray-800">
              Sélectionnez QCM pour la campagne d'invitation
            </h2>

            <form id="stepTwoForm" onSubmit={StoreQcmId} class="space-y-6">
              <div class="space-y-4">
                {qcms && qcms.length > 0 ? (
                  qcms.map((qcm) => (
                    <div
                      key={qcm.idQCM}
                      class="transition-all duration-300 border border-gray-200 rounded-xl hover:shadow-md hover:border-[#a462a4]"
                    >
                      <label
                        htmlFor={`qcm-${qcm.idQCM}`}
                        class="flex items-start p-6 space-x-4 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="idQCM"
                          id={`qcm-${qcm.idQCM}`}
                          value={qcm.idQCM}
                          checked={selectedQcm == qcm.idQCM}
                          onChange={handleQcmChange}
                          className="w-5 h-5 mt-1 text-purple-600 focus:ring-purple-600 accent-purple-600"
                        />
                        <div class="flex-grow">
                          <h3 class="text-xl font-semibold text-gray-800">
                            {qcm.intituleQCM}
                          </h3>
                          <p class="mt-2 text-gray-600">{qcm.descriptionQCM}</p>
                        </div>
                      </label>
                    </div>
                  ))
                ) : (
                  <p>Aucun QCM disponible</p>
                )}
              </div>

              <div class="flex justify-between mt-10 space-x-4">
                <Link
                  to={`${basePath}/qcm/campaign/create-1`}
                  class="px-6 py-3 text-lg font-medium text-white transition duration-300 bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Précédente
                </Link>
                <button
                  type="submit"
                  class="px-6 py-3 text-lg font-medium text-white transition duration-300 transform bg-purple-600 rounded-lg hover:bg-purple-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2"
                >
                  Prochaine étape
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
