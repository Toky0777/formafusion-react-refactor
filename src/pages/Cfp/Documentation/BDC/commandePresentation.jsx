import { DOC_IMAGE_URL } from "../../../../config/env";
export default function CommandePresentation() {
    return (
        <>
            <div>
                <h1 className="text-gray-700 text-2xl font-semibold">Presentation de la page</h1>
            </div>

            <div className="mt-3">
                <h1 className="text-gray-700"><b>Bon de Commande</b> est un document officiel émis par le client pour confirmer qu’il accepte les Projet ou Cours proposés par le centre de formation </h1>
            </div>


            <div className="mt-3">
                <ul className="text-gray-700 list-disc list-inside">
                    <li>En tête de la page, il est possible d’ajouter un nouveau bon de commande.</li>
                </ul>

                <div className="border-gray-400 border-2 rounded-md w-[900px]">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "commande3.png"} className="w-[900px]" />
                    </div>
                </div>

            </div>

            <div className="mt-3">
                <ul className="text-gray-700 list-disc list-inside">
                    <li>On peut également voir le total des bons de commande, des devis, ainsi que les nouveaux bons de commande.</li>
                </ul>

                <div className="border-gray-400 border-2 rounded-md w-[900px]">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "commande4.png"} className="w-[900px]" />
                    </div>
                </div>

            </div>

            <div className="mt-3">
                <ul className="text-gray-700 list-disc list-inside">
                    <li>On peut le filtrer par tous les statuts, par numéro de bon de commande, par entreprise ou par date.</li>
                    <li>On peut également le filtrer par nombre de résultats par page : 10, 25, 50 ou 100.</li>
                </ul>

                <div className="border-gray-400 border-2 rounded-md w-[900px]">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "commande5.png"} className="w-[900px]" />
                    </div>
                </div>

            </div>
        </>
    )
}