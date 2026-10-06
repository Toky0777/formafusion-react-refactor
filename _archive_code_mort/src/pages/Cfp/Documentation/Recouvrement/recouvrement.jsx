export default function Recouvrement() {
    return (
        <>
            <div>

                <div >
                    <h2 className="text-2xl font-bold text-gray-800 ">
                        Ulitisation de Recouvrement
                    </h2>
                </div>

                <div className="mt-3">
                    <h1 className="text-gray-700">
                        Dans cette page, c'est une analyse de recouvrement, c'est à dire une analyse des factures clients non encore payées, selon  leur ancienneté. L'objectif  c'est de savoir  qui doit l'argent, combien  et depuis combien de temps le paiement async it dû être fait.
                    </h1>
                </div>



                <div className="mt-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 ">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                                1
                            </div>
                            <p className="text-gray-700 font-medium">
                                Accéder à la Page de Recouvrement :
                            </p>
                        </div>

                    </div>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Allez dans la menu et cliquer sur la section <b>"Recouvrement"</b> </li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-96">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "recouvrement1.png"} />
                            </div>

                        </div>
                    </div>


                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>La page de recouvrement s'affiche tout de suite </li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-[900px]">
                            <div className="p-4">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "recouvrement2.png"} />
                            </div>

                        </div>
                    </div>


                </div>

                <div className="mt-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 ">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                                1
                            </div>
                            <p className="text-gray-700 font-medium">
                                Présentation de la Page de Recouvrement :
                            </p>
                        </div>

                    </div>

                    <div className="p-4 space-y-4">
                        <ul className="text-gray-700 list-disc list-inside">
                            <li>Chaque ligne représente un client.</li>
                        </ul>

                        <h1 className="text-gray-700 font-semibold">Les périodes sont réparties comme suit :</h1>

                        <ul className="text-gray-700 list-disc list-inside">
                            <li><b>Retard :</b> factures dont la date d’échéance est dépassée.</li>
                            <li><b>Après échéance :</b> factures proches de l’échéance ou récemment dépassées.</li>
                        </ul>
                    </div>


                </div>


                <div className="max-w-3xl mx-auto mt-8 bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-md ">
                    <p className="text-gray-700 text-base sm:text-lg font-semibold mb-4">
                        <span className="text-red-500 ">Remarque :</span>  Tous les prix et données chiffrées dans cette documentation sont fictifs et utilisés uniquement à titre d’exemple.
                    </p>
                </div>

            </div>
        </>

    );
}