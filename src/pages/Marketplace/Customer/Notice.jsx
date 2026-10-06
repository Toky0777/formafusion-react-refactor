import { useState, useEffect, useRef, useCallback } from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star
          key={i}
          className="w-4 h-4 text-yellow-400"
          fill="#FACC15"
          aria-hidden="true"
        />
      );
    } else {
      stars.push(
        <Star key={i} className="w-4 h-4 text-gray-300" aria-hidden="true" />
      );
    }
  }

  return (
    <div className="flex" aria-label={`Note de ${rating} sur 5`}>
      {stars}
    </div>
  );
};

const Notice = ({ customerId }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const lastNoticeRef = useRef(null);

  const ITEMS_PER_PAGE = 5; // Nombre d'avis à charger par page

  const fetchData = useCallback(
    async (pageNum) => {
      if (!customerId) return; // Guard clause for invalid customerId

      try {
        setLoading(true);
        // Pour la pagination, ajoutez les paramètres page et limit à l'URL
        const API_URL = `${API_URL}/marketplace/customer/getAvisCfp/${customerId}?page=${pageNum}&limit=${ITEMS_PER_PAGE}`;
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la récupération des données: ${response.status}`
          );
        }

        const data = await response.json();

        // Supposons que l'API renvoie { data: [...], hasMore: true/false }
        // Adaptez selon la structure réelle de votre API
        const newNotices = Array.isArray(data) ? data : data.data || [];

        setNotices((prev) =>
          pageNum === 1 ? newNotices : [...prev, ...newNotices]
        );

        // Si l'API ne fournit pas d'indicateur hasMore, on vérifie si le nombre d'éléments reçus est inférieur à ITEMS_PER_PAGE
        setHasMore(newNotices.length === ITEMS_PER_PAGE);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [customerId]
  );

  // Premier chargement
  useEffect(() => {
    setPage(1);
    fetchData(1);
  }, [customerId, fetchData]);

  // Configuration de l'Intersection Observer pour l'infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchData(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 1.0 }
    );

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, fetchData]);

  // Observer le dernier élément
  useEffect(() => {
    if (lastNoticeRef.current && observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current.observe(lastNoticeRef.current);
    }
  }, [notices]);

  // Loading initial state
  if (loading && notices.length === 0) {
    return <div className="p-6 text-center">Chargement des données...</div>;
  }

  if (error && notices.length === 0) {
    return <div className="p-6 text-center text-red-600">Erreur: {error}</div>;
  }

  if (!notices || notices.length === 0) {
    return <div className="p-6 text-center">Aucun avis disponible.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Avis des Étudiants</h2>
      </div>
      <div className="mb-8 space-y-6">
        {notices.map((notice, index) => (
          <div
            key={`notice-${index}`}
            ref={index === notices.length - 1 ? lastNoticeRef : null}
            className="p-5 bg-white border border-gray-200 rounded-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-800">
                  {notice.employee}
                </h4>
              </div>
              <div className="flex">
                <StarRating rating={notice.average} />
              </div>
            </div>
            {notice.temoignage ? (
              <p className="text-gray-600">{notice.temoignage}</p>
            ) : (
              <p className="italic text-gray-600">
                L'apprenant n'a pas ajouté de témoignage concernant son
                expérience au sein du centre de formation.
              </p>
            )}
          </div>
        ))}
      </div>
      {loading && notices.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      {!hasMore && notices.length > 0 && (
        <p className="text-center text-gray-500">
          Tous les avis ont été chargés
        </p>
      )}
    </div>
  );
};

export default Notice;
