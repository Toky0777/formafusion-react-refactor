import { useState } from "react";
import { Plus, X } from "lucide-react";

export const AddSkillForm = ({ onAdd, idModule, skills }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (skillName.trim().length < 2) {
      setError("Le nom du skill doit contenir au moins 2 caractères.");
      return;
    }

    onAdd({ idModule, name: skillName.trim() });
    setSkillName("");
    setError("");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSkillName("");
    setError("");
    setIsOpen(false);
  };

  const handleClick = () => {
    setIsOpen(true);
  };

  if (skills.length >= 9) {
    return (
      <p className="text-sm text-red-500 font-medium">
        Vous avez atteint la limite maximale de 9 skills.
      </p>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-4 py-1 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 hover:shadow-sm cursor-pointer"
      >
        <Plus size={16} />
        Ajouter une skill
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="inline-flex flex-col gap-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={skillName}
          onChange={(e) => {
            setSkillName(e.target.value);
            if (e.target.value.trim().length >= 2) setError("");
          }}
          placeholder="Nom du skill"
          className={`px-3 py-2 border rounded-md text-sm focus:outline-none ${
            error
              ? "border-red-400 focus:ring-2 focus:ring-red-300"
              : "border-gray-300 focus:ring-2 focus:ring-blue-500"
          }`}
          autoFocus
          required
        />

        <button
          type="submit"
          className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
        >
          Ajouter
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
};
