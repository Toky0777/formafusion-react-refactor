import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Settings, CalendarDays, BookOpen } from 'lucide-react';
import { supabase } from './lib/supabase';
import { CalendarHeatmap } from './CalendarHeatmap';
import { Legend } from './Legend';
import { SettingsModal } from './SettingsModal';
import { HolidayManager } from './HolidayManager';
import { AbsenceManager } from './AbsenceManager';
import { SessionList } from './SessionList';
import { DayDrawer } from './DayDrawer';
import { TrainerStatsTable } from './TrainersStatsTable';
import axios from '../../../../config/axios';
import { HOLIDAYS_API_KEY } from "../../../../config/env";


function LayoutDispForm() {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState(null);
  const [availabilityData, setAvailabilityData] = useState(new Map());
  const [holidays, setHolidays] = useState(new Set());
  const [nonWorkingDays, setNonWorkingDays] = useState(new Set());
  const [absences, setAbsences] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHolidayManager, setShowHolidayManager] = useState(false);
  const [showAbsenceManager, setShowAbsenceManager] = useState(false);
  const [showSessionList, setShowSessionList] = useState(false);
  const [showDayDrawer, setShowDayDrawer] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [country, setCountry] = useState("mg");
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadTrainers();

    loadWorkingDaysPolicy();
  }, []);

  const loadHolidays = async () => {
    const apiKey = HOLIDAYS_API_KEY;
    try {
      const response = await axios.get(
        `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}`,
        {

          withCredentials: false,
        }
      );
      //console.log(response)
      const holidaysArray = response.data.response.holidays.map(
        h => h.date?.iso // Exemple: "2025-01-01"
      );

      const holidaysSet = new Set(holidaysArray);

      // 3. Mettre à jour l'état avec le Set
      setHolidays(holidaysSet);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des jours fériés :", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    loadHolidays();
  }, [country, year]);

  useEffect(() => {
    loadAvailabilityData();
    loadAbsences();
  }, [selectedTrainerId]);

  async function loadTrainers() {
    try {
      const result = await axios.get(`/cfp/formateurs`);
      
      const FormateurFiltered = result.data.formateurs.filter(item =>item.cfp_is_active === 1  );

      setTrainers(FormateurFiltered || []);
    } catch (error) {
      console.error('Error loading trainers:', error);
    }
  }

//console.log(trainers);

  async function loadWorkingDaysPolicy() {
    try {
      const response = await axios.get("/cfp/dispoForm/working_days_policy");
      const data = response.data;
    
      if (data) {
        const nonWorking = new Set();
        if (!data.sunday) nonWorking.add(0);
        if (!data.monday) nonWorking.add(1);
        if (!data.tuesday) nonWorking.add(2);
        if (!data.wednesday) nonWorking.add(3);
        if (!data.thursday) nonWorking.add(4);
        if (!data.friday) nonWorking.add(5);
        if (!data.saturday) nonWorking.add(6);
        setNonWorkingDays(nonWorking);
      }
    } catch (error) {
      console.error('Error loading working days policy:', error);
    }
  }


  //console.log(nonWorkingDays);

  async function loadAbsences() {
    if (!selectedTrainerId) {
      setAbsences(new Set());
      return;
    }

    try {
      const { data, error } = await supabase
        .from('trainer_absences')
        .select('start_date, end_date')
        .eq('trainer_id', selectedTrainerId);

      if (error) throw error;

      const absenceSet = new Set();
      data?.forEach(absence => {
        const start = new Date(absence.start_date + 'T00:00:00');
        const end = new Date(absence.end_date + 'T00:00:00');
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          absenceSet.add(d.toISOString().split('T')[0]);
        }
      });

      setAbsences(absenceSet);
    } catch (error) {
      console.error('Error loading absences:', error);
    }
  }

  async function loadAvailabilityData() {
    try {
      setLoading(true);

      const params = {
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
        trainer_id: selectedTrainerId || 'null'
      };

      const response = await axios.get('/cfp/dispoForm/dayAvailabilityFormateur', { params });
      const data = response.data.dailyAvailability;

      const dataMap = new Map();
      data?.forEach(item => {
        dataMap.set(item.date, item.utilization_percentage);
      });

      setAvailabilityData(dataMap);
    } catch (error) {
      console.error('Error loading availability data:', error);
    } finally {
      setLoading(false);
    }
  }

  //console.log(availabilityData);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <CalendarIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-800">
              Calendrier de Disponibilité des Formateurs
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-sm text-slate-600 ml-auto">
                Année: <span className="font-semibold text-slate-800">{year}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowSessionList(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Toutes les sessions
              </button>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Jours travaillés
              </button>
              <button
                onClick={() => setShowHolidayManager(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <CalendarDays className="w-4 h-4" />
                Jours fériés
              </button>
              {/* <button
                onClick={() => setShowAbsenceManager(true)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
              >
                <UserX className="w-4 h-4" />
                Absences
              </button> */}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto py-6">
        <div className="px-6 mb-6">
          <Legend />
        </div>

        <div className="flex flex-col xl:flex-row gap-6 px-6">
          <div className="xl:w-96 flex-shrink-0">
            <TrainerStatsTable />
          </div>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-slate-600">Chargement des données...</p>
                </div>
              </div>
            ) : (
              <CalendarHeatmap
                year={year}
                data={availabilityData}
                holidays={holidays}
                nonWorkingDays={nonWorkingDays}
                absences={absences}
                onDayClick={(date) => {
                  setSelectedDate(date);
                  setShowDayDrawer(true);
                }}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-sm text-slate-500 text-center">
            Système de gestion de formation professionnelle - {year}
          </p>
        </div>
      </footer>

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false);
          loadWorkingDaysPolicy();
        }}
      />
      <HolidayManager
        isOpen={showHolidayManager}
        onClose={() => {
          setShowHolidayManager(false);
          loadHolidays();
        }}
        holidays={holidays}
        loadHolidays={loadHolidays}
      />
      <AbsenceManager
        isOpen={showAbsenceManager}
        onClose={() => {
          setShowAbsenceManager(false);
          loadAbsences();
        }}
      />
      <SessionList
        isOpen={showSessionList}
        onClose={() => setShowSessionList(false)}
      />
      <DayDrawer
        isOpen={showDayDrawer}
        onClose={() => {
          setShowDayDrawer(false);
          setSelectedDate(null);
        }}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default LayoutDispForm;