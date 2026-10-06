import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Chargement...', 
  variant = 'default',
  className = '',
  overlay = false,
  fullHeight = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const variants = {
    default: 'text-purple-600',
    primary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    light: 'text-gray-400',
    dark: 'text-gray-700'
  };

  const containerClasses = `
    flex flex-col items-center justify-center gap-3
    ${fullHeight ? 'min-h-[200px]' : 'py-8'}
    ${overlay ? 'absolute inset-0 bg-white/80 backdrop-blur-sm z-10' : ''}
    ${className}
  `;

  return (
    <div className={containerClasses}>
      <div className="relative">
        <Loader2 
          className={`${sizeClasses[size]} ${variants[variant]} animate-spin`} 
        />
        {/* Effet de pulsation en arrière-plan */}
        <div className={`absolute inset-0 ${sizeClasses[size]} ${variants[variant]} opacity-20 animate-ping rounded-full`}></div>
      </div>
      
      {text && (
        <p className={`${textSizeClasses[size]} ${variants[variant]} font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Composant pour loading inline (dans une ligne)
export const InlineLoader = ({ size = 'sm', variant = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const variants = {
    default: 'text-purple-600',
    primary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    light: 'text-gray-400',
    dark: 'text-gray-700'
  };

  return (
    <Loader2 
      className={`${sizeClasses[size]} ${variants[variant]} animate-spin ${className}`} 
    />
  );
};

// Composant pour loading de bouton
export const ButtonLoader = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <Loader2 
      className={`${sizeClasses[size]} text-current animate-spin ${className}`} 
    />
  );
};

// Composant pour loading avec skeleton
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className={`h-4 bg-gray-200 rounded ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}></div>
        </div>
      ))}
    </div>
  );
};

// Composant pour loading de cartes
export const CardLoader = ({ count = 1, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant pour loading de tableau
export const TableLoader = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="overflow-hidden bg-white rounded-xl border border-gray-200">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="px-6 py-4">
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;