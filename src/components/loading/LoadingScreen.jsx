
export function LoadingScreen({ size = 'medium', className = '' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div 
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClasses[size]} ${className}`}
      role="status"
      style={{ animationDuration: '0.8s' }}
    >

    </div>
  );
}

// Version avec overlay (pour chargements en plein écran)
export function LoadingOverlay({ isLoading, children }) {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
        <LoadingScreen size="large" />
      </div>
    </div>
  );
}