import { DOC_IMAGE_URL } from "../../../../config/env";
export default function DocAnalyticsObjectif() {
    return (
        <>
            {/* objectif */}
            <div>
                <div className="flex items-center gap-4 p-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                        1
                    </div>
                    <p className="text-gray-700 font-medium">
                        Objectif
                    </p>
                </div>
                <div>
                    <h1 className="text-gray-700">Dans cette section, on peut voir tous les suivis des résultats</h1>
                </div>
                <div className="border-gray-400 border-2 rounded-md w-[900px]">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "analytics9.png"} className="w-[900px]" />
                    </div>
                </div>
            </div>

            {/* formateur */}
            <div>
                <div className="flex items-center gap-4 p-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                        2
                    </div>
                    <p className="text-gray-700 font-medium">
                        Formateur
                    </p>
                </div>

                <div className="mt-2">
                    <h1 className="text-gray-700">Dans cette section, on peut voir les statistiques et données concernant les formateurs</h1>
                    <div className="border-gray-400 border-2 rounded-md w-[950px] mt-2">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "analytics10.png"} className="w-[950px]" />
                        </div>
                    </div>
                </div>

                <div className="mt-2">
                    <h1 className="text-gray-700">
                        Pour consulter les statistiques de chaque formateur, il suffit de cliquer sur le formateur souhaité. Ses statistiques s’affichent ensuite juste à côté.
                    </h1>
                    <div className="border-gray-400 border-2 rounded-md w-[950px] mt-2">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "analytics11.png"} className="w-[950px]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* remarque */}
            <div className="max-w-3xl mx-auto mt-8 bg-gray-50 p-4 sm:p-6 rounded-2xl shadow-md">
                <p className="text-gray-600 text-sm sm:text-base font-medium mb-2">
                    <span className="text-red-500 font-semibold">Remarque :</span> Les chiffres indiqués ici sont à titre d’exemple et ne reflètent pas les prix réels.
                </p>
            </div>
            
        </>
    )
}