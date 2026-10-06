
const KPISection = ({ display, client }) => {
  if (!display) return null;
console.log(client)
  return (
    <div className="mb-3">
      <div className="grid grid-cols-2 gap-2 mb-2">
        <KPIBox 
          label="CA 2025"
          value={client.ca2025}
          evolution={client.caEvolution}
        />
        <KPIBox 
          label="Apprenants"
          value={client.learners}
          evolution={client.learnersEvolution}
        />
      </div>
    </div>
  );
};

 const formatNumber = (number) => {
  let numStr = String(number).replace(/\s/g, "");
  if (!/^\d+$/.test(numStr)) {
    return number;
  }
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const KPIBox = ({ label, value, evolution }) => (
  <div className="bg-gray-50 p-2 rounded-lg border-l-2 border-[#667eea]">
    <div className="text-[9px] text-gray-600 uppercase tracking-wider mb-1 font-semibold truncate">
      {label}
    </div>
    <div className="text-base  text-gray-800 flex items-center gap-1">
      <span className="truncate">{formatNumber(value)}</span>
      <EvolutionBadge evolution={evolution} />
    </div>
  </div>
);

const EvolutionBadge = ({ evolution }) => (
  <span className={`text-[10px] font-semibold px-1 py-0.5 rounded flex items-center gap-0.5 shrink-0 ${
    evolution >= 0 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }`}>
    {evolution >= 0 ? '↑' : '↓'} {Math.abs(evolution)}%
  </span>
);

export default KPISection;