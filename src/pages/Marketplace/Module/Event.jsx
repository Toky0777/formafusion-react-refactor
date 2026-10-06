import { useState, useEffect, useMemo } from "react";
import FormationsByDate from "../../../components/Formation/FormationsByDate";

// 🔄 Hook personnalisé pour récupérer les événements d’un client
const useFetchProjects = (moduleId) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!moduleId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const API_URL = `${API_URL}/marketplace/module/showEvent/${moduleId}`;
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Erreur ${response.status}: impossible de récupérer les événements.`
          );
        }

        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId]);

  return { projects, loading, error };
};

const Event = ({ moduleId }) => {
  const { projects, loading, error } = useFetchProjects(moduleId);

  const formationsByDate = useMemo(() => {
    const grouped = {};

    projects.forEach((formation) => {
      const dateKey = `${formation.day}/${formation.monthShort}/${formation.year}`;
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          dateObj: formation.dateObj,
          monthShort: formation.monthShort,
          dayShort: formation.dayShort,
          day: formation.day,
          year: formation.year,
          formations: [],
        };
      }
      grouped[dateKey].formations.push(formation);
    });

    return Object.values(grouped).sort(
      (b, a) => new Date(b.dateObj) - new Date(a.dateObj)
    );
  }, [projects]);

  // 💬 Gestion des états UI
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Chargement en cours...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Erreur : {error}</div>;
  }

  if (formationsByDate.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        Aucun événement trouvé pour ce centre.
      </div>
    );
  }

  return (
    <div>
      {/* ✅ En-tête */}
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Formations à venir
        </h2>
        <div className="w-20 h-1 rounded bg-gradient-to-r from-orange-400 to-yellow-400"></div>
      </div>

      {/* 📅 Liste des formations groupées par date */}
      <FormationsByDate formationsByDate={formationsByDate} />
    </div>
  );
};

export default Event;
