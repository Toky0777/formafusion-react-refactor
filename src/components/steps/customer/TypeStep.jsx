// ClientTypeStep.js
import { useState } from "react";
import ButtonSecondary from "../../ui/button-secondary";
import ButtonAdd from "../../ui/button-add";

const clientTypes = [
  {
    idType: 1,
    label: "Entreprise",
    description: "Sociétés cherchant à former leurs employés",
  },
  {
    idType: 2,
    label: "Centre de formation",
    description: "Organismes proposant des formations",
  },
  {
    idType: 5,
    label: "ONG",
    description: "Organisation non gouvernementale à but non lucratif",
  },

  {
    idType: 4,
    label: "Public",
    description:
      "Organisme public ou parapublic (ministères, collectivités, etc.)",
  },
];

export default function TypeStepCustomer({
  updateCustomerData,
  onPrevious,
  onSubmit,
  isLoading,
}) {
  const [selectedType, setSelectedType] = useState(null);

  const handleChange = (e) => {
    const typeId = e.target.value;
    setSelectedType(typeId);
    updateCustomerData({ clientType: typeId });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Type de client</h3>

      <ul className="grid w-full gap-4 md:grid-cols-2">
        {clientTypes
          .filter((type) => {
            return type.idType !== 2;
          })
          .map((type) => (
            <li key={type.idType}>
              <input
                type="radio"
                id={`client-type-${type.idType}`}
                name="clientType"
                value={type.idType}
                onChange={handleChange}
                className="hidden peer"
                required
                checked={selectedType === String(type.idType)}
              />
              <label
                htmlFor={`client-type-${type.idType}`}
                className="inline-flex items-center justify-between w-full p-4 text-gray-800 bg-white border border-gray-200 rounded-lg cursor-pointer hover:text-gray-600 hover:bg-gray-50 peer-checked:border-blue-600 peer-checked:text-blue-600"
              >
                <div className="block">
                  <div className="w-full text-lg font-semibold">
                    {type.label}
                  </div>
                  <div className="w-full text-sm text-gray-500">
                    {type.description}
                  </div>
                </div>
              </label>
            </li>
          ))}
      </ul>

      <div className="mt-8 flex justify-between">
        <ButtonSecondary onClick={onPrevious}>Précédent</ButtonSecondary>
        <ButtonAdd disabled={!selectedType} onClick={onSubmit}>
          {isLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white>"
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
          ) : (
            "Ajouter ce client"
          )}
        </ButtonAdd>
      </div>
    </div>
  );
}
