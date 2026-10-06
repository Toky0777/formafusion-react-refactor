import { DOC_IMAGE_URL } from "../../../../config/env";
export default function ParticulierAdd() {
    return (
        <>
            <div>
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Ajout du nouvelle Particulier
                        </p>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour ajouter un nouveau particulier, il suffit de cliquer sur le bouton <b>Nouveau</b>. </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "particulier3.png"} />
                        </div>

                    </div>
                </div>
                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Et un formulaire s’affiche, que vous devez remplir.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[500px]">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "particulier4.png"} className="w-[500px]" />
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}