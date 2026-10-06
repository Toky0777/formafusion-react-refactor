import { DOC_IMAGE_URL } from "../../../../config/env";
export default function CommandeAdd() {
    return (
        <>
            <div>
                <h1 className="text-gray-700 text-2xl font-semibold">Comment ajouter une nouvelle Bon de Commande?</h1>
            </div>

            <div className="mt-3">
                <ul className="text-gray-700 list-disc list-inside">
                    <li>Pour ajouter un nouveau bon de commande, cliquez sur le bouton <b>Nouveau</b> en haut à droite.</li>
                </ul>

                <div className="border-gray-400 border-2 rounded-md w-[900px]">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "commande3.png"} className="w-[900px]" />
                    </div>
                </div>

            </div>

            <div className="mt-3">
                <ul className="text-gray-700 list-disc list-inside">
                    <li>Un formulaire d’ajout s’affiche.</li>
                </ul>

                <div className="border-gray-400 border-2 rounded-md w-[900px]">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "commande6.png"} className="w-[900px]" />
                    </div>
                </div>

            </div>

            <div className="mt-3">
                <p className="text-gray-700">Démarche à suivre :</p>
                <ul className="text-gray-700 list-disc list-inside">
                    <li>Choisir d’abord l’entreprise ayant demandé le bon de commande.</li>
                    <li>Vérifier que cette entreprise dispose d’un devis avant d’établir le bon de commande.</li>
                    <li>L’entreprise envoie ensuite le bon de commande, incluant le numéro du bon, le prix et ses coordonnées, afin de pouvoir générer la facture à partir du bon de commande.</li>
                    <li>Le client propose les dates de début et de fin, qui seront indiquées dans le bon de commande.</li>
                </ul>
            </div>

        </>
    )
}