import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, BookOpen } from 'lucide-react';
import axios from '../../../../config/axios';

export function DayDrawer({ isOpen, onClose, selectedDate }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
 // Convertir selectedDate en Date et ajouter 1 jour
const nextDay = new Date(selectedDate);
nextDay.setDate(nextDay.getDate() + 1);
const formattedNextDay = nextDay.toISOString().split('T')[0];
  useEffect(() => {
    if (isOpen && selectedDate) {
      loadSessions();
    }
  }, [isOpen, selectedDate]);

  async function loadSessions() {
    if (!selectedDate) return;

    try {
      setLoading(true);

      const sessionsResponse = await axios.get(`/cfp/dispoForm/sessionFormateurUneDate?sessionDate=${formattedNextDay}`);
      const sessionsData = sessionsResponse.data.seances;

      // Transformer les données pour correspondre à votre interface
      const formattedSessions = sessionsData?.map(session => ({
        id: session.idSeance,
        date: session.dateSeance,
        start_time: session.heureDebut,
        end_time: session.heureFin,
        title: session.module_name,
        description: `Formation pour ${session.etp_name}`,
        status: session.status, 
        location: `${session.ville} - ${session.salle_quartier}`,
        participants_count: session.nb_apprenants,
        trainer: {
          id: session.idFormateur,
          name: `${session.formateur_prenom} ${session.formateur_nom}`,
          phone: session.formateur_phone
        },
        // Garder les données originales au cas où
        rawData: session
      })) || [];

      setSessions(formattedSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  // Fonction pour formater l'heure de manière sécurisée
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    // Convertir "09:00:00" en "09:00"
    if (typeof timeString === 'string' && timeString.includes(':')) {
      return timeString.substring(0, 5);
    }
    return timeString;
  };

  //console.log('Sessions data:', sessions);

  if (!isOpen || !selectedDate) return null;

  const statusColors = {
    'planifié': 'bg-blue-100 text-blue-700 border-blue-300',
    'en cours': 'bg-green-100 text-green-700 border-green-300',
    'terminé': 'bg-gray-100 text-gray-700 border-gray-300',
    'annulé': 'bg-red-100 text-red-700 border-red-300'
  };

  const formattedDate = new Date(formattedNextDay + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3 text-white">
            <Calendar className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Sessions du jour</h2>
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
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Aucune session programmée</p>
              <p className="text-slate-400 text-sm mt-2">Il n'y a pas de formation prévue pour cette date</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-700">
                  {sessions.length} session{sessions.length > 1 ? 's' : ''}
                </span>
              </div>

              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-lg border-2 ${statusColors[session.status]} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-slate-800 text-base flex-1 pr-2">
                      {session.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[session.status] || 'bg-gray-100 text-gray-700'}`}>
                      {session.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                    {session.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="font-medium">
                        {session.trainer.name}
                        {session.trainer.phone && (
                          <span className="text-slate-500 text-xs ml-2">
                            {session.trainer.phone}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span>{formatTime(session.start_time)} - {formatTime(session.end_time)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>{session.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="w-4 h-4 text-slate-500" />
                      <span>{session.participants_count} participant{session.participants_count > 1 ? 's' : ''} inscrit{session.participants_count > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
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