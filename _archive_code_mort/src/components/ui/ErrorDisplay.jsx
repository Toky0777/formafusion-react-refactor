import React from 'react';

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  title = "Une erreur est survenue",
  retryText = "Réessayer" 
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-bold text-center text-gray-800">{title}</h3>
      <p className="mb-6 text-center text-gray-600">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="block w-full px-4 py-3 font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
        >
          {retryText}
        </button>
      )}
    </div>
  </div>
);

export default ErrorDisplay;