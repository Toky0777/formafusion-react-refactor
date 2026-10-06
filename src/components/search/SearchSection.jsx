import { Search } from 'lucide-react';

const SearchSection = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="sticky top-0 z-40 py-4 bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                        <input
                            type="text"
                            placeholder="Trouvez votre formation ici, exemple Excel, Power BI..."
                            className="w-full py-3 pl-10 pr-4 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchSection;