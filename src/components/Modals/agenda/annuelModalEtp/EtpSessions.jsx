import { useEffect, useState } from "react";
import axios from "../../../../config/axios";
import { IMAGE_URL } from "../../../../config/env";





const EtpSessions = ({ route }) => {
   
    const [sessionsByDate, setSessionsByDate] = useState({});
    const [dates, setDates] = useState([]);
    const [module, setModule] = useState(null); 
    const [totalHours, setTotalHours] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // State to store error messages

    useEffect(() => {
        if (route) {
            fetchSessions();
        }
    }, [route]);

    const fetchSessions = async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const res = await  axios.get(route);


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
            console.warn("Failed to fetch sessions:", err); // Log the actual error
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
        return <div className="text-center p-4 text-gray-800">Chargement des sessions...</div>; // Improved loading message
    }

    if (error) {
        return  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-4 text-red-600">
        <p className="text-xl font-semibold">{error}</p>
        <button
          onClick={fetchSessions()}
          className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
        >
          Actualiser
        </button>
      </div>
    }

    

    return (
        <>
            <div className="flex flex-col w-full relative">
                <div className="p-1">
                    {/* Header module */}
                    <div className="w-full rounded-2xl p-3 bg-gray-50 mb-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
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
                            <div className="flex flex-col justify-start items-start gap-1">
                                <h3 className="text-xl font-bold text-gray-700">{module?.moduleName || 'Nom du module'}</h3>
                                <p className="text-sm text-gray-500">{module?.module_subtitle || "Pas de sous-titre"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total heures */}
                    <div className="mb-4">
                        <p className="text-left font-semibold text-gray-900">
                            {totalHours > 0 ? `Nombres d'heures : ${totalHours}` : `Pas de session planifiée`}
                        </p>
                    </div>

                    {/* Table des sessions */}
                    <div className="overflow-x-auto">
                        {dates.length > 0 ? (
                            <table className="w-full table-auto text-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 text-left">
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
                                                <td className="p-2 text-gray-700 text-left">{formatDate(date)}</td>
                                                <td className="p-2 text-gray-500 text-center">
                                                    {morning.length > 0
                                                        ? morning.map((s) => (
                                                            <div key={s.id || `${date}-morning-${s.heureDebut}`}> {/* Use unique ID if available */}
                                                                {`${s.heureDebut} - ${s.heureFin}`}
                                                            </div>
                                                        ))
                                                        : "--"}
                                                </td>
                                                <td className="p-2 text-gray-500 text-center">
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
                            <p className="text-center text-gray-500 p-4">Aucune session trouvée pour ce module.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EtpSessions;