import { useEffect, useState } from "react";
import { AcompteSoldeDetails } from "./AcompteSoldeDetails";
import axios from "../../../../../config/axios";
import { BonCommandeSoldeDetails } from "./BcSoldeDetails";

export function SearchSolde({
    idEtp,
    data,
    setSumItems,
    selectedBc,
    onSoldeDataChange
}) {
    const setting = JSON.parse(sessionStorage.getItem("setting"));
    const [acompteDetails, setAcompteDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bonCommande, setBonCommande] = useState(null);
    const [bcItem, setBcItem] = useState(null);
    const [acomptesItems, setAcomptesItems] = useState([]);

    // Calcul du total pour la facture de solde
    useEffect(() => {
        const totalAcomptes = acomptesItems.reduce((sum, item) => sum + parseFloat(item.item_total_price), 0);
        const montantBc = bcItem ? parseFloat(bcItem.item_total_price) : 0;
        const resteAPayer = montantBc + totalAcomptes;

        // Le montant de la facture de solde est le reste à payer
        setSumItems(resteAPayer > 0 ? resteAPayer : 0);
    }, [acomptesItems, bcItem, setSumItems]);

    // Charger les détails des acomptes et le bon de commande quand le BC change
    useEffect(() => {
        if (selectedBc) {
            fetchBonCommandeDetails(selectedBc);
            fetchAcompteDetails(selectedBc);
        } else {
            // Réinitialiser tout quand aucun BC n'est sélectionné
            setBonCommande(null);
            setAcompteDetails([]);
            setBcItem(null);
            setAcomptesItems([]);
            onSoldeDataChange([]);
        }
    }, [selectedBc]);

    const fetchAcompteDetails = async (bcId) => {
        try {
            setLoading(true);
            const response = await axios.get(`cfp/factureSolde/${bcId}/detailAcompte`);
            const responseData = response.data;

            setAcompteDetails(responseData.details || []);
        } catch (err) {
            console.error("Erreur lors du chargement des acomptes:", err);
            setAcompteDetails([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchBonCommandeDetails = async (bcId) => {
        try {
            const response = await axios.get(`cfp/factureSolde/${bcId}/detailBc`);
            setBonCommande(response.data);
        } catch (err) {
            console.error("Erreur lors du chargement du bon de commande:", err);
            setBonCommande(null);
        }
    };

    const handleBcChange = (item) => {
        setBcItem(item);
    };

    const handleAcompteChange = (items) => {
        setAcomptesItems(items);
    };

    // Préparer les données pour l'envoi (BC + Acomptes seulement)
    useEffect(() => {
        const allItems = [];
        if (bcItem) allItems.push(bcItem);
        if (acomptesItems.length > 0) allItems.push(...acomptesItems);

        onSoldeDataChange(allItems);
    }, [bcItem, acomptesItems, onSoldeDataChange]);

    return (
        <div id="soldeInvoicesContainer">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="w-1/4 px-4 py-2 font-semibold text-left text-gray-500">
                            Services
                        </th>
                        <th className="w-1/4 p-2 font-semibold text-center text-gray-500">
                            Description
                        </th>
                        <th className="w-1/12 p-2 font-semibold text-center text-gray-500">
                            Quantité
                        </th>
                        <th className="w-1/12 p-2 font-semibold text-center text-gray-500">
                            Unité
                        </th>
                        <th className="px-4 py-2 font-semibold text-right text-gray-500">
                            Prix unitaire
                        </th>
                        <th className="px-4 py-2 font-semibold text-right text-gray-500">
                            Montant
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {selectedBc ? (
                        <>
                            <BonCommandeSoldeDetails
                                bonCommande={bonCommande}
                                unites={data.unites}
                                setting={setting}
                                onBcChange={handleBcChange}
                            />

                            <AcompteSoldeDetails
                                idBC={selectedBc}
                                unites={data.unites}
                                acompteDetails={acompteDetails}
                                loading={loading}
                                onAcompteChange={handleAcompteChange}
                                hasAcomptes={acompteDetails && acompteDetails.length > 0}
                            />
                        </>
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-4 text-center text-red-500">
                                Sélectionnez un bon de commande pour afficher les acomptes associés.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}