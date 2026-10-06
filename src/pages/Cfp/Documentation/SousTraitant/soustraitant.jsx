import { DOC_IMAGE_URL } from "../../../../config/env";
export default function SousTraitant() {
    return (
        <>
            <div>
                <div>
                    <h1 className="text-gray-700">Sur cette page, par exemple, si un centre de formation n’est pas disponible mais qu’il a des clients en cours de formation et qu’il confie ces clients à un autre centre de formation, alors ce dernier est appelé un sous-traitant.</h1>
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
                            <li>Pour accéder à la page, aller dans la menu, et cliquer sur <b>Sous-traitants</b> </li>
                        </ul>
                        <div className="border-gray-400 border-2 rounded-md w-[500px] mt-3">
                            <div className="p-4 ">
                                <img src={DOC_IMAGE_URL + "soustraitan1.png"} className="w-[500px]" />
                            </div>
                        </div>
                        <ul className="text-gray-700 list-disc list-inside mt-3">
                            <li>Et la page s’affiche correctement.</li>
                        </ul>
                        <div className="border-gray-400 border-2 rounded-md w-[700px] mt-3 ">
                            <div className="p-4 ">
                                <img src={DOC_IMAGE_URL + "soustraitan2.png"} className="w-[700px]" />
                            </div>
                       
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}