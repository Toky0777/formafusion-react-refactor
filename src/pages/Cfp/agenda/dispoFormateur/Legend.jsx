export function Legend() {
  const ranges = [
    { label: '0%', color: 'bg-green-100' },
    { label: '1-20%', color: 'bg-green-200' },
    { label: '21-40%', color: 'bg-yellow-200' },
    { label: '41-60%', color: 'bg-yellow-300' },
    { label: '61-80%', color: 'bg-orange-400' },
    { label: '81-100%', color: 'bg-red-500' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Taux d'utilisation
      </h3>
      <div className="flex flex-wrap gap-3">
        {ranges.map((range, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded ${range.color}`}></div>
            <span className="text-sm text-gray-600">{range.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}