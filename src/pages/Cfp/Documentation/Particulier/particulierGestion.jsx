import { DOC_IMAGE_URL } from "../../../../config/env";
export default function ParticulierGestion() {
    return (
        <>
            <div>
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Modification du particulier
                        </p>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour modifier un particulier, il suffit de cliquer sur l’icône encadrée en rouge, et une fenêtre de modification (modal) s’affichera. </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[500px]">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "particulier5.png"} className="w-[500px]" />
                        </div>

                    </div>
                </div>


                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            2
                        </div>
                        <p className="text-gray-700 font-medium">
                            Suppression du Particulier
                        </p>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour supprimer un particulier, il suffit de cliqué sur l'icone encadré en rouge et une modal de confirmation s'affiche </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[500px]">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "particulier6.png"} className="w-[500px]" />
                        </div>

                    </div>
                </div>


                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            3
                        </div>
                        <p className="text-gray-700 font-medium">
                           Projet du Particulier
                        </p>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour voir les projets du particulier, il suffit de cliquer sur <b>Voir les projets</b>, et les projets réalisés par le participant s’afficheront. </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[500px]">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "particulier7.png"} className="w-[500px]" />
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}