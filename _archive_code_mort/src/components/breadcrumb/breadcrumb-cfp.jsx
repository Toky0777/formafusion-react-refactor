import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

export function BreadcrumbBarCfp() {
    const location = useLocation()
    const pathname = location.pathname

    const pathSegments = pathname.replace(/^\/cfp/, '').split('/').filter(Boolean);

    const breadcrumbs = [
        { name: "Accueil", href: "/cfp" },
        ...pathSegments.map((segment, index) => {
            const href = "/cfp/" + pathSegments.slice(0, index + 1).join("/");
            return {
                name: segment.charAt(0).toUpperCase() + segment.slice(1),
                href,
            };
        }),
    ];


    return (
        <div className="px-6 py-1 text-gray-700 bg-white border-b border-gray-200">
            <nav className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((breadcrumb, index) => (
                    <div key={breadcrumb.href} className="flex items-center">
                        {index === 0 && <Home className="w-4 h-4 mr-1" />}
                        {index < breadcrumbs.length - 1 ? (
                            <Link to={breadcrumb.href} className="transition-colors hover:text-gray-900">
                                {breadcrumb.name}
                            </Link>
                        ) : (
                            <span className="text-gray-500">{breadcrumb.name}</span>
                        )}
                        {index < breadcrumbs.length - 1 && (
                            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                        )}
                    </div>
                ))}
            </nav>
        </div>
    )
}
