import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Clock,
  Calendar,
  Users,
  ChevronRight,
  Sliders,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

// Constants for better maintainability
const API_URL = "http://localhost:8000/api/marketplace/";
const PRICE_RANGES = {
  LOW: "1",
  MEDIUM: "2",
  HIGH: "3",
};
const SEARCH_DEBOUNCE_TIME = 500;
const DEFAULT_PLACEHOLDER_IMAGE = "/api/placeholder/400/320";

// Custom hooks for better code organization
const useDebounce = (callback, delay) => {
  const debounceRef = useRef(null);

  return (value) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      callback(value);
    }, delay);
  };
};

// Custom hook for API fetching with loading and error handling
const useFetch = (initialUrl, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url) => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialUrl) {
      fetchData(initialUrl);
    }
  }, [initialUrl, fetchData]);

  return { data, loading, error, fetchData };
};

// Search Bar Component with improved accessibility
const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(onSearch, SEARCH_DEBOUNCE_TIME);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="sticky top-0 z-10 py-4 bg-white shadow-md">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-grow">
            <label htmlFor="course-search" className="sr-only">
              Rechercher des cours
            </label>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" aria-hidden="true" />
            </div>
            <input
              id="course-search"
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full py-2 pl-10 pr-3 leading-5 placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Rechercher des Cours & Programme..."
              aria-label="Rechercher des cours"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Category Filter Component with improved accessibility
const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategorySelect,
  totalModules,
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="mb-8" role="region" aria-label="Filtres de catégorie">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Parcourir par Catégorie
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${selectedCategory === null
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          onClick={() => onCategorySelect(null)}
          aria-pressed={selectedCategory === null}
        >
          Tous les Cours ({totalModules})
        </button>

        {categories.map((category) => (
          <button
            key={category.idDomaine}
            className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${selectedCategory === category.idDomaine
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => onCategorySelect(category.idDomaine)}
            aria-pressed={selectedCategory === category.idDomaine}
          >
            {category.nomDomaine} ({category.nb_module})
          </button>
        ))}
      </div>
    </div>
  );
};

