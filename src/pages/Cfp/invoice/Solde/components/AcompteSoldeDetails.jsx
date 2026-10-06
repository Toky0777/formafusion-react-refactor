import { useEffect, useState, useRef } from "react";

export function AcompteSoldeDetails({ idBC, unites, acompteDetails, loading, onAcompteChange, hasAcomptes }) {
    const setting = JSON.parse(sessionStorage.getItem("setting"));
    const [acomptes, setAcomptes] = useState([]);
    const isInitialized = useRef(false);

    // Réinitialiser les acomptes quand les acompteDetails changent
    useEffect(() => {
        if (acompteDetails && acompteDetails.length > 0 && !isInitialized.current) {
            const formattedAcomptes = acompteDetails.map((acompte, index) => ({
                ...acompte,
                item_service: `Acompte ${index + 1}`,
                // S'assurer que les prix sont négatifs
                item_unit_price: -Math.abs(parseFloat(acompte.item_unit_price)),
                item_total_price: -Math.abs(parseFloat(acompte.item_total_price))
            }));
            setAcomptes(formattedAcomptes);
            onAcompteChange(formattedAcomptes);
            isInitialized.current = true;
        } else if (!acompteDetails || acompteDetails.length === 0) {
            // Si pas d'acomptes, réinitialiser
            setAcomptes([]);
            onAcompteChange([]);
            isInitialized.current = false;
        }
    }, [acompteDetails]); // Retirer onAcompteChange des dépendances

    const handleAcompteChange = (index, field, value) => {
        const updatedAcomptes = [...acomptes];

        if (field === 'item_unit_price' || field === 'item_qty') {
            // Pour le prix unitaire, s'assurer qu'il reste négatif
            if (field === 'item_unit_price') {
                value = -Math.abs(parseFloat(value) || 0);
            }

            updatedAcomptes[index] = {
                ...updatedAcomptes[index],
                [field]: value
            };

            // Recalculer le total (qui sera aussi négatif)
            updatedAcomptes[index].item_total_price =
                parseFloat(updatedAcomptes[index].item_qty) * parseFloat(updatedAcomptes[index].item_unit_price);
        } else {
            updatedAcomptes[index] = {
                ...updatedAcomptes[index],
                [field]: value
            };
        }

        setAcomptes(updatedAcomptes);
        onAcompteChange(updatedAcomptes);
    };

    if (loading) {
        return (
            <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                        Chargement des acomptes...
                    </div>
                </td>
            </tr>
        );
    }

    if (!idBC) {
        return null;
    }

    // Afficher "Aucun acompte" seulement si le chargement est terminé et qu'il n'y a pas d'acomptes
    if (!loading && acomptes.length === 0) {
        return (
            <tr>
                <td colSpan="6" className="p-4 text-center text-red-500">
                    Aucun acompte trouvé pour ce bon de commande
                </td>
            </tr>
        );
    }

    return (
        <>
            {acomptes.map((acompte, index) => (
                <tr key={acompte.idItem || index} className="transition-colors bg-white border-b hover:bg-blue-50/50">
                    <td className="px-4 py-3">
                        <div className="flex flex-col">
                            <input
                                type="text"
                                name="item_service[]"
                                value={acompte.item_service}
                                onChange={(e) => handleAcompteChange(index, 'item_service', e.target.value)}
                                className="p-2 text-base text-gray-700 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Service"
                                required
                            />
                        </div>
                    </td>
                    <td className="px-4 py-3">
                        <textarea
                            name="item_description[]"
                            value={acompte.item_description}
                            onChange={(e) => handleAcompteChange(index, 'item_description', e.target.value)}
                            className="w-full p-2 text-sm text-gray-700 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Description"
                            rows="2"
                            required
                        />
                    </td>
                    <td className="px-4 py-3">
                        <input
                            type="number"
                            name="item_qty[]"
                            value={acompte.item_qty}
                            onChange={(e) => handleAcompteChange(index, 'item_qty', parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-full p-2 text-base text-center text-gray-700 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </td>
                    <td className="px-4 py-3">
                        <select
                            name="idUnite[]"
                            value={acompte.idUnite}
                            onChange={(e) => handleAcompteChange(index, 'idUnite', parseInt(e.target.value))}
                            className="w-full p-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Sélectionner</option>
                            {unites.map((unite) => (
                                <option key={unite.idUnite} value={unite.idUnite}>
                                    {unite.unite_name}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td className="px-4 py-3">
                        <input
                            type="number"
                            name="item_unit_price[]"
                            value={acompte.item_unit_price}
                            onChange={(e) => handleAcompteChange(index, 'item_unit_price', parseFloat(e.target.value) || 0)}
                            step="0.01"
                            className="w-full p-2 text-base text-right text-red-600 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </td>
                    <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-red-600">
                            {acompte.item_total_price.toLocaleString()} {setting?.currency_code}
                        </span>
                        <input
                            type="hidden"
                            name="item_total_price[]"
                            value={acompte.item_total_price}
                        />
                    </td>
                </tr>
            ))}
        </>
    );
}