import { DOC_IMAGE_URL } from "../../../../config/env";

export default function DocCatalogueAjout() {
    return (

        <>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 ">
                    Creation et changement de status d'un cours
                </h2>
            </div>

            {/* création nouvelle Cours */}
            <div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Création nouvelle Cours :
                        </p>
                    </div>

                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour créer un nouveau cours, cliquez sur <b>Ajouter un cours</b>.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-full">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "ajoutcatalogue.png"} />
                        </div>

                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Remplissez les champs obligatoires : le nom de domaine, le niveau, l’intitulé de la formation et choisissez une icône.</li>
                        <li>Cliquez sur <b>Ajouter</b> pour enregistrer le nouveau cours.</li>
                        <li>Tous les nouveaux cours ajoutés se trouvent dans la section <b>En préparation</b>.</li>

                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-full">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "modalajoutcatalogue.png"} />
                        </div>

                    </div>
                </div>
            </div>

            {/* Changement de status */}
            <div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            2
                        </div>
                        <p className="text-gray-700 font-medium">
                            Changement de status :
                        </p>
                    </div>

                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Pour changer le statut d’un cours, si votre cours se trouve dans la section <b>"En préparation"</b> et que vous souhaitez le rendre disponible, il suffit de cliquer sur le bouton <b>"Mettre en formation disponible"</b> situé en bas de la carte du cours.</li>
                        <li>Vous pouvez faire de même pour mettre un cours en corbeille, ou pour passer un cours de la section <b>"Disponible"</b> à <b>"En préparation"</b>.</li>
                        <li>Dans la section <b>En corbeille</b>, vous pouvez restaurer un cours, qui réapparaîtra à sa place d’origine, et ou supprimer un cours définitivement.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-full">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "statuscatalogue1.png"}/>
                        </div>

                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Vous pouvez également changer le statut d’un cours depuis la page de détail, en utilisant le bouton situé en haut à droit.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-full">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "detailcatalogue.png"} />
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside ">
                        <li>Si vous souhaitez rendre votre cours public sur le Marketplace, il suffit de cliquer sur le bouton <b>"Mettre en Marketplace"</b> situé en bas à gauche de la carte du cours.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "status.png"} />
                        </div>

                    </div>
                </div>
            </div>





        </>
    );
}