import { useState } from 'react';
import axios from '../../../config/axios';

const ExportButtons = ({
  xlEndpoint = null,
  pdfEndpoint = null,
  xlFileName = 'export.xlsx',
  pdfFileName = 'export.pdf',
  data = null,
  dataFilter = {},
  onError = () => {},
  className = '',
  labelExcel = 'Excel',
  labelPdf = 'PDF',
}) => {
  const [loading, setLoading] = useState({ xl: false, pdf: false });

  const downloadFile = async (endpoint, defaultFilename, requestData = null, type) => {
    setLoading(prev => ({ ...prev, [type]: true }));

    try {
      console.log(`🔄 Tentative d'export ${type} vers : ${endpoint}`);
      console.log('📤 Données envoyées :', requestData);

      const config = {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
        timeout: 50000, // 🔧 30 secondes
      };

      const postData = requestData
        ? {
            data: Array.isArray(requestData) ? requestData : [requestData],
            data_filter: dataFilter,
          }
        : {};

      const response = await axios.post(endpoint, postData, config);
      console.log('✅ Réponse reçue :', response);

      if (!(response.data instanceof Blob)) {
        throw new Error('❌ Réponse serveur invalide - attendu un blob');
      }

      if (response.data.size === 0) {
        throw new Error('❌ Fichier exporté vide');
      }

      let filename = defaultFilename;
      const disposition = response.headers['content-disposition'];
      if (disposition) {
        const match = disposition.match(/filename="?(.+?)"?$/);
        if (match) filename = match[1];
      }

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);

    } catch (error) {
      console.error('❌ Erreur détaillée:', error);
      let errorMessage = "Échec de l'export";

      if (error.code === 'ECONNABORTED') {
        errorMessage = "⏱ Le serveur met trop de temps à répondre. Veuillez réessayer.";
      } else if (error.response) {
        const { status, headers, data } = error.response;
        console.log('📛 Statut :', status);

        if (headers['content-type']?.includes('application/json')) {
          try {
            const errorText = await data.text();
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (e) {
            errorMessage = `Erreur serveur: ${status}`;
          }
        } else if (headers['content-type']?.includes('text/html')) {
          errorMessage = `Erreur serveur (${status}) — veuillez contacter l'administrateur.`;
        } else {
          try {
            const errorText = await data.text();
            errorMessage = errorText || `Erreur: ${status}`;
          } catch (e) {
            errorMessage = `Erreur: ${status} ${error.response.statusText}`;
          }
        }
      } else if (error.request) {
        errorMessage = "Le serveur n'a pas répondu. Vérifiez votre connexion réseau.";
      } else {
        errorMessage = error.message;
      }

      onError(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className={`flex flex-wrap justify-center gap-2 my-5 ${className}`}>
      {xlEndpoint && (
        <button
          type="button"
          onClick={() => downloadFile(xlEndpoint, xlFileName, data, 'xl')}
          disabled={loading.xl}
          className={`px-4 py-3 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            loading.xl
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'text-green-700 bg-green-100 hover:text-green-800 hover:bg-green-200 focus:ring-green-500'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {loading.xl ? (
              <svg className="animate-spin h-4 w-4 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <i className="fa-solid fa-file-excel text-sm" aria-hidden="true"></i>
            )}
            <p>{loading.xl ? 'Export...' : labelExcel}</p>
          </span>
        </button>
      )}

      {pdfEndpoint && (
        <button
          type="button"
          onClick={() => downloadFile(pdfEndpoint, pdfFileName, data, 'pdf')}
          disabled={loading.pdf}
          className={`px-4 py-3 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            loading.pdf
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'text-red-600 bg-red-100 hover:text-red-700 hover:bg-red-200 focus:ring-red-500'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            {loading.pdf ? (
              <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <i className="fa-solid fa-file-pdf text-sm" aria-hidden="true"></i>
            )}
            <p>{loading.pdf ? 'Export...' : labelPdf}</p>
          </span>
        </button>
      )}
    </div>
  );
};

export default ExportButtons;
