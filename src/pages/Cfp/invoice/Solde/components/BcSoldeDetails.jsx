import { useEffect, useState, useRef } from "react";

export function BonCommandeSoldeDetails({ bonCommande, unites, setting, onBcChange }) {
    const [bcItem, setBcItem] = useState({
        item_service: "",
        item_description: "",
        item_qty: 1,
        idUnite: 4,
        item_unit_price: 0,
        item_total_price: 0,
    });

    const isInitialized = useRef(false);

    useEffect(() => {
        if (bonCommande && !isInitialized.current) {
            const newItem = {
                item_service: `Projet du BC n°${bonCommande.bon_commande.numero}`,
                item_description: `BC n°${bonCommande.bon_commande.numero}, date ${bonCommande.bon_commande.date}`,
                item_qty: 1,
                idUnite: 4,
                item_unit_price: parseFloat(bonCommande.bon_commande.montant),
                item_total_price: parseFloat(bonCommande.bon_commande.montant),
            };

            setBcItem(newItem);
            onBcChange(newItem);
            isInitialized.current = true;
        }
    }, [bonCommande, onBcChange]); // Retirer bcItem des dépendances

    const handleChange = (field, value) => {
        const newItem = { ...bcItem, [field]: value };

        // Recalculer le total si le prix unitaire ou la quantité change
        if (field === 'item_unit_price' || field === 'item_qty') {
            newItem.item_total_price = parseFloat(newItem.item_qty) * parseFloat(newItem.item_unit_price);
        }

        setBcItem(newItem);
        onBcChange(newItem);
    };

    if (!bonCommande) {
        return null;
    }

    return (
        <tr className="border-b">
            <td className="px-4 py-3">
                <div className="flex flex-col">
                    <input
                        type="text"
                        name="item_service[]"
                        value={bcItem.item_service}
                        onChange={(e) => handleChange('item_service', e.target.value)}
                        className="p-2 text-base text-gray-700 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Service"
                        required
                    />
                </div>
            </td>
            <td className="px-4 py-3">
                <textarea
                    name="item_description[]"
                    value={bcItem.item_description}
                    onChange={(e) => handleChange('item_description', e.target.value)}
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
                    value={bcItem.item_qty}
                    onChange={(e) => handleChange('item_qty', parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-full p-2 text-base text-center text-gray-700 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </td>
            <td className="px-4 py-3">
                <select
                    name="idUnite[]"
                    value={bcItem.idUnite}
                    onChange={(e) => handleChange('idUnite', parseInt(e.target.value))}
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
                    value={bcItem.item_unit_price}
                    onChange={(e) => handleChange('item_unit_price', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    className="w-full p-2 text-base text-right text-gray-700 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </td>
            <td className="px-4 py-3 text-right">
                <span className="font-semibold text-gray-700">
                    {bcItem.item_total_price.toLocaleString()} {setting?.currency_code}
                </span>
                <input
                    type="hidden"
                    name="item_total_price[]"
                    value={bcItem.item_total_price}
                />
            </td>
        </tr>
    );
}