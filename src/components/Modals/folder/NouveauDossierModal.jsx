import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../../config/axios';
import { useTranslation } from "react-i18next";


const NouveauDossierModal = ({ onClose, onCreate }) => {
  const [dossier, setDossier] = useState('');
  const [showClear, setShowClear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();


  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setDossier(e.target.value);
    setShowClear(e.target.value.length > 0);
    setError(null);
  };

  const clearInput = () => {
    setDossier('');
    setShowClear(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dossier.trim()) {
      setError('Le nom du dossier est requis.');
      toast.error('Veuillez entrer un nom de dossier.');
      return;
    }
    if (dossier.length < 2 || dossier.length > 200) {
      setError('Le nom du dossier doit contenir entre 2 et 200 caractères.');
      toast.error('Le nom du dossier doit contenir entre 2 et 200 caractères.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/cfp/dossier/ajouter', { dossier });
      toast.success(response.data.success || 'Dossier créé avec succès !');
      onCreate(response.data.idDossier);
      handleClose();
    } catch (err) {
      console.error('Erreur complète:', err); // Afficher l'erreur complète dans la console
      const status = err.response?.status;
      let msg = 'Impossible de créer le dossier.';
      if (status === 422) {
        msg = err.response?.data?.error || 'Erreur de validation des données.';
      } else if (status === 401) {
        msg = 'Utilisateur non authentifié. Veuillez vous reconnecter.';
        window.location.href = '/login';
      } else if (status === 500) {
        msg = 'Erreur serveur. Veuillez réessayer plus tard.';
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ease-in-out ${visible ? 'bg-black/40 backdrop-blur-sm opacity-100' : 'opacity-0 bg-black/0'
        }`}
    >
      <div
        className={`w-full max-w-lg p-6 bg-white rounded-lg shadow-lg transform transition-all duration-500 ease-in-out ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'
          }`}
      >
        <h2 className="mb-4 text-xl font-semibold">{t("table_headers.create_new_folder")}</h2>
        <form onSubmit={handleSubmit} className="relative flex w-full gap-3">
          <div className="relative w-full">
            <input
              type="text"
              name="dossier"
              placeholder="Nom du dossier"
              className={`w-full p-2 pr-10 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'
                }`}
              value={dossier}
              onChange={handleChange}
              disabled={loading}
            />
            {showClear && (
              <button
                type="button"
                onClick={clearInput}
                className="absolute inset-y-0 flex items-center p-2 font-bold rounded-md right-3 hover:text-red-500"
                disabled={loading}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            )}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
          <input
            type="submit"
            value={t("table_headers.new_folder")}
            className="cursor-pointer px-5 py-2.5 text-white font-bold rounded-md bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 text-sm disabled:opacity-50"
            disabled={loading}
          />
        </form>

        <button
          onClick={handleClose}
          className="block px-4 py-2 mt-4 text-sm font-semibold text-white transition duration-300 ease-in-out bg-gray-500 border border-gray-500 rounded-md cursor-pointer hover:bg-gray-700"
          disabled={loading}
        >
          {t("table_headers.close")}
        </button>
      </div>
    </div>
  );
};

export default NouveauDossierModal;