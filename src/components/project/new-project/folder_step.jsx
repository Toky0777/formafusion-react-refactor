import { useState, useRef, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import AddModule from "../../drawer/project/AddModule";
import { projectService } from "../../../services/projectService";

export function FolderStep({ value, onChange, placeholder, multiple = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [folders, setFolders] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const data = await projectService.getAllFolder();
      setFolders(data);
    } catch (err) {
    } finally {
    }
  };

  const selectedOptions = multiple
    ? folders.filter((opt) => value.includes(opt.id))
    : folders.find((opt) => opt.id === value);

  const filteredOptions = folders.filter(
    (opt) =>
      opt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opt.email && opt.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (id) => {
    if (multiple) {
      if (value.includes(id)) onChange(value.filter((v) => v !== id));
      else onChange([...value, id]);
    } else {
      onChange(id);
    }
  };

  const handleAdd = (newId) => {
    if (multiple) onChange([...value, newId]);
    else onChange(newId);
    setShowDrawer(false);
  };

  return (
    <div ref={containerRef} className="w-full mb-4 relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Dossier
      </label>

      <div className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center flex-wrap gap-1 min-h-[40px]">
        {multiple ? (
          selectedOptions.length > 0 ? (
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
          <span className={selectedOptions ? "text-gray-900" : "text-gray-400"}>
            {selectedOptions ? selectedOptions.name : placeholder}
          </span>
        )}
      </div>

      {/* Liste toujours ouverte */}
      <div className="w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[40vh] overflow-y-auto">
        <div className="p-2 border-b border-gray-200 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Rechercher un dossier`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <div
              key={option.id}
              className={`px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors ${
                multiple
                  ? value.includes(option.id)
                    ? "bg-blue-100"
                    : ""
                  : value === option.id
                  ? "bg-blue-100"
                  : ""
              }`}
              onClick={() => handleSelect(option.id)}
            >
              {option.name}
              {option.email && (
                <div className="text-sm text-gray-500">{option.email}</div>
              )}
            </div>
          ))
        ) : (
          <div className="p-2 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowDrawer(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors font-medium"
            >
              <Plus className="w-4 h-4" /> Ajouter "{searchTerm}"
            </button>
          </div>
        )}
      </div>

      {showDrawer && (
        <AddModule
          show={showDrawer}
          handleClose={() => setShowDrawer(false)}
          name={searchTerm}
          manageEtp={handleAdd}
        />
      )}
    </div>
  );
}
