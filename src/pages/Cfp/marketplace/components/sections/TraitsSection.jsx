import { Plus, Edit, Check, X, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const TraitsSection = ({
    traits,
    onAdd,
    onRemove,
    loading,
}) => {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                    Caractéristiques Principales
                </h3>
                <Button
                    size="sm"
                    onClick={onAdd}
                    disabled={loading}
                    className="opacity-70 hover:opacity-100"
                >
                    {traits.length > 0 ? <Plus className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {traits.length === 0 ? (
                    <div className="flex items-center space-x-2 text-gray-500">
                        <X className="w-5 h-5 text-red-400" />
                        <span>Aucune caractéristique disponible</span>
                    </div>
                ) : (
                    traits.map((trait) => (
                        <div key={trait.id} className="flex items-center justify-between p-3 rounded-lg bg-green-50 group">
                            <div className="flex items-center space-x-3">
                                <Check className="w-5 h-5 text-green-500" />
                                <span className="font-medium text-gray-900">{trait.title}</span>
                            </div>
                            <button
                                className="p-2 text-red-500 transition-opacity rounded-lg opacity-0 hover:bg-red-50 group-hover:opacity-100 disabled:opacity-50"
                                onClick={() => onRemove(trait.id)}
                                disabled={loading}
                                title="Supprimer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};