import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';

const Alert = ({
    type = 'info',
    message,
    onClose,
    className = '',
    showIcon = true
}) => {
    const types = {
        success: {
            bgColor: 'bg-green-50 border-green-200',
            textColor: 'text-green-800',
            icon: CheckCircle,
            iconColor: 'text-green-500',
        },
        error: {
            bgColor: 'bg-red-50 border-red-200',
            textColor: 'text-red-800',
            icon: XCircle,
            iconColor: 'text-red-500',
        },
        warning: {
            bgColor: 'bg-yellow-50 border-yellow-200',
            textColor: 'text-yellow-800',
            icon: AlertCircle,
            iconColor: 'text-yellow-500',
        },
        info: {
            bgColor: 'bg-blue-50 border-blue-200',
            textColor: 'text-blue-800',
            icon: Info,
            iconColor: 'text-blue-500',
        },
    };

    const config = types[type];
    const Icon = config.icon;

    return (
        <div
            className={`flex items-start p-4 border rounded-lg ${config.bgColor} ${config.textColor} ${className}`}
            role="alert"
        >
            {showIcon && (
                <Icon className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
            )}
            <div className="flex-1 text-sm font-medium">{message}</div>
            {onClose && (
                <button
                    type="button"
                    className={`ml-3 -mr-1 flex-shrink-0 ${config.textColor} hover:opacity-75`}
                    onClick={onClose}
                    aria-label="Close alert"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default Alert;