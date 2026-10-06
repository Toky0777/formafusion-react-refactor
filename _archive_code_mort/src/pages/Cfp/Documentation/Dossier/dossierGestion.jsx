import { useState } from "react";
import { Link } from "react-router-dom";

export default function DossierGestion() {
    const [isOPenGestion, setIsOpenGestion] = useState(false);
    const imgUrl = process.env.REACT_APP_IMAGE_DOCUMENTATION;
    return (
        <>
            <div>

                <div>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>
                            La gestion des dossiers permet de visualiser, ajouter, modifier ou supprimer des dossiers liés aux entreprises et aux formations.
                        </li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4">
                            <img src={imgUrl + "dossier14.png"} className="w-96" onClick={() => setIsOpenGestion(true)} />
                        </div>

                    </div>
                    {isOPenGestion && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsOpenGestion(false)}>
                            <div className="bg-white p-4 rounded-md max-w-full max-h-full overflow-auto">
                                <img src={imgUrl + "dossier14.png"} className="w-[980px]" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <h1 className="text-gray-700">Explication de chaque icone : </h1>

                    <div className="mt-5">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>
                                Dans la section <b>Nouveau document</b>, vous pouvez ajouter un document en cliquant sur l’icône correspondante.
                                Pour plus de détails, consultez la section « Ajout d’un document dans le dossier » dans la
                                <Link to="/cfp/documentation/doc_dossier/detail" className="text-blue-500 underline">
                                    Présentation du détail
                                </Link>.
                            </li>
                        </ul>
                        <div className="border-gray-400 border-2 rounded-md w-96">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier15.png"} className="w-96" />
                            </div>

                        </div>
                    </div>

                    <div className="mt-5">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>
                                Cette interface <b>Gérer les projets.</b>
                                Elle permet d’associer ou de retirer des projets à un dossier de manière simple et visuelle.
                            </li>
                            <li>
                                Dans le colonne de gauche, vous trouverez la liste des projets disponibles qui ne sont pas encore associés au dossier.
                                Vous pouvez parcourir cette liste pour voir tous les projets que vous pouvez ajouter au dossier.
                            </li>
                            <li>
                                Dans le colonne de droite, vous verrez les projets actuellement associés au dossier.
                                Cela vous permet de voir rapidement quels projets font partie du dossier.
                            </li>
                        </ul>

                        <h1 className="text-gray-700"></h1>
                        <div className="border-gray-400 border-2 rounded-md w-[800px]">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier16.png"} className="w-[800px]" />
                            </div>

                        </div>
                    </div>

                    <div className="mt-5">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>
                                Pour ajouter une projet dans une dossier, il suffit de cliquer sur l’icône « + » à côté du projet dans la colonne de gauche.
                            </li>

                        </ul>

                        <h1 className="text-gray-700"></h1>
                        <div className="border-gray-400 border-2 rounded-md w-[800px]">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier17.png"} className="w-[800px]" />
                            </div>

                        </div>
                    </div>

                    <div className="mt-5">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>
                               Pour retirer un projet d’un dossier, cliquez sur l’icône « - » à côté du projet dans la colonne de droite.
                            </li>

                        </ul>

                        <h1 className="text-gray-700"></h1>
                        <div className="border-gray-400 border-2 rounded-md w-[800px]">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "dossier18.png"} className="w-[800px]" />
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
