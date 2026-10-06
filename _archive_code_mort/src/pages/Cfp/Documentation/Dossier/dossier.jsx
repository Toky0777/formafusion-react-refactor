import { useState } from "react";

export default function Dossier() {
    const [isOpen, setIsOpen] = useState(false);
    const imageURL = process.env.REACT_APP_IMAGE_DOCUMENTATION;
    return (
        <>
            <div>
                <h2 className="text-gray-700 ">
                    Dans ce microservice, le module <b>« Dossier »</b> permet de sauvegarder les données de chaque entreprise : PDF, photos, etc. Chaque dossier est lié à une ou plusieurs formations.
                </h2>

                <div className="mt-6">

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 ">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                                1
                            </div>
                            <p className="text-gray-700 font-medium">
                                Accéder à la page de <b>Dossier</b>
                            </p>
                        </div>

                    </div>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Pour accéder à la page, allez dans le menu et cliquez sur <b>Dossier</b>.</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-96">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier1.png"} />
                            </div>

                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Et la page s'affiche comme ceci : </li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4">
                                <img
                                    src={imageURL + "dossier2.png"}
                                    className="w-[900px]"
                                    onClick={() => setIsOpen(true)}
                                />
                            </div>

                        </div>

                        <ul className="text-gray-700 list-disc list-inside">
                            <li> <b>Dans le statut :</b> c'est l'état actuel du dossier. Par exemple, En préparation signifie que le dossier n’est pas encore finalisé. </li>
                        </ul>

                        {/* Modal */}
                        {isOpen && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
                                onClick={() => setIsOpen(false)} // ferme la modal en cliquant sur le fond
                            >
                                <img
                                    src={imageURL + "dossier2.png"}
                                    alt="Recouvrement"
                                    className="max-w-[90%] max-h-[90%] rounded-md shadow-lg"
                                    onClick={(e) => e.stopPropagation()} // empêche la fermeture si on clique sur l'image
                                />
                            </div>
                        )}
                    </div>

                    <div className="p-4 space-y-4">
                        <h2 className="text-gray-700">
                            En haut de la page, plusieurs options sont disponibles pour gérer les dossiers :
                        </h2>

                        <ul className="text-gray-700 list-disc list-inside">
                            <li>
                                <b>Barre de recherche :</b> le champ « Recherche » permet de retrouver rapidement un dossier.
                            </li>
                            <li>
                                <b>Bouton Filtres :</b> permet d’affiner l’affichage des dossiers selon différents critères
                                (année, Mois, statut, ville, Entreprise), afin de faciliter la navigation lorsque la liste est longue.
                            </li>
                            <li>
                                <b>Sélecteur du nombre de lignes :</b> l’option « 10 lignes » (en haut à droite) permet de choisir
                                le nombre de dossiers affichés par page.
                            </li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier3.png"} className="w-[900px]" />
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}