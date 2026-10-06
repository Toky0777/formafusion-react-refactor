import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import LoadingSpinner from "../../ui/loading-spinner";
import { getTabLabel } from "../../../utils/searchUtils";
import { ContentRendererEtp } from "./ContentRenderEtp";

export const SearchContentEtp = ({ activeTab, searchQuery, searchData }) => {
  const [contentRoute, setContentRoute] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!activeTab || !searchData) return;

    const baseTabName = activeTab.split("-")[0];

    if (baseTabName === "project_with_client") {
      const index = parseInt(activeTab.split("-")[1], 10);
      const project = searchData.project_with_client?.[index];
      if (project) {
        setContentRoute(`client/${project.idEtp}`);
      }
    } else {
      const tabData = searchData[baseTabName];
      if (tabData && tabData.count > 0) {
        setContentRoute(baseTabName);
      }
    }
  }, [activeTab, searchData]);

  if (!activeTab) {
    return (
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <div className="py-12 text-center">
          <p className="text-gray-500">
            Sélectionnez un onglet pour voir les résultats
          </p>
        </div>
      </div>
    );
  }

  const baseTabName = activeTab.split("-")[0];
  let tabData = searchData[baseTabName];

  // cas spécial: project_with_client
  if (baseTabName === "project_with_client") {
    const index = parseInt(activeTab.split("-")[1], 10);
    tabData = searchData.project_with_client?.[index];
  }

  return (
    <div className="p-6 bg-white shadow-sm rounded-xl">
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner text="Chargement du contenu..." />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {getTabLabel(baseTabName)}
            </h2>
            <span className="text-sm text-gray-500">
              {tabData?.count || 0} résultat(s) trouvé(s)
            </span>
          </div>

          {error ? (
            <div className="py-8 text-center text-red-500">
              <p>Erreur: {error}</p>
              <button
                onClick={() => setError("")}
                className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Réessayer
              </button>
            </div>
          ) : tabData && tabData.count > 0 ? (
            <ContentRendererEtp
              activeTab={activeTab}
              items={tabData.items || []}
              idCfp={tabData.idCfp || null}
              searchQuery={searchQuery}
            />
          ) : (
            <div className="py-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg text-gray-500">Aucun résultat trouvé</p>
              <p className="mt-2 text-sm text-gray-400">
                Essayez avec d'autres termes de recherche
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
