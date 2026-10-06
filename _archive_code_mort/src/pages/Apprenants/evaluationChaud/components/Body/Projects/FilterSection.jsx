import { useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

const FilterSection = () => {
    const [activeFilters, setActiveFilters] = useState({})
    const [searchTerms, setSearchTerms] = useState({})

    const filterOptions = [
        {
            id: 'entreprise',
            label: 'Entreprise',
            hasSearch: true,
            items: [
                { id: '1761', label: '2ACF', count: 1 }
            ]
        },
        {
            id: 'type',
            label: 'Type de projet',
            hasSearch: false,
            items: [
                { id: 'Inter', label: 'Inter', count: 53 },
                { id: 'Intra', label: 'Intra', count: 204 }
            ]
        },
        {
            id: 'periode',
            label: 'Période de formation',
            hasSearch: false,
            isRadio: true,
            items: [
                { id: 'prev_3_month', label: '3 derniers mois', count: 59 },
                { id: 'prev_6_month', label: '6 derniers mois', count: 102 },
                { id: 'prev_12_month', label: '12 derniers mois', count: 194 },
                { id: 'next_3_month', label: '3 prochains mois', count: 27 },
                { id: 'next_6_month', label: '6 prochains mois', count: 55 },
                { id: 'next_12_month', label: '12 prochains mois', count: 55 }
            ]
        },
        {
            id: 'cours',
            label: 'Cours',
            hasSearch: true,
            items: [
                { id: '1318', label: 'Access initiation', count: 1 }
            ]
        },
        {
            id: 'ville',
            label: 'Ville',
            hasSearch: true,
            items: [
                { id: '3', label: 'Ambalavao', count: 1 }
            ]
        },
        {
            id: 'financement',
            label: 'Type de financement',
            hasSearch: false,
            items: [
                { id: '3', label: 'Autres', count: 137 }
            ]
        },
        {
            id: 'formateur',
            label: 'Formateur',
            hasSearch: true,
            items: [
                { id: '22', label: 'El Fayad Said Oumari', count: 68 }
            ]
        },
        {
            id: 'mois',
            label: 'Mois',
            hasSearch: true,
            items: [
                { id: '6', label: 'June, 2024', count: 6 }
            ]
        }
    ]

    const toggleFilter = (filterId) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterId]: !prev[filterId]
        }))
    }

    const handleSearch = (filterId, value) => {
        setSearchTerms(prev => ({
            ...prev,
            [filterId]: value
        }))
    }

    return (
        <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtres avancés</h3>
                <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                    Réinitialiser tous les filtres
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {filterOptions.map((filter) => (
                    <FilterDropdown
                        key={filter.id}
                        filter={filter}
                        isActive={activeFilters[filter.id]}
                        onToggle={() => toggleFilter(filter.id)}
                        searchTerm={searchTerms[filter.id] || ''}
                        onSearch={(value) => handleSearch(filter.id, value)}
                    />
                ))}
            </div>
        </div>
    )
}

const FilterDropdown = ({ filter, isActive, onToggle, searchTerm, onSearch }) => {
    const filteredItems = filter.items.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 ${
                    isActive
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
            >
                <span className="font-medium">{filter.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
            </button>

            {isActive && (
                <div className="absolute left-0 right-0 z-10 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg top-full max-h-80">
                    <div className="p-4 border-b border-gray-200">
                        <h5 className="mb-3 font-semibold text-gray-900">{filter.label}</h5>
                        
                        {filter.hasSearch && (
                            <div className="relative">
                                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => onSearch(e.target.value)}
                                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                        )}
                    </div>

                    <div className="p-2 overflow-y-auto max-h-60">
                        {filteredItems.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-50 group"
                            >
                                <div className="flex items-center">
                                    <input
                                        type={filter.isRadio ? 'radio' : 'checkbox'}
                                        name={filter.isRadio ? `${filter.id}_radio` : undefined}
                                        value={item.id}
                                        className={`mr-3 ${
                                            filter.isRadio
                                                ? 'text-purple-600 focus:ring-purple-500'
                                                : 'text-purple-600 focus:ring-purple-500'
                                        }`}
                                    />
                                    <span className="text-gray-700 group-hover:text-gray-900">
                                        {item.label}
                                    </span>
                                </div>
                                <span className="px-2 py-1 text-sm text-gray-500 bg-gray-100 rounded-full">
                                    {item.count}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default FilterSection