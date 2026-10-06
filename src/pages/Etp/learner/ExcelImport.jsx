import { useState } from 'react';
import Axios from '../../../config/axios';

const ExcelImport = () => {
    const [file, setFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        console.log('Fichier sélectionné:', e.target.files[0]);
        setFile(e.target.files[0]);
    };

    const handleImport = async () => {
        if (!file) {
            console.log('Aucun fichier sélectionné');
            return;
        }

        console.log('Début de l\'importation avec le fichier:', file.name);
        setImporting(true);
        
        const formData = new FormData();
        formData.append('excel_file', file);
        formData.append('idEntreprise', '123');
        
        console.log('FormData créé, contenu:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            console.log('Envoi de la requête à /etp/employes/import-excel');
            
            // Vérifier le token d'authentification
            const token = localStorage.getItem('auth_token');
            console.log('Token auth:', token ? 'Présent' : 'Absent');
            
            const config = {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                }
            };

            // Ajouter le token si disponible
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
                console.log('Authorization header ajouté');
            }

            const response = await Axios.post('/etp/employes/import-excel', formData, config);
            
            console.log('Réponse reçue:', response.status, response.data);
            setResult(response.data);
            
        } catch (error) {
            console.error('=== ERREUR DÉTAILLÉE ===');
            console.error('Message:', error.message);
            console.error('Code:', error.code);
            console.error('Status:', error.response?.status);
            console.error('Status Text:', error.response?.statusText);
            console.error('Headers:', error.response?.headers);
            console.error('Data:', error.response?.data);
            console.error('Config:', error.config);
            
            if (error.response) {
                // La requête a été faite et le serveur a répondu avec un code d'erreur
                console.log('Erreur serveur:', error.response.status);
                console.log('Détails erreur:', error.response.data);
                
                if (error.response.status === 403) {
                    console.log('Erreur 403: Accès interdit - vérifiez les permissions');
                } else if (error.response.status === 401) {
                    console.log('Erreur 401: Non authentifié - vérifiez le token');
                } else if (error.response.status === 404) {
                    console.log('Erreur 404: Route non trouvée');
                } else if (error.response.status === 422) {
                    console.log('Erreur 422: Validation échouée');
                }
            } else if (error.request) {
                // La requête a été faite mais aucune réponse n'a été reçue
                console.log('Aucune réponse du serveur:', error.request);
            } else {
                // Une erreur s'est produite lors de la configuration de la requête
                console.log('Erreur de configuration:', error.message);
            }
            
            setResult(error.response?.data);
        } finally {
            console.log('Importation terminée');
            setImporting(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Importation d'employés via Excel</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <input 
                    type="file" 
                    accept=".xlsx,.xls,.csv" 
                    onChange={handleFileChange}
                    style={{ marginRight: '10px' }}
                />
                <button 
                    onClick={handleImport} 
                    disabled={importing || !file}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: importing ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: importing ? 'not-allowed' : 'pointer'
                    }}
                >
                    {importing ? 'Importation en cours...' : 'Importer'}
                </button>
            </div>

            {result && (
                <div style={{
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: result.status >= 400 ? '#ffe6e6' : '#e6ffe6'
                }}>
                    <h3>Résultat de l'importation</h3>
                    <p><strong>Statut:</strong> {result.status}</p>
                    <p><strong>Message:</strong> {result.message}</p>
                    
                    {result.data && (
                        <>
                            <p><strong>Total lignes:</strong> {result.data.total_rows}</p>
                            <p><strong>Importations réussies:</strong> {result.data.successful_imports}</p>
                            <p><strong>Importations échouées:</strong> {result.data.failed_imports}</p>
                            
                            {result.data.errors && result.data.errors.length > 0 && (
                                <div>
                                    <h4>Erreurs détaillées:</h4>
                                    {result.data.errors.map((error, index) => (
                                        <div key={index} style={{ 
                                            marginBottom: '10px', 
                                            padding: '10px', 
                                            backgroundColor: '#fff3cd',
                                            border: '1px solid #ffeaa7',
                                            borderRadius: '4px'
                                        }}>
                                            <strong>Ligne {error.row}:</strong><br/>
                                            {error.errors ? (
                                                <ul>
                                                    {error.errors.map((err, i) => (
                                                        <li key={i}>{err}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span>{error.error}</span>
                                            )}
                                            {error.data && (
                                                <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                                                    Données: {JSON.stringify(error.data)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    
                    {!result.data && result.error && (
                        <p><strong>Erreur:</strong> {result.error}</p>
                    )}
                </div>
            )}

            {/* Section de débogage pour les développeurs */}
            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                <h4>Informations de débogage:</h4>
                <p>URL de l'API: /etp/employes/import-excel</p>
                <p>Token présent: {localStorage.getItem('auth_token') ? 'Oui' : 'Non'}</p>
                <p>Fichier sélectionné: {file ? file.name : 'Aucun'}</p>
                <button 
                    onClick={() => console.log('État complet:', { file, importing, result })}
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                >
                    Voir l'état complet dans la console
                </button>
            </div>
        </div>
    );
};

export default ExcelImport;