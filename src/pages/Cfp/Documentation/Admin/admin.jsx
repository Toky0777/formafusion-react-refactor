import { DOC_IMAGE_URL } from "../../../../config/env";
export default function Admin() {
    return (
        <>
            <div>
                <h1 className="text-gray-700">Dans cette page, on ajoute des particuliers qui participent à des cours destinés à une seule personne, avec un suivi personnalisé et adapté aux besoins de l’apprenant. Ces cours se déroulent généralement en tête-à-tête, en présentiel ou en ligne, et permettent à l’enseignant de se concentrer entièrement sur l’élève. </h1>

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Accès à la page
                        </p>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Allez dans la menu et cliquer sur la section <b>"Administrateur"</b> </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "admin1.png"} className="w-96" />
                        </div>

                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Et la page s'affiche correctement </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px] flex gap-3">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "admin2.png"} className="w-[600px]" />
                        </div>
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "admin2.png"} className="w-[600px]" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}