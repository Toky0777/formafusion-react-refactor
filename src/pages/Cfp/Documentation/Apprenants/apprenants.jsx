import { DOC_IMAGE_URL } from "../../../../config/env";
export default function Apprenants() {
    return (
        <>
            <div>

                <div>
                    <h1 className="text-gray-700">Sur cette page, on ajoute les apprenants qui ont participé à une formation.</h1>
                </div>


                {/* accès à la page */}
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

                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Pour accéder à la page, aller dans la menu, et cliquer sur <b>Apprenants</b> </li>
                        </ul>
                        <div className="border-gray-400 border-2 rounded-md w-[500px] mt-3">
                            <div className="p-4 ">
                                <img src={DOC_IMAGE_URL + "apprenant1.png"} className="w-[500px]" />
                            </div>
                        </div>
                        <ul className="text-gray-700 list-disc list-inside mt-3">
                            <li>Et la page s’affiche correctement.</li>
                        </ul>
                        <div className="border-gray-400 border-2 rounded-md w-[700px] mt-3 flex">
                            <div className="p-4 ">
                                <img src={DOC_IMAGE_URL + "apprenant2.png"} className="w-[700px]" />
                            </div>
                            <div className="p-4 ">
                                <img src={DOC_IMAGE_URL + "apprenant2.png"} className="w-[700px]" />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Présentation de la page */}
                <div>
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center gap-4 p-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                                2
                            </div>
                            <p className="text-gray-700 font-medium">
                                Présentation de la page
                            </p>
                        </div>
                    </div>

                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>En haut de la page, on voit à droite un bouton d’ajout permettant d’ajouter un nouvel apprenant.</li>
                        </ul>
                    </div>

                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "apprenant3.png"} className="w-[900px]" />
                        </div>
                    </div>

                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Juste à côté, une zone de recherche permet d’effectuer une recherche rapide.</li>
                        </ul>
                    </div>
                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "apprenant4.png"} className="w-[900px]" />
                        </div>
                    </div>

                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>On peut appliquer un filtre soit par entreprise, par module ou par ville.</li>
                        </ul>
                    </div>
                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "apprenant5.png"} className="w-[900px]" />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}