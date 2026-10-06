import { Loader2 } from "lucide-react";

/**
 * Composant de chargement avec spinner
 * @param {Object} props
 * @param {string} props.message - Message à afficher pendant le chargement
 * @param {string} props.size - Taille du spinner (sm, md, lg)
 * @returns {JSX.Element}
 */
export function LoadingSpinner({ message = "Chargement...", size = "md" }) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mb-4`} />
      <p className="text-muted-foreground text-center">{message}</p>
    </div>
  );
}

/**
 * Composant de chargement plein écran
 * @param {Object} props
 * @param {string} props.message - Message à afficher pendant le chargement
 * @returns {JSX.Element}
 */
export function FullScreenLoading({ message = "Chargement des données..." }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner message={message} size="lg" />
      </div>
    </div>
  );
}

export default LoadingSpinner;
