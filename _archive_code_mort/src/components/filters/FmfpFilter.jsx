import React, { useEffect, useState } from "react";
import {
  Building2,
  Briefcase,
  Funnel,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";
import axios from "../../config/axios";
import T from "../translate/AutoTranslator";

export default function FmfpFilter({ onFilterChange }) {
  const [show, setShow] = useState(false);
  const [entreprises, setEntreprises] = useState([]);
  const [modules, setModules] = useState([]);
  const [status, setStatus] = useState([]);

  const [filters, setFilters] = useState({
    entreprise: "",
    module: "",
    status: "",
  });

  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const res = await axios.get("/cfp/fmfp");
        setEntreprises(res.data.entreprises);
        setModules(res.data.modules);
        setStatus(res.data.status_fmfp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEntreprises();
  }, [show]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== ""
  ).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="relative flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all duration-200 cursor-pointer bg-gray-100 border-gray-200"
      >
        <Funnel />
        <span className="font-medium">
          <T>Filtrer</T>
        </span>

        {show ? <ChevronUp /> : <ChevronDown />}

        {activeFiltersCount > 0 && (
          <span
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs 
                 w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md"
          >
            {activeFiltersCount}
          </span>
        )}
      </button>

      {show && (
        <div className="border border-gray-300 p-5 my-5 rounded-lg">
          <div className="mt-2 flex gap-2 flex-wrap">
            {Object.entries(filters).map(([key, value]) =>
              value ? (
                <span
                  key={key}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {key === "entreprise" && (
                    <>
                      <T>Entreprise</T>: {value}
                    </>
                  )}
                  {key === "module" && (
                    <>
                      <T>Module</T>: {value}
                    </>
                  )}
                  {key === "status" && (
                    <>
                      <T>Status</T>: {value}
                    </>
                  )}

                  <button
                    onClick={() => handleFilterChange(key, "")}
                    className="ml-1 text-blue-600 font-bold hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ) : null
            )}
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Entreprises
                </label>
                <select
                  value={filters.entreprise}
                  onChange={(e) =>
                    handleFilterChange("entreprise", e.target.value)
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             transition-all bg-gray-50 hover:bg-white cursor-pointer focus:outline-none"
                >
                  <option value="">Toutes les entreprises</option>
                  {entreprises?.map((e) => (
                    <option value={e.etp_name} key={e.idEtp}>
                      {e.etp_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Formation
                </label>
                <select
                  value={filters.module}
                  onChange={(e) => handleFilterChange("module", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             transition-all bg-gray-50 hover:bg-white cursor-pointer focus:outline-none"
                >
                  <option value="">Toutes les formations</option>
                  {modules?.map((e) => (
                    <option value={e.moduleName} key={e.idModule}>
                      {e.moduleName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                             transition-all bg-gray-50 hover:bg-white cursor-pointer focus:outline-none"
                >
                  <option value="">Toutes les status</option>
                  {status?.map((e) => (
                    <option value={e.status_name} key={e.idStatus}>
                      {e.status_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
