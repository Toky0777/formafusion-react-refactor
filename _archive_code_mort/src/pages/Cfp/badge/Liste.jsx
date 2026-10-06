import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faCircleCheck, faCircleExclamation, faDiagramProject, faCertificate, faTrashCan, faPlus, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../../config/axios';
import Swal from 'sweetalert2';

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

function ListeBadge({ attribution }) {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openAccordionId, setOpenAccordionId] = useState(null);

  // Base URL for images
  const endpoint = 'https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg';
  const navigate = useNavigate();

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/cfp/badge/attribution');

        if (response.data.projets && response.data.projets.length > 0) {
          // C'est cette ligne qui affiche les données dans la console !
          // console.log('Données des projets récupérées :', response.data.projets); 

          setProjets(response.data.projets);


          setOpenAccordionId(response.data.projets[0].idProjet);
        } else {
          console.log('Aucun projet ou données de projets vides reçues.');
        }
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des attributions de badges :', err);
        setError(err.response?.data?.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRedirect = (code) => {
    if (code) {
      navigate(`/verification/${code}`);
    }
  };



  const handleAccordionToggle = (projectId) => {
    setOpenAccordionId(prevId => (prevId === projectId ? null : projectId));
  };

  const handleDeleteAttribution = async (projectId, attributionId) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette attribution de badge sera définitivement supprimée.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {

          const response = await axios.post(`/cfp/badge/attribution/${attributionId}/destroy`);

          if (response.data.status === 200) {
            setSuccessMessage(response.data.message);

            setProjets(prevProjets =>
              prevProjets.map(projet => {
                if (projet.idProjet === projectId) {
                  return {
                    ...projet,
                    attributions: projet.attributions.filter(attr => attr.idAttribution !== attributionId)
                  };
                }
                return projet;
              })
            );
          } else {
            setErrorMessage(response.data.message || "Erreur lors de la suppression");
          }
        } catch (error) {
          console.error('Error deleting attribution:', error);
          setErrorMessage(error.response?.data?.message || "Erreur lors de la suppression");
        }

        // Clear messages after a few seconds
        setTimeout(() => {
          setSuccessMessage('');
          setErrorMessage('');
        }, 5000);
      }
    });

  };

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-4 text-center text-red-600">
          <FontAwesomeIcon icon={faCircleExclamation} className="w-8 h-8 mb-3" />
          <p className="text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg bg-gray-100 min-h-screen font-['Poppins']">
      <div className="py-6 mx-auto max-w-7xl">
        {/* Header */}
        <div className="px-6 py-6 text-white bg-gradient-to-r from-fuchsia-900 to-purple-700 sm:px-8">
          <h2 className="flex items-center text-2xl font-bold font-poppins">
            <FontAwesomeIcon icon={faAward} className="mr-3" />
            <span>Liste des attributions de badges</span>
          </h2>
          <p className="mt-1 font-poppins">Consultez et gérez les badges attribués aux apprenants</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="p-4 mb-6 text-green-700 bg-green-100 border-l-4 border-green-500 rounded-md font-poppins">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded-md font-poppins">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* List of projects in accordion */}
        {projets.length > 0 ? (
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
            <div id="accordionProjects" className="accordion">
              {projets.map((projet) => (
                <div key={projet.idProjet} className="border-b border-gray-200 last:border-b-0">
                  {/* Accordion header for each project */}
                  <h2 className="mb-0" id={`heading-${projet.idProjet}`}>
                    <button
                      className={`relative flex items-center justify-between w-full p-5 text-left bg-purple-100 accordion-button transition-all duration-300 ${openAccordionId !== projet.idProjet ? 'collapsed' : ''}`}
                      type="button"
                      onClick={() => handleAccordionToggle(projet.idProjet)}
                      aria-expanded={openAccordionId === projet.idProjet ? 'true' : 'false'}
                      aria-controls={`collapse-${projet.idProjet}`}
                    >
                      {/* Content on the left */}
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 mr-4 text-white rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600">
                          <FontAwesomeIcon icon={faDiagramProject} />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 font-poppins">{projet.project_title}</h3>
                          <p className="text-sm text-gray-500 font-poppins">Référence: {projet.project_reference}</p>
                        </div>
                      </div>

                      {/* Attribution count on the right */}
                      <div className="flex items-center ml-auto">
                        <span className="px-3 py-1 text-xs font-medium text-purple-800 bg-purple-200 rounded-full font-poppins">
                          {projet.attributions.length} attribution(s)
                        </span>
                        {/* Accordion icon */}
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`accordion-icon ml-4 ${openAccordionId !== projet.idProjet ? 'rotate-[-90deg]' : 'rotate-0'}`}
                        />
                      </div>
                    </button>
                  </h2>

                  {/* Accordion content (attributions) */}
                  <div
                    id={`collapse-${projet.idProjet}`}
                    className={`accordion-collapse overflow-hidden ${openAccordionId === projet.idProjet ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} transition-all duration-500 ease-in-out`}
                    aria-labelledby={`heading-${projet.idProjet}`}
                  >
                    <div className="p-0">
                      <div className="overflow-x-auto">
                        {projet.attributions.length > 0 ? (
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase font-poppins">
                                  Apprenant
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase font-poppins">
                                  Badge
                                </th>
                                <th scope="col" className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:table-cell font-poppins">
                                  Module
                                </th>
                                <th scope="col" className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:table-cell font-poppins">
                                  Date d'attribution
                                </th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase font-poppins">

                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {projet.attributions.map((attribution) => (
                                <tr key={attribution.idAttribution} className="badge-attribution-row hover:bg-purple-50 group">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 w-10 h-10">
                                        <img
                                          className="object-cover w-10 h-10 rounded-full"
                                          src={`${endpoint}/img/employes/${attribution.photo}`}
                                          alt={`${attribution.user_nom} ${attribution.user_prenom}`}
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://ui-avatars.com/api/?name=' +
                                              encodeURIComponent(`${attribution.user_nom} ${attribution.user_prenom}`);
                                          }}
                                        />
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900 font-poppins">
                                          {attribution.user_nom} {attribution.user_prenom}
                                        </div>
                                        <div className="text-xs text-gray-500 font-poppins">
                                          {attribution.user_email}
                                        </div>
                                        <div className="text-xs text-gray-500 font-poppins">
                                          {attribution.customerName}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 w-8 h-8">
                                        <img
                                          className="object-contain w-8 h-8"
                                          src={`${endpoint}/${attribution.badge_image}`}
                                          alt={attribution.badge_titre}
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/80x80/D1D5DB/6B7280?text=Badge';
                                          }}
                                        />
                                      </div>
                                      <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900 font-poppins">
                                          {attribution.badge_titre}
                                        </div>
                                        {attribution.score && (
                                          <div className="text-xs text-gray-500 font-poppins">
                                            Score: {attribution.score}/100
                                          </div>
                                        )}
                                        {attribution.est_verifie === 1 && (
                                          <div className="flex items-center text-xs text-green-600 font-poppins">
                                            <FontAwesomeIcon icon={faCircleCheck} className="mr-1" />
                                            <span>Vérifié</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="hidden px-6 py-4 text-sm text-gray-900 whitespace-nowrap md:table-cell font-poppins">
                                    {attribution.module_titre}
                                  </td>
                                  <td className="hidden px-6 py-4 whitespace-nowrap sm:table-cell">
                                    <div className="text-sm text-gray-900 font-poppins">
                                      {formatDate(attribution.date_attribution)}
                                    </div>
                                    {attribution.date_expiration && (
                                      <div className={`text-xs font-poppins ${new Date(attribution.date_expiration) < new Date()
                                        ? 'text-red-600'
                                        : 'text-gray-500'
                                        }`}>
                                        Expire: {formatDate(attribution.date_expiration)}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                                    <div className="flex items-center justify-center space-x-3 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                                      {attribution.code_verification && (
                                        <button
                                          type="button"
                                          onClick={() => handleRedirect(attribution.code_verification)}
                                          className="text-indigo-600 transition-colors duration-200 hover:text-indigo-900"
                                          title="Voir la vérification"
                                        >
                                          <FontAwesomeIcon icon={faCertificate} />
                                        </button>

                                      )}
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteAttribution(projet.idProjet, attribution.idAttribution)}
                                        className="text-red-600 transition-colors duration-200 hover:text-red-900 badge-attribution-row-hover:opacity-100 delete-btn"
                                        title="Supprimer l'attribution">
                                        <FontAwesomeIcon icon={faTrashCan} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="p-4 text-center text-gray-500 font-poppins">
                            Aucune attribution de badge pour ce projet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 text-purple-500 bg-purple-100 rounded-full">
                <FontAwesomeIcon icon={faAward} className="text-2xl" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 font-poppins">Aucune attribution de badge</h3>
              <p className="mb-6 text-gray-500 font-poppins">Vous n'avez pas encore attribué de badges à vos apprenants.</p>
              <Link
                to="/cfp/badge/attribut"
                className="inline-flex items-center px-4 py-2 text-white transition-all duration-200 rounded-lg shadow bg-gradient-to-r from-fuchsia-700 to-fuchsia-800 hover:shadow-lg btn-primary">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Attribuer un badge
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListeBadge;