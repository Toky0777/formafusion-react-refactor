import { AlertCircle } from "lucide-react";
import T from "../translate/AutoTranslator";

export default function SelectForm({
  data = [],
  name,
  value,
  onChange,
  optionValue,
  optionLabel,
  label,
  error,
}) {
  return (
    <div>
      <div className="mb-2">
        <label className="text-sm font-semibold text-gray-600">
          <T>{label}</T>
        </label>
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors focus:ring-2 border border-gray-300 bg-white p-2 rounded-lg focus:outline-none placeholder:text-sm disabled:cursor-not-allowed disabled:bg-gray-200"
      >
        <option value="" disabled>
          <T asText> -- Sélectionner --</T>
        </option>
        {data?.map((e) => (
          <option key={e[optionValue]} value={e[optionValue]}>
            {e[optionLabel]}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          <T>{error}</T>
        </p>
      )}
    </div>
  );
}
