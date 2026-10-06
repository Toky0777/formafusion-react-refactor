import { NavLink } from "react-router-dom";
import {
  BookOpen,
  Folder,
  House,
  ReceiptText,
  CreditCard,
  Home,
  CalendarCheck,
  Gift,
  FileText,
  TrendingUp,
  Users,
  UserCheck,
  UserPlus,
  Shield,
  User,
  UserX,
  Book,
  Calendar,
  MapPin,
  Award,
  ShoppingCart,
  Image,
  Zap,
  Activity,
  Grid,
  CheckCircle,
  Wrench,
  UserLock,
  Settings,
  Lock,
  XCircle,
  Loader,
  PieChart,
} from "lucide-react";

export default function NavBarDocumentation() {
    const links = [
        { name: "Introduction", to: "/cfp/documentation", icon: <House size={20} />, clickable: true },

        {
            name: <span className="text-cyan-600">MARKETPLACE</span>,
            sublinks: [

                {
                    name: "Catalogue en ligne",
                    icon: <BookOpen size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_catalogue_en_ligne" },
                        { name: "Détails du cours en ligne", to: "doc_catalogue_en_ligne/detail" }
                    ]
                },
                { name: "Reservation", icon: <CalendarCheck size={20} /> },

                { name: "Loyalty and rewards", icon: <Gift size={20} /> },


            ]
        },

        {
            name: <span className="text-red-600">BUSINESS INTELLIGENCE</span>,
            sublinks: [
                {
                    name: "Tableau de bord",
                    icon: <Home size={20} />,
                    sublinks: [
                        { name: "Accès ", to: "doc_analytics" },
                        { name: "Présentation", to: "doc_analytics/presentation" },
                        { name: "Objectif et Formateur", to: "doc_analytics/objectif" },
                    ]
                },
                { name: "Reporting", icon: <FileText size={20} /> },
                { name: "Analyse de chiffre d'affaire", icon: <TrendingUp size={20} /> },
                { name: "Analyse du portefeuille client", icon: <PieChart size={20} /> },
            ]
        },

        {
            name: <span className="text-orange-500">DOSSIER FMFP</span>,
            sublinks: [
                { name: "En Soumission", icon: <Settings size={20} /> },
                { name: "En cours d'execution", icon: <Loader size={20} /> },
                { name: "Cloturé", icon: <Lock size={20} /> },
                { name: "Refusé", icon: <XCircle size={20} /> },
            ]

        },

        {
            name: <span className="text-blue-600">GEESTION DES UTILISATEURS</span>,
            sublinks: [
                {
                    name: "Apprenants",
                    icon: <Users size={20} />,
                    sublinks: [
                        { name: "Accès à la page", to: "doc_apprenants" },
                        { name: "Ajout apprenants", to: "doc_apprenants/add" },
                        { name: "Gestion des apprenants", to: "doc_apprenants/gestion" }
                    ]
                },

                {
                    name: "Formateur",
                    icon: <UserCheck size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_formateur" },
                        { name: "Nouveau", to: "doc_formateur/add" },
                        { name: "Gestion des formateurs ", to: "doc_formateur/gestion" }
                    ]
                },

                {
                    name: "Sous-traitants",
                    icon: <UserPlus size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_soustraitants" },
                        { name: "Nouvelle sous-traitant", to: "doc_soustraitants/add" },
                    ]
                },

                {
                    name: "Administrateur",
                    icon: <Shield size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_admin" },
                        { name: "Nouvelle Admin", to: "doc_admin/admin" },
                        { name: "Gestion d'admin'", to: "doc_admin/gestion" },
                    ]
                },

                {
                    name: "Clients",
                    icon: <User size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_clients" },
                        { name: "Nouvelle Clients", to: "doc_clients/add" },
                        { name: "Gestion des Clients", to: "doc_clients/gestion" },
                    ]
                },

                {
                    name: "Particulier",
                    icon: <UserX size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_particulier" },
                        { name: "Nouvelle Particulier", to: "doc_particulier/particulier" },
                        { name: "Gestion du particulier", to: "doc_particulier/gestion" },
                    ]
                },
            ]
        },

        {
            name: <span className="text-green-600">FORMATION ET CONTENU</span>,
            sublinks: [
                {
                    name: "Catalogue Interne",
                    icon: <BookOpen size={20} />,
                    sublinks: [
                        { name: "Accès et Pésentation", to: "doc_catalogue" },
                        { name: "Gestion des cours et status", to: "doc_catalogue/ajout" },
                        { name: "Détails d'un cours", to: "doc_catalogue/detail" },
                    ],
                },

                {
                    name: "Projet",
                    icon: <Folder size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_projet" },
                        { name: "Création Projet Intra", to: "doc_projet/creation/intra" },
                        { name: "Création Projet Inter", to: "doc_projet/creation/inter" },
                        { name: "Explication des status", to: "doc_projet/status" },
                        { name: "Détails et Actions", to: "doc_projet/detail" },
                    ],
                },

                {
                    name: "LMS",
                    icon: <Book size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_lms" },
                    ],
                },
            ]

        },

        {
            name: <span className="text-purple-600">SUIVI ET PRESENCE</span>,
            sublinks: [
                { name: "Présence", icon: <Calendar size={20} /> },
                { name: "Agenda", icon: <Calendar size={20} /> },

                {
                    name: "Lieu et Salles",
                    icon: <MapPin size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_lieu" },
                        { name: "Gestion de Lieu", to: "doc_lieu/creation" },
                        { name: "Gestion salle et contact", to: "doc_lieu/gestion" },
                    ]
                },

                {
                    name: "Gestion des matériels",
                    icon: <Wrench size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_materiel" },
                        { name: "Gestion des matériels", to: "doc_materiel/gestion" },
                    ]
                },

                { name: "Badges", icon: <Award size={20} /> },
                { name: "Disponibilité de formateur", icon: <UserLock size={20} /> },
                { name: "Disponibilité de  matériel", icon: <CalendarCheck size={20} /> },
            ]

        },

        {
            name: <span className="text-emerald-500">GESTION ADMINISTRATIVE</span>,
            sublinks: [
                {
                    name: "Devis",
                    icon: <FileText size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_devis" },
                        { name: "Nouveau Devis", to: "doc_devis/ajout" },
                        { name: "Explication statut", to: "doc_devis/statut" },
                    ]
                },
                {
                    name: "Bon de Commande",
                    icon: <ShoppingCart size={20} />,
                    sublinks: [
                        { name: "Accès ", to: "doc_commande" },
                        { name: "Présentation ", to: "doc_commande/presentation" },
                        { name: "Ajout BC ", to: "doc_commande/add" },
                    ]
                },

                {
                    name: "Nouvelle Facture",
                    icon: <ReceiptText size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_facture" },
                        { name: "Nouvelle Facture", to: "doc_facture/add" },
                    ]
                },

                {
                    name: "Recouvrement",
                    icon: <CreditCard size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_recouvrement" },
                        { name: "Gestion de recouvrement", to: "doc_recouvrement/gestion" },
                    ]
                },
                {
                    name: "Dossier",
                    icon: <Folder size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_dossier" },
                        { name: "Présentation du détail", to: "doc_dossier/detail" },
                        { name: "Gestion du Dossier", to: "doc_dossier/gestion" },
                    ]
                },

                {
                    name: "Photos",
                    icon: <Image size={20} />,
                    sublinks: [
                        { name: "Accès et Présentation", to: "doc_photos" },
                        { name: "Gestion des Photos", to: "doc_photos/gestion" },
                    ]
                },
            ]
        },

        {
            name: <span className="text-yellow-400">EVALUATIONS</span>,
            sublinks: [
                { name: "Evaluation à chaud", icon: <Zap size={20} /> },

                { name: "Evaluation à froid", icon: <Activity size={20} /> },

                { name: "Skill Matrix", icon: <Grid size={20} /> },

                { name: "Pre-qual", icon: <CheckCircle size={20} /> },
            ]
        },

    ];

    return (
        <nav className="p-4 w-80 h-screen overflow-y-auto sticky top-0 border-r border-gray-800">
            <ul className="flex flex-col gap-4 ">
                {links.map((link) => (
                    <MenuItem key={link.name} link={link} />
                ))}
            </ul>
        </nav>
    );
}

function MenuItem({ link }) {
    return (
        <li>
            {/* Lien principal ou simple texte */}
            {link.to ? (
                <NavLink
                    to={link.to || ""}
                    end
                    className={({ isActive }) =>
                        `flex items-center gap-3 p-1 rounded transition-colors ${isActive
                            ? "border-l-4 border-indigo-600 bg-indigo-50 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                    }
                >
                    {link.icon}
                    <span>{link.name}</span>
                </NavLink>
            ) : (
                <div className="flex items-center gap-3 p-2 rounded text-gray-800 font-semibold">
                    {link.icon}
                    <span className="text" >{link.name}</span>
                </div>
            )}

            {/* Sous-menus — RÉCURSIF */}
            {link.sublinks && (
                <ul className="ml-8 mt-2 space-y-1 ">
                    {link.sublinks.map((sublink) => (
                        <MenuItem key={sublink.name} link={sublink} />
                    ))}
                </ul>
            )}
        </li>
    );
}

