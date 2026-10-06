import { useState } from "react";

export default function DossierDétail() {

    const [isOpen, setIsOpen] = useState(false)
    const imageURL = process.env.REACT_APP_IMAGE_DOCUMENTATION;
    return (
        <>
            <div>

                <div className="p-4 space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 ">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                                1
                            </div>
                            <p className="text-gray-700 font-medium">
                                Détails de chaque <b>Dossier</b>
                            </p>
                        </div>

                    </div>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>
                            Pour voir le détail d’un dossier, il suffit de cliquer sur le dossier correspondant. et lde détail s'affiche comme ceci :
                        </li>
                    </ul>


                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4">
                            <img
                                src={imageURL + "dossier4.png"}
                                className="w-[900px]"
                                onClick={() => setIsOpen(true)}
                            />
                        </div>

                    </div>
                    {/* Modal */}
                    {isOpen && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                            onClick={() => setIsOpen(false)} // ferme la modal en cliquant sur le fond
                        >
                            <img
                                src={imageURL + "dossier4.png"}
                                alt="Recouvrement"
                                className="max-w-[90%] max-h-[90%] rounded-md shadow-lg"
                                onClick={(e) => e.stopPropagation()} // empêche la fermeture si on clique sur l'image
                            />
                        </div>
                    )}

                </div>

                <div className="space-y-4">

                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            2
                        </div>
                        <p className="text-gray-700 font-medium">
                            Présentation de la page de détail d'un dossier
                        </p>
                    </div>

                    <h1 className="text-gray-700">
                        Cette page permet de consulter et gérer un dossier lié à une entreprise participante. Elle centralise les informations générales, les projets associés ainsi que les documents rattachés au dossier.
                    </h1>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>En haut de la page, on voit le nom du dossier.</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier5.png"} className="w-[900px]" />
                            </div>

                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Ensuite, dans cette section  offre un aperçu global du dossier en affichant l’entreprise participante, le montant total des projets, la période de validité, le type de projets ainsi que le nombre de projets associés.</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier6.png"} className="w-[900px]" />
                            </div>

                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>La section « Projets associé(s) » présente, sous forme de tableau, l’ensemble des projets rattachés au dossier avec leurs informations détaillées (module de formation, référence, entreprise, ville, statut, période, nombre de participants, montant HT, statut de paiement et actions disponibles).</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier7.png"} className="w-[900px]" />
                            </div>

                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>La section « Documents dans ce dossier » centralise l’ensemble des fichiers liés au dossier et affiche, pour chacun, son nom, son type, sa section, sa taille ainsi que les actions disponibles pour la consultation et la gestion.</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier8.png"} className="w-[900px]" />
                            </div>

                        </div>
                    </div>

                </div>

                <div className="p-4 space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 ">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                                3
                            </div>
                            <p className="text-gray-700 font-medium">
                                Ajout document dans le dossier
                            </p>
                        </div>

                    </div>

                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>
                                Le bouton <b>Ajouter</b>  permet d’importer un nouveau document et de l’associer au dossier.
                            </li>
                        </ul>
                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier10.png"} className="w-[900px]" />
                            </div>

                        </div>
                    </div>

                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>
                                Et une modal s'affiche comme ceci :
                            </li>
                        </ul>
                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier9.png"} className="w-[900px]" />
                            </div>

                        </div>
                    </div>

                    <div className="mt-6">
                        <h1 className="text-gray-700" >Cette page permet à l’utilisateur d’ajouter un nouveau document dans le dossier</h1>

                        <div>
                            <ul className="text-gray-700 list-disc list-inside">
                                <li>
                                    L’utilisateur commence par choisir la section à laquelle le document est rattaché (Offre, Finance, FMFP, Contrat ou Rapport), afin d’assurer un classement clair et de faciliter l’organisation ainsi que l’accès aux documents.
                                </li>
                            </ul>
                            <div className="border-gray-400 border-2 rounded-md w-[900px]">
                                <div className="p-4">
                                    <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier11.png"} className="w-[900px]" />
                                </div>

                            </div>
                        </div>

                        <div>
                            <ul className="text-gray-700 list-disc list-inside">
                                <li>
                                    Un champ de téléchargement permet à l’utilisateur de sélectionner, depuis son ordinateur, un fichier à importer (formats pris en charge : pdf, txt, xls, xlsx, csv, ppt, pptx), avec une taille maximale de 2 Mo.
                                </li>
                            </ul>
                            <div className="border-gray-400 border-2 rounded-md w-[900px]">
                                <div className="p-4">
                                    <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier12.png"} className="w-[900px]" />
                                </div>

                            </div>
                        </div>

                        <div>
                            <ul className="text-gray-700 list-disc list-inside">
                                <li>
                                    Un champ de saisie permet de renseigner le titre du document.
                                    Ce titre servira à identifier facilement le fichier dans la liste des documents du dossier.
                                </li>
                            </ul>
                            <div className="border-gray-400 border-2 rounded-md w-[900px]">
                                <div className="p-4">
                                    <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier13.png"} className="w-[900px]" />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}