import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "../../../config/axios";
import debounce from "lodash.debounce";
import { IMAGE_URL } from "../../../config/env";

const LearnerReporting = () => {
  const [apprenantNameInput, setApprenantNameInput] = useState("");
  const [allInitialLearnerFormations, setAllInitialLearnerFormations] =
    useState([]);
  const [displayedLearnerFormations, setDisplayedLearnerFormations] = useState(
    []
  );
  const [suggestedLearners, setSuggestedLearners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchAttemptedWithEmptyInput, setSearchAttemptedWithEmptyInput] =
    useState(false);

  const inputRef = useRef(null);
  const DIGITALOCEAN_MODULES_BASE_URL =
    `${IMAGE_URL}/img/modules/`;
  const DEFAULT_PLACEHOLDER_FILENAME = "placeholder.webp";

  const getModuleImageUrl = (filename) => {
    if (!filename || typeof filename !== "string") {
      return `${DIGITALOCEAN_MODULES_BASE_URL}${DEFAULT_PLACEHOLDER_FILENAME}`;
    }

    const cleanPath = filename.trim();

    if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
      return cleanPath;
    }

    if (
      cleanPath.includes("..") ||
      cleanPath.startsWith("/") ||
      cleanPath.startsWith("\\")
    ) {
      return `${DIGITALOCEAN_MODULES_BASE_URL}${DEFAULT_PLACEHOLDER_FILENAME}`;
    }

    const formattedFilename = cleanPath.startsWith("/")
      ? cleanPath.substring(1)
      : cleanPath;
    return `${DIGITALOCEAN_MODULES_BASE_URL}${formattedFilename}`;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const { data: { all_learner = [] } = {} } = await axios.get(
          "/cfp/reporting/apprenant"
        );
        if (!Array.isArray(all_learner)) {
          throw new Error("Structure de données invalide");
        }

        const enhancedData = all_learner.map((learner) => {
          let durationDays = learner.duration_days;
          if (!durationDays && learner.dateDebut && learner.dateFin) {
            const start = new Date(learner.dateDebut);
            const end = new Date(learner.dateFin);
            durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
          }

          return {
            ...learner,
            imageUrl: getModuleImageUrl(learner.module_image),
            duration_days: durationDays || "N/A",
            duration_hours: learner.dureeH || "N/A",
            level: learner.level || "Non spécifié",
            price_info:
              learner.price_info ||
              "Pour connaître nos tarifs, contactez-nous.",
            average_rating: learner.average_rating || 0,
            review_count: learner.review_count || 0,
            description: learner.description || "Description non disponible.",
            emp_name: learner.emp_name || "Non renseigné",
            emp_firstname: learner.emp_firstname || "",
            etp_name: learner.etp_name || "Non renseigné",
            salle_name: learner.salle_name || "Lieu non spécifié",
            salle_quartier: learner.salle_quartier || "",
            project_status: learner.project_status || "Statut inconnu",
            project_type: learner.project_type || "Type inconnu",
            taux_de_presence: learner.taux_de_presence || 0,
          };
        });

        setAllInitialLearnerFormations(enhancedData);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des données. Veuillez réessayer.");
        setAllInitialLearnerFormations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const debouncedFilterSuggestions = useMemo(
    () =>
      debounce((name) => {
        if (name.length < 2) {
          setSuggestedLearners([]);
          setShowSuggestions(false);
          return;
        }

        const lowerCaseName = name.toLowerCase();
        const uniqueLearners = [];
        const seenEmpIds = new Set();

        allInitialLearnerFormations.forEach((learner) => {
          const fullName = `${learner.emp_name || ""} ${learner.emp_firstname || ""}`.toLowerCase();
          if (!seenEmpIds.has(learner.idEmploye) && fullName.includes(lowerCaseName)) {
            seenEmpIds.add(learner.idEmploye);
            uniqueLearners.push({
              idEmploye: learner.idEmploye,
              emp_matricule: learner.emp_matricule,
              emp_name: learner.emp_name,
              emp_firstname: learner.emp_firstname,
              learner_id: learner.learner_id,
            });
          }
        });

        setSuggestedLearners(uniqueLearners);
        setShowSuggestions(uniqueLearners.length > 0);
      }, 300),
    [allInitialLearnerFormations]
  );

  const handleInputChange = (e) => {
    const name = e.target.value;
    setApprenantNameInput(name);

    if (name.trim() === "") {
      setSuggestedLearners([]);
      setShowSuggestions(false);
      setDisplayedLearnerFormations([]);
      setHasSearched(false);
      setSearchAttemptedWithEmptyInput(false);
    } else {
      debouncedFilterSuggestions(name);
    }
  };

  const handleLearnerSelection = (
    selectedEmpMatricule,
    selectedName,
    selectedFirstname
  ) => {
    setApprenantNameInput(`${selectedName} ${selectedFirstname}`);
    setSuggestedLearners([]);
    setShowSuggestions(false);
    setSearchAttemptedWithEmptyInput(false);
    filterAndDisplayData(selectedEmpMatricule);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = apprenantNameInput.trim();

    if (input === "") {
      setSearchAttemptedWithEmptyInput(true);
      setDisplayedLearnerFormations([]);
      setHasSearched(true);
      return;
    }

    setSearchAttemptedWithEmptyInput(false);

    const selectedLearner = suggestedLearners.find(
      (learner) =>
        `${learner.emp_name} ${learner.emp_firstname}`.trim() === input
    );

    if (selectedLearner) {
      filterAndDisplayData(selectedLearner.emp_matricule);
    } else {
      filterAndDisplayData();
    }
  };

  const filterAndDisplayData = (specificMatricule = null) => {
    setLoading(true);
    setError(null);
    const nameToFilter = apprenantNameInput.trim().toLowerCase();
    let filteredResults = [];

    if (specificMatricule) {
      filteredResults = allInitialLearnerFormations.filter(
        (learner) => learner.emp_matricule === specificMatricule
      );
    } else if (nameToFilter) {
      const nameParts = nameToFilter.split(" ").filter(Boolean);
      filteredResults = allInitialLearnerFormations.filter((learner) => {
        const fullName = `${learner.emp_name || ""} ${
          learner.emp_firstname || ""
        }`.toLowerCase();
        return nameParts.every((part) => fullName.includes(part));
      });
    }

    filteredResults.sort(
      (a, b) => new Date(b.dateDebut) - new Date(a.dateDebut)
    );
    setDisplayedLearnerFormations(filteredResults);
    setSuggestedLearners([]);
    setShowSuggestions(false);
    setHasSearched(true);
    setLoading(false);
  };

  const handleFocus = () => {
    if (apprenantNameInput.length > 0 && suggestedLearners.length > 0) {
      setShowSuggestions(true);
    }
    setSearchAttemptedWithEmptyInput(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 100);
  };

  const renderRating = (rating) => {
    if (typeof rating !== "number" || rating < 0) rating = 0;
    if (rating > 5) rating = 5;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="text-yellow-400 fas fa-star"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <i key={i} className="text-yellow-400 fas fa-star-half-alt"></i>
        );
      } else {
        stars.push(<i key={i} className="text-yellow-400 far fa-star"></i>);
      }
    }
    return stars;
  };

  const formatShortMonth = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Date invalide";
      const monthNames = [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aoû",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
      ];
      return monthNames[date.getMonth()];
    } catch (e) {
      return "Date invalide";
    }
  };

  const getUniqueLearners = () => {
    const uniqueMatricules = new Set();
    return displayedLearnerFormations.filter((learner) => {
      if (!uniqueMatricules.has(learner.idEmploye)) {
        uniqueMatricules.add(learner.idEmploye);
        return true;
      }
      return false;
    });
  };

