import React from "react";

const RadioGroup = ({ name, options, selectedValue, onChange, label }) => {
    return (
      <fieldset className="mb-6">
        <legend className="mb-2 font-medium text-gray-700">{label}</legend>
        <div className="space-y-2">
          {options.map(option => (
            <div className="flex items-center" key={option.value}>
              <input 
                type="radio" 
                id={`${name}-${option.value}`}
                name={name}
                checked={selectedValue === option.value}
                onChange={() => onChange(option.value)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label 
                htmlFor={`${name}-${option.value}`}
                className="ml-2 text-sm text-gray-700"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    );
};

export default RadioGroup;
