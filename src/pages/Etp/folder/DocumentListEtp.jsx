import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  faFile,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileImage,
  faFileAlt,
  faFilePowerpoint,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import {
  TrashIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { FaRegFileAlt, FaFilter } from "react-icons/fa";
import { saveAs } from "file-saver";
import AjoutDocumentModal from "../../../components/Modals/folder/NouveauDocumentModalEtp";
import Button from "../../../components/button/Button";
import axios from "../../../config/axios";

const DocumentListEtp = ({
  idDossier,
  dossierName,
  onDocumentChange,
  refreshKey,
}) => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    section: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewModalContent, setPreviewModalContent] = useState({
    content: null,
    objectUrl: "",
    filename: "",
  });
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      if (previewModalContent.objectUrl) {
        URL.revokeObjectURL(previewModalContent.objectUrl);
      }
    };
  }, [previewModalContent.objectUrl]);

  const fetchDocuments = useCallback(async () => {
    if (!idDossier || isNaN(idDossier)) {
      setError("Identifiant du dossier invalide.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Veuillez vous connecter.");
        return;
      }

      const response = await axios.get(
        `/etp/dossier/document/liste/${idDossier}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const documentsData = response.data.documents || [];
      const formattedDocs = documentsData.map((doc) => ({
        id: doc.idDocument,
        titre: doc.titre || "—",
        type_document: doc.type_document || "—",
        section_document: doc.section_document || "—",
        taille: doc.taille ? `${doc.taille} MB` : "—",
        filename: doc.filename || "document",
        extension: (doc.extension || "").toLowerCase(),
        path: doc.path,
      }));

      setDocuments(formattedDocs);
      setFilteredDocuments(formattedDocs);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du chargement des documents.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [idDossier]);

  useEffect(() => {
    if (idDossier && !isNaN(idDossier)) {
      fetchDocuments();
    }
  }, [idDossier, refreshKey, fetchDocuments]);

  useEffect(() => {
    let result = documents;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.titre.toLowerCase().includes(searchTerm) ||
          doc.filename.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.type) {
      result = result.filter((doc) => doc.type_document === filters.type);
    }

    if (filters.section) {
      result = result.filter((doc) => doc.section_document === filters.section);
    }

    setFilteredDocuments(result);
    setCurrentPage(1);
  }, [filters, documents]);

    const addDocumentToList = useCallback((newDocument) => {
    setDocuments(prevDocs => {
      const exists = prevDocs.some(doc => doc.id === newDocument.id);
      if (exists) {
        return prevDocs;
      }
      return [newDocument, ...prevDocs];
    });
  }, []);
  useEffect(() => {
    setFilteredDocuments(documents);
  }, [documents]);


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = filteredDocuments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      type: "",
      section: "",
      search: "",
    });
  };

  const typeOptions = [
    ...new Set(documents.map((doc) => doc.type_document)),
  ].filter(Boolean);
  const sectionOptions = [
    ...new Set(documents.map((doc) => doc.section_document)),
  ].filter(Boolean);

  const getFileIcon = (extension) => {
    switch (extension) {
      case "pdf":
        return { icon: faFilePdf, color: "text-red-600" };
      case "doc":
      case "docx":
        return { icon: faFileWord, color: "text-blue-600" };
      case "xls":
      case "xlsx":
        return { icon: faFileExcel, color: "text-green-600" };
      case "ppt":
      case "pptx":
        return { icon: faFilePowerpoint, color: "text-orange-600" };
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return { icon: faFileImage, color: "text-purple-600" };
      case "txt":
      case "csv":
        return { icon: faFileAlt, color: "text-gray-600" };
      default:
        return { icon: faFile, color: "text-gray-500" };
    }
  };

  const handleDownload = useCallback(
    async (documentId, filename, extension) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `/etp/dossier/document/download/${documentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          }
        );

        const fullFilename = extension ? `${filename}.${extension}` : filename;
        saveAs(new Blob([response.data]), fullFilename);
        toast.success("Téléchargement démarré");
      } catch (err) {
        toast.error("Impossible de télécharger le fichier.");
        console.error("Download error:", err);
      }
    },
    []
  );

  const handlePreview = useCallback(
    async (documentId) => {
      let objectUrl = "";
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Votre session a expiré. Veuillez vous reconnecter.");
          return;
        }

        const document = documents.find((doc) => doc.id === documentId);
        if (!document) {
          toast.error("Le document demandé est introuvable.");
          return;
        }

        const filenameWithExtension = document.filename.endsWith(
          `.${document.extension}`
        )
          ? document.filename
          : `${document.filename}.${document.extension}`;
        const extension = document.extension.toLowerCase();
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];

        let content;
        let blob;

        try {
          const response = await axios.get(
            `/etp/dossier/document/view/${documentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            }
          );
          const contentType = response.headers["content-type"];
          blob = new Blob([response.data], { type: contentType });
          objectUrl = URL.createObjectURL(blob);

          if (contentType === "application/pdf" || extension === "pdf") {
            content = (
              <iframe
                src={objectUrl}
                title={`Aperçu PDF - ${filenameWithExtension}`}
                className="w-full h-[80vh] border-0 rounded shadow"
                frameBorder="0"
                onLoad={() => URL.revokeObjectURL(objectUrl)}
              />
            );
          } else if (
            contentType.startsWith("image/") ||
            imageExtensions.includes(extension)
          ) {
            content = (
              <div className="flex justify-center">
                <img
                  src={objectUrl}
                  alt={`Aperçu de ${filenameWithExtension}`}
                  className="max-h-[70vh] max-w-full rounded shadow"
                  onLoad={() => URL.revokeObjectURL(objectUrl)}
                />
              </div>
            );
          } else {
            content = (
              <div className="p-3 text-center">
                <p className="mb-3 text-gray-700">
                  La prévisualisation de ce type de document n'est pas
                  disponible directement.
                </p>
                <Button
                  onClick={() => {
                    saveAs(blob, filenameWithExtension);
                    setShowPreviewModal(false);
                    if (objectUrl) URL.revokeObjectURL(objectUrl);
                  }}
                  variant="primary"
                >
                  <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                  Télécharger
                </Button>
              </div>
            );
          }

          setPreviewModalContent({
            content,
            objectUrl: content ? objectUrl : "",
            filename: filenameWithExtension,
          });
          setShowPreviewModal(true);
        } catch (apiError) {
          console.error("Erreur lors de la récupération du blob:", apiError);
          toast.error("Impossible de récupérer le contenu du document.");

          content = (
            <div className="p-3 text-center">
              <p className="mb-3 text-red-600">
                Nous n'avons pas pu charger le document pour la
                prévisualisation.
              </p>
              <Button
                onClick={async () => {
                  try {
                    const downloadResponse = await axios.get(
                      `/etp/dossier/document/download/${documentId}`,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                        responseType: "blob",
                      }
                    );
                    saveAs(
                      new Blob([downloadResponse.data]),
                      filenameWithExtension
                    );
                    setShowPreviewModal(false);
                  } catch (downloadError) {
                    console.error("Échec du téléchargement:", downloadError);
                    toast.error("Désolé, le téléchargement a échoué.");
                  }
                }}
                variant="primary"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                Télécharger
              </Button>
            </div>
          );

          setPreviewModalContent({
            content,
            objectUrl: "",
            filename: filenameWithExtension,
          });
          setShowPreviewModal(true);
        }
      } catch (err) {
        console.error("Erreur dans handlePreview:", err);
        toast.error("Erreur lors de la prévisualisation.");
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      }
    },
    [documents]
  );

  const handleDeleteDocument = useCallback(
    async (documentId) => {
      if (!window.confirm("Voulez-vous vraiment supprimer ce document ?")) return;

      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `/etp/dossier/document/delete/${documentId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success("Document supprimé avec succès !");

        // Utiliser le setter partagé
        setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== documentId));
        setFilteredDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      } catch (error) {
        toast.error(
          `Erreur lors de la suppression : ${error.response?.data?.message || error.message}`
        );
      }
    },
    [setDocuments]
  );
  if (loading) return <p className="py-4 text-center">Chargement...</p>;
  if (error) return <p className="py-4 text-center text-red-500">{error}</p>;

  return (
    <div className="mb-8 overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <FaRegFileAlt className="w-5 h-5 text-gray-500" />
                    <span className="bg-gray-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {documents.length}
          </span>
          <h2 className="text-lg font-semibold text-gray-500 truncate">
            Document associé(s)
            <span className="font-bold text-blue-600"></span>
          </h2>

        </div>

        <div className="flex flex-wrap gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1"
          >
            <FaFilter className="w-3 h-3" />
            <span>Filtrer</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl shadow-sm bg-gray-400 hover:bg-purple-700 text-white transition-all duration-200"
            title="Créer un nouveau document"
          >
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-3 border-b border-gray-100 rounded-b bg-gray-50"
          >
            <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
              {/* Search */}
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">
                  Recherche
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Rechercher..."
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Document Type */}
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-500">
                  Type
                </label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-500"
                >
                  <option value="">Tous</option>
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">
                  Section
                </label>
                <select
                  name="section"
                  value={filters.section}
                  onChange={handleFilterChange}
                  className="text-gray-500 w-full px-2 py-1 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Toutes</option>
                  {sectionOptions.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="flex items-center justify-center w-full gap-1 text-gray-500 border-blue-500 hover:bg-blue-50"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Réinitialiser</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top pagination */}
      {filteredDocuments.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-2 px-4 py-2 border-b border-gray-200 sm:flex-row bg-gray-50">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-600">Afficher</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="p-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span className="text-xs text-gray-600">éléments</span>
          </div>

          <div className="text-xs text-gray-600">
            {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredDocuments.length)} sur{" "}
            {filteredDocuments.length}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/60">
          <div className="relative w-full max-w-4xl p-3 bg-white rounded shadow">
            <button
              onClick={() => {
                setShowPreviewModal(false);
                if (previewModalContent.objectUrl) {
                  URL.revokeObjectURL(previewModalContent.objectUrl);
                  setPreviewModalContent((prev) => ({
                    ...prev,
                    objectUrl: "",
                  }));
                }
              }}
              className="absolute font-bold text-red-500 top-1 right-1 hover:text-red-700"
              aria-label="Fermer"
            >
              &times;
            </button>
            <h3 className="mb-2 font-semibold text-gray-800 truncate text-md">
              Aperçu : {previewModalContent.filename}
            </h3>
            {previewModalContent.content}
          </div>
        </div>
      )}

      {/* Documents Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                Document
              </th>
              <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                Type
              </th>
              <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                Section
              </th>
              <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                Taille
              </th>
              <th className="w-24 px-3 py-2 text-xs font-medium text-right text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentDocuments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-3 py-3 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center py-4">
                    <FontAwesomeIcon
                      icon={faFolderOpen}
                      className="w-8 h-8 mb-1 text-gray-400"
                    />
                    <p className="mb-1 text-sm text-gray-600">
                      {documents.length === 0
                        ? "Aucun document disponible"
                        : "Aucun résultat"}
                    </p>
                    {documents.length === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOpen(true)}
                      >
                        <PlusIcon className="w-3 h-3 mr-1" />
                        Ajouter
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              currentDocuments.map((doc) => {
                const { icon, color } = getFileIcon(doc.extension);
                return (
                  <tr key={doc.id} className="hover:bg-gray-100 group">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={icon}
                          className={`w-4 h-4 ${color}`}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-500 truncate max-w-[200px]">
                            {doc.titre}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">
                            {doc.filename.endsWith(`.${doc.extension}`)
                              ? doc.filename
                              : `${doc.filename}.${doc.extension}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                      {doc.type_document}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                      {doc.section_document}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                      {doc.taille}
                    </td>
                    <td className="relative px-3 py-2 text-xs font-medium text-right whitespace-nowrap">
                      <div className="absolute flex items-center p-1 space-x-1 transition-opacity duration-200 -translate-y-1/2 rounded-full opacity-0 top-1/2 right-3 group-hover:opacity-100">
                        <button
                          onClick={() =>
                            handleDownload(doc.id, doc.filename, doc.extension)
                          }
                          className="p-2 transition-colors duration-150 rounded cursor-pointer bg-white-500 text-gray hover:bg-blue-400"
                          title="Télécharger"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePreview(doc.id)}
                          className="p-2 transition-colors duration-150 rounded cursor-pointer bg-white-500 text-gray hover:bg-green-400"
                          title="Prévisualiser"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-2 transition-colors duration-150 rounded cursor-pointer bg-white-500 text-gray hover:bg-red-400"
                          title="Supprimer"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-gray-400 transition-opacity duration-200 group-hover:opacity-0">
                        <span className="text-xs">
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom pagination */}
      {filteredDocuments.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-2 px-4 py-2 border-t border-gray-200 bg-gray-50 sm:flex-row">
          <div className="text-xs text-gray-700">
            {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredDocuments.length)} sur{" "}
            {filteredDocuments.length}
          </div>

          <div className="flex items-center space-x-0">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-1 rounded ${currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
                }`}
              aria-label="Précédent"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => {
                if (
                  number === 1 ||
                  number === totalPages ||
                  (number >= currentPage - 1 && number <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-2 py-0.5 rounded text-xs ${currentPage === number
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {number}
                    </button>
                  );
                } else if (
                  (number === currentPage - 2 && currentPage > 3) ||
                  (number === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span key={number} className="px-1 text-gray-500">
                      ...
                    </span>
                  );
                }
                return null;
              }
            )}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-1 rounded ${currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
                }`}
              aria-label="Suivant"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {open && idDossier && (
        <AjoutDocumentModal
          isOpen={open}
          onClose={() => {
            setOpen(false);
          }}
          onDocumentAdded={addDocumentToList} 
          dossierName={dossierName}
          idDossier={idDossier}
        />
      )}
    </div>
  );
};

export default DocumentListEtp;
