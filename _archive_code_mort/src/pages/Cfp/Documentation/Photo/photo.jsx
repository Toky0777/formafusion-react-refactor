export default function PhotoDocumentation() {
    return (
        <>
            <div>
                <h2 className="text-gray-700">
                    Dans ce microservice, le <b>« Photo »</b> permet de gérer les photos associées aux dossiers clients durant la formation.
                </h2>
                <h2 className="text-gray-700">
                    Dans ce microservice, chaque client peut avoir son propre dossier de photos.
                </h2>

            </div>

            <div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Accéder à la page de <b>Photo</b>
                        </p>
                    </div>

                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour accéder à la page, allez dans le menu et cliquez sur <b>Photos</b>.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "photo1.png"} />
                        </div>

                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Et la page s’affiche ainsi.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "photo2.png"} />
                        </div>

                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>En haut de la page, il est possible de rechercher un client par son nom et de filtrer les résultats par année.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "photo3.png"} className="w-[900px]" />
                        </div>

                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>En haut de la page, il est possible de rechercher un client par son nom et de filtrer les résultats par année.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "photo3.png"} className="w-[900px]" />
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
                            Présentation de la page de <b>Photo</b>
                        </p>
                    </div>

                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Dans le dossier de chaque client, il suffit de cliquer dessus pour afficher toutes les formations que le client a déjà suivies.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "photo4.png"} />
                        </div>

                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto mt-8 bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-md">
                <p className="text-gray-700 text-base sm:text-lg font-semibold mb-4">
                    <span className="text-red-500">Remarque :</span> Ce sont des exemples de noms de clients.
                </p>
            </div>
        </>
    )
}