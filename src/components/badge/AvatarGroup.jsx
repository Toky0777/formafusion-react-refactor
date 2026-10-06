import { IMAGE_URL } from "../../config/env";
export const AvatarGroup = ({ items, onClick, type = "learner" }) => {
  const maxVisible = 4;
  const visibleItems = items.slice(0, maxVisible);
  const remainingCount = items.length - maxVisible;

  const getImageUrl = (item) => {
    const baseUrl =
      `${IMAGE_URL}/img`;
    if (type === "learner") {
      return item.emp_photo ? `${baseUrl}/employes/${item.emp_photo}` : null;
    } else if (type === "trainer") {
      return item.form_photo
        ? `${baseUrl}/formateurs/${item.form_photo}`
        : null;
    }
    return null;
  };

  const getInitials = (item) => {
    if (type === "learner") {
      return item.emp_name?.charAt(0)?.toUpperCase() || "?";
    } else if (type === "trainer") {
      return item.form_name?.charAt(0)?.toUpperCase() || "?";
    }
    return "?";
  };

  return (
    <div className="flex -space-x-2 cursor-pointer group" onClick={onClick}>
      {visibleItems.map((item, idx) => (
        <div key={item.id || item.idFormateur || idx} className="relative">
          {getImageUrl(item) ? (
            <img
              src={getImageUrl(item)}
              alt={item.emp_name || item.form_name}
              className="w-8 h-8 border-2 border-white rounded-full shadow-sm object-cover bg-gray-100 transition-transform group-hover:scale-110"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`${
              getImageUrl(item) ? "hidden" : "flex"
            } w-8 h-8 border-2 border-white rounded-full shadow-sm bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700 text-sm font-semibold items-center justify-center transition-transform group-hover:scale-110`}
          >
            {getInitials(item)}
          </div>
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm transition-transform group-hover:scale-110">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
