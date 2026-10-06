import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Globe, MapPin, Phone, Star } from "lucide-react";

const Customer = () => {
  const [modules, setModules] = useState({ customers: [], total_customer: 0 }); // Structure correcte pour les modules
  const [loading, setLoading] = useState(true); // État de chargement
  const [category, setCategory] = useState(null); // Catégorie sélectionnée
  const [rating, setRating] = useState(null); // Évaluation sélectionnée
  const [region, setRegion] = useState(null); // Région sélectionnée
  const [categories, setCategories] = useState([]); // Liste des catégories
  const [regions, setRegions] = useState([]); // Liste des régions
  const [error, setError] = useState(null); // Gestion des erreurs
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche

  // Nouveaux états pour l'infinite scroll
  const [page, setPage] = useState(1); // Page actuelle
  const [limit, setLimit] = useState(9); // Nombre d'éléments par page
  const [hasMore, setHasMore] = useState(true); // Indicateur s'il y a plus de données à charger
  const [loadingMore, setLoadingMore] = useState(false); // État pour le chargement de données supplémentaires

  // Référence pour l'élément observé pour l'infinite scroll
  const observer = useRef();
  // Référence pour le dernier élément de la liste
  const lastCustomerElementRef = useRef();

  const apiUrl = "http://localhost:8000/api/marketplace/";

  // Fonction pour récupérer les modules, catégories, et régions
  const fetchData = async (resetItems = true) => {
    try {
      setLoading(true);

      // Récupérer les catégories et régions seulement au premier chargement
      let categoriesData = categories;
      let regionsData = regions;

      if (resetItems) {
        const [categoriesResponse, regionsResponse] = await Promise.all([
          axios.get(`${apiUrl}getAllCategory`),
          axios.get(`${apiUrl}getAllRegion`),
        ]);
        categoriesData = categoriesResponse.data;
        regionsData = regionsResponse.data;
        setCategories(categoriesData);
        setRegions(regionsData);
        setPage(1); // Réinitialiser la page lors d'un nouveau chargement
      }

      // Récupération des modules avec pagination
      const modulesResponse = await axios.get(`${apiUrl}getAllCustomer`, {
        params: {
          page: resetItems ? 1 : page,
          limit: limit,
        },
      });

      // Si on réinitialise, remplacer les données, sinon les ajouter
      if (resetItems) {
        setModules(modulesResponse.data);
      } else {
        setModules((prev) => ({
          ...prev,
          customers: [...prev.customers, ...modulesResponse.data.customers],
          total_customer: modulesResponse.data.total_customer,
        }));
      }

      // Vérifier s'il reste des données à charger
      setHasMore(
        modulesResponse.data.customers.length > 0 &&
        (resetItems ? 1 : page) * limit < modulesResponse.data.total_customer
      );
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Appliquer les filtres sélectionnés
  const applyFilters = useCallback(
    async (resetItems = true) => {
      try {
        if (resetItems) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        // Construire les paramètres pour la requête si les filtres sont définis
        const data = {
          key: searchTerm || "", // Utilisation du terme de recherche
          idCategory: category,
          idRegion: region,
          evaluation: rating,
          page: resetItems ? 1 : page,
          limit: limit,
        };
        // Effectuer la requête API
        const response = await axios.post(`${apiUrl}filter/cfp`, data);

        // Mettre à jour l'état avec les modules récupérés
        if (resetItems) {
          setModules(response.data);
        } else {
          setModules((prev) => ({
            ...prev,
            customers: [...prev.customers, ...response.data.customers],
            total_customer: response.data.total_customer,
          }));
        }

        // Vérifier s'il reste des données à charger
        setHasMore(
          response.data.customers.length > 0 &&
          (resetItems ? 1 : page) * limit < response.data.total_customer
        );
      } catch (err) {
        setError("Une erreur est survenue lors de l'application des filtres.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category, rating, region, searchTerm, page, limit]
  ); // Dépendances: ajout de page et limit

  // Configuration de l'Intersection Observer pour l'infinite scroll
  useEffect(() => {
    // Déconnecter l'observer précédent
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        // Si l'élément est visible et qu'il y a plus de données à charger
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    // Observer le dernier élément s'il existe
    if (lastCustomerElementRef.current) {
      observer.current.observe(lastCustomerElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, loading, loadingMore]);

  // Appel à la fonction fetchData au premier chargement pour récupérer les données
  useEffect(() => {
    fetchData();
  }, []);

  // Charger plus de données quand la page change
  useEffect(() => {
    if (page > 1) {
      if (!category && !rating && !region && !searchTerm) {
        fetchData(false);
      } else {
        applyFilters(false);
      }
    }
  }, [page, applyFilters]);

  // Rechercher à chaque fois qu'un filtre change
  useEffect(() => {
    // Utiliser un timer pour éviter trop d'appels API lors de la saisie de recherche
    const delaySearch = setTimeout(() => {
      // Réinitialiser la page à 1 quand les filtres changent
      setPage(1);

      if (!category && !rating && !region && !searchTerm) {
        fetchData(true);
      } else {
        applyFilters(true);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [category, rating, region, searchTerm]);

  // Gestionnaires d'événements pour les filtres
  const handleCategoryChange = (categoryId) => {
    setCategory(categoryId === category ? null : categoryId);
  };

  const handleRatingChange = (ratingValue) => {
    setRating(ratingValue === rating ? null : ratingValue);
  };

  const handleRegionChange = (regionId) => {
    setRegion(regionId === region ? null : regionId);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Fonction pour afficher les étoiles d'évaluation
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    // Ajouter les étoiles pleines
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="text-sm text-yellow-400"
          fill="#FACC15"
          size={14}
        />
      );
    }

    // Ajouter les étoiles vides
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="text-sm text-gray-300" size={14} />
      );
    }

    return stars;
  };

  // Composant pour les cartes de chargement (skeleton)
  const LoadingSkeleton = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md animate-pulse"
        >
          <div className="relative h-48 overflow-hidden bg-gray-200">
            <div className="absolute top-0 right-0 w-20 h-5 px-3 py-1 m-2 bg-purple-300 rounded-full"></div>
          </div>
          <div className="p-3">
            <div className="mb-2">
              <div className="w-3/4 h-6 mb-2 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center gap-1 mb-2">
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-4 ml-2 bg-gray-200 rounded"></div>
            </div>
            <div className="mb-4 space-y-2">
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
              </div>
              <div className="w-20 h-5 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
              <div className="w-24 h-5 bg-gray-200 rounded"></div>
              <div className="w-20 h-8 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>
      ));
  };

  if (loading && (!modules.customers || modules.customers.length === 0)) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="hidden p-4 bg-white rounded-lg shadow-md md:block md:w-1/4 h-fit">
            {/* Squelettes pour les filtres */}
            <div className="w-1/2 h-6 mb-4 bg-gray-200 rounded"></div>
            <div className="space-y-6">
              {Array(1)
                .fill(0)
                .map((_, i) => (
                  <div key={`filter-${i}`} className="space-y-2">
                    <div className="w-1/3 h-5 mb-3 bg-gray-200 rounded"></div>
                    {Array(10)
                      .fill(0)
                      .map((_, j) => (
                        <div
                          key={`option-${i}-${j}`}
                          className="flex items-center"
                        >
                          <div className="w-4 h-4 mr-2 bg-gray-200 rounded-full"></div>
                          <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                  </div>
                ))}
              {Array(1)
                .fill(0)
                .map((_, i) => (
                  <div key={`filter-${i}`} className="space-y-2">
                    <div className="w-1/3 h-5 mb-3 bg-gray-200 rounded"></div>
                    {Array(4)
                      .fill(0)
                      .map((_, j) => (
                        <div
                          key={`option-${i}-${j}`}
                          className="flex items-center"
                        >
                          <div className="w-4 h-4 mr-2 bg-gray-200 rounded-full"></div>
                          <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                  </div>
                ))}
              {Array(1)
                .fill(0)
                .map((_, i) => (
                  <div key={`filter-${i}`} className="space-y-2">
                    <div className="w-1/3 h-5 mb-3 bg-gray-200 rounded"></div>
                    {Array(6)
                      .fill(0)
                      .map((_, j) => (
                        <div
                          key={`option-${i}-${j}`}
                          className="flex items-center"
                        >
                          <div className="w-4 h-4 mr-2 bg-gray-200 rounded-full"></div>
                          <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </div>
          <div className="md:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <div className="w-32 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <LoadingSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-medium text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 py-4 bg-white shadow-md">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-grow">
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 leading-5 placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Rechercher des centres de formation..."
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i className="text-gray-400 fa-solid fa-search"></i>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="hidden p-4 bg-white rounded-lg shadow-md md:block md:w-1/4 h-fit">
            <h3 className="text-lg font-semibold text-gray-800">Filtres</h3>

            {/* Filtre Catégorie */}
            <div className="mb-6">
              <h4 className="mb-2 font-medium text-gray-700">Catégorie</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="location-all-category"
                    name="category"
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    checked={category === null}
                    onChange={() => setCategory(null)}
                  />
                  <label
                    htmlFor="location-all-category"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Toutes catégories
                  </label>
                </div>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <div className="flex items-center" key={cat.idDomaine}>
                      <input
                        type="radio"
                        id={`category-${cat.idDomaine}`}
                        name="category"
                        value={cat.idDomaine}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        checked={category === cat.idDomaine}
                        onChange={() => handleCategoryChange(cat.idDomaine)}
                      />
                      <label
                        htmlFor={`category-${cat.idDomaine}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {cat.nomDomaine}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    Aucune catégorie disponible
                  </div>
                )}
              </div>
            </div>

            {/* Filtre Évaluation */}
            <div className="mb-6">
              <h4 className="mb-2 font-medium text-gray-700">Évaluation</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="rating-all"
                    name="rating"
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    checked={rating === null}
                    onChange={() => setRating(null)}
                  />
                  <label
                    htmlFor="rating-all"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Toutes évaluations
                  </label>
                </div>
                {[5, 4, 3, 2, 1].map((value) => (
                  <div className="flex items-center" key={`rating-${value}`}>
                    <input
                      type="radio"
                      id={`rating-${value}`}
                      name="rating"
                      value={value}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      checked={rating === value.toString()}
                      onChange={() => handleRatingChange(value.toString())}
                    />
                    <label
                      htmlFor={`rating-${value}`}
                      className="flex items-center ml-2 text-sm text-gray-700"
                    >
                      {Array.from({ length: 5 }, (_, index) => (
                        <i
                          key={index}
                          className={`text-sm ${index < value
                              ? "text-yellow-400 fa-solid fa-star"
                              : "text-gray-300 fa-regular fa-star"
                            }`}
                        ></i>
                      ))}
                      <span className="ml-1">&plus; Plus</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtre Région */}
            <div className="mb-6">
              <h4 className="mb-2 font-medium text-gray-700">Région</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="location-all-region"
                    name="region"
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    checked={region === null}
                    onChange={() => setRegion(null)}
                  />
                  <label
                    htmlFor="location-all-region"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Toutes régions
                  </label>
                </div>
                {regions.length > 0 ? (
                  regions.map((reg) => (
                    <div className="flex items-center" key={reg.id}>
                      <input
                        type="radio"
                        id={`region-${reg.id}`}
                        name="region"
                        value={reg.id}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        checked={region === reg.id}
                        onChange={() => handleRegionChange(reg.id)}
                      />
                      <label
                        htmlFor={`region-${reg.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {reg.ville_name}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    Aucune région disponible
                  </div>
                )}
              </div>
            </div>

            {/* Bouton pour réinitialiser les filtres */}
            {(category !== null ||
              rating !== null ||
              region !== null ||
              searchTerm) && (
                <button
                  onClick={() => {
                    setCategory(null);
                    setRating(null);
                    setRegion(null);
                    setSearchTerm("");
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-center text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Réinitialiser les filtres
                </button>
              )}
          </div>

          {/* Liste des modules */}
          <div className="md:w-3/4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-700">
                {modules.total_customer || 0} modules disponibles
              </span>
            </div>

            {loading && modules.customers.length === 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <LoadingSkeleton />
              </div>
            ) : modules.customers && modules.customers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {modules.customers.map((module, index) => {
                    // Si c'est le dernier élément, on ajoute la ref pour l'observer
                    if (index === modules.customers.length - 1) {
                      return (
                        <div
                          className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
                          key={module.customer.idCustomer}
                          ref={lastCustomerElementRef}
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={
                                module.customer.logo
                                  ? "https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/entreprises/" +
                                  module.customer.logo
                                  : "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
                              }
                              alt={module.customer.customerName}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                                {module.customer.customerName}
                              </h3>
                            </div>
                            <div className="flex items-center">
                              <div className="flex">
                                {renderRatingStars(module.notice.average)}
                              </div>
                              <span className="ml-1 text-sm text-gray-600">
                                ({module.notice.total})
                              </span>
                            </div>
                            <p className="mb-4 text-gray-600 line-clamp-2">
                              {module.customer.description ||
                                "Aucune description"}
                            </p>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <i className="text-gray-400 fa-solid fa-location-dot"></i>

                                <span>
                                  {module.customer.customer_addr_quartier
                                    ? `${module.customer.customer_addr_quartier}, ${module.customer.ville_name}`
                                    : module.customer.ville_name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <i className="text-gray-400 fa-solid fa-phone"></i>
                                <span>
                                  {module.customer.customerPhone ||
                                    "Aucun contact"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <i className="text-gray-400 fa-solid fa-globe"></i>
                                {module.customer.siteWeb ? (
                                  <a
                                    href={`//${module.customer.siteWeb}`}
                                    className="text-purple-600 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Visiter le site web
                                  </a>
                                ) : (
                                  "Aucun site web"
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                              <span className="font-medium text-purple-600">
                                {module.trained} personnes formées
                              </span>
                              <a
                                className="px-4 py-1 text-white transition-colors bg-purple-600 rounded-md hover:bg-purple-700"
                                href={`/formation/detail/${module.id}`}
                              >
                                Détails
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
                        key={module.customer.idCustomer}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={
                              module.customer.logo
                                ? "https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/entreprises/" +
                                module.customer.logo
                                : "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
                            }
                            alt={module.customer.customerName}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                              {module.customer.customerName}
                            </h3>
                          </div>
                          <div className="flex items-center">
                            <div className="flex">
                              {renderRatingStars(module.notice.average)}
                            </div>
                            <span className="ml-1 text-sm text-gray-600">
                              ({module.notice.total})
                            </span>
                          </div>
                          <p className="mb-4 text-gray-600 line-clamp-2">
                            {module.customer.description ||
                              "Aucune description"}
                          </p>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="text-gray-400" size={16} />
                              <span>
                                {module.customer.customer_addr_quartier
                                  ? `${module.customer.customer_addr_quartier}, ${module.customer.ville_name}`
                                  : module.customer.ville_name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="text-gray-400" size={16} />
                              <span>
                                {module.customer.customerPhone ||
                                  "Aucun contact"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="text-gray-400" size={16} />
                              {module.customer.siteWeb ? (
                                <a
                                  href={`//${module.customer.siteWeb}`}
                                  className="text-purple-600 hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Visiter le site web
                                </a>
                              ) : (
                                "Aucun site web"
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                            <span className="font-medium text-purple-600">
                              {module.trained} personnes formées
                            </span>
                            <Link
                              className="px-4 py-1 text-white transition-colors bg-purple-600 rounded-md hover:bg-purple-700"
                              to={`/cfp/detail/${module.customer.idCustomer}`}
                            >
                              Détails
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Indicateur de chargement pour l'infinite scroll */}
                {loadingMore && (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-8 h-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-md">
                <i className="mb-4 text-5xl text-gray-300 fa-solid fa-search"></i>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  Aucun résultat trouvé
                </h3>
                <p className="mb-4 text-gray-600">
                  Nous n'avons trouvé aucun centre de formation correspondant à
                  vos critères.
                </p>
                <button
                  onClick={() => {
                    setCategory(null);
                    setRating(null);
                    setRegion(null);
                    setSearchTerm("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filtres mobiles en bas de l'écran (visible uniquement sur mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-10 p-2 bg-white border-t border-gray-200 md:hidden">
        <button
          onClick={() =>
            document.getElementById("mobileFilters").classList.toggle("hidden")
          }
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <i className="mr-2 fa-solid fa-filter"></i>
          Filtres
        </button>

        {/* Panneau de filtres mobile */}
        <div
          id="mobileFilters"
          className="fixed bottom-0 left-0 right-0 z-20 hidden w-full p-4 overflow-y-auto bg-white border-t border-gray-200 rounded-t-lg shadow-lg top-20 md:hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filtres</h3>
            <button
              onClick={() =>
                document.getElementById("mobileFilters").classList.add("hidden")
              }
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>

          {/* Filtre Catégorie */}
          <div className="mb-6">
            <h4 className="mb-2 font-medium text-gray-700">Catégorie</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="mobile-location-all-category"
                  name="mobile-category"
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  checked={category === null}
                  onChange={() => setCategory(null)}
                />
                <label
                  htmlFor="mobile-location-all-category"
                  className="ml-2 text-sm text-gray-700"
                >
                  Toutes catégories
                </label>
              </div>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <div
                    className="flex items-center"
                    key={`mobile-${cat.idDomaine}`}
                  >
                    <input
                      type="radio"
                      id={`mobile-category-${cat.idDomaine}`}
                      name="mobile-category"
                      value={cat.idDomaine}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      checked={category === cat.idDomaine}
                      onChange={() => handleCategoryChange(cat.idDomaine)}
                    />
                    <label
                      htmlFor={`mobile-category-${cat.idDomaine}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {cat.nomDomaine}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  Aucune catégorie disponible
                </div>
              )}
            </div>
          </div>

          {/* Filtre Évaluation */}
          <div className="mb-6">
            <h4 className="mb-2 font-medium text-gray-700">Évaluation</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="mobile-rating-all"
                  name="mobile-rating"
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  checked={rating === null}
                  onChange={() => setRating(null)}
                />
                <label
                  htmlFor="mobile-rating-all"
                  className="ml-2 text-sm text-gray-700"
                >
                  Toutes évaluations
                </label>
              </div>
              {[5, 4, 3, 2, 1].map((value) => (
                <div
                  className="flex items-center"
                  key={`mobile-rating-${value}`}
                >
                  <input
                    type="radio"
                    id={`mobile-rating-${value}`}
                    name="mobile-rating"
                    value={value}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    checked={rating === value.toString()}
                    onChange={() => handleRatingChange(value.toString())}
                  />
                  <label
                    htmlFor={`mobile-rating-${value}`}
                    className="flex items-center ml-2 text-sm text-gray-700"
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <i
                        key={index}
                        className={`text-sm ${index < value
                            ? "text-yellow-400 fa-solid fa-star"
                            : "text-gray-300 fa-regular fa-star"
                          }`}
                      ></i>
                    ))}
                    <span className="ml-1">&plus; Plus</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Filtre Région */}
          <div className="mb-6">
            <h4 className="mb-2 font-medium text-gray-700">Région</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="mobile-location-all-region"
                  name="mobile-region"
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  checked={region === null}
                  onChange={() => setRegion(null)}
                />
                <label
                  htmlFor="mobile-location-all-region"
                  className="ml-2 text-sm text-gray-700"
                >
                  Toutes régions
                </label>
              </div>
              {regions.length > 0 ? (
                regions.map((reg) => (
                  <div
                    className="flex items-center"
                    key={`mobile-region-${reg.id}`}
                  >
                    <input
                      type="radio"
                      id={`mobile-region-${reg.id}`}
                      name="mobile-region"
                      value={reg.id}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      checked={region === reg.id}
                      onChange={() => handleRegionChange(reg.id)}
                    />
                    <label
                      htmlFor={`mobile-region-${reg.id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {reg.ville_name}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  Aucune région disponible
                </div>
              )}
            </div>
          </div>

          {/* Boutons d'action pour les filtres mobiles */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCategory(null);
                setRating(null);
                setRegion(null);
                setSearchTerm("");
                document
                  .getElementById("mobileFilters")
                  .classList.add("hidden");
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-600 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Réinitialiser
            </button>
            <button
              onClick={() =>
                document.getElementById("mobileFilters").classList.add("hidden")
              }
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>

      {/* Bouton pour revenir en haut de la page */}
      <ScrollToTop />
    </div>
  );
};

// Composant ScrollToTop - pour revenir en haut de la page
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Effet pour gérer la visibilité du bouton
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Fonction pour scroller vers le haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed z-50 p-3 text-white bg-purple-600 rounded-full shadow-lg bottom-20 right-4 md:bottom-4 transition-opacity duration-300 hover:bg-purple-700 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
};

export default Customer;
