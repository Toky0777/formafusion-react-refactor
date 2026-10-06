import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  BarChart3,
  UserCheck,
  Settings,
  GraduationCap,
  FolderOpen,
  Presentation,
  Gamepad2,
  MapPin,
  Camera,
  ThermometerSun,
  ThermometerSnowflake,
  House,
  TestTube,
  SquareChevronUp,
  Flag,
  Ban,
  Plane,
  Loader,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Check,
  Lock,
} from "lucide-react";

export function NavigationSidebarParticular() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const isActiveLink = (href) => {
    if (href === "/particulier") {
      return location.pathname === "/particulier";
    }
    return location.pathname.startsWith(href);
  };

  const getButtonClasses = (active) =>
    `w-full flex justify-between items-center transition-colors ${
      active
        ? "text-purple-700 border-l-2 border-purple-600 bg-purple-50 gap-3 px-3 py-2 rounded-lg text-sm"
        : "cursor-pointer py-3 px-3 text-gray-700 hover:text-purple-700 hover:border-purple-600 hover:bg-purple-50"
    }`;

  const toggleSubmenu = (moduleName) => {
    setOpenSubmenu((prev) => (prev === moduleName ? null : moduleName));
  };

  const moduleCategories = [
    {
      title: "Formation & Contenu",
      color: "text-emerald-600",
      modules: [
        {
          name: "Support Formation",
          icon: Presentation,
          href: "/particulier/support",
        },
         {
          name: "Projets",
          icon: FolderOpen,
          submodules: [
            {
              name: "En préparation",
              href: "/particulier/projet/preparation",
              icon: Settings,
            },
            {
              name: "En cours",
              href: "/particulier/projet/en_cours",
              icon: Loader,
            },
            {
              name: "Terminés",
              href: "/particulier/projet/termine",
              icon: Check,
            },
            {
              name: "Planifié",
              href: "/particulier/projet/planifie",
              icon: Plane,
            },
            {
              name: "Cloturé",
              href: "/particulier/projet/cloture",
              icon: Lock,
            },
            {
              name: "Reporté",
              href: "/particulier/projet/reporte",
              icon: Flag,
            },
            {
              name: "Annulé",
              href: "/particulier/projet/annule",
              icon: Ban,
            },
          ],
        },
        { name: "LMS", icon: Gamepad2, href: "/particulier/refresh" },
      ],
    },
    {
      title: "Suivi & Présence",
      color: "text-purple-600",
      modules: [
        { name: "Présence", icon: UserCheck, href: "/particulier/presence" },
        { name: "Agenda", icon: Calendar, href: "/particulier/agenda" },
        { name: "Lieu & Salle", icon: MapPin, href: "/locations" },
      ],
    },
    {
      title: "Gestion Administrative",
      color: "text-orange-600",
      modules: [{ name: "Photos", icon: Camera, href: "/particulier/photo" }],
    },
    {
      title: "Évaluation & Analytics",
      color: "text-pink-600",
      modules: [
        { name: "Tableau de bord", icon: BarChart3, href: "/analytics" },
        {
          name: "Évaluation Chaud",
          icon: ThermometerSun,
          href: "/particulier/evaluations/chaud",
        },
        {
          name: "Évaluation Froid",
          icon: ThermometerSnowflake,
          href: "/particulier/evaluations/froid",
        },
        {
          name: "Prequal",
          icon: TestTube,
          href: "/particulier/test",
        },
        {
          name: "Gamification",
          icon: ThermometerSun,
          href: "/particulier/gamification",
        },
        {
          name: "Skill matrix",
          icon: SquareChevronUp,
          href: "/particulier/skill_matrix",
        },
      ],
    },
  ];

  
  const [collapsedCategories, setCollapsedCategories] = useState(
    moduleCategories.map(() => false)
  );
  const toggleCategory = (index) =>
    setCollapsedCategories((prev) =>
      prev.map((c, i) => (i === index ? !c : c))
  );

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
          <Link key="home" to="/particulier">
            <Button
              variant="ghost"
              className={`w-full flex items-center justify-between hover:bg-gray-100 text-gray-700 hover:text-gray-900 ${
                isCollapsed ? "px-3" : "px-3"
              }`}
              title={isCollapsed ? "Accueil" : undefined}
            >
              <div className="flex items-center">
                <House className="flex-shrink-0 w-4 h-4" />
                {!isCollapsed && <span className="ml-3 text-sm">Accueil</span>}
              </div>
            </Button>
          </Link>
            {/* Catégories */}
            {moduleCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                {!isCollapsed && (
                  <div
                    className="w-full flex items-center justify-between cursor-pointer hover:bg-gray-100 hover:px-2 hover:rounded-xl py-3"
                    onClick={() => toggleCategory(categoryIndex)}
                  >
                    <h3
                      className={`text-xs font-semibold uppercase tracking-wider px-3 ${category.color}`}
                    >
                      {category.title}
                    </h3>
                    {collapsedCategories[categoryIndex] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </div>
                )}
  
                {!collapsedCategories[categoryIndex] && (
                  <div className="space-y-1">
                    {category.modules.map((module, moduleIndex) => {
                      const active = isActiveLink(module.href);
                      const hasSubmodules =
                        module.submodules && module.submodules.length > 0;
                      const isSubmenuOpen = openSubmenu === module.name;
  
                      return (
                        <div key={moduleIndex}>
                          {!hasSubmodules ? (
                            <Link key={moduleIndex} to={module.href}>
                              <Button
                                variant="ghost"
                                className={getButtonClasses(active)}
                              >
                                <div className="flex items-center">
                                  <module.icon className="flex-shrink-0 w-4 h-4" />
                                  {!isCollapsed && (
                                    <span className="ml-3 text-sm">
                                      {module.name}
                                    </span>
                                  )}
                                </div>
                                {!isCollapsed && module.count !== undefined && (
                                  <span
                                    className={`text-xs ${
                                      active
                                        ? "text-purple-600 bg-purple-100"
                                        : "text-gray-600 hover:text-purple-600"
                                    } px-2 py-1 rounded-full`}
                                  >
                                    {module.count}
                                  </span>
                                )}
                              </Button>
                            </Link>
                          ) : (
                            <div
                              className="cursor-pointer"
                              onClick={() => toggleSubmenu(module.name)}
                            >
                              <Button
                                variant="ghost"
                                className={getButtonClasses(active)}
                              >
                                <div className="flex items-center w-full justify-between">
                                  <div className="flex items-center">
                                    <module.icon className="flex-shrink-0 w-4 h-4" />
                                    {!isCollapsed && (
                                      <span className="ml-3 text-sm">
                                        {module.name}
                                      </span>
                                    )}
                                  </div>
                                  {!isCollapsed && (
                                    <motion.div
                                      animate={{
                                        rotate: isSubmenuOpen ? 90 : 0,
                                      }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <ChevronRight className="w-4 h-4" />
                                    </motion.div>
                                  )}
                                </div>
                              </Button>
                            </div>
                          )}
  
                          {/* Sous-modules */}
                          <AnimatePresence>
                            {hasSubmodules && isSubmenuOpen && !isCollapsed && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-8 mt-1 space-y-1 overflow-hidden"
                              >
                                {module.submodules.map((sub, subIndex) => (
                                  <Link
                                    key={subIndex}
                                    to={sub.href}
                                    className={`flex items-center text-gray-600 hover:text-purple-700 hover:bg-purple-50 ${
                                      isActiveLink(sub.href)
                                        ? "text-purple-700 font-semibold bg-purple-50 border-l-2 border-purple-600"
                                        : ""
                                    }`}
                                  >
                                    <sub.icon className="flex-shrink-0 w-4 h-4" />
                                    <Button
                                      variant="ghost"
                                      className={`w-full justify-start text-sm  `}
                                    >
                                      {sub.name}
                                    </Button>
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
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
