
export function InvitationFilter({ 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  onResetFilters, 
  statusInvitations = {} 
}) {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onApplyFilters) {
      onApplyFilters();
    }
  };

  const handleInputChange = (field, value) => {
    if (onFilterChange) {
      onFilterChange(field, value);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="p-6 mb-6 bg-white rounded-lg shadow-md"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Invitation Status */}
        <div>
          <label 
            className="block mb-2 text-sm font-bold text-gray-700" 
            htmlFor="state"
          >
            Status
          </label>
          <select 
            name="state" 
            id="state" 
            value={filters?.state || ''}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            {Object.entries(statusInvitations).map(([statut, label]) => (
              <option key={statut} value={statut}>
                {label || statut}
              </option>
            ))}
          </select>
        </div>
        
        {/* Opening Date */}
        <div>
          <label 
            className="block mb-2 text-sm font-bold text-gray-700" 
            htmlFor="opening_date"
          >
            Date d'ouverture
          </label>
          <input 
            type="date" 
            name="opening_date" 
            id="opening_date" 
            value={filters?.opening_date || ''}
            onChange={(e) => handleInputChange('opening_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        {/* Close Date */}
        <div>
          <label 
            className="block mb-2 text-sm font-bold text-gray-700" 
            htmlFor="close_date"
          >
            Date de fermeture
          </label>
          <input 
            type="date" 
            name="close_date" 
            id="close_date" 
            value={filters?.close_date || ''}
            onChange={(e) => handleInputChange('close_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <button 
            type="submit" 
            className="px-4 py-2 font-bold text-white transition duration-200 bg-purple-600 rounded-md hover:bg-purple-700"
          >
            Filtrer
          </button>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 font-medium text-gray-800 transition duration-200 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </form>
  );
}