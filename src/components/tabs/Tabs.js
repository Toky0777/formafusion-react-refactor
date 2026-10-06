import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "../../config/axios";
import { useStateContext } from "../../contexts/ContextcatalogProvider";
import { API_URL } from "../../config/env";

export default function Tabs() {
  const location = useLocation();
  const { counts, updateModuleCounts, token } = useStateContext();

  const [activeTab, setActiveTab] = useState("disponible");
  const [loading, setLoading] = useState(false);
  const [cachedModules, setCachedModules] = useState({});

  const statusMap = {
    disponible: 1,
    preparation: 0,
    corbeille: 2,
  };

  const fetchModules = async (tab) => {
    const status = statusMap[tab];

    if (cachedModules[status]) {
      setActiveTab(tab);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/cfp/modules/status/${status}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data || {};

      setCachedModules((prev) => ({
        ...prev,
        [status]: data.data || [],
      }));

      if (data?.counts && Object.keys(data.counts).length > 0) {
        updateModuleCounts(data.counts);
      }

    } catch (error) {
      console.error("Erreur lors du chargement des modules :", error);
    } finally {
      setActiveTab(tab);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules("disponible");
  }, []);

  useEffect(() => {
    if (location.pathname.includes("/cfp/catalogue/corbeille")) {
      fetchModules("corbeille");
    } else if (location.pathname.includes("/cfp/catalogue/preparation")) {
      fetchModules("preparation");
    } else {
      fetchModules("disponible");
    }
  }, [location.pathname]);

  return (
    <div>
      <ul className="flex space-x-1 bg-gray-100 p-1 rounded-lg shadow-sm">
        {[
          { 
            key: "disponible", 
            label: "Formations disponibles", 
            count: counts?.online || 0,
            path: "/cfp/catalogue"
          },
          { 
            key: "preparation", 
            label: "En préparation", 
            count: counts?.offline || 0,
            path: "/cfp/catalogue/preparation"
          },
          { 
            key: "corbeille", 
            label: "En corbeille", 
            count: counts?.trash || 0,
            path: "/cfp/catalogue/corbeille"
          },
        ].map((tab) => (
          <li key={tab.key}>
            <Link
              to={tab.path}
              onClick={(e) => {
                // Empêcher le rechargement si déjà sur le même onglet
                if (activeTab === tab.key) {
                  e.preventDefault();
                } else {
                  fetchModules(tab.key);
                }
              }}
              className={`flex items-center gap-2 px-3 py-1 rounded-xl border min-w-[120px] justify-center ${
                activeTab === tab.key
                  ? "bg-gray-400 text-white border-gray-400"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              } transition-colors duration-200`}
            >
              <span className="font-semibold text-[12px] whitespace-nowrap">
                {tab.label}
              </span>
              <div
                className={`flex items-center justify-center w-6 h-5 text-[12px] font-semibold border rounded-full ${
                  activeTab === tab.key
                    ? "bg-white text-blue-600 border-white"
                    : "bg-gray-200 text-gray-700 border-gray-300"
                }`}
              >
                {tab.count}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
