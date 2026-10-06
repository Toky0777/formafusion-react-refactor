import { MapPin, Clock, Users, Star, Eye, Building2, DollarSign, ChevronUp, ChevronDown } from 'lucide-react'
import { formatDate } from '../../../utils/dateUtils'
import ApprenantTable from './ApprenantTable';
import ApprenantList from './ApprenantList'; // Import du composant ApprenantList
import { useState } from 'react';

const ProjectCard = ({project}) => {
    const allAppr = project.apprCount > 0 ? project.apprs : []
    const [viewLearnersPress, setViewLearnersPress] = useState(false)
    const [showModal, setShowModal] = useState(false) // État pour contrôler l'affichage du modal
    const [modalApprenants, setModalApprenants] = useState([]) // État pour stocker les apprenants du modal

    const toggleLearners = () => {
        setViewLearnersPress(!viewLearnersPress)
    }

    const showApprDrawer = (apprenants) => {
        console.log(apprenants);
        // Transformer les données des apprenants pour correspondre au format attendu par ApprenantList
        const formattedApprenants = apprenants.map(apprenant => ({
            ...apprenant,
            // Ajouter la propriété company si elle n'existe pas
            company: apprenant.company || apprenant.etp_name || 'Sans entreprise'
        }));
        
        setModalApprenants(formattedApprenants);
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setModalApprenants([]);
    }

    const handleAddApprenant = () => {
        // Logique pour ajouter un apprenant
        console.log("Ajouter un apprenant");
        // Vous pouvez implémenter la logique d'ajout ici
    }

    return (
        <>
            <div className="p-4 transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:shadow-lg group">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Main Info */}
                    <div className="space-y-4 lg:col-span-6">
                        <div>
                            <div className="flex items-start gap-3 mb-2">
                                <p className="text-xl font-semibold text-gray-900 transition-colors duration-200 line-clamp-2 group-hover:text-purple-600">
                                    {project.module_name || 'Nom du module non spécifié'}
                                </p>
                                <p className="text-xs italic text-gray-500 whitespace-nowrap line-clamp-2">
                                    Ref: {project.project_reference || 'Non spécifié'}
                                </p>
                            </div>
                            <p className="text-gray-600">
                                Date : <span className="font-semibold text-gray-900">{formatDate(project.dateDebut)}</span> au{' '}
                                <span className="font-semibold text-gray-900">{formatDate(project.dateFin)}</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm transition-colors duration-200 cursor-pointer hover:text-purple-600">
                                {project.salle_name}, {project.li_name}, {project.salle_quartier}, {project.ville} ({project.salle_code_postal})
                            </span>
                        </div>

                        <p className="text-gray-600 line-clamp-2">
                            {project.project_description || 'Aucune description fournie.'}
                        </p>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold text-gray-900">{project.totalSessionHour}</span>
                                <span className="text-sm text-gray-500">Hrs</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold text-gray-900">{project.seanceCount}</span>
                                <span className="text-sm text-gray-500">Sessions</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold text-gray-900">{project.nbDocument}</span>
                                <span className="text-sm text-gray-500">Docs</span>
                            </div>
                        </div>
                    </div>

                    {/* Tags and Info */}
                    <div className="lg:col-span-3">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                {project.project_type || 'Type non spécifié'}
                            </span>
                            <span className="px-3 py-1 text-sm font-medium rounded-full bg-cyan-100 text-cyan-700">
                                {project.modalite || 'Modalité non spécifiée'}
                            </span>
                            <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                                {project.paiement || 'Paiement non spécifié'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="mb-2 text-sm text-gray-500">Apprenants ({allAppr.length})</p>
                                <div className="flex -space-x-2">
                                    {allAppr.length > 0 ?
                                        allAppr.slice(0,5).map((apprenant, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-600 bg-gray-200 border-2 border-white rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-transform duration-200"
                                                onClick={() => showApprDrawer(allAppr)}
                                            >
                                                <img 
                                                    src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/employes/${apprenant.emp_photo}`} 
                                                    alt={apprenant.emp_nom || `Apprenant ${index + 1}`}
                                                    className='w-full h-full object-cover rounded-full'
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentNode.innerHTML = apprenant.emp_nom ? apprenant.emp_nom.charAt(0).toUpperCase() : (index + 1);
                                                    }}
                                                />
                                            </div>
                                        ))
                                    :   
                                        [1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-600 bg-gray-200 border-2 border-white rounded-full"
                                            >
                                                {i}
                                            </div>
                                        ))
                                    }
                                    {allAppr.length > 5 && (
                                        <div 
                                            className="flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-600 bg-gray-300 border-2 border-white rounded-full cursor-pointer hover:scale-110 transition-transform duration-200"
                                            onClick={() => showApprDrawer(allAppr)}
                                        >
                                            +{allAppr.length - 5}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="mb-2 text-sm text-gray-500">Formateur</p>
                                <img
                                    src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/formateurs/${project.formateurs?.form_photo || 'default.png'}`}
                                    alt="Formateur"
                                    className="w-8 h-8 border-2 border-white rounded-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm transition-colors duration-200 cursor-pointer hover:text-purple-600">
                                Jhpiego
                            </span>
                        </div>
                    </div>

                    {/* Actions and Status */}
                    <div className="space-y-4 lg:col-span-3">
                        <div className="flex items-center justify-end">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-4 h-4 text-gray-300" />
                                ))}
                                <span className="ml-2 text-sm text-gray-500">0,0 (0 avis)</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                                {project.project_status || 'Statut non spécifié'}
                            </span>
                            <button 
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors duration-200 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-purple-300 hover:text-purple-700"
                                onClick={toggleLearners}
                            >
                                <Eye className="w-4 h-4" />
                                {viewLearnersPress ? 'Masquer' : 'Voir'} les apprenants
                                {viewLearnersPress ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex items-center justify-end">
                            <img
                                src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/entreprises/${project.etp_logo}`}
                                alt="Client"
                                className="w-12 h-8 transition-all duration-200 border-2 border-white rounded-lg grayscale hover:grayscale-0 object-cover"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                                {project.isPaid?.invoice_status_name || 'Statut de paiement non spécifié'}
                            </span>
                            <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                                <span className="font-bold text-gray-900">{project.total_ht}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table des Apprenants */}
                {viewLearnersPress && (
                    <div className="mt-6 pt-6 border-t border-gray-200 transition-all duration-300">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Liste des Apprenants - {project.module_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {allAppr.length} apprenant{allAppr.length > 1 ? 's' : ''} inscrit{allAppr.length > 1 ? 's' : ''} dans ce projet
                            </p>
                        </div>
                        
                        {allAppr.length > 0 ? (
                            <ApprenantTable idProjet={project.idProjet} idCfpInter={project.idCfp_inter}/>
                        ) : (
                            <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg">
                                <div className="text-center">
                                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun apprenant inscrit</h4>
                                    <p className="text-gray-600">Ce projet n'a pas encore d'apprenants inscrits.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal ApprenantList */}
            {showModal && (
                <ApprenantList
                    apprenants={modalApprenants}
                    formation={{
                        module_name: project.module_name,
                        project_reference: project.project_reference,
                        dateDebut: project.dateDebut,
                        dateFin: project.dateFin,
                        // Ajoutez d'autres propriétés de formation si nécessaire
                    }}
                    onClose={closeModal}
                    onAddApprenant={handleAddApprenant}
                />
            )}
        </>
    )
}

export default ProjectCard