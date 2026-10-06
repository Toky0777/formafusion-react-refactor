export const StatusBadge = ({ status }) => {
  // Configuration complète des statuts avec couleurs, labels et icônes
  const statusConfig = {
    en_preparation: {
      label: "En préparation",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-100",
    },
    en_cours: {
      label: "En cours",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-100",
    },
    planifie: {
      label: "Planifié",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-800",
      borderColor: "border-indigo-100",
    },
    termine: {
      label: "Terminé",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      borderColor: "border-green-100",
    },
    annule: {
      label: "Annulé",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      borderColor: "border-red-100",
    },
    reporte: {
      label: "Reporté",
      bgColor: "bg-orange-50",
      textColor: "text-orange-800",
      borderColor: "border-orange-100",
    },
    cloture: {
      label: "Clôturé",
      bgColor: "bg-gray-50",
      textColor: "text-gray-800",
      borderColor: "border-gray-100",
    }
  };

  // Normalisation robuste du statut avec gestion des erreurs
  const normalizeStatus = (statusValue) => {
    if (!statusValue) return 'inconnu';
    
    // Si c'est un objet, essayer d'extraire une propriété pertinente
    if (typeof statusValue === 'object') {
      const value = statusValue.label || statusValue.status || statusValue.name || statusValue.value;
      return String(value || 'inconnu')
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_");
    }
    
    // Si c'est une chaîne
    if (typeof statusValue === 'string') {
      return statusValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_");
    }
    
    // Pour les autres types (number, boolean, etc.)
    return String(statusValue)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_");
  };

  const normalizedStatus = normalizeStatus(status);

  // Récupère la configuration du statut ou utilise des valeurs par défaut
  const config = statusConfig[normalizedStatus] || {
    label: String(status || "Inconnu"),
    bgColor: "bg-gray-50",
    textColor: "text-gray-800",
    borderColor: "border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} border ${config.borderColor} transition-colors duration-200`}
      title={`Statut: ${config.label}`}
    >
      {config.label}
    </span>
  );
};