/**
 * Page partagée Cfp / Formateur.
 * `basePath` : racine des routes du module (/cfp/prequal ou /formateur/testing).
 */
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import debounce from "lodash.debounce";
import axios from "../../../../config/axios";
import { Spinner } from "../../../../components/ui/spinner";

export default function CampaignStepThreePage({ basePath }) {
  const navigate = useNavigate();
  const [apprenants, setApprenants] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApprenants, setSelectedApprenants] = useState(
    JSON.parse(sessionStorage.getItem("selectedEmployees")) || []
  );
  const [filteredApprenants, setFilteredApprenants] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnterprise, setSelectedEnterprise] = useState("");

  const DataRequest = async () => {
    setIsLoading(true);
    const url = `/qcm/invitation/cfp/campaign/step-three`;

    try {
      const { data } = await axios.get(url);
      setIsLoading(false);
      setApprenants(data.employees);
      setCustomers(data.etps || []);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleAddApprenant = (apprenant) => {
    setSelectedApprenants([...selectedApprenants, apprenant]);
    sessionStorage.setItem(
      "selectedEmployees",
      JSON.stringify([...selectedApprenants, apprenant])
    );
    const updatedList = apprenants.filter(
      (emp) => emp.idEmploye !== apprenant.idEmploye
    );
    setApprenants(updatedList);

    // Mettre à jour aussi les résultats filtrés si nécessaire
    if (showResults) {
      const updatedFilteredList = filteredApprenants.filter(
        (emp) => emp.idEmploye !== apprenant.idEmploye
      );
      setFilteredApprenants(updatedFilteredList);
    }
  };

  const handleSearch = useCallback(
    debounce((searchValue, enterpriseValue = selectedEnterprise) => {
      const term = searchValue.toLowerCase();
      let results = apprenants;

      console.log(results);

      // Filtrer par entreprise d'abord si une entreprise est sélectionnée
      if (enterpriseValue) {
        results = results.filter((emp) => emp.idEtp == enterpriseValue);
      }

      // Ensuite filtrer par terme de recherche si il y en a un
      if (term.length >= 2) {
        results = results.filter(
          (emp) =>
            (emp.emp_email && emp.emp_email.toLowerCase().includes(term)) ||
            (emp.emp_name && emp.emp_name.toLowerCase().includes(term)) ||
            (emp.emp_firstname &&
              emp.emp_firstname.toLowerCase().includes(term))
        );
      }

      // Afficher les résultats si il y a un filtre actif
      if (term.length >= 2 || enterpriseValue) {
        setFilteredApprenants(results);
        setShowResults(true);
      } else {
        setShowResults(false);
        setFilteredApprenants([]);
      }
    }, 300),
    [apprenants, selectedEnterprise]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleEnterpriseChange = (e) => {
    const value = e.target.value;
    setSelectedEnterprise(value);
    handleSearch(searchTerm, value);
  };

  const handleRemoveApprenant = (id) => {
    const stored = sessionStorage.getItem("selectedEmployees");
    if (!stored) return;
    let currentList = JSON.parse(stored);
    setApprenants([
      ...apprenants,
      currentList.find((apprenant) => apprenant.idEmploye === id),
    ]);
    const updatedList = currentList.filter(
      (apprenant) => apprenant.idEmploye !== id
    );

    sessionStorage.setItem("selectedEmployees", JSON.stringify(updatedList));
    setSelectedApprenants(updatedList);
  };

  const StoreSelectedStudent = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    navigate(`${basePath}/qcm/campaign/create-4`);
  };

  useEffect(() => {
    DataRequest();
  }, []);

  // Déterminer quelle liste afficher
  const apprenantsToDisplay = showResults ? filteredApprenants : apprenants;
  if (isLoading) return <Spinner />;
  return (
    <>
      <div class="container px-4  mx-auto">
        <div class="p-10 mx-auto bg-white rounded-lg ">
          {/* Progress Indicator */}
          <div class="flex justify-center mb-8 space-x-4 progress-indicator">
            <div class="w-16 h-2 bg-purple-600 rounded"></div>
            <div class="w-16 h-2 bg-purple-600 rounded"></div>
            <div class="w-16 h-2 bg-purple-600 rounded"></div>
            <div class="w-16 h-2 bg-gray-300 rounded"></div>
          </div>

          <h2 class="mb-8 text-3xl font-bold text-center text-gray-800">
            Sélectionner les apprenants à inviter
          </h2>

          <form id="stepThreeForm" onSubmit={StoreSelectedStudent}>
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Available Employees */}
              <div class="p-6 border rounded-lg">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-xl font-bold text-gray-800">
                    Apprenants disponible
                  </h3>
                  <input
                    type="text"
                    id="employeeSearch"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    class="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 w-50"
                  />
                </div>
                {customers.length > 0 && (
                  <div class="flex items-center justify-between mb-6">
                    <select
                      name="etpSearch"
                      id="etpSearch"
                      value={selectedEnterprise}
                      onChange={handleEnterpriseChange}
                      class="mt-2 border-[1px] border-gray-200 rounded-md p-2 outline-none w-full bg-white"
                    >
                      <option value="">Toutes les entreprises</option>
                      {customers.map((customer, index) => (
                        <option value={customer.id} key={index}>
                          {customer.etpname}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div
                  id="availableEmployeesContainer"
                  class="overflow-y-auto max-h-96"
                >
                  {apprenantsToDisplay.map((apprenant) => {
                    return (
                      <>
                        <div
                          class="flex items-center justify-between p-3 border-b cursor-pointer employee-item hover:bg-gray-50"
                          data-id="2155"
                          data-name="RANDRIANASOLO"
                          data-firstname="Arivola"
                          data-email="arivola.randrianasolo@tozzigreen.com"
                          data-idetp="1858"
                        >
                          <div class="flex flex-col">
                            <span class="font-medium text-gray-700 text-xl">
                              {apprenant.emp_name} {apprenant.emp_firstname}
                            </span>
                            {apprenant.emp_email ? (
                              <span class="text-sm text-gray-500">
                                {apprenant.emp_email}
                              </span>
                            ) : (
                              <span class="text-sm text-red-500">
                                Attention: Aucun email renseigné, cet apprenant
                                a besoin du mail pour passer au test
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddApprenant(apprenant)}
                            type="button"
                            class="add-btn hover:bg-purple-800 hover:text-white text-purple-600 text-2xl font-bold rounded-full px-4 py-2 transition-all"
                            data-id={apprenant.idEmploye}
                          >
                            +
                          </button>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>

              {/* Selected Employees */}
              <div class="p-6 border rounded-lg">
                <h3 class="mb-6 text-xl font-bold text-gray-800">
                  Apprenants sélectionné
                </h3>
                <div class="my-4">
                  <span id="selectedCount" class="text-sm text-gray-600">
                    {selectedApprenants.length} apprenants sélectionné
                  </span>
                </div>
                <div
                  id="selectedEmployeesContainer"
                  class="overflow-y-auto max-h-96"
                >
                  {selectedApprenants.map((apprenant) => {
                    return (
                      <>
                        <div class="flex justify-between items-center p-3 bg-[#f5ebf5] rounded-md mb-3">
                          <div class="flex flex-col">
                            <span class="font-medium text-gray-700 text-xl">
                              {apprenant.emp_name} {apprenant.emp_firstname}
                            </span>
                            {apprenant.emp_email && (
                              <span class="text-sm text-gray-500">
                                {apprenant.emp_email}
                              </span>
                            )}
                          </div>
                          <div class="hidden" id="hiddenInputsContainer">
                            <input
                              type="hidden"
                              name="selectedEmployees[]"
                              value={apprenant.idEmploye}
                            />
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveApprenant(apprenant.idEmploye)
                            }
                            type="button"
                            class="text-red-500 remove-btn px-3 py-2 rounded-full hover:bg-red-600 hover:text-white"
                            data-id="{{ $employee->idEmploye }}"
                          >
                            ✕
                          </button>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>

            <div class="flex justify-between mt-8">
              <Link
                to={`${basePath}/qcm/campaign/create-2`}
                class="px-6 py-3 text-lg text-white transition duration-300 bg-gray-500 rounded-md hover:bg-gray-600"
              >
                Précédente
              </Link>
              <button
                type="submit"
                class={`px-6 py-3 ${
                  selectedApprenants.length < 1 ? "disable" : ""
                } text-lg bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300`}
              >
                Prochaine étape
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
