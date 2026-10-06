import { useState, useEffect } from 'react';
import { X, Plus, Trash2, UserX, Edit2, Save } from 'lucide-react';
import { supabase } from './lib/supabase';



export function AbsenceManager({ isOpen, onClose }) {
  const [absences, setAbsences] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAbsence, setNewAbsence] = useState({
    trainer_id: '',
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
  trainer_id: "",
  start_date: "",
  end_date: "",
  reason: ""
});


  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  async function loadData() {
    try {
      setLoading(true);

      const [absencesResult, trainersResult] = await Promise.all([
        supabase
          .from('trainer_absences')
          .select('*')
          .order('start_date', { ascending: false }),
        supabase
          .from('trainers')
          .select('*')
          .order('name')
      ]);

      if (absencesResult.error) throw absencesResult.error;
      if (trainersResult.error) throw trainersResult.error;

      const trainersMap = new Map(trainersResult.data?.map(t => [t.id, t]));
      const absencesWithTrainers = absencesResult.data?.map(absence => ({
        ...absence,
        trainer: trainersMap.get(absence.trainer_id)
      })) || [];

      setAbsences(absencesWithTrainers);
      setTrainers(trainersResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!newAbsence.trainer_id || !newAbsence.start_date || !newAbsence.end_date || !newAbsence.reason) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (new Date(newAbsence.end_date) < new Date(newAbsence.start_date)) {
      alert('La date de fin doit être après la date de début');
      return;
    }

    try {
      setAdding(true);
      const { error } = await supabase
        .from('trainer_absences')
        .insert([newAbsence]);

      if (error) throw error;

      setNewAbsence({ trainer_id: '', start_date: '', end_date: '', reason: '' });
      loadData();
    } catch (error) {
      console.error('Error adding absence:', error);
      alert('Erreur lors de l\'ajout de l\'absence');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette absence ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('trainer_absences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error deleting absence:', error);
      alert('Erreur lors de la suppression');
    }
  }

function handleEdit(absence) {
  setEditingId(absence.id);
  setEditData({
    trainer_id: absence.trainer_id,
    start_date: absence.start_date,
    end_date: absence.end_date,
    reason: absence.reason
  });
}


  function handleCancelEdit() {
    setEditingId(null);
    setEditData(null);
  }

  async function handleSaveEdit() {
    if (!editData || !editingId) return;

    if (!editData.trainer_id || !editData.start_date || !editData.end_date || !editData.reason) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (new Date(editData.end_date) < new Date(editData.start_date)) {
      alert('La date de fin doit être après la date de début');
      return;
    }

    try {
      const { error } = await supabase
        .from('trainer_absences')
        .update(editData)
        .eq('id', editingId);

      if (error) throw error;

      setEditingId(null);
      setEditData(null);
      loadData();
    } catch (error) {
      console.error('Error updating absence:', error);
      alert('Erreur lors de la modification');
    }
  }

  if (!isOpen) return null;

  const reasonOptions = [
    'Congé',
    'Congé maladie',
    'Formation',
    'Congé maternité/paternité',
    'Autre'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <UserX className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">Gestion des Absences</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-slate-700 mb-4">Ajouter une absence</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Formateur
                </label>
                <select
                  value={newAbsence.trainer_id}
                  onChange={(e) => setNewAbsence({ ...newAbsence, trainer_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un formateur</option>
                  {trainers.map(trainer => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Raison
                </label>
                <select
                  value={newAbsence.reason}
                  onChange={(e) => setNewAbsence({ ...newAbsence, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une raison</option>
                  {reasonOptions.map(reason => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={newAbsence.start_date}
                  onChange={(e) => setNewAbsence({ ...newAbsence, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={newAbsence.end_date}
                  onChange={(e) => setNewAbsence({ ...newAbsence, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAdd}
                disabled={adding}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : absences.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Aucune absence enregistrée
            </div>
          ) : (
            <div className="space-y-2">
              {absences.map((absence) => {
                const isEditing = editingId === absence.id;

                if (isEditing && editData) {
                  return (
                    <div
                      key={absence.id}
                      className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Formateur
                          </label>
                          <select
                            value={editData.trainer_id}
                            onChange={(e) => setEditData({ ...editData, trainer_id: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {trainers.map(trainer => (
                              <option key={trainer.id} value={trainer.id}>
                                {trainer.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Raison
                          </label>
                          <select
                            value={editData.reason}
                            onChange={(e) => setEditData({ ...editData, reason: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {reasonOptions.map(reason => (
                              <option key={reason} value={reason}>
                                {reason}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Date de début
                          </label>
                          <input
                            type="date"
                            value={editData.start_date}
                            onChange={(e) => setEditData({ ...editData, start_date: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Date de fin
                          </label>
                          <input
                            type="date"
                            value={editData.end_date}
                            onChange={(e) => setEditData({ ...editData, end_date: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={absence.id}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">
                        {absence.trainer?.name || 'Formateur inconnu'}
                      </div>
                      <div className="text-sm text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                        <span>
                          Du {new Date(absence.start_date + 'T00:00:00').toLocaleDateString('fr-FR')}
                          {' '}au {new Date(absence.end_date + 'T00:00:00').toLocaleDateString('fr-FR')}
                        </span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                          {absence.reason}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(absence)}
                        className="text-blue-500 hover:text-blue-700 transition-colors p-2"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(absence.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
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