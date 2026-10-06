import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import axios from "../../../config/axios";

// Liste des statuts
const STATUS_LIST = [
    { idStatus: 1, status_name: 'Nouveau', status_color: '#95a5a6' },
    { idStatus: 2, status_name: 'Planifié', status_color: '#3498db' },
    { idStatus: 3, status_name: 'En cours', status_color: '#f39c12' },
    { idStatus: 4, status_name: 'Exécuté', status_color: '#2ecc71' },
    { idStatus: 5, status_name: 'Annulé', status_color: '#e74c3c' },
    { idStatus: 6, status_name: 'Facturé', status_color: '#9b59b6' },
    { idStatus: 7, status_name: 'Payé', status_color: '#27ae60' },
    { idStatus: 8, status_name: 'Partiel', status_color: '#d48607' }
];

const StatusDropdown = ({ bonCommande, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(bonCommande.idStatus || 1);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

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
        return STATUS_LIST.find(status => status.idStatus === currentStatus) || STATUS_LIST[0];
    };

    const handleStatusChange = async (newStatusId) => {
        setLoading(true);
        try {
            await axios.post(`/cfp/bon-commande/${bonCommande.idBC}/changeStatus/${newStatusId}`);

            setCurrentStatus(newStatusId);
            setIsOpen(false);

            // Notifier le parent du changement
            if (onStatusChange) {
                onStatusChange(bonCommande.idBC, newStatusId);
            }

        } catch (error) {
            console.error("Erreur lors du changement de statut:", error);
            alert("Erreur lors du changement de statut");
        } finally {
            setLoading(false);
        }
    };

    const currentStatusInfo = getCurrentStatus();

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bouton du statut actuel */}
            <button
                className={`
          flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border transition-all
          ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}
        `}
                style={{
                    backgroundColor: `${currentStatusInfo.status_color}15`,
                    borderColor: `${currentStatusInfo.status_color}30`,
                    color: currentStatusInfo.status_color
                }}
                onClick={() => !loading && setIsOpen(!isOpen)}
                disabled={loading}
                title="Changer le statut"
            >
                {loading ? (
                    <div className="w-3 h-3 border-2 border-current rounded-full border-t-transparent animate-spin"></div>
                ) : null}
                <span>{currentStatusInfo.status_name}</span>
            </button>

            {/* Dropdown des statuts */}
            {isOpen && (
                <div className="absolute z-20 w-48 py-2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg top-full">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase border-b border-gray-100">
                        Changer le statut
                    </div>

                    {STATUS_LIST.map((status) => (
                        <button
                            key={status.idStatus}
                            className={`
                flex items-center justify-between w-full px-3 py-2 text-sm transition-colors
                ${currentStatus === status.idStatus
                                    ? 'bg-gray-50 font-medium'
                                    : 'hover:bg-gray-50'
                                }
              `}
                            onClick={() => handleStatusChange(status.idStatus)}
                        >
                            <div className="flex items-center gap-2">
                                <span style={{ color: status.status_color }}>
                                    {status.status_name}
                                </span>
                            </div>

                            {currentStatus === status.idStatus && (
                                <Check className="w-4 h-4 text-green-500" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StatusDropdown;