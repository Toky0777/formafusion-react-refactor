// pages/AIRentabilityTest.jsx
import { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  BarChart3,
  Target,
  Percent,
  Sparkles,
  PieChart,
  Loader2,
  Building,
  Plus,
  Trash2,
  Cpu,
  Database,
} from 'lucide-react';
import aiService from './aiService';
import axios from '../../../config/axios';

const AIRentabilityTest = () => {
    const [loading, setLoading] = useState(false);
    const [loadingModules, setLoadingModules] = useState(true);
    const [loadingClients, setLoadingClients] = useState(true);
    const [healthStatus, setHealthStatus] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [trainLoading, setTrainLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('test');

    // Données dynamiques
    const [modules, setModules] = useState([]);
    const [clients, setClients] = useState([]);

    const [formData, setFormData] = useState({
        module_id: '',
        type_projet: '2',
        date_debut: '',
        date_fin: '',
        nb_place: 10,
        frais: [],
        entreprises_interessees: []
    });

    const [newFrais, setNewFrais] = useState({ libelle: '', montant: '' });
    const [newEntreprise, setNewEntreprise] = useState('');

    // Charger les modules et clients au montage
    useEffect(() => {
        loadModules();
        loadClients();
        checkHealth();
        loadStatistics();
    }, []);

    const loadModules = async () => {
        setLoadingModules(true);
        try {
            const response = await axios.get('/ai/getModuleCfp');
            setModules(response.data || []);
        } catch (err) {
            console.error('Erreur chargement modules:', err);
        } finally {
            setLoadingModules(false);
        }
    };

    const loadClients = async () => {
        setLoadingClients(true);
        try {
            const response = await axios.get('/ai/getClientCfp');
            setClients(response.data || []);
        } catch (err) {
            console.error('Erreur chargement clients:', err);
        } finally {
            setLoadingClients(false);
        }
    };

    const checkHealth = async () => {
        try {
            const response = await aiService.checkHealth();
            setHealthStatus(response.data);
        } catch (err) {
            setHealthStatus({ online: false });
        }
    };

    const loadStatistics = async () => {
        try {
            const response = await aiService.getStatistics();
            if (response.success) {
                setStatistics(response.data);
            }
        } catch (err) {
            console.error('Erreur chargement statistiques:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddFrais = () => {
        if (newFrais.libelle && newFrais.montant) {
            setFormData(prev => ({
                ...prev,
                frais: [...prev.frais, { ...newFrais, montant: parseFloat(newFrais.montant) }]
            }));
            setNewFrais({ libelle: '', montant: '' });
        }
    };

    const handleRemoveFrais = (index) => {
        setFormData(prev => ({
            ...prev,
            frais: prev.frais.filter((_, i) => i !== index)
        }));
    };

    const handleAddEntreprise = () => {
        if (newEntreprise) {
            setFormData(prev => ({
                ...prev,
                entreprises_interessees: [...prev.entreprises_interessees, parseInt(newEntreprise)]
            }));
            setNewEntreprise('');
        }
    };

    const handleRemoveEntreprise = (id) => {
        setFormData(prev => ({
            ...prev,
            entreprises_interessees: prev.entreprises_interessees.filter(e => e !== id)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPrediction(null);

        try {
            const response = await aiService.predictRentability(formData);
            if (response.success) {
                setPrediction(response.data);
            } else {
                setError(response.errors || 'Erreur lors de la prédiction');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion au service');
        } finally {
            setLoading(false);
        }
    };

    const handleTrainModel = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir réentraîner le modèle ? Cette opération peut prendre quelques minutes.')) {
            return;
        }

        setTrainLoading(true);
        try {
            const response = await aiService.trainModel();
            if (response.success) {
                alert('Modèle entraîné avec succès !');
                loadStatistics();
            } else {
                alert(response.message || 'Erreur lors de l\'entraînement');
            }
        } catch (err) {
            alert('Erreur de connexion au service');
        } finally {
            setTrainLoading(false);
        }
    };

    const getModuleDetails = (moduleId) => {
        return modules.find(m => m.idModule === parseInt(moduleId)) || null;
    };

    const getClientDetails = (clientId) => {
        return clients.find(c => c.idEtp === parseInt(clientId)) || null;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MGA',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value || 0);
    };

    const getConfidenceColor = (confidence) => {
        switch (confidence) {
            case 'high': return 'bg-emerald-50 border-emerald-200';
            case 'medium': return 'bg-amber-50 border-amber-200';
            case 'low': return 'bg-slate-50 border-slate-200';
            default: return 'bg-slate-50 border-slate-200';
        }
    };

    const getConfidenceTextColor = (confidence) => {
        switch (confidence) {
            case 'high': return 'text-emerald-700';
            case 'medium': return 'text-amber-700';
            case 'low': return 'text-slate-700';
            default: return 'text-slate-700';
        }
    };

    const getConfidenceIcon = (confidence) => {
        switch (confidence) {
            case 'high':
                return <CheckCircle className="w-4 h-4 text-emerald-600" />;
            case 'medium':
                return <AlertCircle className="w-4 h-4 text-amber-600" />;
            case 'low':
                return <Info className="w-4 h-4 text-slate-600" />;
            default:
                return <Info className="w-4 h-4 text-slate-600" />;
        }
    };

    const selectedModule = getModuleDetails(formData.module_id);
    const totalFrais = formData.frais.reduce((sum, f) => sum + f.montant, 0);
    const caPotentiel = (formData.nb_place || 0) * (selectedModule?.module_prix || 0);
    const resultatNet = caPotentiel - totalFrais;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header simplifié */}
            <div className="bg-white border-b border-slate-200">
                <div className="px-6 mx-auto max-w-7xl">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-200">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-slate-900">
                                    Analyse de Rentabilité IA
                                </h1>
                                <p className="text-sm text-slate-500">
                                    Prédictions basées sur l'intelligence artificielle
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className={`px-3 py-1.5 rounded-lg border ${healthStatus?.online
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-rose-50 border-rose-200'
                                }`}>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${healthStatus?.online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                                        }`} />
                                    <span className={`text-xs font-medium ${healthStatus?.online ? 'text-emerald-700' : 'text-rose-700'
                                        }`}>
                                        {healthStatus?.online ? 'API Connectée' : 'API Hors ligne'}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleTrainModel}
                                disabled={trainLoading}
                                className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {trainLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Cpu className="w-4 h-4" />
                                )}
                                <span>Entraîner</span>
                            </button>
                        </div>
                    </div>

                    {/* Navigation simplifiée */}
                    <div className="flex space-x-1">
                        <button
                            onClick={() => setActiveTab('test')}
                            className={`px-4 py-2 text-sm font-medium transition-all rounded-t-lg ${activeTab === 'test'
                                ? 'text-blue-600 bg-white border-b-2 border-blue-600'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Prédiction
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`px-4 py-2 text-sm font-medium transition-all rounded-t-lg ${activeTab === 'stats'
                                ? 'text-blue-600 bg-white border-b-2 border-blue-600'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Statistiques
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-6 py-8 mx-auto max-w-7xl">
                {activeTab === 'test' ? (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Formulaire simplifié */}
                        <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
                            <div className="p-5 border-b border-slate-100">
                                <h2 className="flex items-center text-sm font-semibold text-slate-900">
                                    <FileText className="w-4 h-4 mr-2 text-blue-600" />
                                    Détails du projet
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-5 space-y-5">
                                {/* Module */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Module de formation
                                    </label>
                                    {loadingModules ? (
                                        <div className="flex items-center justify-center p-4 border rounded-lg border-slate-200 bg-slate-50">
                                            <Loader2 className="w-4 h-4 mr-2 text-blue-600 animate-spin" />
                                            <span className="text-sm text-slate-600">Chargement...</span>
                                        </div>
                                    ) : (
                                        <select
                                            name="module_id"
                                            value={formData.module_id}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Sélectionner un module</option>
                                            {modules.map(module => (
                                                <option key={module.idModule} value={module.idModule}>
                                                    {module.module_name} - {module.module_duree}j - {formatCurrency(module.module_prix)}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Type de projet simplifié */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Type de projet
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, type_projet: '1' }))}
                                            className={`flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg border transition-all ${formData.type_projet === '1'
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            <Users className={`w-4 h-4 mr-2 ${formData.type_projet === '1' ? 'text-blue-600' : 'text-slate-400'
                                                }`} />
                                            INTRA
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, type_projet: '2' }))}
                                            className={`flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg border transition-all ${formData.type_projet === '2'
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            <Building2 className={`w-4 h-4 mr-2 ${formData.type_projet === '2' ? 'text-indigo-600' : 'text-slate-400'
                                                }`} />
                                            INTER
                                        </button>
                                    </div>
                                </div>

                                {/* Dates et places en ligne */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Début
                                        </label>
                                        <input
                                            type="date"
                                            name="date_debut"
                                            value={formData.date_debut}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Fin
                                        </label>
                                        <input
                                            type="date"
                                            name="date_fin"
                                            value={formData.date_fin}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Places
                                        </label>
                                        <input
                                            type="number"
                                            name="nb_place"
                                            value={formData.nb_place}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="50"
                                            className="w-full px-3 py-2 text-sm border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Frais simplifiés */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Frais additionnels
                                    </label>
                                    <div className="space-y-2">
                                        {formData.frais.map((frais, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{frais.libelle}</p>
                                                    <p className="text-xs text-slate-500">{formatCurrency(frais.montant)}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFrais(index)}
                                                    className="transition-colors text-slate-400 hover:text-rose-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}

                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                placeholder="Libellé"
                                                value={newFrais.libelle}
                                                onChange={(e) => setNewFrais(prev => ({ ...prev, libelle: e.target.value }))}
                                                className="flex-1 px-3 py-2 text-sm border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Montant"
                                                value={newFrais.montant}
                                                onChange={(e) => setNewFrais(prev => ({ ...prev, montant: e.target.value }))}
                                                className="w-24 px-3 py-2 text-sm border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddFrais}
                                                disabled={!newFrais.libelle || !newFrais.montant}
                                                className="px-3 py-2 text-sm font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Entreprises */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Entreprises intéressées
                                    </label>
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-2">
                                            {formData.entreprises_interessees.map(id => {
                                                const client = getClientDetails(id);
                                                return (
                                                    <span key={id} className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-slate-100">
                                                        <Building className="w-3 h-3 mr-1 text-slate-500" />
                                                        {client?.etp_name || 'Client'}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveEntreprise(id)}
                                                            className="ml-1.5 text-slate-400 hover:text-rose-500"
                                                        >
                                                            <XCircle className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        <div className="flex space-x-2">
                                            <select
                                                value={newEntreprise}
                                                onChange={(e) => setNewEntreprise(e.target.value)}
                                                className="flex-1 px-3 py-2 text-sm border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Sélectionner</option>
                                                {clients.map(client => (
                                                    <option key={client.idEtp} value={client.idEtp}>
                                                        {client.etp_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={handleAddEntreprise}
                                                disabled={!newEntreprise}
                                                className="px-3 py-2 text-sm font-medium text-indigo-600 transition-colors rounded-lg bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Aperçu financier simplifié */}
                                {selectedModule && (
                                    <div className="p-4 border rounded-lg bg-gradient-to-br from-slate-50 to-white border-slate-200">
                                        <h3 className="mb-3 text-xs font-medium tracking-wider uppercase text-slate-500">
                                            Aperçu financier
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Chiffre d'affaires</span>
                                                <span className="font-medium text-emerald-600">{formatCurrency(caPotentiel)}</span>
                                            </div>
                                            {totalFrais > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600">Total frais</span>
                                                    <span className="font-medium text-rose-600">{formatCurrency(totalFrais)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between pt-2 border-t border-slate-200">
                                                <span className="text-sm font-medium text-slate-700">Résultat net</span>
                                                <span className={`font-semibold ${resultatNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {formatCurrency(resultatNet)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Bouton d'analyse */}
                                <button
                                    type="submit"
                                    disabled={loading || !formData.module_id}
                                    className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Analyse en cours...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            <span>Prédire la rentabilité</span>
                                        </>
                                    )}
                                </button>

                                {error && (
                                    <div className="p-3 border rounded-lg bg-rose-50 border-rose-200">
                                        <div className="flex items-center space-x-2 text-rose-700">
                                            <AlertCircle className="flex-shrink-0 w-4 h-4" />
                                            <span className="text-xs font-medium">{error}</span>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Résultats */}
                        <div className="space-y-6">
                            {prediction ? (
                                <>
                                    {/* Carte principale */}
                                    <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-200">
                                        <div className="p-5 border-b border-slate-100">
                                            <div className="flex items-center justify-between">
                                                <h2 className="flex items-center text-sm font-semibold text-slate-900">
                                                    <Target className="w-4 h-4 mr-2 text-blue-600" />
                                                    Résultat de l'analyse
                                                </h2>
                                                {prediction.method === 'fallback' && (
                                                    <span className="flex items-center px-2 py-1 text-xs font-medium rounded-md text-amber-700 bg-amber-50">
                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                        Mode dégradé
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            {/* Score */}
                                            <div className="mb-6 text-center">
                                                <div className="mb-1 text-5xl font-bold">
                                                    <span className={prediction.is_rentable ? 'text-emerald-600' : 'text-rose-600'}>
                                                        {Math.round(prediction.probability * 100)}%
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500">Probabilité de rentabilité</p>
                                            </div>

                                            {/* Indicateurs */}
                                            <div className="grid grid-cols-2 gap-3 mb-6">
                                                <div className={`p-3 rounded-lg border ${getConfidenceColor(prediction.confidence)}`}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-slate-600">Confiance</span>
                                                        {getConfidenceIcon(prediction.confidence)}
                                                    </div>
                                                    <p className={`text-sm font-semibold capitalize ${getConfidenceTextColor(prediction.confidence)}`}>
                                                        {prediction.confidence === 'high' && 'Élevée'}
                                                        {prediction.confidence === 'medium' && 'Moyenne'}
                                                        {prediction.confidence === 'low' && 'Faible'}
                                                    </p>
                                                </div>

                                                <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-blue-700">Marge</span>
                                                        <Percent className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-blue-700">
                                                        {Math.round(prediction.margin || 0)}%
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Facteurs */}
                                            {prediction.factors && prediction.factors.length > 0 && (
                                                <div className="mb-6">
                                                    <h3 className="mb-2 text-xs font-medium tracking-wider uppercase text-slate-500">
                                                        Facteurs d'influence
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {prediction.factors.map((factor, index) => (
                                                            <span key={index} className="px-2 py-1 text-xs rounded-md bg-slate-100 text-slate-700">
                                                                {factor.replace(/_/g, ' ')}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Conseils */}
                                            {prediction.advice && (
                                                <div className={`p-3 rounded-lg ${prediction.is_rentable
                                                    ? 'bg-emerald-50 border border-emerald-200'
                                                    : 'bg-amber-50 border border-amber-200'
                                                    }`}>
                                                    <p className={`text-xs ${prediction.is_rentable ? 'text-emerald-700' : 'text-amber-700'
                                                        }`}>
                                                        {prediction.advice}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Simulation financière */}
                                    {selectedModule && (
                                        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
                                            <h3 className="mb-4 text-xs font-medium tracking-wider uppercase text-slate-500">
                                                Simulation financière
                                            </h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between py-2 border-b border-slate-100">
                                                    <span className="text-sm text-slate-600">Module</span>
                                                    <span className="text-sm font-medium text-slate-900">{selectedModule.module_name}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-slate-100">
                                                    <span className="text-sm text-slate-600">Durée</span>
                                                    <span className="text-sm font-medium text-slate-900">{selectedModule.module_duree} jours</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-slate-100">
                                                    <span className="text-sm text-slate-600">Prix unitaire</span>
                                                    <span className="text-sm font-medium text-slate-900">{formatCurrency(selectedModule.module_prix)}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-slate-100">
                                                    <span className="text-sm text-slate-600">CA potentiel</span>
                                                    <span className="text-sm font-medium text-emerald-600">{formatCurrency(caPotentiel)}</span>
                                                </div>
                                                {totalFrais > 0 && (
                                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                                        <span className="text-sm text-slate-600">Frais</span>
                                                        <span className="text-sm font-medium text-rose-600">{formatCurrency(totalFrais)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between pt-2">
                                                    <span className="text-sm font-medium text-slate-700">Résultat net</span>
                                                    <span className={`text-base font-bold ${resultatNet > 0 ? 'text-emerald-600' : resultatNet < 0 ? 'text-rose-600' : 'text-slate-600'
                                                        }`}>
                                                        {formatCurrency(resultatNet)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="p-12 bg-white border shadow-sm rounded-xl border-slate-200">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                                            <Sparkles className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h3 className="mb-1 text-sm font-medium text-slate-900">
                                            Prêt pour l'analyse ?
                                        </h3>
                                        <p className="mb-4 text-xs text-slate-500">
                                            Remplissez le formulaire pour obtenir une prédiction
                                        </p>
                                        <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
                                            <Database className="w-3 h-3" />
                                            <span>{statistics?.total_projets || 0} projets analysés</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Onglet Statistiques simplifié */
                    <div className="space-y-6">
                        {/* Cartes KPI */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <BarChart3 className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-xs text-slate-400">Total</span>
                                </div>
                                <p className="text-2xl font-semibold text-slate-900">{statistics?.total_projets || 0}</p>
                                <p className="mt-1 text-xs text-slate-500">Projets analysés</p>
                            </div>

                            <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 rounded-lg bg-emerald-100">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="text-xs text-slate-400">Rentables</span>
                                </div>
                                <p className="text-2xl font-semibold text-slate-900">{statistics?.projets_rentables || 0}</p>
                                <p className="mt-1 text-xs text-slate-500">Projets rentables</p>
                            </div>

                            <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Percent className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span className="text-xs text-slate-400">Taux</span>
                                </div>
                                <p className="text-2xl font-semibold text-slate-900">{statistics?.taux_rentabilite || 0}%</p>
                                <p className="mt-1 text-xs text-slate-500">Taux de réussite</p>
                            </div>

                            <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 rounded-lg bg-amber-100">
                                        <DollarSign className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <span className="text-xs text-slate-400">Net</span>
                                </div>
                                <p className="text-2xl font-semibold text-slate-900">
                                    {statistics?.resultat_net?.toLocaleString() || 0} MGA
                                </p>
                                <p className="mt-1 text-xs text-slate-500">Résultat global</p>
                            </div>
                        </div>

                        {/* Graphique */}
                        <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
                            <h3 className="flex items-center mb-4 text-sm font-medium text-slate-900">
                                <PieChart className="w-4 h-4 mr-2 text-blue-600" />
                                Répartition financière
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1 text-sm">
                                        <span className="text-slate-600">Recettes</span>
                                        <span className="font-medium text-emerald-600">
                                            {statistics?.total_recettes?.toLocaleString() || 0} MGA
                                        </span>
                                    </div>
                                    <div className="w-full h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-2 transition-all duration-500 rounded-full bg-emerald-600"
                                            style={{
                                                width: `${Math.min(100, ((statistics?.total_recettes || 0) / ((statistics?.total_recettes || 0) + (statistics?.total_depenses || 1)) * 100))}%`
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1 text-sm">
                                        <span className="text-slate-600">Dépenses</span>
                                        <span className="font-medium text-rose-600">
                                            {statistics?.total_depenses?.toLocaleString() || 0} MGA
                                        </span>
                                    </div>
                                    <div className="w-full h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-2 transition-all duration-500 rounded-full bg-rose-600"
                                            style={{
                                                width: `${Math.min(100, ((statistics?.total_depenses || 0) / ((statistics?.total_recettes || 0) + (statistics?.total_depenses || 1)) * 100))}%`
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 text-center">
                                    <div className="text-2xl font-semibold text-slate-900">
                                        {statistics?.taux_rentabilite || 0}%
                                    </div>
                                    <p className="text-xs text-slate-500">Taux de rentabilité global</p>
                                </div>
                            </div>
                        </div>

                        {/* État du modèle */}
                        {healthStatus && (
                            <div className="p-5 bg-white border shadow-sm rounded-xl border-slate-200">
                                <h3 className="flex items-center mb-4 text-sm font-medium text-slate-900">
                                    <Cpu className="w-4 h-4 mr-2 text-indigo-600" />
                                    État du modèle IA
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-lg bg-slate-50">
                                        <p className="mb-1 text-xs text-slate-500">Statut</p>
                                        <div className="flex items-center">
                                            <div className={`w-2 h-2 rounded-full mr-2 ${healthStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                                                }`} />
                                            <span className={`text-sm font-medium ${healthStatus.online ? 'text-emerald-700' : 'text-rose-700'
                                                }`}>
                                                {healthStatus.online ? 'Connecté' : 'Hors ligne'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-lg bg-slate-50">
                                        <p className="mb-1 text-xs text-slate-500">Modèle</p>
                                        <div className="flex items-center">
                                            {healthStatus.model_loaded ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-1 text-emerald-600" />
                                                    <span className="text-sm font-medium text-emerald-700">Chargé</span>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle className="w-4 h-4 mr-1 text-amber-600" />
                                                    <span className="text-sm font-medium text-amber-700">Non chargé</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {healthStatus.response?.model_info && (
                                        <>
                                            <div className="p-3 rounded-lg bg-slate-50">
                                                <p className="mb-1 text-xs text-slate-500">Précision</p>
                                                <p className="text-sm font-medium text-emerald-700">
                                                    {Math.round(healthStatus.response.model_info.accuracy * 100)}%
                                                </p>
                                            </div>
                                            <div className="p-3 rounded-lg bg-slate-50">
                                                <p className="mb-1 text-xs text-slate-500">Échantillons</p>
                                                <p className="text-sm font-medium text-slate-700">
                                                    {healthStatus.response.model_info.n_samples}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIRentabilityTest;