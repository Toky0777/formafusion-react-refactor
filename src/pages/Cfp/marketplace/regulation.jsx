import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Save, X, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import axios from '../../../config/axios';

const Regulation = () => {
    // États pour les données des sections
    const [sections, setSections] = useState({
        reglement: '',
        accueil: '',
        conditions: '',
        acces: '',
        accompagnement: ''
    });

    // État pour l'organigramme
    const [organigramme, setOrganigramme] = useState(null);
    const [organigrammeFile, setOrganigrammeFile] = useState(null);

    // État pour l'onglet actif
    const [activeTab, setActiveTab] = useState('reglement');

    // État pour les formulaires d'édition
    const [editingSection, setEditingSection] = useState(null);
    const [editingOrganigramme, setEditingOrganigramme] = useState(false);

    // État pour les contenus des éditeurs
    const [editorContents, setEditorContents] = useState({});

    // États pour les messages et le chargement
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Récupération des données utilisateur
    const getUser = () => {
        try {
            const userData = localStorage.getItem('user'); // Changé de sessionStorage à localStorage
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            return null;
        }
    };

    // Configuration des onglets
    const tabs = [
        { id: 'reglement', label: 'Règlement', icon: '📋' },
        { id: 'accueil', label: 'Accueil', icon: '👋' },
        { id: 'conditions', label: 'Conditions de Ventes', icon: '📄' },
        { id: 'acces', label: 'Accès', icon: '🚪' },
        { id: 'accompagnement', label: 'Suivi et accompagnement', icon: '🤝' },
        { id: 'organigramme', label: 'Organigramme', icon: '🏢' }
    ];

    // Fonction pour afficher les messages temporaires
    const showMessage = useCallback((message, type = 'success') => {
        if (type === 'success') {
            setSuccessMessage(message);
            setErrorMessage('');
        } else {
            setErrorMessage(message);
            setSuccessMessage('');
        }

        setTimeout(() => {
            setSuccessMessage('');
            setErrorMessage('');
        }, 5000);
    }, []);

    // Fonction pour charger les données depuis l'API
    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`/cfp/espace/get_by_section`);
            const result = response.data;

            if (result.status !== 200) {
                throw new Error(result.message || 'Erreur lors du chargement');
            }

            const sections = result.sections || {};

            setSections({
                reglement: sections.reglement?.contenu ?? '',
                accueil: sections.accueil?.contenu ?? '',
                conditions: sections.conditions?.contenu ?? '',
                acces: sections.acces?.contenu ?? '',
                accompagnement: sections.accompagnement?.contenu ?? ''
            });

            if (sections.organigramme?.url) {
                setOrganigramme(sections.organigramme.url);
            }

        } catch (error) {
            showMessage(
                error.response?.data?.message ||
                error.message ||
                'Erreur lors du chargement des données.',
                'error'
            );
            console.error('Erreur fetchData:', error);
        } finally {
            setLoading(false);
        }
    }, [showMessage]);

    // Charger les données au montage du composant
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Fonction pour changer d'onglet
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setEditingSection(null);
        setEditingOrganigramme(false);
    };

    // Fonction pour gérer l'édition d'une section
    const handleEditSection = (sectionName) => {
        setEditingSection(sectionName);
        setEditorContents({
            ...editorContents,
            [sectionName]: sections[sectionName] || ''
        });
    };

    // Fonction pour gérer l'édition de l'organigramme
    const handleEditOrganigramme = () => {
        setEditingOrganigramme(!editingOrganigramme);
    };

    // Fonction pour sauvegarder une section
    const handleSaveSection = async (sectionName) => {
        const content = editorContents[sectionName] || '';

        try {
            setSaving(true);

            const response = await axios.post('/cfp/espace/store_by_section', {
                section: sectionName,
                content: content
            });

            const data = response.data;

            if (data.status === 201) {
                setSections({
                    ...sections,
                    [sectionName]: content
                });
                setEditingSection(null);
                showMessage(data.message);
            } else {
                throw new Error(data.message || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            showMessage(
                error.response?.data?.message ||
                error.message ||
                'Erreur lors de la sauvegarde',
                'error'
            );
        } finally {
            setSaving(false);
        }
    };

    // Fonction pour gérer le changement de contenu dans l'éditeur
    const handleEditorChange = (sectionName, content) => {
        setEditorContents({
            ...editorContents,
            [sectionName]: content
        });
    };

    // Fonction pour gérer le téléchargement de fichier
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Vérifier la taille du fichier (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showMessage('Le fichier est trop volumineux (max 5MB)', 'error');
                return;
            }

            // Vérifier le type de fichier
            if (!file.type.startsWith('image/')) {
                showMessage('Seules les images sont autorisées', 'error');
                return;
            }

            setOrganigrammeFile(file);

            // Créer une URL pour prévisualiser l'image
            const reader = new FileReader();
            reader.onload = (e) => {
                setOrganigramme(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Fonction pour sauvegarder l'organigramme
    const handleSaveOrganigramme = async () => {
        if (!organigrammeFile) {
            showMessage('Données manquantes', 'error');
            return;
        }

        try {
            setSaving(true);
            const formData = new FormData();
            formData.append('photo', organigrammeFile);

            const response = await axios.post('/cfp/espace/organigramme', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const data = response.data;

            if (data.status === 201) {
                setEditingOrganigramme(false);
                showMessage('Organigramme mis à jour avec succès !');
            } else {
                throw new Error(data.message || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            showMessage(
                error.response?.data?.message ||
                error.message ||
                'Erreur lors de la sauvegarde de l\'organigramme',
                'error'
            );
        } finally {
            setSaving(false);
        }
    };

    // Composant de message
    const MessageAlert = ({ message, type }) => (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${type === 'success'
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
            {type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
            ) : (
                <AlertCircle className="w-5 h-5" />
            )}
            <span>{message}</span>
        </div>
    );

    // Rendu du contenu d'une section
    const renderSectionContent = (sectionName, sectionData) => (
        <div key={sectionName} className={`space-y-3 group ${activeTab === sectionName ? 'block' : 'hidden'}`}>
            <div className="inline-flex items-center gap-4">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                    <span>{tabs.find(tab => tab.id === sectionName)?.icon}</span>
                    {tabs.find(tab => tab.id === sectionName)?.label}
                </h2>
                <div
                    onClick={() => !saving && handleEditSection(sectionName)}
                    className={`flex items-center justify-center w-8 h-8 duration-300 bg-purple-200 rounded-md cursor-pointer opacity-20 group-hover:opacity-100 ${saving ? 'cursor-not-allowed opacity-50' : 'hover:bg-purple-300'
                        }`}
                >
                    {sectionData ? (
                        <Pencil className="w-4 h-4 text-purple-600" />
                    ) : (
                        <Plus className="w-4 h-4 text-purple-600" />
                    )}
                </div>
            </div>

            {editingSection === sectionName && (
                <div className="p-4 space-y-4 border rounded-lg bg-gray-50">
                    <textarea
                        value={editorContents[sectionName] || ''}
                        onChange={(e) => handleEditorChange(sectionName, e.target.value)}
                        className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-vertical focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ajouter votre contenu..."
                        disabled={saving}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSaveSection(sectionName)}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {sectionData ? 'Modifier' : 'Ajouter'}
                        </button>
                        <button
                            onClick={() => setEditingSection(null)}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            <X className="w-4 h-4" />
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-start gap-4 p-4 border rounded-lg shadow-sm bg-gray-50">
                {!sectionData ? (
                    <div className="w-full py-8 text-center">
                        <div className="mb-2 text-4xl text-gray-400">📝</div>
                        <p className="text-gray-500">Aucune information disponible. Cliquez sur le bouton + pour en ajouter une.</p>
                    </div>
                ) : (
                    <div className="w-full space-y-3">
                        <div
                            dangerouslySetInnerHTML={{ __html: sectionData }}
                            className="prose-sm prose max-w-none"
                        />
                    </div>
                )}
            </div>
        </div>
    );

    // Rendu du contenu de l'organigramme
    const renderOrganigrammeContent = () => (
        <div className={`space-y-3 group ${activeTab === 'organigramme' ? 'block' : 'hidden'}`}>
            <div className="inline-flex items-center gap-4">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                    <span>🏢</span>
                    Organigramme
                </h2>
                <div
                    onClick={() => !saving && handleEditOrganigramme()}
                    className={`flex items-center justify-center w-8 h-8 duration-300 bg-purple-200 rounded-md cursor-pointer opacity-20 group-hover:opacity-100 ${saving ? 'cursor-not-allowed opacity-50' : 'hover:bg-purple-300'
                        }`}
                >
                    {organigramme ? (
                        <Pencil className="w-4 h-4 text-purple-600" />
                    ) : (
                        <Plus className="w-4 h-4 text-purple-600" />
                    )}
                </div>
            </div>

            {editingOrganigramme && (
                <div className="p-4 space-y-4 border rounded-lg bg-gray-50">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Choisir une image (max 5MB)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            disabled={saving}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSaveOrganigramme}
                            disabled={!organigrammeFile || saving}
                            className="flex items-center gap-2 px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {organigramme ? 'Modifier' : 'Ajouter'}
                        </button>
                        <button
                            onClick={() => setEditingOrganigramme(false)}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            <X className="w-4 h-4" />
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-start gap-4 p-4 border rounded-lg shadow-sm bg-gray-50">
                {!organigramme ? (
                    <div className="w-full py-8 text-center">
                        <div className="mb-2 text-4xl text-gray-400">🏢</div>
                        <p className="text-gray-500">Aucun organigramme disponible. Cliquez sur le bouton + pour en ajouter un.</p>
                    </div>
                ) : (
                    <img
                        src={organigramme}
                        alt="Organigramme"
                        className="w-full h-auto rounded-lg shadow-sm"
                    />
                )}
            </div>
        </div>
    );

    // Affichage du loader
    if (loading) {
        return (
            <main className="flex-grow">
                <div className="container px-4 py-8 mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                            <span className="text-gray-600">Chargement des données...</span>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-grow">
            <div className="container py-8 mx-auto">
                <div className="container flex flex-col items-center justify-center w-full mx-auto">
                    <div className="w-full max-w-7xl">
                        {/* Bouton Retour */}
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 transition bg-gray-100 rounded-full hover:bg-gray-200"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Retour à mon espace
                        </button>

                        {/* Titre de la page */}
                        <h1 className="mb-8 text-3xl font-bold text-gray-900">
                            À propos de votre centre
                        </h1>

                        {/* Messages */}
                        {successMessage && <MessageAlert message={successMessage} type="success" />}
                        {errorMessage && <MessageAlert message={errorMessage} type="error" />}

                        <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-lg">
                            {/* Navigation par onglets */}
                            <div className="flex overflow-x-auto border-b bg-gray-50">
                                <nav className="flex overflow-x-auto">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => handleTabChange(tab.id)}
                                            className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${activeTab === tab.id
                                                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <span>{tab.icon}</span>
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Contenu des onglets */}
                            <div className="p-4 bg-white">
                                {/* Sections normales */}
                                {Object.entries(sections).map(([sectionName, sectionData]) =>
                                    renderSectionContent(sectionName, sectionData)
                                )}

                                {/* Section organigramme */}
                                {renderOrganigrammeContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Regulation;