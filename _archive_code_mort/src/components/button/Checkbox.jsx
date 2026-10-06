import { useState } from "react";
export function Checkbox({checked, onChange}) {
    const [enabled, setEnabled] = useState(false);

    return (
        <label className="flex items-center cursor-pointer">
            {/* Input invisible avec peer */}
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={onChange}
            />

            {/* Track */}
            <div className="relative h-6 transition-colors bg-gray-400 rounded-full w-11 peer-checked:bg-purple-600">
                {/* Thumb (boule) */}
                <div
                    className={`bg-white w-5 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                    checked ? "translate-x-6" : ""
                    }`}
                />
            </div>
            </label>
        
    );
}