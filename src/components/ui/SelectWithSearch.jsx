import { useState } from "react";
import { ChevronDown } from "lucide-react";
import T from "../translate/AutoTranslator";

export default function SelectWithSearch({ etps, onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEtps =
    searchTerm.trim() !== ""
      ? etps.filter((e) =>
          e.etp_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : etps;

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">
        <T>Entreprise</T>
      </label>

      <div
        className="flex items-center justify-between px-2 py-2 border rounded-lg cursor-pointer bg-white text-sm"
        onClick={() => setOpen(!open)}
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected ? selected.etp_name : <T>Sélectionner une entreprise</T>}
        </span>
        <ChevronDown
          className={`h-4 w-4  transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && (
        <div className="border rounded-lg shadow bg-white max-h-60 overflow-y-auto text-sm">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="w-auto p-2 m-2 border rounded-lg shadow-sm bg-white focus:outline-none"
            placeholder="Recherche"
          />
          <ul>
            {filteredEtps.map((etp) => (
              <li
                key={etp.idEtp}
                onClick={() => {
                  setSelected(etp);
                  setOpen(false);
                  setSearchTerm("");
                  onChange?.(etp.idEtp);
                }}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
              >
                {etp.etp_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
