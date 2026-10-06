import NavbarTrainer from "../../../components/navbar/navbar-trainer";
import { useState, useEffect } from 'react';
import { Mail, Phone, Eye, Pen, Trash2 } from 'lucide-react';
import FormateurEdit from './FormateurEdit';
import swal from 'sweetalert';
import toast from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import FormateurVoir from './FormateurVoir';
import { AnimatePresence } from 'framer-motion';
import axios from '../../../config/axios';
import FormateurProjet from './FormateurProjet';
import { useNavigate } from "react-router-dom";
import { IMAGE_URL } from "../../../config/env";

export default function FormateurAncien({ refreshData, search }) {
    const [formateurAncienEdit, setFormateurAncienEdit] = useState(null);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalVoir, setShowModalVoir] = useState(false);
    const [showModalProjetFormateur, setShowModalProjetFormateur] = useState(false);
    const [formateurVoir, setFormateurVoir] = useState(null);
    const [formateurProjet, setFormateurProjet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formateurs, setFormateurs] = useState([]);
    const [count, setCount] = useState(0);
    const navigate = useNavigate();

    const fetchFormateurAncien = async () => {
        setLoading(true);
        try {
            const result = await axios.get(`/cfp/formateurs`);
            console.log("Données brutes de l'API :", result.data);
            setFormateurs(result.data.formateurs || []);
            setCount(result.data.countAncien || 0);
        } catch (error) {
            console.error("Erreur lors du chargement des formateurs :", error);
            if (error.response?.status === 401) {
                navigate("/user");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFormateurAncien();
    }, []);

    // Modals
    const handleVoir = (formateur) => {
        setFormateurVoir(formateur);
        setShowModalVoir(true);
    };

    const handleProjetFormateur = (idFormateur) => {
        setFormateurProjet(idFormateur);
        setShowModalProjetFormateur(true);
    };

    const handleEdit = (formateur) => {
        setFormateurAncienEdit(formateur);
        setShowModalEdit(true);
    };

    const handleDelete = async (id) => {
        const isConfirm = await swal({
            title: 'Voulez-vous vraiment supprimer cet élément?',
            text: "Vous ne pouvez plus le récupérer",
            icon: 'warning',
            buttons: ['Annuler', 'Oui, supprimer'],
            dangerMode: true,
        });
        if (!isConfirm) return;

        try {
            await axios.delete(`/cfp/formateurs/${id}`);
            toast.success("Formateur supprimé avec succès");
            setFormateurs(prev => prev.filter(f => f.idFormateur !== id));
            refreshData();
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Une erreur inconnue est survenue.");
        }
    };

    // Toggle actif/inactif
    const toggleFormateur = async (idFormateur) => {
        const formateur = formateurs.find(f => f.idFormateur === idFormateur);
        if (!formateur) return;

        const newStatus = formateur.form_is_active === 1 ? 0 : 1;

        try {
            const response = await axios.post(
                `/cfp/formateurs/formateurs/${idFormateur}/toggle`,
                { isActiveFormateur: newStatus }
            );

            if (response.data?.success || response.status === 200) {
                // Mettre à jour le tableau formateurs
                setFormateurs(prev =>
                    prev.map(f =>
                        f.idFormateur === idFormateur
                            ? { ...f, form_is_active: newStatus }
                            : f
                    )
                );
            }
        } catch (error) {
            console.error("Erreur lors du changement de statut :", error);
            toast.error("Impossible de changer le statut du formateur.");
        }
    };

    // Filtrer les anciens formateurs
    const FormateurAncienFiltered = formateurs
        .filter(f => Number(f.form_is_active) === 1) // 0 = ancien
        .filter(f => f.form_initial_name?.toLowerCase().includes((search || "").toLowerCase()));

    return (
        <>
            <NavbarTrainer />
            <div className="flex items-center justify-between w-full mb-3">
                <section id="filterSection">
                    <div className="flex flex-col text-md">
                        <h3 className="text-slate-600">
                            Vous avez <span className="text-[#A462A4]">{count}</span> Ancien Formateur
                        </h3>
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 animate-slide-up">
                {FormateurAncienFiltered.length > 0 ? (
                    FormateurAncienFiltered.map((formateur) => (
                        <div key={formateur.idFormateur} className="grid w-full col-span-1 text-xs p-4 bg-white shadow h-72 rounded-xl max-h-[72vh]">
                            <div className="flex flex-col w-full h-full gap-2 justify-first">
                                <div className="flex flex-wrap gap-2 p-2">
                                    <div className="flex justify-start col-span-2">
                                        <div className="flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 border-purple-600 rounded-full">
                                            <img
                                                src={`${IMAGE_URL}/img/formateurs/${formateur.form_photo}`}
                                                alt={`${formateur.form_name} ${formateur.form_firstname}`}
                                                className="object-cover w-full h-full border-purple-600 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col col-span-4 gap-2 ">
                                        <p className="font-semibold  text-slate-500">{formateur.form_name}</p>
                                        <p className=" text-slate-500">{formateur.form_firstname}</p>
                                    </div>
                                </div>

                                <div className="w-full  h-1/3 rounded-xl">
                                    <div className="flex flex-col h-full gap-2 p-2">
                                        <div className="flex flex-col w-full gap-1">
                                            <div className="inline-flex items-center gap-1">
                                                <Mail className="text-gray-500" size={16} />
                                                <p className="text-gray-500">{formateur.form_email}</p>
                                            </div>
                                            <div className="inline-flex items-center gap-1">
                                                <Phone className="text-gray-500" size={16} />
                                                <p className="text-gray-500">{formateur.form_phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bouton toggle */}
                                <div className='flex justify-between items-center border-t w-full'>
                                    <div>
                                        <button
                                            onClick={() => toggleFormateur(formateur.idFormateur)}
                                            className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${formateur.form_is_active === 0 ? "bg-green-500" : "bg-red-500"}`}
                                        >
                                            <span
                                                className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${formateur.form_is_active === 0 ? "translate-x-6" : "translate-x-0"}`}
                                            ></span>
                                        </button>
                                    </div>

                                    <div className="flex items-center border-t-[1px] gap-3 p-3">
                                        <button title="Voir les cours" onClick={() => handleProjetFormateur(formateur.idFormateur)}>
                                            <span className='text-gray-600'>Voir les cours</span>
                                        </button>
                                        <button title="Voir le CV" onClick={() => handleVoir(formateur)}>
                                            <Eye className="w-4 h-4 text-gray-600 hover:text-yellow-600" />
                                        </button>
                                        <button onClick={() => handleEdit(formateur)} title="Modifier">
                                            <Pen className="w-4 h-4 text-gray-600 hover:text-green-600" />
                                        </button>
                                        <button onClick={() => handleDelete(formateur.idFormateur)} title="Supprimer">
                                            <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-3 text-lg text-center text-gray-500">
                        Aucun formateur Ancien trouvé.
                    </p>
                )}
            </div>

            <AnimatePresence>
                {showModalEdit && <FormateurEdit formateur={formateurAncienEdit} setShowModalEdit={setShowModalEdit} refreshData={refreshData} />}
                {showModalVoir && <FormateurVoir formateur={formateurVoir} setShowModalVoir={setShowModalVoir} />}
                {showModalProjetFormateur && <FormateurProjet idFormateur={formateurProjet} setShowModalProjetFormateur={setShowModalProjetFormateur} />}
            </AnimatePresence>
        </>
    );
}
