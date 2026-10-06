export default function PhotoGestion() {
    return (
        <>
            <div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Ajout des photos dans la gestion des dossiers
                        </p>
                    </div>
                </div>

                <div>
                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Pour ajouter une photo, cliquez sur le cours que le client a suivi afin d’ajouter sa photo correspondant à cette formation.</li>
                            <li>Et la page s'affiche comme ceci</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "photo5.png"} className="w-[900px]" />
                            </div>

                        </div>

                    </div>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Cliquer sur <b>Ajouter des photos</b> pour ajouter une photo</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "photo6.png"} className="w-[900px]" />
                            </div>

                        </div>

                    </div>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Une fenêtre modale d’importation de photo s’affiche avec un champ pour ajouter une description, puis l’image importée est affichée</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "photo7.png"} className="w-[900px]" />
                            </div>

                        </div>

                    </div>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Puis l’image importée est affichée comme ceci</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-96">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "photo8.png"} />
                            </div>

                        </div>

                    </div>

                </div>
            </div>

            <div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            2
                        </div>
                        <p className="text-gray-700 font-medium">
                            Modification
                        </p>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour faire une modification, cliquer sur l'icone et unechamp de modification s'affiche comme ceci </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "photo9.png"} />
                        </div>

                    </div>

                </div>
            </div>

            <div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            3
                        </div>
                        <p className="text-gray-700 font-medium">
                            Téléchargement
                        </p>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour effectuer un téléchargement, cliquez sur l’icône de téléchargement et l’image se téléchargera automatiquement. </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "photo10.png"} />
                        </div>

                    </div>

                </div>
            </div>

            <div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            4
                        </div>
                        <p className="text-gray-700 font-medium">
                           Suppression
                        </p>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour effectuer une suppression, cliquez sur l’icône de suppression et l’image sera supprimée. </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "photo11.png"} />
                        </div>

                    </div>

                </div>
            </div>

        </>
    )
}