import { DOC_IMAGE_URL } from "../../../../config/env";

export default function DocDevisAjout() {
    return (
        <>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 ">
                    Ajout Nouveau Devis
                </h2>
            </div>

            <div className="mt-4 ">

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            1
                        </div>
                        <p className="text-gray-700 font-medium">
                            Ajout
                        </p>
                    </div>
                </div>

                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                    <li>En haut à droite, cliquez sur <b>Nouveau</b> pour créer un nouveau devis:</li>
                </ul>

                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                    <div className="p-3">
                         <img src={DOC_IMAGE_URL + "devis7.png"} />
                    </div>
                </div>

            </div>

            <div className="mt-4 ">

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            2
                        </div>
                        <p className="text-gray-700 font-medium">
                            Page d'Ajout
                        </p>
                    </div>
                </div>

                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                    <li>La page d'ajout de devis s'affiche où vous pouvez remplir les informations nécessaires pour créer un nouveau devis:</li>
                </ul>

                <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                    <div className="p-3">
                         <img src={DOC_IMAGE_URL + "devis8.png"} />
                    </div>
                </div>

            </div>

            <div className="mt-4 ">

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center gap-4 p-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                            3
                        </div>
                        <p className="text-gray-700 font-medium">
                            Explication de Formulaire
                        </p>
                    </div>
                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>Commencez par cliquer sur <b>Ajouter un client</b> afin de sélectionner le client associé à la facture.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "devis9.png"}/>
                        </div>
                    </div>
                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>Et après une zone de recherche s'ouvre pour faire des recherche sur le client associé à la facture</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                        <div className="p-3">
                             <img src={DOC_IMAGE_URL + "devis10.png"} />
                        </div>
                    </div>
                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>Après avoir choisi le client associé, les informations correspondantes s’affichent.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "devis11.png"} />
                        </div>
                    </div>
                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>Si le client a un contact, il suffit de sélectionner le contact correspondant.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "devis12.png"} />
                        </div>
                    </div>
                </div>

                <div>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li>Si le client n’a pas de contact, cliquez sur <b>Nouveau contact</b> pour en ajouter un. Un formulaire s’affiche et doit être rempli.</li>

                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                        <div className="p-3">
                             <img src={DOC_IMAGE_URL + "devis13.png"} />
                        </div>
                    </div>
                </div>

                <div className="mt-5">

                    <h1 className="text-gray-700">À droite, on trouve :</h1>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li><b>Adresse de facturation :</b> correspond à l’adresse de l’entreprise émettrice de la facture, incluant son NIF/STAT.</li>
                        <li><b>Numéro de facture :</b> il s’agit d’un identifiant unique (ex. : <i>Fact-001</i>) attribué automatiquement à chaque proforma pour en faciliter le suivi.</li>
                        <li><b>Date de facture :</b> permet d’indiquer la date de création ou d’émission du document.</li>
                        <li><b>Date de paiement :</b> définit la date limite ou le délai de paiement. Un menu déroulant permet de choisir le nombre de jours (ex. : 10 jours), après quoi la date de paiement s’ajuste automatiquement.</li>
                    </ul>

                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                        <div className="p-3">
                             <img src={DOC_IMAGE_URL + "devis14.png"} />
                        </div>
                    </div>
                </div>


                <div className="mt-5">

                    <h1 className="text-gray-700">Dans la section suivant, c'est ajoutés les services ou produits fournis au client, avec leurs caractéristiques et montants correspondants </h1>

                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                        <div className="p-3">
                             <img src={DOC_IMAGE_URL + "devis15.png"} />
                        </div>
                    </div>

                    <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                        <li><b>Ajouter un service :</b> ce lien permet d’ajouter un ou plusieurs services à la facture. Lorsque vous cliquez dessus, un menu déroulant s’affiche, proposant plusieurs options telles que <i>Cours</i>, <i>Honoraires formateur</i>, <i>Frais de déplacement</i>, et bien d’autres. Chaque service ajouté sera ensuite affiché dans le tableau ci-dessous.</li>
                    </ul>
                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                        <div className="p-3">
                            <img src={DOC_IMAGE_URL + "devis16.png"} />
                        </div>
                    </div>

                    <div className="mt-4">
                        <h1 className="text-gray-700">
                            Par exemple, si vous choisissez un <b>cours</b> , un menu déroulant s'affiche et vous pouvez sélectionner le cours à suivre:
                        </h1>

                        <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                            <div className="p-3">
                                 <img src={DOC_IMAGE_URL + "devis17.png"} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h1 className="text-gray-700">
                            Ensuite:
                        </h1>

                        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-3">
                            <li>Quantité : nombre d’unités ou d’heures associées au service.</li>
                            <li>Unité : type d’unité utilisée (ex. : jour, heure, pièce).</li>
                            <li>Prix unitaire : coût d’une seule unité du service.</li>
                            <li>Montant : total calculé automatiquement selon la quantité et le prix unitaire.</li>
                        </ul>
                    </div>

                </div>


                <div className="mt-5">

                    <h1 className="text-gray-700">
                        Dans la section suivante, vous trouverez le mode de paiement ainsi que le compte correspondant, avec les conditions de paiement.
                    </h1>


                    <div className="border-gray-400 border-2 rounded-md w-[900px] mt-2">
                        <div className="p-3">
                             <img src={DOC_IMAGE_URL + "devis18.png"} />
                        </div>
                    </div>



                </div>

            </div>

        </>
    )
}