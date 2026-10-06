import React, { useState } from 'react';
import { Users, UserPlus, Building2 } from 'lucide-react';
import LoadingSpinner from '../../LoadingSpinner';
import axios from '../../../../../../../config/axios';
// import { useStateContext } from '../../../Context/ContextProvider';

const ApprenantsList = ({ apprenants, selectedProject, learnerLoading }) => {
    // const { token, api_base_url } = useStateContext();
    const [ isLoading, setIsLoading ] = useState(false)
    
    const SendEvaluation = async() => {
        setIsLoading(true)
        try {
            await axios.post(`cfp/evaluations/froids/${selectedProject.idProjet}`, {}, {
                // headers: {
                //     Authorization: `Bearer ${token}`
                // }
            })
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    }

    const renderAvatar = (apprenant) => {
        if (apprenant.avatar) {
        return (
            <img
            src={apprenant.avatar}
            alt={apprenant.emp_name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
        );
        }
        
        const initials = apprenant.emp_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
        
        return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-sm">
            {initials}
        </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden h-fit">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-purple-50/50 border-b border-gray-200">
                <div className="flex items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Users className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Liste des apprenants</h3>
                            <p className="text-sm text-gray-600">
                                {apprenants.length > 0 ? `${apprenants.length} apprenant${apprenants.length > 1 ? 's' : ''}` : 'Aucun apprenant'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? <LoadingSpinner /> :
            <div className="p-6">
                {!selectedProject ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-center leading-relaxed">
                        Veuillez sélectionner un projet pour voir la liste des apprenants du projet
                        </p>
                    </div>
                ) : learnerLoading ? <LoadingSpinner /> : (apprenants.length === 0 && !isLoading) ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-orange-400" />
                    </div>
                    <p className="text-gray-500 text-center">
                        Aucun apprenant trouvé pour ce projet
                    </p>
                </div>
                ) : (
                <div className="space-y-4">
                    {/* Project Info */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200/50">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-purple-600" />
                            <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">
                                {selectedProject.module_name}
                            </p>
                            <p className="text-sm text-gray-600">
                                {selectedProject.etp_name}
                            </p>
                            </div>
                        </div>
                    </div>

                    {/* Apprenants List */}
                    <div className="space-y-3 h-[24rem] overflow-y-auto">
                    {apprenants.map((apprenant) => (
                        <div
                        key={apprenant.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-200 group"
                        >
                            {renderAvatar(apprenant)}
                            
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors duration-200">
                                {apprenant.emp_name} {apprenant.emp_firstname}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                {apprenant.emp_email}
                                </p>
                            </div>
                        </div>
                    ))}
                    </div>

                    {/* Send Evaluation */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200/50">
                        <button onClick={() => SendEvaluation(selectedProject.idProjet)} className='bg-purple-700 p-2 text-white rounded-xl'>Envoyer l'évaluation</button>
                    </div>
                </div>
                )} 
            </div>}
        </div>
    );
};

export default ApprenantsList;