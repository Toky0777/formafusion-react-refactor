import {
  FileText,
  Users,
  Building,
  BookOpen,
  Folder,
  UserCheck,
  Briefcase,
  MapPin,
  User,
  CreditCard,
  ReceiptText,
  Signature,
} from "lucide-react";

export const getTabIcon = (type) => {
  const iconMap = {
    learner: <Users className="w-4 h-4" />,
    entreprise: <Building className="w-4 h-4" />,
    course: <BookOpen className="w-4 h-4" />,
    folder: <Folder className="w-4 h-4" />,
    trainer: <UserCheck className="w-4 h-4" />,
    project: <Briefcase className="w-4 h-4" />,
    projectNeighborhood: <MapPin className="w-4 h-4" />,
    project_reference: <FileText className="w-4 h-4" />,
    projectCity: <MapPin className="w-4 h-4" />,
    projectPlace: <MapPin className="w-4 h-4" />,
    referent: <User className="w-4 h-4" />,
    referent_customer: <User className="w-4 h-4" />,
    invoice: <CreditCard className="w-4 h-4" />,
    quote: <ReceiptText className="w-4 h-4" />,
    purchase_order: <Signature className="w-4 h-4" />,
    particulars: <User className="w-4 h-4" />,
  };

  return iconMap[type] || <FileText className="w-4 h-4" />;
};

export const getTabLabel = (type) => {
  const labelMap = {
    learner: "Apprenants",
    entreprise: "Clients",
    course: "Cours",
    folder: "Dossier",
    trainer: "Formateurs",
    project: "Projets",
    projectNeighborhood: "Projet ayant ce quartier",
    project_reference: "Projet ayant ce réference",
    projectCity: "Projet ayant cette ville",
    projectPlace: "Projet ayant cette lieu",
    referent: "Référents",
    referent_customer: "Référents des clients",
    invoice: "Facture",
    quote: "Devis",
    purchase_order: "Bon de commande",
    particulars: "Particulier",
  };

  return labelMap[type] || type;
};
