// components/SessionDisplay.jsx
import React from 'react';
import { Calendar, Clock, Edit3, Trash2, RefreshCw, Plus } from 'lucide-react';

// Fonctions utilitaires (à exporter depuis un fichier séparé ou à inclure)
const safeFormatDate = (dateString) => {
  if (!dateString || dateString === 'null' || dateString === 'undefined') 
    return 'Date non définie';
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Date invalide' : 
      date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
  } catch {
    return 'Date invalide';
  }
};

const formatTimeFromString = (timeString) => {
  if (!timeString || timeString === 'null' || timeString === 'undefined') 
    return '--:--';
  
  try {
    const cleanTime = timeString.toString().split('T').pop()?.split('+')[0]?.split('.')[0];
    const [hours, minutes] = cleanTime.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  } catch {
    return '--:--';
  }
};

const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 'Durée invalide';
  
  try {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    
    if (totalMinutes < 0) return 'Durée invalide';
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h${minutes.toString().padStart(2, '0')}` : `${hours}h`;
    }
    return `${minutes}min`;
  } catch {
    return 'Durée invalide';
  }
};

// Fonction pour analyser les données de session
export const getSessionDisplayData = (seance) => {
  const isReported = seance.is_reported === 1 || seance.is_reported === "1";
  const isCatchUp = seance.session_catch_up === 1 || seance.session_catch_up === "1";
  
  const isReportDateValid = seance.report_date && 
                          seance.report_date !== 'null' && 
                          seance.report_date !== 'Invalid Date' &&
                          !isNaN(new Date(seance.report_date).getTime());
  
  const isReportTimeValid = seance.heure_debut_reportee && seance.heure_fin_reportee;
  const isTrulyRescheduled = isReported && isReportDateValid;
  
  return {
    isReported,
    isCatchUp,
    isTrulyRescheduled,
    isReportDateValid,
    isReportTimeValid,
    
    originalDate: seance.dateSeance,
    originalStartTime: seance.heureDebut,
    originalEndTime: seance.heureFin,
    
    reportDate: seance.report_date,
    reportStartTime: seance.heure_debut_reportee,
    reportEndTime: seance.heure_fin_reportee,
    
    displayDate: isTrulyRescheduled ? seance.report_date : seance.dateSeance,
    displayStartTime: isTrulyRescheduled && isReportTimeValid ? seance.heure_debut_reportee : seance.heureDebut,
    displayEndTime: isTrulyRescheduled && isReportTimeValid ? seance.heure_fin_reportee : seance.heureFin,
    
    // Données originales pour référence
    seanceData: seance
  };
};

// Fonction pour regrouper les sessions
export const getGroupedSessions = (seances) => {
  const groups = {};
  
  seances.forEach(seance => {
    const sessionData = getSessionDisplayData(seance);
    
    if (!sessionData.isTrulyRescheduled) {
      // Session normale ou rattrapage
      groups[seance.idSeance] = {
        type: sessionData.isCatchUp ? 'catchup' : 'normal',
        original: seance,
        rescheduled: null,
        displayData: sessionData
      };
    } else {
      // Session replanifiée
      if (!groups[seance.idSeance]) {
        groups[seance.idSeance] = {
          type: 'rescheduled',
          original: null,
          rescheduled: null,
          displayData: sessionData
        };
      }
      
      if (!seance.report_date || seance.report_date === seance.dateSeance) {
        groups[seance.idSeance].original = seance;
      } else {
        groups[seance.idSeance].rescheduled = seance;
      }
    }
  });
  
  return Object.values(groups);
};

// Composant pour une session normale ou rattrapage
const NormalSessionCard = ({ session, index, onEdit, onDelete }) => {
  const { displayData } = session;
  
  return (
    <div className="transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
      <div className="p-6">
        {/* En-tête */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg
              ${displayData.isCatchUp ? 'bg-orange-500' : 'bg-blue-600'}
            `}>
              {index + 1}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {displayData.isCatchUp ? '⏱️ Session de Rattrapage' : '📅 Session Normale'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {safeFormatDate(displayData.displayDate)}
              </p>
              <p className="text-sm text-gray-600">
                {formatTimeFromString(displayData.displayStartTime)} - {formatTimeFromString(displayData.displayEndTime)}
                {' '}({calculateDuration(displayData.displayStartTime, displayData.displayEndTime)})
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(session.original)}
              className="p-2 text-gray-400 transition-colors rounded-lg hover:text-blue-500 hover:bg-blue-50"
              title="Modifier"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(session.original.id)}
              className="p-2 text-gray-400 transition-colors rounded-lg hover:text-red-500 hover:bg-red-50"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Statut */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              displayData.isCatchUp 
                ? 'bg-orange-100 text-orange-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {displayData.isCatchUp ? 'Rattrapage' : 'Normale'}
            </span>
          </div>
          <button
            onClick={() => onEdit(session.original)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Modifier le type
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant pour une session replanifiée
const RescheduledSessionCard = ({ session, index, onEdit, onDelete }) => {
  const { displayData, original, rescheduled } = session;
  
  return (
    <div className="transition-all duration-200 bg-white border shadow-sm border-amber-200 rounded-xl hover:shadow-md">
      <div className="p-6">
        {/* En-tête principale */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white rounded-lg bg-amber-500">
              {index + 1}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                🔄 Session Replanifiée
              </h3>
              <p className="mt-1 text-sm font-medium text-amber-600">
                Reportée du {safeFormatDate(displayData.originalDate)} au {safeFormatDate(displayData.displayDate)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(rescheduled || original)}
              className="p-2 text-gray-400 transition-colors rounded-lg hover:text-blue-500 hover:bg-blue-50"
              title="Modifier"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete((rescheduled || original).id)}
              className="p-2 text-gray-400 transition-colors rounded-lg hover:text-red-500 hover:bg-red-50"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Comparaison côte à côte */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Session originale */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Session Originale</h4>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Date :</span>
                <span className="font-medium text-blue-800">{safeFormatDate(displayData.originalDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Horaire :</span>
                <span className="font-medium text-blue-800">
                  {formatTimeFromString(displayData.originalStartTime)} - {formatTimeFromString(displayData.originalEndTime)}
                </span>
              </div>
              <div className="pt-2 mt-2 border-t border-blue-200">
                <span className="text-xs text-blue-600">⚠️ Annulée/Reportée</span>
              </div>
            </div>
          </div>

          {/* Session replanifiée */}
          <div className="p-4 border rounded-lg border-amber-200 bg-amber-50">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <h4 className="font-semibold text-amber-800">Nouvelle Session</h4>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-700">Date :</span>
                <span className="font-medium text-amber-800">{safeFormatDate(displayData.displayDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-700">Horaire :</span>
                <span className="font-medium text-amber-800">
                  {formatTimeFromString(displayData.displayStartTime)} - {formatTimeFromString(displayData.displayEndTime)}
                </span>
              </div>
              <div className="pt-2 mt-2 border-t border-amber-200">
                <span className="text-xs text-amber-600">✅ Planifiée</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <div>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
              Replanifiée
            </span>
          </div>
          <button
            onClick={() => onEdit(rescheduled || original)}
            className="text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            Modifier le report
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant principal réutilisable
const SessionDisplay = ({ 
  sessions = [], 
  onEditSession, 
  onDeleteSession, 
  onCreateSession,
  emptyMessage = "Aucune session planifiée",
  createButtonText = "Créer une session",
  loading = false
}) => {
  
  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
          <div className="w-8 h-8 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-500">Chargement des sessions...</p>
      </div>
    );
  }

  const groupedSessions = getGroupedSessions(sessions);

  if (groupedSessions.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">{emptyMessage}</h3>
        <p className="mb-6 text-gray-500">Planifiez votre première session</p>
        {onCreateSession && (
          <button
            onClick={onCreateSession}
            className="inline-flex items-center gap-2 px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {createButtonText}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedSessions
        .sort((a, b) => new Date(a.displayData.displayDate) - new Date(b.displayData.displayDate))
        .map((sessionGroup, index) => {
          
          const handleEdit = (seance) => {
            onEditSession?.(seance);
          };
          
          const handleDelete = (seanceId) => {
            onDeleteSession?.(seanceId);
          };

          if (sessionGroup.type === 'rescheduled') {
            return (
              <RescheduledSessionCard
                key={sessionGroup.original?.idSeance || sessionGroup.rescheduled?.idSeance}
                session={sessionGroup}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          } else {
            return (
              <NormalSessionCard
                key={sessionGroup.original.idSeance}
                session={sessionGroup}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          }
        })}
    </div>
  );
};

export default SessionDisplay;