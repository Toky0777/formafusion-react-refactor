import { DOC_IMAGE_URL } from "../../../../config/env";
export default function Formateur() {
    return (
        <>

            <div>
                <h1 className="text-gray-700 text-2xl font-semibold">Accès et Présentation de la page</h1>
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
                        <li>Allez dans la menu et cliquer sur la section <b>"Formateur"</b>,</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur1.png"} className="w-96" />
                        </div>
                    </div>

                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Et la page s’affiche immédiatement. </li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[950px]">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur2.png"} className=" w-[950px]" />
                        </div>
                    </div>
                </div>
            </div>

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

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>En haut de la page, à gauche, se trouve une zone de recherche permettant de rechercher des formateurs.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur3.png"} className="w-[900px]" />
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Au milieu, il y a le nombre de formateurs actuellement disponibles ainsi que le nombre d'anciens formateurs.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur4.png"} className="w-[900px]" />
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>À droite, se trouve un bouton permettant d’ajouter un nouveau formateur.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur5.png"} className="w-[900px]" />
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
    )
}