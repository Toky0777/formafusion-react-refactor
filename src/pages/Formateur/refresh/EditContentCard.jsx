import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import FontSize from "@tiptap/extension-font-size";
import axios from "../../../config/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function EditContentCard({ idModuleContent, onPreviewClick }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [fileInputs, setFileInputs] = useState([]);
  const [textContent, setTextContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [hasExistingContent, setHasExistingContent] = useState(false);
  const [content, setContent] = useState(null);

  // Chargement des données existantes
  useEffect(() => {
    if (!idModuleContent) return;

    console.log(
      "Chargement des données pour idModuleContent:",
      idModuleContent
    );
    setIsLoading(true);

    // Charger les données existantes
    axios
      .get(`/contents/formateur/content/${idModuleContent}/edit`)
      .then((res) => {
        const { content, files } = res.data;
        console.log(res.data);

        // Pré-remplir les champs avec les données existantes
        if (content) {
          setContent(content);
          setContentTitle(content.titre || content.title || "");
          setVideoUrl(content.videoLink || "");
          setVideoDescription(content.videoDescription || "");
          setTextContent(content.texte || content.text || "");
          setHasExistingContent(true);

          console.log("Contenu chargé:", {
            titre: content.titre || content.title,
            videoLink: content.videoLink,
            texte: content.texte || content.text,
          });
        }

        // Pré-remplir les fichiers existants
        if (files && files.length > 0) {
          const formattedFiles = files.map((file) => ({
            id: file.idFile,
            name: file.fileName,
            url: file.filePath,
            description: file.fileDescription,
            isExisting: true, // Flag pour identifier les fichiers existants
          }));
          setFileInputs(formattedFiles);
          console.log("Fichiers chargés:", formattedFiles);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.error(
          "Erreur lors du chargement des données:",
          err.response?.data || err
        );
        // Si pas de données existantes, ce n'est pas une erreur critique
        if (err.response?.status === 404) {
          console.log("Aucune donnée existante trouvée, mode création");
          setHasExistingContent(false);
        }
        setIsLoading(false);
      });
  }, [idModuleContent]);

  function handleFileChange(id, field, value) {
    setFileInputs((prev) =>
      prev.map((file) => (file.id === id ? { ...file, [field]: value } : file))
    );
  }

  const handleAddFile = () => {
    setFileInputs((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        name: "",
        url: "",
        description: "",
        isExisting: false,
      },
    ]);
  };

  const handleRemoveFile = (id) => {
    setFileInputs((prev) => prev.filter((file) => file.id !== id));
  };

  // const handleSave = () => {
  //   const payload = {
  //     idModuleContent,
  //     title: contentTitle,
  //     videoLink: videoUrl,
  //     videoDescription: videoDescription,
  //     texte: textContent,
  //   };

  //   // Ajouter les fichiers si présents (sans inclure idFile et isExisting)
  //   if (fileInputs.length > 0) {
  //     payload.files = fileInputs.map((f) => ({
  //       fileName: f.name || "",
  //       filePath: f.url || "",
  //       fileDescription: f.description || "",
  //     }));
  //   }

  //   console.log("Payload envoyé:", payload);

  //   const apiCall = hasExistingContent
  //     ? axios.put(`/contents/${content.idContent}`, payload)
  //     : axios.post("/contents", payload);

  //   apiCall
  //     .then((res) => {
  //       console.log("Sauvegardé ✅", res.data);
  //       setIsSaved(true);
  //       setHasExistingContent(true);

  //       setContent(res.data); // Met à jour le contenu avec la réponse

  //       // Recharger les données après mise à jour pour synchroniser
  //       if (hasExistingContent) {
  //         loadContentData();
  //       }

  //       setTimeout(() => setIsSaved(false), 3000);
  //     })
  //     .catch((err) => {
  //       console.error("Erreur sauvegarde ❌", err.response?.data || err);
  //     });
  // };

  // Fonction pour recharger les données
  const handleSave = () => {
    const payload = {
      idModuleContent,
      title: contentTitle,
      videoLink: videoUrl,
      videoDescription: videoDescription,
      texte: textContent,
    };

    if (fileInputs.length > 0) {
      payload.files = fileInputs.map(f => ({
        fileName: f.name || "",
        filePath: f.url || "",
        fileDescription: f.description || "",
      }));
    }

    console.log("Payload envoyé:", payload);

    if (hasExistingContent && content?.idContent) {
      // Modification
      axios.put(`/contents/formateur/${content.idContent}`, payload)
        .then(res => {
          console.log("Modifié ✅", res.data);
          setContent(res.data);
          setIsSaved(true);
          loadContentData();
          setTimeout(() => setIsSaved(false), 3000);
        })
        .catch(err => console.error("Erreur modification ❌", err.response?.data || err));
    } else {
      // Création
      axios.post("/contents/formateur", payload)
        .then(res => {
          console.log("Créé ✅", res.data);
          setContent(res.data); // Très important !
          setHasExistingContent(true);
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 3000);
        })
        .catch(err => console.error("Erreur création ❌", err.response?.data || err));
    }
  };



  const loadContentData = () => {
    if (!idModuleContent) return;

    axios
      .get(`/contents/content/${idModuleContent}/edit`)
      .then((res) => {
        const { content, files } = res.data;

        if (content) {
          setContent(content);
          setContentTitle(content.titre || content.title || "");
          setVideoUrl(content.videoLink || "");
          setVideoDescription(content.videoDescription || "");
          setTextContent(content.texte || content.text || "");
        }

        if (files && files.length > 0) {
          const formattedFiles = files.map((file) => ({
            id: file.idFile,
            name: file.fileName,
            url: file.filePath,
            description: file.fileDescription,
            isExisting: true,
          }));
          setFileInputs(formattedFiles);
        }
      })
      .catch((err) => {
        console.error("Erreur lors du rechargement:", err);
      });
  };

  // Affichage de loading pendant le chargement
  if (isLoading) {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Chargement des données...</div>
        </div>
      </div>
    );
  }
  // const handleDelete = () => {
  //   MySwal.fire({
  //     title: "Êtes-vous sûr ?",
  //     text: "Vous ne pourrez pas annuler cette action !",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Oui, supprimer !",
  //     cancelButtonText: "Annuler",
  //     reverseButtons: true,
  //     customClass: {
  //       confirmButton:
  //         "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md mx-2",
  //       cancelButton:
  //         "px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md mx-2",
  //     },
  //     buttonsStyling: false,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // Suppression
  //       axios
  //         .delete(`/contents/${content.idContent}`)
  //         .then((res) => {
  //           console.log("Contenu supprimé ✅", res.data);

  //           // Notification de succès
  //           MySwal.fire({
  //             title: "Supprimé !",
  //             text: "Le contenu a été supprimé avec succès.",
  //             icon: "success",
  //             confirmButtonColor: "#10B981",
  //             confirmButtonText: "OK",
  //             customClass: {
  //               confirmButton:
  //                 "px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md",
  //             },
  //             buttonsStyling: false,
  //           }).then(() => {
  //             // Redirection après confirmation
  //             window.location.href = "/create";
  //           });
  //         })
  //         .catch((err) => {
  //           console.error("Erreur suppression ❌", err.response?.data || err);

  //           // Notification d'erreur
  //           MySwal.fire({
  //             title: "Erreur !",
  //             text: "Une erreur est survenue lors de la suppression.",
  //             icon: "error",
  //             confirmButtonColor: "#EF4444",
  //             confirmButtonText: "OK",
  //             customClass: {
  //               confirmButton:
  //                 "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md",
  //             },
  //             buttonsStyling: false,
  //           });
  //         });
  //     }
  //   });
  // };
  const handleDelete = () => {

    if (!content || !content?.idContent) {
      console.warn("Aucun contenu à supprimer")
      return;
    }
 
    const contentId = content.idContent;
    MySwal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas annuler cette action !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/contents/formateur/${contentId}`)
          .then(() => {
            // Retire le contenu du state local
            setContent(null);
            setContentTitle("");
            setVideoDescription("");
            setVideoUrl("");
            setVideoDescription("");
            setFileInputs([]);

            MySwal.fire({
              title: "Supprimé !",
              text: "Le contenu a été supprimé avec succès.",
              icon: "success",
              confirmButtonColor: "#10B981",
              confirmButtonText: "OK",
            });
          })
          .catch(() => {
            MySwal.fire({
              title: "Erreur !",
              text: "Une erreur est survenue lors de la suppression.",
              icon: "error",
              confirmButtonColor: "#EF4444",
              confirmButtonText: "OK",
            });
          });
      }
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {hasExistingContent
            ? "Editing: " + (contentTitle || "Content")
            : "Creating: New Content"}
        </h2>
        <div className="flex items-center space-x-3">
          <div className="flex mr-4 space-x-2">

            <button
              onClick={() => onPreviewClick(idModuleContent)} // <- ici on utilise la prop
              className="flex items-center p-2 text-white bg-[#A462A4] rounded-md hover:bg-[#A462A4]/70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-eye"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="ml-1 text-sm">Preview</span>
            </button>

            <button
              onClick={handleSave}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${isSaved
                ? "bg-green-500 text-white"
                : "bg-gray-300 hover:bg-gray-400/80"
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 lucide lucide-save"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>
                {isSaved ? "Saved!" : hasExistingContent ? "Update" : "Save"}
              </span>
            </button>

            {/* Bouton Delete - seulement si contenu existe */}
            <div>
              {hasExistingContent && (
                <button
                  onClick={handleDelete}
                  className="flex items-center p-2 text-red-600 transition-colors rounded-md hover:bg-red-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <label
            htmlFor="content-title"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Content Title
          </label>
          <input
            id="content-title"
            type="text"
            value={contentTitle}
            onChange={(e) => setContentTitle(e.target.value)}
            placeholder="Enter a title for this content"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="border-b border-gray-200">
          <div className="flex border-b border-gray-200">
            {["video", "text", "files"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium ${activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab === "video"
                  ? "Video Content"
                  : tab === "text"
                    ? "Text & Images"
                    : " Files"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6" id="tab-content">
          {activeTab === "video" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="video-url"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Video URL
                </label>
                <input
                  id="video-url"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Enter video URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="video-description"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Video Description
                </label>
                <textarea
                  id="video-description"
                  rows="3"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="Enter a description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                />
              </div>
            </div>
          )}

          {activeTab === "text" && (
            <div className="space-y-4">
              <div className="p-2 overflow-hidden border border-gray-300 rounded-md">
                <MyEditor value={textContent} onChange={setTextContent} />
              </div>
            </div>
          )}

          {activeTab === "files" && (
            <div className="space-y-4" id="files-container">
              <button
                id="add-file-btn"
                type="button"
                onClick={handleAddFile}
                className="flex items-center justify-center w-full py-3 text-gray-600 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 lucide lucide-plus"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add File
              </button>

              {fileInputs.map((file, index) => (
                <div
                  key={file.id}
                  className={`p-4 border rounded-lg file-item ${file.isExisting
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200"
                    }`}
                  data-file={file.id}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      File {index + 1}
                      {file.isExisting && (
                        <span className="ml-2 text-xs text-blue-600">
                          (Existing)
                        </span>
                      )}
                      {!file.isExisting && (
                        <span className="ml-2 text-xs text-green-600">
                          (New)
                        </span>
                      )}
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="p-1 text-gray-400 rounded-full hover:text-red-500 hover:bg-gray-100"
                      data-file={file.id}
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
                        className="lucide lucide-x"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        File Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter file name"
                        value={file.name || ""}
                        onChange={(e) =>
                          handleFileChange(file.id, "name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        File URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter file URL"
                        value={file.url || ""}
                        onChange={(e) =>
                          handleFileChange(file.id, "url", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter file description"
                        value={file.description || ""}
                        onChange={(e) =>
                          handleFileChange(
                            file.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default EditContentCard;

function MyEditor({ value, onChange }) {
  const [showHTML, setShowHTML] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-5",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-5",
          },
        },
      }),
      Underline,
      Highlight,
      TextStyle,
      FontSize,
      Color.configure({
        types: ["textStyle"],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) return null;

  const fontSizeOptions = [
    { label: "8", value: "14px" },
    { label: "11", value: "22px" },
    { label: "18", value: "34px" },
    { label: "28", value: "38px" },
    { label: "48", value: "58px" },
  ];

  const setFontSize = (size) => {
    if (size === "") {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(size).run();
    }
  };

  const handleHTMLChange = (e) => {
    const newHTML = e.target.value;
    onChange(newHTML);
    editor.commands.setContent(newHTML);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive("bold")
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-gray-100"
            }`}
          title="Gras"
          disabled={showHTML}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive("italic")
            ? "bg-blue-100 text-blue-600 italic"
            : "hover:bg-gray-100"
            }`}
          title="Italique"
          disabled={showHTML}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded ${editor.isActive("underline")
            ? "bg-blue-100 text-blue-600 underline"
            : "hover:bg-gray-100"
            }`}
          title="Souligné"
          disabled={showHTML}
        >
          <u>U</u>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded ${editor.isActive("strike")
            ? "bg-blue-100 text-blue-600 line-through"
            : "hover:bg-gray-100"
            }`}
          title="Barré"
          disabled={showHTML}
        >
          <s>S</s>
        </button>

        <div className="h-8 mx-1 border-l border-gray-300"></div>

        <select
          onChange={(e) => setFontSize(e.target.value)}
          value={editor.getAttributes("textStyle").fontSize || ""}
          className="p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          title="Taille du texte"
          disabled={showHTML}
        >
          <option value="">Taille</option>
          {fontSizeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="h-8 mx-1 border-l border-gray-300"></div>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive("bulletList")
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-gray-100"
            }`}
          title="Liste à puces"
          disabled={showHTML}
        >
          <svg
            width="16px"
            height="16px"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 1H1V3H3V1Z" fill="#000000" />
            <path d="M3 5H1V7H3V5Z" fill="#000000" />
            <path d="M1 9H3V11H1V9Z" fill="#000000" />
            <path d="M3 13H1V15H3V13Z" fill="#000000" />
            <path d="M15 1H5V3H15V1Z" fill="#000000" />
            <path d="M15 5H5V7H15V5Z" fill="#000000" />
            <path d="M5 9H15V11H5V9Z" fill="#000000" />
            <path d="M15 13H5V15H15V13Z" fill="#000000" />
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor.isActive("orderedList")
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-gray-100"
            }`}
          title="Liste numérotée"
          disabled={showHTML}
        >
          <svg
            width="18px"
            height="18px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Edit / List_Ordered">
              <path
                id="Vector"
                d="M10 17H20M4 15.6853V15.5C4 14.6716 4.67157 14 5.5 14H5.54054C6.34658 14 7.00021 14.6534 7.00021 15.4595C7.00021 15.8103 6.8862 16.1519 6.67568 16.4326L4 20.0002L7 20M10 12H20M10 7H20M4 5L6 4V10"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </button>

        <div className="h-8 mx-1 border-l border-gray-300"></div>

        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded ${editor.isActive("highlight")
            ? "bg-yellow-300 text-blue-600"
            : "hover:bg-gray-100"
            }`}
          title="Surligner"
          disabled={showHTML}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M9 11L13 15L7 21H3V17L9 11Z"
              fill="yellow"
              stroke="orange"
            />
            <path
              d="M15 5L19 9L9 19L5 15L15 5Z"
              fill="yellow"
              stroke="orange"
            />
          </svg>
        </button>

        <div className="h-8 mx-1 border-l border-gray-300"></div>

        <input
          type="color"
          onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
          value={editor.getAttributes("textStyle").color || "#000000"}
          className="w-8 h-8 p-0 border rounded cursor-pointer"
          title="Couleur du texte"
          disabled={showHTML}
        />
        <button
          onClick={() => editor.chain().focus().unsetColor().run()}
          className="p-2 rounded hover:bg-gray-100"
          title="Supprimer la couleur"
          disabled={showHTML}
        >
          <span className="text-sm">X</span>
        </button>

        <div className="h-8 mx-1 border-l border-gray-300"></div>

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded ${editor.isActive({ textAlign: "left" })
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-gray-100"
            }`}
          title="Alignement gauche"
          disabled={showHTML}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3 3h18v2H3zm0 4h12v2H3zm0 4h18v2H3zm0 4h12v2H3z"
            />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded ${editor.isActive({ textAlign: "center" })
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-gray-100"
            }`}
          title="Centré"
          disabled={showHTML}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3 3h18v2H3zm4 4h10v2H7zm-4 4h18v2H3zm4 4h10v2H7z"
            />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded ${editor.isActive({ textAlign: "right" })
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-gray-100"
            }`}
          title="Alignement droit"
          disabled={showHTML}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3 3h18v2H3zm6 4h12v2H9zm-6 4h18v2H3zm6 4h12v2H9z"
            />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-2 rounded ${editor.isActive({ textAlign: "justify" })
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-gray-100"
            }`}
          title="Justifié"
          disabled={showHTML}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M3 3h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3z"
            />
          </svg>
        </button>

        <div className="h-8 mx-1 border-l border-gray-300"></div>

        {/* Bouton pour basculer entre mode visuel et HTML */}
        <button
          onClick={() => setShowHTML(!showHTML)}
          className={`px-3 py-2 rounded font-medium ${showHTML
            ? "bg-orange-100 text-orange-600 border border-orange-300"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          title={showHTML ? "Retour à l'éditeur visuel" : "Voir le code HTML"}
        >
          {showHTML ? (
            <span className="flex items-center gap-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              Visuel
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              HTML
            </span>
          )}
        </button>
      </div>

      <div className="border border-gray-300 rounded-md p-4 min-h-[300px]">
        {showHTML ? (
          <textarea
            value={value}
            onChange={handleHTMLChange}
            className="w-full h-full min-h-[270px] p-2 font-mono text-sm border-0 resize-none focus:outline-none"
            placeholder="Entrez votre code HTML ici..."
            style={{
              fontFamily:
                'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
            }}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  );
}
