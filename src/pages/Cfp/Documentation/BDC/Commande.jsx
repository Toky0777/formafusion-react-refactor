import { DOC_IMAGE_URL } from "../../../../config/env";
export default function Doc_Commande() {
    return (
        <>
            <div>
                <h1 className="text-gray-700 text-2xl font-semibold">Accès et Présentation de la page</h1>
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
                    <li>Allez dans la menu et cliquer sur la section <b>"Vos bon de commande"</b>,</li>
                </ul>

                <div className="border-gray-400 border-2 rounded-md w-96">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "commande1.png"} className="w-96" />
                    </div>
                </div>

                <ul className="text-gray-700 list-disc list-inside">
                    <li>Et la page s’affiche immédiatement. </li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[950px]">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "commande2.png"} className=" w-[950px]" />
                    </div>
                </div>
            </div>
        </>
    )
}