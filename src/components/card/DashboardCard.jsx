
export default function DashboardCard({ lastText, name, last, current }) {
  return (
    <div className="max-w-sm w-64 bg-white rounded-xl overflow-hidden mb-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-4">
        <h3 className="text-gray-700 text-sm font-semibold">{name}</h3>
        <div className="mt-2 flex justify-between items-center">
          <div className="text-gray-900 text-lg ">{current}</div>
        </div>
        <div className="mt-2 flex justify-between items-center text-gray-400">
          <div className="text-xs">{lastText}</div>
          <div className="text-sm">{last}</div>
        </div>
      </div>
    </div>
  );
}
