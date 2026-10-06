import {
  Users,
  GraduationCap,
  CheckCircle,
  BarChart3,
  BookOpen,
  Target,
  Monitor,
  Award,
  Clipboard,
  Rocket,
  Calendar,
  Building,
  PenTool,
  Folder,
  Camera,
  User,
  CreditCard,
  TrendingUp,
  FileBarChart,
  ShoppingCart,
  Settings,
  Briefcase,
  MapPin,
  UserCheck,
  DollarSign,
  FileText,
  Phone,
  Mail,
  Star,
  Clock,
  Key,
  Database,
  Cloud,
} from 'lucide-react';

// Base microservices that are common to all user types
const commonMicroservices = [
    {
        category: "Compte & Sécurité",
        services: [
            { name: "Mon profil", icon: User, color: "from-blue-50 to-blue-100", route: "/profile" },
            { name: "Paramètres", icon: Settings, color: "from-gray-50 to-gray-100", route: "/settings" },
            { name: "Sécurité", icon: Key, color: "from-red-50 to-red-100", route: "/security" }
        ]
    }
];

// Company-specific microservices
const cfpMicroservices = [
    {
        category: "Gestion pédagogique",
        services: [
            { name: "Apprenants", icon: Users, color: "from-blue-50 to-blue-100", route: "/learners" },
            { name: "Formateurs", icon: GraduationCap, color: "from-emerald-50 to-emerald-100", route: "/app/account/trainers" },
            { name: "Présence", icon: CheckCircle, color: "from-green-50 to-green-100", route: "/attendance" },
            { name: "Évaluation", icon: BarChart3, color: "from-orange-50 to-orange-100", route: "/evaluation" },
            { name: "Support de cours", icon: BookOpen, color: "from-amber-50 to-amber-100", route: "/course-support" },
            { name: "Compétences", icon: Target, color: "from-red-50 to-red-100", route: "/skills" },
            { name: "LMS", icon: Monitor, color: "from-slate-50 to-slate-100", route: "/lms" },
            { name: "Badges", icon: Award, color: "from-yellow-50 to-yellow-100", route: "/badges" },
            { name: "Support de formation", icon: BookOpen, color: "from-amber-50 to-amber-100", route: "/training-support" }
        ]
    },
    {
        category: "Gestion de l'offre et des sessions",
        services: [
            { name: "Catalogue", icon: Clipboard, color: "from-cyan-50 to-cyan-100", route: "/catalog" },
            { name: "Projets", icon: Rocket, color: "from-violet-50 to-violet-100", route: "/app/account/project" },
            { name: "Agenda", icon: Calendar, color: "from-indigo-50 to-indigo-100", route: "/schedule" },
            { name: "Lieu et salle", icon: Building, color: "from-gray-50 to-gray-100", route: "/location" },
            { name: "Inscription en ligne", icon: PenTool, color: "from-teal-50 to-teal-100", route: "/online-registration" }
        ]
    },
    {
        category: "Gestion documentaires",
        services: [
            { name: "Dossier", icon: Folder, color: "from-blue-50 to-blue-100", route: "/files" },
            { name: "Photos", icon: Camera, color: "from-pink-50 to-pink-100", route: "/photos" },
        ]
    },
    {
        category: "Gestion client",
        services: [
            { name: "Clients", icon: User, color: "from-purple-50 to-purple-100", route: "/clients" },
            { name: "Factures", icon: CreditCard, color: "from-green-50 to-green-100", route: "/invoices" },
        ]
    },
    {
        category: "Suivi & Pilotage",
        services: [
            { name: "Analytics", icon: TrendingUp, color: "from-emerald-50 to-emerald-100", route: "/analytics" },
            { name: "Reporting", icon: FileBarChart, color: "from-blue-50 to-blue-100", route: "/reporting" },
        ]
    },
    {
        category: "Infrastructure & accès",
        services: [
            { name: "Licence", icon: ShoppingCart, color: "from-orange-50 to-orange-100", route: "/licenses" },
            { name: "Administrateur", icon: Settings, color: "from-gray-50 to-gray-100", route: "/admin" },
        ]
    }
];

