import { CheckCircle, AlertTriangle, Building } from 'lucide-react';
import { useFilter } from '../../contexts/etp/FilterContext';

const FilterSection = () => {
  const { 
    filters, 
    applyFilters, 
    availableCompanies, 
    userType 
  } = useFilter();

  const handleCompanyFilter = (companyId) => {
    const currentCompanies = filters.companies || [];
    const newCompanies = currentCompanies.includes(companyId)
      ? currentCompanies.filter(id => id !== companyId)
      : [...currentCompanies, companyId];
    
    applyFilters({ companies: newCompanies });
  };

  const handleInfoStatusFilter = (status) => {
    applyFilters({ infoStatus: status });
  };

  const handleActiveStatusFilter = (status) => {
    applyFilters({ activeStatus: status });
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtres avancés</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Filtre par entreprise (seulement pour les groupes) */}
        {userType === 'groupe' && availableCompanies.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-1" />
              Entreprises
            </label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {availableCompanies.map((company) => (
                <label key={company.id} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={filters.companies?.includes(company.id) || false}
                    onChange={() => handleCompanyFilter(company.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {company.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Filtre par statut d'information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut des informations
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleInfoStatusFilter('all')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${filters.infoStatus === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              Tous
            </button>
            <button
              onClick={() => handleInfoStatusFilter('complete')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-1 ${filters.infoStatus === 'complete' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              <CheckCircle className="w-4 h-4" />
              Complet
            </button>
            <button
              onClick={() => handleInfoStatusFilter('incomplete')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-1 ${filters.infoStatus === 'incomplete' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              <AlertTriangle className="w-4 h-4" />
              Incomplet
            </button>
          </div>
        </div>

        {/* Filtre par statut actif/inactif */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut employé
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleActiveStatusFilter('all')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${filters.activeStatus === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              Tous
            </button>
            <button
              onClick={() => handleActiveStatusFilter('active')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${filters.activeStatus === 'active' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              Actifs
            </button>
            <button
              onClick={() => handleActiveStatusFilter('inactive')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${filters.activeStatus === 'inactive' ? 'bg-gray-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              Inactifs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;