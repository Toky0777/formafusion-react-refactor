import React from "react";
import { BarChart3 } from "lucide-react";
import { useLocation } from "react-router-dom";
import Search from "../search/search";

export const HomeNavBar = React.memo(function NavBarAccueil({
  onFilterChange,
  activeFilter,
  searchTerm,
  onChange,
  totalComplete,
  totalARemplir,
}) {
  const items = [
    { id: "complete", label: "Complété", count: totalComplete },
    { id: "a-remplir", label: "À remplir", count: totalARemplir },
  ];
  const location = useLocation();

  return (
    <div className="relative bg-white ">
      <div className="relative px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between w-full mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Présence
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Gestion des présences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            {location.pathname === "/cfp/presence" &&
              items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onFilterChange(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeFilter === item.id
                      ? "bg-white  shadow-sm "
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span>{item.label}</span>

                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full
      ${
        activeFilter === item.id
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-700"
      }`}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
          </div>
          {location.pathname === "/cfp/presence" && (
            <div>
              <Search
                placeholder="Recherche..."
                value={searchTerm}
                onChange={onChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
