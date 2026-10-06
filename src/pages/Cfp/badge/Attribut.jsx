import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faCircleCheck, faCircleExclamation, faMagnifyingGlass, faPlus, faShare } from '@fortawesome/free-solid-svg-icons';
import { FaSpinner } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from '../../../config/axios';
import toastr from 'toastr';
import { useNavigate } from 'react-router-dom';
import { IMAGE_URL } from "../../../config/env";


function Attribut() {
  const [badges, setBadges] = useState([]);
  const [projets, setProjets] = useState([]);
  const [selectedBadgeId, setSelectedBadgeId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedApprenants, setSelectedApprenants] = useState([]);
  const [score, setScore] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [isVerified, setIsVerified] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [apprenantsForProject, setApprenantsForProject] = useState([]);


  const [badgeDetails, setBadgeDetails] = useState(null);
  const [criteres, setCriteres] = useState([]);
  const [competences, setCompetences] = useState([]);
  const endpoint = IMAGE_URL;


  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(null);

  // État pour les erreurs de validation par champ
  const [fieldErrors, setFieldErrors] = useState({
    idBadge: '',
    idProjet: '',
    apprenants: '',
    score: '',
    date_expiration: ''
  });

  // Fonction pour effacer les erreurs d'un champ spécifique
  const clearFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  // Fonction pour définir une erreur sur un champ spécifique
  const setFieldError = (fieldName, errorMessage) => {
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
  };

  // Fonction pour effacer toutes les erreurs
  const clearAllErrors = () => {
    setFieldErrors({
      idBadge: '',
      idProjet: '',
      apprenants: '',
      score: '',
      date_expiration: ''
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get("/cfp/badge/attribution/create")
      .then((response) => {
        const { badges, projets } = response.data;

        if (badges && badges.length > 0) {
          setBadges(badges);
          setProjets(projets);
          setError(null);
        } else {
          setError("Aucun badge trouvé.");
        }
      })
      .catch((err) => {
        console.error(err);

        if (err.response && err.response.status === 404) {
          setBadges([]);
          setProjets([]);
          setError(null);
        } else {
          setError("Erreur lors du chargement des badges.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const selectedBadge = badges.find(badge => badge.idBadge === parseInt(selectedBadgeId));

  useEffect(() => {
    if (selectedBadgeId) {
      clearFieldError('idBadge');
      axios.get(`/cfp/badge/attribution/projets-module/${selectedBadgeId}`)
        .then((res) => {
          setProjets(res.data);
        })
        .catch((err) => {
          console.error("Erreur lors du chargement des projets :", err);
          setProjets([]);
        });
    }
  }, [selectedBadgeId]);

  useEffect(() => {
    if (selectedProjectId) {
      clearFieldError('idProjet');
      setLoading(true);
      axios
        .get(`/cfp/badge/attribution/apprenants-projet/${selectedProjectId}`)
        .then((res) => {
          setApprenantsForProject(res.data);
          setSelectedApprenants([]);
        })
        .catch((err) => {
          console.error("Erreur chargement apprenants :", err);
          setApprenantsForProject([]);
          setSelectedApprenants([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setApprenantsForProject([]);
      setSelectedApprenants([]);
      setLoading(false);
    }
  }, [selectedProjectId]);

  //badge details 
  useEffect(() => {
    if (selectedBadgeId) {
      axios.get(`/cfp/badge/attribution/badge-details/${selectedBadgeId}`)
        .then(res => {
          if (res.data.status === 200) {
            setBadgeDetails(res.data.badge);
            setCriteres(res.data.criteres);
            setCompetences(res.data.competences);
          } else {
            setBadgeDetails(null);
            setCriteres([]);
            setCompetences([]);
          }
        })
        .catch(err => {
          console.error("Erreur récupération des détails du badge :", err);
          setBadgeDetails(null);
          setCriteres([]);
          setCompetences([]);
        });
    } else {
      setBadgeDetails(null);
      setCriteres([]);
      setCompetences([]);
    }
  }, [selectedBadgeId]);

  const handleApprenantToggle = (id) => {
    setSelectedApprenants((prevSelected) => {
      const newSelected = prevSelected.includes(id)
        ? prevSelected.filter((appId) => appId !== id)
        : [...prevSelected, id];

      // Effacer l'erreur si des apprenants sont sélectionnés
      if (newSelected.length > 0) {
        clearFieldError('apprenants');
      }

      return newSelected;
    });
  };

  const handleSelectAllApprenants = (e) => {
    if (e.target.checked) {
      const allApprenantIds = filteredApprenants.map(app => app.idEmploye);
      setSelectedApprenants(allApprenantIds);
      clearFieldError('apprenants');
    } else {
      setSelectedApprenants([]);
    }
  };

  const filteredApprenants = apprenantsForProject.filter(app =>
    `${app.emp_name} ${app.emp_firstname} ${app.emp_email} ${app.customerName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Validation du score en temps réel
  const handleScoreChange = (e) => {
    const value = e.target.value;
    setScore(value);

    // Validation en temps réel
    if (value && (parseInt(value) < 0 || parseInt(value) > 100)) {
      setFieldError('score', 'Le score doit être compris entre 0 et 100.');
    } else {
      clearFieldError('score');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearAllErrors();

    toastr.options = {
      positionClass: "toast-top-center",
      timeOut: 6000,
      progressBar: true,
    };

    // Validation côté client
    let hasErrors = false;

    if (!selectedBadgeId) {
      setFieldError('idBadge', 'Veuillez sélectionner un badge.');
      hasErrors = true;
    }

    if (!selectedProjectId) {
      setFieldError('idProjet', 'Veuillez sélectionner un projet.');
      hasErrors = true;
    }

    if (selectedApprenants.length === 0) {
      setFieldError('apprenants', 'Veuillez sélectionner au moins un apprenant.');
      hasErrors = true;
    }

    if (score && (parseInt(score) < 0 || parseInt(score) > 100)) {
      setFieldError('score', 'Le score doit être compris entre 0 et 100.');
      hasErrors = true;
    }

    if (hasErrors) {
      setErrorMessage('Veuillez corriger les erreurs ci-dessous avant de soumettre.');
      setIsSubmitting(false);
      return;
    }

    // Préparation des données
    const formData = {
      idBadge: selectedBadgeId,
      idProjet: selectedProjectId,
      apprenants: selectedApprenants,
      score: score || null,
      date_expiration: expirationDate || null,
      est_verifie: isVerified
    };

    try {
      const response = await axios.post('/cfp/badge/attribution/store', formData);

      if (response.data.status === 200) {
        setSubmitResponse(response.data);
        toastr.success(response.data.message);
        setTimeout(() => {
          navigate('/liste');
        }, 1200);

        setSelectedApprenants([]);
        setScore('');
        setExpirationDate('');
      } else {
        setErrorMessage(response.data.message || "Une erreur est survenue lors de l'attribution.");
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);

      if (error.response) {
        // Gestion des erreurs de validation du serveur
        if (error.response.data.errors) {
          const serverErrors = error.response.data.errors;

          // Mapper les erreurs du serveur aux champs du formulaire
          Object.keys(serverErrors).forEach(key => {
            const errorMessages = Array.isArray(serverErrors[key])
              ? serverErrors[key]
              : [serverErrors[key]];

            // Mapping des noms de champs du serveur vers les noms de champs du client
            const fieldMapping = {
              'idBadge': 'idBadge',
              'idProjet': 'idProjet',
              'apprenants': 'apprenants',
              'score': 'score',
              'date_expiration': 'date_expiration'
            };

            const clientFieldName = fieldMapping[key] || key;
            if (fieldErrors.hasOwnProperty(clientFieldName)) {
              setFieldError(clientFieldName, errorMessages.join(', '));
            }
          });
        }
        setErrorMessage(error.response.data.message || "Erreur serveur lors de l'attribution.");
      } else if (error.request) {
        setErrorMessage("Pas de réponse du serveur. Vérifiez votre connexion.");
      } else {
        setErrorMessage("Erreur lors de la configuration de la requête.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 bg'>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50  bg-opacity-70 backdrop-blur-[2px]">
          <div className="px-8 py-5 rounded-3xl ">
            <div className="flex flex-col items-center">
              <div class="flex-col gap-4 w-full flex items-center justify-center">
                <div class="w-28 h-28 border-8 text-fuchsia-800 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-fuchsia-700 rounded-full">
                  <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" class="animate-ping">
                    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="py-6 mx-auto max-w-8xl ">
        {/* En-tête */}
        <div className="px-6 py-6 text-white bg-gradient-to-r from-fuchsia-900 to-purple-700 sm:px-8">
          <h2 className="flex items-center text-2xl font-bold font-poppins">
            <FontAwesomeIcon icon={faAward} className="mr-3" />
            <span>Attribution d'un nouveau badge</span>
          </h2>
          <p className="mt-1 font-poppins">Suivez les étapes ci-dessous pour attribuer un badge aux apprenants d'un projet</p>
        </div>

        {/* Message de succès global */}
        {successMessage && (
          <div className="p-4 mb-6 text-green-700 bg-green-100 border-l-4 border-green-500 rounded-md font-poppins">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {/* Message d'erreur global */}
        {errorMessage && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded-md font-poppins">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        {badges.length > 0 ? (
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
            <form onSubmit={handleSubmit} className="p-6">
              {/* Section Badge */}
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-medium text-gray-900 font-poppins">1. Sélectionner un badge</h3>

                <div className="mb-4 form-group">
                  <label htmlFor="idBadge" className="block text-sm font-medium text-gray-700 font-poppins">Badge</label>
                  <select
                    id="idBadge"
                    name="idBadge"
                    className={`block w-full py-2 pl-3 pr-10 mt-1 text-base rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-poppins ${fieldErrors.idBadge
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                      }`}
                    value={selectedBadgeId}
                    onChange={(e) => {
                      setSelectedBadgeId(e.target.value);
                      if (e.target.value) clearFieldError('idBadge');
                    }}
                    required
                  >
                    <option value="">Sélectionnez un badge</option>
                    {badges.map((badge) => (
                      <option key={badge.idBadge} value={badge.idBadge}>
                        {badge.titre} ({badge.moduleName})
                      </option>
                    ))}
                  </select>

                  {fieldErrors.idBadge && (
                    <div className="flex items-center mt-1 text-sm text-red-600">
                      <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" />
                      <span>{fieldErrors.idBadge}</span>
                    </div>
                  )}
                </div>

                {/* Affichage des détails du badge sélectionné */}
                {badgeDetails && (
                  <div id="badgeDetails" className="p-4 mt-4 space-y-4 transition-all duration-300 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <img src={`${endpoint}/${badgeDetails.image_path}`} alt={badgeDetails.titre} className="object-cover w-24 h-24 rounded-lg shadow-md badge-image" />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 font-poppins">{badgeDetails.titre}</h4>
                        <p className="text-sm text-gray-600 font-poppins">{badgeDetails.sous_titre}</p>
                        <p className="text-[13px] text-gray-500 font-poppins mt-1 font-bold">Module : {badgeDetails.module_titre}</p>
                        <p className="mt-2 text-sm text-gray-600 font-poppins">{badgeDetails.description}</p>
                      </div>
                    </div>

                    {/* Compétences */}
                    {competences.length > 0 && (
                      <div>
                        <h5 className="text-sm font-bold text-gray-800 font-poppins">Compétences :</h5>
                        <ul className="pl-5 text-sm text-gray-700 list-disc font-poppins">
                          {competences.map((comp, idx) => (
                            <li key={comp.idCompetence}>{comp.nom_competence}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Critères */}
                    {criteres.length > 0 && (
                      <div>
                        <h5 className="text-sm font-bold text-gray-800 font-poppins">Critères :</h5>
                        <ul className="pl-5 text-sm text-gray-700 list-decimal font-poppins">
                          {criteres.map((crit, idx) => (
                            <li key={crit.idCritere}>{crit.texte_critere}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section Projet */}
              <div className="pt-6 mb-6 border-t border-gray-200">
                <h3 className="mb-4 text-lg font-medium text-gray-900 font-poppins">2. Sélectionner un projet</h3>

                <div className="mb-4 form-group">
                  <label htmlFor="idProjet" className="block text-sm font-medium text-gray-700 font-poppins">Projet</label>
                  <select
                    id="idProjet"
                    name="idProjet"
                    className={`block w-full py-2 pl-3 pr-10 mt-1 text-base rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-poppins ${fieldErrors.idProjet
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                      }`}
                    value={selectedProjectId}
                    onChange={(e) => {
                      setSelectedProjectId(e.target.value);
                      if (e.target.value) clearFieldError('idProjet');
                    }}
                    required
                  >
                    <option value="">Sélectionnez un projet</option>
                    {projets.map((projet) => (
                      !selectedBadgeId ? (
                        <option key={projet.idProjet} value={projet.idProjet}>
                          {projet.project_title} ({projet.project_reference})
                        </option>
                      ) : (
                        <option key={projet.idProjet} value={projet.idProjet}>
                          {projet.project_title} {projet.project_name ?? 'Projet '} ({projet.project_reference}) — du {projet.dateDebut} au {projet.dateFin}
                        </option>
                      )
                    ))}
                  </select>

                  {fieldErrors.idProjet && (
                    <div className="flex items-center mt-1 text-sm text-red-600">
                      <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" />
                      <span>{fieldErrors.idProjet}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section Apprenants */}
              <div className="pt-6 mb-6 border-t border-gray-200">
                <h3 className="mb-4 text-lg font-medium text-gray-900 font-poppins">3. Sélectionner les apprenants</h3>

                {fieldErrors.apprenants && (
                  <div className="flex items-center p-3 mb-4 text-sm text-red-600 border border-red-200 rounded-md bg-red-50">
                    <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />
                    <span>{fieldErrors.apprenants}</span>
                  </div>
                )}

                {selectedProjectId ? (
                  <div className="apprenant-list-container" id="apprenantsContainer">
                    <div className="relative mb-4">
                      <input
                        type="text"
                        id="searchApprenants"
                        placeholder="Rechercher un apprenant..."
                        className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg font-poppins"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute text-gray-400 left-3 top-3" />
                    </div>

                    <div className={`overflow-x-auto rounded-lg border shadow-sm ${fieldErrors.apprenants
                      ? 'border-red-300'
                      : 'border-gray-200'
                      }`}>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="w-12 px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase font-poppins">
                              <input
                                type="checkbox"
                                id="selectAllApprenants"
                                className="text-purple-600 rounded focus:ring-purple-500"
                                onChange={handleSelectAllApprenants}
                                checked={selectedApprenants.length === filteredApprenants.length && filteredApprenants.length > 0}
                              />
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase font-poppins">
                              Apprenant
                            </th>
                            <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:table-cell font-poppins">
                              Email
                            </th>
                            <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:table-cell font-poppins">
                              Entreprise
                            </th>
                          </tr>
                        </thead>
                        <tbody id="apprenantsTableBody" className="bg-white divide-y divide-gray-200">
                          {loading && (
                            <tr>
                              <td colSpan="4" className="py-4 text-center">
                                <div className="flex items-center justify-center p-6 text-indigo-600">
                                  <FaSpinner className="inline-block w-6 h-6 mr-3 animate-spin" />
                                  Chargement des apprenants...
                                </div>
                              </td>
                            </tr>
                          )}
                          {filteredApprenants.length > 0 ? (
                            filteredApprenants.map((apprenant) => (
                              <tr key={apprenant.idEmploye} className="transition-all duration-200 badge-attribution-row hover:bg-purple-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="checkbox"
                                    name="idApprenant[]"
                                    value={apprenant.idEmploye}
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    checked={selectedApprenants.includes(apprenant.idEmploye)}
                                    onChange={() => handleApprenantToggle(apprenant.idEmploye)}
                                  />
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap font-poppins">
                                  <div className="flex items-center">
                                    <img
                                      className="object-cover w-10 h-10 mr-4 rounded-full"
                                      src={`${endpoint}/img/employes/${apprenant.photo}`}
                                      alt={apprenant.emp_name}
                                    />
                                    {apprenant.emp_name} {apprenant.emp_firstname}
                                  </div>
                                </td>
                                <td className="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap sm:table-cell font-poppins">
                                  {apprenant.emp_email}
                                </td>
                                <td className="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:table-cell font-poppins">
                                  {apprenant.customerName}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="px-6 py-4 text-sm text-center text-gray-500 font-poppins">
                                Aucun apprenant trouvé pour ce projet ou ne correspond à la recherche.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between px-6 py-4 mt-4 border-t border-gray-200 rounded-b-lg bg-gray-50">
                      <div>
                        <span className="text-gray-700 font-poppins" id="selectedCount">{selectedApprenants.length} apprenants sélectionnés</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 font-poppins">Veuillez sélectionner un projet pour voir les apprenants.</p>
                )}
              </div>

              {/* Options supplémentaires */}
              <div className="pt-6 mb-6 border-t border-gray-200">
                <h3 className="mb-4 text-lg font-medium text-gray-900 font-poppins">4. Options d'attribution</h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="form-group">
                    <label htmlFor="score" className="block text-sm font-medium text-gray-700 font-poppins">Score (optionnel)</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <input
                        type="number"
                        name="score"
                        id="score"
                        min="0"
                        max="100"
                        className={`block w-full pl-3 pr-12 rounded-md focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-poppins ${fieldErrors.score
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                          }`}
                        placeholder="Score sur 100"
                        value={score}
                        onChange={handleScoreChange}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 sm:text-sm font-poppins">/100</span>
                      </div>
                    </div>

                    {fieldErrors.score && (
                      <div className="flex items-center mt-1 text-sm text-red-600">
                        <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" />
                        <span>{fieldErrors.score}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="date_expiration" className="block text-sm font-medium text-gray-700 font-poppins">Date d'expiration (optionnel)</label>
                    <input
                      type="date"
                      name="date_expiration"
                      id="date_expiration"
                      className={`block w-full mt-1 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-poppins ${fieldErrors.date_expiration
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                        }`}
                      value={expirationDate}
                      onChange={(e) => {
                        setExpirationDate(e.target.value);
                        clearFieldError('date_expiration');
                      }}
                    />

                    {fieldErrors.date_expiration && (
                      <div className="flex items-center mt-1 text-sm text-red-600">
                        <FontAwesomeIcon icon={faCircleExclamation} className="mr-1" />
                        <span>{fieldErrors.date_expiration}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 form-group">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="est_verifie"
                      id="est_verifie"
                      value="1"
                      checked={isVerified}
                      onChange={(e) => setIsVerified(e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="est_verifie" className="block ml-2 text-sm text-gray-700 font-poppins">
                      Badge vérifié (attesté par le centre de formation)
                    </label>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex justify-end pt-6 space-x-3 border-t border-gray-200">
                <Link
                  to="/attribut"
                  className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100 font-poppins btn-link"
                >
                  Annuler
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center px-5 py-2 text-white transition-all duration-200 rounded-lg shadow bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg font-poppins btn-primary ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="inline-block mr-2 animate-spin" />
                      <span>En cours...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faShare} className="mr-2" />
                      <span>Attribuer Badge</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow font-poppins">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 text-purple-500 bg-purple-100 rounded-full">
                <FontAwesomeIcon icon={faAward} className="text-2xl" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">Impossible d'attribuer un badge</h3>
              <p className="mb-6 text-gray-500">Vous n'avez pas encore créé de badges.</p>
              <div className="inline-flex items-center px-4 py-2 text-white transition-all duration-200 rounded-lg shadow bg-gradient-to-r from-fuchsia-700 to-fuchsia-800 hover:shadow-lg btn-primary">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                <Link to="/cfp/badge/creer">Créer un badge</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attribut;
// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faAward, faCircleCheck, faCircleExclamation, faMagnifyingGlass, faPlus, faShare } from '@fortawesome/free-solid-svg-icons';
// import { FaSpinner } from "react-icons/fa";
// import { Link } from 'react-router-dom';
// import axios from '../axios';
// import toastr from 'toastr';
// import { useNavigate } from 'react-router-dom';


// function Attribut() {
//   const [badges, setBadges] = useState([]);
//   const [projets, setProjets] = useState([]);
//   const [selectedBadgeId, setSelectedBadgeId] = useState('');
//   const [selectedProjectId, setSelectedProjectId] = useState('');
//   const [selectedApprenants, setSelectedApprenants] = useState([]);
//   const [score, setScore] = useState('');
//   const [expirationDate, setExpirationDate] = useState('');
//   const [isVerified, setIsVerified] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [apprenantsForProject, setApprenantsForProject] = useState([]);


//   const [badgeDetails, setBadgeDetails] = useState(null);
//   const [criteres, setCriteres] = useState([]);
//   const [competences, setCompetences] = useState([]);
//   const endpoint = IMAGE_URL;


//   const navigate = useNavigate();
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [formErrors, setFormErrors] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitResponse, setSubmitResponse] = useState(null);



//   useEffect(() => {
//     setIsLoading(true);
//     axios.get("/cfp/badge/attribution/create")
//       .then((response) => {
//         const { badges, projets } = response.data;
//         // console.log("Badges reçus:", badges);
//         // console.log("Projets reçus:", projets);

//         if (badges && badges.length > 0) {
//           setBadges(badges);
//           setProjets(projets);
//           setError(null);
//         } else {
//           setError("Aucun badge trouvé.");
//         }
//       })
//       .catch((err) => {
//         console.error(err);

//         if (err.response && err.response.status === 404) {
//           setBadges([]);
//           setProjets([]);
//           setError(null);
//         } else {
//           setError("Erreur lors du chargement des badges.");
//         }
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }, []);



//   const selectedBadge = badges.find(badge => badge.idBadge === parseInt(selectedBadgeId));

//   useEffect(() => {
//     if (selectedBadgeId) {
//       axios.get(`/cfp/badge/attribution/projets-module/${selectedBadgeId}`)
//         .then((res) => {
//           setProjets(res.data);
//           // console.log("modules:" , res.data);

//         })
//         .catch((err) => {
//           console.error("Erreur lors du chargement des projets :", err);
//           setProjets([]); // vide si erreur
//         });
//     }
//   }, [selectedBadgeId]);


//   useEffect(() => {
//     if (selectedProjectId) {
//       setLoading(true);
//       axios
//         .get(`/cfp/badge/attribution/apprenants-projet/${selectedProjectId}`)
//         .then((res) => {
//           // console.log('Apprenants chargés :', res.data);
//           setApprenantsForProject(res.data);
//           setSelectedApprenants([]); // reset sélection
//         })
//         .catch((err) => {
//           console.error("Erreur chargement apprenants :", err);
//           setApprenantsForProject([]);
//           setSelectedApprenants([]);
//         })
//         .finally(() => {
//           setLoading(false); // Set loading to false after success or error
//         });
//     } else {
//       setApprenantsForProject([]);
//       setSelectedApprenants([]);
//       setLoading(false);
//     }
//   }, [selectedProjectId]);



//   //badge details
//   useEffect(() => {
//     if (selectedBadgeId) {
//       axios.get(`/cfp/badge/attribution/badge-details/${selectedBadgeId}`)
//         .then(res => {
//           if (res.data.status === 200) {
//             setBadgeDetails(res.data.badge);
//             // console.log("badgeD:",res.data.badge);

//             setCriteres(res.data.criteres);
//             // console.log("critéres:",res.data.criteres);

//             setCompetences(res.data.competences);
//             // console.log("compétences:", res.data.competences);
//           } else {
//             setBadgeDetails(null);
//             setCriteres([]);
//             setCompetences([]);
//           }
//         })
//         .catch(err => {
//           console.error("Erreur récupération des détails du badge :", err);
//           setBadgeDetails(null);
//           setCriteres([]);
//           setCompetences([]);
//         });
//     } else {
//       setBadgeDetails(null);
//       setCriteres([]);
//       setCompetences([]);
//     }
//   }, [selectedBadgeId]);



//   const handleApprenantToggle = (id) => {
//     setSelectedApprenants((prevSelected) =>
//       prevSelected.includes(id)
//         ? prevSelected.filter((appId) => appId !== id)
//         : [...prevSelected, id]
//     );
//   };

//   const filteredApprenants = apprenantsForProject.filter(app =>
//     `${app.emp_name} ${app.emp_firstname} ${app.emp_email} ${app.customerName}`.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSuccessMessage('');
//     setErrorMessage('');
//     setFormErrors([]);

//     toastr.options = {
//       positionClass: "toast-top-center", // ou "toast-bottom-left"
//       timeOut: 6000,
//       progressBar: true,
//     };


//     // Validation
//     const errors = [];
//     if (!selectedBadgeId) errors.push('Veuillez sélectionner un badge.');
//     if (!selectedProjectId) errors.push('Veuillez sélectionner un projet.');
//     if (selectedApprenants.length === 0) errors.push('Veuillez sélectionner au moins un apprenant.');

//     if (errors.length > 0) {
//       setFormErrors(errors);
//       setErrorMessage('Des erreurs sont survenues lors de la soumission du formulaire.');
//       setIsSubmitting(false);
//       return;
//     }

//     // Préparation des données
//     const formData = {
//       idBadge: selectedBadgeId,
//       idProjet: selectedProjectId,
//       apprenants: selectedApprenants,
//       score: score || null,
//       date_expiration: expirationDate || null,
//       est_verifie: isVerified
//     };

//     try {
//       const response = await axios.post('/cfp/badge/attribution/store', formData);

//       if (response.data.status === 200) {
//         // setSuccessMessage(response.data.message);
//         setSubmitResponse(response.data);

//         toastr.success(response.data.message);
//         setTimeout(() => {
//           navigate('/liste');
//         }, 1200);

//         setSelectedApprenants([]);
//         setScore('');
//         setExpirationDate('');
//       } else {
//         setErrorMessage(response.data.message || "Une erreur est survenue lors de l'attribution.");
//       }
//     } catch (error) {
//       console.error('Erreur lors de la soumission:', error);

//       if (error.response) {
//         // Erreurs de validation du serveur
//         if (error.response.data.errors) {
//           const serverErrors = Object.values(error.response.data.errors).flat();
//           setFormErrors(serverErrors);
//         }
//         setErrorMessage(error.response.data.message || "Erreur serveur lors de l'attribution.");
//       } else if (error.request) {
//         setErrorMessage("Pas de réponse du serveur. Vérifiez votre connexion.");
//       } else {
//         setErrorMessage("Erreur lors de la configuration de la requête.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (


//     <div className='min-h-screen bg-gray-100 bg'>

//       {isLoading && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50  bg-opacity-70 backdrop-blur-[2px]">
//           <div className="px-8 py-5 rounded-3xl ">
//             <div className="flex flex-col items-center">

//               <div class="flex-col gap-4 w-full flex items-center justify-center">
//                 <div class="w-28 h-28 border-8 text-fuchsia-800 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-fuchsia-700 rounded-full">
//                   <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" class="animate-ping">
//                     <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"></path>
//                   </svg>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       )}


//       <div className="py-6 mx-auto max-w-7xl ">
//         {/* En-tête */}
//         <div className="px-6 py-6 text-white bg-gradient-to-r from-fuchsia-900 to-purple-700 sm:px-8">
//           <h2 className="flex items-center text-2xl font-bold font-poppins">
//             <FontAwesomeIcon icon={faAward} className="mr-3" />
//             <span>Attribution d'un nouveau badge</span>
//           </h2>
//           <p className="mt-1 font-poppins">Suivez les étapes ci-dessous pour attribuer un badge aux apprenants d'un projet</p>
//         </div>

//         {/* Message de succès/erreur */}
//         {successMessage && (
//           <div className="p-4 mb-6 text-green-700 bg-green-100 border-l-4 border-green-500 rounded-md font-poppins">
//             <div className="flex items-center">
//               <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
//               <p>{successMessage}</p>
//             </div>
//           </div>
//         )}

//         {(errorMessage || formErrors.length > 0) && (
//           <div className="p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded-md font-poppins">
//             <div className="flex items-center">
//               <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />
//               {errorMessage ? (
//                 <p>{errorMessage}</p>
//               ) : (
//                 <div>
//                   <p className="font-medium">Des erreurs sont survenues :</p>
//                   <ul className="mt-2 list-disc list-inside">
//                     {formErrors.map((error, index) => (
//                       <li key={index}>{error}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Contenu principal */}
//         {badges.length > 0 ? (
//           <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
//             <form onSubmit={handleSubmit} className="p-6">
//               {/* Section Badge */}
//               <div className="mb-6">
//                 <h3 className="mb-4 text-lg font-medium text-gray-900 font-poppins">1. Sélectionner un badge</h3>

//                 <div className="mb-4 form-group">
//                   <label htmlFor="idBadge" className="block text-sm font-medium text-gray-700 font-poppins">Badge</label>
//                   <select
//                     id="idBadge"
//                     name="idBadge"
//                     className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-poppins"
//                     value={selectedBadgeId}
//                     onChange={(e) => setSelectedBadgeId(e.target.value)}
//                     required
//                   >
//                     <option value="">Sélectionnez un badge</option>
//                     {badges.map((badge) => (
//                       <option key={badge.idBadge} value={badge.idBadge}>
//                         {badge.titre} ({badge.moduleName})
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Affichage des détails du badge sélectionné */}
//                 {badgeDetails && (
//                   <div id="badgeDetails" className="p-4 mt-4 space-y-4 transition-all duration-300 border border-gray-200 rounded-lg bg-gray-50">
//                     <div className="flex items-center space-x-4">
//                       <img src={`${endpoint}/${badgeDetails.image_path}`} alt={badgeDetails.titre} className="object-cover w-24 h-24 rounded-lg shadow-md badge-image" />
//                       <div>
//                         <h4 className="text-lg font-semibold text-gray-900 font-poppins">{badgeDetails.titre}</h4>
//                         <p className="text-sm text-gray-600 font-poppins">{badgeDetails.sous_titre}</p>
//                         <p className="text-[13px] text-gray-500 font-poppins mt-1 font-bold">Module : {badgeDetails.module_titre}</p>
//                         <p className="mt-2 text-sm text-gray-600 font-poppins">{badgeDetails.description}</p>
//                       </div>

//                     </div>

//                     {/* Compétences */}
//                     {competences.length > 0 && (
//                       <div>
//                         <h5 className="text-sm font-bold text-gray-800 font-poppins">Compétences :</h5>
//                         <ul className="pl-5 text-sm text-gray-700 list-disc font-poppins">
//                           {competences.map((comp, idx) => (
//                             <li key={comp.idCompetence}>{comp.nom_competence}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}

//                     {/* Critères */}
//                     {criteres.length > 0 && (
//                       <div>
//                         <h5 className="text-sm font-bold text-gray-800 font-poppins">Critères :</h5>
//                         <ul className="pl-5 text-sm text-gray-700 list-decimal font-poppins">
//                           {criteres.map((crit, idx) => (
//                             <li key={crit.idCritere}>{crit.texte_critere}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 )}

//               </div>

//               {/* Section Projet */}
//               <div className="pt-6 mb-6 border-t border-gray-200">
//                 <h3 className="mb-4 text-lg font-medium text-gray-900 font-poppins">2. Sélectionner un projet</h3>

//                 <div className="mb-4 form-group">
//                   <label htmlFor="idProjet" className="block text-sm font-medium text-gray-700 font-poppins">Projet</label>
//                   <select
//                     id="idProjet"
//                     name="idProjet"
//                     className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-poppins"
//                     value={selectedProjectId}
//                     onChange={(e) => setSelectedProjectId(e.target.value)}
//                     required
//                   >
//                     <option value="">Sélectionnez un projet</option>
//                     {projets.map((projet) => (

//                       !selectedBadgeId ? (
//                         <option key={projet.idProjet} value={projet.idProjet}>
//                           {projet.project_title} ({projet.project_reference})
//                         </option>
//                       ) : (
//                         <option key={projet.idProjet} value={projet.idProjet}>
//                           {projet.project_title} {projet.project_name ?? 'Projet '} ({projet.project_reference}) — du {projet.dateDebut} au {projet.dateFin}
//                         </option>
//                       )
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Section Apprenants */}
//               <div className="pt-6 mb-6 border-t border-gray-200">
//                 <h3 className="mb-4 text-lg font-medium text-gray-900 font-poppins">3. Sélectionner les apprenants</h3>

//                 {selectedProjectId ? (
//                   <div className="apprenant-list-container" id="apprenantsContainer">
//                     <div className="relative mb-4">
//                       <input
//                         type="text"
//                         id="searchApprenants"
//                         placeholder="Rechercher un apprenant..."
//                         className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg font-poppins"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                       />
//                       <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute text-gray-400 left-3 top-3" />
//                     </div>

//                     <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                           <tr>

//                             <th className="w-12 px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase font-poppins">
//                               <input
//                                 type="checkbox"
//                                 id="selectAllApprenants"
//                                 className="text-purple-600 rounded focus:ring-purple-500"

//                                 checked={selectedApprenants.length === filteredApprenants.length && filteredApprenants.length > 0}
//                               />
//                             </th>
//                             <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase font-poppins">
//                               Apprenant
//                             </th>
//                             <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:table-cell font-poppins">
//                               Email
//                             </th>
//                             <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:table-cell font-poppins">
//                               Entreprise
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody id="apprenantsTableBody" className="bg-white divide-y divide-gray-200">
//                           {loading && (
//                             <tr>
//                               <td colSpan="4" className="py-4 text-center">
//                                 <div className="flex items-center justify-center p-6 text-indigo-600">
//                                   <FaSpinner className="inline-block w-6 h-6 mr-3 animate-spin" />
//                                   Chargement des apprenants...
//                                 </div>
//                               </td>
//                             </tr>
//                           )}
//                           {filteredApprenants.length > 0 ? (
//                             filteredApprenants.map((apprenant) => (
//                               <tr key={apprenant.idEmploye} className="transition-all duration-200 badge-attribution-row hover:bg-purple-50">
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <input
//                                     type="checkbox"
//                                     name="idApprenant[]"
//                                     value={apprenant.idEmploye}
//                                     className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"

//                                     onChange={() => handleApprenantToggle(apprenant.idEmploye)}
//                                   />
//                                 </td>
//                                 <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap font-poppins">
//                                   <div className="flex items-center ">
//                                     <img
//                                       className="object-cover w-10 h-10 mr-4 rounded-full"
//                                       src={`${endpoint}/img/employes/${apprenant.photo}`}
//                                       alt={apprenant.emp_name}
//                                     />
//                                     {apprenant.emp_name} {apprenant.emp_firstname}
//                                   </div>
//                                 </td>
//                                 <td className="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap sm:table-cell font-poppins">
//                                   {apprenant.emp_email}
//                                 </td>
//                                 <td className="hidden px-6 py-4 text-sm text-gray-500 whitespace-nowrap md:table-cell font-poppins">
//                                   {apprenant.customerName}
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="4" className="px-6 py-4 text-sm text-center text-gray-500 font-poppins">
//                                 Aucun apprenant trouvé pour ce projet ou ne correspond à la recherche.
//                               </td>
//                             </tr>
//                           )}


//                         </tbody>
//                       </table>
//                     </div>

//                     <div className="flex items-center justify-between px-6 py-4 mt-4 border-t border-gray-200 rounded-b-lg bg-gray-50">
//                       <div>
//                         <span className="text-gray-700 font-poppins" id="selectedCount">{selectedApprenants.length} apprenants sélectionnés</span>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-gray-500 font-poppins">Veuillez sélectionner un projet pour voir les apprenants.</p>
//                 )}
//               </div>

//               {/* Options supplémentaires */}
//               <div className="pt-6 mb-6 border-t border-gray-200">
//                 <h3 className="mb-4 text-lg font-medium text-gray-900 font-poppins">4. Options d'attribution</h3>

//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <div className="form-group">
//                     <label htmlFor="score" className="block text-sm font-medium text-gray-700 font-poppins">Score (optionnel)</label>
//                     <div className="relative mt-1 rounded-md shadow-sm">
//                       <input
//                         type="number"
//                         name="score"
//                         id="score"
//                         min="0"
//                         max="100"
//                         className="block w-full pl-3 pr-12 border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-poppins"
//                         placeholder="Score sur 100"
//                         value={score}
//                         onChange={(e) => setScore(e.target.value)}
//                       />
//                       <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                         <span className="text-gray-500 sm:text-sm font-poppins">/100</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="form-group">
//                     <label htmlFor="date_expiration" className="block text-sm font-medium text-gray-700 font-poppins">Date d'expiration (optionnel)</label>
//                     <input
//                       type="date"
//                       name="date_expiration"
//                       id="date_expiration"
//                       className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-poppins"
//                       value={expirationDate}
//                       onChange={(e) => setExpirationDate(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4 form-group">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       name="est_verifie"
//                       id="est_verifie"
//                       value="1"
//                       checked={isVerified}
//                       onChange={(e) => setIsVerified(e.target.checked)}
//                       className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
//                     />
//                     <label htmlFor="est_verifie" className="block ml-2 text-sm text-gray-700 font-poppins">
//                       Badge vérifié (attesté par le centre de formation)
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* Boutons */}
//               <div className="flex justify-end pt-6 space-x-3 border-t border-gray-200">
//                 <Link to="/attribut" // Replace with your actual route for cancellation
//                   className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100 font-poppins btn-link"
//                 >
//                   Annuler
//                 </Link>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className={`flex items-center px-5 py-2 text-white transition-all duration-200 rounded-lg shadow bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg font-poppins btn-primary ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
//                     }`}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <FaSpinner className="inline-block mr-2 animate-spin" />
//                       <span>En cours...</span>
//                     </>
//                   ) : (
//                     <>
//                       <FontAwesomeIcon icon={faShare} className="mr-2" />
//                       <span>Attribuer Badge</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         ) : (
//           <div className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow font-poppins">
//             <div className="flex flex-col items-center justify-center">
//               <div className="flex items-center justify-center w-16 h-16 mb-4 text-purple-500 bg-purple-100 rounded-full">
//                 <FontAwesomeIcon icon={faAward} className="text-2xl" />
//               </div>
//               <h3 className="mb-2 text-lg font-medium text-gray-900">Impossible d'attribuer un badge</h3>
//               <p className="mb-6 text-gray-500">Vous n'avez pas encore créé de badges.</p>
//               <div
//                 href="/cfp/badge/create" // Replace with your actual route for creating a badge
//                 className="inline-flex items-center px-4 py-2 text-white transition-all duration-200 rounded-lg shadow bg-gradient-to-r from-fuchsia-700 to-fuchsia-800 hover:shadow-lg btn-primary"
//               >
//                 <FontAwesomeIcon icon={faPlus} className="mr-2" />
//                 <Link to="/create">Créer un badge</Link>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );


// }

// export default Attribut;