const getDetailUrl = (formation) => {
  // Utilisez idEmploye ou emp_matricule qui existent dans vos données
  const idProjet = formation.idProjet || formation.idEmploye || formation.emp_matricule;
  
  if (!idProjet || !formation.idModule) {
    console.warn('IDs manquants pour la formation:', {
      idModule: formation.idModule,
      idProjet: formation.idProjet,
      idEmploye: formation.idEmploye,
      emp_matricule: formation.emp_matricule
    });
    return "#";
  }
  
  return `/cfp/reporting/learnerProjet/detail/${formation.idModule}/${idProjet}`;
};

  return (
    <div className="container px-4 py-8 mx-auto mt-17">
      <div className="max-w-3xl mx-auto mb-8">
        <div className="mb-6 text-center">
          <p className="block mb-1 text-sm font-medium text-gray-500">
            Recherchez un apprenant pour afficher son parcours de formation
          </p>
        </div>

        <div className="relative">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-grow">
              <input
                ref={inputRef}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                autoComplete="off"
                value={apprenantNameInput}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={loading}
                placeholder="Saisissez le nom de l'apprenant..."
              />
              {showSuggestions && suggestedLearners.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-60">
                  {suggestedLearners.map((learner) => (
                    <li
                      key={learner.idEmploye}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                      onMouseDown={() =>
                        handleLearnerSelection(
                          learner.emp_matricule,
                          learner.emp_name,
                          learner.emp_firstname
                        )
                      }
                    >
                      {learner.emp_name} {learner.emp_firstname}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="submit"
              className="flex-shrink-0 px-6 py-2 font-medium text-white transition duration-200 bg-gray-500 rounded-lg cursor-pointer hover:bg-purple-500"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Chargement...
                </span>
              ) : (
                "Rechercher"
              )}
            </button>
          </form>
        </div>

        <div className="mt-3 text-center min-h-6">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!loading && searchAttemptedWithEmptyInput && (
            <p className="text-sm text-gray-500">
              Veuillez saisir le nom d'un apprenant pour lancer la recherche.
            </p>
          )}
          {!loading &&
            hasSearched &&
            displayedLearnerFormations.length === 0 &&
            !error &&
            !searchAttemptedWithEmptyInput && (
              <p className="text-sm text-gray-500">
                Aucune formation trouvée pour cet apprenant.
              </p>
            )}
          {!loading &&
            !hasSearched &&
            !error &&
            !searchAttemptedWithEmptyInput && (
              <p className="text-sm text-gray-500">
                Veuillez rechercher un apprenant pour afficher ses formations.
              </p>
            )}
        </div>
      </div>

      <div className="space-y-6">
        {hasSearched &&
          !searchAttemptedWithEmptyInput &&
          getUniqueLearners().length === 1 &&
          displayedLearnerFormations.map((formation, index) => {
            const startDate = new Date(formation.dateDebut);
            const day = startDate.getDate();
            const month = formatShortMonth(startDate);
            const year = startDate.getFullYear();

            return (
              <div
                key={`${formation.emp_matricule}-${formation.idModule}-${index}`}
                className="relative flex flex-col items-start w-full sm:flex-row"
              >
                <div className="bg-blue-600 text-white rounded-full border-4 border-white p-2 text-center w-14 h-14 flex flex-col justify-center items-center shadow mr-0 sm:mr-4 mb-3 sm:mb-0 z-10">
                  <p className="text-sm font-bold">{day}</p>
                  <p className="text-[0.6rem]">
                    {month} {year}
                  </p>
                </div>

                <div className="flex flex-col flex-1 w-full overflow-hidden bg-white border border-gray-100 rounded-lg shadow lg:flex-row">
                <div className="flex items-center justify-center w-full p-2 bg-gray-100 lg:w-1/4 h-64">
                  <img
                    src={formation.imageUrl}
                    alt={`Formation ${formation.module_name}`}
                    className="object-contain w-full h-full rounded-md"
                    onError={(e) => {
                      e.target.src = `${DIGITALOCEAN_MODULES_BASE_URL}${DEFAULT_PLACEHOLDER_FILENAME}`;
                    }}
                  />
                </div>


                  <div className="w-full p-4 lg:w-2/3">
                    <Link
                     to={getDetailUrl(formation)}
                      className="text-base font-semibold text-blue-700 hover:underline line-clamp-1"
                    >
                      {formation.module_name}
                    </Link>

                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <span className="mr-1">📅</span>
                        <span>
                          {new Date(formation.dateDebut).toLocaleDateString(
                            "fr-FR"
                          )}{" "}
                          -{" "}
                          {new Date(formation.dateFin).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-1">📍</span>
                        <span>
                          {formation.salle_name}, {formation.salle_quartier}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-1">⏱</span>
                        <span>
                          {formation.duration_days} jours |{" "}
                          {formation.duration_hours} h
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-1">🎖</span>
                        <span>{formation.level}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-3">
                      <div className="flex items-center">
                        <div className="mr-1">
                          {renderRating(formation.average_rating)}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({formation.review_count} avis)
                        </span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">
                        {formation.price_info}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                      {formation.description}
                    </p>

                    <div className="pt-3 mt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="flex items-center">
                          <div className="p-2 mr-3 bg-blue-100 rounded-full">
                            <span className="text-blue-600">👤</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {formation.emp_name} {formation.emp_firstname}
                            </p>
                            <p className="text-xs text-gray-500">Apprenant</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="p-2 mr-3 bg-blue-100 rounded-full">
                            <span className="text-blue-600">🏢</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {formation.etp_name}
                            </p>
                            <p className="text-xs text-gray-500">Entreprise</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                        <div className="px-2 py-1 text-center rounded bg-gray-50">
                          <p className="text-gray-500">Projet</p>
                          <p className="font-medium">
                            {formation.project_status}
                          </p>
                        </div>
                        <div className="px-2 py-1 text-center rounded bg-gray-50">
                          <p className="text-gray-500">Type</p>
                          <p className="font-medium">
                            {formation.project_type}
                          </p>
                        </div>
                        <div className="px-2 py-1 text-center rounded bg-gray-50">
                          <p className="text-gray-500">Présence</p>
                          <p className="font-medium">
                            {formation.taux_de_presence}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default LearnerReporting;