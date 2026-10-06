import { DOC_IMAGE_URL } from "../../../../config/env";

export default function DocDevisStatut() {
    return (
        <>
            <div>
                <h1 className="text-gray-700">Explication de chaque Statut dans le Devis</h1>

                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "devis19.png"} />
                    </div>
                </div>
            </div>

            <div>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                    <li><b>Brouillon :</b> Tous les devis créés apparaissent d’abord en mode Brouillon.</li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "devis20.png"} />
                    </div>
                </div>
            </div>

            <div>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                    <li>D'abord, il faut l'<b>Approuver</b></li>
                    <li><b>Approuver</b> : c'est-à-dire, si le proforma est prêt à envoyé vers le client il faut l'<b>Approuver</b></li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "devis21.png"} />
                    </div>
                </div>
            </div>

            <div>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                    <li>Après avoir l'<b>Approuver</b> le statut est dirigé dans <b>Tous les proforma</b> et le statut devient <b>Non envoyé</b></li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "devis22.png"} />
                    </div>
                </div>
            </div>

            <div>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                    <li>Si on veut envoyé le proforma chez le client on clique sur <b>Envoyé</b> </li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "devis23.png"} />
                    </div>
                </div>
            </div>

            <div>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                    <li>Et le statut change on <b>Envoyé</b> </li>
                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "devis24.png"} />
                    </div>
                </div>
            </div>

            <div>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                    <li>Après l’avoir envoyé au client, si celui-ci accepte le prix de la formation et souhaite la réaliser, le devis est alors <b>converti</b>.</li>

                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "devis25.png"} />
                    </div>
                </div>
            </div>

            <div>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                    <li>Et le statut change on <b>Convertis</b>.</li>

                </ul>
                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                    <div className="p-3">
                        <img src={DOC_IMAGE_URL + "devis26.png"} />
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto mt-8 bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-md ">
                <p className="text-gray-700 text-base sm:text-lg font-semibold mb-4">
                    <span className="text-red-500 ">Remarque :</span>  Tous les prix et données chiffrées dans cette documentation sont fictifs et utilisés uniquement à titre d’exemple.
                </p>
            </div>

        </>
    );
}