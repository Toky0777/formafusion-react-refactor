import { Link, useLocation } from "react-router-dom";
import { Calendar, FileText, FolderOpen, Briefcase } from "lucide-react";
import {
  CircleQuestionMark,
  Book,
  Youtube,
  MessageSquareMore,
} from "lucide-react";

export function TopMenu() {
  const location = useLocation();
  const pathname = location.pathname;

  const menuItems = [
    { name: "Centre", href: "/etp/centre" },
    { name: "Annuaire", href: "/etp/annuaire" },
    { name: "Catalogue", href: "/etp/cours" },
  ];

  const quickActions = [
    { name: "Aide", href: "#", icon: CircleQuestionMark },
    { name: "Documentation", href: "#", icon: Book },
    { name: "Tutoriel", href: "#", icon: Youtube },
    { name: "Envoyez un commentaire", href: "#", icon: MessageSquareMore },
  ];

  return (
    <div className="px-6 py-2 text-gray-700 bg-white border-b border-gray-200">
      <nav className="flex items-center justify-between">
        {/* Menu principal */}
        <div className="flex space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`hover:text-blue-600 transition-colors ${
                pathname === item.href ? "text-blue-600 font-medium" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex space-x-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={action.name}
                to={action.href}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors ${
                  pathname === action.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600"
                }`}
                title={action.name}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{action.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
