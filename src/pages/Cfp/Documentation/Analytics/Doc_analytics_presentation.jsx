import { DOC_IMAGE_URL } from "../../../../config/env";
export default function DocAnalyticsPresentation() {
    return (
        <>
            <div>
                <h1 className="text-gray-700 text-2xl font-bold">
                    Présentation de la page d'analytics ou Tableau de bord
                </h1>
            </div>
            <div className="mt-3">
                <h1 className="text-gray-700 ">
                    Elle permet d’accéder facilement aux principaux indicateurs grâce à différents onglets :
                </h1>
            </div>

            <div className="mt-2">

                <ul className="text-gray-700 list-disc list-inside">
                    <li> <b>Tableau de bord</b> : vue générale regroupant les informations les plus importantes</li>
                    <li> <b>Objectifs</b> : suivi des résultats, performances et indicateurs clés </li>
                    <li> <b>Formateurs</b> : statistiques et données concernant les formateurs </li>
                    <li> En haut à droite, un sélecteur d’année (ici : 2025) permet de filtrer les données affichées en fonction de l’année souhaitée, offrant une meilleure vision de l’évolution et des tendances. </li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[900px]">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "analytics3.png"} className="w-[900px]" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 p-4 ">
                <div className="flex items-center gap-4 p-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                        1
                    </div>
                    <p className="text-gray-700 font-medium">
                        Le tableau de Bord
                    </p>
                </div>
            </div>

            <div className="border-gray-400 border-2 rounded-md w-[900px]">
                <div className="p-4 ">
                    <img src={DOC_IMAGE_URL + "analytics4.png"} className="w-[900px]" />
                </div>
            </div>

            <div className="mt-2">
                <ul className="text-gray-700 list-disc list-inside">
                    <li> Cette section regroupe l’ensemble des indicateurs essentiels permettant d’évaluer l’activité globale du centre de formation. Chaque carte met en avant les performances actuelles, ainsi qu’une comparaison avec la période précédente (mois ou année).</li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[900px]">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "analytics2.png"} className="w-[900px]" />
                    </div>
                </div>
            </div>

            <div className="mt-2">
                <h1 className="text-gray-700">Ce graphique illustre l’évolution du chiffre d’affaires mensuel pour l’année 2025, en comparaison avec :</h1>
                <ul className="text-gray-700 list-disc list-inside">
                    <li> Le chiffre d’affaires prévisionnel (ligne bleue)</li>
                    <li> Le chiffre d’affaires réel (ligne verte)</li>
                    <li> L’objectif annuel à atteindre (ligne violette constante)</li>
                    <li> Chaque point du graphique représente le montant enregistré pour le mois correspondant</li>
                </ul>

                <div className="border-gray-400 border-2 rounded-md w-[900px]">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "analytics6.png"} className="w-[900px]" />
                    </div>
                </div>
            </div>

            <div className="mt-2">
                <h1 className="text-gray-700">Ce graphique permet de visualiser la répartition du montant total des bons de commande :</h1>

                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "analytics7.png"} className="w-[900px]" />
                    </div>
                </div>
            </div>

            <div className="mt-2">
                <h1 className="text-gray-700">Ce graphique illustre :</h1>
                <ul className="text-gray-700 list-disc list-inside">
                    <li> Le modalité de paiement</li>
                    <li> Pesonnes Formées</li>
                    <li> Moyenne d'appréciation des formations</li>
                </ul>

                <div className="border-gray-400 border-2 rounded-md w-[900px]">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "analytics8.png"} className="w-[900px]" />
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto mt-8 bg-gray-50 p-4 sm:p-6 rounded-2xl shadow-md">
                <p className="text-gray-600 text-sm sm:text-base font-medium mb-2">
                    <span className="text-red-500 font-semibold">Remarque :</span> Les chiffres indiqués ici sont à titre d’exemple et ne reflètent pas les prix réels.
                </p>
            </div>

        </>
    )
}