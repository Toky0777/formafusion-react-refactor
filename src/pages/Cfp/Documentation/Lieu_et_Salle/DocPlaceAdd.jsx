import { DOC_IMAGE_URL } from "../../../../config/env";
export default function DocPlaceAdd() {
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold text-gray-800 ">Comment ajouter un nouveau lieu ?</h1>
            </div>

            <div className="mt-3">
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Ajout un lieu
                        </p>
                    </div>
                </div>
                <ul className="text-gray-700 list-disc list-inside mt-6">
                    <li>Pour ajouter un nouveau lieu, il suffit de cliquer sur <b>Ajouter Lieu</b> en haut à droite.</li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-5">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "place6.png"} />
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <ul className="text-gray-700 list-disc list-inside mt-6">
                    <li>Une fenêtre s’ouvre pour permettre à l’utilisateur d’enregistrer un nouvel emplacement dans le système. Ce formulaire s’adapte selon le type d’utilisateur connecté</li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-5">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "place7.png"}/>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                        2
                    </div>
                    <p className="text-gray-700 font-medium">
                        Type de Statut
                    </p>
                </div>
                <ul className="text-gray-700 list-disc list-inside mt-6">
                    <li>En haut du formulaire, l’utilisateur doit sélectionner son profil parmi : Client , Centre de Formation, Entreprise</li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-5">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "place8.png"} />
                    </div>
                </div>

                <ul className="text-gray-700 list-disc list-inside mt-6">
                    <li>Intitulé : Nom officiel du lieu</li>
                    <li>Province : Sélectionnez la province où se situe le lieu.</li>
                    <li>Quartier : Indiquez le quartier pour une localisation plus détaillée.</li>
                    <li>Pour le côté <b>Entreprise</b>, vous choisissez Entreprise.</li>
                    <li>Cliquer sur <b>Ajouter une lieu</b> pour enregistrer votre information.</li>
                </ul>
            </div>

            <div className="flex items-center gap-4 p-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                    3
                </div>
                <p className="text-gray-700 font-medium">
                    Modification et suppression lieu
                </p>
            </div>

            <div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Pour Modifier une information dans le lieu, il suffit de cliquer sur le <b>"pen"</b></li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-96 mt-2">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "place14.png"}/>
                        </div>
                    </div>
                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                        <li>Et le formulaire de modification s'affiche</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[800px] mt-2">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "place15.png"} />
                        </div>
                    </div>
                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                        <li>Pour supprimer un lieu, il suffit de cliquer sur le <b>trash</b> et une modal de confirmation s'affiche</li>
                    </ul>


                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                        <div className="p-10">
                            <img src={DOC_IMAGE_URL + "place16.png"}/>
                        </div>
                    </div>

                </div>
                
            </div>

        </>
    )
}