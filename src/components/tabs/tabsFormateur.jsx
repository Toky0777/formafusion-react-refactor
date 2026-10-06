import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../config/axios";


export default function TabsFormateur() {
  const [activeTab, setActiveTab] = useState("actuel");
  const [counts, setCounts] = useState({ actuel: 0, ancien: 0 });

  // Charger les compteurs depuis l'API
  const fetchCounts = async () => {
    try {
      const response = await axios.get("/cfp/formateurs"); 
      if (response.data.status === 200) {
        setCounts({
          actuel: response.data.formateurs.filter(f => f.form_is_active === 0).length,
          ancien: response.data.formateurs.filter(f => f.form_is_active === 1).length,
        });
      } else {
        setCounts({ actuel: 0, ancien: 0 });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des compteurs :", error);
      setCounts({ actuel: 0, ancien: 0 });
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const tabs = [
    {
      key: "actuel",
      label: "Formateur Actuel",
      path: "/cfp/formateur",
    },
    {
      key: "ancien",
      label: "Formateur Ancien",
      path: "/cfp/formateur/ancien",
    },
  ];

  return (
    <div>
      <ul className="flex space-x-1 bg-gray-100 p-1 rounded-lg shadow-sm">
        {tabs.map((tab) => (
          <li key={tab.key}>
            <Link
              to={tab.path}
              onClick={() => setActiveTab(tab.key)}
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
                {counts[tab.key]}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
