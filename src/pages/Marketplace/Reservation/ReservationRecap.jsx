import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../../config/axios";
import { Calendar, Users, CreditCard, Package, CheckCircle, ArrowLeft, MapPin } from "lucide-react";

export default function ReservationRecap() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recap, setRecap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecap = async () => {
            try {
                setError(null);
                const res = await axios.get(`/marketplace/reservation/${id}`);
                setRecap(res.data.data);
            } catch (err) {
                console.error("Erreur:", err);
                setError("Impossible de charger la réservation.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchRecap();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    if (error || !recap) {
        return (
            <div className="max-w-md p-6 mx-auto mt-10 text-center bg-white shadow rounded-xl">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-red-100 rounded-full">
                    <span className="text-2xl text-red-600">!</span>
                </div>
                <h2 className="mb-2 text-xl font-semibold">Erreur</h2>
                <p className="mb-4 text-gray-600">{error}</p>
                <button
                    onClick={() => navigate("/marketplace")}
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                    Retour
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* En-tête */}
            <div className="p-6 mb-6 text-center bg-white shadow rounded-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-full">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900">Réservation confirmée</h1>
                <p className="text-gray-600">Votre réservation a été enregistrée avec succès.</p>
                <div className="inline-block px-3 py-1 mt-3 text-sm text-blue-700 bg-blue-100 rounded">
                    Réf. #{recap.invoice_id || id}
                </div>
            </div>

            {/* Informations principales */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Projet */}
                <div className="p-5 bg-white border rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <Package className="w-5 h-5 mr-2 text-blue-600" />
                        <h3 className="font-semibold text-gray-800">Projet</h3>
                    </div>
                    <div className="space-y-2">
                        <InfoLine label="Nom" value={recap.project_title} />
                        <InfoLine label="Module" value={recap.module_name} />
                        <div className="flex items-center pt-2 mt-2 border-t">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-600">{recap.ville}</span>
                        </div>
                    </div>
                </div>

                {/* Dates */}
                <div className="p-5 bg-white border rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                        <h3 className="font-semibold text-gray-800">Dates</h3>
                    </div>
                    <div className="space-y-2">
                        <InfoLine label="Début" value={recap.dateDebut} />
                        <InfoLine label="Fin" value={recap.dateFin} />
                    </div>
                </div>

                {/* Participants */}
                <div className="p-5 bg-white border rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <Users className="w-5 h-5 mr-2 text-blue-600" />
                        <h3 className="font-semibold text-gray-800">Participants</h3>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">{recap.nbPlace}</div>
                        <div className="text-sm text-gray-500">place{recap.nbPlace > 1 ? 's' : ''} réservée{recap.nbPlace > 1 ? 's' : ''}</div>
                    </div>
                </div>

                {/* Paiement */}
                <div className="p-5 bg-white border rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                        <h3 className="font-semibold text-gray-800">Paiement</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Total</span>
                            <span className="text-xl font-bold text-gray-900">
                                {recap.prix_total?.toLocaleString() || '0'} Ar
                            </span>
                        </div>
                        <InfoLine label="Facture" value={`#${recap.invoice_id}`} />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-4 p-6 mt-6 bg-white shadow rounded-xl">
                <button
                    onClick={() => navigate("/marketplace")}
                    className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
                    >
                        Imprimer
                    </button>
                    <button
                        onClick={() => navigate(`/reservations/${id}`)}
                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Détails complets
                    </button>
                </div>
            </div>

            {/* Note */}
            <div className="p-4 mt-4 text-sm text-center text-gray-500 rounded-lg bg-blue-50">
                Un email de confirmation vous a été envoyé.
            </div>
        </div>
    );
}

// Composant helper
function InfoLine({ label, value }) {
    return (
        <div className="flex justify-between py-1">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-gray-900">{value}</span>
        </div>
    );
}