const etpMicroservices = [
    {
        category: "Gestion RH",
        services: [
            { name: "Employés", icon: Users, color: "from-blue-50 to-blue-100", route: "/employees" },
            { name: "Formations", icon: GraduationCap, color: "from-emerald-50 to-emerald-100", route: "/company-trainings" },
            { name: "Évaluations", icon: BarChart3, color: "from-orange-50 to-orange-100", route: "/evaluations" },
            { name: "Compétences", icon: Target, color: "from-red-50 to-red-100", route: "/skills" }
        ]
    },
    {
        category: "Gestion Financière",
        services: [
            { name: "Budget formation", icon: DollarSign, color: "from-green-50 to-green-100", route: "/training-budget" },
            { name: "Factures", icon: CreditCard, color: "from-teal-50 to-teal-100", route: "/invoices" },
            { name: "Contrats", icon: FileText, color: "from-purple-50 to-purple-100", route: "/contracts" },
            { name: "ROI Formation", icon: TrendingUp, color: "from-indigo-50 to-indigo-100", route: "/training-roi" }
        ]
    },
    ...commonMicroservices
];

// Training center-specific microservices
const trainingCenterMicroservices = [
    {
        category: "Gestion pédagogique",
        services: [
            { name: "Apprenants", icon: Users, color: "from-blue-50 to-blue-100", route: "/students" },
            { name: "Formateurs", icon: GraduationCap, color: "from-emerald-50 to-emerald-100", route: "/trainers" },
            { name: "Présence", icon: CheckCircle, color: "from-green-50 to-green-100", route: "/attendance" },
            { name: "Évaluations", icon: BarChart3, color: "from-orange-50 to-orange-100", route: "/evaluations" },
            { name: "Support cours", icon: BookOpen, color: "from-amber-50 to-amber-100", route: "/course-materials" },
            { name: "Compétences", icon: Target, color: "from-red-50 to-red-100", route: "/skills" },
            { name: "LMS", icon: Monitor, color: "from-slate-50 to-slate-100", route: "/lms" },
            { name: "Certifications", icon: Award, color: "from-yellow-50 to-yellow-100", route: "/certifications" }
        ]
    },
    {
        category: "Gestion de l'offre",
        services: [
            { name: "Catalogue", icon: Clipboard, color: "from-cyan-50 to-cyan-100", route: "/catalog" },
            { name: "Sessions", icon: Calendar, color: "from-indigo-50 to-indigo-100", route: "/sessions" },
            { name: "Salles", icon: Building, color: "from-gray-50 to-gray-100", route: "/rooms" },
            { name: "Inscriptions", icon: PenTool, color: "from-teal-50 to-teal-100", route: "/enrollments" },
            { name: "Programme", icon: Rocket, color: "from-violet-50 to-violet-100", route: "/programs" }
        ]
    },
    {
        category: "Gestion documentaire",
        services: [
            { name: "Dossiers", icon: Folder, color: "from-blue-50 to-blue-100", route: "/files" },
            { name: "Photos", icon: Camera, color: "from-pink-50 to-pink-100", route: "/photos" },
            { name: "Ressources", icon: Database, color: "from-purple-50 to-purple-100", route: "/resources" }
        ]
    },
    {
        category: "Gestion client",
        services: [
            { name: "Prospects", icon: UserCheck, color: "from-emerald-50 to-emerald-100", route: "/prospects" },
            { name: "Clients", icon: Briefcase, color: "from-blue-50 to-blue-100", route: "/clients" },
            { name: "Facturation", icon: CreditCard, color: "from-green-50 to-green-100", route: "/billing" },
            { name: "Devis", icon: FileText, color: "from-orange-50 to-orange-100", route: "/quotes" }
        ]
    },
    {
        category: "Suivi & Pilotage",
        services: [
            { name: "Analytics", icon: TrendingUp, color: "from-emerald-50 to-emerald-100", route: "/analytics" },
            { name: "Reporting", icon: FileBarChart, color: "from-blue-50 to-blue-100", route: "/reporting" },
            { name: "Satisfaction", icon: Star, color: "from-yellow-50 to-yellow-100", route: "/satisfaction" },
            { name: "Planning", icon: Clock, color: "from-indigo-50 to-indigo-100", route: "/schedule" }
        ]
    },
    {
        category: "Infrastructure",
        services: [
            { name: "Licences", icon: ShoppingCart, color: "from-orange-50 to-orange-100", route: "/licenses" },
            { name: "Administration", icon: Settings, color: "from-gray-50 to-gray-100", route: "/admin" },
            { name: "Cloud", icon: Cloud, color: "from-sky-50 to-sky-100", route: "/cloud" }
        ]
    },
    ...commonMicroservices
];

