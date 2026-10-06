import { Navigate, Outlet, NavLink, useLocation } from "react-router-dom";
import { getMicroservicesForUserType } from "../layouts/microServiceData";
import { useAuth } from "../contexts/AuthContext";

const DEFAULT_TABS = {
    cfp: "trainer",
    etp: "reporting",
    particular: "course",
};

const Account = () => {
    const { userType } = useAuth();
    const microservicesData = getMicroservicesForUserType(userType);
    const defaultTab = DEFAULT_TABS[userType] || null;
    const location = useLocation();

    // Si on est sur "/account" exactement → on redirige vers le tab par défaut
    if (location.pathname === "/account" && defaultTab) {
        return <Navigate to={`/account/${defaultTab}`} replace />;
    }

    return (
        <>
            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center py-1 overflow-x-auto space-x-0.5">
                        {microservicesData.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="flex items-center">
                                {categoryIndex > 0 && (
                                    <div className="w-px h-6 mx-1 bg-gray-300"></div>
                                )}
                                <div className="flex items-center space-x-0.5">
                                    {category.services.map((service, serviceIndex) => (
                                        <NavLink
                                            key={serviceIndex}
                                            to={service.route}
                                            end
                                            className={({ isActive }) =>
                                                `flex items-center px-1 py-1 space-x-1 transition-all duration-150 rounded group
                        ${isActive
                                                    ? "text-purple-600 border-b-2 border-purple-600 bg-white"
                                                    : "text-gray-700 hover:text-purple-600"
                                                }`
                                            }
                                        >
                                            <div className="flex items-center justify-center w-5 h-5 transition-all duration-150 group-hover:scale-110">
                                                <service.icon className="w-3 h-3" />
                                            </div>
                                            <span className="text-[9px] font-medium leading-none whitespace-nowrap">
                                                {service.name}
                                            </span>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="flex-1">
                <div className="px-4 mx-auto sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>
        </>
    );
};

export default Account;
