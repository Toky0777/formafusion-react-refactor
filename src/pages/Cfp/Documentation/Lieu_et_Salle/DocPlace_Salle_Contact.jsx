import { DOC_IMAGE_URL } from "../../../../config/env";
export default function DocPlace_Salle_Contact() {
    return (
        <>
            <div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 ">Gestion des salle et des Contact</h1>
                </div>

                <div className="mt-7">
                    <h1 className="text-gray-800">Après avoir ajouté un lieu, il s’affiche ainsi :</h1>
                    <div className="border-gray-400 border-2 rounded-md w-96 mt-5">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "place9.png"} />
                        </div>
                    </div>
                </div>

                <div className="mt-4 ">

                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center gap-4 p-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                                1
                            </div>
                            <p className="text-gray-700 font-medium">
                                Ajout Salle
                            </p>
                        </div>
                    </div>

                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Pour ajouter une nouvelle salle, il suffit de cliquer sur le <b>"+"</b> et un formulaire apparaît pour saisir le nom de la salle.</li>
                        <li>Pour enregistrer votre ajout, cliquez sur le <b>"+"</b> orange.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96 mt-2">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "place10.png"} />
                        </div>
                    </div>
                </div>

                <div className="mt-4 ">

                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center gap-4 p-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                                2
                            </div>
                            <p className="text-gray-700 font-medium">
                                Ajout Contact
                            </p>
                        </div>
                    </div>

                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Pour ajouter une nouvelle contact, il suffit de cliquer sur le <b>"+"</b> et un formulaire apparaît .</li>
                        <li>Pour enregistrer votre contact, cliquez sur le <b>"Ajouter"</b> </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96 mt-2">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "place11.png"} />
                        </div>
                    </div>
                </div>

                <div className="mt-4 ">

                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center gap-4 p-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                                3
                            </div>
                            <p className="text-gray-700 font-medium">
                                Modification et Suppression Salle et contact
                            </p>
                        </div>
                    </div>

                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Pour modifier le salle ou le contact il suffit de cliquer sur le icone en bleu</li>
                        <li>Pour supprimer le salle ou le contact il suffit de cliquer sur le icone en rouge</li>
                    </ul>

                    <div className="flex gap-6">
                        <div className="border-gray-400 border-2 rounded-md w-96 mt-2">
                            <div className="p-3">
                                <img src={DOC_IMAGE_URL + "place12.png"} />
                            </div>
                        </div>
                        <div className="border-gray-400 border-2 rounded-md w-96 mt-2">
                            <div className="p-3">
                                <img src={DOC_IMAGE_URL + "place13.png"} />
                            </div>
                        </div>
                    </div>


                    <div className="mt-6">
                        <p className="text-gray-700 p-3 bg-gray-100 rounded-lg">
                            <span className="text-red-500">NB :</span> Vous ne pouvez pas supprimer un lieu directement.
                            Il est nécessaire de supprimer d’abord les salles avant de pouvoir supprimer le lieu.
                        </p>
                    </div>

                </div>
            </div>
        </>
    )
}