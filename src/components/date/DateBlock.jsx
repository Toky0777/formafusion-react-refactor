import { getDayColor } from '../../utils/dateUtils';

const DateBlock = ({ dateGroup }) => {
    const date = new Date(dateGroup.dateObj);
    return (
        <div className="sticky z-20 mb-6 top-20">
            <div className={`${getDayColor(date.getDay())} text-white rounded-lg w-20 h-28 flex flex-col items-center justify-center shadow-lg`}>
                <div className="text-xs font-semibold uppercase">
                    {dateGroup.monthShort}
                </div>
                <div className="text-xl font-bold">
                    {dateGroup.day}
                </div>
                <div className="text-xs font-medium opacity-90">
                    {dateGroup.dayShort}
                </div>
                <div className="mt-1 text-xs font-semibold opacity-80">
                    {dateGroup.year}
                </div>
            </div>
        </div>
    );
};

export default DateBlock;