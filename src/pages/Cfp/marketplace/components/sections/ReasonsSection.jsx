import { Plus, Edit, Circle, X, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const ReasonsSection = ({
    reasons,
    onAdd,
    onRemove,
    loading,
}) => {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                    Pourquoi Nous Choisir
                </h3>
                <Button
                    size="sm"
                    onClick={onAdd}
                    disabled={loading}
                    className="opacity-70 hover:opacity-100"
                >
                    {reasons.length > 0 ? <Plus className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {reasons.length === 0 ? (
                    <div className="flex items-center space-x-2 text-gray-500">
                        <X className="w-5 h-5 text-red-400" />
                        <span>Aucune information disponible</span>
                    </div>
                ) : (
                    reasons.map((reason) => (
                        <div key={reason.id} className="p-4 rounded-lg bg-purple-50 group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Circle className="w-4 h-4 text-purple-600 fill-current" />
                                    <h4 className="font-semibold text-gray-900">{reason.title}</h4>
                                </div>
                                <button
                                    className="p-2 text-red-500 transition-opacity rounded-lg opacity-0 hover:bg-red-100 group-hover:opacity-100 disabled:opacity-50"
                                    onClick={() => onRemove(reason.id)}
                                    disabled={loading}
                                    title="Supprimer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-sm leading-relaxed text-gray-700">{reason.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};