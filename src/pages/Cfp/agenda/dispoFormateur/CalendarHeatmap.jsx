import { useMemo } from 'react';

const CalendarDay = {
  date: new Date(),
  utilization: 0,
  isCurrentMonth: true,
  isHoliday: false,
  isNonWorkingDay: false,
  isAbsence: false,
};

const CalendarHeatmapProps = {
  year: 2025,
  data: "",
  holidays: new Set(),       // optionnel
  nonWorkingDays: new Set(), // optionnel
  absences: new Set(),       // optionnel
  onDayClick: (date) => console.log("Clicked:", date), // optionnel
};

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function getDayColor(day) {
  if (day.isHoliday) return 'bg-purple-200 border-2 border-purple-400';
  if (day.isAbsence) return 'bg-gray-400 border-2 border-gray-600';
  if (day.isNonWorkingDay) return 'bg-slate-100';

  const percentage = day.utilization;
  if (percentage === 0) return 'bg-green-100';
  if (percentage <= 20) return 'bg-green-200';
  if (percentage <= 40) return 'bg-yellow-200';
  if (percentage <= 60) return 'bg-yellow-300';
  if (percentage <= 80) return 'bg-orange-400';
  return 'bg-red-500';
}

function getMonthCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevMonthLastDay = new Date(year, month, 0);

  const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const daysInMonth = lastDay.getDate();
  const daysInPrevMonth = prevMonthLastDay.getDate();

  const calendar = [];

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    calendar.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      utilization: 0,
      isCurrentMonth: false,
      isHoliday: false,
      isNonWorkingDay: false,
      isAbsence: false
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendar.push({
      date: new Date(year, month, day),
      utilization: 0,
      isCurrentMonth: true,
      isHoliday: false,
      isNonWorkingDay: false,
      isAbsence: false
    });
  }

  const remainingDays = 42 - calendar.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendar.push({
      date: new Date(year, month + 1, day),
      utilization: 0,
      isCurrentMonth: false,
      isHoliday: false,
      isNonWorkingDay: false,
      isAbsence: false
    });
  }

  return calendar;
}

export function CalendarHeatmap({ year, data, holidays = new Set(), nonWorkingDays = new Set(), absences = new Set(), onDayClick }) {
  const months = useMemo(() => {
    return MONTHS.map((monthName, monthIndex) => {
      const calendar = getMonthCalendar(year, monthIndex);

      const calendarWithData = calendar.map(day => {
        const getLocalISODate = (date) => {
          const year = date.getFullYear();
          // Les mois de JavaScript sont basés sur zéro (0 = Janvier), donc on ajoute 1.
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');

          return `${year}-${month}-${day}`;
        };

        // ... et utilisez-la pour générer la clé :
        const dateKey = getLocalISODate(day.date);
        const dayOfWeek = day.date.getDay();
        const utilization = data.get(dateKey) || 0;

        return {
          ...day,
          utilization,
          isHoliday: holidays.has(dateKey),
          isNonWorkingDay: nonWorkingDays.has(dayOfWeek),
          isAbsence: absences.has(dateKey)
        };
      });

      return {
        name: monthName,
        calendar: calendarWithData
      };
    });
  }, [year, data, holidays, nonWorkingDays, absences]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 p-6">
      {months.map((month, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
            {month.name}
          </h3>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day, i) => (
              <div key={i} className="text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {month.calendar.map((day, i) => {
              const colorClass = day.isCurrentMonth
                ? getDayColor(day)
                : 'bg-gray-50';

              const getTitle = () => {
                const baseDate = day.date.toLocaleDateString('fr-FR');
                if (day.isHoliday) return `${baseDate}: Jour férié`;
                if (day.isAbsence) return `${baseDate}: Absence`;
                if (day.isNonWorkingDay) return `${baseDate}: Jour non travaillé`;
                return `${baseDate}: ${day.utilization.toFixed(1)}%`;
              };

              return (
                <div
                  key={i}
                  className={`aspect-square rounded ${colorClass} flex items-center justify-center text-xs transition-all hover:scale-110 hover:shadow-md cursor-pointer ${day.isCurrentMonth ? 'text-gray-700 font-medium' : 'text-gray-300'
                    }`}
                  title={getTitle()}
                  onClick={() => {
                    if (day.isCurrentMonth && onDayClick) {
                      onDayClick(day.date.toISOString().split('T')[0]);
                    }
                  }}
                >
                  {day.date.getDate()}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}