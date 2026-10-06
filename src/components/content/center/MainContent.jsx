import Sidebar from './SideBar';
import CenterList from './List';
import ActiveFilters from './ActiveFilters';

const MainContent = (props) => {
    const { isLoading } = props;

    return (
        <div className="px-4 py-8 mx-auto sm:px-6 lg:px-8">
            <div className="flex gap-6">
                <Sidebar {...props} />
                <div className="flex-1 min-w-0">
                    <ActiveFilters {...props} />

                    {isLoading ? (
                        // Skeleton loading ou spinner
                        <div className="space-y-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="p-4 bg-gray-100 border rounded-lg shadow animate-pulse"
                                >
                                    <div className="w-3/4 h-4 mb-2 bg-gray-300 rounded" />
                                    <div className="w-1/2 h-3 mb-1 bg-gray-200 rounded" />
                                    <div className="w-1/3 h-3 bg-gray-200 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <CenterList {...props} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainContent;