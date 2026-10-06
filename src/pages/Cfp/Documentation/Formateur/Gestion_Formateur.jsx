import { DOC_IMAGE_URL } from "../../../../config/env";
export default function Gestion_Formateur() {
    return (
        <>
            <div>
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Voir le détail d'un formateur
                        </p>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour voir les détails d’un formateur, cliquez sur « Voir le CV » afin d’obtenir plus d’informations.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[700px]">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur7.png"} className="w-[700px]" />
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Les informations du formateur sélectionné s’affichent correctement.</li>
                    </ul>


                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur8.png"} className="w-[900px]" />
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
                            Voir les cours déjà terminés, clôturés ou supprimés.
                        </p>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour voir les cours déjà terminés, clôturés ou supprimés, cliqué sur <b>Voir les cours</b></li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[700px]">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur9.png"} className="w-[700px]" />
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Et tous les cours s’affichen</li>
                    </ul>


                    <div className="border-gray-400 border-2 rounded-md w-[900px] flex">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur10.png"} className="w-[900px]" />
                        </div>
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur11.png"} className="w-[900px]" />
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour les détails d'une cours, cliquer sur l'icone en rouge qui est dans l'action:</li>
                    </ul>


                    <div className="border-gray-400 border-2 rounded-md w-[900px] flex">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur12.png"} className="w-[900px]" />
                        </div>
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
                            Modification d'un formateur
                        </p>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour modifier un formateur, cliquez sur l’icône encadrée en rouge.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[700px]">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur13.png"} className="w-[700px]" />
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Une modale de modification s’affiche.</li>
                        <li>Il est également possible de modifier l’image.</li>

                    </ul>


                    <div className="border-gray-400 border-2 rounded-md w-[700px] flex">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur14.png"} className="w-[700px]" />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            4
                        </div>
                        <p className="text-gray-700 font-medium">
                            Suppression d'un formateur
                        </p>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour supprimer une formateur, cliqué sur l'icone encadré en rouge</li>
                        <li>et une modal de confirmation s'affiche</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur15.png"} className="w-[900px]" />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            5
                        </div>
                        <p className="text-gray-700 font-medium">
                            Formateur Actuel et Ancien
                        </p>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour mettre un formateur en ancien, il suffit de désactiver le bouton ; le formateur sera alors déplacé dans la liste des anciens formateurs.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[700px]">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur16.png"} className="w-[700px]" />
                        </div>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>De même, pour un ancien formateur, si l’on souhaite le réactiver et le remettre parmi les formateurs actuels, il suffit d’activer le bouton correspondant.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[700px]">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur17.png"} className="w-[700px]" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}