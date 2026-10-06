import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  FileText,
  UserCheck,
  GraduationCap,
  Shield,
  Building2,
  FolderOpen,
  Gamepad2,
  MapPin,
  Badge,
  Camera,
  CreditCard,
  TrendingUp,
  ThermometerSun,
  Ticket,
  Building,
  Signature,
  House,
  ReceiptText,
  IceCreamBowl,
  SquareChevronUp,
  Gift,
  UserRound,
  TestTube,
  ChevronRight,
  Loader,
  Settings,
  Check,
  Plane,
  Lock,
  Flag,
  Ban,
  Book,
  Youtube,
  MessageSquareMore,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Trash2,
  Wallet,
  ToolCase,
  Train,
  Laptop,
  X,
  Plus,
  User,
  Send,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../config/axios";
import T from "./translate/AutoTranslator";

export function NavigationSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState([]);
  const [counts, setCounts] = useState({
    modules: 0,
    trainers: 0,
    customers: 0,
    particulars: 0,
    projects: 0,
    folders: 0,
    reservations: 0,
    badges: 0,
    learners: 0,
    invoices: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get("/get_counts");
        if (response.status === 200) setCounts(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCounts();
  }, []);

  const moduleCategories = [
    {
      title: "Marketplace",
      color: "text-cyan-600",
      modules: [
        {
          name: "Catalogue en ligne",
          icon: BookOpen,
          href: "/cfp/cours_en_ligne",
          count: counts.module_online,
        },
        {
          name: "Réservation",
          icon: Ticket,
          count: counts.reservations,
          href: "/cfp/reservation",
        },
        {
          name: "Loyalty and rewards",
          icon: Gift,
          count: counts.rewards,
          href: "/cfp/loyalty_rewards",
        },
        {
          name: "Profile",
          icon: User,
          count: "",
          href: "/cfp/profile-marketplace",
        },
      ],
    },
    {
      title: "Business Intelligence",
      color: "text-red-600",
      modules: [
        { name: "Analytics", icon: BarChart3, href: "/cfp/analytic" },
        { name: "Reporting", icon: TrendingUp, href: "/cfp/reporting" },
        {
          name: "Analyse du chiffre d'affaire",
          icon: DollarSign,
          href: "/cfp/ca",
        },
        {
          name: "Analyse du portefeuille client",
          icon: DollarSign,
          href: "/cfp/analyse_portefeullie_client",
        },
      ],
    },
    {
      title: "Dossier Fmfp",
      color: "text-amber-600",
      modules: [
        {
          name: "En soumission",
          icon: Settings,
          href: "/cfp/fmfp/en_soumission",
          count: counts.fmfp_soumission,
        },
        {
          name: "En cours d'execution",
          icon: Loader,
          href: "/cfp/fmfp/en_execution",
          count: counts.fmfp_excute,
        },
        {
          name: "Service fait",
          icon: Send,
          href: "/cfp/fmfp/service_fait",
          count: counts.fmfp_fait,
        },
        {
          name: "Cloturé",
          icon: Lock,
          href: "/cfp/fmfp/cloture",
          count: counts.fmfp_cloture,
        },
        {
          name: "Refusé",
          icon: X,
          href: "/cfp/fmfp/refuse",
          count: counts.fmfp_refuse,
        },
      ],
    },
    {
      title: "Gestion des Utilisateurs",
      color: "text-blue-600",
      modules: [
        {
          name: "Apprenants",
          icon: Users,
          count: counts.learners,
          href: "/cfp/apprenant",
        },
        {
          name: "Formateurs",
          icon: GraduationCap,
          count: counts.trainers,
          href: "/cfp/formateur",
        },
        {
          name: "Sous-traitants",
          icon: Building,
          href: "/cfp/sous_traitant",
          count: counts.sub_contractors,
        },
        {
          name: "Administrateurs",
          icon: Shield,
          href: "/cfp/utilisateurs",
          count: counts.admins,
        },
        {
          name: "Clients",
          icon: Building2,
          count: counts.customers,
          href: "/cfp/client",
        },
        {
          name: "Particuliers",
          icon: UserRound,
          count: counts.particulars,
          href: "/cfp/particulier",
        },
      ],
    },
    {
      title: "Formation & Contenu",
      color: "text-emerald-600",
      modules: [
        {
          name: "Catalogue interne",
          icon: BookOpen,
          count: counts.module_interne,
          href: "/cfp/catalogue",
        },
        {
          name: "Projets",
          icon: FolderOpen,
          submodules: [
            {
              name: "Nouveau projet",
              href: "/cfp/nouveau_projet",
              icon: Plus,
            },
            {
              name: "En préparation",
              href: "/cfp/projet/preparation",
              icon: Settings,
              count: counts.project_in_preparation,
            },
            {
              name: "En cours",
              href: "/cfp/projet/en_cours",
              icon: Loader,
              count: counts.project_in_progress,
            },
            {
              name: "Terminés",
              href: "/cfp/projet/termine",
              icon: Check,
              count: counts.project_finished,
            },
            {
              name: "Planifié",
              href: "/cfp/projet/planifie",
              icon: Plane,
              count: counts.project_planned,
            },
            {
              name: "Cloturé",
              href: "/cfp/projet/cloture",
              icon: Lock,
              count: counts.project_closed,
            },
            {
              name: "Reporté",
              href: "/cfp/projet/reporte",
              icon: Flag,
              count: counts.project_postponed,
            },
            {
              name: "Annulé",
              href: "/cfp/projet/annule",
              icon: Ban,
              count: counts.project_canceled,
            },
            {
              name: "Supprimé",
              label: "Corbeille",
              href: "/cfp/projet/corbeille",
              icon: Trash2,
              count: counts.project_deleted,
            },
          ],
        },
        { name: "LMS", icon: Gamepad2, href: "/cfp/refresh" },
      ],
    },
    {
      title: "Suivi & Présence",
      color: "text-purple-600",
      modules: [
        { name: "Présence", icon: UserCheck, href: "/cfp/presence" },
        { name: "Agenda", icon: Calendar, href: "/cfp/agenda" },
        { name: "Lieu & Salle", icon: MapPin, href: "/cfp/lieu_salle" },
        {
          name: "Gestion des matériels",
          icon: ToolCase,
          href: "/cfp/materiel",
        },
        {
          name: "Badges",
          icon: Badge,
          count: counts.badges,
          href: "/cfp/badge",
        },
        {
          name: "Disponibilité de formateur",
          icon: Train,
          href: "/cfp/disponibilite_de_formateur",
        },
        {
          name: "Disponibilité de materiel",
          icon: Laptop,
          href: "/cfp/disponibilite_de_materiel",
        },
      ],
    },
    {
      title: "Gestion Administrative",
      color: "text-orange-600",
      modules: [
        {
          name: "Dossiers",
          icon: FileText,
          count: counts.folders,
          href: "/cfp/dossier",
        },
        {
          name: "Devis",
          icon: ReceiptText,
          href: "/cfp/proforma",
          count: counts.quotes,
        },
        {
          name: "Vos bon de commande",
          icon: Signature,
          href: "/cfp/bon-commande",
          count: counts.purchase_order,
        },
        {
          name: "Factures",
          icon: CreditCard,
          count: counts.invoices,
          href: "/cfp/facture",
        },
        {
          name: "Recouvrement",
          icon: Wallet,
          href: "/cfp/recouvrement",
        },
        { name: "Photos", icon: Camera, href: "/cfp/photos" },
      ],
    },
    {
      title: "Évaluations",
      color: "text-pink-600",
      modules: [
        {
          name: "Évaluation Chaud",
          icon: ThermometerSun,
          href: "/cfp/evaluation_a_chaud",
        },
        {
          name: "Évaluation Froid",
          icon: IceCreamBowl,
          href: "/cfp/evaluation/froids",
        },
        {
          name: "Skill matrix",
          icon: SquareChevronUp,
          href: "/cfp/skill_matrix",
        },
        { name: "Pre-qual", icon: TestTube, href: "/cfp/prequal" },
      ],
    },
    {
      title: "Aide",
      color: "text-emerald-600",
      modules: [
        {
          name: "Documentation",
          icon: Book,
          href: "/cfp/documentation",
        },
        {
          name: "Tutoriel",
          icon: Youtube,
          href: "#",
        },
        {
          name: "Envoyez un commentaire",
          icon: MessageSquareMore,
          href: "#",
        },
      ],
    },
  ];

  useEffect(() => {
    setCollapsedCategories(moduleCategories.map(() => true));
  }, []);

  const toggleCategory = (index) => {
    setCollapsedCategories((prev) =>
      prev.map((c, i) => (i === index ? !c : c))
    );
  };

  const toggleSubmenu = (moduleName) => {
    setOpenSubmenu((prev) => (prev === moduleName ? null : moduleName));
  };

  const isActiveLink = (href) => {
    if (href === "/cfp") {
      return location.pathname === "/cfp";
    }
    return location.pathname.startsWith(href);
  };

  const getButtonClasses = (active) =>
    `w-full flex justify-between items-center transition-colors ${active
      ? "text-purple-700 border-l-2 border-purple-600 bg-purple-50 gap-3 px-3 py-2 rounded-lg text-sm"
      : "cursor-pointer py-3 px-3 text-gray-700 hover:text-purple-700 hover:border-purple-600 hover:bg-purple-50"
    }`;

  return (
    <div
      className={`bg-white border-r overflow-auto border-gray-200 transition-all duration-300 ${isCollapsed ? "w-20" : "w-72"
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
                <span className="text-xs text-gray-500">Madagascar</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Link to="/cfp/ai_rentabilite">
        <Button
          variant="ghost"
          className={`w-full relative group overflow-hidden bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 
            border border-white/20 hover:border-emerald-500/50 transition-all duration-300`}>
          <div className="relative z-10 flex items-center">
            <TrendingUp className="flex-shrink-0 w-4 h-4 transition-transform text-emerald-500 group-hover:scale-110" />
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium text-transparent bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text">
                <T>AI Rentabilité</T>
              </span>
            )}
          </div>
          {/* Effet de brillance au survol */}
          <div className="absolute inset-0 transition-transform duration-1000 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full" />
        </Button>
      </Link>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-2.5">
        <div className={`${isCollapsed ? "space-y-3" : "space-y-6"}`}>
          {/* Accueil */}
          <Link to="/cfp">
            <Button
              variant="ghost"
              className={getButtonClasses(isActiveLink("/cfp"))}
            >
              <div className="flex items-center">
                <House className="flex-shrink-0 w-4 h-4" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm">
                    {" "}
                    <T>Accueil</T>{" "}
                  </span>
                )}
              </div>
            </Button>
          </Link>

          {/* QUALITE */}
          <Link to="/cfp/qualite">
            <Button
              variant="ghost"
              className={getButtonClasses(isActiveLink("/cfp/qualite"))}
            >
              <div className="flex items-center">
                <ShieldCheck className="flex-shrink-0 w-4 h-4" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm">
                    {" "}
                    <T>Qualité</T>{" "}
                  </span>
                )}
              </div>
            </Button>
          </Link>

          {/* Catégories */}
          {moduleCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              {!isCollapsed && (
                <div
                  className="flex items-center justify-between w-full py-3 cursor-pointer hover:bg-gray-100 hover:px-2 hover:rounded-xl"
                  onClick={() => toggleCategory(categoryIndex)}
                >
                  <h3
                    className={`text-xs font-semibold uppercase tracking-wider px-3 ${category.color}`}
                  >
                    <T>{category.title}</T>
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
                                    <T>{module.name}</T>
                                  </span>
                                )}
                              </div>
                              {!isCollapsed && module.count !== undefined && (
                                <span
                                  className={`text-xs ${active
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
                              <div className="flex items-center justify-between w-full">
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
                              className="mt-1 ml-8 space-y-1 overflow-hidden"
                            >
                              {module.submodules.map((sub, subIndex) => (
                                <Link
                                  key={subIndex}
                                  to={sub.href}
                                  className={`flex items-center text-gray-600 hover:text-purple-700 hover:bg-purple-50 ${isActiveLink(sub.href)
                                    ? "text-purple-700 font-semibold bg-purple-50 border-l-2 border-purple-600"
                                    : ""
                                    }`}
                                >
                                  <Button
                                    variant="ghost"
                                    className={getButtonClasses(active)}
                                  >
                                    <div className="flex items-center">
                                      <sub.icon className="flex-shrink-0 w-4 h-4" />
                                      {!isCollapsed && (
                                        <span className="ml-3 text-sm">
                                          {sub.name}
                                        </span>
                                      )}
                                    </div>
                                    {!isCollapsed &&
                                      sub.count !== undefined && (
                                        <span
                                          className={`text-xs ${active
                                            ? "text-purple-600 bg-purple-100"
                                            : "text-gray-600 hover:text-purple-600"
                                            } px-2 py-1 rounded-full`}
                                        >
                                          {sub.count}
                                        </span>
                                      )}
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
    </div>
  );
}
