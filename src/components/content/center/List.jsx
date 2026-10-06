import Pagination from '../../Common/Pagination';
import CenterCard from '../../card/CenterCard';

const CenterList = ({
    centers,
    pagination,
    currentPage,
    setCurrentPage,
    selectedDateFilter,
}) => {

    // Pagination
    const totalPages = pagination?.last_page || 1;

    return (
        <>
            {/* En-tête */}
            <div className="mb-8">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Centres de formations</h2>
                <div className="w-20 h-1 rounded bg-gradient-to-r from-orange-400 to-yellow-400"></div>
            </div>

            {/* Résultats */}
            <div className="mb-6">
                <p className="text-gray-600">
                    {pagination?.total || 0} centre de formation trouvée{(pagination?.total || 0) > 1 ? 's' : ''}
                    {!selectedDateFilter && centers.length > 0}
                </p>
            </div>

            <div className='space-y-8'>
                {
                    centers.map((center) => (
                        <CenterCard key={center.id} center={center} />
                    ))
                }
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </>
    );
};

export default CenterList;