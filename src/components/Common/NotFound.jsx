import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="p-3 bg-yellow-100 rounded-full">
                        <AlertTriangle className="w-12 h-12 text-yellow-600" />
                    </div>
                </div>
                <h2 className="mt-6 text-3xl font-bold text-center text-gray-900">
                    Page non trouvée
                </h2>
                <p className="mt-2 text-sm text-center text-gray-600">
                    La page que vous recherchez n'existe pas ou a été déplacée
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="px-4 py-8 bg-white shadow-lg sm:rounded-lg sm:px-10">
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mb-4 text-6xl font-bold text-gray-300">404</div>
                            <p className="mb-6 text-gray-600">
                                Il semble que vous vous soyez perdu dans l'espace numérique.
                            </p>
                        </div>

                        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <Home className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Suggestions
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <ul className="space-y-1 list-disc list-inside">
                                            <li>Vérifiez l'URL dans la barre d'adresse</li>
                                            <li>Retournez à la page d'accueil</li>
                                            <li>Utilisez la navigation pour trouver ce que vous cherchez</li>
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
                                to="/app/dashboard"
                                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Aller au tableau de bord
                            </Link>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                Si le problème persiste, contactez notre équipe de support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;