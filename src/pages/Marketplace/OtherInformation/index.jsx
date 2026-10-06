import { useState, useEffect } from "react";
import { IMAGE_URL } from "../../../config/env";

export default function DocumentationTabs({ customerId }) {
  // États pour gérer les données, le chargement et les erreurs
  const [sections, setSections] = useState({});
  const [imgOrg, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("reglement");

  // Les onglets disponibles
  const tabs = [
    { id: "reglement", label: "Règlement" },
    { id: "accueil", label: "Livret" },
    { id: "conditions", label: "Conditions de Ventes" },
    { id: "acces", label: "Accès" },
    { id: "accompagnement", label: "Suivi et accompagnement" },
    { id: "organigramme", label: "Organigramme" },
  ];

  // Récupération des données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      if (!customerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const API_URL = `${API_URL}/marketplace/getAutre/${customerId}`;
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la récupération des données: ${response.status}`
          );
        }

        const data = await response.json();
        setSections(data.sections || {});

        setImage(data.img_org || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  // Fonction pour changer d'onglet
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Rendre le contenu d'une section spécifique
  const renderSectionContent = (sectionName) => {
    if (sectionName === "organigramme") {
      return (
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">Organigramme</h2>
          <div className="flex items-start gap-4 p-3 rounded-lg shadow-md bg-gray-50">
            {imgOrg ? (
              <img
                src={`${IMAGE_URL}/${imgOrg.path}`}
                alt="Organigramme"
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <p>Aucune information disponible.</p>
            )}
          </div>
        </div>
      );
    }

    const sectionData = sections[sectionName] || "";

    return (
      <div className="space-y-3 group/right">
        <div className="inline-flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}
          </h2>
        </div>
        <div className="flex items-start w-full gap-4 p-3 rounded-lg shadow-md bg-gray-50">
          {sectionData ? (
            <p className="text-gray-800 whitespace-pre-line">{sectionData}</p>
          ) : (
            <p>Aucune information disponible.</p>
          )}
        </div>
      </div>
    );
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-t-2 border-b-2 border-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-red-600">Une erreur est survenue: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 mt-2 text-red-700 bg-red-100 rounded hover:bg-red-200"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg shadow-lg">
      {/* Barre de navigation */}
      <nav className="flex overflow-x-auto border-b bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${activeTab === tab.id
                ? "text-purple-600 border-b-2 border-purple-600 bg-white"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Contenu */}
      <div className="p-6 bg-white">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? "animate-fadeIn" : "hidden"}
          >
            {renderSectionContent(tab.id)}
          </div>
        ))}
      </div>
    </div>
  );
}
