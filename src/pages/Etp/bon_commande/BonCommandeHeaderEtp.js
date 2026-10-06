import { Plus } from "lucide-react";

export function BonCommandeHeaderETP({ onNewClick }) {
    return (
        <div className="flex items-center justify-between w-full mb-6">
            <h2 className="text-xl font-bold text-gray-700">
                Liste des Bons de Commande
            </h2>
            <button
                className="inline-flex gap-1 items-center rounded bg-gray-100 hover:bg-purple-500 hover:text-white px-3 !py-2 transition duration-200 ease-in-out text-gray-600"
                onClick={onNewClick}
            >
                <Plus className="w-5" />
                <span className="hidden md:inline">Nouveau</span>
            </button>
        </div>
    );
}