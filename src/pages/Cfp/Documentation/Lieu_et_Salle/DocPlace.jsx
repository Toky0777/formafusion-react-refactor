import { DOC_IMAGE_URL } from "../../../../config/env";
export default function DocPlace() {
    return (
        <>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 ">
                    Accès et Présentation du Lieu et Salle
                </h2>
            </div>

            <div className="mt-4 ">

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Accès
                        </p>
                    </div>
                </div>

                <div>
                    <p className="text-gray-700">La section <b>Lieu & Salle</b> vous permet de gérer efficacement les espaces utilisés lors des formations.</p>
                </div>

                <ul className="text-gray-700 list-disc list-inside mt-2">
                    <li>Pour accéder au lieu de formation, allez dans le menu et cliquez sur la section <b>« Lieu & Salle »</b>.</li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[300px] mt-5">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "place1.png"} />
                    </div>
                </div>

                <ul className="text-gray-700 list-disc list-inside mt-6">
                    <li>La page « Lieu & Salle » s’affiche alors.</li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[800px] mt-5">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "place2.png"} />
                    </div>
                </div>

            </div>

            <div className="mt-4 ">

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            2
                        </div>
                        <p className="text-gray-700 font-medium">
                            Présentation
                        </p>
                    </div>
                </div>
                <div>
                    <p className="text-gray-700">Elle offre une interface simple et intuitive pour rechercher, filtrer et ajouter de nouveaux lieux selon vos besoins : </p>
                </div>

                <div>
                    <ul className="text-gray-700 list-disc list-inside mt-2">
                        <li>Barre de recherche</li>
                    </ul>
                    <p className="text-gray-700">En haut de la page, une barre de recherche vous permet de trouver rapidement un lieu ou une salle en saisissant son nom.</p>
                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-5">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "place4.png"} />
                        </div>
                    </div>

                </div>

                <div className="mt-6">
                    <p className="text-gray-700">Filtres disponibles : </p>
                    <ul className="text-gray-700 list-disc list-inside mt-6">
                        <li><b>Public :</b> afficher uniquement les lieux publics.</li>
                        <li> <b>Privée :</b> afficher les lieux privés.</li>
                        <li> <b>Location : </b>filtrer les espaces disponibles à la location.</li>
                        <li> <b>Filtrer par code postal :</b> restreindre les résultats à une zone précise.</li>
                        <li> <b>Filtrer par région : </b>choisir parmi toutes les régions disponibles.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[800px] mt-5">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "place5.png"} />
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}