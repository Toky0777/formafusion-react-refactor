import { useState, useEffect } from 'react';
import axios from '../../../../config/axios';
import { IMAGE_URL } from "../../../../config/env";


const EtpParticipantDetail = ({ route }) => {
   
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
            const res = await axios.get(route);
            // console.log(res.data)
            if (res.data.module && res.data.apprenants) {
                const { module, apprenants, etps } = res.data;

                setModules(module); setSelectedApprenants(apprenants); setEntrePrise(etps);

            } else {
                setError("Données non trouvées !");
            }
        } catch (err) {
            console.warn("Failed to fetch apprenants:", err); // Log the actual error
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
        return <div className="text-center p-4 text-gray-800">Chargement des données...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center text-center p-4">
                <p className="text-red-600 mb-4">Une erreur s'est produite : {error}</p>
                <button
                    onClick={() => fetchApprenants()}
                    className="bg-purple-500 text-white w-28 rounded p-2 hover:bg-purple-600 transition"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (!selectedApprenants) {
        return (
            <div className="text-center p-4 text-gray-500">
                Auncun apprenant.
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
                                {modules.moduleName}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1">
                        <h3 className="text-xl font-bold text-gray-700">{modules.moduleName}</h3>
                        {modules.module_subtitle ? (
                            <p className="text-gray-700">{modules.module_subtitle}</p>
                        ) : (
                            <p className="text-gray-400 italic">Description non renseignée.</p>
                        )}


                    </div>
                   

                </div>
                 <h5 className='text-gray-800 mt-4 text-left font-bold'>
                        {entreprise?.[0]?.etp_name || "Nom de l'entreprise non disponible"}
                    </h5>
            </div>
            <div className="  w-full overflow-y-auto">
                <ul> {/* Removed id="all_employed" here */}
                    {selectedApprenants && selectedApprenants.length > 0 ? (
                        selectedApprenants.map((apprenant, index) => {
                            return (
                                <li className="pt-1 pb-0 sm:pt-2 pb-1 border-t" key={index}>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full">
                                                {apprenant.emp_photo ? (
                                                    <img
                                                        src={`${IMAGE_URL}/img/employes/${apprenant.emp_photo || 'default.png'}`}
                                                        alt={apprenant.name}
                                                    />
                                                ) : (
                                                    <span className="flex items-center rounded-full justify-center w-full h-full text-xl uppercase text-slate-600 bg-slate-200">
                                                        {apprenant.name ? apprenant.name.charAt(0) : 'A'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 ms-4">
                                            <span className="inline-flex items-center w-full justify-between mb-1">
                                                <p className="text-sm text-slate-600 line-clamp-2">
                                                    {apprenant.name || ''}
                                                </p>

                                                {apprenant.emargement === -1 && (
                                                    <span className="px-2 py-1 text-sm rounded-md bg-gray-500 text-white">
                                                        En attente d&apos;émargement
                                                    </span>
                                                )}

                                                {apprenant.emargement === 100 && (
                                                    <span className="px-2 py-1 text-sm rounded-md bg-green-500 text-white">
                                                        {apprenant.emargement.toFixed(2)}%
                                                    </span>
                                                )}

                                                {apprenant.emargement > 0 && apprenant.emargement < 100 && (
                                                    <span className="px-2 py-1 text-sm rounded-md bg-amber-500 text-white">
                                                        {apprenant.emargement.toFixed(2)}%
                                                    </span>
                                                )}

                                                {apprenant.emargement === 0 && (
                                                    <span className="px-2 py-1 text-sm rounded-md bg-red-500 text-white">
                                                        {apprenant.emargement.toFixed(2)}%
                                                    </span>
                                                )}
                                            </span>

                                            <span className="inline-flex items-start w-full justify-between">
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

export default EtpParticipantDetail;