import { useState } from "react";

const DetailsDevisCell = ({ detailsDevis }) => {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const items = parseDetailsDevis(detailsDevis);

    if (!detailsDevis) return <span className="text-gray-400">-</span>;

    const previewText = items.slice(0, 2).map(item => item.description).join(', ');

    return (
        <td className="relative">
            <div
                className="max-w-xs cursor-pointer"
                onMouseEnter={() => setIsTooltipOpen(true)}
                onMouseLeave={() => setIsTooltipOpen(false)}
            >
                <div className="text-sm text-gray-700 truncate">
                    {previewText
                        ? previewText.length > 30
                            ? previewText.substring(0, 30) + "..."
                            : previewText
                        : "-"}
                    {items.length > 2 && ` ... (+${items.length - 2})`}
                </div>
            </div>

            {isTooltipOpen && (
                <div className="absolute left-0 z-30 p-3 mt-1 text-xs text-white bg-gray-900 rounded-lg shadow-xl w-80 top-full">
                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <div key={index} className="pb-2 border-b border-gray-700 last:border-0 last:pb-0">
                                {/* Description */}
                                <div className="mb-1 font-medium text-white">
                                    {item.description}
                                </div>

                                {/* Détails sur une ligne */}
                                <div className="flex justify-between text-gray-300">
                                    <span>Qté: {item.quantity}</span>
                                    <span>P.U: {Number(item.unitPrice).toLocaleString("fr-FR")} Ar</span>
                                    <span className="font-medium text-green-300">
                                        {Number(item.totalPrice).toLocaleString("fr-FR")} Ar
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </td>
    );
};

// La fonction parseDetailsDevis reste la même
const parseDetailsDevis = (detailsDevis) => {
    if (!detailsDevis) return [];

    try {
        return detailsDevis.split(' | ').map(item => {
            const parts = item.split(' - ');
            return {
                description: parts[0] || 'Non spécifié',
                quantity: parts[1] || '0',
                unitPrice: parts[2] || '0',
                totalPrice: parts[3] || '0'
            };
        });
    } catch (error) {
        console.error('Erreur parsing details_devis:', error);
        return [];
    }
};

export default DetailsDevisCell;