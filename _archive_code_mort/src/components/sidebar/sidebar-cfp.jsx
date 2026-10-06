import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  FileText,
  UserCheck,
  Settings,
  GraduationCap,
  Shield,
  Building2,
  FolderOpen,
  Presentation,
  Gamepad2,
  MapPin,
  Badge,
  Camera,
  CreditCard,
  ShoppingCart,
  TrendingUp,
  ThermometerSun,
  UserPlus,
} from "lucide-react";

export function NavigationSidebarCfp() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const moduleCategories = [
    {
      title: "Gestion des Utilisateurs",
      color: "text-blue-600",
      modules: [
        { name: "Apprenants", icon: Users, href: "/learners" },
        { name: "Formateurs", icon: GraduationCap, href: "/trainers" },
        { name: "Administrateurs", icon: Shield, href: "/admins" },
        { name: "Clients", icon: Building2, href: "/cfp/clients" },
      ],
    },
    {
      title: "Formation & Contenu",
      color: "text-emerald-600",
      modules: [
        { name: "Catalogue", icon: BookOpen, href: "/cfp/catalogue" },
        { name: "Support Formation", icon: Presentation, href: "/cfp/support" },
        { name: "Projets", icon: FolderOpen, href: "/projects" },
        { name: "LMS", icon: Gamepad2, href: "/lms" },
      ],
    },
    {
      title: "Suivi & Présence",
      color: "text-purple-600",
      modules: [
        { name: "Présence", icon: UserCheck, href: "/cfp/presence" },
        { name: "Agenda", icon: Calendar, href: "/cfp/agenda" },
        { name: "Lieu & Salle", icon: MapPin, href: "/locations" },
        { name: "Badges", icon: Badge, href: "/cfp/badge" },
      ],
    },
    {
      title: "Gestion Administrative",
      color: "text-orange-600",
      modules: [
        { name: "Dossiers", icon: FileText, href: "/cfp/dossier" },
        { name: "Factures", icon: CreditCard, href: "/cfp/facture" },
        { name: "Achats Licence", icon: ShoppingCart, href: "/licenses" },
        { name: "Photos", icon: Camera, href: "/cfp/photos" },
      ],
    },
    {
      title: "Évaluation & Analytics",
      color: "text-pink-600",
      modules: [
        { name: "Analytics", icon: BarChart3, href: "/analytics" },
        {
          name: "Évaluation Chaud/Froid",
          icon: ThermometerSun,
          href: "/evaluations",
        },
        { name: "Reporting", icon: TrendingUp, href: "/cfp/reporting" },
      ],
    },
    {
      title: "Inscription en Ligne",
      color: "text-cyan-600",
      modules: [
        { name: "Inscription en Ligne", icon: UserPlus, href: "/registration" },
      ],
    },
  ];

  return (
    <div
      className={`bg-white border-r overflow-auto border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-72"
      } flex flex-col h-screen`}
    >
      {/* Header - Collapse Button Only */}
      <div className="p-4 border-b border-gray-200">
        <div
          className="flex items-center p-2 transition-colors rounded-lg cursor-pointer hover:bg-gray-50"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  Formafusion
                </span>
                <span className="text-xs text-gray-500">
                  Innovative Training
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {moduleCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              {!isCollapsed && (
                <h3
                  className={`text-xs font-semibold uppercase tracking-wider mb-3 px-3 ${category.color}`}
                >
                  {category.title}
                </h3>
              )}
              <div className="space-y-1">
                {category.modules.map((module, index) => (
                  <Link key={index} to={module.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start hover:bg-gray-100 text-gray-700 hover:text-gray-900 ${
                        isCollapsed ? "px-3" : "px-3"
                      }`}
                      title={isCollapsed ? module.name : undefined}
                    >
                      <module.icon className="flex-shrink-0 w-4 h-4" />
                      {!isCollapsed && (
                        <span className="ml-3 text-sm">{module.name}</span>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Settings */}
      <div className="p-3 border-t border-gray-200">
        <Link href="/settings">
          <Button
            variant="ghost"
            className={`w-full justify-start hover:bg-gray-100 text-gray-700 hover:text-gray-900 ${
              isCollapsed ? "px-3" : "px-3"
            }`}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className="flex-shrink-0 w-4 h-4" />
            {!isCollapsed && <span className="ml-3 text-sm">Settings</span>}
          </Button>
        </Link>
      </div>
    </div>
  );
}
