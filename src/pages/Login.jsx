import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getPostLoginPath, resolveSpace } from "../config/roles";
import Button from "../components/ui/button2";
import Input from "../components/ui/input2";
import Alert from "../components/ui/alert2";

const Login = () => {
  const { login, logout, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const location = useLocation();

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Veuillez entrer un email valide";
    }

    if (!formData.password) {
      errors.password = "Mot de passe est requis";
    } else if (formData.password.length < 6) {
      errors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const result = await login(formData);

      // Échec déjà signalé par AuthContext (identifiants incorrects, etc.)
      if (!result?.success) return;

      const identity = { userType: result.user_type, roleId: result.role_id };

      // Compte sans espace dédié dans l'application (ex. formateur interne)
      if (!resolveSpace(identity)) {
        await logout();
        setFormErrors({
          general:
            "Votre type de compte n'a pas d'espace disponible dans cette application.",
        });
        return;
      }

      // Page demandée avant la connexion, uniquement si elle appartient à
      // l'espace de cet utilisateur ; sinon son tableau de bord.
      navigate(
        getPostLoginPath({ ...identity, from: location?.state?.from }),
        { replace: true }
      );
    } catch (error) {
      console.error("Erreur lors du login:", error);
      setFormErrors({
        general: "Une erreur est survenue, veuillez réessayer.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-700">Connexion</h1>
            <p className="mt-1 text-blue-400">Accédez à votre compte</p>
          </div>
        </div>

        <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
          {/* Header with accent */}

          {/* Form Content */}
          <div className="px-8 py-8">
            {(error || formErrors.general) && (
              <Alert
                type="error"
                message={error || formErrors.general}
                onClose={error ? clearError : () => setFormErrors({})}
                className="mb-6 animate-fadeIn"
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={formErrors.email}
                    placeholder="exemple@email.com"
                    className="w-full py-3 pl-10 pr-4"
                    autoComplete="email"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-sm text-red-600 animate-fadeIn">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    error={formErrors.password}
                    placeholder="••••••••"
                    className="w-full py-3 pl-10 pr-12"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Cacher le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 transition-colors hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 transition-colors hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-sm text-red-600 animate-fadeIn">
                    {formErrors.password}
                  </p>
                )}
                <div className="flex justify-end pt-1">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-500 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full px-4 py-3 font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:shadow-lg"
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-500 bg-white">
                  Pas encore de compte ?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center w-full px-4 py-3 font-medium text-gray-700 transition-all duration-200 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-600"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            En vous connectant, vous acceptez nos{" "}
            <Link
              to="/terms"
              className="text-blue-600 hover:text-blue-500 hover:underline"
            >
              conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link
              to="/privacy"
              className="text-blue-600 hover:text-blue-500 hover:underline"
            >
              politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
