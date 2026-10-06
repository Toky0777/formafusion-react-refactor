import { RxCross2 } from "react-icons/rx";
import domaines from "../../../utils/domaines";
import moduleLevel from "../../../utils/moduleLevel";
import React, { useState, useEffect, useRef } from "react";
import axios from "../../../config/axios";
import { useParams } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import iconeAddCatalogue from "../../icones ajout catalogue/iconeAddCatalogue";

export default function ModalFormation({ showFormation, closeFormation, moduleData, onUpdate }) {

    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [selectedIconUpdate, setSelectedIconUpdate] = useState(null);
    const dropdownRefUpdate = useRef();


    console.log(moduleData);
    //pour l'icone
    useEffect(() => {
        const handleClickOutsideUpdate = (e) => {
            if (dropdownRefUpdate.current && !dropdownRefUpdate.current.contains(e.target)) {
                setIsOpenUpdate(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideUpdate);
        return () => document.removeEventListener("mousedown", handleClickOutsideUpdate);
    }, []);

    const imageNameUpdate = moduleData.module_image?.trim();
    let IconComponentUpdate = imageNameUpdate ? iconeAddCatalogue[imageNameUpdate] : null;
    const [iconCompUpdate, setIconCompUpdate] = useState(IconComponentUpdate || null);



    // affichage des domaines
    const [selectedDomaine, setSelectedDomaine] = useState(null);
    // const [selectedDomaine, setSelectedDomaine] = useState(moduleData?.module_domain_id || '');
    const handleDomaineChange = (event) => {
        const value = event.target.value;
        setSelectedDomaine(value === "" ? null : Number(value));
    };
    // affichage moduleLevel
    const [selectLevel, setSelectLevel] = useState(null);
    // const [selectLevel, setSelectLevel] = useState(moduleData?.module_level_id || '');
    const handleLevelChange = (event) => {
        const value = event.target.value;
        setSelectLevel(value === "" ? null : Number(value));
    }

    //recupération des données pour faire une modification(formation de base)
    const [formData, setFormData] = useState({
        module_reference: '',
        name: '',
        subtitle: '',
        description: '',
        domaine: '',
        level: '',
        price_individual: '',
        price_group: '',
        duration_hours: '',
        duration_days: '',
        min_students: '',
        max_students: ''
    });

    // Initialiser les données quand le modal s'ouvre ou que moduleData change
    useEffect(() => {
        if (moduleData) {
            setFormData({
                module_reference: moduleData.module_reference || '',
                name: moduleData.module_name || '',
                subtitle: moduleData.module_subtitle || '',
                description: moduleData.module_description || '',
                price_individual: moduleData.module_price || '',
                price_group: moduleData.module_group_price || '',
                duration_hours: moduleData.dureeH || '',
                duration_days: moduleData.dureeJ || '',
                min_students: moduleData.minApprenant || '',
                max_students: moduleData.maxApprenant || '',
                domaine: moduleData.module_domain_name || '',
                level: moduleData.module_level_name || '',


            });

            const domaine = domaines.find(d => d.nomDomaine === moduleData.module_domain_name);
            setSelectedDomaine(domaine?.idDomaine || null);

            // Faites de même pour le niveau
            const niveau = moduleLevel.find(l => l.module_level_name === moduleData.module_level_name);
            setSelectLevel(niveau?.idLevel || null);
        }
    }, [moduleData]);

    console.log(moduleData)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            module_icone: selectedIconUpdate || moduleData.module_image,
            module_reference: formData.module_reference,
            name: formData.name,
            subtitle: formData.subtitle,
            description: formData.description,
            module_dureeH: formData.duration_hours,
            module_dureeJ: formData.duration_days,
            module_min_appr: formData.min_students,
            module_max_appr: formData.max_students,
            module_price: formData.price_individual,
            module_prix_groupe: formData.price_group,
            id_domaine_formation: selectedDomaine,
            idLevel: selectLevel
        };
        console.log(payload)
        try {
            const response = await axios.patch(`/cfp/modules/${id}`, payload);

            console.log("Payload envoyé:", payload);

            if (response.data.status === 200) {
                toast.success("Module modifié avec succès !");
                onUpdate();
                setLoading(false);
                closeFormation();

            } else {
                setLoading(false);
                //console('Erreur lors de la mise à jour');
                console.log("erreur de la modification", response);

            }
        } catch (error) {
            console.error('Erreur complète:', error);
            console.error('Réponse d\'erreur:', error.response);
            toast.error(`Erreur: ${error.response?.data?.message || error.message}`);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };


    if (!showFormation) return null;

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

            <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center">

                <div className="bg-white shadow-2xl rounded-2xl w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-hidden" data-aos="fade-down" data-aos-delay="300">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3 bg-slate-200 border-b">
                        <p className="text-lg  text-gray-500 text-center">Modification des informations</p>
                        <button
                            onClick={() => {
                                setSelectedIconUpdate(null);   // on remet l’icône à null
                                closeFormation();          // on ferme la popup
                            }}
                            className="p-2  rounded-full transition">
                            <RxCross2 size={25} className="text-red-600 font-bold" />
                        </button>
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[80vh] custom-scroll">

                        {/* Icone */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Icone</label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsOpenUpdate(!isOpenUpdate)}
                                    type="button"
                                    className="w-24 p-3 border rounded flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#5B345B]"
                                >
                                    {selectedIconUpdate
                                        ? React.createElement(iconeAddCatalogue[selectedIconUpdate], { size: 24 })
                                        : IconComponentUpdate
                                            ? React.createElement(IconComponentUpdate, { size: 24 })
                                            : "Choisir"}
                                </button>


                                {isOpenUpdate && (
                                    <div className="absolute mt-1 w-full max-h-48 overflow-y-auto border rounded bg-white z-50 grid grid-cols-10 gap-2 p-2">
                                        {Object.keys(iconeAddCatalogue).map((key) => {
                                            const IconComponentUpdate = iconeAddCatalogue[key];
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => {
                                                        setIconCompUpdate(null);
                                                        setSelectedIconUpdate(key);
                                                        setIsOpenUpdate(false);

                                                    }}
                                                    className="flex items-center justify-center p-2 hover:bg-gray-100 rounded"
                                                >
                                                    <IconComponentUpdate size={24} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Référence */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Référence</label>
                            <input
                                type="text"
                                name="module_reference"
                                value={formData.module_reference}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200"
                            />
                        </div>

                        {/* Nom formation */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Intitulé de la formation</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200"
                            />
                        </div>

                        {/* Sous-titre  */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Sous-intitulé (max 150 caractères)</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200"
                            />
                        </div>

                        {/*  Description */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200"
                            />
                        </div>

                        {/* Domaine */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Domaine de formation</label>
                            <select
                                value={selectedDomaine ?? ""}
                                onChange={handleDomaineChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200"
                            >
                                <option value="">{moduleData?.module_domain_name}</option>
                                {domaines.map((domaine) => (
                                    <option key={domaine.idDomaine} value={domaine.idDomaine}>
                                        {domaine.nomDomaine}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {/* Niveau */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Niveau</label>
                            <select
                                value={selectLevel ?? ""}
                                onChange={handleLevelChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200"
                            >
                                <option value="">{moduleData?.module_level_name}</option>
                                {moduleLevel.map((level) => (
                                    <option key={level.idLevel} value={level.idLevel}>
                                        {level.module_level_name}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {/* Prix */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">Prix Individuel</label>
                                <input
                                    type="text"
                                    name="price_individual"
                                    value={parseInt(formData.price_individual)}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">Prix Groupe</label>
                                <input
                                    type="text"
                                    name="price_group"
                                    value={parseInt(formData.price_group)}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200"
                                />
                            </div>
                        </div>

                        {/* Durées */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">Durée (heures)</label>
                                <input
                                    type="text"
                                    name="duration_hours"
                                    value={formData.duration_hours}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">Durée (jours)</label>
                                <input
                                    type="text"
                                    name="duration_days"
                                    value={formData.duration_days}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200"
                                />
                            </div>
                        </div>

                        {/* Apprenants */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">Apprenants minimum</label>
                                <input
                                    type="text"
                                    name="min_students"
                                    value={formData.min_students}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">Apprenants maximum</label>
                                <input
                                    type="text"
                                    name="max_students"
                                    value={formData.max_students}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">

                            <button
                                type="submit"
                                className="px-4 py-2 bg-slate-200 text-gray-500 rounded-md text-sm flex items-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span>Chargement...</span>
                                    </>
                                ) : (
                                    'Modifier'
                                )}
                            </button>
                        </div>

                    </form>

                </div>

            </div>
        </>
    );
}