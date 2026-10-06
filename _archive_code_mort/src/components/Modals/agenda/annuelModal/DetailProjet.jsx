import React, { useState, useEffect } from 'react';
import {
    FaFolder, FaPen, FaHandshake, FaUtensils, FaDownload, FaGear,
    FaUser, FaPenFancy, FaPencil, FaListCheck, FaChartSimple,
    FaCompassDrafting, FaPlus, FaArrowRight, FaCalendarDay,
    FaXmark, FaLandmark, FaImage, FaUpload, FaDoorOpen,
    FaBuilding, FaEye, FaUserGraduate, FaChalkboard,
    FaBullseye, FaBoxOpen, FaTrashCan, FaCopy, FaCircleXmark
} from "react-icons/fa6";
import { useParams, useNavigate } from 'react-router-dom';


import { motion, AnimatePresence } from "framer-motion";



import ConfirmationModal from '../../../../composents/ConfirmationModal';
import axios from 'axios';

import EditInfoBaseProjet from './projets/EditInfoBaseProjet';
import { Toaster } from 'react-hot-toast';
import AjoutApprenant from './projets/AjoutApprenant';
import { useAuth } from '../../../../context/AuthContext';

const DetailProjet = () => {
    const { id } = useParams();
    const auth = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('vue-ensemble');
    const [showMenu, setShowMenu] = useState(false);
    const [showAprenant, setShowAprenant] = useState(false);

    const [previewImages, setPreviewImages] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [formateurbyIdProjet, setFormateurbyIdProjet] = useState([]);
    const [seances, setSeances] = useState([]);
    const [total_session, setTotalSession] = useState(null);
    const [projet, setProjet] = useState({ projet: {} });
    const [idCfp, setIdcfp] = useState(null);
    const [objectifs, setObjectifs] = useState([]);
    const [materiels, setMateriels] = useState([]);
    const [prerequis, setPrerequis] = useState([]);
    const [modules_ressources, setModuleResources] = useState([]);
    const [restaurations, setRestaurations] = useState([]);
    const [dossier, setDossier] = useState({});
    const [imagesMomentums, setImages] = useState([]);

    const [villes, setVilles] = useState([]);
    const [paiements, setPaiements] = useState([]);

    const [modules, setModules] = useState([]);

    const [generalData, setGeneralData] = useState([]);
    const [apprenantInter, setApprenantInter] = useState([]);
    const [apprenantAdded, setApprenantAdded] = useState([]);
    const [modalites, setModalites] = useState([]);
    const [evaluations, , setEvaluation] = useState({});
    const [nbPlace, setNbPlaces] = useState(null);
    const [place_available, setPlaceAvalaible] = useState(0);
    const [place_reserved, setPlace_reserved] = useState(0);
    const [nomDossier, setNomDossier] = useState(null);
    const [idDossier, setidDossier] = useState(null);
    const [deb, setDeb] = useState(null);
    const [fin, setFin] = useState(null);

    // États pour les modals
    const [showPage, setShowPage] = useState(false);
    const [showPageEntreprise, setShowPageEntreprise] = useState(false);
    const [showPageFormateur, setShowPageFormateur] = useState(false);
    const [showPageFinancier, setShowPageFinancier] = useState(false);
    const [showPageAgenda, setShowPageAgenda] = useState(false);
    const [showPageDetailEntreprise, setShowPageDetailEntreprise] = useState(false);
    const [showPageDetailFormateur, setShowPageDetailFormateur] = useState(false);
    const [showPageApprenant, setShowPageApprenant] = useState(false);
    const [showPageDocument, setShowPageDocument] = useState(false);
    const [showEditInfoProjet, setShowEditInfoProjet] = useState(false);

    // États pour les modals de confirmation
    const [showConfirmSuprimer, setShowConfirmSuprimer] = useState(false);
    const [showConfirmDupliquer, setShowConfirmDupliquer] = useState(false);
    const [showConfirmReporter, setShowConfirmReporter] = useState(false);
    const [showConfirmCloturer, setShowConfirmCloturer] = useState(false);
    const [showConfirmRestorer, setShowConfirmRestorer] = useState(false);

    const calculerDuree = (heureDebut, heureFin) => {
        const [h1, m1] = heureDebut.split(':').map(Number);
        const [h2, m2] = heureFin.split(':').map(Number);
        const totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
        return `${Math.floor(totalMinutes / 60)}h${(totalMinutes % 60).toString().padStart(2, '0')}`;
    };

    const formaterDateComplete = (dateStr) => {
        const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

        const date = new Date(dateStr);
        const jourSemaine = jours[date.getDay()];
        const jour = date.getDate().toString().padStart(2, '0');
        const moisNom = mois[date.getMonth()];
        const annee = date.getFullYear();

        return `${jourSemaine} ${jour} ${moisNom} ${annee}`;
    };

    const getStatusColor = (status) => {
        const colors = {
            'En préparation': 'bg-[#F8E16F]',
            'En cours': 'bg-[#369ACC]',
            'Terminé': 'bg-[#95CF92]',
            'Planifié': 'bg-[#CBABD1]',
            'Cloturé': 'bg-[#6F1926]',
        };
        return colors[status] || 'bg-gray-500';
    };

    const fetchProjectDetails = async (id) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cfp/projets/${id}`, {

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`,
                },
                credentials: 'include',
            });
            setProjet(data.projet);
            setSeances(data.seances);
            setTotalSession(data.totalSession);
            setObjectifs(data.objectifs)
            setMateriels(data.materiel);
            setPrerequis(data.prerequis);
            setModuleResources(data.modules_ressources);
            setModules(data.modules);
            setModalites(data.modalites);
            setVilles(data.ville);
            setRestaurations(data.restaurations)
            setDeb(deb);
            setFin(fin);
            setLoading(false);
            setError(null);
        } catch (error) {
            console.log("Détails de l'erreur :", error);
            setLoading(false);
            setError("Impossible de charger le projet. Veuillez réessayer.");

        }
    };
    // function pour recupere les formateurs
    const fetchFormateursbyIdProjet = async (id) => {
        console.log("fetchAllFormateurs appelée !");
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cfp/projets/${id}/formateur`, {

                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            });

            setFormateurbyIdProjet(data.forms);

        } catch (error) {
            console.error("Détails de l'erreur:", error);
        }
    };

    // function pour recuperer les apprenant sur cet projet
    const fetchApprenantbyIdProjet = async (id) => {
        console.log("fetchAllFormateurs appelée !");
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cfp/projet/apprenants/added/${id}`, {

                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            });

            setApprenantAdded(data.apprs);

        } catch (error) {
            console.error("Détails de l'erreur:", error);
        }
    };
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    useEffect(() => {
        fetchProjectDetails(id);
        fetchFormateursbyIdProjet(id);
        fetchApprenantbyIdProjet(id);
    }, [id]);

    if (loading) {
        return (
            <>

                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-10">

                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                        <h4 className="text-lg font-semibold text-gray-800">
                            Veuillez patientez...
                        </h4>
                    </div>

                </div>
            </>
        );
    }

    if (error) {
        return (
            <div className="py-10 text-center text-red-600">
                {error}
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 ml-4 text-white bg-blue-500 rounded"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    // Vérification supplémentaire avant le rendu
    if (!projet) {
        return (
            <div className="py-10 text-center">
                <p className="text-red-500">Aucune donnée de projet disponible</p>
            </div>
        );
    }

    return (
        <>
            <Toaster position='top-right' reverseOrder={false} toastOptions={{
                // Define default options
                className: '',
                duration: 5000,
                removeDelay: 1000,
                style: {
                    background: '#fff',
                    color: '#363636',
                },


            }}></Toaster>
            <div className="w-full min-h-screen mt-2">
                <div className="w-full h-full">
                    <input type="hidden" id="idProjet" value={id} />
                    <input type="hidden" value={id} id="main_project_get_id" />

                    {/* Barre d'actions */}
                    <div className="flex flex-row items-center justify-start w-full h-8 gap-5 ml-3 text-gray-700">
                        <button className="flex items-center gap-1 p-1 text-sm rounded-md hover:bg-slate-200 btn btn-sm btn-ghost opacity-70">
                            <FaFolder /> Dossier
                        </button>
                        <button
                            onClick={() => { setShowEditInfoProjet(true); }}
                            className="flex items-center gap-1 p-1 text-sm rounded-md hover:bg-slate-200 btn btn-sm btn-ghost opacity-70"
                        >
                            <FaPen />
                            Éditer les informations de base
                        </button>

                        <AnimatePresence>
                            {showEditInfoProjet && (
                                <EditInfoBaseProjet
                                    initialData={projet}
                                    modules={modules}
                                    modalites={modalites}
                                    setShowEditInfoProjet={setShowEditInfoProjet}
                                />
                            )}
                        </AnimatePresence>


                        <button className="flex items-center gap-1 p-1 text-sm rounded-md hover:bg-slate-200 btn btn-sm btn-ghost opacity-70">
                            <FaHandshake></FaHandshake> Sous-traitant
                        </button>
                        <button className="flex items-center gap-1 p-1 text-sm rounded-md hover:bg-slate-200 btn btn-sm btn-ghost opacity-70">
                            <FaUtensils></FaUtensils> Restauration
                        </button>
                        <a href={`/cfp/projets/detailProjetCfpPdf/${id}`} className="hover:text-inherit">
                            <button className="flex items-center gap-1 p-1 text-sm rounded-md hover:bg-slate-200 btn btn-sm btn-ghost opacity-70">
                                <FaDownload></FaDownload>
                                Télécharger en format PDF
                            </button>
                        </a>
                    </div>

                    {/* En-tête du projet */}
                    <div className="">
                        <div className="flex p-6 mt-4">
                            <div className="w-[70%]">
                                <div className="flex">
                                    <div className="w-24">
                                        <figure>
                                            {projet.etp_logo ? (
                                                <img
                                                    src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/entreprises/${projet.etp_logo}`}
                                                    className="object-cover w-24 h-auto"
                                                    alt="Entreprise"
                                                    onError={(e) => {
                                                        e.target.src = '/path/to/default-image.png';
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-24 h-24 bg-gray-200">
                                                    <FaBuilding className="text-2xl text-gray-400" />
                                                </div>
                                            )}
                                        </figure>
                                    </div>
                                    <div className="flex flex-col justify-center flex-1 gap-2 ml-4 ">
                                        <span className="inline-flex items-center gap-2">
                                            <h2 className="text-sm font-medium text-slate-800">
                                                {projet.module_name || 'Module non spécifié'}
                                            </h2>
                                            <span className="text-sm font-medium text-slate-600">
                                                Ref : {projet.project_reference || 'Non spécifiée'}
                                            </span>
                                            <span className="text-sm font-medium text-slate-600">
                                                / Dossier : {projet.etp_name || 'Non spécifié'}
                                            </span>
                                        </span>

                                        <span className="inline-flex items-center gap-2">
                                            <div id="raty_notation" className="inline-flex items-center gap-1 rating" title="Not rated yet!">
                                                {[...Array(5)].map((_, i) => (
                                                    <img
                                                        key={i}
                                                        alt={i + 1}
                                                        src="/src/assets/images/star/star-off.png"
                                                        title="Not rated yet!"
                                                        className="w-5 h-5"
                                                    />
                                                ))}
                                                <input name="score" type="hidden" readOnly />
                                            </div>
                                            0,0
                                            <span className="text-gray-600"> (0 avis)</span>
                                        </span>

                                        <div className="inline-flex items-center text-gray-600 divide-x gap-x-4 gap-y-1 divide-slate-200">
                                            <p className="px-2">
                                                début :{" "}
                                                <span className="capitalize">
                                                    {deb ?
                                                        deb :
                                                        'Non définie'}
                                                </span>
                                            </p>

                                            <p className="px-2">
                                                fin :{" "}
                                                <span className="capitalize">
                                                    {fin ?
                                                        fin :
                                                        "Non définie"}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="inline-flex flex-wrap items-center text-gray-500 gap-x-4 gap-y-3">
                                            <span className="px-3 py-1 rounded-xl w-max text-sm border-[1px] border-[#1565c0] text-[#1565c0]">
                                                {projet.project_type || 'Type non spécifié'}
                                            </span>
                                            <span className="px-3 py-1 rounded-xl w-max text-sm border-[1px] border-[#00a5c5] text-[#00a5c5]">
                                                {projet.modalite || 'Modalité non spécifiée'}
                                            </span>
                                            <span className="taux_presence px-3 py-1 text-sm border-[1px] rounded-xl border-slate-200">
                                                Non renseigné
                                            </span>

                                        </div>
                                        <p className="text-left text-slate-600">
                                            {projet.project_description || 'Aucune description disponible'}
                                        </p>

                                    </div>
                                </div>
                            </div>

                            <div className="w-[25%]">
                                <div className="inline-flex items-center gap-2">
                                    <span
                                        className={`px-3 py-2 text-sm h-max text-white w-max rounded-xl ${getStatusColor(projet.project_status)}`}
                                        title="Le projet de formation est en cours de préparation, avec des détails tels que le programme, les supports de formation, et la logistique en cours de finalisation."
                                    >
                                        {projet.project_status || 'Statut inconnu'}
                                    </span>

                                    <div className="inline-flex items-center">
                                        <button className="text-gray-600 rounded-l-md btn btn-ghost btn-sm opacity-70 !rounded-r-none btn-outline border-1 border-black p-1 hover:bg-slate-200">
                                            Annuler
                                        </button>

                                        <div className="dropdown">
                                            <button
                                                tabIndex="0"
                                                onClick={() => setShowMenu(!showMenu)}
                                                role="button"
                                                aria-label="Action"
                                                className="border-1 text-gray-600 border-black items-center p-2 btn btn-sm btn-ghost !rounded-l-none btn-outline opacity-70 hover:bg-slate-500 rounded-r-md"
                                            >
                                                <FaGear></FaGear>
                                            </button>
                                            {showMenu && (
                                                <ul tabIndex="0" className="absolute dropdown-content menu bg-base-100 rounded-md z-[1] w-40 p-4 shadow">
                                                    <button onClick={() => setShowConfirmSuprimer(true)}>
                                                        <span className="flex items-center text-gray-700 gap-1 text-[13px] mt-1">
                                                            <FaTrashCan></FaTrashCan> Supprimer
                                                        </span>
                                                    </button>
                                                    <ConfirmationModal
                                                        title="Confirmer la suppression"
                                                        message="Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible."
                                                        onConfirm={() => {
                                                            console.log('Suppression confirmée');
                                                            setShowConfirmSuprimer(false);
                                                        }}
                                                        onCancel={() => setShowConfirmSuprimer(false)}
                                                        show={showConfirmSuprimer}
                                                    />
                                                    <button onClick={() => setShowConfirmDupliquer(true)}>
                                                        <span className="flex items-center gap-1 text-gray-700 text-[13px] mt-1">
                                                            <FaCopy></FaCopy> Dupliquer
                                                        </span>
                                                    </button>
                                                    <ConfirmationModal
                                                        title="Confirmer la duplication"
                                                        message="Voulez-vous vraiment dupliquer ce projet ? Cette action est irréversible."
                                                        onConfirm={() => {
                                                            console.log('Duplication confirmée');
                                                            setShowConfirmDupliquer(false);
                                                        }}
                                                        onCancel={() => setShowConfirmDupliquer(false)}
                                                        show={showConfirmDupliquer}
                                                    />
                                                    <li className="menu-title text-gray-700 text-[13px] mt-1">Statut</li>
                                                    <button onClick={() => setShowConfirmReporter(true)}>
                                                        <span className="flex items-center gap-1 text-[13px] text-gray-700 mt-1">
                                                            <FaCalendarDay></FaCalendarDay> Reporter
                                                        </span>
                                                    </button>
                                                    <ConfirmationModal
                                                        title="Confirmer le report"
                                                        message="Voulez-vous vraiment reporter ce projet ?"
                                                        onConfirm={() => {
                                                            console.log('Report confirmé');
                                                            setShowConfirmReporter(false);
                                                        }}
                                                        onCancel={() => setShowConfirmReporter(false)}
                                                        show={showConfirmReporter}
                                                    />
                                                    <button onClick={() => setShowConfirmCloturer(true)}>
                                                        <span className="flex items-center gap-1 text-[13px] text-gray-700 mt-1">
                                                            <FaCircleXmark></FaCircleXmark> Clôturer
                                                        </span>
                                                    </button>
                                                    <ConfirmationModal
                                                        title="Confirmer la cloture"
                                                        message="Voulez-vous vraiment clôturer ce projet ? Cette action est irréversible."
                                                        onConfirm={() => {
                                                            console.log('Clôture confirmée');
                                                            setShowConfirmCloturer(false);
                                                        }}
                                                        onCancel={() => setShowConfirmCloturer(false)}
                                                        show={showConfirmCloturer}
                                                    />
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Onglets */}
                    <div role="tablist" className="w-full p-6 tabs tabs-bordered lg:tabs-lg">
                        {/* Onglet 1 - Vue d'ensemble */}
                        <div className="flex gap-2 mb-4 border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('vue-ensemble')}
                                className={`px-4 py-2 font-medium ${activeTab === 'vue-ensemble' ? 'text-gray-600 underline ' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Vue d'ensemble
                            </button>
                            <button
                                onClick={() => setActiveTab('detail-formation')}
                                className={`px-4 py-2 font-medium ${activeTab === 'detail-formation' ? 'text-gray-600 underline ' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Détail de la formation
                            </button>
                        </div>

                        <div role="tabpanel" className="tab-content">
                            {activeTab === 'vue-ensemble' && (
                                <div className="grid w-full grid-cols-1 gap-4 m-4 lg:grid-cols-2">
                                    {/* Colonne gauche */}
                                    <div className="grid w-full col-span-2 gap-4 lg:col-span-1 grid-cols-subgrid h-max">
                                        {/* Apprenants */}
                                        <div className="accordion accordion-flush rounded-box" id="accordionExampleParticipant">
                                            <div className="accordion-item card bg-base-100 !w-full shadow-xl !rounded-xl bg-white p-2">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
                                                        <button
                                                            type="button"
                                                            className="flex items-center w-full gap-1 p-4 text-sm text-left text-gray-600 group hover:underline underline-offset-4"
                                                        >
                                                            <i class="mr-3 fa-solid fa-users"></i>
                                                            <span className="countApprDrawer"></span>
                                                            Apprenants
                                                        </button>
                                                        <div className="flex justify-end flex-1 pr-4 mt-2">
                                                            <div className="dropdown dropdown-bottom dropdown-end ">
                                                                <button tabIndex="1" onClick={() => setShowAprenant(!showAprenant)} role="button" className="flex items-center gap-1 p-1 m-1 text-sm text-gray-600 text-gray-700 border-black rounded-md w-max btn-outline border-1 hover:bg-black hover:text-white">
                                                                    <FaPen></FaPen>
                                                                    Editer
                                                                </button>
                                                                {showAprenant && (
                                                                    <ul tabIndex="1" className="absolute dropdown-content menu bg-white rounded-md z-[20] w-max p-4 shadow">
                                                                        <li>
                                                                            <button onClick={() => setShowPageApprenant(true)} className="flex text-gray-600 items-center gap-1 text-[13px] mt-1">
                                                                                <FaUser></FaUser>
                                                                                Ajouter des apprenants
                                                                            </button>
                                                                            <AnimatePresence>
                                                                                {showPageApprenant && (
                                                                                    <AjoutApprenant setShowPageApprenant={setShowPageApprenant} />
                                                                                )}
                                                                            </AnimatePresence>
                                                                        </li>

                                                                        <li className="disabled">
                                                                            <span className="flex items-center gap-1 text-[13px] mt-2 text-gray-400">
                                                                                <FaChartSimple></FaChartSimple>
                                                                                Evaluation
                                                                            </span>
                                                                        </li>
                                                                        <li className="disabled">
                                                                            <span className="flex items-center gap-1 text-[13px] mt-1 text-gray-400">
                                                                                <FaCompassDrafting></FaCompassDrafting>
                                                                                Skill matrix
                                                                            </span>
                                                                        </li>
                                                                    </ul>
                                                                )}

                                                            </div>
                                                        </div>
                                                    </span>
                                                </h2>
                                                <div className="accordion-body">
                                                    <div id="appr_table" className="mt-4 overflow-x-auto">
                                                        <div className="etp_apprenant">
                                                            <label className="mb-2 text-left text-slate-700">{projet.etp_name}</label>
                                                            <div className="w-full max-h-[400px] overflow-y-auto overscroll-y-auto border rounded-lg">
                                                                <table className="table w-full min-w-[600px] text-left">
                                                                    <thead className="sticky top-0 z-10 bg-white">
                                                                        <tr className="text-slate-800">
                                                                            <th className="w-[40%]">Nom</th>
                                                                            <th>Présence</th>
                                                                            <th className="text-left">Notation</th>
                                                                            <th className="text-center">Skills</th>
                                                                            <th></th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody id="data_participant_1868">
                                                                        {apprenantAdded && apprenantAdded.length > 0 ? (
                                                                            apprenantAdded.map((apprenant, index) => (
                                                                                <tr key={index}>
                                                                                    <td className="capitalize">
                                                                                        <span className="inline-flex items-center">
                                                                                            <div className="mr-3 avatar">
                                                                                                <div className="w-12 h-12 ml-1 rounded-full">
                                                                                                    <span className="flex items-center justify-center w-full h-full text-xl uppercase rounded-full text-slate-600 bg-slate-200">{apprenant.emp_initial_name}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <span className="flex flex-col text-gray-600">
                                                                                                <span className="mr-1 text-gray-600 uppercase">{apprenant.emp_name}</span> {apprenant.emp_firstname}
                                                                                            </span>
                                                                                        </span>
                                                                                    </td>
                                                                                    <td>

                                                                                        <div
                                                                                            data-bs-toggle="tooltip"
                                                                                            className="w-5 h-5 bg-gray-500 rounded-md uniquePresence uniquePresence_2453"
                                                                                        ></div>
                                                                                    </td>


                                                                                    <td className="text-left">

                                                                                        <span className="inline-flex items-center appreciation_2453">
                                                                                            {[...Array(5)].map((_, i) => (
                                                                                                <i key={i} className="fa-solid fa-star text-slate-200" aria-hidden="true"></i>
                                                                                            ))}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td className="text-center cursor-pointer" data-bs-toggle="tooltip" data-bs-original-title="Compétence Avant/Après Formation">
                                                                                        <span className="text-slate-500"> -- |  --</span>
                                                                                    </td>
                                                                                    <td className="text-right">
                                                                                        <button onClick={() => getSkills(847, 2453)} data-bs-toggle="tooltip" className="btn btn-xs md:btn-sm btn-ghost" aria-label="Skill matrix" data-bs-original-title="Skill matrix">
                                                                                            <i className="fa-solid fa-compass-drafting" aria-hidden="true"></i>
                                                                                        </button>
                                                                                        <button onClick={() => getEvaluation(847, 2453)} data-bs-toggle="tooltip" className="btn btn-xs md:btn-sm btn-ghost" aria-label="Evaluation" data-bs-original-title="Evaluation">
                                                                                            <i className="fa-solid fa-chart-simple" aria-hidden="true"></i>
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan="5">Aucun apprenant trouvé</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div id="part_table" className="mt-4 overflow-x-auto"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Documents */}
                                        <div className="accordion accordion-flush rounded-box" id="accordionDocument">
                                            <div className="accordion-item card bg-base-100 !w-full shadow-xl !rounded-xl bg-white p-2">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
                                                        <button
                                                            type="button"
                                                            className="flex items-center w-full gap-1 p-4 text-left text-slate-600 hover:underline underline-offset-4"
                                                        >
                                                            <FaFolder></FaFolder>
                                                            Documents nécessaires
                                                        </button>
                                                        <div className="flex justify-end w-full pr-4 mt-2">
                                                            <button onClick={() => setShowPageDocument(true)} className="flex items-center gap-1 p-1 m-1 text-sm border-black rounded-md text-slate-600 btn btn-sm btn-outline btn-primary border-1 hover:bg-black hover:text-white">
                                                                <FaPlus></FaPlus>
                                                                Ajouter
                                                            </button>
                                                            <AnimatePresence>
                                                                {showPageDocument && (
                                                                    <>
                                                                        {/* Overlay noir semi-transparent */}
                                                                        <motion.div
                                                                            className="fixed inset-0 z-40 backdrop-blur-sm"
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            exit={{ opacity: 0 }}

                                                                        />

                                                                        {/* Panneau de formulaire */}
                                                                        <motion.div
                                                                            initial={{ opacity: 0, x: 300 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            exit={{ opacity: 0, x: 300 }}
                                                                            transition={{ duration: 1 }}
                                                                            className="fixed right-0 top-0 h-full bg-white w-[1010px] z-50 shadow-lg "
                                                                        >
                                                                            <div className="offcanvas offcanvas-end !w-[100%] show" tabIndex="-1" id="dossier_117" aria-labelledby="dossier_117" aria-modal="true" role="dialog">
                                                                                <div className="flex flex-col w-full">
                                                                                    <div className="inline-flex items-center justify-between w-full px-4 py-2 bg-gray-100">
                                                                                        <p className="text-lg font-medium text-gray-500">Ajouter un document dans le dossier : <span className="text-2xl text-purple-500">ALPHACIMENT</span></p>
                                                                                        <button onClick={() => setShowPageDocument(false)} data-bs-toggle="offcanvas" href="#dossier_117" className="flex items-center justify-center w-10 h-10 duration-200 rounded-md cursor-pointer hover:bg-gray-200">
                                                                                            <FaXmark></FaXmark>
                                                                                        </button>
                                                                                    </div>

                                                                                    <div className="w-full overflow-x-auto p-4 h-[100vh] pb-3">
                                                                                        <div className="flex flex-col gap-4 h-full w-full min-w-[650px] overflow-x-scroll overflow-y-auto">
                                                                                            <div className="mb-[30px] flex flex-col gap-4 max-w-screen-xl mx-auto w-full h-[calc(100vh-30px)]">
                                                                                                <style>
                                                                                                    {`.accordion-content {
                                                                                                            transition: max-height 0.3s ease-out;
                                                                                                            overflow: hidden;
                                                                                                            max-height: 0;
                                                                                                        }

                                                                                                        #accordion-content {
                                                                                                            max-height: none;
                                                                                                        }`}
                                                                                                </style>

                                                                                                <div id="confirm-modal" className="fixed inset-0 z-50 flex items-center justify-center hidden bg-gray-900 bg-opacity-50">
                                                                                                    <div className="w-1/3 max-w-sm p-6 bg-white rounded-lg shadow-lg">
                                                                                                        <h2 className="mb-4 text-lg font-semibold">
                                                                                                            <i className="text-transparent fa-solid fa-triangle-exclamation bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-700" aria-hidden="true"></i>
                                                                                                            Confirmation
                                                                                                        </h2>
                                                                                                        <p className="mb-4">Êtes-vous sûr de vouloir supprimer ce document définitivement ?</p>
                                                                                                        <div className="flex justify-end gap-4">
                                                                                                            <button id="confirm-delete" className="px-4 py-2 text-white rounded-md bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br hover:bg-red-600">Supprimer</button>
                                                                                                            <button id="cancel-delete" className="px-4 py-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400">Annuler</button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div id="ajoutDocument" className="p-2 bg-white rounded-lg shadow-md">
                                                                                                    <div id="accordion-content" className="overflow-hidden duration-500 ease-in-out transition-max-height max-h-0">
                                                                                                        <form id="document-form" method="POST" enctype="multipart/form-data" className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-md">
                                                                                                            <input type="hidden" name="_token" value="QOoQIdEzMlwM5bmtoVxYQC1IQONUH9aR8DyCU2kP" autocomplete="off" />                <div id="section-documents" className="relative flex flex-col gap-2">
                                                                                                                <label for="section-radio" className="text-lg font-semibold text-gray-700">Section du Document</label>
                                                                                                                <div id="section-radio-group" className="grid grid-cols-3 gap-4">
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div id="type-documents" className="relative flex flex-col gap-2 p-2 bg-purple-100" style={{ display: 'none' }}>
                                                                                                                <label for="type-radio" className="mb-2 text-lg font-semibold text-gray-700">Type de Document</label>
                                                                                                                <div id="type-radio-group" className="grid grid-cols-3 gap-4">
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="relative flex flex-col gap-2 p-2">
                                                                                                                <label for="file-input" className="text-base text-lg text-gray-700">Fichier <span className="text-gray-500">(pdf, txt, xls, xlsx, csv, ppt, pptx)</span> </label>
                                                                                                                <input type="file" name="myFile" id="file-input" accept=".pdf, .txt, .ppt, .pptx, .xls, .xlsx, .csv" className="w-full p-3 border border-gray-300 rounded-md form-control" />
                                                                                                            </div>
                                                                                                            <div className="relative flex flex-col gap-2 p-2">
                                                                                                                <label for="title-input" className="text-lg font-semibold text-gray-700">Titre du Document</label>
                                                                                                                <div className="relative">
                                                                                                                    <input type="text" name="title" id="title-input" placeholder="Titre du document" className="w-full p-3 pr-10 border border-gray-300 rounded-md form-control" />
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            <div>
                                                                                                                <input type="submit" value="Ajouter le Document" className="w-full px-5 py-3 font-semibold text-white transition rounded-md bg-gradient-to-r from-[#924792] to-[#b36fb3] 
                                                                            hover:from-[#b36fb3] hover:to-[#924792]" />
                                                                                                            </div>
                                                                                                        </form>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="h-4 text-white">.</div>

                                                                                                <div id="edit-modal-document" className="fixed inset-0 flex items-center justify-center hidden bg-gray-900 bg-opacity-50">
                                                                                                    <div className="w-1/2 p-6 bg-white rounded-lg">
                                                                                                        <h2 className="mb-4 text-xl font-semibold">Modifier le document</h2>

                                                                                                        <div id="edit-section-documents" className="relative flex flex-col gap-2 mb-2">
                                                                                                            <label for="edit-section-radio" className="text-lg font-semibold text-gray-700">Section du
                                                                                                                Document</label>
                                                                                                            <div id="edit-section-radio-group" className="grid grid-cols-3 gap-4"></div>
                                                                                                        </div>

                                                                                                        <div id="edit-type-documents" className="relative flex flex-col gap-2 mb-2" style={{ display: 'none' }}>
                                                                                                            <label for="edit-type-radio" className="text-lg font-semibold text-gray-700">Type de Document</label>
                                                                                                            <div id="edit-type-radio-group" className="grid grid-cols-3 gap-4"></div>
                                                                                                        </div>

                                                                                                        <input type="text" id="edit-file-title" className="w-full p-2 mt-4 mb-4 border rounded-lg" placeholder="Titre du fichier" />
                                                                                                        <div className="flex justify-end space-x-2">
                                                                                                            <button id="save-edit" className="px-5 py-2.5 text-white font-bold rounded-md bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 text-sm">Sauvegarder</button>
                                                                                                            <button id="cancel-edit" className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-700">Annuler</button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    </>
                                                                )}
                                                            </AnimatePresence>
                                                            <form action="https://dossiers.forma-fusion.com/cfp/dossier/" method="GET">
                                                                <input type="hidden" name="dossierSearch" className="p-3 border border-gray-600" />
                                                                <button className="flex items-center gap-1 p-1 m-1 border-black rounded-md w-max btn btn-sm btn-outline text-slate-600 border-1 hover:bg-black hover:text-white">
                                                                    <FaArrowRight></FaArrowRight>
                                                                    Aller dans le dossier
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </span>
                                                </h2>
                                                <div className="accordion-body">
                                                    <div id="doc_table" className="mt-4 overflow-x-auto">
                                                        <div className="">
                                                            <p className="text-lg font-normal text-center text-slate-600">Aucun document</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Agenda */}
                                        <div className="accordion accordion-flush rounded-box" id="accordionExampleAgenda ">
                                            <div className="accordion-item card bg-base-100 !w-full shadow-xl text-gray-600 !rounded-xl bg-white p-2">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
                                                        <button
                                                            type="button"
                                                            className="flex items-center w-full gap-1 p-4 text-left group hover:underline underline-offset-4"
                                                        >
                                                            <FaCalendarDay></FaCalendarDay>
                                                            Agenda
                                                        </button>
                                                        <div className="flex justify-end w-full pr-4 mt-2">
                                                            <a
                                                                href="https://agenda.forma-fusion.com/agendaCfps"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1 p-1 m-1 border-black rounded-md w-max btn btn-sm btn-outline border-1 hover:bg-black hover:text-white"
                                                            >
                                                                <FaArrowRight></FaArrowRight>
                                                                Aller dans l'agenda
                                                            </a>
                                                            <button onClick={() => setShowPageAgenda(true)} className="flex items-center gap-1 p-1 m-1 text-sm border-black rounded-md btn btn-sm btn-outline border-1 hover:bg-black hover:text-white">
                                                                <FaPen></FaPen>
                                                                Editer
                                                            </button>
                                                            <AnimatePresence>
                                                                {showPageAgenda && (
                                                                    <>
                                                                        {/* Overlay noir semi-transparent */}
                                                                        <motion.div
                                                                            className="fixed inset-0 z-40 backdrop-blur-sm"
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            exit={{ opacity: 0 }}

                                                                        />

                                                                        {/* Panneau de formulaire */}
                                                                        <motion.div
                                                                            initial={{ opacity: 0, x: 300 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            exit={{ opacity: 0, x: 300 }}
                                                                            transition={{ duration: 1 }}
                                                                            className="fixed right-0 top-0 h-full bg-white w-[1010px] z-50 shadow-lg "
                                                                        >
                                                                            <div className="offcanvas offcanvas-end !w-[100%] show" data-bs-backdrop="static" tabIndex="-1" id="offcanvasSession" aria-labelledby="offcanvasSession" aria-modal="true" role="dialog">
                                                                                <div className="flex flex-col w-full gap-2">
                                                                                    <div className="inline-flex items-center justify-between w-full px-4 py-2 bg-gray-100">
                                                                                        <p className="text-lg font-medium text-gray-500" id="head_session">Ajouter des sessions</p>
                                                                                        <button onClick={() => setShowPageAgenda(false)} data-bs-toggle="offcanvas" href="#offcanvasSession" className="flex items-center justify-center w-10 h-10 duration-200 rounded-md cursor-pointer hover:bg-gray-200">
                                                                                            <FaXmark></FaXmark>
                                                                                        </button>
                                                                                    </div>
                                                                                    <div className="w-full p-3 flex flex-col overflow-y-auto gap-2 h-[100vh] pb-6">

                                                                                        <div className="inline-flex min-w-[900px] overflow-x-scroll items-center gap-2 justify-between w-full">
                                                                                            <div className="inline-flex items-center gap-2">

                                                                                                <div className="flex items-center justify-center px-3 py-2 bg-gray-200 rounded-md cursor-pointer w-max group/nav">
                                                                                                    <a id="dp_today" onClick="">

                                                                                                        Aujourd'hui
                                                                                                    </a>
                                                                                                </div>
                                                                                                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full cursor-pointer group/nav">
                                                                                                    <a id="dp_yesterday" onClick="">
                                                                                                        <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
                                                                                                    </a>
                                                                                                </div>

                                                                                                <span className="flex items-center justify-center text-xl font-semibold text-gray-500">

                                                                                                    <select id="monthSelectorWeek" className="px-3 py-2 text-base border border-gray-500 rounded-md dropdown-content menu ">
                                                                                                        <option value="0">
                                                                                                            Janvier
                                                                                                        </option>
                                                                                                        <option value="1">
                                                                                                            Février
                                                                                                        </option>
                                                                                                        <option value="2">
                                                                                                            Mars
                                                                                                        </option>
                                                                                                        <option value="3">
                                                                                                            Avril
                                                                                                        </option>
                                                                                                        <option value="4">
                                                                                                            Mai
                                                                                                        </option>
                                                                                                        <option value="5">
                                                                                                            Juin
                                                                                                        </option>
                                                                                                        <option value="6">
                                                                                                            Juillet
                                                                                                        </option>
                                                                                                        <option value="7">
                                                                                                            Août
                                                                                                        </option>
                                                                                                        <option value="8">
                                                                                                            Septembre
                                                                                                        </option>
                                                                                                        <option value="9">
                                                                                                            Octobre
                                                                                                        </option>
                                                                                                        <option value="10">
                                                                                                            Novembre
                                                                                                        </option>
                                                                                                        <option value="11">
                                                                                                            Décembre
                                                                                                        </option>

                                                                                                    </select>

                                                                                                </span>

                                                                                                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full cursor-pointer group/nav">
                                                                                                    <a id="dp_tomorrow" onClick="">
                                                                                                        <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                                                                                                    </a>
                                                                                                </div>

                                                                                                <div className="flex items-center justify-center w-8 h-8 ml-32 space-x-4">
                                                                                                    <button className="btn btn-primary" id="authorize_button" onClick="handleAuthClick()" enabled="">Sync
                                                                                                        with
                                                                                                        GOOGLE</button>
                                                                                                    <button className="btn btn-danger" id="signout_button" onClick="handleSignoutClick()">Sign
                                                                                                        Out</button>
                                                                                                </div>

                                                                                            </div>


                                                                                            <div className="inline-flex items-center gap-2">
                                                                                                <div className="inline-flex items-center justify-start w-full">
                                                                                                    <button type="button" onClick="" data-bs-dismiss="modal" data-dismiss="modal" className="mr-3 btn"><a data-bs-toggle="offcanvas" href="#offcanvasSession" className="hover:text-inherit">
                                                                                                        Annuler
                                                                                                    </a></button>
                                                                                                    <button type="button" onClick="location.reload()" className="bg-purple-600  btn btn-primary">Sauvegarder les modifications</button>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="w-full relative min-w-[900px] overflow-x-scroll">
                                                                                            <div className="w-14 h-8 bg-gray-100 absolute top-[1px] left-[1px] z-10"></div>
                                                                                            <div id="dp_session" className="calendar_default_main" style={{ userSelect: 'none', WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', position: 'relative', height: '608px', visibility: 'visible' }}>
                                                                                                {/* Rest of the calendar content with className conversions */}
                                                                                                {/* Note: I've truncated the calendar content for brevity, but all class attributes should be converted to className */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    </>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </span>
                                                </h2>
                                                <div className="accordion-body">
                                                    <p className='text-left'>
                                                        Vous avez <span className="font-semibold text-blue-500 ">{seances.length} </span>
                                                        sessions d'une durée total de  <span className="mr-1 font-semibold text-blue-500 ">{total_session}</span>

                                                    </p>
                                                    <div className="mt-4 overflow-x-auto">
                                                        <div className="w-full max-h-[400px] overflow-y-auto overscroll-y-auto border rounded-lg">

                                                            <table className="table text-left border-separate border-spacing-y-4 border-spacing-x-10 ">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="text-[13px]">Date</th>
                                                                        <th className="text-[13px]">Début</th>
                                                                        <th className="text-[13px]">Fin</th>
                                                                        <th className="text-right text-[13px]">Durée</th>
                                                                        <th className="text-right"></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="">
                                                                    {seances && seances.length > 0 ? (
                                                                        seances.map((seance, index) => (
                                                                            <tr key={index} className="border-gray-300 border-b-1">
                                                                                <td className="capitalize w-[100%] text-[13px] border-b-1 border-gray-300">{formaterDateComplete(seance.dateSeance)}</td>
                                                                                <td className=" w-[100%] text-[13px] border-b-1 border-gray-300">{seance.heureDebut}</td>
                                                                                <td className=" w-[100%] text-[13px] border-b-1 border-gray-300">{seance.heureFin}</td>
                                                                                <td className="text-right text-[13px] border-b-1 border-gray-300">{seance.intervalle_raw}</td>
                                                                                <td className="text-right border-gray-300 border-b-1">
                                                                                    <button aria-label="Supprimer" className="btn btn-ghost btn-sm ml-10 text-[13px]">
                                                                                        <FaXmark />
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan="5" className="py-4 text-center text-gray-500">
                                                                                Aucune séance trouvée
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>

                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Aspects Financiers */}
                                        <div className="accordion accordion-flush rounded-box" id="accordionExampleFinance">
                                            <div className="accordion-item card bg-base-100 !w-full text-gray-600 shadow-xl !rounded-xl bg-white">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
                                                        <button
                                                            type="button"
                                                            className="flex items-center w-full gap-1 p-4 text-left group hover:underline underline-offset-4"
                                                        >
                                                            <FaLandmark></FaLandmark>
                                                            Aspects Financiers
                                                        </button>
                                                        <div className="flex justify-end pr-4">
                                                            <button onClick={() => setShowPageFinancier(true)} className="flex items-center gap-1 p-1 m-1 text-sm border-black rounded-md w-max btn btn-sm btn-outline border-1 hover:bg-black hover:text-white">
                                                                <FaPen></FaPen>
                                                                Editer
                                                            </button>
                                                            <AnimatePresence>
                                                                {showPageFinancier && (
                                                                    <>
                                                                        {/* Overlay noir semi-transparent */}
                                                                        <motion.div
                                                                            className="fixed inset-0 z-40 backdrop-blur-sm"
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            exit={{ opacity: 0 }}

                                                                        />

                                                                        {/* Panneau de formulaire */}
                                                                        <motion.div
                                                                            initial={{ opacity: 0, x: 300 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            exit={{ opacity: 0, x: 300 }}
                                                                            transition={{ duration: 1 }}
                                                                            className="fixed right-0 top-0 h-full bg-white w-[1010px] z-50 shadow-lg"
                                                                        >
                                                                            <div className="offcanvas offcanvas-end !w-[100%] show" tabIndex="-1" data-bs-backdrop="static" id="offcanvasFrais" aria-labelledby="offcanvasFrais" aria-modal="true" role="dialog">
                                                                                <div className="flex flex-col w-full">
                                                                                    <div className="inline-flex items-center justify-between w-full px-4 py-2 bg-gray-100">
                                                                                        <p className="text-[13px] text-gray-500 font-medium">Ajouter un frais</p>
                                                                                        <button onClick={() => setShowPageFinancier(false)} data-bs-toggle="offcanvas" href="#offcanvasFrais" className="text-[13px] w-10 h-10 rounded-md hover:bg-gray-200 duration-200 cursor-pointer flex items-center justify-center">
                                                                                            <FaXmark></FaXmark>
                                                                                        </button>
                                                                                    </div>

                                                                                    <div className="w-full overflow-x-auto p-4 h-[100vh] pb-3">
                                                                                        <div className="flex flex-col gap-4 w-full h-full min-w-[650px] overflow-x-scroll">
                                                                                            <div className="flex flex-col gap-2">
                                                                                                <h1 className="text-slate-700 text-[13px] font-semibold">Type de financement</h1>
                                                                                                <div className="inline-flex items-center gap-2 p-5">
                                                                                                    <div className="form-control">
                                                                                                        <label className="p-5 text-center border-gray-200 cursor-pointer label border-1">
                                                                                                            <span className="label-text text-[13px]">Fonds Propres</span>
                                                                                                            <input type="radio" onClick="updateFinancement(837, 1, )" name="paiement" className="radio checked:bg-purple-600" />
                                                                                                        </label>
                                                                                                    </div>
                                                                                                    <div className="form-control">
                                                                                                        <label className="p-5 border-gray-200 cursor-pointer label border-1">
                                                                                                            <span className="label-text text-[13px]">FMFP</span>
                                                                                                            <input type="radio" onClick="updateFinancement(837, 2, )" name="paiement" className="radio checked:bg-purple-600" checked="checked" />
                                                                                                        </label>
                                                                                                    </div>
                                                                                                    <div className="form-control">
                                                                                                        <label className="p-5 border-gray-200 cursor-pointer label border-1">
                                                                                                            <span className="label-text text-[13px]">Autres</span>
                                                                                                            <input type="radio" onClick="updateFinancement(837, 3, )" name="paiement" className="radio checked:bg-purple-600" />
                                                                                                        </label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex h-full overflow-y-auto">
                                                                                                <div className="flex flex-col h-full items-start mr-4 w-1/2 border-r-[1px] border-gray-200">
                                                                                                    <div className="flex items-center gap-3 px-4 py-2 rounded-lg shadow-sm bg-gray-50">
                                                                                                        <div className="w-1 h-8 bg-red-400 rounded"></div>
                                                                                                        <label className="text-gray-700 text-[13px] font-semibold">Liste de tous les frais de ce projet</label>
                                                                                                    </div>

                                                                                                    <div className="w-full h-full mt-2 overflow-y-auto bg-gray-50">
                                                                                                        <ul id="get_all_frais" className="relative flex flex-row flex-wrap items-start justify-start w-full gap-2 p-2 list-none rounded select-list">
                                                                                                            {/* List items here with className instead of class */}
                                                                                                            <li className="grid grid-cols-5 w-full gap-2 justify-between px-3 py-2 border-[1px] border-gray-100 cursor-pointer hover:bg-gray-50 duration-200 rounded-md bg-white">
                                                                                                                {/* ... inner content ... */}
                                                                                                            </li>
                                                                                                            {/* More list items... */}
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="flex flex-col items-start w-1/2 h-full">
                                                                                                    <div className="inline-flex items-center gap-3 w-max">
                                                                                                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg shadow-sm bg-gray-50">
                                                                                                            <div className="w-1 h-8 bg-green-400 rounded"></div>
                                                                                                            <label className="text-gray-700 text-[13px] font-semibold">Les frais sélectionnés pour ce projet</label>
                                                                                                        </div>
                                                                                                    </div>

                                                                                                    <div className="w-full h-full mt-2 overflow-y-auto">
                                                                                                        <div className="flex items-center gap-6 p-4 mb-4 rounded-lg shadow-sm bg-gray-50">
                                                                                                            <label htmlFor="tvaRadio20" className="flex items-center cursor-pointer">
                                                                                                                <input type="radio" id="tvaRadio20" name="tvaRadio" value="20" className="w-5 h-5 text-purple-600 cursor-pointer form-radio accent-purple-600 focus:ring-purple-500 focus:outline-none" />
                                                                                                                <span className="ml-3 text-lg font-medium text-gray-700 select-none label-text">TVA 20%</span>
                                                                                                            </label>

                                                                                                            <label htmlFor="tvaRadio0" className="flex items-center cursor-pointer">
                                                                                                                <input type="radio" id="tvaRadio0" name="tvaRadio" value="0" className="w-5 h-5 text-purple-600 cursor-pointer form-radio accent-purple-600 focus:ring-purple-500 focus:outline-none" />
                                                                                                                <span className="ml-3 text-lg font-medium text-gray-700 select-none label-text">TVA 0%</span>
                                                                                                            </label>
                                                                                                        </div>

                                                                                                        <ul id="get_frais_selected" className="flex flex-row flex-wrap w-full gap-2 p-2 list-none select-list">
                                                                                                            {/* ... content ... */}
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="inline-flex items-end justify-end w-full pt-3 mb-14">
                                                                                                <button type="button" onClick="" className="bg-purple-600 btn btn-primary">
                                                                                                    <a data-bs-toggle="offcanvas" href="#offcanvasFrais" onClick="fermeturefrais('837')" className="p-1 text-gray-300 rounded-md hover:text-inherit">
                                                                                                        Fermer
                                                                                                    </a>
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </motion.div>
                                                                    </>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </span>
                                                </h2>
                                                <div className="accordion-body">
                                                    <div className="mt-4 overflow-x-auto">
                                                        <table className="w-full border-separate border-spacing-y-2 border-spacing-x-5">
                                                            <tbody>
                                                                <tr>
                                                                    <td colSpan="2">
                                                                        <div className="flex justify-between w-full">
                                                                            <span className="font-semibold">Financement</span>
                                                                            <span className="text-right typeFinancement">{projet.paiement}</span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan="2">
                                                                        <div className="flex justify-between w-full">
                                                                            <span className="font-semibold">Prix total HT ($)</span>
                                                                            <span className="text-right project_price_total_ht">{projet.total_ht}</span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan="2">
                                                                        <div className="flex justify-between w-full">
                                                                            <span className="font-semibold">Prix total TTC ($)</span>
                                                                            <span className="text-right project_price_total_ttc">{projet.total_ttc}</span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Momentum (Galérie Photo) */}
                                        <div className="accordion accordion-flush rounded-box" id="accordionExampleMomentum">
                                            <div className="accordion-item card bg-base-100 text-gray-600 !w-full shadow-xl !rounded-xl bg-white p-4">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
                                                        <button
                                                            type="button"
                                                            className="flex items-center w-full gap-1 p-4 text-left group hover:underline underline-offset-4"
                                                        >
                                                            <FaImage></FaImage>
                                                            Momentum (Galérie Photo)
                                                        </button>
                                                    </span>
                                                </h2>
                                                <div className="accordion-body">
                                                    <div className="mb-4">
                                                        <form
                                                            action="https://projets.forma-fusion.com/cfp/projets/uploadphoto/2"
                                                            method="POST"
                                                            encType="multipart/form-data"
                                                            className=""
                                                        >
                                                            <input type="hidden" name="_token" value="GBiqCfmewJeSBpDnybviSbexSC74eGumTh3qMX9f" autoComplete="off" />
                                                            <label className="flex-grow block">
                                                                <div className="p-6 border-2 border-blue-400 border-dashed rounded-md ">
                                                                    <input
                                                                        type="file"
                                                                        name="myFile[]"
                                                                        multiple
                                                                        accept=".svg,.jpeg,.jpg,.gif,.webp,.png"
                                                                        onChange={() => handleFileChange(true)}
                                                                        className="block w-full text-sm text-gray-500 cursor-pointer md:w-3/4 lg:w-1/2 file:cursor-pointer file:w-48 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:btn file:disabled:opacity-50 file:disabled:pointer-events-none dark:text-neutral-500 dark:file:bg-purple-300 dark:hover:file:bg-purple-400"
                                                                    />
                                                                    <div className="flex flex-wrap gap-4 mt-4">
                                                                        {previewImages?.map((src, index) => (
                                                                            <img
                                                                                key={index}
                                                                                src={src}
                                                                                alt={`Preview ${index + 1}`}
                                                                                className="object-cover w-32 h-32 m-auto rounded shadow"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                            </label>
                                                            <button id="submit" className="w-full p-1 mt-2 text-white bg-purple-500 rounded-md btn btn-outline btn-sm">
                                                                Importer
                                                            </button>
                                                        </form>
                                                    </div>

                                                    {/* <div className="w-full overflow-x-auto">
                                           <div className="w-full h-full du-carousel" id="momentum">
                                             <div id="slide0" className="relative w-full du-carousel-item h-72">
                                               <img 
                                                 src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/momentum/2/" 
                                                 alt="photo" 
                                                 className="object-cover w-full h-full cursor-pointer" 
                                               />
                                               <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                                 <a href="#slide-1" className="shadow-xl btn btn-circle">❮</a>
                                                 <a href="#slide1" className="shadow-xl btn btn-circle">❯</a>
                                               </div>
                                             </div>
                                             <div id="slide1" className="relative w-full du-carousel-item h-72">
                                               <img 
                                                 src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/momentum/2/LvKYX4kQGZnMKXkicAa5f3C148fbYf1vTW5qpGrL.webp" 
                                                 alt="photo" 
                                                 className="object-cover w-full h-full cursor-pointer" 
                                               />
                                               <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                                 <a href="#slide0" className="shadow-xl btn btn-circle">❮</a>
                                                 <a href="#slide2" className="shadow-xl btn btn-circle">❯</a>
                                               </div>
                                             </div>
                                           </div>
                                         </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Colonne droite */}
                                    <div className="grid w-full col-span-1 gap-4 h-max">
                                        {/* Lieu et salle */}
                                        <div className="accordion accordion-flush rounded-box" id="accordionExampleSalle">
                                            <div className="accordion-item card bg-base-100 !w-full shadow-xl !rounded-xl bg-white p-2">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
                                                        <button
                                                            type="button"

                                                            className="flex items-center w-full gap-1 p-4 text-left text-gray-600 group hover:underline underline-offset-4"
                                                        >
                                                            <FaDoorOpen></FaDoorOpen>
                                                            Lieu et salle
                                                        </button>
                                                        <div className="flex justify-end w-full pr-4 mt-2">
                                                            <button onClick={() => setShowPage(true)} className="flex items-center gap-1 p-1 m-1 text-sm text-purple-600 border-black rounded-md btn btn-sm btn-outline border-1">
                                                                <FaPen></FaPen>
                                                                Editer
                                                            </button>
                                                            <AnimatePresence>
                                                                {showPage && (
                                                                    <>
                                                                        {/* Overlay noir semi-transparent */}
                                                                        <motion.div
                                                                            className="fixed inset-0 z-40 backdrop-blur-sm"
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            exit={{ opacity: 0 }}
                                                                            onClick={() => setShowPage(false)}
                                                                        />

                                                                        {/* Panneau de formulaire */}
                                                                        <motion.div
                                                                            initial={{ opacity: 0, x: 300 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            exit={{ opacity: 0, x: 300 }}
                                                                            transition={{ duration: 1 }}
                                                                            className="fixed right-0 top-0 h-full bg-white w-[1010px] z-50 shadow-lg"
                                                                        >
                                                                            <div className="offcanvas offcanvas-end !w-[100%] show" tabIndex="-1" id="offcanvasSalle" aria-labelledby="offcanvasSalle" aria-modal="true" role="dialog">
                                                                                <div className="flex flex-col w-full">
                                                                                    <div className="inline-flex items-center justify-between w-full px-4 py-2 bg-gray-100">
                                                                                        <p className="text-lg text-gray-500 text-[13px] font-medium">Ajouter le lieu et salle</p>
                                                                                        <button onClick={() => setShowPage(false)} data-bs-toggle="offcanvas" href="#offcanvasSalle" className="text-[13px] w-10 h-10 rounded-md hover:bg-gray-200 duration-200 cursor-pointer flex items-center justify-center">
                                                                                            <FaXmark></FaXmark>
                                                                                        </button>
                                                                                    </div>

                                                                                    <div className="w-full  p-4 h-[100vh] pb-8">
                                                                                        <div className="flex flex-col gap-4 w-full h-full min-w-[650px]">
                                                                                            <div className="flex h-full ">
                                                                                                <div className="flex flex-col h-full items-start mr-4 w-2/3 border-r-[1px] border-gray-200">
                                                                                                    <div className="flex flex-row gap-2 px-3 py-1 bg-gray-50 ">
                                                                                                        <div className="w-1 h-6 bg-red-400"></div>
                                                                                                        <label className="text-gray-500 text-[13px] font-normal">Liste des lieux et salles à disposition</label>
                                                                                                    </div>
                                                                                                    <div className="w-full h-full mt-2 bg-gray-50">
                                                                                                        <div className="grid grid-cols-3 gap-2">
                                                                                                            <div className="grid items-start h-full col-span-2 p-2 overflow-y-auto">
                                                                                                                <h1 className="text-[15px] text-gray-600 font-medium h-max">Lieu et adresse</h1>
                                                                                                                <span>
                                                                                                                    <input id="main_search_client_project" placeholder="Chercher un lieu et adresse" onKeyUp="salleSearch('main_search_client_project', 'get_all_salle_detail')" className="w-full p-1 bg-white border-gray-200 rounded-md border-1 input input-bordered" />
                                                                                                                </span>
                                                                                                                <ul className="flex flex-col gap-2 p-2 get_all_salle_detail">
                                                                                                                    <li className="w-full p-2 bg-white border-gray-200 rounded-md border-1">
                                                                                                                        <div className="grid grid-cols-4">
                                                                                                                            <div className="grid col-span-3">
                                                                                                                                <div className="flex flex-col">
                                                                                                                                    <span>
                                                                                                                                        <span className="text-[13px] font-semibold text-gray-600">Ambohidratrimo</span> de
                                                                                                                                        <span className="text-[13px] text-gray-600">Ambohidratrimo</span>
                                                                                                                                    </span>
                                                                                                                                    <span>
                                                                                                                                        <span className="text-gray-500 text-[13px]">NUMERIKA CENTER</span> -
                                                                                                                                        <span className="text-gray-500 text-[13px]">Ambohidratrimo</span>
                                                                                                                                    </span>
                                                                                                                                    <span>
                                                                                                                                        <span className="text-gray-500 text-[13px]">Antananarivo</span>
                                                                                                                                        <span className="text-gray-500 text-[13px]">101</span>
                                                                                                                                    </span>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="grid items-center justify-end col-span-1">
                                                                                                                                <div onClick="assignSalle(220)" className="flex items-center justify-center w-10 h-10 duration-150 bg-green-100 rounded-full cursor-pointer icon hover:bg-green-50 group/icon">

                                                                                                                                    <FaPlus className="text-[13px] text-green-500 duration-150  group-hover/icon:text-green-600"></FaPlus>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </li>
                                                                                                                    {/* Rest of the list items with className conversions */}
                                                                                                                    {/* ... */}
                                                                                                                </ul>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                {/* Liste des salles sélectionnés */}
                                                                                                <div className="flex flex-col items-start w-1/3 h-full">
                                                                                                    <div className="inline-flex items-center gap-2 w-max">
                                                                                                        <div className="flex flex-row gap-2 px-3 py-1 bg-gray-50 ">
                                                                                                            <div className="w-1 h-6 bg-green-400"></div>
                                                                                                            <label className="text-gray-500 text-[13px] font-normal">Le lieu sélectionné pour ce projet</label>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="w-full h-full mt-2 overflow-y-auto">
                                                                                                        <ul className="flex flex-col items-start justify-start gap-2 p-2 get_salle_selected">
                                                                                                            <li className="w-full p-1 bg-white border-gray-200 rounded-md border-1">
                                                                                                                <div className="grid grid-cols-4">
                                                                                                                    <div className="grid col-span-3">
                                                                                                                        <div className="flex flex-col">
                                                                                                                            <span>
                                                                                                                                <span className="text-[13px] font-semibold text-gray-600">Salle Antsirabe</span> de
                                                                                                                                <span className="text-[13px] text-gray-600">Antsirabe Hotel</span>
                                                                                                                            </span>
                                                                                                                            <span>
                                                                                                                                <span className="text-gray-500 text-[13px]">N/A</span> - <span className="text-gray-500 text-[13px]">Antsenakely</span>
                                                                                                                            </span>
                                                                                                                            <span>
                                                                                                                                <span className="text-gray-500 text-[13px]">N/A</span> <span className="text-gray-500 text-[13px]">N/A</span>
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="inline-flex items-end justify-end w-full pt-3 mb-14">
                                                                                                <button type="button" onClick="" data-bs-dismiss="modal" data-dismiss="modal" className="p-1 mr-3 rounded-md hover:bg-gray-400 bg:btn"><a data-bs-toggle="offcanvas" href="#offcanvasSalle" className="hover:text-inherit">
                                                                                                    Annuler
                                                                                                </a></button>
                                                                                                <button type="button" onClick={() => setShowPage(false)} className="p-1 text-gray-300 bg-purple-600 rounded-md btn btn-primary"><a data-bs-toggle="offcanvas" href="#offcanvasSalle" className="hover:text-inherit">
                                                                                                    Fermer
                                                                                                </a></button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    </>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </span>
                                                </h2>
                                                <div className="accordion-body">
                                                    <p className="text-left text-gray-600">
                                                        La formation aura lieu à <span className="text-gray-600">
                                                            <span className="salle_ville_name_coded">N/A - </span>
                                                            <span className="salle_ville">{projet.ville} - </span>
                                                            <span className="salle_cp">N/A, </span>
                                                            <span className="text-blue-500 salle_re">{projet.salle_quartier}</span>
                                                            <span className="salle_nm">{projet.salle_name}</span>
                                                        </span>
                                                    </p>

                                                    <div className="w-full mt-3 overflow-x-auto">
                                                        <div className="items-center justify-center du-carousel du-carousel-vertical rounded-box" id="salle_img"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Entreprise(s) */}
                                        <div className="accordion accordion-flush rounded-box" id="accordionExampleEntreprise">
                                            <div className="accordion-item card bg-base-100 !w-full shadow-xl !rounded-xl bg-white p-2">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <span className="collapsed w-full inline-flex !rounded-xl  items-center justify-between">
                                                        <button
                                                            type="button"
                                                            className="flex items-center w-full gap-1 p-4 text-left text-gray-600 group hover:underline underline-offset-4"
                                                        >
                                                            <FaBuilding></FaBuilding>
                                                            Entreprise(s)
                                                        </button>
                                                        <div className="flex justify-end pr-4">
                                                            <button onClick={() => setShowPageEntreprise(true)} className="flex items-center gap-1 p-1 text-sm text-purple-600 border-black rounded-md btn btn-outline btn-primary btn-sm border-1">
                                                                <FaPen></FaPen>
                                                                Editer
                                                            </button>
                                                            <AnimatePresence>
                                                                {showPageEntreprise && (
                                                                    <>
                                                                        {/* Overlay noir semi-transparent */}
                                                                        <motion.div
                                                                            className="fixed inset-0 z-40 backdrop-blur-sm"
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            exit={{ opacity: 0 }}
                                                                            onClick={() => setShowPageEntreprise(false)}
                                                                        />

                                                                        {/* Panneau de formulaire */}
                                                                        <motion.div
                                                                            initial={{ opacity: 0, x: 300 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            exit={{ opacity: 0, x: 300 }}
                                                                            transition={{ duration: 1 }}
                                                                            className="fixed right-0 top-0 h-full bg-white w-[1010px] z-50 shadow-lg "
                                                                        >
                                                                            <div className="offcanvas offcanvas-end !w-[100%] show" tabIndex="-1" id="offcanvasClient" aria-labelledby="offcanvasClient" aria-modal="true" role="dialog">
                                                                                <div className="flex flex-col w-full">
                                                                                    <div className="inline-flex items-center justify-between w-full px-4 py-2 bg-gray-100">
                                                                                        <p className="text-[13px] text-gray-500 font-medium">Ajouter un client</p>
                                                                                        <button onClick={() => setShowPageEntreprise(false)} data-bs-toggle="offcanvas" href="#offcanvasClient" className="text-[13px] w-10 h-10 rounded-md hover:bg-gray-200 duration-200 cursor-pointer flex items-center justify-center">
                                                                                            <FaXmark></FaXmark>
                                                                                        </button>
                                                                                    </div>

                                                                                    <div className="w-full overflow-x-auto p-4 h-[100vh] pb-3">
                                                                                        <div className="flex flex-col gap-4 w-full h-full min-w-[650px] overflow-x-scroll">
                                                                                            <div className="flex h-full overflow-y-auto">
                                                                                                <div className="flex flex-col h-full items-start mr-4 w-1/2 border-r-[1px] border-gray-200">
                                                                                                    <div className="flex flex-row gap-2 px-3 py-1 bg-gray-50 ">
                                                                                                        <div className="w-1 h-6 bg-red-400"></div>
                                                                                                        <label className="text-gray-500 text-[13px] font-normal">Liste de tous les entreprises
                                                                                                            clients</label>
                                                                                                    </div>
                                                                                                    <div className="w-full h-full mt-2 overflow-y-auto bg-gray-50">
                                                                                                        <span>
                                                                                                            <input id="main_search_client_project" placeholder="Chercher un client" onKeyUp="mainSearch('main_search_client_project', 'all_etp_drawer')" className="w-full p-1 bg-white border-gray-200 rounded-md border-1 input input-bordered" />
                                                                                                        </span>
                                                                                                        <div className="p-4 mt-2 overflow-x-auto">
                                                                                                            <table className="table">
                                                                                                                <tbody id="all_etp_drawer">
                                                                                                                    {/* Toutes les lignes du tableau avec className */}
                                                                                                                    <tr>
                                                                                                                        <td>
                                                                                                                            <div className="flex items-center gap-3">
                                                                                                                                <div className="avatar">
                                                                                                                                    <div className="w-24 h-16 rounded-xl"><span className="flex items-center justify-center w-full h-full text-[13px] uppercase text-slate-600 bg-slate-200">2</span></div>
                                                                                                                                </div>
                                                                                                                                <div>
                                                                                                                                    <div className="font-bold uppercase text-[13px]">2ACF</div>
                                                                                                                                    <div className="text-[13px] text-slate-500">2ACF@forma-fusion.com</div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </td>
                                                                                                                        <td className="text-right">
                                                                                                                            <button onClick="etpAssign(763, 1761)" className="text-[13px] btn btn-outline btn-success">
                                                                                                                                <FaPlus></FaPlus>
                                                                                                                            </button>
                                                                                                                        </td>
                                                                                                                    </tr>
                                                                                                                    {/* ... autres lignes du tableau ... */}
                                                                                                                </tbody>
                                                                                                            </table>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                {/* Liste des Clients sélectionnés */}
                                                                                                <div className="flex flex-col items-start w-1/2 h-full">
                                                                                                    <div className="inline-flex items-center gap-2 w-max">
                                                                                                        <div className="flex flex-row gap-2 px-3 py-1 bg-gray-50 ">
                                                                                                            <div className="w-1 h-6 bg-green-400"></div>
                                                                                                            <label className="text-gray-500 text-[13px] font-normal">Le client sélectionné pour ce
                                                                                                                projet</label>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="w-full p-4 mt-2 overflow-x-auto">
                                                                                                        <table className="table">
                                                                                                            <tbody id="etp_drawer_added">
                                                                                                                <tr>
                                                                                                                    <td>
                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                            <div className="avatar">
                                                                                                                                <div className="w-24 h-16 rounded-xl">
                                                                                                                                    <img src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/entreprises/66a9390139438.webp" className="object-cover w-20 h-auto" alt="ALPHACIMENT" />
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div>
                                                                                                                                <div className="text-[13px] font-bold uppercase">ALPHACIMENT</div>
                                                                                                                                <div className="text-[13px] text-slate-500">alphaciment@forma-fusion.com</div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="inline-flex items-end justify-end w-full gap-2 pt-3 mb-14">
                                                                                                <a data-bs-toggle="offcanvas" href="#offcanvasClient" className="p-1 rounded-md hover:bg-gray-300 hover:text-inherit btn">
                                                                                                    Annuler
                                                                                                </a>
                                                                                                <button type="button" onClick="" className="p-1 text-gray-300 bg-purple-600 rounded-md btn btn-primary">
                                                                                                    <a data-bs-toggle="offcanvas" href="#offcanvasClient" className="hover:text-inherit">
                                                                                                        Fermer
                                                                                                    </a>
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    </>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </span>
                                                </h2>
                                                <div className="accordion-body">
                                                    <div className="overflow-x-auto">
                                                        <table className="table ">
                                                            <tbody id="etp_table">
                                                                <tr>
                                                                    <td>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="avatar">
                                                                                <div className="w-24 h-16 rounded-xl">
                                                                                    <img
                                                                                        src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/entreprises/${projet.etp_logo}`}
                                                                                        className="object-cover w-20 h-auto"
                                                                                        alt="Entreprise"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className='flex flex-col items-start '>
                                                                                <div className="font-bold uppercase text-slate-500">{projet.etp_name}</div>
                                                                                <div className="text-sm text-slate-500">{projet.etp_email} </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="text-right">
                                                                        <button onClick={() => setShowPageDetailEntreprise(true)} aria-label="showCustomer" className="opacity-50 btn btn-sm btn-ghost ml-70">
                                                                            <FaEye></FaEye>
                                                                        </button>
                                                                        <AnimatePresence>
                                                                            {showPageDetailEntreprise && (
                                                                                <>
                                                                                    {/* Overlay noir semi-transparent */}
                                                                                    <motion.div
                                                                                        className="fixed inset-0 z-40 backdrop-blur-sm"
                                                                                        initial={{ opacity: 0 }}
                                                                                        animate={{ opacity: 1 }}
                                                                                        exit={{ opacity: 0 }}

                                                                                    />

                                                                                    {/* Panneau de formulaire */}
                                                                                    <motion.div
                                                                                        initial={{ opacity: 0, x: 300 }}
                                                                                        animate={{ opacity: 1, x: 0 }}
                                                                                        exit={{ opacity: 0, x: 300 }}
                                                                                        transition={{ duration: 1 }}
                                                                                        className="fixed right-0 top-0 h-full bg-white w-[1010px] z-50 shadow-lg "
                                                                                    >
                                                                                        <div className="offcanvas offcanvas-end !w-[100%] overflow-y-auto show" tabIndex="-1" id="offcanvasEtp" aria-labelledby="offcanvasEtp" aria-modal="true" role="dialog">
                                                                                            <span className="absolute inline-flex items-center gap-2 top-1 right-1">
                                                                                                <button onClick={() => setShowPageDetailEntreprise(true)} data-bs-toggle="offcanvas" href="offcanvasEtp" className="flex items-center justify-center w-10 h-10 duration-200 rounded-md cursor-pointer hover:bg-gray-200">
                                                                                                    <FaXmark></FaXmark>
                                                                                                </button>
                                                                                            </span>
                                                                                            <div id="client_edit" className="flex flex-col w-full">
                                                                                                <div className="w-full p-3">
                                                                                                    <div className="inline-flex items-center w-full gap-3">
                                                                                                        <div className="w-[116px] h-[77px] bg-white flex items-center justify-center p-1">
                                                                                                            <img className="object-cover w-full h-auto rounded-xl" src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/entreprises/66a9390139438.webp" alt="ALPHACIMENT" />
                                                                                                        </div>
                                                                                                        <div className="flex flex-col justify-start w-full gap-y-2">
                                                                                                            <h3 className="text-2xl font-bold text-left text-gray-700">ALPHACIMENT</h3>
                                                                                                            <p className="text-base text-left text-gray-500">Site web --</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="w-full px-4">
                                                                                                    <div>
                                                                                                        <ul role="list" className="divide-y divide-gray-200">
                                                                                                            <div>
                                                                                                                <p className="text-xl font-semibold text-gray-900">Référent principal</p>
                                                                                                            </div>

                                                                                                            <li className="pt-3 pb-0 sm:pt-4">
                                                                                                                <div className="flex items-center">
                                                                                                                    <div className="flex-shrink-0">
                                                                                                                        <div className="relative w-10 h-10 text-2xl font-bold text-center text-gray-500 bg-gray-200 rounded-full">
                                                                                                                            <i className="fa-solid fa-user" aria-hidden="true"></i>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="flex-1 min-w-0 ms-4">
                                                                                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                                                                                            <i className="text-sm fa-solid fa-user" aria-hidden="true"></i> Raharimalala Vero
                                                                                                                        </p>
                                                                                                                        <p className="text-sm text-gray-500 truncate">
                                                                                                                            <i className="text-sm fa-solid fa-envelope" aria-hidden="true"></i> alphaciment@forma-fusion.com
                                                                                                                        </p>
                                                                                                                        <p className="text-sm text-gray-500 truncate">
                                                                                                                            <i className="text-sm fa-solid fa-phone" aria-hidden="true"></i> 032 07 047 63
                                                                                                                        </p>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </li>
                                                                                                        </ul>
                                                                                                    </div>

                                                                                                    <div className="mt-4">
                                                                                                        <ul role="list" className="divide-y divide-gray-200">
                                                                                                            <div>
                                                                                                                <p className="text-xl font-semibold text-gray-900">Autres référents</p>
                                                                                                            </div>
                                                                                                        </ul>
                                                                                                    </div>

                                                                                                    <div className="mt-4" id="title_in_preparation"></div>

                                                                                                    <div className="mt-1 table-responsive" id="project_in_preparation">
                                                                                                        <table className="table table-hover table-sm" id="table_in_preparation" style={{ display: "none" }}>
                                                                                                            <thead>
                                                                                                                <tr>
                                                                                                                    <th scope="col"></th>
                                                                                                                    <th scope="col">Cours</th>
                                                                                                                    <th scope="col">Ref</th>
                                                                                                                    <th scop="col">Lieu</th>
                                                                                                                    <th scope="col"><i className="text-sm fa-solid fa-user" aria-hidden="true"></i></th>
                                                                                                                    <th scope="col">Montant (Ar)</th>
                                                                                                                    <th scope="col"><i className="fa-solid fa-money-bill-transfer" aria-hidden="true"></i></th>
                                                                                                                    <th scope="col">Début - Fin</th>
                                                                                                                    <th scope="col">Détail</th>
                                                                                                                </tr>
                                                                                                            </thead>
                                                                                                            <tbody id="body_project_in_preparation"></tbody>
                                                                                                        </table>
                                                                                                    </div>

                                                                                                    <div className="mt-4" id="title_in_future"></div>

                                                                                                    <div className="mt-1 table-responsive" id="project_future">
                                                                                                        <table className="table table-hover table-sm" id="table_future" style={{ display: "none" }}>
                                                                                                            <thead>
                                                                                                                <tr>
                                                                                                                    <th scope="col"></th>
                                                                                                                    <th scope="col">Cours</th>
                                                                                                                    <th scope="col">Ref</th>
                                                                                                                    <th scop="col">Lieu</th>
                                                                                                                    <th scope="col"><i className="text-sm fa-solid fa-user" aria-hidden="true"></i></th>
                                                                                                                    <th scope="col">Montant (Ar)</th>
                                                                                                                    <th scope="col"><i className="fa-solid fa-money-bill-transfer" aria-hidden="true"></i></th>
                                                                                                                    <th scope="col">Début - Fin</th>
                                                                                                                    <th scope="col">Détail</th>
                                                                                                                </tr>
                                                                                                            </thead>
                                                                                                            <tbody id="body_project_future"></tbody>
                                                                                                        </table>
                                                                                                    </div>

                                                                                                    <div className="mt-4" id="title_in_progress">
                                                                                                        <span className="text-md rounded-xl py-1 px-3 text-white bg-[#369ACC]"> En cours </span>
                                                                                                    </div>

                                                                                                    <div className="mt-1 table-responsive" id="project_in_progress">
                                                                                                        <table className="table table-hover table-sm" id="table_in_progress">
                                                                                                            <thead>
                                                                                                                <tr>
                                                                                                                    <th scope="col"></th>
                                                                                                                    <th scope="col">Cours</th>
                                                                                                                    <th scope="col">Ref</th>
                                                                                                                    <th scop="col">Lieu</th>
                                                                                                                    <th scope="col"><i className="text-sm fa-solid fa-user" aria-hidden="true"></i></th>
                                                                                                                    <th scope="col">Montant (Ar)</th>
                                                                                                                    <th scope="col"><i className="fa-solid fa-money-bill-transfer" aria-hidden="true"></i></th>
                                                                                                                    <th scope="col">Début - Fin</th>
                                                                                                                    <th scope="col">Détail</th>
                                                                                                                </tr>
                                                                                                            </thead>
                                                                                                            <tbody id="body_project_in_progress">
                                                                                                                <tr>
                                                                                                                    <td scope="row">1</td>
                                                                                                                    <td>EXCEL NIVEAU II Calculs et fonctions avancés</td>
                                                                                                                    <td>ALPHACIMENT</td>
                                                                                                                    <td>Antsirabe Urban (110)</td>
                                                                                                                    <td className="text-center">0</td>
                                                                                                                    <td>5.54M Ar</td>
                                                                                                                    <td><i className="text-gray-500 fa-solid fa-circle-question" data-bs-toggle="tooltip" data-bs-original-title="Non facturé" aria-hidden="true"></i></td>
                                                                                                                    <td>14.05.25 - 23.05.25</td>
                                                                                                                    <td className="text-center">
                                                                                                                        <a href="/cfp/projets/763/detail">
                                                                                                                            <i className="opacity-50 fa-solid fa-eye" aria-hidden="true"></i>
                                                                                                                        </a>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                                <tr>
                                                                                                                    <td scope="row">2</td>
                                                                                                                    <td>Excel Analyse et gestion de données (Niveau III)</td>
                                                                                                                    <td>ALPHACIMENT</td>
                                                                                                                    <td>Antsirabe Urban (110)</td>
                                                                                                                    <td className="text-center">0</td>
                                                                                                                    <td>1.71M Ar</td>
                                                                                                                    <td><i className="text-gray-500 fa-solid fa-circle-question" data-bs-toggle="tooltip" data-bs-original-title="Non facturé" aria-hidden="true"></i></td>
                                                                                                                    <td>14.05.25 - 23.05.25</td>
                                                                                                                    <td className="text-center">
                                                                                                                        <a href="/cfp/projets/826/detail">
                                                                                                                            <i className="opacity-50 fa-solid fa-eye" aria-hidden="true"></i>
                                                                                                                        </a>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </div>

                                                                                                    <div className="mt-4" id="title_in_finished"></div>
                                                                                                    <div className="mt-1 table-responsive" id="project_finished">
                                                                                                        <table className="table table-hover table-sm" id="table_finished" style={{ display: "none" }}>
                                                                                                            <thead>
                                                                                                                <tr>
                                                                                                                    <th scope="col"></th>
                                                                                                                    <th scope="col">Cours</th>
                                                                                                                    <th scope="col">Ref</th>
                                                                                                                    <th scop="col">Lieu</th>
                                                                                                                    <th scope="col"><i className="text-sm fa-solid fa-user" aria-hidden="true"></i></th>
                                                                                                                    <th scope="col">Montant (Ar)</th>
                                                                                                                    <th scope="col"><i className="fa-solid fa-money-bill-transfer" aria-hidden="true"></i></th>
                                                                                                                    <th scope="col">Début - Fin</th>
                                                                                                                    <th scope="col">Détail</th>
                                                                                                                </tr>
                                                                                                            </thead>
                                                                                                            <tbody id="body_project_finished"></tbody>
                                                                                                        </table>
                                                                                                    </div>

                                                                                                    <div className="mt-4" id="title_in_fenced"></div>
                                                                                                    <div className="mt-1 table-responsive" id="project_fenced">
                                                                                                        <table className="table table-hover table-sm" id="table_fenced" style={{ display: "none" }}>
                                                                                                            <thead>
                                                                                                                <tr>
                                                                                                                    <th scope="col"></th>
                                                                                                                    <th scope="col">Cours</th>
                                                                                                                    <th scope="col">Ref</th>
                                                                                                                    <th scop="col">Lieu</th>
                                                                                                                    <th scope="col"><i className="text-sm fa-solid fa-user" aria-hidden="true"></i></th>
                                                                                                                    <th scope="col">Montant (Ar)</th>
                                                                                                                    <th scope="col"><i className="fa-solid fa-money-bill-transfer" aria-hidden="true"></i></th>
                                                                                                                    <th scope="col">Début - Fin</th>
                                                                                                                    <th scope="col">Détail</th>
                                                                                                                </tr>
                                                                                                            </thead>
                                                                                                            <tbody id="body_project_fenced"></tbody>
                                                                                                        </table>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                    </motion.div>
                                                                                </>
                                                                            )}
                                                                        </AnimatePresence>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Formateurs */}
                                        <div className="accordion accordion-flush" id="accordionExempleFormateur">
                                            <div className="accordion-item card bg-base-100 !w-full shadow-xl !rounded-xl bg-white p-2">
                                                <h2 className="accordion-header" id="headingTwo">
                                                    <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
                                                        <button
                                                            type="button"
                                                            className="flex items-center w-full gap-1 p-4 text-left text-gray-600 group hover:underline underline-offset-4"
                                                        >
                                                            <FaUserGraduate></FaUserGraduate>
                                                            Faites connaissance avec les formateurs
                                                        </button>
                                                        <div className="flex justify-end w-full pr-4">
                                                            <button onClick={() => setShowPageFormateur(true)} className="flex items-center gap-1 p-1 text-sm text-purple-600 border-black rounded-md btn btn-outline btn-sm border-1">
                                                                <FaPen></FaPen>
                                                                Editer
                                                            </button>
                                                            <AnimatePresence>
                                                                {showPageFormateur && (
                                                                    <>
                                                                        {/* Overlay noir semi-transparent */}
                                                                        <motion.div
                                                                            className="fixed inset-0 z-40 backdrop-blur-sm"
                                                                            initial={{ opacity: 0 }}
                                                                            animate={{ opacity: 1 }}
                                                                            exit={{ opacity: 0 }}
                                                                            onClick={() => setShowPageFormateur(false)}
                                                                        />

                                                                        {/* Panneau de formulaire */}
                                                                        <motion.div
                                                                            initial={{ opacity: 0, x: 300 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            exit={{ opacity: 0, x: 300 }}
                                                                            transition={{ duration: 1 }}
                                                                            className="fixed right-0 top-0 h-full bg-white w-[1010px] z-50 shadow-lg "
                                                                        >
                                                                            <div className="offcanvas offcanvas-end !w-100%] show" tabIndex="-1" id="offcanvasFormateur" aria-labelledby="offcanvasFormateur" aria-modal="true" role="dialog">
                                                                                <div className="flex flex-col w-full">
                                                                                    <div className="inline-flex items-center justify-between w-full px-4 py-2 bg-gray-100">
                                                                                        <p className="text-[13px] text-gray-500 font-medium">Ajouter un formateur</p>
                                                                                        <button onClick={() => setShowPageFormateur(false)} data-bs-toggle="offcanvas" href="#offcanvasFormateur" className=" text-[13px] w-10 h-10 rounded-md hover:bg-gray-200 duration-200 cursor-pointer flex items-center justify-center">
                                                                                            <FaXmark></FaXmark>
                                                                                        </button>
                                                                                    </div>

                                                                                    <div className="w-full overflow-x-auto p-4 h-[100vh] pb-3">
                                                                                        <div className="flex flex-col h-full gap-4 w-full min-w-[650px] overflow-x-scroll overflow-y-auto">
                                                                                            <div className="flex h-full">
                                                                                                <div className="flex flex-col h-full items-start mr-4 w-1/2 border-r-[1px] border-gray-200">
                                                                                                    <div className="flex flex-row gap-2 px-3 py-1 bg-gray-50">
                                                                                                        <div className="w-1 h-6 bg-red-400"></div>
                                                                                                        <label className="text-gray-500 text-[13px] font-normal">Liste de tous les formateurs</label>
                                                                                                    </div>
                                                                                                    <div className="w-full h-full mt-2 bg-gray-50">
                                                                                                        <input id="main_search_form_projet" placeholder="Chercher un formateur" onKeyUp={() => mainSearch('main_search_form_projet', 'all_form_drawer')} className="w-full bg-white input input-bordered" />

                                                                                                        <div className="w-full mt-2 overflow-x-auto">
                                                                                                            <table className="table">
                                                                                                                <tbody id="all_form_drawer">
                                                                                                                    {formateurs && formateurs.length > 0 ? (formateurs.map((formateur, index) => (
                                                                                                                        <tr key={index}>
                                                                                                                            <td className="capitalize">
                                                                                                                                <span className="inline-flex items-center">
                                                                                                                                    <div className="mr-3 avatar">
                                                                                                                                        <div className="w-12 rounded-full">
                                                                                                                                            <img
                                                                                                                                                src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/formateurs/${formateur.form_photo
                                                                                                                                                    || 'default.png'}`}
                                                                                                                                                alt={formateur.nom}
                                                                                                                                            />
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                    <span className="flex flex-col text-[13px]">
                                                                                                                                        <span className="text-[13px] mr-1 uppercase">
                                                                                                                                            {formateur.form_name}
                                                                                                                                        </span>
                                                                                                                                        <span>{formateur.form_firstname}</span>
                                                                                                                                    </span>
                                                                                                                                </span>
                                                                                                                            </td>
                                                                                                                            <td className="text-right">
                                                                                                                                <button
                                                                                                                                    onClick={() => manageForm('post', 763, formateur.idFormateur)}
                                                                                                                                    className="text-green-400 rounded-full btn btn-outline"
                                                                                                                                >
                                                                                                                                    <FaPlus></FaPlus>
                                                                                                                                </button>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                    ))) : (<p>Aucun formateur trouvé </p>)}
                                                                                                                </tbody>
                                                                                                            </table>

                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>

                                                                                                {/* Liste des formateurs sélectionnés */}
                                                                                                <div className="flex flex-col items-start w-1/2 h-full">
                                                                                                    <div className="inline-flex items-center gap-2 w-max">
                                                                                                        <div className="flex flex-row gap-2 px-3 py-1 bg-gray-50">
                                                                                                            <div className="w-1 h-6 bg-green-400"></div>
                                                                                                            <label className="text-gray-500 text-[13px] font-normal">Liste des formateurs selectionnés pour ce projet</label>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="w-full mt-2 overflow-x-auto">
                                                                                                        <table className="table">
                                                                                                            <tbody id="form_drawer_added">
                                                                                                                <tr>
                                                                                                                    <td className="capitalize">
                                                                                                                        <span className="inline-flex items-center">
                                                                                                                            <div className="mr-3 avatar">
                                                                                                                                <div className="w-12 rounded-full">
                                                                                                                                    <img src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/formateurs/1737356626.png" />
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <span className="flex flex-col text-[13px]">
                                                                                                                                <span className="text-[13px] mr-1 uppercase">Tovoniaina</span> Tsinjonjanahary Ernest
                                                                                                                            </span>
                                                                                                                        </span>
                                                                                                                    </td>
                                                                                                                    <td className="text-right">
                                                                                                                        <button onClick={() => manageForm('delete', 763, 32)} className="rounded-full btn btn-error btn-outline"><i className="text-xl fa-solid fa-minus" aria-hidden="true"></i></button>
                                                                                                                    </td>
                                                                                                                </tr>

                                                                                                                {/* Autres formateurs sélectionnés */}
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="inline-flex items-end justify-end w-full pt-3 mb-14">
                                                                                                <button type="button" data-bs-dismiss="modal" data-dismiss="modal" className="p-1 mr-3 rounded-md hover:bg-gray-300 btn">
                                                                                                    <a data-bs-toggle="offcanvas" href="#offcanvasFormateur" className="hover:text-inherit">Annuler</a>
                                                                                                </button>
                                                                                                <button type="button" className="p-1 text-gray-300 bg-purple-600 rounded-md btn btn-primary">
                                                                                                    <a data-bs-toggle="offcanvas" href="#offcanvasFormateur" className="hover:text-inherit">Fermer</a>
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </motion.div>
                                                                    </>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </span>
                                                </h2>
                                                <div className="accordion-body">
                                                    <div className="overflow-x-auto">

                                                        <table className="table">
                                                            <tbody id="form_table">
                                                                {formateurbyIdProjet && formateurbyIdProjet.length > 0 ? (
                                                                    formateurbyIdProjet.map((formateur, index) => (
                                                                        <tr key={index}>
                                                                            <td className="capitalize ">
                                                                                <span className="inline-flex items-center">
                                                                                    <div className="mr-3 rounded-full avatar">
                                                                                        <div className="w-12 rounded-full">
                                                                                            <img
                                                                                                src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/formateurs/${formateur.form_photo || 'default.png'
                                                                                                    }`}
                                                                                                alt={formateur.form_name}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <span className="flex flex-col text-[13px] text-gray-600">
                                                                                        <span className="text-[13px] mr-1 uppercase">
                                                                                            {formateur.form_name}
                                                                                        </span>
                                                                                        <span>{formateur.form_firstname}</span>
                                                                                    </span>
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="quelque_chose_pour_centrer_le_message">
                                                                            <p>Aucun formateur trouvé</p>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Restaurations */}
                                        <div className="accordion accordion-flush rounded-box" id="accordionExample">
                                            <div className="accordion-item card bg-base-100 !w-full shadow-xl !rounded-xl bg-white p-2">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <span className="collapsed w-full inline-flex !rounded-xl items-center justify-between">
                                                        <button

                                                            type="button"
                                                            className="flex items-center w-full gap-1 p-4 text-left text-gray-600 group hover:underline underline-offset-4"
                                                        >
                                                            <FaUtensils></FaUtensils>
                                                            Restaurations
                                                        </button>
                                                        <div className="flex justify-end pr-4">
                                                            <button onClick={() => setshowConfirmRestorer(true)} className="flex items-center gap-1 p-1 text-sm text-purple-600 border-black rounded-md btn btn-outline btn-sm border-1">
                                                                <FaPen></FaPen>
                                                                Editer
                                                            </button>
                                                            <ConfirmationModal
                                                                title="Restauration"
                                                                message="Voulez-vous vraiment cloture ce projet ? Cette action est irréversible."
                                                                onCancel={() => setshowConfirmRestorer(false)}
                                                                show={showConfirmRestorer}
                                                            >
                                                                {/* Tu peux insérer ici des enfants optionnels si besoin */}
                                                            </ConfirmationModal>
                                                        </div>
                                                    </span>
                                                </h2>
                                                <div className="accordion-body">
                                                    <div className="overflow-x-auto">
                                                        <table className="table">
                                                            <tbody id="content_restauration_list">
                                                                {restaurations && restaurations.length > 0 ? (
                                                                    restaurations.map(item => (
                                                                        <tr key={item.idRestauration}>
                                                                            <td>
                                                                                <i className={`fa-solid rest_${item.idRestauration}`}></i> {/* Correction className et interpolation */}
                                                                            </td>
                                                                            <td>
                                                                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                                                                    <span className="">
                                                                                        <strong>{item.typeRestauration}</strong> offert par{' '}
                                                                                        {item.paidBy == 1 ? (
                                                                                            <strong>le centre de formation</strong>
                                                                                        ) : (
                                                                                            <strong>l'entreprise</strong>
                                                                                        )}
                                                                                    </span>
                                                                                </label>
                                                                            </td>
                                                                            <td className="text-right">
                                                                                <button
                                                                                    onClick={() => deleteRestauration(item.idRestauration)} // Correction onClick et passage de fonction
                                                                                    className="opacity-50 btn btn-ghost btn-sm"
                                                                                >
                                                                                    <i className="fa-solid fa-xmark"></i> {/* Correction className */}
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        {/* Adaptez colSpan au nombre réel de colonnes (ici 3) */}
                                                                        <td colSpan="3" className="py-4 text-center text-gray-600">
                                                                            <p>Aucun restauration trouvée</p> {/* Message plus pertinent */}
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>

                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'detail-formation' && (
                                <div className="grid w-full grid-cols-1 gap-4 m-4 lg:grid-cols-3">
                                    {/* Colonne gauche */}
                                    <div className="grid w-full col-span-1 gap-4 lg:col-span-2 grid-cols-subgrid h-max">
                                        {/* Programme de formation */}
                                        <div className="accordion accordion-flush rounded-box" id="accordionExampleProgramme">
                                            <div className="accordion-item card bg-base-100 w-full shadow-xl !rounded-xl bg-white">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <button
                                                        type="button"
                                                        className="flex items-center gap-1 accordion-button collapsed"
                                                    >
                                                        <FaChalkboard></FaChalkboard>
                                                        Programme de formation
                                                    </button>
                                                </h2>
                                                <div className="accordion-body">
                                                    <div id="get_all_programme_project" className="grid grid-cols-1 gap-3 mt-2 overflow-x-auto md:grid-cols-2 2xl:">
                                                        <div className="w-full">
                                                            <p className="text-lg text-gray-500">Pas de programme pour ce cours pour l'instant.</p>
                                                        </div>
                                                        <div className="w-full">
                                                            <p className="text-lg text-gray-500">Pas de programme pour ce cours pour l'instant.</p>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Colonne droite */}
                                    <div className="grid w-full col-span-1 gap-4 h-max">
                                        {/* Objectifs de la formation */}
                                        <div className="accordion accordion-flush rounded-box" id="accordionExampleInfoObjectif">
                                            <div className="accordion-item card bg-base-100 !w-full shadow-xl !rounded-xl bg-white">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <button
                                                        type="button"
                                                        className="flex items-center gap-1 accordion-button collapsed"
                                                    >
                                                        <FaBullseye></FaBullseye>
                                                        Objectifs de la formation
                                                    </button>
                                                </h2>
                                                <div className="accordion-body">
                                                    <ul className="flex flex-col ml-12">
                                                        {objectifs.length > 0 ? (
                                                            objectifs.map((objectif) => (
                                                                <li className="text-gray-500 list-disc">
                                                                    {objectif.objectif}
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li className="text-gray-500 list-disc">
                                                                Aucun objectif
                                                            </li>

                                                        )}

                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Matériels utiles */}
                                        <div className="accordion accordion-flush rounded-box" id="accordionExampleInfoMateriel">
                                            <div className="accordion-item card bg-base-100 !w-full shadow-xl !rounded-xl bg-white">
                                                <h2 className="accordion-header" id="headingOne">
                                                    <button
                                                        type="button"
                                                        className="flex items-center gap-1 accordion-button collapsed"
                                                    >
                                                        <FaBoxOpen>j</FaBoxOpen>
                                                        Matériels utiles à la formation
                                                    </button>
                                                </h2>
                                                <div className="accordion-body">
                                                    {projet.project_has.materiels.length > 0 ? (
                                                        projet.project_has.materiels.map((materiel) => (
                                                            <li className="flex flex-col ml-12">{materiel.prestation_name}</li>
                                                        ))
                                                    ) : (
                                                        <ul className="flex flex-col ml-12">Aucun materiel</ul>

                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal pour les fichiers */}
            <div id="fichier-modal" className="fixed inset-0 z-50 flex items-center justify-center hidden bg-black bg-opacity-50">
                <div id="fichier-modal-content" className="relative bg-white p-6 w-[90%] max-w-5xl max-h-[90vh] overflow-auto rounded-lg shadow-lg">
                    <span id="close-fichier-modal" className="absolute text-xl text-gray-600 cursor-pointer top-2 right-2 hover:text-gray-800">
                        ×
                    </span>
                    <div id="file-content" className="overflow-auto"></div>
                    <iframe id="fichier-viewer" className="w-full h-[600px] border-none hidden"></iframe>
                </div>
            </div>


        </>
    );
};

export default DetailProjet;