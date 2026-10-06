import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { supabase } from './lib/supabase';
import axios from 'axios';
import { HOLIDAYS_API_KEY } from "../../../../config/env";



export function HolidayManager({ isOpen, onClose }) {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("mg");
  const [year, setYear] = useState(new Date().getFullYear());
  //console.log(`Ma clé API : ${HOLIDAYS_API_KEY}`);

  const [newHoliday, setNewHoliday] = useState({
    date: '',
    name: '',
    is_recurring: false
  });
  const [adding, setAdding] = useState(false);

  const loadHolidays = async () => {
    const apiKey = HOLIDAYS_API_KEY; // ⚠️ CRA utilise process.env
    try {
      const response = await axios.get(
        `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}`
      );
      setHolidays(response.data.response.holidays);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des jours fériés :", error);
      setLoading(false);
    }
  };
  useEffect(() => {

    loadHolidays();
  }, [country, year, isOpen]);
  //console.log(holidays);

  async function handleAdd() {
    if (!newHoliday.date || !newHoliday.name) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      setAdding(true);
      const { error } = await supabase
        .from('holidays')
        .insert([newHoliday]);

      if (error) throw error;

      setNewHoliday({ date: '', name: '', is_recurring: false });
      loadHolidays();
    } catch (error) {
      console.error('Error adding holiday:', error);
      alert('Erreur lors de l\'ajout du jour férié');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce jour férié ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('holidays')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadHolidays();
    } catch (error) {
      console.error('Error deleting holiday:', error);
      alert('Erreur lors de la suppression');
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">Jours Fériés</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-slate-700 mb-4">Ajouter un jour férié</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nom du jour férié
                </label>
                <input
                  type="text"
                  value={newHoliday.name}
                  onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                  placeholder="Ex: Noël"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newHoliday.is_recurring}
                  onChange={(e) => setNewHoliday({ ...newHoliday, is_recurring: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Récurrent chaque année</span>
              </label>
              <button
                onClick={handleAdd}
                disabled={adding}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          </div> */}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : holidays.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Aucun jour férié configuré
            </div>
          ) : (
            <div className="space-y-2">
              {holidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">{holiday.name}</div>
                    <div className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                      <span>{new Date(holiday.date.iso + 'T00:00:00').toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                      {holiday.is_recurring && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Récurrent
                        </span>
                      )}
                    </div>
                  </div>
                  {/* <button
                    onClick={() => handleDelete(holiday.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button> */}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}