import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FileText,
    Download,
    Trash2,
    Eye,
    Calendar,
    Building,
    User,
    Mail,
    Phone,
    Hash,
    AlertCircle,
    ChevronLeft,
    HandCoins, MapPin,
    FolderOpen,
    Building2
} from "lucide-react";
import axios from "../../../../config/axios";
import StatusDropdown from "../StatusDropdown";

export default function BonCommandeView({ onStatusChange }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBonCommande();
    }, [id]);

    const fetchBonCommande = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/cfp/bon-commande/${id}`);
            setData(res.data);
        } catch (err) {
            setError("Erreur lors du chargement du bon de commande");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (idDocument) => {
        try {
            await axios.get(`/bon-commandes/doc/${idDocument}/download`, {
                responseType: 'blob'
            });
        } catch (error) {
            console.error("Erreur lors du téléchargement:", error);
        }
    };

    const handleDeleteDocument = async (idDocument) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
            try {
                await axios.delete(`/bon-commandes/doc/${idDocument}/documents`);
                fetchBonCommande();
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
            }
        }
    };

    const handlePreview = async (idDocument) => {
        try {
            const response = await axios.get(`/bon-commandes/doc/${idDocument}/preview`, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], {
                type: response.headers['content-type']
            });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');

            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 1000);
        } catch (error) {
            console.error("Erreur lors de la prévisualisation:", error);
        }
    };

    const handleStatusChange = (bonCommandeId, newStatusId) => {
        console.log(`Statut changé pour le BC ${bonCommandeId}: ${newStatusId}`);
        if (onStatusChange) {
            onStatusChange(bonCommandeId, newStatusId);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-purple-500 rounded-full border-3 border-t-transparent animate-spin"></div>
                    <p className="text-gray-600">Chargement du bon de commande...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="p-6 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                    <div className="mb-2 text-lg font-semibold text-red-500">{error || "Bon de commande non trouvé"}</div>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors duration-200 font-medium"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    const { bon_commande, documents, projets } = data;

    return (
        <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100 lg:p-6">
            {/* Header */}
            <div className="mx-auto max-w-7xl">
                <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
                    <div className="flex flex-col gap-6">
                        {/* Première ligne : Retour et titre */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center gap-2 px-4 py-2.5 text-gray-600 transition-all duration-200 bg-white rounded-xl hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">
                                    Bon de Commande <span className="text-purple-600">{bon_commande.numero}</span>
                                </h1>
                            </div>

                            <StatusDropdown
                                bonCommande={bon_commande}
                                onStatusChange={handleStatusChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 xl:col-span-2">
                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="p-5 border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="mb-1 text-sm font-medium text-blue-700">Montant BC</p>
                                        <p className="text-2xl font-bold text-blue-900">
                                            {Number(bon_commande.montant).toLocaleString("fr-FR")} Ar
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-500/10 rounded-xl">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 border border-green-200 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="mb-1 text-sm font-medium text-green-700">Montant Devis</p>
                                        <p className="text-2xl font-bold text-green-900">
                                            {Number(bon_commande.montant_devis).toLocaleString("fr-FR")} Ar
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-500/10 rounded-xl">
                                        <FileText className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="mb-1 text-sm font-medium text-purple-700">Date BC</p>
                                        <p className="text-2xl font-bold text-purple-900">
                                            {new Date(bon_commande.date).toLocaleDateString("fr-FR")}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-500/10 rounded-xl">
                                        <Calendar className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informations détaillées */}
                        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-900">Informations détaillées</h2>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Informations BC */}
                                <div>
                                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                                        <Hash className="w-5 h-5 text-purple-600" />
                                        Bon de Commande
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <InfoItem
                                            icon={<Hash className="w-4 h-4" />}
                                            label="Numéro BC"
                                            value={bon_commande.numero}
                                            accent="purple"
                                        />
                                        <InfoItem
                                            icon={<Calendar className="w-4 h-4" />}
                                            label="Date BC"
                                            value={new Date(bon_commande.date).toLocaleDateString("fr-FR")}
                                        />
                                        <InfoItem
                                            icon={<Calendar className="w-4 h-4" />}
                                            label="Date début"
                                            value={bon_commande.date_debut ? new Date(bon_commande.date_debut).toLocaleDateString("fr-FR") : "-"}
                                        />
                                        <InfoItem
                                            icon={<Calendar className="w-4 h-4" />}
                                            label="Date fin"
                                            value={bon_commande.date_fin ? new Date(bon_commande.date_fin).toLocaleDateString("fr-FR") : "-"}
                                        />
                                        <InfoItem
                                            icon={<HandCoins className="w-4 h-4" />}
                                            label="Modalité de paiement"
                                            value={bon_commande.modalite ? `${bon_commande.modalite} jours` : '-'}
                                        />
                                    </div>
                                </div>

                                {/* Informations Devis */}
                                <div>
                                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        Devis Associé
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <InfoItem
                                            icon={<Hash className="w-4 h-4" />}
                                            label="Numéro Devis"
                                            value={bon_commande.numero_devis}
                                            accent="blue"
                                        />
                                        <InfoItem
                                            icon={<Calendar className="w-4 h-4" />}
                                            label="Date Devis"
                                            value={new Date(bon_commande.date_devis).toLocaleDateString("fr-FR")}
                                        />
                                    </div>

                                    {/* Détails du devis */}
                                    {bon_commande.details_devis && (
                                        <div className="mt-4">
                                            <h4 className="mb-3 font-medium text-gray-700">Détails des articles</h4>
                                            <div className="p-4 space-y-3 bg-white border border-gray-200 rounded-xl">
                                                {bon_commande.details_devis.split(' | ').map((detail, index) => {
                                                    // Parsing des données du détail
                                                    const parts = detail.split(' - ');
                                                    const description = parts[0] || '';
                                                    const quantity = parts[1] ? parts[1].replace('Qté: ', '') : '';
                                                    const unitPrice = parts[2] ? parts[2].replace('P.U: ', '').replace(' Ar', '') : '';
                                                    const totalPrice = parts[3] ? parts[3].replace('Total: ', '').replace(' Ar', '') : '';

                                                    return (
                                                        <div key={index} className="p-3 border border-gray-100 rounded-lg bg-gray-50">
                                                            {/* Description */}
                                                            <div className="mb-2 font-medium text-gray-900">
                                                                {description}
                                                            </div>

                                                            {/* Détails sur une ligne */}
                                                            <div className="flex justify-between text-sm text-gray-600">
                                                                <span>Qté: {quantity}</span>
                                                                <span>P.U: {Number(unitPrice).toLocaleString("fr-FR")} Ar</span>
                                                                <span className="font-medium text-green-600">
                                                                    {Number(totalPrice).toLocaleString("fr-FR")} Ar
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Documents et Informations Entreprise/Contact */}
                    <div className="space-y-6">
                        {/* Documents Card */}
                        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                                    <FileText className="w-5 h-5 text-purple-600" />
                                    Documents
                                    <span className="px-2 py-1 ml-2 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                                        {documents.length}
                                    </span>
                                </h2>
                            </div>

                            <div className="p-6">
                                {documents.length === 0 ? (
                                    <div className="py-8 text-center">
                                        <FileText className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                                        <p className="mb-4 text-gray-500">Aucun document disponible</p>
                                        <button className="px-4 py-2 font-medium text-purple-600 transition-colors duration-200 border border-purple-200 rounded-xl hover:bg-purple-50">
                                            Ajouter un document
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {documents.map((doc) => (
                                            <div key={doc.idDocument} className="p-4 transition-all duration-200 border border-gray-200 group bg-gray-50 hover:bg-purple-50 rounded-xl hover:border-purple-200">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center flex-1 min-w-0 gap-3">
                                                        <div className="p-2 bg-white border border-gray-200 rounded-lg group-hover:border-purple-200">
                                                            <FileText className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-gray-900 truncate">
                                                                {doc.document_name}
                                                            </div>
                                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                                                        <button
                                                            onClick={() => handlePreview(doc.idDocument)}
                                                            className="p-2 text-gray-400 transition-colors duration-200 rounded-lg hover:text-blue-600 hover:bg-white"
                                                            title="Prévisualiser"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownload(doc.idDocument)}
                                                            className="p-2 text-gray-400 transition-colors duration-200 rounded-lg hover:text-green-600 hover:bg-white"
                                                            title="Télécharger"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteDocument(doc.idDocument)}
                                                            className="p-2 text-gray-400 transition-colors duration-200 rounded-lg hover:text-red-600 hover:bg-white"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Entreprise et Contact */}
                        <div className="space-y-6">
                            {/* Entreprise */}
                            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
                                <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold text-gray-900">
                                    <Building className="w-5 h-5 text-purple-600" />
                                    Entreprise
                                </h3>
                                <div className="space-y-3">
                                    <div className="text-lg font-semibold text-gray-900">{bon_commande.etp_name}</div>
                                    {bon_commande.etp_email && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            {bon_commande.etp_email}
                                        </div>
                                    )}
                                    {bon_commande.etp_phone && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone className="w-4 h-4" />
                                            {bon_commande.etp_phone}
                                        </div>
                                    )}
                                    {bon_commande.etp_address && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            {bon_commande.etp_address}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact */}
                            {(bon_commande.contact_name || bon_commande.contact_mail || bon_commande.contact_phone) && (
                                <div className="p-6 bg-white border border-blue-200 shadow-sm rounded-2xl">
                                    <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900">
                                        <User className="w-5 h-5 text-blue-600" />
                                        Personne à contacter
                                    </h3>
                                    <div className="space-y-3">
                                        {bon_commande.contact_name && (
                                            <div className="text-lg font-semibold text-gray-900">{bon_commande.contact_name}</div>
                                        )}
                                        {bon_commande.contact_mail && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4" />
                                                {bon_commande.contact_mail}
                                            </div>
                                        )}
                                        {bon_commande.contact_phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4" />
                                                {bon_commande.contact_phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Projet card */}
                        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
                            <div className="p-5 border-b border-gray-100">
                                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                                    <FolderOpen className="w-5 h-5 text-purple-600" />
                                    Projets Associés
                                    <span className="px-2 py-1 ml-2 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                                        {data.projets?.length || 0}
                                    </span>
                                </h2>
                            </div>

                            <div className="p-5">
                                {!data.projets || data.projets.length === 0 ? (
                                    <div className="py-6 text-center">
                                        <div className="p-3 mx-auto mb-3 bg-gray-100 rounded-full w-14 h-14">
                                            <FileText className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-500">Aucun projet associé</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {data.projets.map((projet) => (
                                            <div
                                                key={projet.idProjet}
                                                className="p-4 transition-all duration-200 border border-gray-100 cursor-pointer bg-gray-50 rounded-xl hover:border-gray-300 hover:shadow-sm group"
                                                onClick={() => navigate(`/cfp/projet/detail/${projet.idProjet}`)}
                                            >
                                                {/* Header du projet */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 line-clamp-2">
                                                        {projet.module_name || "Pas de titre"}
                                                    </h3>
                                                    <div className="rounded-md border-[1px] px-2 py-1/2 bg-gray-100 border-gray-200">
                                                        <span className="text-xs">{projet.project_status}</span>
                                                    </div>
                                                </div>

                                                {/* Dates */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <Building2 className="w-3 h-3 text-gray-500" />
                                                        <span>{projet.etp_name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <Calendar className="w-3 h-3 text-gray-500" />
                                                        <span className="font-medium">Période:</span>
                                                        <span>
                                                            {projet.dateDebut ? new Date(projet.dateDebut).toLocaleDateString("fr-FR") : "Pas de date"}
                                                            {" → "}
                                                            {projet.dateFin ? new Date(projet.dateFin).toLocaleDateString("fr-FR") : "Pas de date"}
                                                        </span>
                                                    </div>

                                                    {/* Lieu */}
                                                    {projet.li_name && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                                            <MapPin className="w-3 h-3 text-gray-500" />
                                                            <span className="font-medium">Lieu:</span>
                                                            <span className="truncate">{projet.li_name || 'aucun lieu'}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Composant InfoItem amélioré
const InfoItem = ({ icon, label, value, accent = "gray" }) => {
    const accentColors = {
        purple: "text-purple-600",
        blue: "text-blue-600",
        green: "text-green-600",
        gray: "text-gray-600"
    };

    return (
        <div className="flex items-start gap-3 p-3 border border-gray-200 bg-gray-50 rounded-xl">
            <div className={`p-2 bg-white rounded-lg border border-gray-200 ${accentColors[accent]}`}>
                {icon}
            </div>
            <div className="flex-1">
                <div className="mb-1 text-sm font-medium text-gray-500">{label}</div>
                <div className="font-semibold text-gray-900">{value || "-"}</div>
            </div>
        </div>
    );
};