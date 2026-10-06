import { useEffect, useState } from 'react';
import { X, Building2, Users, Mail, Phone } from 'lucide-react';
import axios from "../../../../../../config/axios";
import { IMAGE_URL } from "../../../../../../config/env";

const ApprenantDrawer = ({ projet, onClose }) => {
    const [moduleData, setModuleData] = useState(null);
    const [apprenants, setApprenants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // S'assurer que l'idProjet est bien présent avant d'appeler l'API
            if (!projet || !projet.idProjet) {
                setError("ID du projet manquant.");
                setIsLoading(false);
                return;
            }

            const { data } = await axios.get(`/employes/projets/${projet.idProjet}/apprenant-drawer`);
            console.log('Données de l\'API:', data);

            if (data.apprenants) {
                setApprenants(data.apprenants);
            } else {
                setApprenants([]);
            }
            if (data.module) {
                setModuleData(data.module);
            } else {
                setModuleData(null);
            }

        } catch (err) {
            console.error('Erreur lors du chargement des données:', err);
            setError("Impossible de charger les données. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [projet?.idProjet]); 

    // Fonction pour générer des initiales
    const getInitials = (name, firstName) => {
        const firstLetter = name?.[0]?.toUpperCase() || '';
        const secondLetter = firstName?.[0]?.toUpperCase() || '';
        return `${firstLetter}${secondLetter}`;
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 text-center">Chargement des participants...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="p-8 bg-white rounded-xl shadow-lg text-center max-w-md">
                    <p className="text-red-500 font-semibold mb-4">{error}</p>
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
            
            <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-out">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Participants à la formation</h2>
                                <p className="text-indigo-100 text-sm">{apprenants.length} apprenant(s)</p>
                            </div>
                        </div>
                        
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
                        >
                            <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
                        </button>
                    </div>
                </div>

                <div className="h-[calc(100vh-80px)] overflow-y-auto">
                    {/* Formation Header */}
                    {moduleData && (
                        <div className="p-6 bg-gradient-to-r from-gray-50 to-indigo-50 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                                    <img 
                                        src={`${IMAGE_URL}/img/modules/${moduleData.module_image}`} 
                                        alt={moduleData.moduleName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/default-module.png';
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-2">
                                        {moduleData.moduleName}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">
                                        {moduleData.module_subtitle || moduleData.description?.substring(0, 100)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Liste des entreprises et participants */}
                    <div className="p-6 space-y-6">
                        {projet.etp_name?.map((company, companyIndex) => {
                            const companyApprenants = apprenants.filter(emp => 
                                emp.customerName === company.etp_name
                            );

                            if (companyApprenants.length === 0) return null;

                            return (
                                <div key={companyIndex} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                    {/* Company Header */}
                                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-100 rounded-lg">
                                                <Building2 className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-800">{company.etp_name}</h4>
                                                <p className="text-sm text-gray-600">{companyApprenants.length} participant(s)</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Employees List */}
                                    <div className="divide-y divide-gray-100">
                                        {companyApprenants.map((employee, employeeIndex) => (
                                            <div key={employeeIndex} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                                                <div className="flex items-center gap-4">
                                                    {/* Avatar */}
                                                    <div className="relative flex-shrink-0">
                                                        {employee.photo ? (
                                                            <img 
                                                                src={employee.photo}
                                                                alt={`${employee.name} ${employee.firstName}`}
                                                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextElementSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div 
                                                            className={`w-14 h-14 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md ${employee.photo ? 'hidden' : 'flex'}`}
                                                        >
                                                            {getInitials(employee.name, employee.firstName)}
                                                        </div>
                                                    </div>

                                                    {/* Employee Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="text-lg font-semibold text-gray-800 truncate">
                                                                    {employee.name} {employee.firstName}
                                                                </h5>
                                                                <p className="text-gray-600 text-sm truncate">
                                                                    {employee.fonction !== 'default_fonction' ? employee.fonction : 'Non spécifié'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            {employee.email && (
                                                                <div className="flex items-center gap-1">
                                                                    <Mail className="w-4 h-4" />
                                                                    <span className="truncate">{employee.email}</span>
                                                                </div>
                                                            )}
                                                            {employee.phone && employee.phone !== '(+261)' && (
                                                                <div className="flex items-center gap-1">
                                                                    <Phone className="w-4 h-4" />
                                                                    <span>{employee.phone}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Matricule */}
                                                    <div className="flex-shrink-0 ml-4">
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                                            {/* #{employee.matricule} */}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {apprenants.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun participant</h3>
                                <p className="text-gray-500">Aucun apprenant n'est inscrit à cette formation.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApprenantDrawer;