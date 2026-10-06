import axios from "../../../config/axios";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import domaineFormations from "../../../utils/domaines";
import moduleLevel from "../../../utils/moduleLevel";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ModalAddOnline({ show, handleClose, onModuleAdded }) {
  const [reference, setReference] = useState("");
  const [intitule, setIntitule] = useState("");
  const [description, setDescription] = useState("");
  const [dureH, setDureH] = useState("");
  const [dureJ, setDureJ] = useState("");
  const [prixpersonne, setPrixPersonne] = useState("");
  const [prixgroupe, setPrixGroupe] = useState("");
  const [minAppren, setMinAppren] = useState("");
  const [maxAppren, setMaxAppren] = useState("");
  const [loading, setLoading] = useState(false);

  // Sélections
  const [selectedDomaine, setSelectedDomaine] = useState("");
  const [selectLevel, setSelectLevel] = useState("");

  // Message interne (erreur validation)
  const [message, setMessage] = useState(null);

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Vérification des champs obligatoires
    if (!selectedDomaine || !selectLevel || !reference || !intitule || !description) {
      setMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Préparation des données
    const formData = {
      idLevel: selectLevel,
      id_domaine_formation: selectedDomaine,
      name: intitule,
      module_tag: intitule,
      subtitle: description,
      module_reference: reference,
      module_dureeH: Math.max(1, parseInt(dureH) || 1),
      module_dureeJ: Math.max(1, parseInt(dureJ) || 1),
      module_price: prixpersonne,
      module_prix_groupe: prixgroupe,
      module_min_appr: minAppren,
      module_max_appr: maxAppren,
    };

    setLoading(true);

    try {
      const res = await axios.post(`/cfp/modules/public`, formData);
      const createModule = res.data?.data || formData;

    
      onModuleAdded(createModule);


      toast.success("Module ajouté avec succès !");

      handleClose();

      setSelectLevel("");
      setSelectedDomaine("");
      setReference("");
      setIntitule("");
      setDescription("");
      setDureH("");
      setDureJ("");
      setPrixPersonne("");
      setPrixGroupe("");
      setMinAppren("");
      setMaxAppren("");
    } catch (error) {
      console.error("Erreur ajout module:", error);
      toast.error("Une erreur est survenue lors de l'ajout.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center px-4 h-[100vh]">
        <div
          className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-2xl rounded-2xl animate-fade-in"
          data-aos="fade-down"
          data-aos-delay="300"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-[#5B345B] px-6 py-4">
            <h2 className="text-lg font-bold text-white md:text-xl">Ajouter un Cours</h2>
            <button
              onClick={handleClose}
              className="p-2 transition rounded-full hover:bg-white/10"
            >
              <RxCross2 size={24} className="text-red-500" />
            </button>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-4 text-sm font-medium ${
                message.includes("succès")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
              data-aos="zoom-in-up"
              data-aos-delay="300"
            >
              {message}
            </div>
          )}

          {/* Formulaire */}
          <form
            onSubmit={handleSubmitModal}
            className="space-y-8 p-6 max-h-[75vh] overflow-y-auto custom-scroll pr-2"
          >
            {/* === Informations Générales === */}
            <section>
              <h3 className="text-lg font-semibold text-[#5B345B] mb-4">
                Informations Générales
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Domaine */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Domaine *
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B345B]"
                    value={selectedDomaine}
                    onChange={(e) => setSelectedDomaine(Number(e.target.value))}
                  >
                    <option value="">-- Choisir un domaine --</option>
                    {domaineFormations
                      .slice()
                      .sort((a, b) => a.nomDomaine.localeCompare(b.nomDomaine))
                      .map((d) => (
                        <option key={d.idDomaine} value={d.idDomaine}>
                          {d.nomDomaine}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Niveau */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Niveau *
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B345B]"
                    value={selectLevel}
                    onChange={(e) => setSelectLevel(Number(e.target.value))}
                  >
                    <option value="">-- Sélectionner votre niveau --</option>
                    {moduleLevel.map((level) => (
                      <option key={level.idLevel} value={level.idLevel}>
                        {level.module_level_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Référence & Intitulé */}
              <div className="grid gap-6 mt-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Référence *
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Intitulé de la formation *
                  </label>
                  <input
                    type="text"
                    value={intitule}
                    onChange={(e) => setIntitule(e.target.value)}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                </div>
              </div>

              {/* Description courte */}
              <div className="mt-4">
                <label className="block mb-2 text-sm text-gray-700">
                  Description courte *
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
            </section>

            {/* Tarification */}
            <section>
              <h3 className="text-lg font-semibold text-[#5B345B] mb-4">
                Prix de la formation
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Prix par personne *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={prixpersonne}
                      onChange={(e) => setPrixPersonne(e.target.value)}
                      className="w-full p-3 pr-12 border rounded-md"
                      required
                    />
                    <span className="absolute px-2 text-sm text-gray-600 -translate-y-1/2 bg-gray-100 rounded right-3 top-1/2">
                      ar
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Prix par groupe *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={prixgroupe}
                      onChange={(e) => setPrixGroupe(e.target.value)}
                      className="w-full p-3 pr-12 border rounded-md"
                      required
                    />
                    <span className="absolute px-2 text-sm text-gray-600 -translate-y-1/2 bg-gray-100 rounded right-3 top-1/2">
                      ar
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Durée */}
            <section>
              <h3 className="text-lg font-semibold text-[#5B345B] mb-4">
                Durée de la formation
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Durée (heures) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={dureH}
                      onChange={(e) => setDureH(e.target.value)}
                      className="w-full p-3 pr-12 border rounded-md"
                      required
                    />
                    <span className="absolute px-2 text-sm text-gray-600 -translate-y-1/2 bg-gray-100 rounded right-3 top-1/2">
                      heure
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Durée (jours) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={dureJ}
                      onChange={(e) => setDureJ(e.target.value)}
                      className="w-full p-3 pr-12 border rounded-md"
                      required
                    />
                    <span className="absolute px-2 text-sm text-gray-600 -translate-y-1/2 bg-gray-100 rounded right-3 top-1/2">
                      jour
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Apprenants */}
            <section>
              <h3 className="text-lg font-semibold text-[#5B345B] mb-2">
                Nombre d'apprenants
              </h3>
              <p className="mb-3 text-xs text-slate-500">
                Pour les formations de groupe ou de personne, précisez les tailles minimales et
                maximales.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Minimum *
                  </label>
                  <input
                    type="number"
                    value={minAppren}
                    onChange={(e) => setMinAppren(e.target.value)}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Maximum *
                  </label>
                  <input
                    type="number"
                    value={maxAppren}
                    onChange={(e) => setMaxAppren(e.target.value)}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Bouton */}
            <div className="text-right">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#5B345B] hover:bg-[#472747] text-white px-6 py-3 rounded-lg text-sm font-semibold transition disabled:opacity-50"
              >
                {loading ? "Ajout..." : "Ajouter ce cours"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
