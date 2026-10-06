
const FrequencyBadge = ({ display, frequency }) => {
  if (!display) return null;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold mb-2 shadow ${frequency.class}`}>
      <span className="truncate">{frequency.label}</span>
    </div>
  );
};

export default FrequencyBadge;