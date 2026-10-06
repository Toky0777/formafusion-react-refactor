import { DOC_IMAGE_URL } from "../../../../config/env";

export default function DocDetails() {
    return (
        <>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 ">
                    Detail du Projet et Actions
                </h2>
            </div>

            <div className="mt-4 ">

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Actions
                        </p>
                    </div>
                </div>

                <p className="text-gray-700">
                    En haut à droite, cliquez sur les trois points pour afficher les actions et le statut du projet.
                </p>

                <p className="text-gray-700">
                    <b>Actions :</b> Aperçu, Supprimer, Dupliquer, Archiver
                </p>

                <p className="text-gray-700">
                    <b>Statuts :</b> En cours, En préparation, Planifié, Terminé, Reporté, Annulé, Clôturé
                </p>

                <div className="border-gray-400 border-2 rounded-md w-[800px]">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "projet18.png"}/>
                    </div>
                </div>

            </div>


            <div>

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            2
                        </div>
                        <p className="text-gray-700 font-medium">
                            Détails du Projet
                        </p>
                    </div>
                </div>

                <div >

                    <h1 className="text-gray-700 ">
                        Pour voir le détail d’un projet, cliquez sur les trois points situés en haut à droite,
                        puis sélectionnez <b>Aperçu</b> pour afficher les détails du projet, et le détail s'affichera . Dans cette section, vous pouvez consulter toutes les informations relatives au projet.
                    </h1>
                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-3">
                           <img src={DOC_IMAGE_URL + "projet19.png"} />
                        </div>
                    </div>

                </div>

                <div>
                    <h1 className="text-gray-700 mt-3">
                        En haut, vous trouverez les options suivantes : Dossier, Éditer les informations, Sous-traitant, Télécharger et Actions à faire:
                    </h1>

                    <ul className="text-gray-700 list-disc list-inside mt-2 space-y-2">
                        <li>
                            <b>Dossier : </b>À l’intérieur du dossier, il peut y avoir plusieurs documents. Les documents importants peuvent être par exemple :La fiche de présence (PDF),Les supports de cours,Tout autre document utile au bon déroulement de la formation.
                        </li>
                        <li>
                            <b>Editer les informations : </b>c'est pour modifier les informations du projet.
                        </li>
                        <li>
                            <b>Sous-traitant: </b>Permet d’ajouter le sous-traitant associé au projet.
                        </li>
                        <li>
                            <b>Télécharger PDF: </b>Permet de télécharger le détail du projet au format PDF.
                        </li>
                        <li>
                            <b>Actions à faire : </b>Permet de voir les actions à faire pour ce projet.
                        </li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "projet20.png"} />
                        </div>
                    </div>

                </div>

                <div className="mt-5">
                    <h2 className="text-gray-800 font-semibold ">
                        Voici les différentes actions que vous pouvez effectuer dans la gestion d’un projet :
                    </h2>
                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>On peut ajouter et modifier les apprenants présents durant le cours.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                             <img src={DOC_IMAGE_URL + "projet21.png"} />
                        </div>
                    </div>

                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>On peut ajouter et modifier les lieux où se déroule le cours.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                             <img src={DOC_IMAGE_URL + "projet22.png"} />
                        </div>
                    </div>
                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>On peut ajouter et modifier les matériels nécessaires au cours.</li>
                        <li>Cliquez sur <b>"Ajouter un matériel"</b> pour ouvrir la fenêtre modale d’ajout.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "projet23.png"} />
                        </div>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>Dans la fenêtre modale, vous devez choisir les matériels nécessaires pour la formation.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "projet24.png"} />
                        </div>
                    </div>
                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>On peut gérer les documents nécessaires pour le cours.</li>
                        <li>On peut <b>ajouter</b> un dossier ou accéder directement à un dossier existant.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                           <img src={DOC_IMAGE_URL + "projet25.png"} />
                        </div>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>La fenêtre modale d’ajout de document dans le dossier s’affiche. Vous pouvez y choisir le type de document, importer le fichier et attribuer un titre au document.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                           <img src={DOC_IMAGE_URL + "projet26.png"} />
                        </div>
                    </div>

                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>On peut gérer les sessions de formation.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                             <img src={DOC_IMAGE_URL + "projet27.png"} />
                        </div>
                    </div>

                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>On peut ajouter des clients ou des partenaires au projet.</li>
                        <li>Pour ajouter un client ou un partenaire au projet, cliquez sur <b>Éditer</b>.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                             <img src={DOC_IMAGE_URL + "projet28.png"} />
                        </div>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>Après avoir cliqué sur <b>Éditer</b>, une fenêtre latérale affichant la liste des clients ou des partenaires s’ouvre. Vous pouvez ensuite ajouter les clients nécessaires au projet.</li>

                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                             <img src={DOC_IMAGE_URL + "projet129.png"} />
                        </div>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>on peut voir les informations du clients</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                             <img src={DOC_IMAGE_URL + "projet30.png"} />
                        </div>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>Une fenêtre latérale s’affiche avec les détails de l’entreprise (client).</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                             <img src={DOC_IMAGE_URL + "projet31.png"} />
                        </div>
                    </div>

                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>On peut ajouter et modifier les formateurs.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                             <img src={DOC_IMAGE_URL + "projet32.png"} />
                        </div>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>Une liste de formateurs s’affiche.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                             <img src={DOC_IMAGE_URL + "projet33.png"} />
                        </div>
                    </div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>On peut voir les information du formateur</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "projet34.png"} />
                        </div>
                    </div>
                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "projet35.png"} />
                        </div>
                    </div>

                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>On peut gérer le financement de la formation.</li>
                    </ul>

                </div>

            </div>

        </>
    )
}