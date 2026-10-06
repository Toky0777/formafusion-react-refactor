// useProjectData.js
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "../config/axios";

export const useProjectData = (status, selectedEntreprises,
    selectedFinancements,
    selectedTypes,
    selectedModules,
    selectedVilles,
    selectedPeriodes,
    selectedFormateur,
    key) => {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);

  const fetchProjetsByStatus = async (pageToLoad = 1, newStatus = status) => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/cfp/projets/getProjectByStatus/status",
        {
          params: {
            status: newStatus,
            page: pageToLoad,
            etp_ids: selectedEntreprises,
            types: selectedTypes,
            financial: selectedFinancements,
            course_ids: selectedModules,
            city_ids: selectedVilles,
            periodes: selectedPeriodes,
            trainer_ids: selectedFormateur,
            key: key
          },
        }
      );

      const data = response.data.projets;

      if (pageToLoad === 1) {
        setProjets(data.data || []);
      } else {
        setProjets((prev) => [...prev, ...data.data]);
      }

      setLastPage(data.last_page);
      setHasMore(pageToLoad < data.last_page);
    } catch (error) {
      console.error("Erreur fetch:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loading, hasMore, loadMore]);

  useEffect(() => {
    setPage(1);
    fetchProjetsByStatus(1, status);
  }, [status]);

  useEffect(() => {
    if (page > 1) {
      fetchProjetsByStatus(page, status);
    }
  }, [page]);

  const groupesParMois = Array.isArray(projets)
    ? projets.reduce((acc, projet) => {
        const date = new Date(projet.dateDebut);
        const moisAnnee = date.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
        });

        if (!acc[moisAnnee]) acc[moisAnnee] = [];
        acc[moisAnnee].push({ ...projet, parsedDate: date });
        return acc;
      }, {})
    : {};

  const groupesTries = Object.entries(groupesParMois || {}).sort(
    ([_, projetsA], [__, projetsB]) => {
      const dateA = projetsA[0].parsedDate;
      const dateB = projetsB[0].parsedDate;
      return dateB - dateA;
    }
  );

  return {
    projets,
    loading,
    groupesTries,
    loaderRef,
    hasMore,
    fetchProjetsByStatus,
    setProjets,
  };
};
