import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../../../../contexts/AuthContext';
import { API_URL, IMAGE_URL } from "../../../../config/env";

const API_BASE_URL = API_URL;

const Sessions = ({ route }) => {
    const auth = useAuth();
    const [sessionsByDate, setSessionsByDate] = useState({});
    const [dates, setDates] = useState([]);
    const [module, setModule] = useState(null);
    const [totalHours, setTotalHours] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // State to store error messages

    // If Sessions is a drawer component, its visibility should be controlled by a parent.
    // Assuming it's meant to be rendered when 'route' is available.
    // const [showDrawer, setShowDrawer] = useState(false); // Consider if truly needed here

    useEffect(() => {
        if (route) {
            fetchSessions();
        }
    }, [route]);

    const fetchSessions = async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const res = await axios.get(route, {
                baseURL: API_BASE_URL,
                headers: { Authorization: `Bearer ${auth.token}` }
            });


            if (res.data.sessions && res.data.module && res.data.totalSessionHours) {
                const { sessions, module, totalSessionHours } = res.data;

                setModule(module);
                setTotalHours(totalSessionHours.sumHourSession);

                const organised = {};
                const uniqueDatesSet = new Set(); // Use Set for efficiency

                sessions.forEach((session) => {
                    uniqueDatesSet.add(session.dateSeance);
                    if (!organised[session.dateSeance]) {
                        organised[session.dateSeance] = { morning: [], afternoon: [] };
                    }
                    const hour = parseInt(session.heureDebut.split(":")[0], 10);
                    if (hour < 12) {
                        organised[session.dateSeance].morning.push(session);
                    } else {
                        organised[session.dateSeance].afternoon.push(session);
                    }
                });

                // Convert Set to Array and sort dates for consistent display
                setDates(Array.from(uniqueDatesSet).sort());
                setSessionsByDate(organised);
                // setShowDrawer(true); // If this component itself controls the drawer state
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

    // Date formatter utility (can be moved outside or to a helper file)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    if (loading) {
        return <div className="p-4 text-center text-gray-800">Chargement des sessions...</div>; // Improved loading message
    }

    if (error) {
        return <div className="p-4 text-center text-red-600">
            {error && (<div className="flex flex-col items-center justify-center p-4 text-center text-gray-500">
                <p className="text-sm text-gray-500">Erreur: {error}</p>
                <button className='p-1 text-white bg-purple-600 ' onClick={() => { fetchSessions() }} >Actualiser</button> </div>)}</div>; // Display error message
    }



    return (
        <>
            <div className="relative flex flex-col w-full">
                <div className="p-1">
                    {/* Header module */}
                    <div className="w-full p-3 mb-4 rounded-2xl bg-gray-50">
                        <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center">
                            <div className="w-[100px] h-[70px] rounded-xl p-1 bg-gray-100 flex items-center justify-center overflow-hidden">
                                {module?.module_image ? (
                                    <img
                                        src={`${IMAGE_URL}/img/modules/${module.module_image}`}
                                        alt={`Image du module ${module?.moduleName}`}
                                        className="object-cover w-full h-full rounded-xl"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-xl text-gray-500 uppercase">
                                        {module?.moduleName ? module.moduleName[0] : ''}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-start justify-start gap-1">
                                <h3 className="text-xl font-bold text-gray-700">{module?.moduleName || 'Nom du module'}</h3>
                                <p className="text-sm text-gray-500">{module?.module_subtitle || "Pas de sous-titre"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total heures */}
                    <div className="mb-4">
                        <p className="font-semibold text-left text-gray-900">
                            {totalHours > 0 ? `Nombres d'heures : ${totalHours}` : `Pas de session planifiée`}
                        </p>
                    </div>

                    {/* Table des sessions */}
                    <div className="overflow-x-auto">
                        {dates.length > 0 ? (
                            <table className="w-full text-sm table-auto">
                                <thead>
                                    <tr className="text-left text-gray-600 bg-gray-100">
                                        <th className="p-2">Date</th>
                                        <th className="p-2 text-center">Matin</th>
                                        <th className="p-2 text-center">Après-midi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dates.map((date) => {
                                        const morning = sessionsByDate[date]?.morning || [];
                                        const afternoon = sessionsByDate[date]?.afternoon || [];
                                        return (
                                            <tr key={date} className="border-t">
                                                <td className="p-2 text-left text-gray-700">{formatDate(date)}</td>
                                                <td className="p-2 text-center text-gray-500">
                                                    {morning.length > 0
                                                        ? morning.map((s) => (
                                                            <div key={s.id || `${date}-morning-${s.heureDebut}`}> {/* Use unique ID if available */}
                                                                {`${s.heureDebut} - ${s.heureFin}`}
                                                            </div>
                                                        ))
                                                        : "--"}
                                                </td>
                                                <td className="p-2 text-center text-gray-500">
                                                    {afternoon.length > 0
                                                        ? afternoon.map((s) => (
                                                            <div key={s.id || `${date}-afternoon-${s.heureDebut}`}> {/* Use unique ID if available */}
                                                                {`${s.heureDebut} - ${s.heureFin}`}
                                                            </div>
                                                        ))
                                                        : "--"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p className="p-4 text-center text-gray-500">Aucune session trouvée pour ce module.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sessions;