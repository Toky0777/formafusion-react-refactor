import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../contexts/AuthContext';
import { API_URL, IMAGE_URL } from "../../../../config/env";;

const ParticipantDetail = ({ route }) => {
    const auth = useAuth();
    const [modules, setModules] = useState({});
    const [selectedApprenants, setSelectedApprenants] = useState([]);
    const [entreprise, setEntrePrise] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (route) {
            fetchApprenants();
        }
    }, [route]);

    const fetchApprenants = async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const res = await axios.get(route, {
                baseURL: API_URL,
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            // console.log(res.data)

            if (res.data.module && res.data.apprenants) {
                const { module, apprenants, etps } = res.data;

                setModules(module); setSelectedApprenants(apprenants); setEntrePrise(etps);

            } else {
                setError("Données non trouvées !");
            }
        } catch (err) {
            console.error("Failed to fetch apprenants:", err); // Log the actual error
            setError("Échec de la récupération des apprenants. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    // getCompetence
    function getCompetenceLevel(level) {
        switch (level) {
            case 5:
                return 'h-[100%]';
            case 4:
                return 'h-[80%]';
            case 3:
                return 'h-[60%]';
            case 2:
                return 'h-[40%]';
            case 1:
                return 'h-[20%]';
            default:
                return 'h-[0%]';
        }
    }

    if (loading) {
        return <div className="p-4 text-center text-gray-800">Chargement des données...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-4 text-center">
                <p className="mb-4 text-red-600">Une erreur s'est produite : {error}</p>
                <button
                    // onClick={() => fetchModules()}
                    className="p-2 text-white transition bg-purple-500 rounded w-28 hover:bg-purple-600"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (!selectedApprenants) {
        return (
            <div className="p-4 text-center text-gray-500">
                Auncun apprenant.
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
                                {modules.moduleName}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1">
                        <h3 className="text-xl font-bold text-gray-600">{modules.moduleName}</h3>
                        {modules.module_subtitle ? (
                            <p className="text-gray-700">{modules.module_subtitle}</p>
                        ) : (
                            <p className="italic text-gray-400">Description non renseignée.</p>
                        )}


                    </div>


                </div>
                <h5 className='mt-4 font-bold text-left text-gray-800'>
                    {entreprise?.[0]?.etp_name || "Nom de l'entreprise non disponible"}
                </h5>
            </div>
            <div className="w-full overflow-y-auto ">
                <ul> {/* Removed id="all_employed" here */}
                    {selectedApprenants && selectedApprenants.length > 0 ? (
                        selectedApprenants.map((apprenant, index) => {
                            return (
                                <li className="pt-1 pb-0 pb-1 border-t sm:pt-2" key={index}>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full">
                                                {apprenant.emp_photo ? (
                                                    <img
                                                        src={`${IMAGE_URL}/img/employes/${apprenant.emp_photo || 'default.png'}`}
                                                        alt={apprenant.name}
                                                    />
                                                ) : (
                                                    <span className="flex items-center justify-center w-full h-full text-xl uppercase rounded-full text-slate-600 bg-slate-200">
                                                        {apprenant.name ? apprenant.name.charAt(0) : 'A'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 ms-4">
                                            <span className="inline-flex items-center justify-between w-full mb-1">
                                                <p className="text-sm text-slate-600 line-clamp-2">
                                                    {apprenant.name || ''}
                                                </p>

                                                {apprenant.emargement === -1 && (
                                                    <span className="px-2 py-1 text-sm text-white bg-gray-500 rounded-md">
                                                        En attente d&apos;émargement
                                                    </span>
                                                )}

                                                {apprenant.emargement === 100 && (
                                                    <span className="px-2 py-1 text-sm text-white bg-green-500 rounded-md">
                                                        {apprenant.emargement.toFixed(2)}%
                                                    </span>
                                                )}

                                                {apprenant.emargement > 0 && apprenant.emargement < 100 && (
                                                    <span className="px-2 py-1 text-sm text-white rounded-md bg-amber-500">
                                                        {apprenant.emargement.toFixed(2)}%
                                                    </span>
                                                )}

                                                {apprenant.emargement === 0 && (
                                                    <span className="px-2 py-1 text-sm text-white bg-red-500 rounded-md">
                                                        {apprenant.emargement.toFixed(2)}%
                                                    </span>
                                                )}
                                            </span>

                                            <span className="inline-flex items-start justify-between w-full">
                                                <p className="text-sm text-slate-600 line-clamp-1">
                                                    {apprenant.firstName || ''}
                                                </p>

                                                <div className="inline-flex items-start gap-2">
                                                    <span className="px-2 py-1 h-[35px] w-[27px] border border-gray-50 rounded-md text-sm  flex items-start justify-start text-gray-800 relative">
                                                        {apprenant.avg_before || 0}
                                                        <span
                                                            className={`${getCompetenceLevel(apprenant.avg_before || 0)} w-[27px] bg-gray-700/50 z-[-1] absolute rounded-md bottom-0`}
                                                        ></span>
                                                    </span>

                                                    <span className="px-2 py-1 h-[35px] w-[27px] border border-gray-50 rounded-md text-sm  flex items-start justify-start text-gray-800 relative">
                                                        {apprenant.avg_after || 0}
                                                        <span
                                                            className={`${getCompetenceLevel(apprenant.avg_after || 0)} w-[27px] bg-purple-600/50 z-[-1] absolute rounded-md bottom-0`}
                                                        ></span>
                                                    </span>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <li className="text-right">

                            <p>Aucun apprenant sélectionné</p>

                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ParticipantDetail;