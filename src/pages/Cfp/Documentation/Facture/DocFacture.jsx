import { DOC_IMAGE_URL } from "../../../../config/env";
export default function DocFacture() {
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold text-gray-800 ">
                    Utilisation du Microservice Nouvelle Facture
                </h1>

                <p className="bg-gray-200 p-4 text-gray-700 mt-2 rounded-sm w-[600px]">
                    Cette page vous permet de générer la facture une fois que la formation a été validée.
                </p>
            </div>


            <div className="mt-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 ">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Accéder à la page de <b>Facture</b>
                        </p>
                    </div>

                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Pour accéder à la page, allez dans le menu et cliquez sur <b>Facture</b>.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-96">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "facture1.png"} />
                        </div>

                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Et la page de facture s'affiche</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px] ">
                        <div className="p-4">
                            <img src={DOC_IMAGE_URL + "facture2.png"} />
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
                            Présentation de la page <b>Facture</b>
                        </p>
                    </div>

                </div>

                <div className="p-4 space-y-4">

                    <p className="text-gray-700">En haut de la page on peut voir des statut comme : </p>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Dashbord : </li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px] ">
                        <div className="p-4">
                            <img src="../../../assets/img/DocImage/facture4.png" />
                        </div>

                    </div>
                </div>

                <div className="p-4 space-y-4">

                    <p className="text-gray-700">En haut de la page on peut voir des statut comme : </p>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Tous les Factures</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4">
                            <img src="../../../assets/img/DocImage/facture5.png" />
                        </div>

                    </div>
                </div>

                <div className="p-4 space-y-4">

                    <p className="text-gray-700">En haut de la page on peut voir des statut comme : </p>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Non payés</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4">
                            <img src="../../../assets/img/DocImage/facture6.png" />
                        </div>

                    </div>
                </div>

                <div className="p-4 space-y-4">

                    <p className="text-gray-700">En haut de la page on peut voir des statut comme : </p>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Echues</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4">
                            <img src="../../../assets/img/DocImage/facture7.png" />
                        </div>

                    </div>
                </div>

                <div className="p-4 space-y-4">

                    <p className="text-gray-700">En haut de la page on peut voir des statut comme : </p>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Brouillons</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4">
                            <img src="../../../assets/img/DocImage/facture8.png" />
                        </div>

                    </div>
                </div>

                <div className="p-4 space-y-4">

                    <p className="text-gray-700">En haut de la page on peut voir des statut comme : </p>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>Acomptes</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px]">
                        <div className="p-4">
                            <img src="../../../assets/img/DocImage/facture9.png" />
                        </div>

                    </div>
                </div>
            </div>


        </>
    )
}