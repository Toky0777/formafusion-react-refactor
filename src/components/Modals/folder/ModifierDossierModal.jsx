import { useState, useEffect, useRef } from 'react';

const ModifierDossierModal = ({ onClose, onUpdate, nomInitial = '' }) => {
  const [dossier, setDossier] = useState(nomInitial);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Handle modal visibility and input focus on mount
  useEffect(() => {
    inputRef.current?.focus();
    setVisible(true);
    return () => setVisible(false);
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !loading) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [loading]);

  // Handle input changes
  const handleChange = (e) => {
    setDossier(e.target.value);
    setError(null);
  };

  // Clear input field
  const clearInput = () => {
    setDossier('');
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dossier.trim()) {
      setError('Le nom du dossier est requis.');
      return;
    }
    if (dossier.length < 2 || dossier.length > 200) {
      setError('Le nom du dossier doit contenir entre 2 et 200 caractères.');
      return;
    }

    setLoading(true);
    try {
      await onUpdate(dossier);
      setLoading(false);
      handleClose();
    } catch (err) {
      setLoading(false);
      setError('Erreur lors de la mise à jour. Veuillez réessayer.');
      console.error('Erreur:', err);
    }
  };

  // Handle modal closure
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose(); // Notify parent after animation
    }, 300); // Matches CSS transition duration
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      handleClose();
    }
  };

  // Derived state for clear button visibility
  const showClear = dossier.length > 0;
  // Disable submit button if input is invalid or loading
  const isSubmitDisabled = loading || !dossier.trim() || dossier.length < 2 || dossier.length > 200;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-in-out ${
        visible ? 'bg-black/40 backdrop-blur-sm opacity-100' : 'opacity-0 bg-black/0 pointer-events-none'
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`w-full max-w-lg p-6 bg-white rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        <h2 id="modal-title" className="mb-4 text-xl font-semibold">
          Rennomer le dossier
        </h2>
        <form onSubmit={handleSubmit} className="relative flex w-full gap-3">
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              name="dossier"
              placeholder="Nom du dossier"
              className={`w-full p-2 pr-10 border rounded-md ${
                error ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              value={dossier}
              onChange={handleChange}
              disabled={loading}
              aria-describedby={error ? 'error-message' : undefined}
            />
            {showClear && (
              <button
                type="button"
                onClick={clearInput}
                className="absolute inset-y-0 right-3 flex items-center p-2 font-bold rounded-md hover:text-red-500 cursor-pointer"
                disabled={loading}
                aria-label="Effacer le contenu"
              >
                <span aria-hidden="true">×</span>
              </button>
            )}
            {error && (
              <p id="error-message" className="mt-1 text-sm text-red-500" aria-live="polite">
                {error}
              </p>
            )}
          </div>
          <input
            type="submit"
            value={loading ? 'Modification...' : 'Rennomer'}
            className="cursor-pointer px-5 py-2.5 text-white font-bold rounded-md bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitDisabled}
          />
        </form>

        <button
          onClick={handleClose}
          className="cursor-pointer block px-4 py-2 mt-4 text-sm font-semibold text-white transition duration-300 ease-in-out bg-gray-500 border border-gray-500 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          disabled={loading}
          aria-label="Fermer le modal"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default ModifierDossierModal;