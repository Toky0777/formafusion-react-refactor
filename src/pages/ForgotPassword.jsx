import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setError('');
        setMessage('');
        setSuccess(false);

        try {
            const response = await api.post('/auth/forgot-password', { email });
            setMessage(response.data.message);
            setSuccess(true);
            setEmail('');
        } catch (err) {
            setSuccess(false);
            if (err.response?.data?.errors) {
                setError(err.response.data.errors.email?.[0] || 'Une erreur est survenue.');
            } else {
                setError(err.response?.data?.message || 'Une erreur est survenue.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                        <EnvelopeIcon className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-center text-gray-700">
                    Mot de passe oublié
                </h2>
                <p className="mt-2 text-center text-blue-400">
                    {success
                        ? "Consultez votre boîte mail pour poursuivre la réinitialisation"
                        : "Saisissez votre adresse email pour recevoir un lien de réinitialisation"
                    }
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="px-6 py-8 bg-white border border-gray-100 shadow-lg rounded-xl sm:px-10">
                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 border border-red-100 rounded-lg bg-red-50">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center w-5 h-5 bg-red-100 rounded-full">
                                                <div className="w-2 h-2 bg-red-600 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-red-800">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                                    Adresse email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
                                        placeholder="vous@exemple.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email.trim()}
                                className="flex items-center justify-center w-full px-4 py-3 font-medium text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Envoi en cours...
                                    </>
                                ) : 'Envoyer le lien'}
                            </button>
                        </form>
                    ) : (
                        <div className="py-8 text-center">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-green-50">
                                <CheckCircleIcon className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-900">Email envoyé avec succès !</h3>
                            <p className="mb-8 text-gray-600">
                                Si cette adresse est associée à un compte, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
                            </p>
                            {message && (
                                <div className="p-4 mb-6 border border-blue-100 rounded-lg bg-blue-50">
                                    <p className="text-sm text-blue-800">{message}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-6 mt-8 border-t border-gray-100">
                        <Link
                            to="/login"
                            className="flex items-center justify-center text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600 group"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
                            Retour à la page de connexion
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;