// Radio Group component for reusability
const RadioGroup = ({ name, options, selectedValue, onChange, label }) => {
  return (
    <fieldset className="mb-6">
      <legend className="mb-2 font-medium text-gray-700">{label}</legend>
      <div className="space-y-2">
        {options.map((option) => (
          <div className="flex items-center" key={option.value}>
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="ml-2 text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

// Sidebar Filters Component with improved accessibility
const SidebarFilters = ({
  levels,
  selectedLevel,
  selectedPrice,
  onLevelSelect,
  onPriceSelect,
  onReset,
}) => {
  const levelOptions = levels.map((level) => ({
    value: level.id,
    label: level.name,
  }));

  levelOptions.push({
    value: null,
    label: "Tous Niveaux",
  });

  const priceOptions = [
    { value: PRICE_RANGES.LOW, label: "Moins de 500 000 MGA" },
    { value: PRICE_RANGES.MEDIUM, label: "500 000 - 1 000 000 MGA" },
    { value: PRICE_RANGES.HIGH, label: "Plus de 1 000 000 MGA" },
    { value: null, label: "Tous les prix" },
  ];

  return (
    <div className="md:w-1/4">
      <div className="p-5 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Sliders className="w-5 h-5" aria-hidden="true" />
            Filtres
          </h3>
          <button
            className="text-sm text-purple-600 rounded hover:text-purple-800 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            onClick={onReset}
            aria-label="Effacer tous les filtres"
          >
            Effacer Tout
          </button>
        </div>

        <RadioGroup
          name="level"
          options={levelOptions}
          selectedValue={selectedLevel}
          onChange={onLevelSelect}
          label="Niveau"
        />

        <RadioGroup
          name="price"
          options={priceOptions}
          selectedValue={selectedPrice}
          onChange={onPriceSelect}
          label="Gamme de Prix"
        />
      </div>
    </div>
  );
};

// Star Rating Component with improved accessibility
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

// Course Card Component with error handling and improved accessibility
const CourseCard = ({ module }) => {
  const [imageError, setImageError] = useState(false);

  if (!module || !module.module) {
    return null;
  }

  const {
    moduleName,
    module_image,
    nomDomaine,
    idCustomer,
    customerName,
    description,
    prix,
    dureeJ,
    module_level_name,
    idModule,
  } = module.module;

  const { average, totalEmployees } = module.note || {
    average: 0,
    totalEmployees: 0,
  };

  const imageUrl = imageError
    ? DEFAULT_PLACEHOLDER_IMAGE
    : `https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/modules/${module_image}`;

  const levelColors = {
    Fondamentaux: "bg-teal-100 text-teal-800",
    Intermédiaire: "bg-lime-100 text-lime-800",
    Avancée: "bg-blue-100 text-blue-800",
    MasterClass: "bg-rose-100 text-rose-800",
  };

  return (
    <article className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={moduleName || "Image du cours"}
          className="object-cover w-full h-full"
          onError={() => setImageError(true)}
        />
        {nomDomaine && (
          <div className="absolute top-0 right-0 px-3 py-1 m-2 text-sm font-medium text-white bg-gray-600 rounded-full">
            {nomDomaine}
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
            {moduleName || "Sans titre"}
          </h3>
          {customerName && (
            <p className="text-sm text-purple-600">
              Par{" "}
              <a
                className="rounded hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500"
                href={`/formation/${idCustomer}`}
              >
                {customerName}
              </a>
            </p>
          )}
        </div>

        <div className="flex items-center mb-2">
          <StarRating rating={average} />
          <span className="ml-1 text-sm text-gray-600">
            {average} ({totalEmployees})
          </span>
        </div>

        <p className="mb-4 text-gray-600 line-clamp-2">
          {description || "Aucune description."}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <span>{dureeJ ? `${dureeJ} jours` : "Aucun durée determiné"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <span>{module.beginDate || "Aucune date"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <span>{module.trained || 0} personnes formées</span>
          </div>

          {module_level_name && (
            <div className="flex items-center">
              <span
                className={`px-2 py-0.5 ${levelColors[module_level_name] || "bg-gray-100 text-gray-800"
                  } rounded text-xs font-medium`}
              >
                {module_level_name}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <span className="font-medium text-gray-500">
            {prix
              ? `${Number(prix).toLocaleString("fr-FR", {
                maximumFractionDigits: 0,
              })} MGA`
              : "Aucun prix"}
          </span>
          <Link
            className="flex items-center gap-2 px-4 py-1 text-white transition-colors bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
            to={`/cours/detail/${idModule}`}
            aria-label={`Voir les détails du cours ${moduleName || ""}`}
          >
            Détails
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
};

// Course Grid Component
const CourseGrid = ({ modules }) => {
  if (!modules || modules.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {modules.map((module, index) => (
        <CourseCard
          key={
            module.module?.idModule
              ? `${module.module.idModule}-${index}`
              : `module-${index}`
          }
          module={module}
        />
      ))}
    </div>
  );
};

// Course Card Skeleton Component - Refactored for better reuse
const CourseCardSkeleton = () => {
  return (
    <div
      className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md animate-pulse"
      aria-hidden="true"
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
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="w-16 h-4 ml-2 bg-gray-200 rounded"></div>
        </div>
        <div className="mb-4 space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <div className="w-24 h-5 bg-gray-200 rounded"></div>
          <div className="w-20 h-8 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

// Course Grid Skeleton Component
const CourseGridSkeleton = ({ count = 6 }) => {
  return (
    <div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      aria-label="Chargement des cours..."
    >
      {[...Array(count)].map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Error message component
const ErrorMessage = ({ message }) => {
  return (
    <div
      className="p-4 bg-red-100 border border-red-300 rounded-md"
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Une erreur est survenue
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component - Restructured with better state management
const CourseMarketplace = () => {
  // State management
  const [modules, setModules] = useState([]);
  const [filters, setFilters] = useState({
    category: null,
    level: null,
    price: null,
    key: null,
  });
  const [totalModules, setTotalModules] = useState(0);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    has_more: true,
  });
  const [loading, setLoading] = useState({
    initial: true,
    more: false,
  });
  const [error, setError] = useState(null);

  // Fetch categories with custom hook
  const { data: categories } = useFetch(
    `${API_URL}getAllCategoryHaveCourse`,
    []
  );

  // Mock levels data
  // const levels = [
  //   { idLevel: "beginner", module_level_name: "Débutant" },
  //   { idLevel: "intermediate", module_level_name: "Intermédiaire" },
  //   { idLevel: "advanced", module_level_name: "Avancé" },
  //   { idLevel: "expert", module_level_name: "Expert" }
  // ];

  const {
    data: levels,
    // loading: categoriesLoading,
    // error: categoriesError
  } = useFetch(`${API_URL}getAllLevel`, []);

  // Intersection Observer for infinite scroll
  const observerRef = useRef(null);
  const loaderRef = useCallback(
    (node) => {
      if (loading.initial || loading.more) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination.has_more && !loading.more) {
          loadMoreModules();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [loading, pagination.has_more]
  );

  // Effect to reset and fetch modules when filters change
  useEffect(() => {
    resetModulesAndFetch();
  }, [filters]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Reset modules and fetch first page
  const resetModulesAndFetch = () => {
    setModules([]);
    setPagination({
      current_page: 1,
      last_page: 1,
      has_more: true,
    });
    fetchModules(1, true);
  };

  // Load more modules (for infinite scroll)
  const loadMoreModules = () => {
    if (!pagination.has_more || loading.more) return;

    setLoading((prev) => ({ ...prev, more: true }));
    fetchModules(pagination.current_page + 1, false);
  };

  // Fetch modules based on current filters and pagination
  const fetchModules = async (page = 1, reset = false) => {
    if (reset) {
      setLoading((prev) => ({ ...prev, initial: true }));
    }

    try {
      setError(null);

      // Determine which URL to use based on whether filters are applied
      const hasActiveFilters =
        filters.category || filters.level || filters.price || filters.key;
      const url = hasActiveFilters
        ? `${API_URL}filter/course`
        : `${API_URL}getAllModule`;

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (!hasActiveFilters) {
        queryParams.append("page", page);
      }

      if (filters.category) queryParams.append("category", filters.category);
      if (filters.level) queryParams.append("level", filters.level);
      if (filters.price) queryParams.append("price", filters.price); // Modifié pour correspondre à l'API Laravel
      if (filters.key) queryParams.append("key", filters.key);

      // Fetch modules from API
      const response = await fetch(`${url}?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data && data.modules) {
        if (reset) {
          setModules(data.modules);
        } else {
          setModules((prevModules) => [...prevModules, ...data.modules]);
        }

        setTotalModules(data.total_module || 0);
        setPagination({
          current_page: page,
          last_page: data.pagination?.last_page || 1,
          has_more: page < (data.pagination?.last_page || 1),
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({
        initial: false,
        more: false,
      });
    }
  };

  // Filter handlers
  const handleCategoryFilter = (categoryId) => {
    setFilters((prev) => ({ ...prev, category: categoryId }));
  };

  const handleLevelFilter = (levelId) => {
    setFilters((prev) => ({ ...prev, level: levelId }));
  };

  const handlePriceFilter = (priceRange) => {
    setFilters((prev) => ({ ...prev, price: priceRange }));
  };

  const handleSearch = (searchKey) => {
    setFilters((prev) => ({ ...prev, key: searchKey }));
  };

  const resetFilters = () => {
    setFilters({
      category: null,
      level: null,
      price: null,
      key: null,
    });
  };

  // Render
  return (
    <main className="flex-grow">
      <SearchBar onSearch={handleSearch} />

      <div className="container px-4 py-8 mx-auto">
        {/* Error display */}
        {error && <ErrorMessage message={error} />}

        {/* Categories */}
        <CategoryFilter
          categories={categories}
          selectedCategory={filters.category}
          onCategorySelect={handleCategoryFilter}
          totalModules={totalModules}
        />

        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sidebar Filters */}
          <SidebarFilters
            levels={levels}
            selectedLevel={filters.level}
            selectedPrice={filters.price}
            onLevelSelect={handleLevelFilter}
            onPriceSelect={handlePriceFilter}
            onReset={resetFilters}
          />

          {/* Course Listing */}
          <div className="md:w-3/4">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-semibold text-gray-800"
                id="course-results"
              >
                {totalModules} Cours Trouvés
              </h2>
            </div>

            {loading.initial ? (
              <CourseGridSkeleton count={6} />
            ) : (
              <>
                {modules.length === 0 ? (
                  <div
                    className="p-8 text-center bg-white rounded-lg shadow"
                    role="status"
                  >
                    <p className="text-gray-600">
                      Aucun cours trouvé pour ces critères.
                    </p>
                  </div>
                ) : (
                  <div aria-labelledby="course-results">
                    <CourseGrid modules={modules} />
                  </div>
                )}

                {/* Infinite Scroll Loader */}
                {modules.length > 0 && pagination.has_more && (
                  <div ref={loaderRef} className="py-4 text-center">
                    {loading.more && (
                      <div
                        className="flex justify-center"
                        role="status"
                        aria-label="Chargement de plus de cours"
                      >
                        <div className="w-8 h-8 border-4 border-t-4 border-purple-200 rounded-full border-t-purple-600 animate-spin"></div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseMarketplace;
