import { useMemo } from 'react';
import FormationsByDate from '../../date/FormationsByDate';
import Pagination from '../../Common/Pagination';
import PeriodFilters from './PeriodFilters';

const FormationList = ({
    formations,
    pagination,
    currentPage,
    setCurrentPage,
    selectedDateFilter,
    setSelectedDateFilter,
    setSelectedMonth,
    availablePeriods
}) => {
    // Regroupement par date
    const formationsByDate = useMemo(() => {
        const grouped = {};
        formations.forEach(formation => {
            // Create a unique key combining date, month, and year for proper grouping
            const dateKey = `${formation.day}/${formation.monthShort}/${formation.year}`;
            if (!grouped[dateKey]) {
                grouped[dateKey] = {
                    date: dateKey,
                    dateObj: formation.dateObj,
                    monthShort: formation.monthShort,
                    dayShort: formation.dayShort,
                    day: formation.day,
                    year: formation.year,
                    formations: []
                };
            }
            grouped[dateKey].formations.push(formation);
        });

        return Object.values(grouped).sort((a, b) => b.dateObj - a.dateObj);
    }, [formations]);

    const displayPeriods = (availablePeriods || []).map(period => ({
        key: period.key || period.value,
        label: period.label || period.name,
        count: period.count || period.formations_count || 0
    }));

    // Pagination
    const totalPages = pagination?.last_page || 1;
    const paginatedDates = formationsByDate;

    return (
        <>
            {/* En-tête */}
            <div className="mb-8">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Formations à venir</h2>
                <div className="w-20 h-1 rounded bg-gradient-to-r from-orange-400 to-yellow-400"></div>

                <PeriodFilters
                    availablePeriods={displayPeriods}
                    selectedDateFilter={selectedDateFilter}
                    setSelectedDateFilter={setSelectedDateFilter}
                    setSelectedMonth={setSelectedMonth}
                />
            </div>

            {/* Résultats */}
            <div className="mb-6">
                <p className="text-gray-600">
                    {pagination?.total || 0} formation{(pagination?.total || 0) > 1 ? 's' : ''} trouvée{(pagination?.total || 0) > 1 ? 's' : ''}
                </p>
            </div>

            {/* Formations groupées par date */}
            <FormationsByDate formationsByDate={paginatedDates} />

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </>
    );
};

export default FormationList;