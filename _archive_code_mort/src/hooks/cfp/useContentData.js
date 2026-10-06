import { useState, useEffect } from 'react';

export const useContentData = (route, searchQuery) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTabContent = (route, searchQuery) => {
    return { route, key: searchQuery };
  };

  const fetchContent = async () => {
    if (!route || !searchQuery) return;

    setLoading(true);
    setError(null);

    try {
      const contentData = fetchTabContent(route, searchQuery);
      setData(contentData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du contenu';
      setError(errorMessage);
      setData({ items: [] }); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [route, searchQuery]);

  return {
    data,
    loading,
    error,
    refetch: fetchContent
  };
};