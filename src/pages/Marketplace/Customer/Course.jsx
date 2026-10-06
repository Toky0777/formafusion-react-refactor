import { useState, useEffect } from "react";

// Missing Star component import
import { Star } from "lucide-react";
import CourseCard from "../../../components/Course/CourseCard";

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

const Course = ({ customerId }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!customerId) return;

      try {
        setLoading(true);
        const API_URL = `${API_URL}/marketplace/customer/getCoursProgram/${customerId}`;
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la récupération des données: ${response.status}`
          );
        }

        const data = await response.json();

        setModules(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  // Loading, error, or empty data states
  if (loading) {
    return <div className="p-6 text-center">Chargement des données...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Erreur: {error}</div>;
  }

  if (!modules || modules.length === 0) {
    return <div className="p-6 text-center">Aucun cours disponible.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Cours</h2>
      <p className="mb-6 text-gray-600">
        Explorez notre gamme de cours pour vous aider à faire progresser votre
        carrière.
      </p>
      <div className="space-y-8">
        {modules.map((module) => {
          return <CourseCard key={module.id} course={module} />;
        })}
      </div>
    </div>
  );
};

export default Course;
