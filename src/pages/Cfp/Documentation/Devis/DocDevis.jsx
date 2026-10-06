import { DOC_IMAGE_URL } from "../../../../config/env";

export default function DocDevis() {
    return (
        <>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 ">
                    Le devis permet de demander le prix d’une formation proposée.
                </h2>
            </div>


            {/* accéder à la page */}
            <div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Accéder à la Page de Devis :
                        </p>
                    </div>

                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Allez dans la menu et cliquer sur la section <b>"Devis"</b> </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "devis1.png"} />
                        </div>
                    </div>
                </div>


                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>La page Devis s'affiche tout de suite </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md  w-[900px]">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "devis2.png"} className="w-[900px]" />
                        </div>

                    </div>
                </div>

            </div>

            {/* Présentation de la page */}
            <div className="mt-3">

                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            2
                        </div>
                        <p className="text-gray-700 font-medium">
                            Présentation de la page :
                        </p>
                    </div>

                </div>

                <div className="p-4 space-y-4">
                    <h1 className="text-gray-700">Sur la partie gauche, plusieurs champs permettent d’affiner la recherche :</h1>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Entreprise : sélection de l’entreprise concernée par le proforma.</li>
                        <li>Statut : filtrage selon l’état du proforma (brouillon, converti, etc.).</li>
                        <li>Numéro : recherche d’un proforma spécifique à l’aide de son numéro.</li>
                        <li>Période (Début / Fin) : permet de filtrer les proformas par date de création.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[800px]">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "devis4.png"} />
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <h1 className="text-gray-700">Au centre, trois boutons permettent de basculer entre différents affichages :</h1>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Tous les proformas : affiche l’ensemble des proformas disponibles.</li>
                        <li>Brouillons : affiche uniquement les proformas en cours de préparation.</li>
                        <li>Convertis : affiche les proformas déjà convertis (en facture ou autre document).</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[800px]">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "devis5.png"} />
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <h1 className="text-gray-700">Sur la partie droite :</h1>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>+ Nouveau : permet de créer un nouveau proforma.</li>
                        <li>Filtrer : applique les filtres choisis.</li>
                        <li>Réinitialiser : réinitialise les champs de filtrage pour afficher tous les résultats.</li>
                        <li>Page (10 ▼) : définit le nombre de proformas affichés par page.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[800px]">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "devis6.png"} />
                        </div>
                    </div>
                </div>

            </div>

            <div className="max-w-3xl mx-auto mt-8 bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-md ">
                <p className="text-gray-700 text-base sm:text-lg font-semibold mb-4">
                    <span className="text-red-500 ">Remarque :</span>  Tous les prix et données chiffrées dans cette documentation sont fictifs et utilisés uniquement à titre d’exemple.
                </p>
            </div>
        </>
    );
}
