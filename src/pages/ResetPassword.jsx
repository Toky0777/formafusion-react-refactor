import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { LockClosedIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import api from '../services/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token || !email) {
                setTokenValid(false);
                setVerifying(false);
                setError('Le lien de réinitialisation est incomplet ou invalide.');
                return;
            }

            try {
                const response = await api.post('/auth/verify-reset-token', {
                    token,
                    email
                });
                setTokenValid(response.data.valid);
                if (!response.data.valid) {
                    setError('Ce lien de réinitialisation a expiré ou est invalide.');
                }
            } catch (err) {
                setTokenValid(false);
                setError(err.response?.data?.message || 'Impossible de vérifier le lien. Veuillez en demander un nouveau.');
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [token, email]);

    useEffect(() => {
        // Calcul de la force du mot de passe
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        setPasswordStrength(strength);
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (password !== passwordConfirmation) {
            setError('Les mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/reset-password', {
                email,
                token,
                password,
                password_confirmation: passwordConfirmation
            });

            setMessage(response.data.message);
            setSuccess(true);

            // Rediriger vers la page de connexion après 3 secondes
            setTimeout(() => {
                navigate('/login', {
                    state: { message: 'Votre mot de passe a été réinitialisé avec succès.' }
                });
            }, 3000);

        } catch (err) {
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                setError(
                    errors.password?.[0] ||
                    errors.token?.[0] ||
                    errors.email?.[0] ||
                    'Une erreur est survenue lors de la réinitialisation.'
                );
            } else {
                setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength >= 75) return 'bg-green-500';
        if (passwordStrength >= 50) return 'bg-yellow-500';
        if (passwordStrength >= 25) return 'bg-orange-500';
        return 'bg-red-500';
    };

    if (verifying) {
        return (
            <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">Vérification du lien</h3>
                    <p className="mt-2 text-gray-600">Veuillez patienter pendant la validation...</p>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="flex flex-col justify-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-red-50">
                            <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-900">Lien invalide</h2>
                        <p className="mb-8 text-gray-600">{error}</p>
                        <Link
                            to="/forgot-password"
                            className="inline-flex items-center px-4 py-2 font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <ArrowPathIcon className="w-4 h-4 mr-2" />
                            Demander un nouveau lien
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                        <LockClosedIcon className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
                    Nouveau mot de passe
                </h2>
                <p className="mt-2 text-sm text-center text-gray-600">
                    Créez un nouveau mot de passe sécurisé pour votre compte
                </p>
            </div>

            {success ? (
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="px-6 py-10 text-center bg-white border border-gray-100 shadow-lg rounded-xl sm:px-10">
                        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-green-50">
                            <CheckCircleIcon className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="mb-4 text-xl font-semibold text-gray-900">Mot de passe réinitialisé !</h3>
                        <p className="mb-6 text-gray-600">
                            Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion.
                        </p>
                        <div className="w-8 h-8 mx-auto border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                </div>
            ) : (
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="px-6 py-8 bg-white border border-gray-100 shadow-lg rounded-xl sm:px-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 border border-red-100 rounded-lg bg-red-50">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-red-800">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                                    Nouveau mot de passe
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <LockClosedIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
                                        placeholder="Minimum 8 caractères"
                                        minLength="8"
                                    />
                                </div>
                                {password && (
                                    <div className="mt-3">
                                        <div className="flex justify-between mb-1 text-xs text-gray-500">
                                            <span>Force du mot de passe</span>
                                            <span>{passwordStrength}%</span>
                                        </div>
                                        <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                                            <div
                                                className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                style={{ width: `${passwordStrength}%` }}
                                            ></div>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            {password.length < 8 && <p className="text-red-500">• Au moins 8 caractères</p>}
                                            {!/[A-Z]/.test(password) && <p className="text-red-500">• Une majuscule</p>}
                                            {!/[0-9]/.test(password) && <p className="text-red-500">• Un chiffre</p>}
                                            {!/[^A-Za-z0-9]/.test(password) && <p className="text-red-500">• Un caractère spécial</p>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="passwordConfirmation" className="block mb-2 text-sm font-medium text-gray-700">
                                    Confirmer le mot de passe
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <LockClosedIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="passwordConfirmation"
                                        name="password_confirmation"
                                        type="password"
                                        required
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        className={`block w-full rounded-lg border bg-white py-3 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 sm:text-sm ${passwordConfirmation && password !== passwordConfirmation
                                            ? 'border-red-300 focus:border-red-500'
                                            : 'border-gray-300 focus:border-blue-500'
                                            }`}
                                        placeholder="Retapez votre mot de passe"
                                        minLength="8"
                                    />
                                </div>
                                {passwordConfirmation && password === passwordConfirmation && (
                                    <p className="flex items-center mt-2 text-sm text-green-600">
                                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                                        Les mots de passe correspondent
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || password !== passwordConfirmation || password.length < 8}
                                className="flex items-center justify-center w-full px-4 py-3 font-medium text-white transition-all duration-200 rounded-lg shadow-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Réinitialisation...
                                    </>
                                ) : 'Réinitialiser le mot de passe'}
                            </button>

                            <div className="pt-6 text-center border-t border-gray-100">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
                                >
                                    Retour à la page de connexion
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;