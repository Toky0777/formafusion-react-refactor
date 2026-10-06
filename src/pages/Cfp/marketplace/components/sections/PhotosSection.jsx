import { useRef } from 'react';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { Button } from '../ui/Button';

export const PhotosSection = ({
    images,
    onUpload,
    onRemove,
    loading,
}) => {
    const fileInputRef = useRef(null);
    const handleFileSelect = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            onUpload(files);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="p-6 rounded-lg bg-gray-50">
            <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Photos</h3>
                <Button
                    size="sm"
                    onClick={triggerFileSelect}
                    disabled={loading}
                    className="opacity-70 hover:opacity-100"
                >
                    {images.length === 0 ? <Plus className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={handleFileSelect}
                className="hidden"
            />

            {images.length === 0 ? (
                <div className="py-12 text-center">
                    <div className="p-8 border-2 border-gray-300 border-dashed rounded-lg">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="mb-4 text-gray-500">Pas de photo. Veuillez en ajouter une.</p>
                        <p className="mb-4 text-sm text-gray-400">
                            Formats acceptés: JPEG, PNG, GIF, WebP • Taille max: 5MB par fichier
                        </p>
                        <Button onClick={triggerFileSelect} disabled={loading}>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter des photos
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mb-4 text-sm text-gray-600">
                        Formats acceptés: JPEG, PNG, GIF, WebP • Taille max: 5MB par fichier
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {images.map((img) => (
                            <div key={img.id} className="relative group">
                                <div className="overflow-hidden bg-gray-200 rounded-lg aspect-w-16 aspect-h-12">
                                    <img
                                        src={img.url}
                                        alt="Photo du profil"
                                        className="object-cover w-full h-40 transition-transform rounded-lg group-hover:scale-105"
                                    />
                                </div>
                                <button
                                    onClick={() => onRemove(img.id)}
                                    disabled={loading}
                                    className="absolute p-2 text-red-600 transition-opacity bg-red-100 rounded-lg opacity-0 top-2 right-2 hover:bg-red-200 group-hover:opacity-100 disabled:opacity-50"
                                    title="Supprimer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};