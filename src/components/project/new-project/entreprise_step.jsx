import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import AddCustomer from "../../drawer/project/AddCustomer";
import { projectService } from "../../../services/projectService";

export function EntrepriseStep({
  value,
  onChange,
  multiple = true,
  placeholder = "Select enterprise...",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [entreprises, setEntreprises] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const data = await projectService.getAllEntreprise();
      const safeData = Array.isArray(data)
        ? data.filter((e) => e && e.id && e.name)
        : [];

      setEntreprises(safeData.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error(err);
    }
  };

  const selectedOptions = multiple
    ? entreprises.filter((opt) => (value || []).includes(opt.id))
    : entreprises.find((opt) => opt.id === value) || null;

  const filteredOptions = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return entreprises.filter((opt) => {
      const name = opt?.name?.toLowerCase() || "";
      return name.includes(term);
    });
  }, [entreprises, searchTerm]);

  const manageEtp = async (newId) => {
    await fetchAllData();

    if (multiple) {
      const current = value || [];
      onChange(
        current.includes(newId)
          ? current.filter((v) => v !== newId)
          : [...current, newId]
      );
    } else {
      onChange(newId);
    }

    setSearchTerm("");
  };

  const handleSelect = (id) => {
    if (multiple) {
      const current = value || [];
      onChange(
        current.includes(id)
          ? current.filter((v) => v !== id)
          : [...current, id]
      );
    } else {
      onChange(id === value ? null : id);
      setSearchTerm("");
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Entreprise
      </label>

      <div className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg flex flex-wrap gap-1 min-h-[40px] cursor-pointer">
        {multiple ? (
          selectedOptions?.length > 0 ? (
            selectedOptions.map((opt) => (
              <span
                key={opt.id}
                className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {opt.name}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleSelect(opt.id)}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )
        ) : (
          <span className={!selectedOptions ? "text-gray-400" : ""}>
            {selectedOptions?.name || placeholder}
          </span>
        )}

        <ChevronDown className="ml-auto w-4 h-4 text-gray-500" />
      </div>

      {/* Liste toujours ouverte */}
      <div className="w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[60vh] overflow-y-auto">
        {/* Search */}
        <div className="p-2 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md"
              placeholder="Search enterprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Résultats */}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt) => {
            const isSelected = multiple
              ? (value || []).includes(opt.id)
              : value === opt.id;

            return (
              <div
                key={opt.id}
                className={`px-4 py-2.5 cursor-pointer hover:bg-blue-50 ${
                  isSelected ? "bg-blue-100" : ""
                }`}
                onClick={() => handleSelect(opt.id)}
              >
                {opt.name}
              </div>
            );
          })
        ) : (
          <>
            <div className="p-2 text-gray-500 text-sm text-center">
              Aucun résultat
            </div>

            <button
              className="p-2 bg-blue-600 text-white w-full hover:bg-blue-700"
              onClick={() => setOpenDrawer(true)}
            >
              Ajouter "{searchTerm}"
            </button>
          </>
        )}
      </div>

      {/* Drawer */}
      {openDrawer && (
        <AddCustomer
          show={openDrawer}
          close={() => setOpenDrawer(false)}
          getAllEtps={entreprises}
          name={searchTerm}
          manageEtp={manageEtp}
        />
      )}
    </div>
  );
}
