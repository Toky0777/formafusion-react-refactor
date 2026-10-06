import { DOC_IMAGE_URL } from "../../../../config/env";

export default function DocProjet() {
    return (
        <>
            <>
                <div className="max-w-4xl mx-auto p-6 ">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Utilisation du Microservice Projet
                    </h2>
                    <p className="text-gray-700 leading-relaxed bg-gray-100 rounded-xl shadow-md p-4">
                        Cette page permet de créer et de gérer des projets de cours, c'est-à-dire les cours à venir, planifiés ou terminés, avec les formateurs, les lieux et les apprenants associés.
                    </p>
                </div>


                {/* accéder à la page */}
                <div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 ">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                                1
                            </div>
                            <p className="text-gray-700 font-medium">
                                Accéder à la Page Projet :
                            </p>
                        </div>

                    </div>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Allez dans la menu et cliquer sur la section <b>"Projet"</b> </li>
                            <li>Dans le projet, il y a plusieurs options : en cours, en préparation, terminé, planifié, clôturé, reporté, annulé et supprimé.</li>
                        </ul>
                        <div className="border-gray-400 border-2 rounded-md w-96">
                            <div className="p-3">
                                <img src={DOC_IMAGE_URL + "projet.png"} />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Présentation de la page */}
                <div>
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
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Sur la page <b>"Projet"</b>, un bouton <b>"Nouveau Projet"</b> est disponible en haut à droite pour ajouter un nouveau projet.</li>
                            <li>À côté, une zone de recherche est également disponible.</li>
                        </ul>
                        <div className="border-gray-400 border-2 rounded-md w-[800px]">
                            <div className="p-3">
                                <img src={DOC_IMAGE_URL + "projet1.png"} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* filtre du projet */}
                <div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4 p-4 ">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                                3
                            </div>
                            <p className="text-gray-700 font-medium">
                                Filtrer les projets :
                            </p>
                        </div>
                    </div>
                    <div className="p-4 space-y-1">
                        <ul className="text-gray-700 list-disc list-inside">
                            <h1>Les projets peuvent être filtrés par :</h1>
                            <li>Entreprise</li>
                            <li>Type de projet</li>
                            <li>Cours</li>
                            <li>Ville</li>
                            <li>Financement</li>
                            <li>Période</li>
                            <li>Formateur</li>
                        </ul>
                        <div className="border-gray-400 border-2 rounded-md w-[800px]">
                            <div className="p-3">
                                <img src={DOC_IMAGE_URL + "projet2.png"} />
                            </div>
                        </div>
                    </div>
                </div>


            </>
        </>
    );
}
