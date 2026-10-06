export default function DocStatus() {
    return (
        <>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 ">
                    Explication des Status dans le Projet
                </h2>
            </div>


            <div >
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                        1
                    </div>
                    <p className="text-gray-700 ">
                        <b>"En Préparation" :</b>  Ce status indique que le projet est en cours de création et n'a pas encore été finalisé.
                    </p>
                </div>

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                        2
                    </div>
                    <p className="text-gray-700 ">
                        <b>"En Cours" :</b>  Ce status signifie que le projet a été finalisé et est actuellement en cours d'exécution.
                    </p>
                </div>

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                        3
                    </div>
                    <p className="text-gray-700 ">
                        <b>"Terminés" :</b>  Ce status indique que le projet a été achevé avec succès.
                    </p>
                </div>

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                        4
                    </div>
                    <p className="text-gray-700 ">
                        <b>"Planifiés" :</b>  Ce status est utilisé pour les projets qui ont été programmés mais qui n'ont pas encore commencé.
                    </p>
                </div>

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                        5
                    </div>
                    <p className="text-gray-700 ">
                        <b>"Cloturé" :</b>   Ce status signifie que le projet est officiellement clos et qu'aucune activité supplémentaire n'est prévue.
                    </p>
                </div>

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                        6
                    </div>
                    <p className="text-gray-700 ">
                        <b>"Reporté" :</b> Ce status indique que le projet a été temporairement mis en pause ou reporté à une date ultérieure.
                    </p>
                </div>

                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">
                        7
                    </div>
                    <p className="text-gray-700 ">
                        <b>"Annulé" :</b> Ce status signifie que le projet a été annulé et ne sera pas poursuivi.
                    </p>
                </div>
                <div className="flex items-center gap-4 p-4 ">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-slate-100 font-bold rounded-full">

                    </div>
                    <p className="text-gray-700 ">
                        <b>"Supprimé" :</b>  Ce status indique que le projet a été supprimé de la liste des projets actifs.
                    </p>
                </div>

            </div>





        </>
    )
}