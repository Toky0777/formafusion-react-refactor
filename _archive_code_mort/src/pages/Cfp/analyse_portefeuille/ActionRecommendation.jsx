
const ActionRecommendation = ({ display, action }) => {
  if (!display) return null;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-2 rounded border-l-2 border-yellow-500 mb-3">
      <div className="text-[10px] font-bold text-yellow-800 mb-0.5 uppercase tracking-wider truncate">
        {action.title}
      </div>
      <div className="text-[10px] text-yellow-800 leading-tight line-clamp-2">
        {action.text}
      </div>
    </div>
  );
};

export default ActionRecommendation;