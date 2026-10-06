// components/ui/ResponsivePagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

export const ResponsivePagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    itemsPerPage,
    onItemsPerPageChange,
    totalItems,
    className = "" 
}) => {
    console.log("🔢 Pagination Debug:", { currentPage, totalPages, totalItems });

    // Si une seule page, ne pas afficher la pagination
    if (totalPages <= 1) {
        console.log("ℹ️ Une seule page, pagination cachée");
        return null;
    }

    const getVisiblePages = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 3) {
            return [1, 2, 3, 4, '...', totalPages];
        }

        if (currentPage >= totalPages - 2) {
            return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
            
            {/* Section gauche - Items par page et informations */}
            <div className="flex items-center gap-4">
                {/* Sélection du nombre d'éléments par page */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 whitespace-nowrap">
                        Projets par page:
                    </span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                {/* Informations de pagination */}
                <div className="hidden md:flex items-center space-x-2">
                    <span className="text-sm text-gray-700">
                        Page <span className="font-semibold text-gray-900">{currentPage}</span> sur <span className="font-semibold text-gray-900">{totalPages}</span>
                    </span>
                </div>
            </div>

            {/* Section centrale - Contrôles de pagination */}
            <div className="flex items-center space-x-2">
                {/* Première page */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                    title="Première page"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Page précédente */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                    title="Page précédente"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Pages numérotées */}
                <div className="flex items-center space-x-1">
                    {visiblePages.map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' && onPageChange(page)}
                            disabled={page === '...'}
                            className={`min-w-[40px] h-10 px-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                page === currentPage
                                    ? 'bg-blue-600 text-white border border-blue-600 shadow-sm'
                                    : page === '...'
                                    ? 'text-gray-400 cursor-default bg-transparent border-transparent'
                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                            }`}
                        >
                            {page === '...' ? <MoreHorizontal className="w-4 h-4 mx-auto" /> : page}
                        </button>
                    ))}
                </div>

                {/* Page suivante */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                    title="Page suivante"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Dernière page */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                    title="Dernière page"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            </div>

            {/* Section droite - Informations supplémentaires */}
            <div className="flex items-center space-x-4">
                {/* Informations mobiles */}
                <div className="flex md:hidden items-center space-x-2">
                    <span className="text-sm text-gray-700">
                        {currentPage}/{totalPages}
                    </span>
                </div>

                {/* Total des éléments */}
                <div className="hidden lg:flex items-center">
                    <span className="text-sm text-gray-700 whitespace-nowrap">
                        {totalItems.toLocaleString()} projet{totalItems !== 1 ? 's' : ''} au total
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ResponsivePagination;