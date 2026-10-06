import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { SearchTabs } from "../../../components/tabs/searchTabs";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { ErrorDisplay } from "../../../components/ui/error-display";
import { useSearchDataEtp } from "../../../hooks/etp/useSearchDataEtp";
import { SearchContentEtp } from "../../../components/content/search/searchContentEtp";

const SearchResultsEtp = ({ searchQuery }) => {
  const [activeTab, setActiveTab] = useState("");
  const [contentData, setContentData] = useState(null);

  const {
    searchData,
    loading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchDataEtp(searchQuery);

  useEffect(() => {
    if (searchData && !activeTab) {
      const firstAvailableTab = findFirstAvailableTab(searchData);
      if (firstAvailableTab) {
        setActiveTab(firstAvailableTab.id);
      }
    }
  }, [searchData, activeTab]);

  const findFirstAvailableTab = (data) => {
    for (const [key, value] of Object.entries(data)) {
      if (key !== "project_with_client" && value.count > 0) {
        return { id: key, route: value.route };
      }
    }

    if (data.project_with_client) {
      for (let i = 0; i < data.project_with_client.length; i++) {
        const project = data.project_with_client[i];
        if (project.count > 0) {
          return { id: `project_with_client-${i}`, route: project.route };
        }
      }
    }

    return null;
  };

  const handleTabChange = (tabId, route) => {
    setActiveTab(tabId);
    setContentData(null);
    // Load content will be handled by SearchContent component
  };

  // Loading state
  if (!searchData && searchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Chargement des résultats..." />
      </div>
    );
  }

  // Error state
  if (searchError && !searchData) {
    return (
      <ErrorDisplay
        title="Erreur de chargement"
        message={searchError}
        onRetry={refetchSearch}
      />
    );
  }

  if (!searchData) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Résultats de recherche
          </h1>
          <p className="text-gray-600">
            Recherche pour:{" "}
            <span className="font-semibold text-blue-600">"{searchQuery}"</span>
          </p>
          {searchError && (
            <div className="flex items-center p-3 mt-4 rounded-lg text-amber-800 bg-amber-100">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">{searchError}</span>
            </div>
          )}
        </div>

        {/* Search Tabs */}
        <SearchTabs
          searchData={searchData}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Search Content */}
        <SearchContentEtp
          activeTab={activeTab}
          searchQuery={searchQuery}
          searchData={searchData}
        />
      </div>
    </div>
  );
};

export default SearchResultsEtp;
