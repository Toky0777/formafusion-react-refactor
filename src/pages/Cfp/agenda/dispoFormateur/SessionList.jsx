import { useState, useEffect } from 'react';
import { X, BookOpen, Calendar, Clock, MapPin, Users, Filter } from 'lucide-react';
import axios from '../../../../config/axios';

export function SessionList({ isOpen, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTrainer, setFilterTrainer] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [sessionWithTrainer, setSessionWithTrainer] = useState([]);


  // Fonction pour formater l'heure de manière sécurisée
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    // Convertir "09:00:00" en "09:00"
    if (typeof timeString === 'string' && timeString.includes(':')) {
      return timeString.substring(0, 5);
    }
    return timeString;
  };

  // Chargement initial
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        loadTrainers(),
        loadSessions(),
      ]);
      setLoading(false);
    };

    initializeData();
  }, [year]);

  // Recharger les données combinées quand les données changent
  useEffect(() => {
    if (trainers.length > 0 && sessions.length > 0) {
      loadData();
    }
  }, [trainers, sessions]);

  // recuperation des formateurs
  const loadTrainers = async () => {
    try {
      const response = await axios.get(`/cfp/formateurs`);
      //console.log("API Response - trainers:", response.data);
      setTrainers(response.data.formateurs.filter(item => item.cfp_is_active === 1) || []);
    } catch (error) {
      console.error('Error loading trainers:', error);
    }
  }

  // recuperation des sessions
  const loadSessions = async () => {
    const params = {
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
    };
    try {
      const response = await axios.get(`/cfp/dispoForm/sessionFormateurDeuxDate`, {
        params
      });
      //console.log("API Response - sessions:", response.data);
      setSessions(response.data.seances || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }

  async function loadData() {
    try {
      //console.log("loadData - sessions:", sessions);
      //console.log("loadData - trainers:", trainers);

      //  Associer chaque session avec son formateur
      const sessionsWithTrainerInfo = sessions.map(session => {
        // Trouver le formateur correspondant à cette session
        const trainer = trainers.find(t => t.idFormateur === session.idFormateur);
        
        return {
          ...session,
          trainer: trainer || null // Ajouter les infos du formateur à la session
        };
      });

      //console.log("Sessions avec formateurs:", sessionsWithTrainerInfo);
      setSessionWithTrainer(sessionsWithTrainerInfo);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  //console.log("sessionWithTrainer:", sessionWithTrainer);
  //console.log("trainer:", trainers);

  
  const filteredSessions = sessionWithTrainer.filter(session => {
    // Filtre par formateur
    const matchTrainer = filterTrainer === '' || 
                        session.idFormateur?.toString() === filterTrainer.toString();
    
    // Filtre par statut
    const matchesStatut = filterStatus === '' || 
                         session.status === filterStatus;

    return matchTrainer && matchesStatut;
  });

  //console.log("Filtered sessions:", filteredSessions);

  if (!isOpen) return null;

  const statusColors = {
    'planifié': 'bg-blue-100 text-blue-700',
    'en cours': 'bg-green-100 text-green-700',
    'terminé': 'bg-gray-100 text-gray-700',
    'annulé': 'bg-red-100 text-red-700'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">Toutes les Sessions de Formation</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 mb-3">
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="font-medium text-slate-700">Filtres</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Formateur
              </label>
              <select
                value={filterTrainer}
                onChange={(e) => setFilterTrainer(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les formateurs</option>
                {trainers.map(trainer => (
                  <option key={trainer.idFormateur} value={trainer.idFormateur}>
                    {trainer.form_firstname || `Formateur ${trainer.idFormateur}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Statut
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="Planifié">Planifié</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="Annulé">Annulé</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {sessionWithTrainer.length === 0 ? 'Aucune session enregistrée' : 'Aucune session ne correspond aux filtres'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-lg">{session.module_name || 'Session sans titre'}</h3>
                      <p className="text-sm text-slate-600 mt-1">{session.description || 'Aucune description'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[session.status] || 'bg-gray-100 text-gray-700'}`}>
                      {session.status || 'Non spécifié'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">
                        {session.formateur_complet ? 
                          `${session.formateur_complet || ''} ${session.formateur_complet || ''}`.trim() : 
                          'Formateur non spécifié'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>
                        {session.dateSeance ? 
                          new Date(session.dateSeance + 'T00:00:00').toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          }) : 
                          'Date non spécifiée'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>
                         <span>{formatTime(session.heureDebut)} - {formatTime(session.heureFin)}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{session.ville || 'Lieu non spécifié'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>{session.nb_apprenants || 0} participants</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="text-sm text-slate-600">
            Total: <span className="font-semibold">{filteredSessions.length}</span> session(s)
            {sessionWithTrainer.length !== filteredSessions.length && ` sur ${sessionWithTrainer.length}`}
          </div>
        </div>
      </div>
    </div>
  );
}