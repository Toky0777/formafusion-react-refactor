import { useMemo } from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

export const NotificationBanner = ({ type, message, onClose }) => {
    const style = useMemo(() => ({
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: Check,
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: AlertCircle,
        },
    }[type]), [type]);

    if (!style) return null;

    const Icon = style.icon;

    return (
        <div className={`flex items-center justify-between p-4 mb-4 rounded-lg border ${style.bg} ${style.border}`}>
            <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${style.text}`} />
                <span className={`${style.text} font-medium`}>{message}</span>
            </div>
            <button
                onClick={onClose}
                className={`p-1 hover:bg-gray-100 rounded-full transition-colors ${style.text}`}
                aria-label="Fermer la notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
