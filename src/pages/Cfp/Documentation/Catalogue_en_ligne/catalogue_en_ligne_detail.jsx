import { Link } from "react-router-dom";
import { DOC_IMAGE_URL } from "../../../../config/env";

export default function CatalogueEnLigneDetail() {
    return (
        <>

            <div className="mt-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Présentation pour le bouton “Détails”
                        </p>
                    </div>

                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Le bouton Détails permet d’afficher toutes les informations complètes concernant ce cours </li>
                        <li>C’est dans les détails que vous pouvez voir toutes les informations. Vous pouvez consulter ce lien pour <Link to="/cfp/documentation/doc_catalogue/detail" className="text-blue-500 underline">voir le détail</Link> et comprendre son utilisation ainsi que son fonctionnement.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "catalogueligne4.png"} />
                        </div>

                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            2
                        </div>
                        <p className="text-gray-700 font-medium">
                            Présentation pour le bouton <b>Ne plus afficher dans le marketplace</b>
                        </p>
                    </div>

                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Le bouton <b>Ne plus afficher dans le marketplace</b>  permet de masquer ce cours afin qu’il ne soit plus visible publiquement par les clients. Le cours reste enregistré dans votre catalogue interne, mais il n’apparaît plus dans la liste des formations proposées sur le marketplace.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "catalogueligne5.png"} />
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}