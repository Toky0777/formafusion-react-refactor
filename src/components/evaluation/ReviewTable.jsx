import { useState } from 'react';
import StarRating from './StarRating';

const ReviewTable = ({ reviews }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReviews = reviews.filter(review =>
    review.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Table Controls */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">
            Afficher
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="mx-2 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            entrées par page
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 w-[30%]">Nom</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 w-[25%]">Prénom</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 w-[20%]">Note</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 w-[20%]">Commentaire</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 w-[25%]">Témoignage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {displayedReviews.map((review) => (
              <tr key={review.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-sm text-slate-900 font-medium">{review.lastName}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{review.firstName}</td>
                <td className="px-4 py-3">
                  <StarRating rating={review.rating} size="sm" />
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {review.comment || 'Pas de commentaire'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-slate-600">
          Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredReviews.length)} sur {filteredReviews.length} entrées
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <span className="text-sm text-slate-600">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewTable;