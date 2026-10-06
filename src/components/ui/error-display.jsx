import { AlertCircle } from "lucide-react";

export const ErrorDisplay = ({
  title = "Une erreur est survenue",
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-8">
      <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
      <p className="mb-2 text-lg font-semibold text-gray-800">{title}</p>
      <p className="mb-4 text-center text-gray-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Réessayer
        </button>
      )}
    </div>
  );
};
