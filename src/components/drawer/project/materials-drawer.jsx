import { X, Package, Calendar, Layers } from 'lucide-react';

export function MaterialsDrawer({onClose, data}) {
  const materialsData = data.materiel.materials;
  console.log("data matre", materialsData);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Matériels du projet
              </h2>
              <p className="text-sm text-gray-500">
                {materialsData.material_count} matériel{materialsData.material_count > 1 ? 's' : ''} affecté{materialsData.material_count > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Module Info Banner */}
        {materialsData.material_items[0] && (
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                <Layers className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {materialsData.material_items[0].module_name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {materialsData.material_items[0].module_description}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(materialsData.material_items[0].project_start_date)} - {formatDate(materialsData.material_items[0].project_end_date)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Materials List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {materialsData.material_items.map((material) => (
              <div
                key={material.material_id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  {/* Material Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Package className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 capitalize">
                          {material.material_name}
                        </h4>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Quantité utilisée</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {material.number}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Stock disponible</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {material.stock_number}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Stock restant</p>
                        <p className="text-lg font-semibold text-emerald-600">
                          {material.stock_number - material.number}
                        </p>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Ajouté le {formatDateTime(material.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {materialsData.material_items.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                Aucun matériel affecté
              </h3>
              <p className="text-sm text-gray-500">
                Ce projet n'a pas encore de matériels affectés
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold text-gray-900">
                {materialsData.material_items.reduce((sum, m) => sum + m.number, 0)} unités
              </span> utilisées
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
