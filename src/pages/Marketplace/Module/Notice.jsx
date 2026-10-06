import { useState, useEffect } from "react";

// Missing Star component import
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

const Notice = ({ moduleId }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!moduleId) return; // Guard clause for invalid moduleId

      try {
        setLoading(true);
        const API_URL = `${API_URL}/marketplace/getAvisModule/${moduleId}`;
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la récupération des données: ${response.status}`
          );
        }

        const data = await response.json();

        setNotices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId]);

  // Loading, error, or empty data states
  if (loading) {
    return <div className="p-6 text-center">Chargement des données...</div>;
  }

  if (error) {
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
      {notices.map((notice, index) => {
        <div className="mb-8 space-y-6">
          <div className="p-5 bg-white border border-gray-200 rounded-lg">
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
        </div>;
      })}
    </div>
  );
};

export default Notice;
