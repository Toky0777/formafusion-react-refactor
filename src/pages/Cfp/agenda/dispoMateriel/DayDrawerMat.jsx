import { useState, useEffect } from 'react';
import { X, MapPin, Users, Package } from 'lucide-react';
import axios from '../../../../config/axios';
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";

export function DayDrawerMat({ isOpen, onClose, selectedDate }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  // Convertir selectedDate en Date et ajouter 1 jour
const nextDay = new Date(selectedDate);
nextDay.setDate(nextDay.getDate() + 1);
const formattedNextDay = nextDay.toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen && selectedDate) {
      loadSessions();
    } else {
      // Reset quand fermé
      setSessions([]);
      setError(null);
    }
  }, [isOpen, selectedDate]);

  async function loadSessions() {
    if (!selectedDate) return;

    try {
      setLoading(true);
      setError(null);

      const sessionsResponse = await axios.get(`/cfp/dispo_materiel/sessionmaterielUneDate?sessionDate=${formattedNextDay}`);
      
      // Vérification sécurisée des données
      if (!sessionsResponse.data || !sessionsResponse.data.success) {
        throw new Error(sessionsResponse.data?.message || 'Erreur lors du chargement des données');
      }

      const sessionsData = sessionsResponse.data.seances;
      console.log('Données brutes:', sessionsData);

      // Vérification que sessionsData est un tableau
      if (!Array.isArray(sessionsData)) {
        console.warn('sessionsData n\'est pas un tableau:', sessionsData);
        setSessions([]);
        return;
      }

      // Transformer les données pour correspondre à la nouvelle structure
      const formattedSessions = sessionsData.map(sessionGroup => {
        // Vérification que sessionGroup a la structure attendue
        if (!sessionGroup || typeof sessionGroup !== 'object') {
          console.warn('sessionGroup invalide:', sessionGroup);
          return null;
        }

        const seanceInfo = sessionGroup.seance_info || {};
        const materiels = sessionGroup.materiels || [];

        return {
          id: seanceInfo.idSeance || `session-${Math.random()}`,
          date: seanceInfo.dateSeance,
          start_time: seanceInfo.heureDebut,
          end_time: seanceInfo.heureFin,
          title: seanceInfo.module_name || 'Titre non spécifié',
          description: seanceInfo.etp_name ? `Formation pour ${seanceInfo.etp_name}` : 'Formation',
          status: seanceInfo.project_status || 'Inconnu',
          location: seanceInfo.ville && seanceInfo.salle_quartier 
            ? `${seanceInfo.ville} - ${seanceInfo.salle_quartier}`
            : 'Lieu non spécifié',
          project_title: seanceInfo.project_title,
          duration_minutes: seanceInfo.duration_minutes,
          // Tous les matériels sous forme de tableau (toujours un tableau même si vide)
          materiels: Array.isArray(materiels) ? materiels.map(materiel => ({
            name: materiel.materiel_name || 'Matériel non nommé',
            quantity: materiel.material_number || 0,
            stock: materiel.material_stock,
            type: materiel.material_types
          })) : [],
          // Garder les données originales au cas où
          rawData: sessionGroup
        };
      }).filter(session => session !== null); // Filtrer les sessions nulles

      console.log('Sessions formatées:', formattedSessions);
      setSessions(formattedSessions);

    } catch (error) {
      console.error('Error loading sessions:', error);
      setError(error.response?.data?.message || error.message || 'Erreur de chargement');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  // Fonction pour formater l'heure de manière sécurisée
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    if (typeof timeString === 'string' && timeString.includes(':')) {
      return timeString.substring(0, 5);
    }
    return timeString;
  };

  // Fonction pour formater la durée
  const formatDuration = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h${mins > 0 ? `${mins}min` : ''}`;
    }
    return `${mins}min`;
  };

  if (!isOpen || !selectedDate) return null;

  const statusColors = {
    'Planifié': 'bg-blue-100 text-blue-700 border-blue-300',
    'En cours': 'bg-green-100 text-green-700 border-green-300',
    'Terminé': 'bg-gray-100 text-gray-700 border-gray-300',
    'Annulé': 'bg-red-100 text-red-700 border-red-300',
    'En préparation': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Cloturé': 'bg-purple-100 text-purple-700 border-purple-300',
    'Archivé': 'bg-indigo-100 text-indigo-700 border-indigo-300',
    'Inconnu': 'bg-gray-100 text-gray-700 border-gray-300'
  };

  const getStatusColor = (status) => {
    return statusColors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const formattedDate = new Date(formattedNextDay + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Calcul du total des matériels
  const totalMateriels = sessions.reduce((total, session) => {
    return total + (Array.isArray(session.materiels) ? session.materiels.length : 0);
  }, 0);

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[550px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3 text-white">
            <Package className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Matériels par séance</h2>
              <p className="text-sm text-blue-100 capitalize">{formattedDate}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error ? (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium">Erreur de chargement</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button
                  onClick={loadSessions}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Aucune session programmée</p>
              <p className="text-slate-400 text-sm mt-2">Il n'y a pas de formation prévue pour cette date</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <Card
                  key={session.id}
                  className="p-4 hover:shadow-md transition-all duration-300 border-border bg-card"
                >
                  <div className="flex items-start gap-4">
                    {/* Colonne horaire */}
                    <div className="flex flex-col items-center min-w-[70px] bg-slate-50 rounded-lg p-2">
                      <div className="text-sm font-semibold text-primary">
                        {formatTime(session.start_time)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(session.end_time)}
                      </div>
                      {session.duration_minutes && (
                        <div className="text-xs text-slate-500 mt-1">
                          {formatDuration(session.duration_minutes)}
                        </div>
                      )}
                    </div>

                    {/* Contenu principal */}
                    <div className="flex-1 min-w-0">
                      {/* En-tête avec titre et statut */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-card-foreground truncate">
                            {session.title}
                          </h3>
                          {session.project_title && (
                            <p className="text-sm text-muted-foreground truncate">
                              {session.project_title}
                            </p>
                          )}
                        </div>
                        <Badge className={getStatusColor(session.status)} variant="outline">
                          {session.status}
                        </Badge>
                      </div>

                      {/* Informations de localisation et entreprise */}
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {session.location}
                        </span>
                        {session.description && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {session.description}
                          </span>
                        )}
                      </div>

                      {/* Liste des matériels */}
                      <div className="border-t pt-3">
                        <div className="flex items-center gap-1 mb-2">
                          <Package className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">Matériels utilisés :</span>
                        </div>
                        
                        {!session.materiels || session.materiels.length === 0 ? (
                          <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-500">
                            Aucun matériel associés
                          </Badge>
                        ) : (
                          <div className="space-y-2">
                            {session.materiels.map((materiel, index) => (
                              <div key={index} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-slate-800">
                                    {materiel.name}
                                  </div>
                                  {materiel.type && (
                                    <div className="text-xs text-slate-500">
                                      {materiel.type}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-sm text-blue-600">
                                    {materiel.quantity} unité{materiel.quantity > 1 ? 's' : ''}
                                  </div>
                                  {materiel.stock && (
                                    <div className="text-xs text-slate-400">
                                      Stock: {materiel.stock}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pied de page avec statistiques */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          {!loading && !error && sessions.length > 0 && (
            <div className="flex justify-between items-center mb-3 text-sm text-slate-600">
              <span>{sessions.length} séance{sessions.length > 1 ? 's' : ''}</span>
              <span>
                {totalMateriels} matériel{totalMateriels > 1 ? 's' : ''}
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  );
}