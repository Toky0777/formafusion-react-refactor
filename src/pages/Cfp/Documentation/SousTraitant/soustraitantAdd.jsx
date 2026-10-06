import { DOC_IMAGE_URL } from "../../../../config/env";
export default function SousTraitantAdd() {
    return (
        <>

            <div>
                <ul className="text-gray-700 list-disc list-inside">
                    <li>Pour ajouter un nouveau sous-traitant, en haut de la page se trouve un bouton d’ajout. Il suffit de cliquer sur le bouton <b>Ajouter un sous-traitant</b>. </li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "soustraitan3.png"} className="w-[900px]" />
                    </div>
                </div>
                <ul className="text-gray-700 list-disc list-inside mt-3">
                    <li>Et la page s’affiche correctement.</li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-3 ">
                    <div className="p-4 ">
                        <img src={DOC_IMAGE_URL + "soustraitan2.png"} className="w-[900px]" />
                    </div>

                </div>
            </div>

        </>
    )
}