export default function Materiel() {
    return (
        <>
            <div>
                <div>
                    <h1 className="text-gray-700 ">La gestion des matériels permet d’organiser, suivre et contrôler l’ensemble des équipements utilisés au sein d’une structure. </h1>
                </div>

                <div>
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center gap-4 p-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                                1
                            </div>
                            <p className="text-gray-700 font-medium">
                                Accès à la page
                            </p>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Allez dans la menu et cliquer sur la section <b>"Gestion des Matériels"</b>,</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-96">
                            <div className="p-4 ">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "materiel1.png"} className="w-96" />
                            </div>
                        </div>

                    </div>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Et la page s'affiche correctement</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4 ">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "materiel2.png"} className="w-[900px]" />
                            </div>
                        </div>

                    </div>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>En haut de la page, il y a une zone de recherche permettant d’effectuer une recherche de matériels.</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4 ">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "materiel10.png"} className="w-[900px]" />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}