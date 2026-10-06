import { useState, useRef, useEffect } from "react";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function SelectMultiple({
  error,
  data,
  value,
  label,
  optionValue,
  optionLabel,
  onChange,
  placeholder = "-- Sélectionner --",
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedItems(value || []);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckboxChange = (value) => {
    let newSelection;
    if (selectedItems.includes(value)) {
      newSelection = selectedItems.filter((v) => v !== value);
    } else {
      newSelection = [...selectedItems, value];
    }
    setSelectedItems(newSelection);
    if (onChange) {
      onChange(newSelection);
    }
  };

  const getDisplayText = () => {
    if (selectedItems.length === 0) {
      return placeholder;
    }
    if (selectedItems.length === 1) {
      const item = data.find((d) => d[optionValue] === selectedItems[0]);
      return item ? item[optionLabel] : "";
    }
    return `${selectedItems.length} éléments sélectionnés`;
  };

  return (
    <div className="w-full " ref={dropdownRef}>
      <div className="mb-2">
        <label> {label} </label>
      </div>
      <div
        className="relative border border-gray-300 rounded-md bg-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between p-2">
          <span
            className={
              selectedItems.length === 0 ? "text-gray-900" : "text-gray-900"
            }
          >
            {getDisplayText()}
          </span>
          <span className="absolute right-1 font-bold">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}{" "}
          </span>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="max-h-64 overflow-y-auto">
              {data?.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {data?.map((item) => (
                    <label
                      key={item[optionValue]}
                      className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item[optionValue])}
                        onChange={() => handleCheckboxChange(item[optionValue])}
                        className="w-4 h-4 cursor-pointer accent-blue-500"
                        value={value}
                      />
                      <span className="flex-1">{item[optionLabel]}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Aucun résultat trouvé
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}
