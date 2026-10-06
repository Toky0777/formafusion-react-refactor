import { useEffect, useState } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useApiProfile } from './components/hooks/UseApiProfile';
import { useNotifications } from './components/hooks/useNotifications';
import { NotificationBanner } from './components/ui/NotificationBanner';
import { TraitForm } from './components/forms/TraitForm';
import { ReasonForm } from './components/forms/ReasonForm';
import { TraitsSection } from './components/sections/TraitsSection';
import { ReasonsSection } from './components/sections/ReasonsSection';
import { PhotosSection } from './components/sections/PhotosSection';
import axios from '../../../config/axios';

const Profile = () => {
    // State management
    const [traits, setTraits] = useState([]);
    const [reasons, setReasons] = useState([]);
    const [images, setImages] = useState([]);
    const [name, setName] = useState('Utilisateur');
    const [pageLoading, setPageLoading] = useState(true);

    // Modal states
    const [showTraitForm, setShowTraitForm] = useState(false);
    const [showReasonForm, setShowReasonForm] = useState(false);

    // Hooks
    const { apiCall, uploadFiles, loading, getUser } = useApiProfile();
    const { notification, showSuccess, showError, clearNotification } = useNotifications();

    // Load initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/cfp/marketplace/espace/profil');
                const data = response.data;

                setImages(data.images || []);
                setReasons(data.reasons || []);
                setTraits(data.traits || []);
                setName(data.customer?.name || data.name || 'Utilisateur');
            } catch (error) {
                showError('Erreur lors du chargement des données. Veuillez réessayer.');
                console.error('Erreur fetchData:', error);
            } finally {
                setPageLoading(false);
            }
        };

        fetchData();
    }, [showError]);

    // Trait operations
    const handleAddTrait = async (title) => {
        try {
            const response = await apiCall('/cfp/traits/add', {
                method: 'POST',
                data: { title }
            });

            setTraits(prev => [...prev, response]);
            showSuccess('Trait ajouté avec succès!');
        } catch (error) {
            showError(error.message || 'Erreur lors de l\'ajout du trait');
        }
    };

    const handleRemoveTrait = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette caractéristique?')) {
            return;
        }

        try {
            await apiCall(`/cfp/traits/remove/${id}`, {
                method: 'DELETE',
            });

            setTraits(prev => prev.filter(trait => trait.id !== id));
            showSuccess('Trait supprimé avec succès!');
        } catch (error) {
            showError(error.message || 'Erreur lors de la suppression du trait');
        }
    };

    // Reason operations
    const handleAddReason = async (title, description) => {
        try {
            const response = await apiCall('/cfp/reasons/add', {
                method: 'POST',
                data: {
                    title,
                    description,
                },
            });

            setReasons(prev => [...prev, response]);
            showSuccess('Raison ajoutée avec succès!');
        } catch (error) {
            showError(error.message || 'Erreur lors de l\'ajout de la raison');
        }
    };

    const handleRemoveReason = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette raison?')) {
            return;
        }

        try {
            await apiCall(`/cfp/reasons/remove/${id}`, {
                method: 'DELETE',
            });

            setReasons(prev => prev.filter(reason => reason.id !== id));
            showSuccess('Raison supprimée avec succès!');
        } catch (error) {
            showError(error.message || 'Erreur lors de la suppression de la raison');
        }
    };

    // Image operations
    const handleImageUpload = async (files) => {
        const maxSize = 5 * 1024 * 1024; // 5 MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        const fileArray = Array.from(files);
        const invalidFiles = fileArray.filter(
            file => !allowedTypes.includes(file.type) || file.size > maxSize
        );

        if (invalidFiles.length > 0) {
            showError(
                'Certains fichiers sont invalides. Seules les images JPEG, PNG, GIF et WebP de moins de 5MB sont acceptées.'
            );
            return;
        }

        const formData = new FormData();
        fileArray.forEach(file => formData.append('photos[]', file));

        try {
            const response = await uploadFiles(
                '/cfp/picture/add',
                formData
            );

            const uploadedImages = response.images || response.data?.images || [];
            setImages(prev => [...prev, ...uploadedImages]);
            showSuccess(`${uploadedImages.length} image(s) ajoutée(s) avec succès !`);
        } catch (error) {
            showError(error.message || 'Erreur lors de l\'upload. Veuillez réessayer.');
        }
    };

    const handleRemoveImage = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette image?')) {
            return;
        }

        try {
            await apiCall(`/cfp/picture/remove/${id}`, {
                method: 'DELETE',
            });

            setImages(prev => prev.filter(img => img.id !== id));
            showSuccess('Image supprimée avec succès!');
        } catch (error) {
            showError(error.message || 'Erreur lors de la suppression de l\'image');
        }
    };

    // Loading state
    if (pageLoading) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 mx-auto mb-4 text-purple-600 animate-spin" />
                    <p className="text-gray-600">Chargement des données...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="container px-4 py-8 mx-auto">

                <div className="max-w-4xl mx-auto">
                    {/* Notifications */}
                    {notification && (
                        <NotificationBanner
                            type={notification.type}
                            message={notification.message}
                            onClose={clearNotification}
                        />
                    )}

                    {/* Main content */}
                    <div className="overflow-hidden bg-white shadow-lg rounded-xl">
                        <div className="p-8">
                            <button
                                className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 transition bg-gray-100 rounded-full hover:bg-gray-200"
                                onClick={() => window.history.back()}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Retour à mon espace
                            </button>
                            <h1 className="mb-8 text-3xl font-bold text-gray-900">
                                À Propos de votre centre
                            </h1>

                            {/* Traits Section */}
                            <TraitsSection
                                traits={traits}
                                onAdd={() => setShowTraitForm(true)}
                                onRemove={handleRemoveTrait}
                                loading={loading}
                            />

                            {/* Reasons Section */}
                            <ReasonsSection
                                reasons={reasons}
                                onAdd={() => setShowReasonForm(true)}
                                onRemove={handleRemoveReason}
                                loading={loading}
                            />

                            {/* Photos Section */}
                            <PhotosSection
                                images={images}
                                onUpload={handleImageUpload}
                                onRemove={handleRemoveImage}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <TraitForm
                isOpen={showTraitForm}
                onClose={() => setShowTraitForm(false)}
                onSubmit={handleAddTrait}
                loading={loading}
            />

            <ReasonForm
                isOpen={showReasonForm}
                onClose={() => setShowReasonForm(false)}
                onSubmit={handleAddReason}
                loading={loading}
            />
        </main>
    );
};

export default Profile;