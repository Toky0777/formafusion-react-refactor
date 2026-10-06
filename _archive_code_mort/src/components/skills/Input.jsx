import { AlertCircle } from "lucide-react";
import React from "react";

export default function Input({
  onChange,
  value,
  error,
  placeholder,
  type,
  name,
  ...rest
}) {
  return (
    <div>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className="w-full focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors focus:ring-2 border border-gray-300 bg-white p-2 rounded-lg focus:outline-none placeholder:text-sm"
        {...rest}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}
