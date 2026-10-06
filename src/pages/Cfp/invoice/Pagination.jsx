export function Pagination({
  onPageChange,
  currentPage,
  lastPage,
  totalItems,
}) {
  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage) {
      onPageChange(page);
    }
  };

  // Limiter l'affichage (par ex. max 5 pages visibles)
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className="flex items-center justify-end mt-4"
    >
      <div className="flex items-center gap-1">
        {/* Bouton précédent */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm text-gray-600 bg-white border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>

        {/* Pages */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-2 rounded-md border text-sm transition ${currentPage === page
              ? "text-purple-600 border-purple-600 cursor-default font-semibold"
              : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        {/* Bouton suivant */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="px-3 py-2 text-sm text-gray-600 bg-white border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </div>
    </nav>
  );
}
