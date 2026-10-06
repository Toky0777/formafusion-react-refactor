// components/Notification.jsx
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const Notification = ({ notification, show, onClose }) => {
  if (!show) return null;

  const getNotificationConfig = (type) => {
    const configs = {
      success: {
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        border: "border-green-200",
        text: "text-green-800",
        icon: CheckCircle,
        iconColor: "text-green-600",
        progressBar: "bg-green-500",
      },
      error: {
        bg: "bg-gradient-to-r from-red-50 to-rose-50",
        border: "border-red-200",
        text: "text-red-800",
        icon: XCircle,
        iconColor: "text-red-600",
        progressBar: "bg-red-500",
      },
      warning: {
        bg: "bg-gradient-to-r from-yellow-50 to-amber-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        icon: AlertTriangle,
        iconColor: "text-yellow-600",
        progressBar: "bg-yellow-500",
      },
      info: {
        bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
        border: "border-blue-200",
        text: "text-blue-800",
        icon: Info,
        iconColor: "text-blue-600",
        progressBar: "bg-blue-500",
      },
    };
    return configs[type] || configs.info;
  };

  const config = getNotificationConfig(notification.type);
  const IconComponent = config.icon;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[500] animate-in slide-in-from-top-4 duration-300">
      <div
        className={`relative max-w-md w-full mx-auto ${config.bg} ${config.border} border-2 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden`}
      >
        <div className="absolute top-0 left-0 h-1 w-full bg-gray-200">
          <div className={`h-full ${config.progressBar} animate-progress`} />
        </div>

        <div className="p-4 flex items-start space-x-3">
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${config.text} leading-5`}>
              {notification?.message}
            </p>
          </div>

          <button
            onClick={onClose}
            className={`flex-shrink-0 ${config.text} hover:opacity-70 transition-opacity`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
