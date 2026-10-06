import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function DomainFilter({ domaines, selectedDomain, onDomainChange }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".domain-select")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    onDomainChange(value);
  };

  const handleReset = () => {
    onDomainChange("");
  };

  const getSelectedDomainName = () => {
    if (!selectedDomain) return "";
    const domain = domaines.find(
      (d) => d.idDomaine.toString() === selectedDomain.toString()
    );
    return domain ? domain.nomDomaine : "";
  };

  return (
    <div className="w-full max-w-2xl mb-8">
      <div className="p-6 bg-white shadow-lg rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Filtrer par domaine
          </h2>
          {selectedDomain && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 transition-colors bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <X className="w-3 h-3" />
              Réinitialiser
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="relative flex-grow domain-select">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Sélectionner un domaine
            </label>
            <div className="relative">
              <select
                name="domaine"
                value={selectedDomain}
                onChange={handleSelectChange}
                className="w-full px-4 pr-10 text-sm transition-all duration-200 bg-white border border-gray-200 rounded-lg cursor-pointer h-11 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">Tous les domaines</option>
                {domaines.map((domaine) => (
                  <option value={domaine.idDomaine} key={domaine.idDomaine}>
                    {domaine.nomDomaine}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedDomain && (
          <div className="p-3 mt-4 border border-blue-200 rounded-lg bg-blue-50">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Filtrage actif :</span>{" "}
              {getSelectedDomainName()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
