import { useLocation, useNavigate } from "react-router-dom";
import { memo, useCallback, useEffect, useReducer, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { RiImageAddFill } from "react-icons/ri";
import useApi from "../../../hooks/Api";
import LoadingModal from "../../../components/loading-modal";
import { API_URL } from "../../../config/env";
export function CrudImageAppr() {
  const location = useLocation();
  const idProjet = location.state?.idProjet;
  const project_titre = location.state?.project_titre;
  const start_date = location.state?.start_date;
  const end_date = location.state?.end_date;
  const { callApi } = useApi();
  const [isUpload, setIsUpload] = useState(0);
  const [image, setImage] = useState(null);

  console.log(idProjet);
  useEffect(() => {
    if (!idProjet) return;

    const fetchImages = async () => {
      try {
        let url = `/employes/images/${idProjet}`;
        const res = await callApi(url, {
          method: "GET",
        });
        setImage(res);
      } catch (err) {
        console.error("Erreur lors du chargement des images:", err);
        setImage([]);
      }
    };

    fetchImages();
  }, [idProjet, isUpload, callApi]);

  return (
    <>
      <main className="px-4 py-6 mx-auto space-y-8 max-w-7xl sm:px-6 lg:px-8">
        <div id="project_list">
          <ProjectGallery
            nomProjet={project_titre}
            minDate={start_date}
            maxDate={end_date}
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
  ({ nomProjet, minDate, maxDate, data, setData, idProjet, setIsUpload }) => {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(galleryReducer, initialState);
    const imageCache = {};

    const {
      editingImageId,
      editDescription,
      previewImage,
      fullscreenImage,
      showUploadModal,
      loading,
      photo,
    } = state;

    const closeFullscreen = useCallback(() => {
      dispatch({ type: "SET_FULLSCREEN_IMAGE", image: null });
    }, []);

    const handleShow = useCallback(() => {
      dispatch({ type: "TOGGLE_UPLOAD_MODAL" });
    }, []);

    const handleImageChange = useCallback((event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        alert("Format non supporté. JPG, PNG ou GIF uniquement.");
        return;
      }

      dispatch({ type: "SET_PHOTO", photo: file });

      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch({ type: "SET_PREVIEW_IMAGE", image: e.target.result });
      };
      reader.readAsDataURL(file);
    }, []);

    const handleImageUpload = useCallback(async () => {
      if (!photo || !(photo instanceof File)) {
        alert("Veuillez sélectionner une image valide.");
        return;
      }

      const formData = new FormData();
      formData.append("description", editDescription || "");
      formData.append("photo", photo);
      formData.append("idProjet", idProjet);

      try {
        dispatch({ type: "SET_LOADING", loading: true });
        let url = `${API_URL}/employes/images/${idProjet}`;

        const res = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res) {
          setIsUpload((prev) => prev + 1);
          dispatch({
            type: "TOGGLE_UPLOAD_MODAL",
            editDescription: "",
            photo: null,
            previewImage: null,
          });
        }
      } catch (error) {
        console.error(
          "Erreur lors du téléchargement :",
          error.response?.data || error.message
        );
        alert("Une erreur est survenue lors du téléchargement de l'image.");
      } finally {
        dispatch({ type: "SET_LOADING", loading: false });
      }
    }, [photo, editDescription, idProjet, setIsUpload]);

    const handleImageDelete = useCallback(
      async (imageId) => {
        try {
          dispatch({ type: "SET_LOADING", loading: true });
          let url = `${API_URL}/employes/images/${imageId}`;

          const response = await axios.delete(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (response.status === 200) {
            setData((prevData) => ({
              ...prevData,
              images: prevData.images.filter(
                (item) => item.idImages !== imageId
              ),
            }));
          } else {
            throw new Error("Erreur serveur");
          }
        } catch (error) {
          console.error("Erreur lors de la suppression de l'image :", error);
          alert("Une erreur est survenue lors de la suppression.");
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
          let url = `${API_URL}/employes/images/${id}`;
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
            setData((prevData) => ({
              ...prevData,
              images: prevData.images.map((item) =>
                item.idImages === id
                  ? { ...item, img_description: editDescription }
                  : item
              ),
            }));
          } else {
            throw new Error("Erreur serveur");
          }
          dispatch({ type: "CANCEL_EDIT" });
        } catch (error) {
          console.error(
            "Erreur lors de la mise à jour de la description:",
            error
          );
          alert("Une erreur est survenue.");
        }
      },
      [editDescription, setData]
    );

    const downloadImage = useCallback(async (imageUrl) => {
      if (imageCache[imageUrl]) {
        return downloadFromCache(imageCache[imageUrl]);
      }

      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        if (!blob.type.startsWith("image/")) {
          throw new Error("Le fichier récupéré n est pas une image.");
        }

        imageCache[imageUrl] = blob;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = imageUrl.split("/").pop();
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'image:", error);
        alert("Impossible de télécharger l'image.");
      }
    }, []);

    const downloadFromCache = (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "image";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };

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
          <button
            onClick={handleShow}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
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
              className="w-4 h-4 lucide lucide-plus"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            Ajouter des photos
          </button>
        </motion.div>

        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="p-6 bg-white rounded-lg shadow-sm"
          >
            <h3 className="mb-4 text-lg font-semibold">Ajouter une photo</h3>
            <div className="space-y-4">
              <div className="p-8 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="flex flex-col items-center">
                  {!previewImage ? (
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
                      className="w-12 h-12 mb-3 text-gray-400 lucide lucide-upload"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" x2="12" y1="3" y2="15"></line>
                    </svg>
                  ) : (
                    <img
                      src={previewImage}
                      alt="Aperçu"
                      className="w-20 mb-3 rounded-md shadow-md"
                    />
                  )}
                  <label className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600">
                    Sélectionner une photo
                    <input
                      type="file"
                      className="hidden"
                      name="photo"
                      id="photo"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    JPG, PNG, GIF jusqu'à 10MB
                  </p>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Décrivez cette photo..."
                  value={editDescription}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_DESCRIPTION",
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <button
                onClick={handleImageUpload}
                disabled={!photo}
                className={`w-full px-4 py-2 font-medium text-white rounded-md 
                  ${photo
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                Télécharger la photo
              </button>
              <LoadingModal
                show={loading}
                message={"Téléchargement en cours ..."}
              />
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {data?.images?.length > 0 ? (
            data.images.map((image, index) => (
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
                  onFullscreen={(url) =>
                    dispatch({ type: "SET_FULLSCREEN_IMAGE", image: url })
                  }
                  editingImageId={editingImageId}
                  editDescription={editDescription}
                  onUpdateDescription={updateDescription}
                  onCancelEdit={cancelEdit}
                  dispatch={dispatch}
                />
              </motion.div>
            ))
          ) : (
            <div>Aucune image</div>
          )}
        </motion.div>

        {fullscreenImage && (
          <FullscreenModal image={fullscreenImage} onClose={closeFullscreen} />
        )}
      </main>
    );
  }
);

const FullscreenModal = memo(({ image, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <span
      className="absolute text-4xl text-white cursor-pointer top-4 right-4"
      onClick={onClose}
    >
      &times;
    </span>
    <img src={image} alt="Img Plein Écran" className="max-w-full max-h-full" />
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
    return (
      <>
        <div className="relative group">
          <div className="relative inline-block overflow-hidden bg-gray-100 rounded-lg cursor-pointer">
            <img
              src={image.img_url}
              onClick={() => onFullscreen(image.img_url)}
              alt={image.img_description || "Aucune description"}
              className="object-cover w-full h-full"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="absolute flex gap-2 transition-opacity opacity-5 top-2 right-2 group-hover:opacity-100">
            {image.is_added && (
              <button
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                title="Modifier"
                onClick={() => onEdit(image.idImages, image.img_description)}
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
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              title="Télécharger"
              onClick={() => onDownload(image.img_url)}
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
            {image.is_added && (
              <button
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                title="Supprimer"
                onClick={() => onDelete(image.idImages)}
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
          {editingImageId === image.idImages ? (
            <div className="mt-2">
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
              <div className="flex justify-end gap-2">
                <button
                  onClick={onCancelEdit}
                  className="px-3 py-1 text-gray-700 rounded-md hover:bg-gray-300"
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
              {image.img_description || "Aucune description"}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <RiImageAddFill />
            <span>
              <span className="font-medium">Ajoute par </span>{" "}
              {image?.role_name_adder || "inconnu"}
            </span>
          </div>
        </div>
      </>
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
      return { ...state, fullscreenImage: action.image };
    case "TOGGLE_UPLOAD_MODAL":
      return { ...state, showUploadModal: !state.showUploadModal };
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
  showUploadModal: false,
  loading: false,
  photo: null,
};
