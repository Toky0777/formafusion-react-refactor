import { useEffect, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { projectService } from "../../../services/projectService";
import AddParticular from "../../drawer/project/AddParticular";

export function ParticularStep({
  value = [],
  onChange,
  placeholder = "Select individuals...",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [particulars, setParticulars] = useState([]);
  const [openAddDrawer, setOpenAddDrawer] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const data = await projectService.getAllParticular();
      setSearchTerm("");
      setParticulars(data);
    } catch (err) {
    } finally {
    }
  };

  const selectedOptions = particulars.filter((opt) => value.includes(opt.id));

  const filteredOptions = particulars.filter(
    (opt) =>
      opt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opt.email && opt.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (id) => {
    fetchAllData();
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <>
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Particulier
        </label>

        {/* Zone de sélection */}
        <div className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg flex flex-wrap gap-1 min-h-[40px] cursor-pointer">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((opt) => (
              <span
                key={opt.id}
                className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {opt.name}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                  onClick={() => handleSelect(opt.id)}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}

          <ChevronDown className="ml-auto w-4 h-4 text-gray-500" />
        </div>

        {/* Liste */}
        <div className="w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[60vh] overflow-y-auto">
          {/* Recherche */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Rechercher un particulier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Résultats */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt.id}
                className={`px-4 py-2.5 cursor-pointer hover:bg-blue-50 ${
                  value.includes(opt.id) ? "bg-blue-100" : ""
                }`}
                onClick={() => handleSelect(opt.id)}
              >
                <span className="font-medium">{opt.name}</span>
                {opt.email && (
                  <span className="ml-1 text-sm text-gray-500">
                    ({opt.email})
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              <p>Aucun résultat</p>
              <button
                type="button"
                className="mt-2 text-blue-600 hover:underline"
                onClick={() => setOpenAddDrawer(true)}
              >
                Ajouter un particulier
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Drawer ajout particulier */}
      {openAddDrawer && (
        <AddParticular
          isOpen={openAddDrawer}
          onClose={() => setOpenAddDrawer(false)}
          manageLearner={(id) => handleSelect(id)}
        />
      )}
    </>
  );
}
