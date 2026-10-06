export default function GestionMateriel() {
    return (
        <div className="documentation-page">
            <div>
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Ajout du matériel
                        </p>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour ajouter un matériel, cliquez sur « Ajouter » en haut de la page.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4 ">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "materiel3.png"} className="w-[900px]" />
                        </div>
                    </div>

                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Une fenêtre modale d’ajout s’affiche comme suit :</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4 ">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "materiel4.png"} className="w-96" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <h1 className="text-gray-700">Le modal d'ajout se présente comme suit : </h1>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li><b>Titre :</b> Nouveau matériel, affiché en haut de la fenêtre, avec une icône de fermeture (✕) à droite.</li>
                            <li><b>Champ Nom :</b> permet de saisir le nom du matériel.</li>
                            <li><b>Champ Description :</b> zone de texte destinée à ajouter une description détaillée du matériel.</li>
                            <li><b>Catégorie :</b> liste déroulante pour sélectionner la catégorie du matériel  : Informatique, Audovisuel, Mobilier.</li>
                            <li><b>Quantité :</b> champ numérique pour indiquer le nombre de matériels à ajouter..</li>
                        </ul>
                    </div>

                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Après l’ajout, il s’affiche comme suit :</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4 ">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "materiel5.png"} className="w-[900px]" />
                            </div>
                        </div>

                    </div>

                </div>



            </div>

            <div >
                <div className="flex items-center gap-4 p-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                        2
                    </div>
                    <p className="text-gray-700 font-medium">
                        Modification du matériel
                    </p>
                </div>

                <div className="mt-3" >
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour faire une modification, cliquer sur l'icône de modification (crayon) à droite du matériel dans la liste.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4 ">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "materiel6.png"} className="w-[900px]" />
                        </div>
                    </div>

                </div>

                <div className="mt-3">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Et une modal de modification s'affiche comme suit : </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4 ">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "materiel7.png"} className="w-96" />
                        </div>
                    </div>

                </div>
            </div>

            <div >
                <div className="flex items-center gap-4 p-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                        3
                    </div>
                    <p className="text-gray-700 font-medium">
                        Suppressiondu matériel
                    </p>
                </div>

                <div className="mt-3" >
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour supprimer un matériel, cliquer sur l'icône de suppression (poubelle) à droite du matériel dans la liste.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4 ">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "materiel8.png"} className="w-[900px]" />
                        </div>
                    </div>

                </div>

                <div className="mt-3">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Et une modal de confirmation s'affiche comme suit : </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[600px]">
                        <div className="p-4 ">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "materiel9.png"} className="w-[600px]" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}