// Individual user-specific microservices
const individualMicroservices = [
    {
        category: "Découverte",
        services: [
            { name: "Catalogue", icon: Clipboard, color: "from-cyan-50 to-cyan-100", route: "/catalog" },
            { name: "Formations", icon: GraduationCap, color: "from-green-50 to-green-100", route: "/trainings" },
            { name: "Centres", icon: MapPin, color: "from-orange-50 to-orange-100", route: "/centers" },
            { name: "Évaluations", icon: Star, color: "from-pink-50 to-pink-100", route: "/reviews" }
        ]
    },
    {
        category: "Suivi personnel",
        services: [
            { name: "Mes notes", icon: FileText, color: "from-slate-50 to-slate-100", route: "/notes" },
            { name: "Favoris", icon: Star, color: "from-amber-50 to-amber-100", route: "/favorites" },
            { name: "Historique", icon: Clock, color: "from-gray-50 to-gray-100", route: "/history" },
            { name: "Objectifs", icon: Target, color: "from-teal-50 to-teal-100", route: "/goals" }
        ]
    },
    {
        category: "Communication",
        services: [
            { name: "Messages", icon: Mail, color: "from-violet-50 to-violet-100", route: "/messages" },
            { name: "Support", icon: Phone, color: "from-emerald-50 to-emerald-100", route: "/support" }
        ]
    },
    ...commonMicroservices
];

/**
 * Get microservices configuration based on user type
 * @param {string} userType - Type of user ('company', 'training_center', 'individual')
 * @returns {Array} Array of microservice categories and services
 */
export const getMicroservicesForUserType = (userType) => {
    switch (userType?.toLowerCase()) {
        case 'cfp':
            return cfpMicroservices;

        case 'etp':
            return etpMicroservices;

        case 'particular':
        default:
            return individualMicroservices;
    }
};

/**
 * Get user type display name in French
 * @param {string} userType - Type of user
 * @returns {string} Display name in French
 */
export const getUserTypeDisplayName = (userType) => {
    switch (userType?.toLowerCase()) {
        case 'etp':
            return 'Entreprise';

        case 'cfp':
            return 'Centre de formation';

        case 'particular':
        default:
            return 'Particulier';
    }
};

/**
 * Get available user types
 * @returns {Array} Array of user types with their configurations
 */
export const getAvailableUserTypes = () => {
    return [
        {
            key: 'particular',
            name: 'Particulier',
            description: 'Apprenant individuel cherchant des formations',
            microservices: individualMicroservices
        },
        {
            key: 'etp',
            name: 'Entreprise',
            description: 'Organisation gérant la formation de ses employés',
            microservices: etpMicroservices
        },
        {
            key: 'cfp',
            name: 'Centre de formation',
            description: 'Organisme proposant des formations',
            microservices: cfpMicroservices
        }
    ];
};