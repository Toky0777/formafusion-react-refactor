import { DOC_IMAGE_URL } from "../../../../config/env";

export default function DocCatalogueDetail() {
    return (

        <>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 ">
                    Détails et Gestion des Contenus – Gérer et Modifier
                </h2>
            </div>

            {/* Détail d'un cours */}
            <div>
                <div className="space-y-1">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Détail d'un cours :
                        </p>
                    </div>

                </div>
                <div className="p-4 space-y-1">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Pour voir le détail d’un cours, cliquez sur le bouton <b>Voir les détails</b> situé en bas à droite de la carte du cours.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "détailcataloguevoir.png"} />
                        </div>

                    </div>
                </div>

                <div className="p-4 space-y-1">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>La page de détail s’affiche immédiatement.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md ">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "pagedetail.png"} />
                        </div>

                    </div>
                </div>
            </div>

            {/* Ajout et Gestion du Contenu Pédagogique */}
            <div>
                <div className="space-y-1">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            2
                        </div>
                        <p className="text-gray-700 font-medium">
                            Ajout et Gestion du Contenu Pédagogique :
                        </p>

                    </div>
                    <p className="text-gray-700 bg-gray-100 p-2 rounded-lg ">
                        Dans cette partie, vous pouvez définir les <b>objectifs</b> du cours, préciser les <b>prérequis</b>, lister les <b>matériels nécessaires</b> et identifier les <b>personnes concernées</b>.
                        Vous pouvez également compléter le <b>programme pédagogique</b> en y détaillant les activités prévues durant la formation.
                    </p>

                </div>
                <div className="p-4 space-y-1">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Dans les sections <b>Objectif</b>, <b>Prérequis</b>, <b>Matériels</b> et <b>Cible</b>, pour ajouter une nouvelle information, cliquez sur l’<b>icône “plus”</b>, puis sur <b>Enregistrer</b> afin de sauvegarder votre ajout.</li>
                        <div className="border-gray-400 border-2 rounded-md ">
                            <div className="p-3">
                                <img src={DOC_IMAGE_URL + "ajoutobjectifprerequis.png"} />
                            </div>

                        </div>

                    </ul>
                </div>

                <div className="p-4 space-y-1">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Dans la section <b>Programme Pédagogique</b>, il faut d’abord ajouter un <b>titre</b>. </li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md ">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "ajourprogramme.png"} />
                        </div>

                    </div>
                </div>
                <div className="p-4 space-y-1">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li> Une fois le titre ajouté, vous pouvez ensuite y ajouter les <b>contenus</b> correspondants.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md ">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "ajoutprogrammecontenu.png"} />
                        </div>

                    </div>
                </div>
                <p className="text-gray-700 p-3 bg-gray-100 rounded-lg">
                    <span className="text-red-500">NB :</span> Vous ne pouvez pas supprimer un programme directement.
                    Il est nécessaire de supprimer d’abord ses contenus avant de pouvoir supprimer le programme.
                </p>
            </div>


            {/* Modification d'un cours */}
            <div>
                <div className="space-y-1">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            3
                        </div>
                        <p className="text-gray-700 font-medium">
                            Modification d'un cours :
                        </p>
                    </div>

                </div>

                <div className="p-4 space-y-1">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Pour modifier les informations de base, il suffit de cliquer sur <b>"Modifier les informations de base"</b> </li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md ">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "cataloguemformationdebase.png"} />
                        </div>

                    </div>
                </div>
                <div className="p-4 space-y-1">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li> une fenêtre modale de modification s’affichera.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md ">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "modalmodificationcatalogue.png"} />
                        </div>

                    </div>
                </div>
                <div className="p-4 space-y-1">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Pour modifier les sections <b>Objectif</b>, <b>Prérequis</b>, <b>Matériels</b>, <b>Cible</b> ou <b>Programme pédagogique</b>, cliquez sur l’<b>icône bleue</b>. Pour supprimer une section, cliquez simplement sur l’<b>icône rouge</b>.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md ">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "modificationetsuppression.png"} />
                        </div>

                    </div>
                </div>
            </div>

            {/*Importation du Support de Cours */}
            <div>
                <div className="space-y-1">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            4
                        </div>
                        <p className="text-gray-700 font-medium">
                            Importation du Support de Cours:
                        </p>
                    </div>

                </div>
                <div className="p-4 space-y-1">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Pour importer votre support de catalogue, rendez-vous dans la section située en bas de la page</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md ">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "importation.png"} />
                        </div>

                    </div>
                </div>
                <div className="p-4 space-y-1">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Cliquez sur <b>Importer vos ressources</b> pour ouvrir la fenêtre modale, sélectionnez le fichier à importer, puis cliquez sur <b>Importer</b> afin d’enregistrer votre importation.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md ">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "indiqueimportation.png"} />
                        </div>
                    </div>
                    <div className="border-gray-400 border-2 rounded-md ">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "modalimportationcatalogue.png"} />
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}