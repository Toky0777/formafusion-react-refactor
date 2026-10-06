import { useState, useEffect } from 'react';
import axios from '../../../../config/axios';
import { IMAGE_URL } from "../../../../config/env";

const EtpFormationDetail = ({ route }) => {
    
    const [modules, setModules] = useState(null);
    const [objectifs, setObjectis] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currency, setCurrency] = useState("MGA"); // valeur par défaut
    
        useEffect(() => {
            const storedSetting = sessionStorage.getItem("setting");
            if (storedSetting !== null) {
                try {
                    const parsedSetting = JSON.parse(storedSetting);
                    setCurrency(parsedSetting.currency_unit || "MGA");
                } catch (err) {
                    console.error("Erreur JSON:", err);
                }
            }
        }, []);


    useEffect(() => {
        if (route) {
            fetchModules();
        }
    }, [route]);

    const fetchModules = async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const res = await axios.get(route);
         

            if (res.data.module && res.data.objectifs && res.data.programmes) {
                const { module, objectifs, programmes } = res.data;

                setModules(module); setObjectis(objectifs); setProgrammes(programmes);

            } else {
                setError("Données non trouvées !");
            }
        } catch (err) {
            console.warn("Failed to fetch sessions:", err); // Log the actual error
            setError("Échec de la récupération des sessions. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <div className="text-center p-4 text-gray-800">Chargement des données...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center text-center p-4">
                <p className="text-red-600 mb-4">Une erreur s'est produite : {error}</p>
                <button
                    onClick={() => fetchModules()}
                    className="bg-purple-500 text-white w-28 rounded p-2 hover:bg-purple-600 transition"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (!modules) {
        return (
            <div className="text-center p-4 text-gray-500">
                Module non disponible.
            </div>
        );
    }


    return (
         <div className="h-full w-full flex flex-col p-2 relative">
            <div className="relative w-full">
                <div className="w-full  flex justify-start items-start gap-1">
                    <div className="w-[116px] h-[77px] rounded-xl p-1">

                        {modules.module_image ? (
                            <img
                                src={`${IMAGE_URL}/img/modules/${modules.module_image}`}
                                className="object-cover w-full h-full rounded-xl"
                                alt="Module"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-3xl text-gray-500 bg-gray-100 rounded-xl">
                                {modules.moduleName[0]}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                        <h3 className="text-xl font-bold text-gray-700">{modules.moduleName}</h3>
                        {modules.module_subtitle ? (
                            <p className="text-gray-700">{modules.module_subtitle}</p>
                        ) : (
                            <p className="text-gray-400 italic">Description non renseignée.</p>
                        )}
                    </div>

                </div>
            </div>
            <div className="w-full text-left flex flex-col mt-[50px] gap-y-3 p-2 overflow-y-auto">
                <p className="text-gray-600">
                    Participants : min {modules.minApprenant ?? "?"} / max{" "}
                    {modules.maxApprenant ?? "?"}
                </p>

                {/* Prix */}
                <p className="text-sm font-semibold text-gray-600">
                    Prix individuel : {Number(modules.prix).toLocaleString()} {currency}
                </p>
                {modules.prixGroupe && (
                    <p className="text-gray-600">
                        Prix groupe : {Number(modules.prixGroupe).toLocaleString()} {currency}
                    </p>
                )}

                {/* Référence (si présente) */}
                {modules.reference && (
                    <p className="text-gray-500">Référence : {modules.reference}</p>
                )}
                <div className="w-full p-3 border-[1px] flex flex-col gap-2 border-gray-200 border-dashed rounded-md">
                    <div className="flex justify-start aligns-center gap-2">
                    
                            <h5 className="text-sm font-semibold text-gray-600">Durée :</h5>                    
                            <p className="text-gray-600">
                                {modules.dureeJ && modules.dureeH
                                    ? `${modules.dureeH} Heures (${modules.dureeJ} Jours)`
                                    : modules.dureeJ
                                        ? `${modules.dureeJ} Jours`
                                        : `${modules.dureeH} Heures`}
                            </p>    
                    </div>
                </div>

                <div className="w-full p-3 border-[1px] flex flex-col gap-2 border-gray-200 border-dashed  rounded-md">
                    <div className="flex flex-col w-full gap-y-1">
                        <h5 className="text-sm font-semibold text-gray-600">Objectifs</h5>

                        {objectifs && objectifs.length > 0 ? (
                            <ul className="flex flex-col gap-y-1 w-full">
                                {objectifs.map((obj, index) => (
                                    <li key={index} className="w-full text-base text-gray-400">
                                        • {obj.objectif}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="w-full text-base text-gray-400">Objectif non renseigné</p>
                        )}
                    </div>

                </div>

                <div className="w-full p-3 border-[1px] flex flex-col gap-2 border-gray-200 border-dashed  rounded-md">
                    <div className="flex flex-col w-full gap-y-1">
                        <h5 className="text-sm font-semibold text-gray-600">Programmes de formation</h5>
                        <div className="w-full space-y-4">
                            {programmes && programmes.length > 0 ? (
                                programmes.map((pgr, index) => (
                                    <div key={index} className="border rounded-md">
                                        <details className="group">
                                            <summary className="cursor-pointer px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium">
                                                Module {index + 1}
                                            </summary>
                                            <div className="p-4 bg-white border-t">
                                                <h5 className="text-purple-600 text-xl font-semibold mb-2">{pgr.program_title}</h5>
                                                <p className="text-gray-500">{pgr.program_description}</p>
                                            </div>
                                        </details>
                                    </div>
                                ))
                            ) : (
                                <p className="w-full text-base text-gray-400">Programme non renseigné</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EtpFormationDetail;