
export function BonCommandePagination({ pagination, onPageChange }) {
    const { current_page, last_page, total, from, to } = pagination;

    if (last_page <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (last_page <= maxVisiblePages) {
            // Afficher toutes les pages
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            // Logique pour les pages visibles avec ellipsis
            if (current_page <= 3) {
                pages.push(1, 2, 3, 4, 5);
                if (last_page > 5) {
                    pages.push('ellipsis', last_page);
                }
            } else if (current_page >= last_page - 2) {
                pages.push(1, 'ellipsis');
                for (let i = last_page - 4; i <= last_page; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1, 'ellipsis');
                for (let i = current_page - 1; i <= current_page + 1; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis', last_page);
            }
        }

        return pages.map((pageNum, index) => {
            if (pageNum === 'ellipsis') {
                return (
                    <span key={`ellipsis-${index}`} className="px-2 py-2 text-sm text-gray-500">
                        ...
                    </span>
                );
            }

            return (
                <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${current_page === pageNum
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {pageNum}
                </button>
            );
        });
    };

    return (
        <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
                Affichage de {from || 0} à {to || 0} sur {total} résultats
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, current_page - 1))}
                    disabled={current_page === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 disabled:cursor-not-allowed"
                >
                    Précédent
                </button>

                <div className="flex gap-1">
                    {renderPageNumbers()}
                </div>

                <button
                    onClick={() => onPageChange(Math.min(last_page, current_page + 1))}
                    disabled={current_page === last_page}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 disabled:cursor-not-allowed"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}