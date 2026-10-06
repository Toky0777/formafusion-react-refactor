import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "navbar": {
        "open":" 🚧 La plateforme est en BETA ouverte !",
        "message":"  Nous travaillons activement pour l'améliorer, et vos retours sont essentiels.",
        "contactLink": " Contactez-nous ici",
      },

      // Navigation et général
      "Welcome to React": "Welcome to React and react-i18next",
      "Back": "Back",
      "Create": "Create",
      "Cancel": "Cancel",
      "Delete": "Delete",
      "Edit": "Edit",
      "Save": "Save",
      "Search": "Search",
      "Filter": "Filter",
      "Reset": "Reset",
      "All": "All",
      "Loading": "Loading...",
      "French": "French",
      "English": "English",
      
      // QCM Creation
      "QCM Creation": "QCM Creation",
      "Go Back": "Go Back",
      "General Information": "General Information",
      "Questions-Answers": "Questions-Answers",
      "Title": "Title",
      "Training Domain": "Training Domain",
      "Please choose the domain": "Please choose the domain",
      "Description": "Description",
      "Unit Price": "Unit Price",
      "Duration (minutes)": "Duration (minutes)",
      "Add new section": "Add new section",
      "Create QCM": "Create QCM",
      "QCM created successfully!": "QCM created successfully!",
      "You are not connected": "You are not connected",
      "Error creating QCM": "Error creating QCM",
      
      // QCM Index
      "Welcome to the world of tests": "Welcome to the world of tests",
      "Manage and organize all your knowledge tests in one place": "Manage and organize all your knowledge tests in one place",
      "Filters and search": "Filters and search",
      "result": "result",
      "results": "results",
      "Reset filters": "Reset filters",
      "No test found": "No test found",
      "No test matches your search and selected domain": "No test matches your search and selected domain",
      "No test matches": "No test matches",
      "No test in this domain": "No test in this domain",
      "Try selecting another domain or reset the filter": "Try selecting another domain or reset the filter",
      "See all tests": "See all tests",
      "No test available": "No test available",
      "Create your first test to get started": "Create your first test to get started",
      "Create a test": "Create a test",
      "Clear search": "Clear search",
      "Test deleted successfully": "Test deleted successfully",
      "Error deleting QCM": "Error deleting QCM",
      
      // ResultQcm - Nouvelles traductions
      "Global Results": "Global Results",
      "Chart": "Chart",
      "Return": "Return",
      "Filters": "Filters",
      "Name/First Name": "Name/First Name",
      "Search by name...": "Search by name...",
      "Company": "Company",
      "Search by company...": "Search by company...",
      "QCM": "QCM",
      "Search by QCM...": "Search by QCM...",
      "Date": "Date",
      "Minimum Points": "Minimum Points",
      "Min": "Min",
      "Maximum Points": "Maximum Points",
      "Max": "Max",
      "Level": "Level",
      "All levels": "All levels",
      "Beginner": "Beginner",
      "Intermediate": "Intermediate",
      "Advanced": "Advanced",
      "Campaign": "Campaign",
      "All campaigns": "All campaigns",
      "Reset filters": "Reset filters",
      "results displayed": "results displayed",
      "No result found": "No result found",
      "Try modifying your search criteria": "Try modifying your search criteria",
      "Results Chart": "Results Chart",
      "Close": "Close",
      "Loading data...": "Loading data...",
      "Error": "Error",
      "Retry": "Retry",
      "Global Statistics": "Global Statistics",
      "Total users": "Total users",
      "Total sessions": "Total sessions",
      "Average score": "Average score",
      "Maximum points": "Maximum points",
      "Error loading data": "Error loading data",
      "Server error": "Server error",
      "Unknown error": "Unknown error",
      "Connection error - Check your internet connection": "Connection error - Check your internet connection",
      "Timeout - Server is taking too long to respond": "Timeout - Server is taking too long to respond",
      "Missing identifiers": "Missing identifiers",
      "No data received from server": "No data received from server",
      "Error retrieving data": "Error retrieving data",
      
      // Colonnes du tableau
      "Rank": "Rank",
      "Name": "Name",
      "First Name": "First Name",
      "Points": "Points",
      "Action": "Action",
      
      // Messages de notification
      "Success": "Success",
      "Error": "Error",
      "Warning": "Warning",
      "Info": "Info",
      
      // Boutons et actions
      "Add": "Add",
      "Remove": "Remove",
      "Modify": "Modify",
      "View": "View",
      "Download": "Download",
      "Upload": "Upload",
      "Open": "Open",
      "Next": "Next",
      "Previous": "Previous",
      "Continue": "Continue",
      "Finish": "Finish",
      "Start": "Start",
      "Stop": "Stop",
      "Pause": "Pause",
      "Resume": "Resume",
      
      // Formulaires
      "Required field": "Required field",
      "Optional field": "Optional field",
      "Please fill this field": "Please fill this field",
      "Invalid format": "Invalid format",
      "Too short": "Too short",
      "Too long": "Too long",
      
      // Temps et dates
      "minutes": "minutes",
      "hours": "hours",
      "days": "days",
      "weeks": "weeks",
      "months": "months",
      "years": "years",
      "Today": "Today",
      "Yesterday": "Yesterday",
      "Tomorrow": "Tomorrow",
      
      // Statuts
      "Active": "Active",
      "Inactive": "Inactive",
      "Pending": "Pending",
      "Completed": "Completed",
      "In Progress": "In Progress",
      "Draft": "Draft",
      "Published": "Published",
      "Archived": "Archived",

      //ResultsQcm
        "Name/First Name": "Name/First Name",
        "Search by name...": "Search by name...",
        "Search by company...": "Search by company...",
        "Search by QCM...": "Search by QCM...",
        "Minimum Points": "Minimum Points",
        "Maximum Points": "Maximum Points",
        "All levels": "All levels",
        "All campaigns": "All campaigns",
        "Reset filters": "Reset filters",
        "results displayed": "results displayed",
        "No results found": "No results found",
        "Try modifying your search criteria": "Try modifying your search criteria",
        "Results Chart": "Results Chart",
        "Close modal": "Close modal",
        "Loading data...": "Loading data...",
        "Retry": "Retry",
        "Global Statistics": "Global Statistics",
        "Total users": "Total users",
        "Total sessions": "Total sessions",
        "Average score": "Average score",
        "Maximum points": "Maximum points",

      // Navigation
      "navigation": {
        "home": "Home",
        "createTest": "Create Test",
        "createQcm": "Create QCM",
        "campaign": "Campaign",
        "launchCampaign": "Launch Campaign",
        "campaignList": "Campaign List",
        "invitationList": "Invitation List",
        "results": "Results",
        "globalResults": "Global Results",
        "buyCredits": "Buy Credits",
        "purchaseHistory": "Purchase History",
        "purchaseHistoryCredits": "Purchase History",
        "campaignAndInvitations": "Campaigns & Invitations"
      }
    }
  },
  fr: {
    translation: {
      "open":" 🚧 La plateforme est en BETA ouverte !",
      "message":"  Nous travaillons activement pour l'améliorer, et vos retours sont essentiels.",
      "contactLink": " Contactez-nous ici",
      // Navigation et général
      "Welcome to React": "Bienvenue à React et react-i18next",
      "Back": "Retour",
      "Create": "Créer",
      "Cancel": "Annuler",
      "Delete": "Supprimer",
      "Edit": "Modifier",
      "Save": "Enregistrer",
      "Search": "Rechercher",
      "Filter": "Filtrer",
      "Reset": "Réinitialiser",
      "All": "Tous",
      "Loading": "Chargement...",
      "French": "Français",
      "English": "Anglais",
      
      // QCM Creation
      "QCM Creation": "Création de QCM",
      "Go Back": "Retour en arrière",
      "General Information": "Informations générales",
      "Questions-Answers": "Questions-Réponses",
      "Title": "Titre",
      "Training Domain": "Domaine de Formation",
      "Please choose the domain": "Veuillez choisir le domaine",
      "Description": "Description",
      "Unit Price": "Prix Unitaire",
      "Duration (minutes)": "Durée (minutes)",
      "Add new section": "Ajouter une nouvelle section",
      "Create QCM": "Créer le QCM",
      "QCM created successfully!": "QCM créé avec succès !",
      "You are not connected": "Vous n'êtes pas connecté",
      "Error creating QCM": "Erreur lors de la création du QCM",
      
      // QCM Index
      "Welcome to the world of tests": "Bienvenu dans le monde des tests",
      "Manage and organize all your knowledge tests in one place": "Gérez et organisez tous vos tests de connaissances en un seul endroit",
      "Filters and search": "Filtres et recherche",
      "result": "résultat",
      "results": "résultats",
      "Reset filters": "Réinitialiser les filtres",
      "No test found": "Aucun test trouvé",
      "No test matches your search and selected domain": "Aucun test ne correspond à votre recherche et au domaine sélectionné",
      "No test matches": "Aucun test ne correspond à",
      "No test in this domain": "Aucun test dans ce domaine",
      "Try selecting another domain or reset the filter": "Essayez de sélectionner un autre domaine ou réinitialisez le filtre",
      "See all tests": "Voir tous les tests",
      "No test available": "Aucun test disponible",
      "Create your first test to get started": "Créez votre premier test pour commencer",
      "Create a test": "Créer un test",
      "Clear search": "Effacer la recherche",
      "Test deleted successfully": "Test supprimé avec succès",
      "Error deleting QCM": "Erreur lors de la suppression du QCM",
      
      // ResultQcm - Nouvelles traductions
      "Global Results": "Résultats globaux",
      "Chart": "Diagramme",
      "Return": "Retour",
      "Filters": "Filtres",
      "Name/First Name": "Nom/Prénom",
      "Search by name...": "Rechercher par nom...",
      "Company": "Entreprise",
      "Search by company...": "Rechercher par entreprise...",
      "QCM": "QCM",
      "Search by QCM...": "Rechercher par QCM...",
      "Date": "Date",
      "Minimum Points": "Points minimum",
      "Min": "Min",
      "Maximum Points": "Points maximum",
      "Max": "Max",
      "Level": "Niveau",
      "All levels": "Tous les niveaux",
      "Beginner": "Débutant",
      "Intermediate": "Intermédiaire",
      "Advanced": "Avancé",
      "Campaign": "Campagne",
      "All campaigns": "Toutes les campagnes",
      "Reset filters": "Réinitialiser les filtres",
      "results displayed": "résultats affichés",
      "No result found": "Aucun résultat trouvé",
      "Try modifying your search criteria": "Essayez de modifier vos critères de recherche",
      "Results Chart": "Diagramme des résultats",
      "Close": "Fermer",
      "Loading data...": "Chargement des données...",
      "Error": "Erreur",
      "Retry": "Réessayer",
      "Global Statistics": "Statistiques globales",
      "Total users": "Total utilisateurs",
      "Total sessions": "Sessions totales",
      "Average score": "Score moyen",
      "Maximum points": "Points maximum",
      "Error loading data": "Erreur lors du chargement des données",
      "Server error": "Erreur serveur",
      "Unknown error": "Erreur inconnue",
      "Connection error - Check your internet connection": "Erreur de connexion - Vérifiez votre connexion internet",
      "Timeout - Server is taking too long to respond": "Timeout - Le serveur met trop de temps à répondre",
      "Missing identifiers": "Identifiants manquants",
      "No data received from server": "Aucune donnée reçue du serveur",
      "Error retrieving data": "Erreur lors de la récupération des données",
      
      // Colonnes du tableau
      "Rank": "Rang",
      "Name": "Nom",
      "First Name": "Prénom",
      "Points": "Points",
      "Action": "Action",
      
      // Messages de notification
      "Success": "Succès",
      "Error": "Erreur",
      "Warning": "Avertissement",
      "Info": "Information",
      
      // Boutons et actions
      "Add": "Ajouter",
      "Remove": "Supprimer",
      "Modify": "Modifier",
      "View": "Voir",
      "Download": "Télécharger",
      "Upload": "Téléverser",
      "Open": "Ouvrir",
      "Next": "Suivant",
      "Previous": "Précédent",
      "Continue": "Continuer",
      "Finish": "Terminer",
      "Start": "Démarrer",
      "Stop": "Arrêter",
      "Pause": "Pause",
      "Resume": "Reprendre",
      
      // Formulaires
      "Required field": "Champ requis",
      "Optional field": "Champ optionnel",
      "Please fill this field": "Veuillez remplir ce champ",
      "Invalid format": "Format invalide",
      "Too short": "Trop court",
      "Too long": "Trop long",
      
      // Temps et dates
      "minutes": "minutes",
      "hours": "heures",
      "days": "jours",
      "weeks": "semaines",
      "months": "mois",
      "years": "années",
      "Today": "Aujourd'hui",
      "Yesterday": "Hier",
      "Tomorrow": "Demain",
      
      // Statuts
      "Active": "Actif",
      "Inactive": "Inactif",
      "Pending": "En attente",
      "Completed": "Terminé",
      "In Progress": "En cours",
      "Draft": "Brouillon",
      "Published": "Publié",
      "Archived": "Archivé",

        //ResultsQcm
        "Name/First Name": "Nom/Prénom",
        "Search by name...": "Rechercher par nom...",
        "Search by company...": "Rechercher par entreprise...",
        "Search by QCM...": "Rechercher par QCM...",
        "Minimum Points": "Points minimum",
        "Maximum Points": "Points maximum",
        "All levels": "Tous les niveaux",
        "All campaigns": "Toutes les campagnes",
        "Reset filters": "Réinitialiser les filtres",
        "results displayed": "résultats affichés",
        "No results found": "Aucun résultat trouvé",
        "Try modifying your search criteria": "Essayez de modifier vos critères de recherche",
        "Results Chart": "Graphique des résultats",
        "Close modal": "Fermer la modal",
        "Loading data...": "Chargement des données...",
        "Retry": "Réessayer",
        "Global Statistics": "Statistiques globales",
        "Total users": "Total utilisateurs",
        "Total sessions": "Sessions totales",
        "Average score": "Score moyen",
        "Maximum points": "Points maximum",

      // Navigation
      "navigation": {
        "home": "Accueil",
        "createTest": "Créer un test",
        "createQcm": "Créer un QCM",
        "campaign": "Campagne",
        "launchCampaign": "Lancer une campagne",
        "campaignList": "Liste des campagnes",
        "invitationList": "Liste des invitations",
        "results": "Résultats",
        "globalResults": "Résultats globaux",
        "buyCredits": "Acheter des crédits",
        "purchaseHistory": "Historique des achats",
        "purchaseHistoryCredits": "Historique des achats",
        "campaignAndInvitations": "Campagnes et invitations"
      }
    }
  }
};

// Fonction pour obtenir la langue par défaut
const getDefaultLanguage = () => {
  // 1. Vérifier localStorage
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && ['en', 'fr'].includes(savedLanguage)) {
    return savedLanguage;
  }
  
  // 2. Vérifier la langue du navigateur
  const browserLanguage = navigator.language || navigator.userLanguage;
  if (browserLanguage) {
    const langCode = browserLanguage.split('-')[0];
    if (['en', 'fr'].includes(langCode)) {
      return langCode;
    }
  }
  
  // 3. Langue par défaut
  return 'fr';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDefaultLanguage(),
    fallbackLng: "fr",
    
    interpolation: {
      escapeValue: false
    },
    
    // Configuration pour la détection de langue
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
      checkWhitelist: true
    },
    
    // Langues supportées
    supportedLngs: ['en', 'fr'],
    
    // Configuration de débogage (à désactiver en production)
    debug: false,
    
    // Réaction aux changements de langue
    react: {
      useSuspense: false
    }
  });

// Écouter les changements de langue pour synchroniser le localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  
  // Optionnel : changer la langue du document HTML
  document.documentElement.lang = lng;
});

export default i18n;