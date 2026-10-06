import React, { useState, useEffect } from 'react';
import axios from '../../../../config/axios';



// Helper function to format dates, assuming you have a similar utility in your project
const formatDate2Digit = (dateString) => {
  if (!dateString) return '--';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};


const endpoint = "https://formafusionmg.ams3.cdn.digitaloceanspaces.com";
const bucket = "formafusionmg";

const EtpDossierDetail = ({ route, onClose }) => {
  const [module, setModule] = useState(null);
  const [projets, setProjets] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("MGA"); // valeur par défaut
    
        useEffect(() => {
            const storedSetting = sessionStorage.getItem("setting");
            if (storedSetting !== null) {
                try {
                    const parsedSetting = JSON.parse(storedSetting);
                    setCurrency(parsedSetting.currency_unit || "MGA");
                } catch (err) {
                    console.error("Erreur JSON:", err);
                }
            }
        }, []);
  const statusOrder = [
    'En préparation',
    'En cours',
    'Planifié',
    'Terminé',
    'Annulé',
    'Reporté',
    'Cloturé'
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'En préparation': return 'bg-[#F8E16F] text-gray-600 text-sm';
      case 'En cours': return 'bg-[#369ACC] text-white text-sm';
      case 'Planifié': return 'bg-[#CBABD1] text-gray-600 text-sm';
      case 'Terminé': return 'bg-[#95CF92] text-gray-600 text-sm';
      case 'Annulé': return 'bg-[#DE324C] text-white text-sm';
      case 'Reporté': return 'bg-[#2E705A] text-white text-sm';
      case 'Cloturé': return 'bg-[#6F1926] text-white text-sm';
      default: return 'text-gray-500';
    }
  };

  useEffect(() => {
    const fetchDossierData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await  axios.get(route, {
                    
                    headers: { Authorization: `Bearer ${auth.token}` }
                });
        const res = response.data;

        if (res.module) {
          setModule(res.module);

          const sortedProjects = res.projets ? [...res.projets].sort((a, b) => {
            const statusA = statusOrder.indexOf(a.project_status);
            const statusB = statusOrder.indexOf(b.project_status);
            return statusA - statusB;
          }) : [];
          setProjets(sortedProjects);

          setDocuments(res.documents || []);
        } else {
          setError('Données non trouvées !');
        }
      } catch (err) {
       // console.error('Error fetching dossier data:', err);
        setError('Échec de la récupération des Dossiers.');
      } finally {
        setLoading(false);
      }
    };

    if (route) {
      fetchDossierData();
    }
  }, [route]); // Re-fetch data if the route changes

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-sm text-gray-800">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-4 text-red-600">
        <p className="text-xl font-semibold">{error}</p>
        <button
          onClick={fetchDossierData()}
          className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
        >
          Actualiser
        </button>
      </div>
    );
  }

  if (!module) {
    return null; 
  }

  const handleDownloadFile = (path, title) => {
   
    const fileUrl = `${endpoint}/${bucket}/${path}`;
    window.open(fileUrl, '_blank'); // Open in new tab to download
    //console.log(`Downloading file: ${title} from ${fileUrl}`);
  };

  return (
    <div>      
    <div className="w-full flex flex-col p-1 relative">
          <div className="w-full h-40 rounded-3xl p-2">
            <div className="w-full h-full flex items-center gap-2">
              <div className="w-[116px] h-[77px] rounded-xl p-1">
                {module.module_image ? (
                  <img
                    src={`${endpoint}/${bucket}/img/modules/${module.module_image}`}
                    className="object-cover w-full h-full rounded-xl"
                    alt={module.moduleName}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-3xl text-gray-500 bg-gray-100 rounded-xl">
                    {module.moduleName ? module.moduleName[0] : ''}
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <h3 className="text-xl font-bold text-gray-700">
                  {module.moduleName}
                </h3>
                <p className="text-base text-gray-500">
                  {module.module_subtitle || ''}
                </p>
              </div>
             
            </div>
          </div>
        </div>

        <div className="h-full bg-white border border-gray-300 rounded-lg p-4">
          {projets.length > 0 ? (
            <>
              <h2 className="text-sm font-semibold mb-4 text-left  text-gray-700">Projets associés</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom du Module</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Début - Fin</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix({currency})</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projets.map((projet) => (
                      <tr key={projet.idProjet} className="hover:bg-gray-100">
                        <td className="px-3 py-2 whitespace-nowrap text-gray-900">{projet.module_name}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-500">{projet.project_reference}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                          {formatDate2Digit(projet.dateDebut)} - {formatDate2Digit(projet.dateFin)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-500">{projet.etp_name_in_situ}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                          {projet.total_ht ? projet.total_ht.toLocaleString('fr-FR', { minimumFractionDigits: 0 }) : '--'}
                        </td>
                        <td className={`p-1  text-white text-center rounded-xl ${getStatusClass(projet.project_status)}`}>
                            {projet.project_status}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-center">
                          <a href={`${import.meta.env.VITE_URL_Projet}/${projet.idProjet}`} className="text-gray-500 hover:text-purple-600" title="Voir le projet"    target="_blank"
                          rel="noopener noreferrer">
                            <i className="fa-solid fa-eye"></i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-gray-500 mt-4 text-left">Aucun projet trouvé pour ce dossier.</p>
          )}

          {documents.length > 0 ? (
            <>
              <h2 className="text-sm font-semibold mt-6 mb-4">Documents associés</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Mise à Jour</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extension</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-100">
                        <td className="px-4 py-2 whitespace-nowrap text-gray-900">{doc.titre}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-500">{doc.section_document}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-500">{doc.type_document}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-500">{doc.updated_at}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-500">{doc.extension}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-gray-500 text-right">{doc.taille} Mo</td>
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              className="p-2 text-gray-700 hover:text-purple-500 focus:outline-none"
                              id={`menu-button-${doc.id}`}
                              aria-expanded="true"
                              aria-haspopup="true"
                              // You might need a state to manage dropdown visibility or use a headless UI library like Headless UI
                              onClick={() => { /* Toggle dropdown visibility */ }}
                            >
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>

                            {/* This dropdown menu needs a state to be shown/hidden */}
                            {/* For a real application, consider a dedicated dropdown component or Headless UI */}
                            {/* Example placeholder for the dropdown content */}
                            {/* <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button-1" tabIndex="-1">
                              <div className="py-1" role="none">
                                <a href="#" onClick={() => handleDownloadFile(doc.path, doc.titre)} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100" role="menuitem" tabIndex="-1" id="menu-item-0">
                                  <i className="fa-solid fa-download mr-2"></i> Télécharger
                                </a>
                              </div>
                            </div> */}
                            <button onClick={() => handleDownloadFile(doc.path, doc.titre)} className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">
                               <i className="fa-solid fa-download mr-2"></i> Télécharger
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-gray-500 mt-4 text-left">Aucun document trouvé pour ce dossier.</p>
          )}
        </div>
      </div>
   
  );
};

export default EtpDossierDetail;