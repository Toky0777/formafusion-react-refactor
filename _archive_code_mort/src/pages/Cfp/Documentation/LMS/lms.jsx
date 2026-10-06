export default function LMS() {
    return (
        <>
            <div>
                <div>
                    <h1 className="text-gray-700">
                        Dans cette section, le <b>LMS</b> affiche le résumé de chaque cours par programme.
                    </h1>
                </div>

                <div>
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
                            <li>Allez dans la menu et cliquer sur la section <b>"LMS"</b>,</li>
                        </ul>

                        <div className="border-gray-400 border-2 rounded-md w-96">
                            <div className="p-4 ">
                                <img src={process.env.REACT_APP_IMAGE_DOCUMENTATION + "lms1.png"} className="w-96" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}