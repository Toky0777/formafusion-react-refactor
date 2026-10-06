import axios from "../../../config/axios";
import React, { useState, useRef, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import domaineFormations from "../../../utils/domaines";
import moduleLevel from "../../../utils/moduleLevel";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import iconeAddCatalogue from "../../icones ajout catalogue/iconeAddCatalogue";


export default function Modal({ show, handleClose, onModuleAdded }) {

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
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    //pour l'icone
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    const navigate = useNavigate();

    // affichage message d'erreur
    const [message, setMessage] = useState(null);

    // affichage des domaines
    const [selectedDomaine, setSelectedDomaine] = useState('');
    const handleDomaineChange = (event) => {
        setSelectedDomaine(Number(event.target.value));
    };

    // affichage moduleLevel
    const [selectLevel, setSelectLevel] = useState('');
    const handleLevelChange = (event) => {
        setSelectLevel(Number(event.target.value));
    }
    const handleSubmitModal = async (e) => {
        e.preventDefault();
        setMessage(null);

        // Vérification des champs obligatoires
        if (
            !selectedDomaine ||
            !selectLevel ||
            !intitule 
        ) {
            setMessage("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        // Préparation des données à envoyer à l'API
        const formData = {
            idLevel: selectLevel,
            id_domaine_formation: selectedDomaine,
            name: intitule,
            subtitle: description || null,
            module_reference: reference || null ,
            module_dureeH: Math.max(1, parseInt(dureH) || 1) || null,
            module_dureeJ: Math.max(1, parseInt(dureJ) || 1) || null,
            module_price: prixpersonne || null,
            module_prix_groupe: prixgroupe || null,
            module_min_appr: minAppren || null,
            module_max_appr: maxAppren || null,
            module_icone: selectedIcon
        };

        console.log(formData);

        setLoading(true);

        try {
            // Envoi du module au backend via l'API
            const resModal = await axios.post(`/cfp/modules`, formData);
            const createModule = resModal.data.data || formData;

            // Mise à jour du parent CatalogLayout
            onModuleAdded(createModule, true);

            // ---- 🔹 Mise à jour manuelle du localStorage ----
            const stored = JSON.parse(localStorage.getItem("onlineModules")) || [];
            const updatedStored = [...stored];

            // Vérifier si le domaine existe déjà
            const domainIndex = updatedStored.findIndex(
                (d) => d.domaine === createModule.domaine
            );

            if (domainIndex !== -1) {
                // Ajouter le module au domaine existant
                updatedStored[domainIndex].modules.unshift(createModule);
                updatedStored[domainIndex].count_module += 1;
            } else {
                // Créer un nouveau domaine avec ce module
                updatedStored.unshift({
                    domaine: createModule.domaine,
                    modules: [createModule],
                    count_module: 1,
                });
            }

            // Sauvegarde dans le localStorage
            localStorage.setItem("onlineModules", JSON.stringify(updatedStored));

            // Réinitialisation du formulaire
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

            // Notification succès
            toast.success("Module ajouté avec succès !");
            handleClose();

            setTimeout(() => {
                navigate('preparation')
            }, 2000)
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

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center px-4 h-[100vh]">
                <div className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-2xl rounded-2xl animate-fade-in " data-aos="fade-down" data-aos-delay="300">

                    {/* Header */}
                    <div className="flex items-center justify-between bg-slate-200 px-6 py-4">
                        <h2 className="text-lg  text-gray-500 md:text-xl">Ajouter un Cours</h2>
                        <button onClick={handleClose} className="p-2 transition rounded-full hover:bg-white/10">
                            <RxCross2 size={24} className="text-red-500" />
                        </button>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`p-4 text-sm font-medium ${message.includes("succès") ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} data-aos="zoom-in-up" data-aos-delay="300">
                            {message}
                        </div>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={handleSubmitModal} className="space-y-8 p-6 max-h-[75vh] overflow-y-auto custom-scroll pr-2">

                        {/* === Informations Générales === */}
                        <section>
                            <h3 className="text-lg font-semibold text-[#5B345B] mb-4">Informations Générales</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Domaine */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Domaine * <span className="text-red-500">obligatoire</span></label>
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B345B]"
                                        value={selectedDomaine}
                                        onChange={handleDomaineChange}
                                    >
                                        <option value="">-- Choisir un domaine --</option>
                                        {/* {domaineFormations.map(d => (
                                            <option key={d.idDomaine} value={d.idDomaine}>{d.nomDomaine}</option>
                                        ))} */}
                                        {domaineFormations
                                            .slice()
                                            .sort((a, b) => a.nomDomaine.localeCompare(b.nomDomaine))
                                            .map(d => (
                                                <option key={d.idDomaine} value={d.idDomaine}>
                                                    {d.nomDomaine}
                                                </option>
                                            ))}

                                    </select>
                                </div>

                                {/* Niveau */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Niveau * <span className="text-red-500">obligatoire</span></label>
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B345B]"
                                        value={selectLevel}
                                        onChange={handleLevelChange}
                                    >
                                        <option value="">-- Sélectionner votre niveau --</option>
                                        {moduleLevel.map(level => (
                                            <option key={level.idLevel} value={level.idLevel}>{level.module_level_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Référence & Intitulé */}
                            <div className="grid gap-6 mt-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm text-gray-700">Référence </label>
                                    <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} className="w-full p-3 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm text-gray-700">Intitulé de la formation <span className="text-red-500">obligatoire</span></label>
                                    <input type="text" value={intitule} onChange={(e) => setIntitule(e.target.value)} className="w-full p-3 border rounded-md"  />
                                </div>
                            </div>

                            {/* Description courte */}
                            <div className="mt-4">
                                <label className="block mb-2 text-sm text-gray-700">Description courte </label>
                                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border rounded-md"  />
                            </div>
                        </section>

                        {/* === Tarification === */}
                        <section>
                            <h3 className="text-lg font-semibold text-[#5B345B] mb-4">Prix de la formation</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm text-gray-700">Prix par personne </label>
                                    <div className="relative">
                                        <input type="number" value={prixpersonne} onChange={(e) => setPrixPersonne(e.target.value)} className="w-full p-3 pr-12 border rounded-md"  />
                                        <span className="absolute px-2 text-sm text-gray-600 -translate-y-1/2 bg-gray-100 rounded right-3 top-1/2">ar</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm text-gray-700">Prix par groupe </label>
                                    <div className="relative">
                                        <input type="number" value={prixgroupe} onChange={(e) => setPrixGroupe(e.target.value)} className="w-full p-3 pr-12 border rounded-md"  />
                                        <span className="absolute px-2 text-sm text-gray-600 -translate-y-1/2 bg-gray-100 rounded right-3 top-1/2">ar</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* === Durée === */}
                        <section>
                            <h3 className="text-lg font-semibold text-[#5B345B] mb-4">Durée de la formation</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm text-gray-700">Durée (heures) </label>
                                    <div className="relative" >
                                        <input type="number" value={dureH} onChange={(e) => setDureH(e.target.value)} className="w-full p-3 pr-12 border rounded-md" />
                                        <span className="absolute px-2 text-sm text-gray-600 -translate-y-1/2 bg-gray-100 rounded right-3 top-1/2">heure</span>
                                    </div>

                                </div>
                                <div>
                                    <label className="block mb-2 text-sm text-gray-700">Durée (jours) </label>
                                    <div className="relative" >
                                        <input type="number" value={dureJ} onChange={(e) => setDureJ(e.target.value)} className="w-full p-3 pr-12 border rounded-md" />
                                        <span className="absolute px-2 text-sm text-gray-600 -translate-y-1/2 bg-gray-100 rounded right-3 top-1/2">jour</span>
                                    </div>

                                </div>

                            </div>

                        </section>

                        {/* === Apprenants === */}
                        <section>
                            <h3 className="text-lg font-semibold text-[#5B345B] mb-2">Nombre d'apprenants</h3>
                            <p className="mb-3 text-xs text-slate-500">Pour les formations de groupe ou de personne, précisez les tailles minimales et maximales.</p>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm text-gray-700">Minimum </label>
                                    <input type="number" value={minAppren} onChange={(e) => setMinAppren(e.target.value)} className="w-full p-3 border rounded-md"  />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm text-gray-700">Maximum </label>
                                    <input type="number" value={maxAppren} onChange={(e) => setMaxAppren(e.target.value)} className="w-full p-3 border rounded-md"  />
                                </div>
                            </div>
                        </section>

                        {/* === Choisir une icone === */}
                        <div className=" w-full space-y-2">
                            <label className="text-lg font-medium text-[#5B345B] ">Choisir une icone * <span className="text-red-500 ext-sm">obligatoire</span></label>

                            <div className="relative" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    type="button"
                                    className="w-24 p-3 border rounded flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#5B345B]"
                                >
                                    {selectedIcon ? React.createElement(iconeAddCatalogue[selectedIcon], { size: 24 }) : "Choisir"}
                                </button>

                                {isOpen && (
                                    <div className="absolute mt-1 w-full max-h-48 overflow-y-auto border rounded bg-white z-50 grid grid-cols-10 gap-2 p-2">
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
                                                    className="flex items-center justify-center p-2 hover:bg-gray-100 rounded"
                                                >
                                                    <IconComponent size={24} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* === Bouton en bas === */}
                        <button type="submit" className="bg-slate-100 text-gray-500 px-6 py-3 rounded-lg text-sm transition">
                            Ajouter ce cours
                        </button>

                    </form>
                </div>
            </div>

        </>

    );
}