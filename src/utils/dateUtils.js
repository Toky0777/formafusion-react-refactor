export const getDateRange = (filter) => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    switch (filter) {
        case 'today':
            return {
                start: new Date(startOfToday),
                end: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000 - 1)
            };
        case 'thisWeek':
            const day = today.getDay();
            const diff = today.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(today.getFullYear(), today.getMonth(), diff);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            return { start: monday, end: sunday };
        case 'nextWeek':
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            const nextDay = nextWeek.getDay();
            const nextDiff = nextWeek.getDate() - nextDay + (nextDay === 0 ? -6 : 1);
            const nextMonday = new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextDiff);
            const nextSunday = new Date(nextMonday);
            nextSunday.setDate(nextMonday.getDate() + 6);
            return { start: nextMonday, end: nextSunday };
        case 'thisMonth':
            return {
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59)
            };
        case 'nextMonth':
            return {
                start: new Date(today.getFullYear(), today.getMonth() + 1, 1),
                end: new Date(today.getFullYear(), today.getMonth() + 2, 0, 23, 59, 59)
            };
        case 'next3Months':
            return {
                start: new Date(startOfToday),
                end: new Date(today.getFullYear(), today.getMonth() + 3, 0, 23, 59, 59)
            };
        default:
            return null;
    }
};

export const isDateInRange = (date, range) => {
    if (!range) return true;
    const checkDate = new Date(date);
    return checkDate >= range.start && checkDate <= range.end;
};

export const getDayColor = (dayOfWeek) => {
    const dayColors = [
        'bg-gradient-to-br from-red-400 to-red-600',      // Dimanche - Rouge
        'bg-gradient-to-br from-blue-400 to-blue-600',    // Lundi - Bleu  
        'bg-gradient-to-br from-green-400 to-green-600',  // Mardi - Vert
        'bg-gradient-to-br from-yellow-400 to-orange-500', // Mercredi - Orange
        'bg-gradient-to-br from-purple-400 to-purple-600', // Jeudi - Violet
        'bg-gradient-to-br from-pink-400 to-pink-600',    // Vendredi - Rose
        'bg-gradient-to-br from-indigo-400 to-indigo-600' // Samedi - Indigo
    ];
    return dayColors[dayOfWeek];
};