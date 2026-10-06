import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useStateContext } from "../../Context/ContextProvider";

const AppIcon = ({ iconUrl, label, colorClass, theme }) => (
  <div
    className={`w-10 h-10 flex items-center justify-center rounded-xl ${colorClass} mb-2 transition-all hover:shadow-lg`}
  >
    {iconUrl ? (
      <img
        src={iconUrl}
        alt={label}
        className="w-8 h-8 object-contain"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            label
          )}&background=${
            theme === "dark" ? "4B5563" : "E5E7EB"
          }&color=${theme === "dark" ? "E5E7EB" : "4B5563"}`;
        }}
      />
    ) : (
      <span className="text-white text-lg font-bold">
        {label.charAt(0).toUpperCase()}
      </span>
    )}
  </div>
);

const AppLauncherGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const { api_base_url } = useStateContext()

  const categoryConfig = {
    'PÉDAGOGIE': {
      colorClass: 'bg-blue-500 hover:bg-blue-600',
      bgClass: 'bg-blue-50 dark:bg-blue-900/20',
      textClass: 'text-blue-700 dark:text-blue-200'
    },
    'ADMINISTRATION': {
      colorClass: 'bg-green-500 hover:bg-green-600',
      bgClass: 'bg-green-50 dark:bg-green-900/20',
      textClass: 'text-green-700 dark:text-green-200'
    },
    'LOGISTIQUE': {
      colorClass: 'bg-purple-500 hover:bg-purple-600',
      bgClass: 'bg-purple-50 dark:bg-purple-900/20',
      textClass: 'text-purple-700 dark:text-purple-200'
    },
    'ANALYTICS & ÉVALUATION': {
      colorClass: 'bg-orange-500 hover:bg-orange-600',
      bgClass: 'bg-orange-50 dark:bg-orange-900/20',
      textClass: 'text-orange-700 dark:text-orange-200'
    },
    'AUTRES': {
      colorClass: 'bg-gray-500 hover:bg-gray-600',
      bgClass: 'bg-gray-50 dark:bg-gray-700/20',
      textClass: 'text-gray-700 dark:text-gray-200'
    }
  };

  useEffect(() => {
    const fetchAppLaunchers = async () => {
      try {
        const response = await axios.get(`${api_base_url}app_launcher`);
        if (!response.data) throw new Error("Aucune donnée reçue de l'API");
        
        const responseData = response.data.data || [];
        if (!Array.isArray(responseData)) throw new Error("Format de données invalide");

        const formattedCategories = responseData.map(category => {
          const config = categoryConfig[category.name] || categoryConfig['AUTRES'];
          
          return {
            name: category.name,
            bgClass: config.bgClass,
            textClass: config.textClass,
            items: category.items.map(item => ({
              id: `${item.label}-${item.link}`,
              label: item.label,
              href: item.link,
              icon: item.icone 
                ? `https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/${item.icone}`
                : null,
              colorClass: config.colorClass,
            }))
          };
        });

        setCategories(formattedCategories);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError(err.message || "Erreur lors du chargement des applications");
      } finally {
        setLoading(false);
      }
    };

    fetchAppLaunchers();
  }, []);

  const filteredCategories = categories
    .map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )}))
    .filter(category => category.items.length > 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-purple-500"></div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Chargement des applications...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/30">
        <p className="text-red-600 dark:text-red-400 font-medium text-sm">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1.5 text-xs bg-red-100 dark:bg-red-800/50 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mt-4 p-4">
      <div className="space-y-8">
        <AnimatePresence>
          {filteredCategories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-gray-500 dark:text-gray-400"
            >
              {searchQuery
                ? `Aucune application trouvée pour "${searchQuery}"`
                : "Aucune application disponible."}
            </motion.div>
          ) : (
            filteredCategories.map((category) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className={`px-4 py-3 rounded-lg sticky top-16 z-10${category.bgClass}`}>
                  <h3 className={`text-xs text-center font-semibold -mt-12 ${category.textClass}`}>
                    {category.name}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-6 -mt-5">
                  {category.items.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        setSelectedApp(item.id);
                        if (item.href) {
                          window.open(item.href, "_blank", "noopener,noreferrer");
                        }
                      }}
                      whileHover={{ y: -4, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center p-4 rounded-xl transition-all -mt-12 ${
                        selectedApp === item.id
                          ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 shadow-xs"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <AppIcon
                        iconUrl={item.icon}
                        label={item.label}
                        colorClass={item.colorClass}
                      />
                   <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center -mt-1">
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppLauncherGrid;