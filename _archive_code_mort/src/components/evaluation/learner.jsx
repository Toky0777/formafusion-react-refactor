import { useState } from 'react';
import { Users, Building2 } from 'lucide-react';
import LoadingSpinner from '../ui/loading-spinner';
import axios from '../../config/axios';
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const LearnersList = ({ apprenants, selectedProject, learnerLoading }) => {
    const [isLoading, setIsLoading] = useState(false)

    const SendEvaluation = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`/cfp/evaluations/froids/${selectedProject.idProjet}`);
            toastr.success(response.data?.message || "Évaluation envoyée avec succès !");
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || // si ton back renvoie {message: "..."}
                error.response?.data || // si c’est juste une string
                error.message || // fallback message JS
                "Une erreur est survenue";

            toastr.error(errorMessage);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    const renderAvatar = (apprenant) => {
        if (apprenant.avatar) {
            return (
                <img
                    src={apprenant.avatar}
                    alt={apprenant.emp_name}
                    className="object-cover w-10 h-10 border-2 border-white rounded-full shadow-sm"
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
            <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold text-white border-2 border-white rounded-full shadow-sm bg-gradient-to-br from-purple-500 to-indigo-600">
                {initials}
            </div>
        );
    };

    return (
        <div className="overflow-hidden bg-white border shadow-lg rounded-xl border-gray-200/50 h-fit">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50/50">
                <div className="flex items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Users className="w-6 h-6 text-indigo-600" />
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
                        <div className="py-12 text-center">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="leading-relaxed text-center text-gray-500">
                                Veuillez sélectionner un projet pour voir la liste des apprenants du projet
                            </p>
                        </div>
                    ) : learnerLoading ? <LoadingSpinner /> : (apprenants.length === 0 && !isLoading) ? (
                        <div className="py-12 text-center">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
                                <Users className="w-8 h-8 text-orange-400" />
                            </div>
                            <p className="text-center text-gray-500">
                                Aucun apprenant trouvé pour ce projet
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Project Info */}
                            <div className="p-4 border bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-purple-200/50">
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
                                        className="flex items-center gap-4 p-4 transition-all duration-200 border border-gray-100 rounded-xl hover:border-purple-200 hover:bg-purple-50/30 group"
                                    >
                                        {renderAvatar(apprenant)}

                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-600 transition-colors duration-200 group-hover:text-purple-700">
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
                            <div className="p-4 border bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-purple-200/50">
                                <button onClick={() => SendEvaluation(selectedProject.idProjet)} className='p-2 text-white bg-purple-700 rounded-xl'>Envoyer l'évaluation</button>
                            </div>
                        </div>
                    )}
                </div>}
        </div>
    );
};

export default LearnersList;