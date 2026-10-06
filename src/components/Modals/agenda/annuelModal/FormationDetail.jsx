import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../contexts/AuthContext';
import { API_URL, IMAGE_URL } from "../../../../config/env";

const FormationDetail = ({ route }) => {
    const auth = useAuth();
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
            const res = await axios.get(route, {
                baseURL: API_URL,
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            if (res.data.module && res.data.objectifs && res.data.programmes) {
                const { module, objectifs, programmes } = res.data;

                setModules(module); setObjectis(objectifs); setProgrammes(programmes);

            } else {
                setError("Données non trouvées !");
            }
        } catch (err) {
            console.error("Failed to fetch sessions:", err); // Log the actual error
            setError("Échec de la récupération des sessions. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <div className="p-4 text-center text-gray-800">Chargement des données...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-4 text-center">
                <p className="mb-4 text-red-600">Une erreur s'est produite : {error}</p>
                <button
                    onClick={() => fetchModules()}
                    className="p-2 text-white transition bg-purple-500 rounded w-28 hover:bg-purple-600"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (!modules) {
        return (
            <div className="p-4 text-center text-gray-500">
                Module non disponible.
            </div>
        );
    }


    return (
        <div className="relative flex flex-col w-full h-full p-2">
            <div className="relative w-full">
                <div className="flex items-start justify-start w-full gap-1">
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
                    <div className="flex flex-col items-start gap-2">
                        <h3 className="text-xl font-bold text-gray-700">{modules.moduleName}</h3>
                        {modules.module_subtitle ? (
                            <p className="text-gray-700">{modules.module_subtitle}</p>
                        ) : (
                            <p className="italic text-gray-400">Description non renseignée.</p>
                        )}
                    </div>

                </div>
            </div>
            <div className="w-full text-left flex flex-col mt-[50px] gap-y-3 p-2 overflow-y-auto">
                <p className="text-gray-600">
                    Participants : min {modules.minApprenant ?? "?"} / max{" "}
                    {modules.maxApprenant ?? "?"}
                </p>

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
                    <div className="flex justify-start gap-2 aligns-center">

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
                            <ul className="flex flex-col w-full gap-y-1">
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
                                            <summary className="px-4 py-2 font-medium text-purple-800 bg-purple-100 cursor-pointer hover:bg-purple-200">
                                                Module {index + 1}
                                            </summary>
                                            <div className="p-4 bg-white border-t">
                                                <h5 className="mb-2 text-xl font-semibold text-purple-600">{pgr.program_title}</h5>
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

export default FormationDetail;