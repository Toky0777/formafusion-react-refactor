import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import axios from "../../../config/axios";
import { IMAGE_URL } from "../../../config/env"; // Assurez-vous d'avoir ce fichier

const digitalOceanBaseUrl =
  IMAGE_URL;

function Liste({ moduleContentId, onBackToEdit }) {
  // Utilisez les props au lieu de useSearchParams
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorr, setErrorr] = useState(null);

  // Update the fetchContent function in your useEffect
  useEffect(() => {
    const fetchContent = async () => {
      if (!moduleContentId) {
        setError("ID du contenu manquant");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/contents/formateur/${moduleContentId}`); // Utilisez la prop

        const contentData = response.data.content;
        const files = response.data.files;

        const mergedContent = {
          ...contentData,
          files: files,
          contentType: contentData.videoLink
            ? "video"
            : contentData.texte
            ? "texte"
            : files.length > 0
            ? "file"
            : "empty",
        };

        setContent(mergedContent);
        console.log("Contenu récupéré:", mergedContent);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setErrorr("Contenu introuvable");
        } else {
          setError("Impossible de charger le contenu");
        }
        console.error("Erreur lors de la récupération du contenu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [moduleContentId]);

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Fonction pour créer l'URL d'embed YouTube
  const getYouTubeEmbedUrl = (url) => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Chargement du contenu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">⚠️ Erreur</div>
            <p className="text-gray-600">{error || "Contenu introuvable"}</p>
            <button
              onClick={onBackToEdit}
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (errorr) {
    return (
      <div className="flex flex-col h-full overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600">Contenu introuvable</p>
            <button
              onClick={onBackToEdit}
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {content.title || "Contenu"}
        </h2>
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <button
              onClick={onBackToEdit}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto custom-scroll rounded-xl p-4 space-y-6">
        {/* Contenu Vidéo - Afficher si videoLink existe */}
        {content.videoLink && (
          <div className="bg-white rounded-lg p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vidéo</h3>
            <div className="mb-8">
              <div className="bg-black rounded-xl p-4 flex items-center justify-center h-[400px]">
                {getYouTubeEmbedUrl(content.videoLink) ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYouTubeEmbedUrl(content.videoLink)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                ) : (
                  <a
                    href={content.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative"
                  >
                    <div className="bg-red-600 rounded-lg p-6 flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors duration-200">
                      <Play
                        className="text-white fill-white w-16 h-16 ml-1"
                        strokeWidth={0}
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <span className="text-white text-2xl font-bold tracking-wide">
                        Voir la vidéo
                      </span>
                    </div>
                  </a>
                )}
              </div>
              {content.videoDescription && (
                <p className="text-gray-500 mt-4">{content.videoDescription}</p>
              )}
            </div>
          </div>
        )}

        {content.texte && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Contenu textuel
            </h3>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content.texte }}
            />
          </div>
        )}

        {content.files && content.files.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Fichiers téléchargeables
            </h2>
            <div className="space-y-3">
              {content.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
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
                      className="lucide lucide-file-text text-blue-500 mr-3"
                    >
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                      <path d="M10 9H8"></path>
                      <path d="M16 13H8"></path>
                      <path d="M16 17H8"></path>
                    </svg>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {file.fileName || `Fichier ${index + 1}`}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {file.fileDescription || "Aucune description"}
                      </p>
                    </div>
                  </div>
                  {file.filePath && (
                    <a
                      href={file.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-eye mr-1"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span className="text-sm">Voir</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!content.videoLink &&
          !content.texte &&
          (!content.files || content.files.length === 0) && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun contenu disponible
              </h3>
              <p className="text-gray-500">
                Ce module ne contient pas encore de contenu.
              </p>
            </div>
          )}
      </div>
    </div>
  );
}

export default Liste;
