import { DOC_IMAGE_URL } from "../../../../config/env";

export default function DocCatalogue() {
    return (

        <>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 ">
                    Ulitisation du Microservice Catalogue Interne
                </h2>
            </div>

            <div className="mt-6">
                <p className="text-gray-700"> Le <b>Catalogue Interne</b> permet de créer et configurer les cours que l’on souhaite enseigner aux clients.</p>
            </div>

            {/* accéder à la page */}
            <div className="mt-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Accéder à la Page de Catalogue Interne :
                        </p>
                    </div>

                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Allez dans la menu et cliquer sur la section <b>"Catalogue Interne"</b> </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "catalogueInterne.png"} />
                        </div>

                    </div>
                </div>


                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>La page Catalogue Interne s'affiche tout de suite </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-full">
                        <div className="p-4">
                          <img src={DOC_IMAGE_URL + "pagecatalogueinterne.png"} />
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
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Sur la page <b>"Catalogue Interne"</b>, on peut voir le nombre de cours disponibles, en préparation, ainsi que ceux placés dans la corbeille.</li>
                        <li>Un bouton <b>"Ajouter un cours"</b> est également disponible en haut à droite pour créer un nouveau cours.</li>
                        <li>Juste à côté, une barre de recherche permet d’effectuer une recherche parmi les cours existants.</li>

                    </ul>
                </div>

                <div className="border-gray-400 border-2 rounded-md w-full">
                    <div className="p-4">
                        <img src={DOC_IMAGE_URL + "entetecatalogue.png"}/>
                    </div>

                </div>
            </div>

        </>
    );
}