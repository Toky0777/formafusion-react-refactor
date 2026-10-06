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
  PlusIcon,
} from "@heroicons/react/24/outline";
import { FaFilter } from "react-icons/fa";
import { saveAs } from "file-saver";
import AjoutDocumentModal from "../../../components/Modals/folder/NouveauDocumentModalCfp";
import Button from "../../../components/button/Button";
import axios from "../../../config/axios";

const DocumentList = ({
  idDossier,
  dossierName,
  onDocumentChange,
  refreshKey,
  onDocumentAdded,
  externalDocuments,
  setExternalDocuments,
}) => {
  const [localDocuments, setLocalDocuments] = useState([]);
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

  const documents = externalDocuments !== undefined ? externalDocuments : localDocuments;
  const setDocuments = setExternalDocuments || setLocalDocuments;

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
        `/cfp/dossier/document/liste/${idDossier}`,
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
  }, [idDossier, setDocuments]);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = filteredDocuments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleDocumentAddedInList = useCallback((newDocument) => {
    setDocuments(prev => [newDocument, ...prev]);
    setFilteredDocuments(prev => [newDocument, ...prev]);

    if (onDocumentAdded) {
      onDocumentAdded(newDocument);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setDocuments, onDocumentAdded]);

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
          `/cfp/dossier/document/download/${documentId}`,
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

        const response = await axios.get(
          `/cfp/dossier/document/view/${documentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          }
        );

        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });
        objectUrl = URL.createObjectURL(blob);

        let content;
        if (contentType === "application/pdf") {
          content = (
            <iframe
              src={objectUrl}
              title={`Aperçu PDF - ${filenameWithExtension}`}
              className="w-full h-96 border-0 rounded-lg shadow-inner"
              frameBorder="0"
            />
          );
        } else if (contentType.startsWith("image/")) {
          content = (
            <div className="flex justify-center">
              <img
                src={objectUrl}
                alt={`Aperçu de ${filenameWithExtension}`}
                className="max-h-96 max-w-full rounded-lg shadow-inner"
              />
            </div>
          );
        } else {
          content = (
            <div className="text-center p-6">
              <p className="text-gray-600 mb-4">
                La prévisualisation n'est pas disponible pour ce type de fichier.
              </p>
              <button
                onClick={() => {
                  saveAs(blob, filenameWithExtension);
                  setShowPreviewModal(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Télécharger le fichier
              </button>
            </div>
          );
        }

        setPreviewModalContent({
          content,
          objectUrl,
          filename: filenameWithExtension,
        });
        setShowPreviewModal(true);
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
          `/cfp/dossier/document/delete/${documentId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success("Document supprimé avec succès !");
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

  if (loading) return <p className="text-center py-8 text-gray-600">Chargement...</p>;
  if (error) return <p className="text-center py-8 text-red-600">{error}</p>;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <h2 className="text-lg font-semibold text-gray-500">
            Documents dans ce dossier
          </h2>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
            {documents.length}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150"
          >
            <FaFilter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-150"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="text-sm">Ajouter</span>
          </button>
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
            className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Recherche
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Rechercher..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Section
                </label>
                <select
                  name="section"
                  value={filters.section}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 w-full px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-150"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm">Réinitialiser</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <tbody className="bg-white">
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
                        className="bg-gray-500 text-white hover:bg-gray-600 rounded px-3 py-1 flex items-center"
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
                      <div className="absolute flex items-center p-1 space-x-1 transition-opacity duration-200 -translate-y-1/2 opacity-0 top-1/2 right-3 group-hover:opacity-100 bg-gray-100">
                        <button
                          onClick={() =>
                            handleDownload(doc.id, doc.filename, doc.extension)
                          }
                          className="p-2 transition-colors duration-150 cursor-pointer text-gray-600  hover:text-blue-600"
                          title="Télécharger"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePreview(doc.id)}
                          className="p-2 transition-colors duration-150 cursor-pointer text-gray-600  hover:text-green-600"
                          title="Prévisualiser"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-2 transition-colors duration-150 cursor-pointer text-gray-600  hover:text-red-600"
                          title="Supprimer"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredDocuments.length > 0 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredDocuments.length)} sur {filteredDocuments.length}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                  currentPage === number
                    ? "bg-gray-500 text-white"
                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                } transition-colors duration-150`}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Aperçu : {previewModalContent.filename}
              </h3>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  if (previewModalContent.objectUrl) {
                    URL.revokeObjectURL(previewModalContent.objectUrl);
                  }
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-auto">
              {previewModalContent.content}
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {open && idDossier && (
        <AjoutDocumentModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onDocumentAdded={handleDocumentAddedInList}
          dossierName={dossierName}
          idDossier={idDossier}
        />
      )}
    </div>
  );
};

export default DocumentList;