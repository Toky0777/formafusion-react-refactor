import { AlertTriangle } from 'lucide-react';


const ConfirmationModal = ({
        title,
        message,
        onConfirm,
        onCancel,
        show,
        children,
    }) => {
        if (!show) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900/60 z-[100]">
                <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
                    {/* Header avec icône */}
                    <div className="flex items-center gap-3 border-b pb-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    </div>

                    {/* Body */}
                    <div className="flex flex-col items-center text-center py-6">
                    <p className="text-sm text-gray-600">{message}</p>
                    {children}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition"
                    >
                        Non, annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-sm font-medium transition"
                    >
                        Oui, je confirme
                    </button>
                    </div>
                </div>
            </div>
        );
    };

export default ConfirmationModal;
