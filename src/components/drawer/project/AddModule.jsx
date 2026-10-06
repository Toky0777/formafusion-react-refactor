import axios from "../../../config/axios";
import React, { useState, useRef, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import domaineFormations from "../../../utils/domaines";
import moduleLevel from "../../../utils/moduleLevel";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import iconeAddCatalogue from "../../icones ajout catalogue/iconeAddCatalogue";

export default function AddModule({ show, handleClose, manageCourse, name }) {
  const [reference, setReference] = useState("");
  const [intitule, setIntitule] = useState(name);
  const [description, setDescription] = useState("");
  const [dureH, setDureH] = useState("");
  const [dureJ, setDureJ] = useState("");
  const [prixpersonne, setPrixPersonne] = useState("");
  const [prixgroupe, setPrixGroupe] = useState("");
  const [minAppren, setMinAppren] = useState("");
  const [maxAppren, setMaxAppren] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const [message, setMessage] = useState(null);

  const [selectedDomaine, setSelectedDomaine] = useState("");
  const [selectLevel, setSelectLevel] = useState("");

  // Fermer dropdown icônes au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDomaineChange = (e) => setSelectedDomaine(Number(e.target.value));
  const handleLevelChange = (e) => setSelectLevel(Number(e.target.value));

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedDomaine || !selectLevel || !intitule) {
      setMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const formData = {
      idLevel: selectLevel,
      id_domaine_formation: selectedDomaine,
      name: intitule,
      subtitle: description || null,
      module_reference: reference || null,
      module_dureeH: Math.max(1, parseInt(dureH) || 1),
      module_dureeJ: Math.max(1, parseInt(dureJ) || 1),
      module_price: prixpersonne || null,
      module_prix_groupe: prixgroupe || null,
      module_min_appr: minAppren || null,
      module_max_appr: maxAppren || null,
      module_icone: selectedIcon,
    };

    setLoading(true);

    try {
      const resModal = await axios.post(`/cfp/modules`, formData);

      console.log(resModal);
      console.log(resModal.data.module_id);

      manageCourse(resModal.data.module_id);

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
      setMessage("");

      toast.success("Module ajouté avec succès !");
      handleClose();
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
      <ToastContainer />

      {/* ✅ BACKGROUND SANS BLUR */}
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4 h-screen animate-fade-in">
        {/* ✅ CONTAINER DU MODAL */}
        <div
          className="w-full max-w-4xl mx-auto overflow-hidden 
          bg-white shadow-2xl rounded-2xl border border-gray-200 animate-slide-up"
        >
          {/* ✅ HEADER MODERNISÉ */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b border-gray-300">
            <h2 className="text-xl font-semibold text-gray-700">
              Ajouter un Cours
            </h2>

            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-200 rounded-full transition"
            >
              <RxCross2 size={22} className="text-red-500" />
            </button>
          </div>

          {/* ✅ MESSAGE */}
          {message && (
            <div
              className={`p-4 text-sm font-medium ${
                message.includes("succès")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* ✅ FORMULAIRE */}
          <form className="space-y-8 p-6 max-h-[75vh] overflow-y-auto custom-scroll pr-2">
            {/* === Informations Générales === */}
            <section>
              <h3 className="text-lg font-semibold text-[#5B345B] mb-4">
                Informations Générales
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Domaine */}
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Domaine * <span className="text-red-500">obligatoire</span>
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={selectedDomaine}
                    onChange={handleDomaineChange}
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
                  <label className="block mb-2 text-sm text-gray-700">
                    Niveau * <span className="text-red-500">obligatoire</span>
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={selectLevel}
                    onChange={handleLevelChange}
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
                    Référence
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full p-3 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Intitulé de la formation
                    <span className="text-red-500 ml-1">obligatoire</span>
                  </label>
                  <input
                    type="text"
                    value={intitule}
                    onChange={(e) => setIntitule(e.target.value)}
                    className="w-full p-3 border rounded-md"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block mb-2 text-sm text-gray-700">
                  Description courte
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border rounded-md"
                />
              </div>
            </section>

            {/* === Tarification === */}
            <section>
              <h3 className="text-lg font-semibold text-[#5B345B] mb-4">
                Prix de la formation
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Prix personne */}
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Prix par personne
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={prixpersonne}
                      onChange={(e) => setPrixPersonne(e.target.value)}
                      className="w-full p-3 pr-12 border rounded-md"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 px-2 text-sm rounded">
                      ar
                    </span>
                  </div>
                </div>

                {/* Prix groupe */}
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Prix par groupe
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={prixgroupe}
                      onChange={(e) => setPrixGroupe(e.target.value)}
                      className="w-full p-3 pr-12 border rounded-md"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 px-2 text-sm rounded">
                      ar
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* === Durée === */}
            <section>
              <h3 className="text-lg font-semibold text-[#5B345B] mb-4">
                Durée de la formation
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* heures */}
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Durée (heures)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={dureH}
                      onChange={(e) => setDureH(e.target.value)}
                      className="w-full p-3 pr-12 border rounded-md"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 px-2 text-sm rounded">
                      h
                    </span>
                  </div>
                </div>

                {/* jours */}
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Durée (jours)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={dureJ}
                      onChange={(e) => setDureJ(e.target.value)}
                      className="w-full p-3 pr-12 border rounded-md"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 px-2 text-sm rounded">
                      j
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* === Apprenants === */}
            <section>
              <h3 className="text-lg font-semibold text-[#5B345B] mb-2">
                Nombre d'apprenants
              </h3>

              <p className="text-xs mb-3 text-gray-500">
                Pour les formations de groupe ou de personne, précisez les
                tailles minimales et maximales.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Minimum
                  </label>
                  <input
                    type="number"
                    value={minAppren}
                    onChange={(e) => setMinAppren(e.target.value)}
                    className="w-full p-3 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Maximum
                  </label>
                  <input
                    type="number"
                    value={maxAppren}
                    onChange={(e) => setMaxAppren(e.target.value)}
                    className="w-full p-3 border rounded-md"
                  />
                </div>
              </div>
            </section>

            {/* === Icone === */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-[#5B345B]">
                Choisir une icone <span className="text-red-500">*</span>
              </label>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-24 p-3 border rounded flex items-center justify-center"
                >
                  {selectedIcon
                    ? React.createElement(iconeAddCatalogue[selectedIcon], {
                        size: 24,
                      })
                    : "Choisir"}
                </button>

                {isOpen && (
                  <div className="absolute mt-1 w-full max-h-48 overflow-y-auto border rounded bg-white z-50 grid grid-cols-10 gap-2 p-2 shadow-lg">
                    {Object.keys(iconeAddCatalogue).map((key) => {
                      const IconComponent = iconeAddCatalogue[key];
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setSelectedIcon(key);
                            setIsOpen(false);
                          }}
                          type="button"
                          className="p-2 hover:bg-gray-100 rounded flex justify-center"
                        >
                          <IconComponent size={24} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* === Bouton === */}
            <button
              onClick={handleSubmitModal}
              className="bg-[#5B345B] text-white px-6 py-3 rounded-xl text-sm font-medium 
              hover:bg-[#4a2b4a] active:scale-95 transition shadow-md w-full md:w-auto"
            >
              {loading ? "Chargement..." : "Ajouter ce cours"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
