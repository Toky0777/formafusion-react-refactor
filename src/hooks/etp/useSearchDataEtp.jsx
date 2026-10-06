import { useState, useEffect } from "react";
import { searchService } from "../../services/searchService";

export const useSearchDataEtp = (searchQuery) => {
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchResults = async () => {
    if (!searchQuery) return;

    setLoading(true);
    setError(null);

    try {
      const data = await searchService.searchGeneralityEtp(searchQuery);

      const normalized = {
        project: { count: data.project, label: "Projets" },
        cfp: { count: data.cfp, label: "Centre de formation" },
        employee: { count: data.employee, label: "Employés" },
        referent: { count: data.referent, label: "Référents" },
        project_with_client: data.project_with_client.map((p, i) => ({
          id: i,
          label: p.type,
          count: p.count,
          idCfp: p.idCfp,
        })),
      };
      setSearchData(normalized);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des résultats";
      setError(errorMessage);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery]);

  return {
    searchData,
    loading,
    error,
    refetch: fetchSearchResults,
  };
};
