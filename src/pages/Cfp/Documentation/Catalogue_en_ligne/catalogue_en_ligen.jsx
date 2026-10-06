import { DOC_IMAGE_URL } from "../../../../config/env";
export default function CatalogueEnLigne() {
    return (
        <>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 ">
                    Utilisation du Microservice Catalogue En Ligne
                </h2>
            </div>

            <div className="mt-6">
                <h1 className="text-gray-700">
                    Le <b>Catalogue en ligne</b> vous permet d’accéder rapidement à l’ensemble des cours disponibles au sein de la formation.
                </h1>
            </div>

            {/* Étape 1 */}
            <div className="mt-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Accéder à la Page de Catalogue en Ligne :
                        </p>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Allez dans le menu et cliquez sur la section <b>"Catalogue en Ligne"</b> </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-full sm:w-80 md:w-96 lg:w-[450px] xl:w-[600px] mx-auto">
                        <div className="p-4">
                            <img
                                className="w-full h-auto object-contain"
                                src={DOC_IMAGE_URL + "catalogueligne1.png"}
                                alt="Catalogue en ligne 1"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>La page Catalogue en ligne s'affiche tout de suite</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-full sm:w-[500px] md:w-[700px] lg:w-[900px] xl:w-[1000px] mx-auto">
                        <div className="p-4">
                            <img
                                className="w-full h-auto object-contain"
                                src={DOC_IMAGE_URL + "catalogueligne2.png"}
                                alt="Catalogue en ligne 2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Étape 2 */}
            <div className="mt-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4">
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
                        <li>
                            Grâce à la barre de recherche intégrée, vous pouvez facilement trouver un cours spécifique en saisissant un mot-clé, un titre ou un thème.
                        </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-full sm:w-[500px] md:w-[700px] lg:w-[900px] xl:w-[1000px] mx-auto">
                        <div className="p-4">
                            <img
                                className="w-full h-auto object-contain"
                                src={DOC_IMAGE_URL + "catalogueligne3.png"}
                                alt="Catalogue en ligne 3"
                            />
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}