import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Eye } from "lucide-react";
import axios from "../../../config/axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function FormateurProjet({ setShowModalProjetFormateur, idFormateur }) {
    const [detailProjet, setDetailProjet] = useState(null);

    const fetchProjetFormateurs = async (idFormateur) => {
        try {
            const result = await axios.get(`/cfp/projets/getProjetByIdFormateur/${idFormateur}/formateur`);
            setDetailProjet(result.data);
        } catch (error) {
            console.error("Erreur lors du chargement des projets:", error);
        }
    };

    useEffect(() => {
        fetchProjetFormateurs(idFormateur);
    }, [idFormateur]);

    // Configuration des statuts de projet
    const statusConfig = [
        { 
            status: "Terminé", 
            color: "bg-green-500",
            filter: (p) => p.project_status === "Terminé"
        },
        { 
            status: "En Cours", 
            color: "bg-blue-500",
            filter: (p) => p.project_status === "En Cours"
        },
        { 
            status: "En préparation", 
            color: "bg-yellow-500",
            filter: (p) => p.project_status === "En préparation"
        },
        { 
            status: "Cloturé", 
            color: "bg-red-500",
            filter: (p) => p.project_status === "Cloturé"
        },
        { 
            status: "Supprimé", 
            color: "bg-red-500",
            filter: (p) => p.project_status === "Supprimé"
        }
    ];

    // Composant réutilisable pour une table de projet
    const ProjetTable = ({ status, color, filter }) => {
        const filteredProjects = detailProjet?.projet?.filter(filter) || [];
        
        if (filteredProjects.length === 0) return null;

        return (
            <div className="px-1 pb-4">
                <div className={`inline-flex items-center justify-center px-3 py-1 ${color} text-white text-sm font-semibold rounded-full shadow-sm`}>
                    <span>{status}</span>
                </div>
                <div className="mt-2 bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
                    <div className="grid gap-px bg-gray-200" style={{gridTemplateColumns: '70px 2fr 1.5fr 1.5fr 100px'}}>
                        {/* En-tête */}
                        <div className="bg-gray-400 text-white font-bold p-4 text-center">#</div>
                        <div className="bg-gray-400 text-white font-bold p-4">Cours</div>
                        <div className="bg-gray-400 text-white font-bold p-4">Référence</div>
                        <div className="bg-gray-400 text-white font-bold p-4">Période</div>
                        <div className="bg-gray-400 text-white font-bold p-4 text-center">Actions</div>

                        {/* Lignes de données */}
                        {filteredProjects.map((p, index) => (
                            <React.Fragment key={p.idProjet || index}>
                                <div className="bg-white p-4 text-center font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                                    {index + 1}
                                </div>
                                <div className="bg-white p-4 font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                                    {p.module_name}
                                </div>
                                <div className="bg-white p-4 text-gray-600 hover:bg-gray-50 transition-colors">
                                    <span className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                                        {p.project_reference}
                                    </span>
                                </div>
                                <div className="bg-white p-4 text-gray-600 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-1 text-sm">
                                        <span className="font-semibold">{p.dateDebut}</span>
                                        <span className="text-gray-400">→</span>
                                        <span className="font-semibold">{p.dateFin}</span>
                                    </div>
                                </div>
                                <div className="bg-white p-4 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <Link to={`/cfp/projet/detail/${p.idProjet}`}>
                                        <div className="p-2 rounded-lg transition-all group">
                                            <Eye className="w-5 h-5 text-gray-600 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                    </Link>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Overlay sombre */}
            <motion.div
                className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModalProjetFormateur(false)}
            />
            
            <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 1 }}
                className="fixed top-0 right-0 z-50 w-full h-full p-6 overflow-y-auto transition-transform duration-300 bg-white shadow-lg sm:w-2/3 md:w-1/2 lg:w-2/5"
            > 
                <div>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b-2 border-blue-200">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-bold text-gray-800">Liste des projets</h2>
                            <span className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                                {detailProjet?.projet?.length || 0}
                            </span>
                        </div>

                        <button 
                            onClick={() => setShowModalProjetFormateur(false)} 
                            className="text-gray-400 hover:text-gray-700 hover:bg-white p-2 rounded-full transition-all shadow-sm hover:shadow-md"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Tables de projets par statut */}
                    {statusConfig.map((config) => (
                        <ProjetTable 
                            key={config.status}
                            status={config.status}
                            color={config.color}
                            filter={config.filter}
                        />
                    ))}

                    {/* Message si aucun projet */}
                    {(!detailProjet?.projet || detailProjet.projet.length === 0) && (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">Aucun projet disponible</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
}

export default FormateurProjet;