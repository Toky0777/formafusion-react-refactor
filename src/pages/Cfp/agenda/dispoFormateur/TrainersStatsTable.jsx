import { useState, useEffect } from 'react';
import { TrendingDown, Users, Clock } from 'lucide-react';
import axios from '../../../../config/axios';

export function TrainerStatsTable() {
  const [stats, setStats] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [workingDay, setWorkingDay] = useState({});
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  // recuperation des formateurs
  const loadTrainers = async () => {
    try {
      const response = await axios.get(`/cfp/formateurs`);
     // //console.log("API Response - trainers:", response.data);
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
     // //console.log("API Response - sessions:", response.data);
      setSessions(response.data.seances || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }

  // recuperation de working day
  const loadWorkingDay = async () => {
    const params = {
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
    };
    try {
      const response = await axios.get("/cfp/dispoForm/working_days_policy");
     // //console.log("API Response - workingDay:", response.data);
      setWorkingDay(response.data || {});
    } catch (error) {
      console.error('Error loading working day:', error);
    }
  }

  async function loadStats() {
    try {
    

      const absences = [];
      const workingDaysPolicy = workingDay.data || workingDay;

      let workingDaysPerWeek = 5;
      if (workingDaysPolicy && typeof workingDaysPolicy === 'object') {
        workingDaysPerWeek = [
          workingDaysPolicy.monday,
          workingDaysPolicy.tuesday,
          workingDaysPolicy.wednesday,
          workingDaysPolicy.thursday,
          workingDaysPolicy.friday,
          workingDaysPolicy.saturday,
          workingDaysPolicy.sunday
        ].filter(Boolean).length;
      }

      const weeksPerYear = 47;
      const hoursPerDay = 6;
      const maxHoursPerYear = workingDaysPerWeek * weeksPerYear * hoursPerDay;

      const trainerStats = trainers.map(trainer => {
       // //console.log("Processing trainer:", trainer);
        
        const trainerSessions = sessions.filter(s => s.idFormateur === trainer.idFormateur);
       // //console.log(`Trainer ${trainer.name} sessions:`, trainerSessions);

        const hoursWorked = trainerSessions.reduce((total, session) => {
          if (!session.heureDebut || !session.heureFin) {
           // //console.log("Session missing time data:", session);
            return total;
          }
          
          try {
            const [startHour, startMin] = session.heureDebut.split(':').map(Number);
            const [endHour, endMin] = session.heureFin.split(':').map(Number);
            const hours = (endHour * 60 + endMin - (startHour * 60 + startMin)) / 60;
           // //console.log(`Session hours: ${hours} (${session.heureDebut} - ${session.heureFin})`);
            return total + hours;
          } catch (error) {
            console.error('Error calculating hours for session:', session, error);
            return total;
          }
        }, 0);

        const trainerAbsences = absences.filter(a => a.trainer_id === trainer.id);
        const absenceDays = trainerAbsences.reduce((total, absence) => {
          const start = new Date(absence.start_date + 'T00:00:00');
          const end = new Date(absence.end_date + 'T00:00:00');
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          return total + days;
        }, 0);

        const adjustedMaxHours = maxHoursPerYear - (absenceDays * hoursPerDay);
        const occupationRate = adjustedMaxHours > 0 ? (hoursWorked / adjustedMaxHours) * 100 : 0;
        const remainingHours = Math.max(0, adjustedMaxHours - hoursWorked);

       // //console.log(`Trainer ${trainer.name} - hoursWorked: ${hoursWorked}, maxHours: ${adjustedMaxHours}, occupationRate: ${occupationRate}`);

        return {
          trainer,
          hoursWorked: Math.round(hoursWorked),
          maxHours: Math.round(adjustedMaxHours),
          occupationRate,
          remainingHours: Math.round(remainingHours)
        };
      });

      trainerStats.sort((a, b) => a.occupationRate - b.occupationRate);
     // //console.log("Final stats:", trainerStats);
      setStats(trainerStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }

  function getOccupationColor(rate) {
    if (rate < 40) return 'text-green-600';
    if (rate < 60) return 'text-yellow-600';
    if (rate < 80) return 'text-orange-600';
    return 'text-red-600';
  }

  function getOccupationBgColor(rate) {
    if (rate < 40) return 'bg-green-50 border-green-200';
    if (rate < 60) return 'bg-yellow-50 border-yellow-200';
    if (rate < 80) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  }

  // Chargement initial
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        loadTrainers(),
        loadSessions(),
        loadWorkingDay()
      ]);
      setLoading(false);
    };

    initializeData();
  }, [year]);

  // Recharger les stats quand les données changent
  useEffect(() => {
    if (trainers.length > 0 && sessions.length > 0) {
     // //console.log("Data loaded, calculating stats...");
     // //console.log("trainers:", trainers);
     // //console.log("sessions:", sessions);
      loadStats();
    }
  }, [trainers, sessions, workingDay]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
        <div className="flex items-center gap-2 text-white">
          <Users className="w-5 h-5" />
          <h3 className="text-lg font-bold">Tableau d'aide à la décision</h3>
        </div>
        <p className="text-blue-100 text-sm mt-1">Choisissez le formateur le moins occupé</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Formateur
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Heures réalisées
              </th>
             
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {stats.map((stat, index) => (
              <tr
                key={stat.trainer.idFormateur || stat.trainer.id}
                className={`hover:bg-slate-50 transition-colors ${index === 0 ? getOccupationBgColor(stat.occupationRate) + ' border-2' : ''
                  }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    )}
                    <span className="font-medium text-slate-800">
                      {stat.trainer.form_name} {stat.trainer.form_firstname}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="font-medium text-slate-700">{stat.hoursWorked}h</span>
                  </div>
                </td>
                
              </tr>
            ))}
            {stats.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                  Aucune donnée disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>&lt; 40%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-100 rounded"></div>
            <span>40-60%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-100 rounded"></div>
            <span>60-80%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-100 rounded"></div>
            <span>&gt; 80%</span>
          </div>
        </div>
      </div>
    </div>
  );
}