import { useState, useEffect } from 'react';
import { searchService } from '../../services/searchService';

export const useSearchData = (searchQuery) => {
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchResults = async () => {
    if (!searchQuery) return;

    setLoading(true);
    setError(null);

    try {
      const data = await searchService.searchGenerality(searchQuery);

      const normalized = {
          project: { count: data.project, label: "project" },
          trainer: { count: data.trainer, label: "trainer" },
          entreprise: { count: data.entreprise, label: "entreprise" },
          learner: { count: data.learner, label: "learner" },
          referent: { count: data.referent, label: "referent" },
          referent_customer: { count: data.referent_customer, label: "referent_customer" },
          project_reference: { count: data.project_reference, label: "project_reference" },
          projectNeighborhood: { count: data.projectNeighborhood, label: "projectNeighborhood" },
          projectPlace: { count: data.projectPlace, label: "projectCity" },
          projectCity: { count: data.projectCity, label: "projectPlace" },
          folder: { count: data.folder, label: "folder" },
          course: { count: data.course, label: "course" },
          invoice: { count: data.invoice, label: "invoice" },
          quote: { count: data.quote, label: "quote" },
          purchase_order: {count: data.purchase_order, label: "purchase_order"},
          particulars: {count: data.particulars, label: "particulars"},
          project_with_client: data.project_with_client.map((p, i) => ({
            id: i,
            label: p.type,
            count: p.count,
            idEtp: p.idEtp,
          })),
        };
      setSearchData(normalized);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des résultats';
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
    refetch: fetchSearchResults
  };
};