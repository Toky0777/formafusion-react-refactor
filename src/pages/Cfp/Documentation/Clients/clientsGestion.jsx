import { DOC_IMAGE_URL } from "../../../../config/env";
export default function ClientsGestion() {
    return (
        <>
            <div>

                {/* voir le détail d'une client */}
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Voir le détail d'une client
                        </p>
                    </div>
                </div>

                <div className="mt-3">

                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Pour voir le détail d'une client, il faut cliquer sur l'icone qui est encadré en rouge</li>
                        </ul>
                    </div>
                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "client7.png"} className="w-[900px]" />
                        </div>
                    </div>
                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Et les détails d’un client s’affichent, ainsi que ses factures, ses devis et ses bons de commande.</li>
                        </ul>
                    </div>

                    <div className="border-gray-400 border-2 rounded-md w-[920px] mt-3 flex">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "client8.png"} className="w-[920px]" />
                        </div>
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "client9.png"} className="w-[920px]" />
                        </div>
                    </div>

                </div>

                {/* modification d'une client */}
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            2
                        </div>
                        <p className="text-gray-700 font-medium">
                            Modification d'une client
                        </p>
                    </div>
                </div>

                <div className="mt-3">

                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Pour modifier un client, il suffit de cliquer sur l’icône encadrée en rouge, et une fenêtre de modification  s’affichera</li>
                        </ul>
                    </div>
                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "client10.png"} className="w-[900px]" />
                        </div>
                    </div>
                </div>

                {/* suppression d'une client */}

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            3
                        </div>
                        <p className="text-gray-700 font-medium">
                            Supprimer d'une client
                        </p>
                    </div>
                </div>
                <div className="mt-3">

                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Pour supprimer un client, il suffit de cliquer sur l’icône en rouge, et une fenêtre de confirmation (modal) s’affichera.</li>
                        </ul>
                    </div>
                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "client11.png"} className="w-[900px]" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}