import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Drawer from "../../../components/Common/Drawer";
import axios from "../../../config/axios";
import { FolderOpen, Calendar, MapPin, Building2, ArrowRight } from "lucide-react";
import dayjs from "dayjs";

const ProjetsBonCommandeDrawer = ({
    open,
    onClose,
    bonCommandeId
}) => {
    const navigate = useNavigate();
    const [projets, setProjets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchProjets = async () => {
        if (!bonCommandeId) return;

        setLoading(true);
        setError("");
        try {
            const res = await axios.get(`/cfp/bon-commande/${bonCommandeId}/projet`);
            setProjets(res.data || []);
        } catch (err) {
            console.error("Erreur lors du chargement des projets:", err);
            setError("Erreur lors du chargement des projets");
            setProjets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && bonCommandeId) {
            fetchProjets();
        }
    }, [open, bonCommandeId]);

    const handleClose = () => {
        setProjets([]);
        setError("");
        onClose();
    };

    return (
        <Drawer
            open={open}
            onClose={handleClose}
            title="Projets associés au bon de commande"
            size="lg"
        >
            <div className="flex flex-col h-full">
                {/* En-tête avec statistiques */}
                <div className="p-4 mb-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FolderOpen className="w-6 h-6 text-purple-600" />
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">
                                    {projets.length > 1 ? `${projets.length} projets associés` : projets.length === 1 ? "1 projet associé" : "Aucun projet associé"}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Liste des projets liés à ce bon de commande
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenu */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-8 h-8 mb-4 border-2 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                            <p className="text-sm text-gray-500">Chargement des projets...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-12 h-12 mb-4 text-gray-400">
                                <FolderOpen className="w-full h-full" />
                            </div>
                            <p className="mb-2 text-sm font-medium text-gray-900">Erreur de chargement</p>
                            <p className="mb-4 text-xs text-gray-500">{error}</p>
                            <button
                                onClick={fetchProjets}
                                className="px-4 py-2 text-sm text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200"
                            >
                                Réessayer
                            </button>
                        </div>
                    ) : projets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 mb-4 text-gray-300">
                                <FolderOpen className="w-full h-full" />
                            </div>
                            <p className="mb-1 text-sm font-medium text-gray-900">Aucun projet</p>
                            <p className="text-xs text-gray-500">
                                Aucun projet n'est associé à ce bon de commande pour le moment
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {projets.map((projet, index) => (
                                <div onClick={() => navigate(`/cfp/projet/detail/${projet.idProjet}`)}
                                    key={projet.idProjet || index}
                                    className="p-4 transition-colors border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300"
                                >
                                    {/* En-tête du projet */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 line-clamp-2">
                                                {projet.module_name || "Projet sans nom"}
                                            </h4>
                                        </div>
                                        {projet.project_status && (
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${projet.project_status === 'Terminé'
                                                ? 'bg-green-100 text-green-800'
                                                : projet.project_status === 'En cours'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {projet.project_status}
                                            </span>
                                        )}
                                    </div>

                                    {/* Détails du projet */}
                                    <div className="flex items-end justify-between w-full">
                                        <div className="space-y-2 text-sm text-gray-600">

                                            {/* Dates */}
                                            <div className="flex items-center gap-4 text-xs">
                                                {(projet.dateDebut || projet.dateFin) && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 text-gray-400" />
                                                        <span>
                                                            {projet.dateDebut
                                                                ? dayjs(projet.dateDebut).format("DD/MM/YYYY")
                                                                : "??"
                                                            }
                                                            {" - "}
                                                            {projet.dateFin
                                                                ? dayjs(projet.dateFin).format("DD/MM/YYYY")
                                                                : "??"
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* etp_name */}
                                            <div className="flex flex-wrap items-center gap-4 text-xs">
                                                {projet.etp_name && (
                                                    <div className="flex items-center gap-1">
                                                        <Building2 className="w-3 h-3 text-gray-400" />
                                                        <span>{projet.etp_name}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {/* li_name */}
                                            <div className="flex flex-wrap items-center gap-4 text-xs">
                                                {projet.li_name && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3 text-gray-400" />
                                                        <span>{projet.li_name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer hover:bg-purple-50">
                                            <ArrowRight className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm text-gray-600">Voir</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pied de page */}
                <div className="flex justify-end pt-4 mt-4 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </Drawer>
    );
};

export default ProjetsBonCommandeDrawer;