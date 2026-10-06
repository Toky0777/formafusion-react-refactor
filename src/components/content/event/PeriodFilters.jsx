import { useEffect, useState } from 'react';
import { eventService } from '../../../services/eventService';

const PeriodFilters = ({
    selectedDateFilter,
    setSelectedDateFilter,
    setSelectedMonth
}) => {
    const [availablePeriods, setAvailablePeriods] = useState([]);
    const [loadingPeriods, setLoadingPeriods] = useState(true);

    // Labels personnalisés pour chaque clé
    const periodLabels = {
        today: "Aujourd'hui",
        this_week: "Cette semaine",
        this_month: "Ce mois-ci",
        next_month: "Mois prochain",
        next_three_month: "Prochains 3 mois"
    };

    const handlePeriodClick = (key) => {
        setSelectedDateFilter(selectedDateFilter === key ? '' : key);
        setSelectedMonth('');
    };

    useEffect(() => {
        const fetchPeriods = async () => {
            setLoadingPeriods(true);
            const result = await eventService.getAllPeriodsEvent();

            if (result.data && typeof result.data === 'object') {
                const periods = Object.entries(result.data).map(([key, value]) => ({
                    key,
                    label: periodLabels[key] || key,
                    count: value
                }));
                setAvailablePeriods(periods);
            }

            setLoadingPeriods(false);
        };

        fetchPeriods();
    }, []);

    return (
        <div className="flex flex-wrap gap-2 mt-4">
            {availablePeriods.map(({ key, label, count }) => (
                <button
                    key={key}
                    onClick={() => handlePeriodClick(key)}
                    className={`
                        px-3 py-1 text-xs rounded-full border transition-all duration-200
                        ${selectedDateFilter === key
                            ? 'bg-blue-100 text-blue-800 border-blue-300 font-medium'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                        }
                    `}
                >
                    {label} ({count})
                </button>
            ))}

            {selectedDateFilter && (
                <button
                    onClick={() => setSelectedDateFilter('')}
                    className="px-2 py-1 text-xs text-gray-400 hover:text-gray-600"
                >
                    ✕ Effacer
                </button>
            )}
        </div>
    );
};

export default PeriodFilters;
