import { Link } from "react-router-dom";
import { DOC_IMAGE_URL } from "../../../../config/env";

export default function DocFactureAdd() {
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Ajout Nouvelle Facture</h1>
            </div>

            <div className="mt-7">
                <p className="text-gray-700">
                    La facture ajoutée est obligatoirement liée à un devis ; sans devis, il n’est pas possible de créer une facture.
                </p>

            </div>

            <div className="mt-4 ">

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Ajout Facture
                        </p>
                    </div>
                </div>

                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                    <li>Pour ajouter une nouvelle facture, cliquez sur le bouton <b>Nouveau</b> en haut à droite.</li>
                </ul>

                <div className="mt-6">
                    <h1 className="text-gray-700">Lorsque vous cliquez dessus, un menu déroulant apparaît avec trois options :</h1>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>Facture : Permet de créer une nouvelle facture standard.</li>
                        <li>Facture d’acompte:Sert à enregistrer un acompte versé par le client avant la livraison totale du service</li>
                        <li>Facture de solde : Utilisée pour facturer le montant restant dû après un ou plusieurs acomptes.</li>
                    </ul>
                </div>


                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "facture10.png"} />
                    </div>
                </div>

                <div>
                    <div className="mt-6">
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                            <li>Et la page d'ajout s'affiche</li>
                        </ul>
                    </div>
                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "devis8.png"} />
                        </div>
                    </div>
                </div>

                <div className="mt-5">

                    <h1 className="text-gray-700">
                        C’est la même procédure que dans le <b>Devis</b>. Consultez  <Link to="/cfp/documentation/doc_devis/ajout" className="text-blue-500 underline">ce Lien</Link>
                    </h1>
                </div>


                <div className="mt-5">

                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>Après avoir créer le nouvelle facture il est enregistrer de cet forme :</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "facture11.png"} />
                        </div>
                    </div>
                </div>

                <div className="mt-5">

                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>Vous pouvez exporter cette facture en PDF en cliquant sur <b>Éditer</b>, puis sur <b>Exporter en PDF</b>. Vous pouvez également l'imprimer.</li>

                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "facture12.png"} />
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}