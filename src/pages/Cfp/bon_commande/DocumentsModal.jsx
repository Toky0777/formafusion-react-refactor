import { memo, useCallback, useRef } from "react";
import {
    X,
    Upload,
    Download,
    Trash2,
    FileText,
    Image,
    File,
    Eye
} from "lucide-react";
import dayjs from "dayjs";

const DocumentsModal = memo(({
    isOpen,
    onClose,
    selectedBC,
    documents,
    uploadLoading,
    onUpload,
    onDownload,
    onDelete,
    onPreview,
}) => {
    const fileInputRef = useRef(null);

    const handleFileSelect = useCallback(async (event) => {
        const file = event.target.files[0];
        if (file) {
            const result = await onUpload(selectedBC.idBC, file);
            if (result.success) {
                // Reset input
                event.target.value = '';
            } else {
                alert(result.error || "Erreur lors de l'upload");
            }
        }
    }, [selectedBC, onUpload]);

    const handleUploadClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const getFileIcon = useCallback((filename) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (['pdf'].includes(ext)) return <FileText className="w-5 h-5 text-red-500" />;
        if (['doc', 'docx'].includes(ext)) return <FileText className="w-5 h-5 text-blue-500" />;
        if (['xls', 'xlsx'].includes(ext)) return <FileText className="w-5 h-5 text-green-500" />;
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <Image className="w-5 h-5 text-purple-500" />;
        return <File className="w-5 h-5 text-gray-500" />;
    }, []);

    const formatFileSize = useCallback((bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    const handlePreview = useCallback(async (doc) => {
        try {
            const result = await onPreview(doc.idDocument);
            if (!result.success) {
                alert(result.error || "Impossible d'ouvrir le document");
            }
        } catch (error) {
            alert("Erreur lors de l'ouverture du document");
        }
    }, [onPreview]);

    // Le retour conditionnel doit être APRÈS tous les hooks
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Documents - {selectedBC?.numero_bc}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {selectedBC?.etp_name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 transition-colors hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Upload Section */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Ajouter un document</h3>
                            <p className="mt-1 text-xs text-gray-500">
                                PDF, DOC, XLS, images - Max. 10MB
                            </p>
                        </div>
                        <button
                            onClick={handleUploadClick}
                            disabled={uploadLoading}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploadLoading ? (
                                <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4" />
                            )}
                            Upload
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileSelect}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png"
                        />
                    </div>
                </div>

                {/* Documents List */}
                <div className="p-6 overflow-y-auto max-h-96">
                    {documents.length === 0 ? (
                        <div className="py-8 text-center">
                            <File className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm text-gray-500">Aucun document uploadé</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {documents.map((doc) => (
                                <div
                                    key={doc.idDocument}
                                    className="flex items-center justify-between p-3 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex items-center flex-1 min-w-0 gap-3">
                                        {getFileIcon(doc.file_name)}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {doc.file_name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {doc.created_at && ` ${dayjs(doc.created_at).format('DD/MM/YYYY HH:mm')}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handlePreview(doc)}
                                            className="p-2 text-gray-400 transition-colors hover:text-blue-600"
                                            title="Aperçu"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDownload(doc.idDocument)}
                                            className="p-2 text-gray-400 transition-colors hover:text-blue-600"
                                            title="Télécharger"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
                                                    await onDelete(doc.idDocument, selectedBC.idBC);
                                                }
                                            }}
                                            className="p-2 text-gray-400 transition-colors hover:text-red-600"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
});

DocumentsModal.displayName = 'DocumentsModal';
export default DocumentsModal;