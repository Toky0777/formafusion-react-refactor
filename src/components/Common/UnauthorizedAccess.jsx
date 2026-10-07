import { Shield, ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useHomeLink from '../../hooks/useHomeLink';
import { getUserTypeLabel, getUserTypesLabel, resolveSpace } from '../../config/roles';

const UnauthorizedAccess = ({ allowedUserTypes = [], currentPath }) => {
    const navigate = useNavigate();
    const { userType, roleId } = useAuth();
    const home = useHomeLink();

    const getRequiredUserTypeDisplay = () => getUserTypesLabel(allowedUserTypes);

    const getCurrentUserTypeDisplay = () =>
        userType
            ? getUserTypeLabel(userType)
            : resolveSpace({ userType, roleId })?.label || getUserTypeLabel(userType);

    return (
        <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="p-3 bg-red-100 rounded-full">
                        <Shield className="w-12 h-12 text-red-600" />
                    </div>
                </div>
                <h2 className="mt-6 text-3xl font-bold text-center text-gray-900">
                    Accès non autorisé
                </h2>
                <p className="mt-2 text-sm text-center text-gray-600">
                    Vous n'avez pas les permissions nécessaires pour accéder à cette page
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="px-4 py-8 bg-white shadow-lg sm:rounded-lg sm:px-10">
                    <div className="space-y-6">
                        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Shield className="w-5 h-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Restriction d'accès
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>
                                            Cette page est réservée aux utilisateurs de type{' '}
                                            <span className="font-semibold">
                                                {getRequiredUserTypeDisplay()}
                                            </span>.
                                        </p>
                                        <p className="mt-1">
                                            Votre type de compte actuel est{' '}
                                            <span className="font-semibold">
                                                {getCurrentUserTypeDisplay()}
                                            </span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Home className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Que pouvez-vous faire ?
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <ul className="space-y-1 list-disc list-inside">
                                            <li>Retourner à votre tableau de bord</li>
                                            <li>Contacter votre administrateur</li>
                                            <li>Vérifier vos permissions de compte</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour à la page précédente
                            </button>

                            <Link
                                to={home.to}
                                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                {home.label}
                            </Link>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                Si vous pensez qu'il s'agit d'une erreur, contactez votre administrateur système.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedAccess;