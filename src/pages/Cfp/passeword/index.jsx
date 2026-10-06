import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "../../../config/axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setErrors({});

    try {
      const res = await axios.put("/cfp/security/change-password", formData);

      setStatus(res.data.message || "Mot de passe mis à jour avec succès.");
      setFormData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });

      // Navigation après succès
      navigate("/cfp/profile");
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ general: ["Erreur de connexion au serveur."] });
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-[90vh]">
      {/* Message de succès */}
      {status && (
        <div className="p-3 mb-3 text-green-700 bg-green-100 border border-green-400 rounded">
          {status}
        </div>
      )}

      {/* Erreurs */}
      {Object.keys(errors).length > 0 && (
        <div className="p-3 mb-3 text-red-700 bg-red-100 border border-red-400 rounded">
          <ul>
            {Object.entries(errors).map(([field, msgs]) =>
              msgs.map((msg, idx) => <li key={`${field}-${idx}`}>{msg}</li>)
            )}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="container flex flex-col gap-3 p-4 mx-auto sm:w-full lg:w-1/2">
          <div>
            <p className="text-2xl font-semibold text-gray-700">
              Changer le mot de passe de votre CENTRE DE FORMATION.
            </p>
            <p className="text-lg text-gray-500">
              Votre mot de passe doit comporter au moins 8 caractères, incluant
              des chiffres, des lettres et des caractères spéciaux (!$@%).
            </p>
          </div>

          {/* Mot de passe actuel */}
          <div className="relative">
            <input
              type={showPassword.current ? "text" : "password"}
              name="current_password"
              placeholder="Mot de passe actuel"
              className="w-full px-3 py-2 border rounded"
              value={formData.current_password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2"
              onClick={() => toggleVisibility("current")}
            >
              {showPassword.current ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Nouveau mot de passe */}
          <div className="relative">
            <input
              type={showPassword.new ? "text" : "password"}
              name="new_password"
              placeholder="Nouveau mot de passe"
              className="w-full px-3 py-2 border rounded"
              value={formData.new_password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2"
              onClick={() => toggleVisibility("new")}
            >
              {showPassword.new ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Confirmer nouveau mot de passe */}
          <div className="relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="new_password_confirmation"
              placeholder="Confirmer nouveau mot de passe"
              className="w-full px-3 py-2 border rounded"
              value={formData.new_password_confirmation}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2"
              onClick={() => toggleVisibility("confirm")}
            >
              {showPassword.confirm ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <div>
            <a href="/forgot" className="font-semibold text-blue-500">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            className="py-2 border rounded-md hover:bg-[#804c80] text-white bg-[#a462a4] font-semibold text-center"
          >
            Changer le mot de passe
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
