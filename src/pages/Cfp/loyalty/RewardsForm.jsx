import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import MultiSelect from "../../../components/ui/MultiSelect";
import SelectWithSearch from "../../../components/ui/SelectWithSearch";
import axios from "../../../config/axios";
import { LoadingOverlay } from "../../../components/loading/LoadingScreen";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import T from "../../../components/translate/AutoTranslator";

function randomText(length = 3) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

export default function RewardsForm() {
  const [rewardsData, setRewardsData] = useState({
    rewardsType: [],
    etps: [],
    mdls: [],
    rewardsScope: [],
  });

  useEffect(() => {
    const allData = async () => {
      try {
        const res = await axios.get("/cfp/rewards");

        setRewardsData({
          rewardsScope: res.data.reward_scopes,
          etps: res.data.etps.entreprises,
          mdls: res.data.catalogues.modules,
          rewardsType: res.data.reward_types,
        });
      } catch (error) {
        console.log(error);
      }
    };
    allData();
  }, []);

  const [form, setForm] = useState({
    reward_type: "",
    reward_percentage: "",
    idEntreprise: "",
    place_number: "",
    expired_date: "",
    start_date: "",
    normal_price_per_place: "",
    description: "",
    reward_scope: "",
    modules: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validation du type de récompense
    if (!form.reward_type) {
      newErrors.reward_type = "Le type de récompense est requis";
    }

    // Validation de la valeur de réduction si le type est réduction (2)
    if (form.reward_type === "2") {
      if (!form.reward_percentage) {
        newErrors.reward_percentage = "Le pourcentage de réduction est requis";
      } else if (form.reward_percentage < 1 || form.reward_percentage > 100) {
        newErrors.reward_percentage = "Le pourcentage doit être entre 1 et 100";
      }
    }

    // Validation de l'entreprise
    if (!form.idEntreprise) {
      newErrors.idEntreprise = "La sélection d'une entreprise est requise";
    }

    // Validation du nombre de places
    if (!form.place_number) {
      newErrors.place_number = "Le nombre de places est requis";
    } else if (form.place_number < 1 || form.place_number > 100) {
      newErrors.place_number = "Le nombre de places doit être entre 1 et 100";
    }

    // Validation du prix normal
    if (!form.normal_price_per_place) {
      newErrors.normal_price_per_place = "Le prix normal est requis";
    } else if (form.normal_price_per_place <= 0) {
      newErrors.normal_price_per_place = "Le prix doit être supérieur à 0";
    }

    // Validation de la description
    if (!form.description) {
      newErrors.description = "La description est requise";
    } else if (form.description.length < 10) {
      newErrors.description =
        "La description doit contenir au moins 10 caractères";
    }

    if (!form.start_date) {
      newErrors.start_date = "La date de début est requise";
    } else {
      const today = new Date();
      const startDate = new Date(form.start_date);
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.start_date =
          "La date de début ne peut pas être dans le passé";
      }

      if (form.expired_date) {
        const expirationDate = new Date(form.expired_date);
        if (startDate >= expirationDate) {
          newErrors.start_date =
            "La date de début doit être avant la date d'expiration";
        }
      }
    }

    if (!form.expired_date) {
      newErrors.expired_date = "La date d'expiration est requise";
    } else {
      const today = new Date();
      const expirationDate = new Date(form.expired_date);
      today.setHours(0, 0, 0, 0);

      if (expirationDate <= today) {
        newErrors.expired_date = "La date d'expiration doit être dans le futur";
      }
    }

    // Validation du scope de la récompense
    if (!form.reward_scope) {
      newErrors.reward_scope = "Veuillez sélectionner une portée";
    }

    // Validation des modules si scope est "2" (spécifique)
    if (form.reward_scope === "2" && form.modules.length === 0) {
      newErrors.modules = "Veuillez sélectionner au moins un module";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
      setIsSubmitted(false);
      return;
    }

    const data = {
      reward_name: randomText(),
      reward_type: Number(form.reward_type),
      reward_percentage: Number(form.reward_percentage),
      idEntreprise: form.idEntreprise,
      place_number: Number(form.place_number),
      expired_date: form.expired_date,
      start_date: form.start_date,
      normal_price_per_place: Number(form.normal_price_per_place),
      description: form.description,
      reward_scope: Number(form.reward_scope),
      idModule: form.modules,
    };

    try {
      const res = await axios.post("cfp/rewards", data);
      setForm({
        reward_type: "",
        reward_percentage: "",
        idEntreprise: "",
        place_number: "",
        expired_date: "",
        start_date: "",
        normal_price_per_place: "",
        description: "",
        reward_scope: "",
        modules: [],
      });
      setErrors({});
      toastr.success(res.data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <div>
      {isSubmitted && <LoadingOverlay />}
      <Link
        to="/cfp/loyalty_rewards/list"
        className="flex items-center gap-2 text-sm mb-5 ml-10 hover:text-blue-500"
      >
        <ChevronLeft size={20} />
        <span>
          <T>Retour</T>
        </span>
      </Link>
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white shadow-xl rounded-2xl w-full overflow-hidden">
          {/* Header avec fond coloré */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">
              <T>Créer une récompense</T>
            </h1>
            <p className="text-blue-100">
              <T>
                Remplissez les informations ci-dessous pour créer une nouvelle
                récompense
              </T>
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6" noValidate>
            {/* Type de récompense */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <T>Type de récompense</T>
                </label>
                <select
                  name="reward_type"
                  value={form.reward_type}
                  onChange={handleChange}
                  className={`w-full text-sm border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white ${
                    errors.reward_type ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <option value="">
                    <T>-- Choisir un type --</T>
                  </option>
                  {rewardsData.rewardsType.map((r) => (
                    <option value={r.id} key={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {errors.reward_type && (
                  <p className="mt-1 text-sm text-red-600">
                    <T>{errors.reward_type}</T>
                  </p>
                )}
              </div>

              {/* Affichage conditionnel pour la valeur de réduction */}
              {form.reward_type === "2" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    <T> Valeur de réduction (%)</T>
                  </label>
                  <input
                    type="number"
                    name="reward_percentage"
                    min="1"
                    value={form.reward_percentage}
                    onChange={handleChange}
                    className={`w-full text-sm border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.reward_percentage
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="20%"
                  />
                  {errors.reward_percentage && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.reward_percentage}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Entreprise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SelectWithSearch
                  etps={rewardsData.etps}
                  onChange={(id) => {
                    setForm((prev) => ({ ...prev, idEntreprise: id }));
                    if (errors.idEntreprise) {
                      setErrors((prev) => ({ ...prev, idEntreprise: "" }));
                    }
                  }}
                  hasError={!!errors.idEntreprise}
                />
                {errors.idEntreprise && (
                  <p className="mt-1 text-sm text-red-600">
                    <T>{errors.idEntreprise}</T>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <T>Nombre de place</T>
                </label>
                <input
                  type="number"
                  name="place_number"
                  min="1"
                  max="100"
                  value={form.place_number}
                  onChange={handleChange}
                  className={`w-full text-sm border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.place_number ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="6"
                />
                {errors.place_number && (
                  <p className="mt-1 text-sm text-red-600">
                    <T>{errors.place_number}</T>
                  </p>
                )}
              </div>
            </div>

            {/* Prix normal par place */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <T>Prix normal par place</T>
              </label>
              <input
                type="number"
                name="normal_price_per_place"
                value={form.normal_price_per_place}
                onChange={handleChange}
                className={`w-full text-sm border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.normal_price_per_place
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="1 500 000"
              />
              {errors.normal_price_per_place && (
                <p className="mt-1 text-sm text-red-600">
                  <T>{errors.normal_price_per_place}</T>
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <T>Description</T>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className={`w-full text-sm border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition min-h-[120px] ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  <T>{errors.description}</T>
                </p>
              )}
            </div>

            {/* Date d'expiration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <T>Date de début</T>
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  className={`w-full border text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.start_date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-600">
                    <T>{errors.start_date}</T>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <T>Date d'expiration</T>
                </label>
                <input
                  type="date"
                  name="expired_date"
                  value={form.expired_date}
                  onChange={handleChange}
                  className={`w-full border text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.expired_date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.expired_date && (
                  <p className="mt-1 text-sm text-red-600">
                    <T>{errors.expired_date}</T>
                  </p>
                )}
              </div>
            </div>

            {/* Scope de la récompense */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <T>Portée de la récompense</T>
              </label>
              <div className="flex items-center gap-2">
                {rewardsData.rewardsScope.map((r) => (
                  <label
                    className={`flex items-center p-3 text-sm rounded-lg hover:bg-blue-50 cursor-pointer transition ${
                      errors.reward_scope ? "border border-red-500" : ""
                    }`}
                    key={r.id}
                  >
                    <input
                      type="radio"
                      name="reward_scope"
                      value={r.id}
                      onChange={handleChange}
                      className="text-blue-600 focus:ring-blue-500 mr-3"
                    />
                    <span> {r.description} </span>
                  </label>
                ))}
              </div>
              {errors.reward_scope && (
                <p className="mt-1 text-sm text-red-600">
                  <T>{errors.reward_scope}</T>
                </p>
              )}
            </div>

            {form.reward_scope === "2" && (
              <div>
                <MultiSelect
                  mdls={rewardsData.mdls}
                  onSelect={(selected) => {
                    setForm((prev) => ({
                      ...prev,
                      modules: selected.map((s) => s.idModule),
                    }));
                    if (errors.modules) {
                      setErrors((prev) => ({ ...prev, modules: "" }));
                    }
                  }}
                  hasError={!!errors.modules}
                />
                {errors.modules && (
                  <p className="mt-1 text-sm text-red-600">
                    {" "}
                    <T>{errors.modules}</T>{" "}
                  </p>
                )}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition font-medium"
              >
                {isSubmitted ? <T>Enregistrement...</T> : <T>Enregistrer</T>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
