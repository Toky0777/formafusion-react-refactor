import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from '../../../../config/axios';

export function SettingsModal({ isOpen, onClose }) {
  const [policy, setPolicy] = useState({
    id: '',
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
    created_at: '',
    updated_at: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPolicy();
    }
  }, [isOpen]);

  async function loadPolicy() {
    try {
      setLoading(true);
      const response = await axios.get("/cfp/dispoForm/working_days_policy");
      const data = response.data;
     
      if (data) {
        setPolicy(data);
      }
    } catch (error) {
      console.error('Error loading policy:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      console.log('Saving policy:', policy);
      
      // Vérifier si c'est une création ou mise à jour
      if (policy.id) {
        // Mise à jour
        await axios.put(`/cfp/dispoForm/working_days_policy/${policy.id}`, {
          monday: policy.monday,
          tuesday: policy.tuesday,
          wednesday: policy.wednesday,
          thursday: policy.thursday,
          friday: policy.friday,
          saturday: policy.saturday,
          sunday: policy.sunday,
          updated_at: new Date().toISOString()
        });
      } else {
        // Création
        await axios.post("/cfp/dispoForm/working_days_policy", {
          monday: policy.monday,
          tuesday: policy.tuesday,
          wednesday: policy.wednesday,
          thursday: policy.thursday,
          friday: policy.friday,
          saturday: policy.saturday,
          sunday: policy.sunday
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving policy:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  const handleDayToggle = (day) => {
    setPolicy(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  if (!isOpen) return null;

  const days = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Jours Travaillés</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 mb-4">
                Sélectionnez les jours où le centre de formation est ouvert
              </p>
              {days.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={policy[key] || false}
                    onChange={() => handleDayToggle(key)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium">{label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}