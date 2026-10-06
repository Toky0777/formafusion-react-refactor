import { DOC_IMAGE_URL } from "../../../../config/env";
export default function Clients() {
    return (
        <>
            <div>
                <h1 className="text-gray-700">Sur cette page, on ajoute les entreprises ou centre de formation ou Groupe que leur employé font des formations chez nous </h1>
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
                        <li>Allez dans la menu et cliquer sur la section <b>"Clients"</b> </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "client1.png"} className="w-96" />
                        </div>

                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Et la page s'affiche correctement </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px] flex gap-2 ">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "client2.png"} className="w-[800px]" />
                        </div>
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "client2.png"} className="w-[800px]" />
                        </div>

                    </div>
                </div></div>

        </>

    )
}