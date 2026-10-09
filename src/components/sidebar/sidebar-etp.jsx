import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  Calendar,
  FileText,
  UserCheck,
  GraduationCap,
  Shield,
  Building2,
  FolderOpen,
  Camera,
  Ticket,
  Gift,
  Signature,
  House,
  Notebook,
  Book,
  CircleQuestionMark,
  Lock,
  Flag,
  Ban,
  Check,
  Loader,
  Settings,
  Plane,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MessageSquareMore,
} from "lucide-react";
import axios from "../../config/axios";
import { FaYoutube } from "react-icons/fa6";

export function NavigationSidebarEtp() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [counts, setCounts] = useState({
    modules: 0,
    trainers: 0,
    customers: 0,
    particulars: 0, // Assurez-vous que cette propriété existe
    projects: 0,
    folders: 0,
    reservations: 0,
    badges: 0,
    learners: 0,
    invoices: 0,
  });

  // Calcul sécurisé
  const totalCustomer = (counts.customers || 0) + (counts.particulars || 0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get("/get_countsEtp");
        if (response.status === 200) setCounts(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCounts();
  }, []);

  const toggleSubmenu = (moduleName) => {
    setOpenSubmenu((prev) => (prev === moduleName ? null : moduleName));
  };

  // const totalCustomer = counts.customers + counts.particulars;

  const moduleCategories = [
    {
      title: "Formation & Contenu",
      color: "text-emerald-600",
      modules: [
        {
          name: "Projets",
          icon: FolderOpen,
          submodules: [
            {
              name: "En préparation",
              href: "/etp/projet/preparation",
              icon: Settings,
            },
            {
              name: "En cours",
              href: "/etp/projet/en_cours",
              icon: Loader,
            },
            {
              name: "Terminés",
              href: "/etp/projet/termine",
              icon: Check,
            },
            {
              name: "Planifié",
              href: "/etp/projet/planifie",
              icon: Plane,
            },
            {
              name: "Cloturé",
              href: "/etp/projet/cloture",
              icon: Lock,
            },
            {
              name: "Reporté",
              href: "/etp/projet/reporte",
              icon: Flag,
            },
            {
              name: "Annulé",
              href: "/etp/projet/annule",
              icon: Ban,
            },
          ],
        },
      ],
    },
    {
      title: "Gestion des Utilisateurs",
      color: "text-blue-600",
      modules: [
        {
          name: "Employés",
          icon: Users,
          count: counts.learners,
          href: "/etp/employe",
        },
        { name: "Administrateurs", icon: Shield, href: "/etp/utilisateurs" },
        {
          name: "Mes centres de formation",
          icon: Building2,
          count: totalCustomer,
          href: "/etp/client",
        },
      ],
    },
    {
      title: "Suivi & Présence",
      color: "text-purple-600",
      modules: [
        { name: "Présence", icon: UserCheck, href: "/etp/presence" },
        { name: "Agenda", icon: Calendar, href: "/etp/agenda" },
      ],
    },
    {
      title: "Gestion Administrative",
      color: "text-orange-600",
      modules: [
        {
          name: "Vos Dossiers",
          icon: FileText,
          count: counts.folders,
          href: "/etp/dossier",
        },
        // { name: "Devis", icon: ReceiptText, href: "/etp/proforma" },
        { name: "Vos bon de commande", icon: Signature, href: "/etp/bon-commande" },
        { name: "Photos", icon: Camera, href: "/etp/photos" },
      ],
    },
    {
      title: "Marketplace",
      color: "text-cyan-600",
      modules: [
        { name: "Catalogue en ligne", icon: BookOpen, href: "/etp/cours" },
        { name: "Centre de formation", icon: Building2, href: "/etp/centre" },
        { name: "Annuaire", icon: Notebook, href: "/etp/annuaire" },
        { name: "Réservations", icon: Ticket, href: "/etp/reservation" },
        {
          name: "Loyalty and rewards",
          icon: Gift,
          href: "/etp/loyalty_rewards",
          count: counts.rewards,
        },
      ],
    },
    /*
    {
      title: "Business Intelligence",
      color: "text-red-600",
      modules: [
        { name: "Analytics", icon: BarChart3, href: "/etp/analytic" },
        { name: "Reporting", icon: TrendingUp, href: "/etp/reporting" },
      ],
    },
    {
      title: "Dossier FMFP",
      color: "text-cyan-600",
      modules: [
        {
          name: "En soumission",
          icon: Settings,
          href: "/etp/fmfp/en_soumission",
        },
        {
          name: "En cours d'execution",
          icon: Loader,
          href: "/etp/fmfp/en_execution",
        },
        {
          name: "Cloturé",
          icon: Lock,
          href: "/etp/fmfp/cloture",
        },
        {
          name: "Refusé",
          icon: X,
          href: "/etp/fmfp/refuse",
        },
      ],
    },
    {
      title: "Évaluations",
      color: "text-pink-600",
      modules: [
        {
          name: "Évaluation à chaud",
          icon: ThermometerSun,
          href: "/etp/evaluation_chaud",
        },
        {
          name: "Skill Matrix",
          icon: SquareChevronUp,
          href: "/etp/skill_matrix",
        },
      ],
    },
    */
  ];

  const [collapsedCategories, setCollapsedCategories] = useState(
    moduleCategories.map(() => true)
  );
  const toggleCategory = (index) =>
    setCollapsedCategories((prev) =>
      prev.map((c, i) => (i === index ? !c : c))
    );

  const isActiveLink = (href) => {
    if (href === "/etp") {
      return location.pathname === "/etp";
    }
    return location.pathname.startsWith(href);
  };

  const getButtonClasses = (active) =>
    `w-full flex justify-between items-center transition-colors ${
      active
        ? "text-purple-700 border-l-2 border-purple-600 bg-purple-50 gap-3 px-3 py-2 rounded-lg text-sm"
        : "cursor-pointer py-3 px-3 text-gray-700 hover:text-purple-700 hover:border-purple-600 hover:bg-purple-50"
    }`;

  return (
    <div
      className={`bg-white border-r overflow-auto border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72"
      } flex flex-col h-screen`}
    >
      {/* Header */}
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
      <ScrollArea className="flex-1 px-3 py-2.5">
        <div className="space-y-6">
          {/* Accueil */}
          <Link to="/etp">
            <Button
              variant="ghost"
              className={getButtonClasses(isActiveLink("/etp"))}
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

      {/* Footer */}
      <div className="flex-1 border-t border-gray-200 px-3 py-2.5">
        <div className={`${isCollapsed ? "space-y-3" : "space-y-6"}`}>
          <Link to="/etp/aide">
            <Button
              variant="ghost"
              className={getButtonClasses(isActiveLink("#"))}
            >
              <div className="flex items-center">
                <CircleQuestionMark className="flex-shrink-0 w-4 h-4" />
                {!isCollapsed && <span className="ml-3 text-sm">Aide</span>}
              </div>
            </Button>
          </Link>
        </div>
        <div className={`${isCollapsed ? "space-y-3" : "space-y-6"}`}>
          <Link to="#">
            <Button
              variant="ghost"
              className={getButtonClasses(isActiveLink("#"))}
            >
              <div className="flex items-center">
                <Book className="flex-shrink-0 w-4 h-4" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm">Documentation</span>
                )}
              </div>
            </Button>
          </Link>
        </div>
        <div className={`${isCollapsed ? "space-y-3" : "space-y-6"}`}>
          <Link to="#">
            <Button
              variant="ghost"
              className={getButtonClasses(isActiveLink("#"))}
            >
              <div className="flex items-center">
                <FaYoutube className="flex-shrink-0 w-4 h-4" />
                {!isCollapsed && <span className="ml-3 text-sm">Tutoriel</span>}
              </div>
            </Button>
          </Link>
        </div>
        <div className={`${isCollapsed ? "space-y-3" : "space-y-6"}`}>
          <Link to="#">
            <Button
              variant="ghost"
              className={getButtonClasses(isActiveLink("#"))}
            >
              <div className="flex items-center">
                <MessageSquareMore className="flex-shrink-0 w-4 h-4" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm">Envoyez un commentaire</span>
                )}
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
