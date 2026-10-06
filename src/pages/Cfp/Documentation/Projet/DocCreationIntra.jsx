import { DOC_IMAGE_URL } from "../../../../config/env";

export default function DocCreationIntra() {
    return (
        <>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 ">
                    Creation de Nouveau Projet Intra
                </h2>
            </div>

            <div className="mt-7">
                <p className="text-gray-700 bg-gray-200 p-4 rounded-sm">Le Projet Intra concerne uniquement une entreprise qui met en place la formation. </p>
                <p className="text-gray-700 mt-3">La création de projet fait en 6 étapes : </p>
            </div>

            <div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Définir les informations de base
                        </p>
                    </div>

                </div>
  
                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Donner un titre de projet → obligatoire.</li>
                        <li>Ajouter une description → facultative</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[800px]">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "projet3.png"} />
                        </div>

                    </div>
                </div>
            </div>

            <div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            2
                        </div>
                        <p className="text-gray-700 font-medium">
                            Sélectionner l’entreprise
                        </p>
                    </div>

                </div>
                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Choisir l’entreprise qui va réaliser la formation (Le Projet Intra concerne une seule entreprise formatrice)</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[800px]">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "projet4.png"} />
                        </div>

                    </div>
                </div>
            </div>

            <div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            3
                        </div>
                        <p className="text-gray-700 font-medium">
                            Gérer le bon de commande
                        </p>
                    </div>

                </div>
                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Si l’entreprise dispose déjà d’un bon de commande, sélectionner simplement le numéro du bon de commande dans la liste.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[800px]">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "projet5.png"} />
                        </div>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Si l’entreprise n’a pas encore de bon de commande, remplir le formulaire de création de bon de commande avant de continuer.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[800px]">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "projet6.png"} />
                        </div>
                    </div>
                    <div className="border-gray-400 border-2 rounded-md w-[800px]">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "projet7.png"} />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            4
                        </div>
                        <p className="text-gray-700 font-medium">
                            Choisir le cours apprendre
                        </p>
                    </div>

                </div>
                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Choisir le cours apprendre durant la formation</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[800px]">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "projet8.png"} />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            5
                        </div>
                        <p className="text-gray-700 font-medium">
                            Ajouter le dossier du projet
                        </p>
                    </div>

                </div>
                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Joindre un dossier au projet</li>
                        <li>À l’intérieur du dossier, il peut y avoir plusieurs documents.</li>
                        <li>Les documents importants peuvent être par exemple :La fiche de présence (PDF),Les supports de cours,Tout autre document utile au bon déroulement de la formation.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[800px]">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "projet9.png"} />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            6
                        </div>
                        <p className="text-gray-700 font-medium">
                            Définir la date et la modalité de formation
                        </p>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Choisir une modalité de formation, c’est-à-dire : présentielle, en ligne ou mixte (blended learning).</li>
                        <li>Sélectionner la date de début et, si nécessaire, la date de fin de la formation.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[800px]">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "projet10.png"} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 bg-gray-200 p-3 rounded-md w-auto">
                <span className="text-red-500">NB : </span>
                <h1 className="text-gray-700">Tous les Projet ajouté seront visibles dans <b>En préparation</b>.</h1>
            </div>

        </>
    )
}