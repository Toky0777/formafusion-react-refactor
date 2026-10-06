import { useState } from "react";
import axios from "../../../config/axios";

const STATUS_OPTIONS = [
    { id: 10, label: "En relance active" },
    { id: 11, label: "Douteuse" },
    { id: 12, label: "En litige" },
    { id: 13, label: "Irrecouvrable" },
    { id: 14, label: "Transmis à huissier" },
    { id: 15, label: "En poursuite judiciaire" },
];

export function InvoiceStatusChanger({ idInvoice, onStatusChanged }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChangeStatus = async (statusId) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `/cfp/factures/${idInvoice}/changeStatus/${statusId}`
            );
            if (response.data.success) {
                if (onStatusChanged) onStatusChanged(statusId);
            } else {
                console.error("Erreur lors du changement de statut.")
            }
        } catch (error) {
            console.error("Erreur lors du changement de statut.")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <div className="relative p-2">
            <button
                onClick={() => setOpen((v) => !v)}
                disabled={loading}
                className="p-2 text-sm transition bg-gray-100 rounded-md hover:bg-gray-200"
            >
                Changer statut
            </button>
            {open && (
                <div className="absolute right-0 z-30 w-56 mt-2 bg-white border rounded-lg shadow-lg">
                    {STATUS_OPTIONS.map((status) => (
                        <button
                            key={status.id}
                            onClick={() => handleChangeStatus(status.id)}
                            className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                            disabled={loading}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
