import { useLocation, useNavigate, useParams } from "react-router-dom";
import { memo, useCallback, useEffect, useReducer, useState } from "react";
import { motion } from "framer-motion";
import { RiImageAddFill } from "react-icons/ri";
import axios from "../../../config/axios";
import swal from "sweetalert";

export function CrudImageFormateur() {
  const location = useLocation();
  const idProjet = useParams().idProjet;
  const project_titre = location.state?.project_titre;
  const start_date = location.state?.start_date;
  const end_date = location.state?.end_date;

  const [isUpload, setIsUpload] = useState(0);
  const [image, setImage] = useState(null);

  const fetchImages = async () => {
    try {
      let url = `/form/gallery/${idProjet}/image`;
      const res = await axios.get(url);
      setImage(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des images:", err);
      setImage([]);
    }
  };

  useEffect(() => {
    if (!idProjet) return;
    fetchImages();
  }, [idProjet, isUpload]);

  return (
    <>
      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div id="project_list">
          <ProjectGallery
            nomProjet={project_titre}
            minDate={start_date}
            maxDate={end_date}
            fetchImages={fetchImages}
            data={image}
            setData={setImage}
            idProjet={idProjet}
            setIsUpload={setIsUpload}
          />
        </div>
      </main>
    </>
  );
}

const ProjectGallery = memo(
  ({ nomProjet, minDate, maxDate, data, setData, idProjet, setIsUpload, fetchImages }) => {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(galleryReducer, initialState);
    const imageCache = {};
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentUploadingFile, setCurrentUploadingFile] = useState(null);

    const {
      editingImageId,
      editDescription,
      previewImage,
      fullscreenImage,
      fullscreenMediaType,
      showUploadModal,
      loading,
      photo,
    } = state;

    const closeFullscreen = useCallback(() => {
      dispatch({ type: "SET_FULLSCREEN_IMAGE", image: null, mediaType: null });
    }, []);

    const handleShow = useCallback(() => {
      dispatch({ type: "TOGGLE_UPLOAD_MODAL" });
    }, []);

    // Fonction pour télécharger tous les médias
    const handleDownloadAll = useCallback(async () => {
      if (!data?.data?.length) {
        swal({
          title: "Aucun média",
          text: "Aucun média à télécharger.",
          icon: "info"
        });
        return;
      }

      const isConfirm = await swal({
        title: "Télécharger tous les médias?",
        text: `Vous allez télécharger ${data.data.length} fichier(s). Cela peut prendre un moment.`,
        icon: "info",
        buttons: ["Annuler", "Télécharger"],
      });

      if (!isConfirm) return;

      try {
        dispatch({ type: "SET_LOADING", loading: true });

        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        const folder = zip.folder(`medias-${nomProjet || 'projet'}`);

        for (let i = 0; i < data.data.length; i++) {
          const media = data.data[i];
          try {
            const response = await fetch(media.url);
            if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

            const blob = await response.blob();
            const extension = media.mediaType === 'video' ? 'mp4' : getFileExtension(media.url);
            const filename = `media_${i + 1}_${media.idImages}.${extension}`;

            folder.file(filename, blob);
          } catch (error) {
            console.error(`Erreur lors du téléchargement du média ${i + 1}:`, error);
          }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medias-${nomProjet || 'projet'}-${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        swal("Succès", `Tous les médias ont été téléchargés dans un fichier ZIP.`, "success");
      } catch (error) {
        console.error("Erreur lors du téléchargement des médias:", error);
        swal("Erreur", "Impossible de télécharger tous les médias.", "error");
      } finally {
        dispatch({ type: "SET_LOADING", loading: false });
      }
    }, [data, nomProjet]);

    // Fonction pour convertir un fichier en base64
    const convertFileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Retourner le data URL complet (data:image/jpeg;base64,...)
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    // Fonction pour gérer la sélection de fichiers (multiple)
    const handleFileSelect = useCallback((event) => {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      // Valider chaque fichier
      const validatedFiles = [];
      const maxSize = 100 * 1024 * 1024; // 100MB
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo', 'video/webm'
      ];

      for (const file of files) {
        // Vérifier le type
        if (!allowedTypes.includes(file.type)) {
          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
          const isVideo = ['mp4', 'avi', 'mov', 'webm'].includes(fileExtension);

          if (!isImage && !isVideo) {
            swal({
              title: "Type de fichier non supporté",
              text: `${file.name}\n\nFormats acceptés :\n• Images : JPG, PNG, GIF, WebP\n• Vidéos : MP4, AVI, MOV, WebM`,
              icon: "error"
            });
            return;
          }
        }

        // Vérifier la taille
        if (file.size > maxSize) {
          const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
          swal({
            title: "Fichier trop volumineux",
            text: `${file.name}\n\nTaille : ${sizeInMB} MB\nMaximum autorisé : 100 MB`,
            icon: "error"
          });
          return;
        }

        validatedFiles.push(file);
      }

      setSelectedFiles(prev => [...prev, ...validatedFiles]);
    }, []);

    // Fonction pour uploader plusieurs fichiers avec progression
    const handleMultipleUpload = useCallback(async () => {
      if (selectedFiles.length === 0) {
        swal({
          title: "Aucun fichier sélectionné",
          text: "Veuillez sélectionner au moins un fichier.",
          icon: "warning"
        });
        return;
      }

      try {
        dispatch({ type: "SET_LOADING", loading: true });
        setUploadProgress(0);
        setCurrentUploadingFile(null);

        const totalFiles = selectedFiles.length;
        const results = [];
        const errors = [];

        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];

          // Mettre à jour la progression
          setCurrentUploadingFile(file.name);
          const baseProgress = Math.round((i / totalFiles) * 100);
          setUploadProgress(baseProgress);

          // Convertir le fichier en base64 (data URL)
          const base64Data = await convertFileToBase64(file);

          // Créer FormData avec le base64
          const formData = new FormData();
          formData.append("description", `Fichier ${i + 1}`);
          formData.append("photo", base64Data); // Envoyer en base64
          formData.append("idProjet", idProjet);

          // Pas besoin d'envoyer mediaType, le backend le détecte automatiquement

          console.log(`Upload du fichier ${i + 1}/${totalFiles}:`, file.name);

          try {
            let url = `/form/gallery/${idProjet}/addImage`;
            const res = await axios.post(url, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const fileProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                  const totalProgress = Math.round(((i + (fileProgress / 100)) / totalFiles) * 100);
                  setUploadProgress(totalProgress);
                }
              },
            });

            console.log("Réponse du serveur:", res.data);

            if (res.data.status === 200 || res.data.success) {
              results.push(res.data);
            } else {
              errors.push(`${file.name}: ${res.data.message || "Erreur inconnue"}`);
            }
          } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Erreur de connexion";
            errors.push(`${file.name}: ${errorMsg}`);
            console.error("Erreur d'upload:", error.response?.data || error);
          }
        }

        // Finaliser la progression
        setUploadProgress(100);
        setCurrentUploadingFile(null);

        // Afficher les résultats
        if (errors.length === 0) {
          swal({
            title: "Succès",
            text: `${results.length} fichier(s) téléchargé(s) avec succès !`,
            icon: "success"
          });
          setIsUpload(prev => prev + 1);
          setSelectedFiles([]);
          dispatch({ type: "TOGGLE_UPLOAD_MODAL" });
        } else {
          const successCount = results.length;
          const errorCount = errors.length;
          const errorMessages = errors.join('\n');

          if (successCount > 0) {
            swal({
              title: "Téléchargement partiel",
              text: `${successCount} fichier(s) téléchargé(s) avec succès, ${errorCount} erreur(s):\n\n${errorMessages}`,
              icon: "warning"
            });
            setIsUpload(prev => prev + 1);
            setSelectedFiles([]);
            dispatch({ type: "TOGGLE_UPLOAD_MODAL" });
          } else {
            swal({
              title: "Échec du téléchargement",
              text: `Tous les fichiers ont échoué :\n\n${errorMessages}`,
              icon: "error"
            });
          }
        }

      } catch (error) {
        console.error("Erreur lors de l'upload multiple:", error);
        swal({
          title: "Erreur",
          text: "Une erreur est survenue lors de l'upload des fichiers.",
          icon: "error"
        });
      } finally {
        dispatch({ type: "SET_LOADING", loading: false });
        setUploadProgress(0);
        setCurrentUploadingFile(null);
      }
    }, [selectedFiles, idProjet, setIsUpload]);

    // Fonction pour supprimer un fichier sélectionné
    const removeFile = useCallback((index) => {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }, []);

    // Fonction pour effacer tous les fichiers
    const clearFiles = useCallback(() => {
      setSelectedFiles([]);
    }, []);

    const handleImageDelete = useCallback(
      async (imageId) => {
        const isConfirm = await swal({
          title: "Voulez-vous vraiment supprimer ce média?",
          text: "Appuyer sur oui pour le supprimer",
          icon: "warning",
          buttons: ["Annuler", "Oui, supprimer le "],
          dangerMode: true,
        });
        if (!isConfirm) {
          return;
        }

        try {
          dispatch({ type: "SET_LOADING", loading: true });
          let url = `/form/gallery/deleteImage/${imageId}`;

          const response = await axios.delete(url);

          if (response.status === 200) {
            fetchImages();
            swal({
              title: "Succès",
              text: "Média supprimé avec succès!",
              icon: "success"
            });
          } else {
            throw new Error("Erreur serveur");
          }
        } catch (error) {
          console.error("Erreur lors de la suppression du média :", error);
          swal({
            title: "Erreur",
            text: "Une erreur est survenue lors de la suppression.",
            icon: "error"
          });
        } finally {
          dispatch({ type: "SET_LOADING", loading: false });
        }
      },
      [setData]
    );

    const showEditForm = useCallback((imageId, description) => {
      dispatch({
        type: "SET_EDITING_IMAGE",
        id: imageId,
        description: description || "aucune description",
      });
    }, []);

    const cancelEdit = useCallback(() => {
      dispatch({ type: "CANCEL_EDIT" });
    }, []);

    const updateDescription = useCallback(
      async (id) => {
        try {
          let url = `/form/gallery/update/${id}`;
          const response = await axios.put(
            url,
            { description: editDescription },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            fetchImages();
            swal({
              title: "Succès",
              text: "Description effectuée avec succès!",
              icon: "success"
            });
          } else {
            throw new Error("Erreur serveur");
          }
          dispatch({ type: "CANCEL_EDIT" });
        } catch (error) {
          console.error(
            "Erreur lors de la mise à jour de la description:",
            error
          );
          swal({
            title: "Erreur",
            text: "Une erreur est survenue.",
            icon: "error"
          });
        }
      },
      [editDescription, setData]
    );

    const downloadImage = useCallback(async (imageUrl, mediaType) => {
      if (imageCache[imageUrl]) {
        return downloadFromCache(imageCache[imageUrl], mediaType);
      }

      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const extension = mediaType === 'video' ? 'mp4' : getFileExtension(imageUrl);
        const filename = `media_${Date.now()}.${extension}`;

        imageCache[imageUrl] = blob;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Erreur lors du téléchargement du média:", error);
        swal({
          title: "Erreur",
          text: "Impossible de télécharger le média.",
          icon: "error"
        });
      }
    }, []);

    const getFileExtension = (url) => {
      return url.split('.').pop().split('?')[0];
    };

    const downloadFromCache = (blob, mediaType) => {
      const extension = mediaType === 'video' ? 'mp4' : 'jpg';
      const filename = `media_${Date.now()}.${extension}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };

    const handleFullscreen = useCallback((url, mediaType) => {
      dispatch({
        type: "SET_FULLSCREEN_IMAGE",
        image: url,
        mediaType: mediaType
      });
    }, []);

    return (
      <main className="flex flex-col gap-4 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row"
          id="div_search"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
              onClick={() => navigate(-1)}
            >
              <svg
                className="w-6 h-6 lucide lucide-chevron-left"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="m15 18-6-6 6-6"></path>
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{nomProjet}</h1>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <svg
                  className="w-4 h-4 mr-1 lucide lucide-calendar"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                </svg>
                <span>
                  {minDate} - {maxDate}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {data?.data?.length > 0 && (
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 lucide lucide-download"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                </svg>
                Tout télécharger
              </button>
            )}
            <button
              onClick={handleShow}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-200 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" x2="12" y1="3" y2="15"></line>
              </svg>
              Ajouter des médias
            </button>
          </div>
        </motion.div>

        {/* NOUVELLE MODAL AVEC UPLOAD MULTIPLE */}
        {showUploadModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => dispatch({ type: "TOGGLE_UPLOAD_MODAL" })}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-4xl overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-xl rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* En-tête avec gradient */}
                <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-white/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-6 h-6 text-gray-600"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" x2="12" y1="3" y2="15"></line>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-600">Importation de Médias</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Téléchargez vos photos et vidéos pour la formation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-white/20">
                        {selectedFiles.length} fichier(s)
                      </span>
                      <button
                        onClick={() => dispatch({ type: "TOGGLE_UPLOAD_MODAL" })}
                        className="p-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-white/20"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contenu du formulaire */}
                <div className="p-6">
                  {/* Zone de dépôt principale */}
                  <div className="mb-6">
                    <div className="relative p-8 transition-all duration-300 border-2 border-gray-300 border-dashed rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-gray-100">
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-10 h-10 text-gray-400"
                          >
                            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                            <path d="M12 12v9"></path>
                            <path d="m16 16-4-4-4 4"></path>
                          </svg>
                        </div>

                        {/* Texte principal */}
                        <h4 className="mb-2 text-xl font-semibold text-gray-700">
                          Glissez-déposez vos fichiers
                        </h4>

                        <p className="mb-4 text-gray-500">
                          ou <span className="font-medium text-blue-600">cliquez pour parcourir</span>
                        </p>

                        {/* Informations sur les formats supportés */}
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm">
                          <div className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4 text-blue-500"
                            >
                              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            <span className="text-xs text-gray-600">Images</span>
                          </div>
                          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                          <div className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4 text-red-500"
                            >
                              <polygon points="23 7 16 12 23 17 23 7"></polygon>
                              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                            </svg>
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
                  <div className="flex items-center justify-center mb-6">
                    <button
                      onClick={() => document.getElementById('media-upload').click()}
                      className="inline-flex items-center gap-3 px-8 py-4 text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" x2="12" y1="3" y2="15"></line>
                      </svg>
                      <span className="font-medium">Parcourir les fichiers</span>
                    </button>
                  </div>

                  {/* Section de prévisualisation des fichiers sélectionnés */}
                  {selectedFiles.length > 0 && (
                    <div className="mb-6">
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
                            className="flex items-center gap-3 p-3 transition-all duration-200 bg-white border border-gray-200 rounded-xl hover:border-blue-200 group"
                          >
                            {file.type.startsWith('image/') ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-8 h-8 text-blue-500"
                              >
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-8 h-8 text-red-500"
                              >
                                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                              </svg>
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
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-4 h-4"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer avec actions */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Astuce :</span> Utilisez des noms de fichiers clairs pour une meilleure organisation
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => dispatch({ type: "TOGGLE_UPLOAD_MODAL" })}
                        className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
                        disabled={loading}
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleMultipleUpload}
                        disabled={selectedFiles.length === 0 || loading}
                        className="inline-flex items-center gap-2 px-6 py-2 text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4 animate-spin"
                            >
                              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                            </svg>
                            <span>Téléchargement...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="17 8 12 3 7 8"></polyline>
                              <line x1="12" x2="12" y1="3" y2="15"></line>
                            </svg>
                            <span>Importer ({selectedFiles.length})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Overlay de chargement avec progression */}
            {loading && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl">
                  <div className="flex flex-col items-center">
                    {/* Spinner */}
                    <div className="relative mb-4">
                      <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>

                    {/* Texte de progression */}
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">
                      Téléchargement en cours...
                    </h3>

                    <p className="mb-1 text-sm text-gray-600">
                      {currentUploadingFile ?
                        `Téléchargement de : ${currentUploadingFile}` :
                        'Préparation...'
                      }
                    </p>

                    {/* Barre de progression */}
                    <div className="w-full h-2 mb-1 overflow-hidden bg-gray-200 rounded-full">
                      <div
                        className="h-full transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between w-full text-xs text-gray-500">
                      <span>Progression</span>
                      <span>{uploadProgress}%</span>
                    </div>

                    {selectedFiles.length > 0 && (
                      <p className="mt-2 text-sm text-gray-600">
                        Fichier {Math.floor((uploadProgress / 100) * selectedFiles.length)} sur {selectedFiles.length}
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
        )}

        {/* Galerie des médias */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {data?.data?.length > 0 ? (
            data.data.map((image, index) => (
              <motion.div
                key={image.idImages}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ImageItem
                  image={image}
                  onEdit={showEditForm}
                  onDelete={handleImageDelete}
                  onDownload={downloadImage}
                  onFullscreen={handleFullscreen}
                  editingImageId={editingImageId}
                  editDescription={editDescription}
                  onUpdateDescription={updateDescription}
                  onCancelEdit={cancelEdit}
                  dispatch={dispatch}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 py-12 text-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p>Aucun média disponible</p>
              <p className="text-sm">Ajoutez des photos ou des vidéos pour commencer</p>
            </div>
          )}
        </motion.div>

        {fullscreenImage && (
          <FullscreenModal
            image={fullscreenImage}
            mediaType={fullscreenMediaType}
            onClose={closeFullscreen}
          />
        )}
      </main>
    );
  }
);

const FullscreenModal = memo(({ image, mediaType, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
    onClick={onClose}
  >
    <span
      className="absolute text-4xl text-white cursor-pointer top-4 right-4 hover:text-gray-300"
      onClick={onClose}
    >
      &times;
    </span>
    <div
      className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      {mediaType === 'video' ? (
        <video
          src={image}
          controls
          autoPlay
          className="w-full h-full rounded-lg shadow-2xl"
        />
      ) : (
        <img
          src={image}
          alt="Plein Écran"
          className="max-w-full max-h-full rounded-lg shadow-2xl"
        />
      )}
    </div>
  </div>
));

const ImageItem = memo(
  ({
    image,
    onEdit,
    onDelete,
    onDownload,
    onFullscreen,
    editingImageId,
    editDescription,
    onUpdateDescription,
    onCancelEdit,
    dispatch,
  }) => {
    const renderMedia = () => {
      if (image.mediaType === 'video') {
        return (
          <div className="relative group">
            <video
              src={image.url}
              onClick={() => onFullscreen(image.url, image.mediaType)}
              className="object-cover w-full h-64 rounded-t-lg cursor-pointer"
              controls
              preload="metadata"
            >
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
            <div className="absolute bottom-2 right-2">
              <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-black bg-opacity-50 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                Vidéo
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="relative group">
            <img
              src={image.url}
              onClick={() => onFullscreen(image.url, image.mediaType)}
              alt={image.img_description || "Aucune description"}
              className="object-cover w-full h-64 rounded-t-lg cursor-pointer"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute bottom-2 right-2">
              <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-black bg-opacity-50 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Photo
              </div>
            </div>
          </div>
        );
      }
    };

    return (
      <div className="relative overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-lg group hover:shadow-xl">
        {renderMedia()}

        <div className="absolute flex gap-2 transition-opacity opacity-0 top-4 right-4 group-hover:opacity-100">
          {image.id_added_by && (
            <button
              className="p-2 transition-colors bg-white rounded-full shadow-lg hover:bg-gray-100"
              title="Modifier"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(image.idImages, image.description);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-gray-600 lucide lucide-pen"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              </svg>
            </button>
          )}
          <button
            className="p-2 transition-colors bg-white rounded-full shadow-lg hover:bg-gray-100"
            title="Télécharger"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(image.url, image.mediaType);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-gray-600 lucide lucide-download"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" x2="12" y1="15" y2="3"></line>
            </svg>
          </button>
          {image.id_added_by && (
            <button
              className="p-2 transition-colors bg-white rounded-full shadow-lg hover:bg-gray-100"
              title="Supprimer"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(image.idImages);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-red-600 lucide lucide-trash2"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" x2="10" y1="11" y2="17"></line>
                <line x1="14" x2="14" y1="11" y2="17"></line>
              </svg>
            </button>
          )}
        </div>

        <div className="p-4">
          {editingImageId === image.idImages ? (
            <div className="mt-4">
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="2"
                value={editDescription}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_DESCRIPTION",
                    description: e.target.value,
                  })
                }
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={onCancelEdit}
                  className="px-3 py-1 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  onClick={() => onUpdateDescription(image.idImages)}
                  className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-600">
              {image.description || "Aucune description"}
            </p>
          )}

          <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
            <RiImageAddFill className="text-gray-400" />
            <span>
              <span className="font-medium">Ajouté par </span>
              {image?.nomAddedBy || "inconnu"}
            </span>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            {image.created_at ? new Date(image.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
          </div>
        </div>
      </div>
    );
  }
);

// Reducer pour gérer l'état complexe
function galleryReducer(state, action) {
  switch (action.type) {
    case "SET_EDITING_IMAGE":
      return {
        ...state,
        editingImageId: action.id,
        editDescription: action.description,
      };
    case "CANCEL_EDIT":
      return { ...state, editingImageId: null };
    case "UPDATE_DESCRIPTION":
      return { ...state, editDescription: action.description };
    case "SET_PREVIEW_IMAGE":
      return { ...state, previewImage: action.image };
    case "SET_FULLSCREEN_IMAGE":
      return {
        ...state,
        fullscreenImage: action.image,
        fullscreenMediaType: action.mediaType
      };
    case "TOGGLE_UPLOAD_MODAL":
      return {
        ...state,
        showUploadModal: !state.showUploadModal,
        ...(state.showUploadModal && {
          previewImage: null,
          photo: null,
          editDescription: ""
        })
      };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_PHOTO":
      return { ...state, photo: action.photo };
    default:
      return state;
  }
}

const initialState = {
  editingImageId: null,
  editDescription: "",
  previewImage: null,
  fullscreenImage: null,
  fullscreenMediaType: null,
  showUploadModal: false,
  loading: false,
  photo: null,
};