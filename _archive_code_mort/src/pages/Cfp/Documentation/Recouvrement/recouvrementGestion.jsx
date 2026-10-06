import { useState } from "react";
import { Link } from "react-router-dom";

export default function RecouvrementGestion() {

    const [isOpen, setIsOpen] = useState(false);
    const imageURL = process.env.REACT_APP_IMAGE_DOCUMENTATION + "recouvrement4.png";
    return (
        <>
            <div>
                <div className="mt-3">
                    <h1 className="text-gray-700">
                        Chaque recouvrement contient des informations détaillées sur les factures impayées, y compris le montant dû, la date d'échéance et l'ancienneté de la dette.
                    </h1>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Cette section affiche le détail des factures non payées pour la période sélectionnée. Lorsque vous cliquez sur un montant dans le tableau récapitulatif, les factures correspondantes apparaissent ici, avec leur numéro, leur date d’échéance, les montants déjà réglés ainsi que le reste à payer.
                        </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4">
                            <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "recouvrement3.png"} />
                        </div>

                    </div>

                </div>


                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Dans la colonne Action, chaque facture dispose d’un bouton représenté par trois points verticaux.
                            Ce bouton permet d’accéder à plusieurs fonctionnalités liées à la facture sélectionnée.
                        </li>
                    </ul>

                    <h1 className="text-gray-700"> En cliquant sur ce bouton, un menu s’affiche  </h1>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4">
                            <img src={imageURL}
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
                                src={imageURL}
                                alt="Recouvrement"
                                className="max-w-[90%] max-h-[90%] rounded-md shadow-lg"
                                onClick={(e) => e.stopPropagation()} // empêche la fermeture si on clique sur l'image
                            />
                        </div>
                    )}
                </div>

                <div className="p-4 space-y-4">
                    <h1 className="text-gray-700"> Explications des options proposées :  </h1>

                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li><b>Paiement :</b> en cliquant sur « Paiement », un formulaire s'affiche. On remplit le formulaire pour effectuer le paiement et celui-ci sera enregistré dans la facture.</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px] mt-6">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "recouvrement5.png"} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li><b>Historique de paiement :</b> permet de consulter toutes les transactions déjà réalisées pour cette facture, y compris la date, le montant payé et le mode de paiement.</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px] mt-6">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "recouvrement6.png"} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li><b>Voir détails :</b> fonctionne de la même manière que dans la <Link to="cfp/documentation/doc_recouvrement/gestion" className="text-blue-500 underline">Facture</Link>.</li>

                        </ul>
                    </div>

                    <div>
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Cliquez sur <b>Export  PDF</b> pour télécharger le document au format PDF et le conserver ou l’imprimer.</li>

                        </ul>
                    </div>


                </div>

            </div>

            <div className="max-w-3xl mx-auto mt-8 bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-md ">
                <p className="text-gray-700 text-base sm:text-lg font-semibold mb-4">
                    <span className="text-red-500 ">Remarque :</span>  Tous les prix et données chiffrées dans cette documentation sont fictifs et utilisés uniquement à titre d’exemple.
                </p>
            </div>
        </>
    )
}