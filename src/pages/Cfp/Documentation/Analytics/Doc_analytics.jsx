import { DOC_IMAGE_URL } from "../../../../config/env";
export default function DocAnalytics() {
    return (
        <>
            <div>
                <h1 className="text-gray-700">
                    La page <b>Analytics</b> sert d’espace de suivi et d’analyse des données liées à votre activité sur la plateforme.
                </h1>
            </div>

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
                    <li>Allez dans la menu et cliquer sur la section <b>"Analytics"</b>,</li>
                </ul>

                <div className="border-gray-400 border-2 rounded-md w-96">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "analytics1.png"} className="w-96" />
                    </div>
                </div>

                <ul className="text-gray-700 list-disc list-inside">
                    <li>Et la page s’affiche immédiatement. </li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[950px]">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "analytics2.png"} className=" w-[950px]" />
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto mt-8 bg-gray-50 p-4 sm:p-6 rounded-2xl shadow-md">
                <p className="text-gray-600 text-sm sm:text-base font-medium mb-2">
                    <span className="text-red-500 font-semibold">Remarque :</span> Les chiffres indiqués ici sont à titre d’exemple et ne reflètent pas les prix réels.
                </p>
            </div>

        </>
    );
}