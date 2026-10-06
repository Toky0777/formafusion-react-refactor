import { X } from "lucide-react";
import { useState } from "react";

export default function MultiSelect({ mdls, onSelect }) {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (item) => {
    let updated;
    if (selected.some((i) => i.idModule === item.idModule)) {
      updated = selected.filter((i) => i.idModule !== item.idModule);
    } else {
      updated = [...selected, item];
    }
    setSelected(updated);
    onSelect(updated); // <- on remonte la liste au parent
  };

  const removeItem = (idModule) => {
    const updated = selected.filter((i) => i.idModule !== idModule);
    setSelected(updated);
    onSelect(updated); // <- idem ici
  };

  return (
    <div className="p-4 border rounded-xl shadow ">
      {/* Zone fixe pour les éléments sélectionnés */}
      <div className="mb-4 sticky top-0 bg-white z-10 pb-2">
        <div className="flex flex-wrap gap-2">
          {selected.length > 0 ? (
            selected.map((item) => (
              <span
                key={item.idModule}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {item.module_name}
                <button
                  onClick={() => removeItem(item.idModule)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={14} />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">
              Aucun élément sélectionné
            </span>
          )}
        </div>
      </div>

      {/* Zone scrollable pour les options */}
      <div className="flex flex-col gap-2 max-h-60 overflow-auto">
        {mdls.map((m) => (
          <label
            key={m.idModule}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded text-sm"
          >
            <input
              type="checkbox"
              checked={selected.some((i) => i.idModule === m.idModule)}
              onChange={() => toggleSelect(m)}
              className="accent-blue-600"
            />
            {m.module_name || m.moduleName}
          </label>
        ))}
      </div>
    </div>
  );
}
