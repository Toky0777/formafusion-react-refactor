import { useState, useEffect } from "react";
import axios from "../../../config/axios";

const AjoutDocumentModalCfp = ({
  isOpen,
  onClose,
  dossierName = "",
  idDossier,
  onDocumentAdded, // Cette prop doit être utilisée
}) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [fileTitle, setFileTitle] = useState("");
  const [file, setFile] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sections, setSections] = useState([]);
  const [typesParSection, setTypesParSection] = useState({});

  const sectionColors = [
    "bg-blue-100 text-blue-800 border-blue-300",
    "bg-green-100 text-green-800 border-green-300",
    "bg-yellow-100 text-yellow-800 border-yellow-300",
    "bg-pink-100 text-pink-800 border-pink-300",
    "bg-purple-100 text-purple-800 border-purple-300",
    "bg-red-100 text-red-800 border-red-300",
  ];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchSections = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("/cfp/dossier/document/section", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const sectionList = response.data.sectionDocument || [];
          const seen = new Set();
          const uniqueSections = sectionList.filter((section) => {
            const key = section.section_document?.trim().toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });

          setSections(uniqueSections);
        } catch (error) {
          setErrorMsg("Erreur lors du chargement des sections.");
          console.error("Error fetching sections:", error);
        }
      };

      fetchSections();
      setIsVisible(true);
    } else {
      // Reset form when closing
      resetForm();
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  // Fetch document types when a section is selected
  useEffect(() => {
    if (selectedSection) {
      const fetchTypes = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `/cfp/dossier/document/type/${selectedSection}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const typeList = response.data.typeDocuments || [];
          const seenTypes = new Set();
          const uniqueTypes = typeList.filter((type) => {
            const key = type.type_document?.trim().toLowerCase();
            if (seenTypes.has(key)) return false;
            seenTypes.add(key);
            return true;
          });

          setTypesParSection((prev) => ({
            ...prev,
            [selectedSection]: uniqueTypes,
          }));
        } catch (error) {
          setErrorMsg("Erreur lors du chargement des types de documents.");
          console.error("Error fetching document types:", error);
        }
      };

      fetchTypes();
    }
  }, [selectedSection]);

  // Function to reset form
  const resetForm = () => {
    setSelectedSection(null);
    setSelectedType(null);
    setFileTitle("");
    setFile(null);
    setErrorMsg("");
    setShowSuccess(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setErrorMsg("Le fichier dépasse la taille maximale autorisée de 2 Mo.");
        setFile(null);
        return;
      }
      const allowedTypes = [
        "application/pdf",
        "text/plain",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrorMsg(
          "Type de fichier non autorisé. Utilisez pdf, txt, ppt, pptx, csv, xls, ou xlsx."
        );
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setErrorMsg("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idDossier || isNaN(idDossier)) {
      setErrorMsg("Identifiant du dossier invalide. Veuillez recharger la page.");
      return;
    }

    if (!selectedSection || !selectedType || !file || !fileTitle.trim()) {
      setErrorMsg("Veuillez compléter tous les champs.");
      return;
    }

    if (!(file instanceof File)) {
      setErrorMsg("Fichier invalide. Veuillez sélectionner un fichier valide.");
      return;
    }

    const formData = new FormData();
    formData.append("myFile", file);
    formData.append("title", fileTitle);
    formData.append("section_document", parseInt(selectedSection, 10));
    formData.append("type_document", parseInt(selectedType, 10));

    setIsLoading(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/cfp/dossier/document/upload/${idDossier}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data);
if (response.data.success) {
  setShowSuccess(true);

  // 🔥 CETTE PARTIE DOIT EXISTER ET ÊTRE APPELÉE
  if (onDocumentAdded) {
    // Créer l'objet document formaté
    const newDocument = {
      id: response.data.document?.idDocument || Date.now(),
      titre: fileTitle,
      type_document: sections.find(s => s.idSectionDocument === parseInt(selectedSection))?.section_document || "Inconnu",
      section_document: typesParSection[selectedSection]?.find(t => t.idTypeDocument === parseInt(selectedType))?.type_document || "Inconnu",
      taille: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      filename: file.name,
      extension: file.name.split('.').pop()?.toLowerCase() || "file",
      path: response.data.document?.path || "",
    };
    
    onDocumentAdded(newDocument); // 🔥 CETTE LIGNE EST CRUCIALE
  }

  setTimeout(() => {
    setShowSuccess(false);
    resetForm();
    onClose();
  }, 1500);

      } else {
        setErrorMsg(response.data.error || "Erreur inconnue lors de l'envoi du document.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response?.data?.details) {
        const errors = Object.values(error.response.data.details)
          .flat()
          .join(", ");
        setErrorMsg(`Erreur de validation : ${errors}`);
      } else if (error.response?.data?.error) {
        setErrorMsg(`Erreur serveur : ${error.response.data.error}`);
      } else if (error.response?.status === 500) {
        const serverMessage = error.response?.data?.message || "Erreur interne du serveur (500).";
        setErrorMsg(`${serverMessage} Vérifiez les logs du serveur pour plus de détails.`);
      } else {
        setErrorMsg(`Erreur lors de l'envoi du document : ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className={`absolute inset-0 backdrop-blur-sm bg-black/40 transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />
      <div
        className={`bg-white w-1/2 h-full ml-auto shadow-lg transform transition-all duration-700 ease-in-out ${isOpen
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
          }`}
      >
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            <svg
              className="w-20 h-20 mb-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-2xl font-bold text-gray-800">
              Document ajouté !
            </p>
            <p className="mt-2 text-gray-500">Ajouté avec succès.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between w-full px-4 py-2 bg-gray-100">
              <p className="text-lg font-medium text-gray-500">
                Ajouter un document dans le dossier :{" "}
                <span className="text-2xl text-purple-500">{dossierName}</span>
              </p>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-200"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="w-full p-4 overflow-y-auto h-[calc(100vh-4rem)]">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-md"
              >
                {/* Section */}
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-semibold text-gray-700">
                    Section du Document
                  </label>
                  {sections.length === 0 && (
                    <p className="text-gray-500">Chargement des sections...</p>
                  )}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {sections.map((section) => (
                      <label
                        key={section.idSectionDocument}
                        className="flex items-start gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="section_document"
                          value={section.idSectionDocument}
                          checked={
                            selectedSection === section.idSectionDocument
                          }
                          onChange={() => {
                            setSelectedSection(section.idSectionDocument);
                            setSelectedType(null);
                          }}
                          className="w-5 h-5 mt-1 text-purple-600 focus:ring-purple-500"
                        />
                        <div>
                          <span className="font-semibold text-gray-800">
                            {section.section_document ||
                              `Section ${section.idSectionDocument}`}
                          </span>
                          <div className="text-sm text-gray-600">
                            {section.description || ""}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type */}
                {selectedSection && typesParSection[selectedSection] && (
                  <div className="flex flex-col gap-2">
                    {(() => {
                      const selected = sections.find(
                        (s) => s.idSectionDocument === selectedSection
                      );
                      return (
                        <label className="text-lg font-semibold text-gray-700">
                          Veuillez sélectionner le type de document à insérer
                          pour la section{" "}
                          <span className="text-indigo-600">
                            {selected?.section_document || "non sélectionnée"}
                          </span>
                        </label>
                      );
                    })()}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {typesParSection[selectedSection].map((type, index) => {
                        const isSelected = selectedType === type.idTypeDocument;
                        const colorClass =
                          sectionColors[
                          selectedSection % sectionColors.length
                          ] || "bg-gray-100 text-gray-800 border-gray-300";
                        return (
                          <label
                            key={type.idTypeDocument}
                            className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all
              ${isSelected
                                ? "ring-2 ring-offset-2 ring-purple-500"
                                : "hover:shadow-md"
                              }
              ${colorClass}`}
                          >
                            <input
                              type="radio"
                              name="type_document"
                              value={type.idTypeDocument}
                              checked={isSelected}
                              onChange={() =>
                                setSelectedType(type.idTypeDocument)
                              }
                              className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="font-medium">
                              {type.type_document ||
                                `Type ${type.idTypeDocument}`}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Fichier */}
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-semibold text-gray-700">
                    Fichier{" "}
                    <span className="text-sm text-gray-400">
                      (pdf, txt, xls, xlsx, csv, ppt, pptx, max 2Mo)
                    </span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="fileUpload"
                      type="file"
                      accept=".pdf,.txt,.ppt,.pptx,.xls,.xlsx,.csv"
                      onChange={handleFileChange}
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                    <label
                      htmlFor="fileUpload"
                      className="flex items-center justify-center w-full px-4 py-3 font-medium text-purple-600 transition-all border border-purple-500 border-dashed rounded-md cursor-pointer hover:bg-purple-50"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4"
                        />
                      </svg>
                      {file ? "Modifier le fichier" : "Choisir un fichier"}
                    </label>
                  </div>
                  {file && (
                    <p className="mt-1 text-sm text-gray-600">
                      <span className="font-semibold text-purple-700">
                        Fichier sélectionné :
                      </span>{" "}
                      {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} Mo)
                    </p>
                  )}
                </div>

                {/* Titre */}
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-semibold text-gray-700">
                    Titre du Document
                  </label>
                  <input
                    type="text"
                    placeholder="Titre du document"
                    value={fileTitle}
                    onChange={(e) => setFileTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Message d’erreur */}
                {errorMsg && (
                  <p className="font-medium text-red-600">{errorMsg}</p>
                )}

                {/* Bouton submit */}
                <button
                  type="submit"
                  disabled={isLoading || !idDossier}
                  className={`cursor-pointer w-full px-5 py-3 font-semibold text-white rounded-md transition-all ${isLoading || !idDossier
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                    }`}
                >
                  {isLoading ? "Envoi en cours..." : "Ajouter le Document"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AjoutDocumentModalCfp;