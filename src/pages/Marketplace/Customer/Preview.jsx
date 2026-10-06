import { useState, useEffect } from "react";
import { IMAGE_URL } from "../../../config/env";

const Preview = ({ customerId }) => {
  const [customer, setCustomer] = useState(null);
  const [traits, setTraits] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!customerId) return; // Guard clause for invalid customerId

      try {
        setLoading(true);
        const API_URL = `${API_URL}/marketplace/customer/getApercu/${customerId}`;
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la récupération des données: ${response.status}`
          );
        }

        const data = await response.json();
        setCustomer(data.customer);
        setTraits(data.traits || []);
        setReasons(data.reasons || []);
        setImages(data.images || []);
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
    return <div className="p-6 text-center text-red-500">Erreur: {error}</div>;
  }

  if (!customer) {
    return (
      <div className="p-6 text-center">Aucune donnée client disponible</div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        À Propos de {customer.customerName}
      </h2>
      <p className="mb-6 text-gray-600">{customer.description}</p>

      <h3 className="mb-3 text-xl font-semibold text-gray-800">
        Caractéristiques Principales
      </h3>
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
        {traits.length ? (
          traits.map((trait) => (
            <div
              key={trait.id}
              className="flex items-center space-x-2"
              data-id={trait.id}
            >
              <i className="text-green-500 fa-regular fa-circle-check"></i>
              <span className="text-gray-700">{trait.title}</span>
            </div>
          ))
        ) : (
          <span className="text-gray-700">
            Aucune caractéristique disponible
          </span>
        )}
      </div>

      <h3 className="mb-3 text-xl font-semibold text-gray-800">
        Pourquoi Nous Choisir
      </h3>
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        {reasons.length ? (
          reasons.map((reason) => (
            <div
              key={reason.id}
              className="p-4 rounded-lg bg-purple-50"
              data-id={reason.id}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <i className="text-purple-600 fa-regular fa-circle-dot"></i>
                  <h4 className="font-semibold text-gray-800">
                    {reason.title}
                  </h4>
                </div>
              </div>
              <p className="text-sm text-gray-600">{reason.description}</p>
            </div>
          ))
        ) : (
          <span className="text-gray-700">Aucune information disponible</span>
        )}
      </div>

      <div className="p-4 rounded-lg bg-gray-50">
        <h3 className="mb-3 text-xl font-semibold text-gray-800">Photos</h3>
        {!images.length ? (
          <p className="italic text-gray-500">Pas de photo disponible.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {images.map((img, index) => (
              <img
                key={index}
                src={`${IMAGE_URL}/${img.path}`}
                alt={`Image ${index + 1}`}
                className="object-cover w-full h-40 rounded-lg"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
