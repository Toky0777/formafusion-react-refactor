
export const clientsData = [
  {
    id: 1,
    name: "2ACF",
    location: "Antananarivo",
    ranking: 3,
    frequency: "regulier",
    projectsPerYear: 6,
    lastTrainingDays: 18,
    ca2025: "125K€",
    caEvolution: 15,
    learners: 245,
    learnersEvolution: 12,
    email: "2ACF@forma-fusion.com",
    phone: "",
    type: "Entreprise privée",
    logo: "2ACF",
    hasCustomLogo: false,
    caTrend: "up",
    learnersTrend: "up"
  },
    {
      id: 2,
      name: "2ADH",
      location: "Antananarivo",
      ranking: 1,
      frequency: "regulier",
      projectsPerYear: 8,
      lastTrainingDays: 12,
      ca2025: "285K€",
      caEvolution: 23,
      learners: 456,
      learnersEvolution: 18,
      email: "2adh@forma-fusion.com",
      phone: "032 70 878 17",
      type: "Entreprise privée",
      logo: "2ADH",
      hasCustomLogo: true,
      caTrend: "up",
      learnersTrend: "up"
    },
    {
      id: 3,
      name: "ACF",
      location: "Antananarivo Atsimo",
      ranking: 5,
      frequency: "occasionnel",
      projectsPerYear: 1,
      lastTrainingDays: 287,
      ca2025: "98K€",
      caEvolution: -5,
      learners: 189,
      learnersEvolution: -3,
      email: "acf@forma-fusion.com",
      phone: "",
      type: "Entreprise privée",
      logo: "ACF",
      hasCustomLogo: true,
      caTrend: "down",
      learnersTrend: "down"
    },
];



export const frequencyConfig = {
  regulier: { label: "Client régulier", class: "frequency-regulier" },
  frequent: { label: "Client fréquent", class: "frequency-frequent" },
  occasionnel: { label: "Client occasionnel", class: "frequency-occasionnel" },
  rare: { label: "Client rare / inactif", class: "frequency-rare" },
  perdu: { label: "Client perdu / ancien", class: "frequency-perdu" },
  prospect : { label: "Client prospect ", class: "frequency-rare" },
  nouveau: { label: "Nouveau client", class: "frequency-nouveau" },
  inactif: { label: "Client inactif", class: "frequency-inactif" }
};

export const getRecommendedAction = (frequency) => {
  const actions = {
    regulier: { title: "💎 Action recommandée", text: "Offre VIP, avant-première nouveaux modules, suivi personnalisé" },
    frequent: { title: "🎁 Action recommandée", text: "Programme de fidélité, avantages sur volume" },
    occasionnel: { title: "📢 Action recommandée", text: "Relance annuelle, offres ciblées sur mesure" },
    rare: { title: "⚠️ Action recommandée", text: "Campagne de réactivation urgente, offre spéciale retour" },
    perdu: { title: "🚨 Action recommandée", text: "Enquête satisfaction, offre retour exceptionnelle, contact direct" },
    inactif: { title: "⚠️ Action recommandée", text: "Campagne de réactivation urgente, offre spéciale retour" },
    nouveau: { title: "🌟 Action recommandée", text: "Accueil VIP, suivi post-formation, demande d'avis satisfaction" }
  };
  return actions[frequency] || actions.regulier;
};

export const logoImages = {
  "2ADH": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23FF9800' d='M30 70L50 30L70 70z'/%3E%3Cpath fill='%232196F3' d='M50 30L70 70L90 50z'/%3E%3C/svg%3E",
  // ... autres logos
};