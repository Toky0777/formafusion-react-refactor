import { DOC_IMAGE_URL } from "../../../../config/env";
export default function FormateurAdd() {
    return (
        <>
            <div>
                <h1 className="text-gray-700 text-2xl font-semibold">Ajout nouveau Formateur</h1>
            </div>

            <div>
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Ajout Nouveau Formateur
                        </p>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour ajouter une nouveau formateur, cliqué sur <b>Ajouter Nouveau Formateur</b> </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur5.png"} className="w-[900px]" />
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Le formulaire d’ajout s’affiche correctement.</li>
                        <li>Remplissez ensuite le formulaire, puis enregistrez les informations ajoutées.</li>
                    </ul>


                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "formateur6.png"} className="w-[900px]" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}