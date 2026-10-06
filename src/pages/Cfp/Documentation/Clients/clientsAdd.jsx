import { DOC_IMAGE_URL } from "../../../../config/env";
export default function ClientsAdd() {
    return (
        <>
            <div>
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Ajout du nouvelle clients
                        </p>
                    </div>
                </div>

                <div>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour ajouter un nouveau client, en haut de la page, il y a un bouton <b>Nouveau</b> : il suffit de cliquer dessus.</li>
                    </ul>
                </div>
                <div className="border-gray-400 border-2 rounded-md w-[900px]">
                    <div className="p-4">
                        <img src={DOC_IMAGE_URL + "client3.png"} className="w-[900px]" />
                    </div>
                </div>

                <div className="mt-3">
                    <h1 className="text-gray-700">L'ajout d'un nouveau client se fait en trois (3) étapes :</h1>

                    {/* ajout de nom de l'entreprise */}
                    <div className="mt-3">
                        <div>
                            <ul className="text-gray-700 list-disc list-inside">
                                <li>D'abord, ajoutez le nom de l'entreprise.</li>
                            </ul>
                        </div>
                        <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                            <div className="p-4">
                                <img src={DOC_IMAGE_URL + "client4.png"} className="w-[900px]" />
                            </div>
                        </div>
                    </div>

                    {/* ajout email de l'entreprise */}
                    <div className="mt-3">
                        <div>
                            <ul className="text-gray-700 list-disc list-inside">
                                <li>Ensuite, ajoutez l'email de l'entreprise.</li>
                            </ul>
                        </div>
                        <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                            <div className="p-4">
                                <img src={DOC_IMAGE_URL + "client5.png"} className="w-[900px]" />
                            </div>
                        </div>
                    </div>

                    {/* choisir le type de l'entreprise */}
                    <div className="mt-3">
                        <div>
                            <ul className="text-gray-700 list-disc list-inside">
                                <li>Enfin, choisissez le type d'entreprise.</li>
                            </ul>
                        </div>
                        <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                            <div className="p-4">
                                <img src={DOC_IMAGE_URL + "client6.png"} className="w-[900px]" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}