import React, { useState, useEffect } from 'react';
import { X, Edit, User, Building, MapPin, Calendar, BarChart3, Clock } from 'lucide-react';
import { useStateContext } from '../../../Context/ContextProvider';
import axios from 'axios';
import { formatDate, formatDateString } from '../../../../utils/dateUtils';
import LoadingSpinner from '../../LoadingSpinner';

const DrawerEtp = ({ isOpen, onClose, type, data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // États pour les données des différents drawers
  const [trainerProfil, setTrainerProfil] = useState({});
  const [moduleSession, setModuleSession] = useState({});
  const [clientData, setClientData] = useState({});
  const [loadingTrainer, setLoadingTrainer] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [loadingClient, setLoadingClient] = useState(false);
  
  // Contexte pour l'API
  const { token, api_base_url, hasRole } = useStateContext();


  useEffect(() => {
    if (isOpen && data) {
      setIsVisible(true);
      // Petit délai pour permettre l'animation
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      setIsAnimating(false);
      // Attendre la fin de l'animation avant de cacher
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, data]);

  // Effet pour charger les données du formateur quand le type est 'trainer'
  useEffect(() => {
    const fetchData = async () => {
      if (type === 'trainer' && data && data !== null) {
        setLoadingTrainer(true);
        const route = hasRole('Référent') ? `${api_base_url}etp/projets/formateur/${data}/mini-cv` : `${api_base_url}projetsForm/${data}/mini-cv`
        try {
          const response = await axios.get(route, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Trainer data:', response.data);
          setTrainerProfil(response.data);
        } catch (error) {
          console.error('Erreur lors du chargement du profil formateur:', error);
          setTrainerProfil({});
        } finally {
          setLoadingTrainer(false);
        }
      } else if (type === 'sessions' && data && data !== null) {
        setLoadingSession(true);
        const route = hasRole('Référent') ? `${api_base_url}etp/projets/session-drawer/${data.projectId}` : `${api_base_url}projetsForm/${data.projectId}/session-drawer/`
        try {
          const response = await axios.get(route, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setModuleSession(response.data)
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingSession(false)
        }
      } else if (type === 'client' && data && data !== null) {
        setLoadingClient(true);
        const route = hasRole('Référent') ? `${api_base_url}etp/projets/session-drawer/${data.projectId}` : `${api_base_url}projetsForm/etp-drawer/${data.clientId}`
        try {
          const response = await axios.get(route, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setClientData(response.data)
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingClient(false)
        }
      }
    };

    fetchData();
  }, [type, data, api_base_url, token]);

  // Réinitialiser les données quand le drawer se ferme
  useEffect(() => {
    if (!isOpen) {
      setTrainerProfil({});
      setLoadingTrainer(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Empêcher le rendu si le drawer n'est pas visible
  if (!isVisible) return null;

  const getDrawerTitle = () => {
    switch (type) {
      case 'participants':
        return 'Participants du projet';
      case 'client':
        return 'Informations client';
      case 'trainer':
        return 'Profil formateur';
      case 'sessions':
        return 'Sessions de formation';
      case 'location':
        return 'Localisation';
      case 'evaluation':
        return 'Évaluations';
      default:
        return 'Détails';
    }
  };

  const getDrawerIcon = () => {
    switch (type) {
      case 'participants':
        return <User className="w-6 h-6" />;
      case 'client':
        return <Building className="w-6 h-6" />;
      case 'trainer':
        return <User className="w-6 h-6" />;
      case 'sessions':
        return <Clock className="w-6 h-6" />;
      case 'location':
        return <MapPin className="w-6 h-6" />;
      case 'evaluation':
        return <BarChart3 className="w-6 h-6" />;
      default:
        return <Calendar className="w-6 h-6" />;
    }
  };

  const renderContent = () => {
    // Vérifier que les données sont présentes
    if (!data) {
      return (
        <div className="p-6 text-center">
          <div className="w-12 h-12 mx-auto text-gray-400 mb-4">
            {getDrawerIcon()}
          </div>
          <p className="text-gray-500">Aucune donnée disponible</p>
        </div>
      );
    }

    switch (type) {
      case 'participants':
        return renderParticipantsContent();
      case 'client':
        return renderClientContent();
      case 'trainer':
        return renderTrainerContent();
      case 'sessions':
        return renderSessionsContent();
      case 'location':
        return renderLocationContent();
      case 'evaluation':
        return renderEvaluationContent();
      default:
        return <div className="p-4">Contenu non disponible</div>;
    }
  };

  const renderParticipantsContent = () => {
    if (!data?.apprs) {
      return (
        <div className="p-6 text-center">
          <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Aucun participant trouvé</p>
        </div>
      );
    }
    
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className='flex w-full items-center'>
            <div className="w-28 h-20 rounded-xl overflow-hidden shadow-lg">
              <img 
                src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/modules/${data.module_image}`} 
                alt="Formation" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 m-2">
                {data.module_name || 'Projet'}
              </h3>
              <p className="text-xs m-2">{data.project_description || 'Projet'}</p>
            </div>
          </div>
          <p className="text-gray-600 mt-4">
            <span className="text-gray-600 font-bold">Nombres d'apprenants : </span>
            {data.apprs.length} participant(s) inscrit(s)
          </p>
        </div>

        <div className="space-y-4">
          {data.apprs.map((participant, index) => (
            <div key={participant.idEmploye || index} className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
              <img
                src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/employes/${participant.emp_photo}`} 
                alt={participant.emp_name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-4 flex-1">
                <h4 className="font-medium text-gray-900">{participant.emp_name}</h4>
                <p className="text-sm text-gray-500">{participant.emp_firstname}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderClientContent = () => {
    if (loadingClient) {
      return <>
        <LoadingSpinner />
      </>
    }
    return (
      <div class="flex flex-col w-full">
        <a data-bs-toggle="offcanvas" href="offcanvasEtp" class="w-10 h-10 rounded-md hover:bg-gray-200 duration-200 absolute top-1 right-1 cursor-pointer flex items-center justify-center">
          <i class="fa-solid fa-xmark text-gray-500"></i>
        </a>

        <div class="w-full p-3">
          <div class="w-full inline-flex items-center gap-3">
            <div class="w-[116px] h-[77px] bg-white flex items-center justify-center p-1">
              <img object-cover="" class="w-audo h-16 rounded-xl grayscale" src="/img/logo/Logo_mark.svg" alt="IHRS"/>
            </div>
            <div class="flex flex-col justify-start gap-y-2 w-full">
              <h3 class="text-2xl font-bold text-gray-700 text-left">{clientData?.customer?.customerName || 'Entreprise non identifiée'}</h3>
              <p class="text-base text-gray-500 text-left">{clientData.customer.customerEmail}</p>
              <p class="text-base text-gray-500 text-left">Site web: {clientData.customer.siteWeb || 'Site non identifié'}</p>
              <p class="text-base text-gray-500 text-left">Telephone: {clientData.customer.customerPhone || 'Aucun contact téléphonique'}</p>
              <p class="text-base text-gray-500 text-left">Addresse:   {clientData.customer.customer_addr_lot + ' ' + clientData.customer.customer_addr_quartier || 'Aucun contact téléphonique'}</p>
            </div>
          </div>
        </div>

        <div class="w-full p-4">
          <div>
            <ul role="list" class="divide-y divide-gray-200 ">
              <div>
                  <p class="text-xl font-semibold text-gray-900">Référent principal</p>
              </div>
                                  
              <li class="pt-3 pb-0 sm:pt-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full text-gray-500 font-bold text-2xl text-center bg-gray-200 relative">
                      <p class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">G</p>        
                    </div>
                  </div>
                  <div class="flex-1 min-w-0 ms-4 ">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      <i class="fa-solid fa-user text-sm"></i>
                      {clientData.referents[0].firstName} (fonction non renseignée)
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                      <i class="fa-solid fa-envelope text-sm"></i>
                          {clientData.referents[0].email}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                      <i class="fa-solid fa-phone text-sm"></i>
                          {clientData.referents[0].phone || 'non renseigné'}
                    </p>
                  </div>
                </div>
              </li> 
            </ul>
          </div>
          <div class="mt-4">
            <ul role="list" class="divide-y divide-gray-200">
              <div>
                  <p class="text-xl font-semibold text-gray-900">Autres référents</p>
              </div>  
            </ul>
          </div>
          <div class="mt-4" id="title_future"></div>
          <div class="mt-1 table-responsive" id="project_future">
            <table class="table table-hover table-sm" id="table_future" style={{ display: "none" }}>
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Cours</th>
                        <th scope="col">Ref</th>
                        <th scope="col"><i class="fa-solid fa-user"></i></th>
                        <th scope="col">Montant (Ar)</th>
                        <th scope="col">Date</th>
                    </tr>
                </thead>
                <tbody id="body_project_future"></tbody>
            </table>
          </div>
          <div class="mt-4" id="title_in_progress"></div>
          <div class="mt-1 table-responsive" id="project_in_progress">
              <table class="table table-hover table-sm" id="table_in_progress" style={{ display: "none"}}>
                  <thead>
                      <tr>
                          <th scope="col"></th>
                          <th scope="col">Cours</th>
                          <th scope="col">Ref</th>
                          <th scope="col"><i class="fa-solid fa-user"></i></th>
                          <th scope="col">Montant (Ar)</th>
                          <th scope="col">Date</th>
                      </tr>
                  </thead>
                  <tbody id="body_project_in_progress">
                      
                  </tbody>
              </table>
          </div>
          <div class="mt-4" id="title_finished">
            <span class="text-md rounded-xl py-1 px-3 text-white bg-[#95CF92]"> Terniné </span></div>
            <div class="mt-1 table-responsive" id="project_finished">
                <table class="table table-hover table-sm" id="table_finished">
                  <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Cours</th>
                        <th scope="col">Ref</th>
                        <th scope="col"><i class="fa-solid fa-user"></i></th>
                        <th scope="col">Montant (Ar)</th>
                        <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody id="body_project_finished">    
                    <tr>
                        <td scope="row">1</td>
                        <td>Analyse moderne dans Excel</td>
                        <td>ihrs</td>
                        <td class="text-center">11</td>
                        <td>1.76M Ar</td>
                        <td>17.10.24 - 24.10.24</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="mt-4" id="title_fenced"></div>
              <div class="mt-1 table-responsive" id="project_fenced">
                <table class="table table-hover table-sm" id="table_fenced" style={{ display: "none"}}>
                  <thead>
                      <tr>
                          <th scope="col"></th>
                          <th scope="col">Cours</th>
                          <th scope="col">Ref</th>
                          <th scope="col"><i class="fa-solid fa-user text-sm"></i></th>
                          <th scope="col">Montant (Ar)</th>
                          <th scope="col">Début - Fin</th>
                      </tr>
                  </thead>
                  <tbody id="body_project_fenced">
                      
                  </tbody>
                </table>
              </div>
          </div>
      </div>
    );
  };

  const renderTrainerContent = () => {
    
    if (loadingTrainer) {
      return (
        <div className="p-6">
          <div className="flex items-center mb-6">
            <User className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Profil du formateur
              </h3>
              <p className="text-gray-600">ID: {data || 'N/A'}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">
                Chargement des informations du formateur...
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (!trainerProfil || Object.keys(trainerProfil).length === 0) {
      return (
        <div className="p-6">
          <div className="flex items-center mb-6">
            <User className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Profil du formateur
              </h3>
              <p className="text-gray-600">ID: {data || 'N/A'}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">
              Aucune information disponible pour ce formateur.
            </p>
          </div>
        </div>
      );
    }

    // Rendu avec les données du formateur
    return (
      <div class="flex flex-col w-full">
        <span class="inline-flex items-center justify-end absolute z-10 top-1 right-1">
          
            <a data-bs-toggle="offcanvas" href="#offcanvasCvForm_2028" class="w-10 h-10 rounded-md hover:bg-gray-200 duration-200 cursor-pointer flex items-center justify-center">
                <i class="fa-solid fa-xmark text-gray-500" aria-hidden="true"></i>
            </a>
        </span>

        <div class="w-full flex flex-col p-3 relative">
            <div class="w-full h-40 rounded-3xl p-4">
                <div class="grid grid-cols-4 items-center gap-2">
                    <div class="grid col-span-1 grid-cols-subgrid">
                        <div class="w-32 h-32 rounded-full p-2">
                            <span class="photo_formateur_cv_2028">
                              <img src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/formateurs/${trainerProfil.form.photo}`} alt="profil" class="object-cover w-full h-full rounded-full"/>
                            </span>
                        </div>
                    </div>
                    <div class="grid col-span-3 grid-cols-subgrid">
                        <div class="ml-3 flex flex-col justify-start gap-y-2 w-full">
                            <h5 class="text-lg font-bold text-gray-700 line-clamp-2 text-left get_name_form_2028">{trainerProfil.form.name} {trainerProfil.form.firstName}</h5>
                            <p class="text-base text-gray-500 text-left get_fonction_form_2028">Formateur</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full flex flex-col p-3 gap-y-6">
            <div class="w-full p-3 border-[1px] flex flex-col border-gray-200 border-dashed rounded-md">
              <div class="flex justify-between align-center">
                  <div class="">
                    <h5 class="text-lg font-semibold text-gray-600">Email :</h5>
                  </div>
                  <div class="">
                    <p class="text-sm text-gray-400 get_email_form_2028">{trainerProfil.form.email}</p>
                  </div>
              </div>
              <div class="flex justify-between align-center">
                  <div class="">
                    <h5 class="text-lg font-semibold text-gray-600">Téléphone :</h5>
                  </div>
                  <div class="">
                    <p class="text-sm text-gray-400 get_tel_form_2028">{trainerProfil.form.phone}</p>
                  </div>
              </div>
            </div>

            <div class="w-full p-3 border-[1px] flex flex-col gap-2 border-gray-200 border-dashed rounded-md">
              <div class="flex flex-col w-full gap-y-1">
                  <h5 class="text-lg font-semibold text-gray-600">Expériences</h5>
                  {trainerProfil.experiences.length === 0 && (
                    <ul class="flex flex-col w-full get_exp_form_2028">
                      <li class="w-full text-base text-gray-400">Aucune expérience</li>
                    </ul>
                  )}
                  {trainerProfil.experiences.length > 0 && (
                    <ul class="flex flex-col w-full get_exp_form_2028">
                      {trainerProfil.experiences.map((experience) => {
                        console.log(experience);
                        return <>
                          <li class="w-full text-base text-gray-400">
                            <div class="inline-flex items-center justify-between w-full">
                              <div class="inline-flex items-center gap-1">
                                <span>{experience.Fonction}</span>
                                <span>- {experience.Lieu_de_stage}</span>
                              </div>
                              <span class="text-right">{formatDateString(experience.Date_debut)} - {formatDateString(experience.Date_fin)}</span>
                            </div>
                          </li>
                        </>
                      })}
                    </ul>
                  )}
                </div>
            <div class="flex flex-col gap-y-1">
              <h5 class="text-lg font-semibold text-gray-600">Formations</h5>
              <ul class="flex flex-col w-full get_dp_form_2028">
                {trainerProfil.diplomes.length === 0 ? (
                  <li class="w-full text-base text-gray-400">Aucun diplôme</li>) : 
                  trainerProfil.diplomes.map((diplome) => {
                    return <>
                      <li class="w-full text-base text-gray-400">
                        <div class="inline-flex items-center justify-between w-full">
                          <div class="inline-flex items-center gap-1">
                            <span>{diplome.Diplome}</span>
                            <span>- {diplome.Ecole}</span>
                          </div>
                          <span class="text-right">20 janv. 1997 - 20 déc. 2000</span>
                        </div>
                      </li>
                    </>
                  })
                }
              </ul>
            </div>
          </div>

            <div class="w-full p-3 border-[1px] flex flex-col gap-2 border-gray-200 border-dashed rounded-md">
            <div class="flex flex-col gap-y-1">
                <h5 class="text-lg font-semibold text-gray-600">Compétences</h5>
                <ul class="flex flex-col w-full get_cp_form_2028">
                  {trainerProfil.competences.length === 0 ? (
                    <li class="w-full text-base text-gray-400">Aucune compétence</li>
                  ) : trainerProfil.competences.map((competence) => {
                    let rating = 0
                    return <>
                      <li class="w-full text-base text-gray-400">
                        <div class="inline-flex items-center justify-between w-full">
                          <div class="inline-flex items-center gap-1">
                            <span>{competence.Competence}</span>
                          </div>
                          <span id="cpc_rating_6" data-rate="cpc_rating_6" class="inline-flex items-center text-right" title="gorgeous">
                            {Array.from({ length: competence.note }).map((_, i) => {
                              rating = i
                              return <>
                                <img
                                  key={i}
                                  alt={i + 1}
                                  src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/stars/star-on.png"
                                  title="gorgeous"
                                  className="w-5 h-5"
                                />
                              </>
                            })}
                            <input name="score" type="hidden" value={rating} readonly="" />
                          </span>
                        </div>
                      </li>
                    </>
                  })}
                  
                </ul>
            </div>
            <div class="flex flex-col gap-y-1">
                <h5 class="text-lg font-semibold text-gray-600">Langues</h5>
                <ul class="flex flex-col w-full get_lg_form_2028">
                  {trainerProfil.langues.length === 0 ? (
                    <li class="w-full text-base text-gray-400">Aucune compétence linguistique</li>
                  ) : trainerProfil.langues.map((langue) => {
                    return <>
                      <li class="w-full text-base text-gray-400">
                        <div class="inline-flex items-center justify-between w-full">
                          <div class="inline-flex items-center gap-1">
                            <span>{langue.Langue}</span>
                          </div>
                          <span id="cpc_rating_6" data-rate="cpc_rating_6" class="inline-flex items-center text-right" title="gorgeous">
                            {Array.from({ length: 5 }).map((_, i) => {
                              return <>
                                <img
                                  key={i}
                                  alt={i + 1}
                                  src="https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/stars/star-on.png"
                                  title="gorgeous"
                                  className="w-5 h-5"
                                />
                              </>
                            })}
                            <input name="score" type="hidden" value={langue.note} readonly="" />
                          </span>
                        </div>
                      </li>
                    </>
                  })}
                </ul>
            </div>
            </div>
        </div>
      </div>
    );
  };

  const renderSessionsContent = () => {
    if (loadingSession) {
      return <>
        <LoadingSpinner />
      </>
    }
    return (
      <div class="flex flex-col w-full">         
        <div class="w-full flex flex-col p-3 relative">
          <div class="w-full h-40 rounded-3xl p-4">
            <div class="w-full h-full inline-flex items-center gap-2">
              <div class="w-[116px] h-[77px] rounded-xl p-1">
                <span class="photo_formation_623">
                  <img src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/modules/${moduleSession.module.module_image}`} alt="profil" class="object-cover w-full h-full rounded-xl"/>
                </span>
              </div>
              <div class="ml-3 flex flex-col justify-start gap-y-2 w-full">
                <h3 class="text-2xl font-bold text-gray-700 text-start line-clamp-2">{moduleSession.module.module_name}</h3>
                <p class="text-base text-gray-500 text-start line-clamp-3">{moduleSession.module.module_subtitle}</p>
              </div>
              <a data-bs-toggle="offcanvas" href="" class="w-10 h-10 rounded-md hover:bg-gray-200 duration-200 absolute top-1 right-1 cursor-pointer flex items-center justify-center">
                <i class="fa-solid fa-xmark text-gray-500"></i>
              </a>
            </div>
          </div>

          <div class="w-full">
            <p class="text-xl font-semibold text-gray-900">Nombres d'heures : {moduleSession.totalSessionHours.sumHourSession}</p>
          </div>
          <table class="table mt-4">
            <tbody>
                {moduleSession.sessions.map((session) => {
                  return <>
                    <tr>
                      <td class="w-[40%] capitalize text-slate-700 font-medium">{formatDateString(session.dateSeance)}</td>
                      <td class="w-[30%] text-slate-500 text-right">{session.heureDebut} - {session.heureFin}</td>
                      <td class="w-[30%] text-slate-500 text-right"> --</td>
                    </tr>
                  </>
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderLocationContent = () => {
    if (!data) {
      return (
        <div className="p-6 text-center">
          <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Informations de localisation non disponibles</p>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <MapPin className="w-8 h-8 text-red-600 mr-3" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Localisation
            </h3>
            <p className="text-gray-600">{data.module_name || 'Projet'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Adresse complète</h4>
            <p className="text-gray-700">
              {`${data.salle_name || 'N/A'}, ${data.sub_name || 'N/A'}`}
            </p>
            <p className="text-gray-700">
              {`${data.salle_quartier || 'N/A'}, ${data.ville || 'N/A'}`}
            </p>
            <p className="text-gray-700">
              Code postal: {data.salle_code_postal || 'N/A'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Dates</h4>
            <p className="text-gray-700">
              Du {data.dateDebut || 'N/A'} au {data.dateFin || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderEvaluationContent = () => {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Évaluations
              </h3>
              <p className="text-gray-600">{data?.module_name || 'Projet'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Statistiques</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-lg font-semibold">{data?.apprs?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="text-lg font-semibold">{data?.seanceCount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600">
              Évaluations détaillées à venir...
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[40rem] bg-white shadow-xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col w-full h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b h-[65px] border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center">
              {getDrawerIcon()}
              <h2 className="ml-3 text-2xl font-bold text-gray-900">
                {getDrawerTitle()}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default DrawerEtp;