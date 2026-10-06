import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../../../../config/env";


// Helper function to format dates, assuming you have a similar utility in your project
const formatDate2Digit = (dateString) => {
  if (!dateString) return '--';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};


const endpoint = "https://formafusionmg.ams3.cdn.digitaloceanspaces.com";
const bucket = "formafusionmg";

const DossierDetail = ({ route, onClose }) => {
  const [module, setModule] = useState(null);
  const [projets, setProjets] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = useAuth();
  console.log(route)
  const statusOrder = [
    'En préparation',
    'En cours',
    'Planifié',
    'Terminé',
    'Annulé',
    'Reporté',
    'Cloturé'
  ];
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
        const response = await axios.get(route, {
          baseURL: API_URL,
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
        console.error('Error fetching dossier data:', err);
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
        <div className="w-16 h-16 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        <p className="ml-4 text-sm text-gray-800">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 text-red-600 bg-white">
        <p className="text-xl font-semibold">{error}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 mt-4 text-gray-800 transition-colors duration-200 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Fermer
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
    console.log(`Downloading file: ${title} from ${fileUrl}`);
  };

  return (
    <div>
      <div className="relative flex flex-col w-full p-1">
        <div className="w-full h-40 p-2 rounded-3xl">
          <div className="flex items-center w-full h-full gap-2">
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
            <div className="flex flex-col items-start justify-start gap-1">
              <h3 className="text-xl font-bold text-[#a462a4]">
                {module.moduleName}
              </h3>
              <p className="text-base text-gray-500">
                {module.module_subtitle || ''}
              </p>
            </div>

          </div>
        </div>
      </div>

      <div className="h-full p-4 bg-white border border-gray-300 rounded-lg">
        {projets.length > 0 ? (
          <>
            <h2 className="mb-4 text-sm font-semibold text-left text-gray-700">Projets associés</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nom du Module</th>
                    <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Référence</th>
                    <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Début - Fin</th>
                    <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Entreprise</th>
                    <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Prix</th>
                    <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Statut</th>
                    <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projets?.map((projet) => (
                    <tr key={projet.idProjet} className="hover:bg-gray-100 ">
                      <td className="px-3 py-2 text-gray-900 text-xs whitespace-nowrap">{projet.module_name}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">{projet.project_reference}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate2Digit(projet.dateDebut)} - {formatDate2Digit(projet.dateFin)}
                      </td>
                      <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">{projet.etp_name_in_situ}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">
                        {projet.total_ht ? projet.total_ht.toLocaleString('fr-FR', { minimumFractionDigits: 0 }) : '--'}{currency}
                      </td>
                      <td >
                        <span className={`text-white p-1 text-center text-xs rounded ${getStatusClass(projet.project_status)}`}>
                          {projet.project_status}
                        </span>

                      </td>
                      <td className="px-3 py-2 text-center  whitespace-nowrap">
                        <button
                          
                          className="text-gray-500 hover:text-purple-600"
                           onClick={() => {
                        if (projet.idProjet) {
                          navigate(`/cfp/projet/detail/${projet.idProjet}`);
                        }
                      }}
                          title="Voir le projet"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="mt-4 text-left text-gray-500">Aucun projet trouvé pour ce dossier.</p>
        )}

        {documents.length > 0 ? (
          <>
            <h2 className="mt-6 mb-4 text-sm font-semibold">Documents associés</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Titre</th>
                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Section</th>
                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date de Mise à Jour</th>
                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Extension</th>
                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Taille</th>
                    <th className="px-4 py-2 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents?.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 text-gray-900 whitespace-nowrap">{doc.titre}</td>
                      <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{doc.section_document}</td>
                      <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{doc.type_document}</td>
                      <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{doc.updated_at}</td>
                      <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{doc.extension}</td>
                      <td className="px-4 py-2 text-right text-gray-500 whitespace-nowrap">{doc.taille} Mo</td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
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
                          {/* <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button-1" tabIndex="-1">
                              <div className="py-1" role="none">
                                <a href="#" onClick={() => handleDownloadFile(doc.path, doc.titre)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" id="menu-item-0">
                                  <i className="mr-2 fa-solid fa-download"></i> Télécharger
                                </a>
                              </div>
                            </div> */}
                          <button onClick={() => handleDownloadFile(doc.path, doc.titre)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <i className="mr-2 fa-solid fa-download"></i> Télécharger
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
          <p className="mt-4 text-left text-gray-500">Aucun document trouvé pour ce dossier.</p>
        )}
      </div>
    </div>

  );
};

export default DossierDetail;