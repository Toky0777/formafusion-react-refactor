
export const TabButton = ({ label = "", icon, count, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
        isActive
          ? "bg-blue-500 text-white shadow-lg"
          : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label ? label.split(" ")[0] : ""}</span>
      <span className="px-2 py-1 text-xs bg-white rounded-full bg-opacity-20">
        {count}
      </span>
    </button>
  );
};
