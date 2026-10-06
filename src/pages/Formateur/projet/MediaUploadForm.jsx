import { useState } from 'react';
import axios from 'axios';
import { Upload, UploadCloud, Image, Video, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa6';
import swal from 'sweetalert';
import { API_URL } from "../../../config/env";

const MediaUploadForm = ({ projet, isCfp = false }) => {
    // États
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loadingState, setLoadingState] = useState({
        loading: false,
        progress: 0,
        currentFile: null,
        totalFiles: 0
    });

    const idProjet = projet.projet?.idProjet;

    // Fonction de validation des fichiers
    const validateFiles = async (files) => {
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'video/mp4',
            'video/avi',
            'video/quicktime',
            'video/x-msvideo',
            'video/webm'
        ];

        const maxSize = 100 * 1024 * 1024; // 100MB

        // Vérifier chaque fichier
        for (const file of files) {
            // Vérifier le type
            if (!allowedTypes.includes(file.type)) {
                const fileExtension = file.name.split('.').pop()?.toLowerCase();
                const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);
                const isVideo = ['mp4', 'avi', 'mov', 'webm'].includes(fileExtension);

                if (!isImage && !isVideo) {
                    await swal({
                        title: "Type de fichier non supporté",
                        text: `${file.name}\n\nFormats acceptés :\n• Images : JPG, PNG, GIF, WebP, SVG\n• Vidéos : MP4, AVI, MOV, WebM`,
                        icon: "error",
                        buttons: ["OK"]
                    });
                    return false;
                }
            }

            // Vérifier la taille
            if (file.size > maxSize) {
                const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                await swal({
                    title: "Fichier trop volumineux",
                    text: `${file.name}\n\nTaille : ${sizeInMB} MB\nMaximum autorisé : 100 MB`,
                    icon: "error",
                    buttons: ["OK"]
                });
                return false;
            }
        }

        console.log(`${files.length} fichier(s) validé(s) avec succès.`);
        return true;
    };

    // Fonction pour gérer l'upload avec progression
    const handleSubmitWithProgress = async () => {
        if (selectedFiles.length === 0) {
            swal({
                title: "Aucun fichier sélectionné",
                text: "Veuillez sélectionner au moins un fichier.",
                icon: "warning",
                buttons: ["OK"]
            });
            return;
        }

        const isValid = await validateFiles(selectedFiles);
        if (!isValid) {
            return;
        }

        if (!projet) {
            swal({
                title: "Erreur",
                text: "ID de projet manquant.",
                icon: "error",
                buttons: ["OK"]
            });
            return;
        }

        const idProjet = projet.projet?.idProjet;

        try {
            // Initialiser le loader avec progression
            setLoadingState({
                loading: true,
                progress: 0,
                currentFile: null,
                totalFiles: selectedFiles.length
            });

            const results = [];
            const totalFiles = selectedFiles.length;

            // Upload fichier par fichier pour suivre la progression
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];

                // Mettre à jour la progression avant le début du fichier
                setLoadingState(prev => ({
                    ...prev,
                    progress: Math.round((i / totalFiles) * 100),
                    currentFile: file.name
                }));

                // Convertir le fichier en base64
                const base64 = await convertFileToBase64(file);

                const formData = new FormData();
                formData.append("description", `Fichier ${i + 1}`);
                formData.append("photo", base64); // Envoyer en base64
                formData.append("idProjet", idProjet);


                var url = null;

                if (isCfp === true) {
                    url = `${API_URL}/cfp/images/${idProjet}`;
                } else {
                    url = `${API_URL}/formateur/images/${idProjet}`;
                }

                const response = await axios.post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            // Progression pour le fichier individuel
                            const fileProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            const totalProgress = Math.round(((i + (fileProgress / 100)) / totalFiles) * 100);

                            setLoadingState(prev => ({
                                ...prev,
                                progress: totalProgress,
                                currentFile: file.name
                            }));
                        }
                    },
                });

                results.push(response);
            }

            // Compléter la progression
            setLoadingState(prev => ({
                ...prev,
                progress: 100,
                currentFile: null
            }));

            // Vérifier les résultats
            const allSuccessful = results.every(res => res.status === 200 || res.status === 201);

            if (allSuccessful) {
                // Réinitialiser les fichiers sélectionnés
                setSelectedFiles([]);

                // Petite pause pour montrer le 100%
                await new Promise(resolve => setTimeout(resolve, 500));

                const imageCount = results.filter(r => r.data.mediaType === 'image').length;
                const videoCount = results.filter(r => r.data.mediaType === 'video').length;

                let message = `${results.length} fichier(s) téléchargé(s) avec succès !`;
                if (imageCount > 0) message += ` ${imageCount} image(s)`;
                if (videoCount > 0) message += ` ${videoCount} vidéo(s)`;

                swal({
                    title: "Succès",
                    text: message,
                    icon: "success",
                    buttons: ["OK"]
                });
            } else {
                throw new Error("Certains fichiers n'ont pas pu être téléchargés.");
            }

        } catch (error) {
            console.error("Erreur lors du téléchargement :", error.response?.data || error.message);

            const errorMessage = error.response?.data?.message
                || error.message
                || "Une erreur est survenue lors du téléchargement des fichiers.";

            swal({
                title: "Erreur",
                text: errorMessage,
                icon: "error",
                buttons: ["OK"]
            });
        } finally {
            // Réinitialiser le loader
            setLoadingState({
                loading: false,
                progress: 0,
                currentFile: null,
                totalFiles: 0
            });
        }
    };

    // Fonction utilitaire pour convertir un fichier en base64
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Gérer la sélection des fichiers
    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(date);
    };

    // Supprimer un fichier
    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Effacer tous les fichiers
    const clearFiles = () => {
        setSelectedFiles([]);
    };

    // Annuler l'upload
    const cancelUpload = async () => {
        const result = await swal({
            title: "Annuler l'importation ?",
            text: "Voulez-vous annuler l'importation ? Les fichiers sélectionnés seront perdus.",
            icon: "warning",
            buttons: ["Non", "Oui, annuler"],
            dangerMode: true
        });

        if (result) {
            setSelectedFiles([]);
        }
    };

    return (
        <>
            {/* Composant principal */}
            <div className="w-full p-4 mx-auto max-w-8xl">
                <div className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-xl rounded-2xl hover:shadow-2xl">

                    {/* En-tête avec gradient */}
                    <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-full bg-white/20">
                                    <Upload className="w-6 h-6 text-gray-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-600">Importation de Médias</h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Téléchargez vos photos et vidéos pour la formation
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Lien pour voir les photos du projet */}
                                {
                                    isCfp ? (
                                        <Link
                                            to={`/cfp/photos/ajout/${idProjet}`}
                                            state={{
                                                project_titre: projet.project_title,
                                                start_date: formatDate(projet.project_start_date),
                                                end_date: formatDate(projet.project_end_date),
                                            }}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 bg-white border rounded-lg text-violet-600 border-violet-200 hover:bg-violet-50 hover:border-violet-300 hover:shadow-md"
                                        >
                                            <FaEye className="w-4 h-4" />
                                            Voir les photos du projet
                                        </Link>
                                    ) :
                                        <Link
                                            to={`/formateur/photos/ajout/${idProjet}`}
                                            state={{
                                                project_titre: projet.project_title,
                                                start_date: formatDate(projet.project_start_date),
                                                end_date: formatDate(projet.project_end_date),
                                            }}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 bg-white border rounded-lg text-violet-600 border-violet-200 hover:bg-violet-50 hover:border-violet-300 hover:shadow-md"
                                        >
                                            <FaEye className="w-4 h-4" />
                                            Voir les photos du projet
                                        </Link>
                                }

                                <span className="px-3 py-1 text-sm font-medium rounded-full bg-white/20">
                                    {selectedFiles.length} fichier(s)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contenu du formulaire */}
                    <div className="p-6">
                        {/* Zone de dépôt principale */}
                        <div className="mb-6">
                            <div className="relative p-8 transition-all duration-300 border-2 border-gray-300 border-dashed rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 hover:border-violet-400 hover:bg-gradient-to-br hover:from-violet-50 hover:to-gray-100">
                                <input
                                    type="file"
                                    id="media-upload"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    multiple
                                    accept="image/*,video/*"
                                    onChange={handleFileSelect}
                                />

                                <div className="flex flex-col items-center justify-center text-center">
                                    {/* Icône de téléchargement */}
                                    <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full shadow-inner bg-gradient-to-r from-gray-50 to-gray-100">
                                        <UploadCloud className="w-10 h-10 text-gray-400" />
                                    </div>

                                    {/* Texte principal */}
                                    <h4 className="mb-2 text-xl font-semibold text-gray-700">
                                        Glissez-déposez vos fichiers
                                    </h4>

                                    <p className="mb-4 text-gray-500">
                                        ou <span className="font-medium text-violet-600">cliquez pour parcourir</span>
                                    </p>

                                    {/* Informations sur les formats supportés */}
                                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm">
                                        <div className="flex items-center gap-1">
                                            <Image className="w-4 h-4 text-blue-500" />
                                            <span className="text-xs text-gray-600">Images</span>
                                        </div>
                                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                        <div className="flex items-center gap-1">
                                            <Video className="w-4 h-4 text-red-500" />
                                            <span className="text-xs text-gray-600">Vidéos</span>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-gray-400">
                                        PNG, JPG, GIF, MP4, AVI • Max 100MB par fichier
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bouton d'importation alternative */}
                        <div className="flex items-center justify-center">
                            <button
                                onClick={() => document.getElementById('media-upload').click()}
                                className="inline-flex items-center gap-3 px-8 py-4 text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl hover:from-violet-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl"
                            >
                                <Upload className="w-5 h-5" />
                                <span className="font-medium">Parcourir les fichiers</span>
                            </button>
                        </div>

                        {/* Section de prévisualisation */}
                        {selectedFiles.length > 0 && (
                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-gray-700">
                                        Fichiers sélectionnés ({selectedFiles.length})
                                    </h4>
                                    <button
                                        onClick={clearFiles}
                                        className="text-sm text-gray-500 transition-colors hover:text-red-500"
                                    >
                                        Tout effacer
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 transition-all duration-200 bg-white border border-gray-200 rounded-xl hover:border-violet-200 group"
                                        >
                                            {file.type.startsWith('image/') ? (
                                                <Image className="w-8 h-8 text-blue-500" />
                                            ) : (
                                                <Video className="w-8 h-8 text-red-500" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="p-1 text-gray-400 transition-colors opacity-0 hover:text-red-500 group-hover:opacity-100"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer avec actions */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-violet-50">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Astuce :</span> Utilisez des noms de fichiers clairs pour une meilleure organisation
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={cancelUpload}
                                    className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
                                    disabled={loadingState.loading}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSubmitWithProgress}
                                    disabled={selectedFiles.length === 0 || loadingState.loading}
                                    className="inline-flex items-center gap-2 px-6 py-2 text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadingState.loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Téléchargement...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            <span>Importer ({selectedFiles.length})</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay de chargement */}
            {loadingState.loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl">
                        <div className="flex flex-col items-center">
                            {/* Spinner */}
                            <div className="relative mb-4">
                                <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-16 h-16 border-4 rounded-full border-violet-600 border-t-transparent animate-spin"></div>
                            </div>

                            {/* Texte de progression */}
                            <h3 className="mb-2 text-lg font-semibold text-gray-800">
                                Téléchargement en cours...
                            </h3>

                            <p className="mb-1 text-sm text-gray-600">
                                {loadingState.currentFile ?
                                    `Téléchargement de : ${loadingState.currentFile}` :
                                    'Préparation...'
                                }
                            </p>

                            {/* Barre de progression */}
                            <div className="w-full h-2 mb-1 overflow-hidden bg-gray-200 rounded-full">
                                <div
                                    className="h-full transition-all duration-300 bg-gradient-to-r from-violet-600 to-purple-600"
                                    style={{ width: `${loadingState.progress}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between w-full text-xs text-gray-500">
                                <span>Progression</span>
                                <span>{loadingState.progress}%</span>
                            </div>

                            {loadingState.totalFiles > 0 && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Fichier {Math.floor((loadingState.progress / 100) * loadingState.totalFiles)} sur {loadingState.totalFiles}
                                </p>
                            )}

                            <p className="mt-4 text-sm text-gray-500">
                                Veuillez ne pas fermer cette fenêtre...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MediaUploadForm;