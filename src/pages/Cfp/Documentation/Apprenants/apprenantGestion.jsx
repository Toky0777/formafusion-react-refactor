import { DOC_IMAGE_URL } from "../../../../config/env";
export default function ApprenantsGestion() {
    return (
        <>

            <div>
                <h1 className="text-gray-700">La carte d’un apprenant permet d’afficher rapidement et efficacement toutes les informations essentielles liées à un participant</h1>
                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "apprenant9.png"} className="w-[900px]" />
                    </div>
                </div>
            </div>

            {/* Modification */}
            <div>
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Modification d'une apprenant
                        </p>
                    </div>
                </div>

                <div>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour effectuer une modification, il suffit de cliquer sur l'élément encadré en rouge.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[700px] mt-3">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "apprenant10.png"} className="w-[700px]" />
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Une modale d'information d'apprenant s'affiche.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[700px] mt-3">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "apprenant11.png"} className="w-[700px]" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>On peut même importer une photo, et modifier la ville ou l'entreprise de l'apprenant selon le besoin.</li>
                        </ul>
                        <div className="border-gray-400 border-2 rounded-md w-[700px] mt-3">
                            <div className="p-4 ">
                                <img src={DOC_IMAGE_URL + "apprenant12.png"} className="w-[700px]" />
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* cours suivi par les apprenants */}
            <div>
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            2
                        </div>
                        <p className="text-gray-700 font-medium">
                            Voir les cours que l'apprenant a suivis
                        </p>
                    </div>
                </div>

                <ul className="text-gray-700 list-disc list-inside">
                    <li>Pour voir les cours que l'apprenant a suivis, il suffit de cliquer sur <b>voir les cours</b></li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[700px] mt-3">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "apprenant14.png"} className="w-[700px]" />
                    </div>
                </div>

                <ul className="text-gray-700 list-disc list-inside">
                    <li>On peut également voir les détails d'une formation en cliquant sur l'élément encadré en rouge, ce qui redirige vers le <b>Projet</b> pour consulter les informations.</li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[700px] mt-3">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "apprenant15.png"} className="w-[700px]" />
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            3
                        </div>
                        <p className="text-gray-700 font-medium">
                            Suppression d'une apprenant
                        </p>
                    </div>
                </div>

                <ul className="text-gray-700 list-disc list-inside">
                    <li>Pour supprimer un apprenant, il suffit de cliquer sur l'élément encadré en rouge.</li>
                    <li>Une modale de confirmation s'affiche pour valider ou annuler la suppression.</li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[700px] mt-3">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "apprenant13.png"} className="w-[700px]" />
                    </div>
                </div>
            </div>

        </>
    )
}