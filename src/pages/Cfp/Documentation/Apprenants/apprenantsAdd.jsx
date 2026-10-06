import { DOC_IMAGE_URL } from "../../../../config/env";
export default function ApprenantsAdd() {
    return (
        <>
            <div>
                <div>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour ajouter une nouvelle apprenants, cliquer sur le boutton <b>Nouveau</b> .</li>
                    </ul>
                </div>

                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "apprenant3.png"} className="w-[900px]" />
                    </div>
                </div>
            </div>

            <div className="mt-5">

                <h1 className="text-gray-700">
                    Un formulaire d’ajout s’affiche. L’ajout d’un apprenant peut se faire de deux façons :
                </h1>

                <div>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Remplir le formulaire.</li>
                    </ul>
                </div>

                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "apprenant6.png"} className="w-[900px]" />
                    </div>
                </div>

                <div className="mt-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Cliquez sur <b>Ajouter en masse</b> pour importer directement un fichier Excel.</li>
                        <li>Choisissez l’entreprise, puis importez le fichier <b>Excel</b>.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "apprenant8.png"} className="w-[900px]" />
                        </div>
                    </div>

                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                        <div className="p-4 ">
                            <img src={DOC_IMAGE_URL + "apprenant7.png"} className="w-[900px]" />
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}