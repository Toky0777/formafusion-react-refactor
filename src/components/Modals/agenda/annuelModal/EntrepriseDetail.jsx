import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL, IMAGE_URL } from "../../../../config/env";

const EntrepriseDetail = ({ route, idProjet = null, onClose }) => {

  const auth = useAuth();
  const [customer, setCustomer] = useState(null);
  const [referents, setReferents] = useState([]);
  const [projectsInPreparation, setProjectsInPreparation] = useState([]);
  const [projectsFuture, setProjectsFuture] = useState([]);
  const [projectsInProgress, setProjectsInProgress] = useState([]);
  const [projectsFinished, setProjectsFinished] = useState([]);
  const [projectsFenced, setProjectsFenced] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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
  console.log(route)
  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(route, {
          baseURL: API_URL,
          headers: { Authorization: `Bearer ${auth.token}` }
        });

        const res = response.data;

        if (res) {
          setCustomer(res.customer);
          setReferents(res.referents);
          setProjectsInPreparation(res.projects_in_preparation || []);
          setProjectsFuture(res.projects_future || []);
          setProjectsInProgress(res.projects_in_progress || []);
          setProjectsFinished(res.projects_finished || []);
          setProjectsFenced(res.projects_fenced || []);
        } else {
          setError('Données non trouvées !');
        }
      } catch (err) {
        console.error('Error fetching customer data:', err);
        setError('Échec de la récupération des référents ou autres données.');
      } finally {
        setLoading(false);
      }
    };

    if (route) {
      fetchCustomerData();
    }
  }, [route]);

  const renderReferent = (referent) => (
    <li className="pt-3 pb-0 sm:pt-4" key={referent.id}> {/* Added key for list items */}
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0">
          {referent.photo ? (
            <img
              className="w-10 h-10 rounded-full"
              src={`${IMAGE_URL}/img/employes/${referent.photo}`}
              alt={referent.name || ''}
            />
          ) : (
            <div className="relative flex items-center justify-center w-10 h-10 text-2xl font-bold text-center text-gray-500 bg-gray-200 rounded-full">
              {/* Using a flexbox for centering text */}
              <p className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                {referent.name ? referent.name.charAt(0) : 'I'}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start gap-2 ">
          <p className="text-sm font-medium text-gray-900 truncate">
            <i className="text-sm fa-solid fa-user"></i>{' '}
            {`${referent.name || ''} ${referent.firstName || ''} ${referent.fonction ? '(' + referent.fonction + ')' : ''
              }`}
          </p>
          <p className="text-sm text-gray-500 truncate">
            <i className="text-sm fa-solid fa-envelope"></i>{' '}
            {referent.email || '--'}
          </p>
          <p className="text-sm text-gray-500 truncate">
            <i className="text-sm fa-solid fa-phone"></i>{' '}
            {referent.customerPhone || referent.phone || '--'}
          </p>
        </div>
      </div>
    </li>
  );

  const ProjectTable = ({ title, projects }) => {
    if (!projects || projects.length === 0) return null; // Don't render if no projects

    return (
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <div className="mt-1 table-responsive">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"></th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Cours</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ref</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Lieu</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  <i className="text-sm fa-solid fa-user"></i>
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Montant ({currency})</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  <i className="fa-solid fa-money-bill-transfer"></i>
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Début - Fin</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Détail</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects?.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap"></td>
                  <td className="px-6 py-4 whitespace-nowrap">{project.course || '--'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{project.ref || '--'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{project.lieu || '--'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{project.userCount || '--'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{project.amount ? project.amount.toLocaleString('fr-FR') : '--'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{project.transferStatus || '--'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{`${project.startDate || '--'} - ${project.endDate || '--'}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (project.id) {
                          navigate(`/cfp/projet/detail/${project.id}`);
                        }
                      }}
                      title="Voir le projet"
                      disabled={!project.id}
                      className={`text-indigo-900 ${!project.id ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-800">Chargement des données...</div>;
  }


  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 mt-4 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    );
  }

  if (!customer) {
    return null; // Or some other placeholder if no customer data
  }

  const principalReferent = referents[0];
  const otherReferents = referents.slice(1);

  return (
    <div >
      <div id="client_edit" className="flex flex-col w-full">
        <div className="w-full p-3">
          <div className="inline-flex items-center w-full gap-3">
            <div className="w-[116px] h-[77px] bg-white flex items-center justify-center p-1">
              {customer.logo ? (
                <img
                  className="object-cover w-full h-auto rounded-xl"
                  src={`${IMAGE_URL}/img/entreprises/${customer.logo}`}
                  alt={customer.customerName}
                />
              ) : (
                <img
                  object-cover
                  className="h-16 w-audo rounded-xl grayscale"
                  src="/img/logo/Logo_mark.svg" // Adjust path as needed
                  alt={customer.customerName}
                />
              )}
            </div>
            <div className="flex flex-col justify-start w-full gap-y-2">
              <h3 className="text-2xl font-bold text-left text-gray-700">
                {customer.customerName}
              </h3>
              <p className="text-base text-left text-gray-500">
                {customer.siteweb || 'Site web --'}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full px-4">
          {principalReferent && (
            <div>
              <ul role="list" className="divide-y divide-gray-200">
                <div>
                  <p className="text-sm font-semibold text-left text-gray-900">
                    Référent principal
                  </p>
                </div>
                {renderReferent(principalReferent)}
              </ul>
            </div>
          )}

          {otherReferents.length > 0 && (
            <div className="mt-4">
              <ul role="list" className="divide-y divide-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Autres référents
                  </p>
                </div>
                {otherReferents.map(renderReferent)}
              </ul>
            </div>
          )}

          <ProjectTable title="Projets en préparation" projects={projectsInPreparation} />
          <ProjectTable title="Projets futurs" projects={projectsFuture} />
          <ProjectTable title="Projets en cours" projects={projectsInProgress} />
          <ProjectTable title="Projets terminés" projects={projectsFinished} />
          <ProjectTable title="Projets clôturés" projects={projectsFenced} />

        </div>
      </div>
    </div>
  );
};

export default EntrepriseDetail;