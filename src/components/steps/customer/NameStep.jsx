import axios from "../../../config/axios";
import customerService from "../../../services/cfp/customer/customerService";
import { useState, useEffect } from "react";
import ButtonAdd from "../../ui/button-add";
import ButtonSecondary from "../../ui/button-secondary";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import { IMAGE_URL } from "../../../config/env";

export default function NameStepCustomer({
  customerData,
  updateCustomerData,
  onNext,
  allEtps,
  onClose,
  name,
}) {
  const endpoint = IMAGE_URL;

  const [successfulInvites, setSuccessfulInvites] = useState([]);
  const [invitingClientId, setInvitingClientId] = useState(null);
  const [companyName, setCompanyName] = useState(
    customerData.companyName || name
  );
  const [isChecking, setIsChecking] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [exactMatch, setExactMatch] = useState(null);

  const searchClients = async (searchTerm) => {
    if (!searchTerm?.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setExactMatch(null);
      return;
    }

    setIsChecking(true);

    try {
      const response = await axios.get(
        `cfp/invites/${encodeURIComponent(searchTerm)}/name`
      );

      const results = response.data.customers || [];

      const exact = results.find(
        (client) =>
          client.customer_name.toLowerCase() === searchTerm.toLowerCase()
      );

      setSearchResults(results);
      setExactMatch(exact || null);
      setHasSearched(true);

      updateCustomerData({
        companyName: searchTerm,
        isExistingClient: !!exact,
      });
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setSearchResults([]);
      setExactMatch(null);
      setHasSearched(true);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchClients(companyName);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [companyName]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCompanyName(value);
    setHasSearched(false);
  };

  const handleInviteClient = async (idTypeCustomer, idCustomer) => {
    setInvitingClientId(idCustomer);
    try {
      const { data } = await customerService.inviteCustomer(
        idTypeCustomer,
        idCustomer
      );
      if (data.status === 200) {
        setSuccessfulInvites((prev) => [...prev, idCustomer]);
        toastr.success(data.message);
        onClose();
        allEtps();
      } else {
        toastr.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setInvitingClientId(null);
    }
  };

  const filteredResults = searchResults.filter(
    (client) => !client.is_customer_in_collaboration
  );

  const exactMatchInCollaboration = exactMatch?.is_customer_in_collaboration;

  const canProceed =
    companyName?.trim() && hasSearched && !exactMatchInCollaboration;

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="companyName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Nom
        </label>
        <div className="relative">
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez le nom..."
          />
          {isChecking && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Messages de statut */}
        {hasSearched && companyName.trim() && (
          <div className="mt-2">
            {exactMatchInCollaboration ? (
              <div className="flex items-center text-red-600 text-sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Cette entreprise est déjà cliente en collaboration
              </div>
            ) : (
              <div className="flex items-center text-green-600 text-sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {filteredResults.length > 0
                  ? `${filteredResults.length} entreprise(s)  trouvée(s)`
                  : "Cette entreprise n'existe pas encore"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tableau des résultats de recherche */}
      {hasSearched && filteredResults.length > 0 && (
        <div className="mt-5">
          <div className="overflow-hidden  ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Logo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.map((client) => (
                  <tr key={client.idCustomer} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.customer_type}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.customer_logo ? (
                        <img
                          src={`${endpoint}/${client.customer_logo}`}
                          alt=""
                          className="w-20 h-20 rounded-full"
                        />
                      ) : (
                        <p className="text-sm">Aucun logo </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <ButtonSecondary
                        onClick={() =>
                          handleInviteClient(
                            client.idTypeCustomer,
                            client.idCustomer
                          )
                        }
                        disabled={
                          invitingClientId === client.idCustomer ||
                          successfulInvites.includes(client.idCustomer)
                        }
                      >
                        {invitingClientId === client.idCustomer ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#A462b8]"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Envoi...
                          </div>
                        ) : successfulInvites.includes(client.idCustomer) ? (
                          "En collaboration"
                        ) : (
                          "Inviter"
                        )}
                      </ButtonSecondary>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message si exact match en collaboration */}
      {exactMatchInCollaboration && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Cette entreprise est déjà en collaboration
              </h3>
              <p className="mt-1 text-sm text-red-700">
                Vous ne pouvez pas ajouter une entreprise qui collabore déjà
                avec vous.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Message si aucun résultat */}
      {hasSearched &&
        filteredResults.length === 0 &&
        companyName.trim() &&
        !exactMatchInCollaboration && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Parfait ! Cette entreprise n'existe pas encore
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  Vous pouvez continuer pour ajouter "{companyName}" comme
                  nouveau client.
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Boutons de navigation */}
      <div className="flex justify-between pt-6">
        <div></div>
        <ButtonAdd
          onClick={onNext}
          disabled={!canProceed || companyName.length < 3}
        >
          Suivant
        </ButtonAdd>
      </div>
    </div>
  );
}
