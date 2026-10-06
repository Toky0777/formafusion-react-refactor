// utils/formatMontant.js
export const formatMontant = (montant, currencyUnit = "Ariary", countryName = "Madagascar", currencyCode = "Ar") => {
  if (!montant && montant !== 0) return "—";
  
  // Format pour Madagascar - Ariary
  if (countryName === "Madagascar" || currencyUnit === "Ariary" || currencyUnit === "Ariary Malagasy") {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant) + ` ${currencyCode}`; // "1 000 000 Ar"
  }
  
  // Format pour Côte d'Ivoire - XOF (Franc CFA)
  if (countryName === "Côte d'Ivoire" || countryName === "Cote d'Ivoire" || currencyUnit === "XOF" || currencyUnit === "Franc CFA") {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant) + ` F CFA`; // "1 000 000 F CFA"
  }
  
  // Pour les autres devises (Euro, Dollar, etc.)
  const currencyMap = {
    'Euro': 'EUR',
    'Dollar': 'USD',
    'Dollar US': 'USD',
    'Franc': 'XOF'
  };
  
  const isoCode = currencyMap[currencyUnit] || currencyUnit;
  
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: isoCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant);
  } catch (error) {
    // Fallback au format générique
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant) + ` ${currencyUnit}`;
  }
};