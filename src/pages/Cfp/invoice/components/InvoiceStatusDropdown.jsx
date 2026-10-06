import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import axios from "../../../../config/axios";
import { getStatusColor } from "../../../../services/service-action";

// Liste des statuts de facture
const INVOICE_STATUS_LIST = [
    { idStatus: 1, status_name: "Brouillon" },
    { idStatus: 2, status_name: "Non envoyé" },
    { idStatus: 3, status_name: "Envoyé" },
    { idStatus: 4, status_name: "Payé" },
    { idStatus: 5, status_name: "Partiel" },
    { idStatus: 9, status_name: "Annulé" },
    { idStatus: 10, status_name: "En relance active" },
    { idStatus: 11, status_name: "Douteuse" },
    { idStatus: 12, status_name: "En litige" },
    { idStatus: 13, status_name: "Irrecouvrable" },
    { idStatus: 14, status_name: "Transmis à huissier" },
    { idStatus: 15, status_name: "En poursuite judiciaire" }
];

const InvoiceStatusDropdown = ({ invoice, onStatusChange, mode = "show" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(invoice.invoice_status || 1);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Filtrer les statuts selon le mode
    const getFilteredStatuses = () => {
        if (mode === "list") {
            return INVOICE_STATUS_LIST.filter(status => status.idStatus >= 10);
        }
        return INVOICE_STATUS_LIST;
    };

    const filteredStatuses = getFilteredStatuses();

    // Obtenir la couleur pour un statut donné
    const getStatusColorForId = (statusId) => {
        return getStatusColor(statusId);
    };

    // Fonction pour convertir une couleur hex en rgba avec opacité
    const hexToRgba = (hex, opacity) => {
        // Retirer le # si présent
        hex = hex.replace('#', '');

        // Convertir en valeurs RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getCurrentStatus = () => {
        const status = INVOICE_STATUS_LIST.find(status => status.idStatus === currentStatus) || INVOICE_STATUS_LIST[0];
        const statusColor = getStatusColorForId(status.idStatus);
        return {
            ...status,
            status_color: statusColor
        };
    };

    const handleStatusChange = async (newStatusId) => {
        setLoading(true);
        try {
            await axios.post(`/cfp/factures/${invoice.idInvoice}/changeStatus/${newStatusId}`);

            setCurrentStatus(newStatusId);
            setIsOpen(false);

            // Notifier le parent du changement
            if (onStatusChange) {
                onStatusChange(invoice.idInvoice, newStatusId);
            }

        } catch (error) {
            console.error("Erreur lors du changement de statut:", error);
            alert("Erreur lors du changement de statut");
        } finally {
            setLoading(false);
        }
    };

    const currentStatusInfo = getCurrentStatus();
    const currentStatusColor = getStatusColorForId(currentStatus);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bouton du statut actuel */}
            <button
                className={`
        flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}
    `}
                style={{
                    backgroundColor: currentStatusColor,
                    color: 'white'
                }}
                onClick={() => !loading && setIsOpen(!isOpen)}
                disabled={loading}
                title="Changer le statut de la facture"
            >
                {loading ? (
                    <div
                        className="w-3 h-3 border-2 rounded-full border-t-transparent animate-spin"
                        style={{ borderColor: 'white' }}
                    ></div>
                ) : null}
                <span>{currentStatusInfo.status_name}</span>
            </button>

            {/* Dropdown des statuts */}
            {isOpen && (
                <div className="absolute right-0 z-20 w-56 py-2 mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg top-full max-h-80">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase border-b border-gray-100">
                        Changer le statut
                    </div>

                    {filteredStatuses.map((status) => {
                        const statusColor = getStatusColorForId(status.idStatus);
                        const isCurrent = currentStatus === status.idStatus;

                        return (
                            <button
                                key={status.idStatus}
                                className={`
                                    flex items-center justify-between w-full px-3 py-2 text-sm transition-colors
                                    ${isCurrent
                                        ? 'bg-gray-50 font-medium'
                                        : 'hover:bg-gray-50'
                                    }
                                `}
                                onClick={() => handleStatusChange(status.idStatus)}
                                disabled={loading}
                            >
                                <div className="flex items-center gap-2">
                                    <span style={{ color: statusColor }}>
                                        {status.status_name}
                                    </span>
                                </div>

                                {isCurrent && (
                                    <Check className="w-4 h-4 text-green-500" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default InvoiceStatusDropdown;