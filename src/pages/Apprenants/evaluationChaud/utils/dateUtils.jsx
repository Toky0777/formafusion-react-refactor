export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error(error);
    return dateString;
  }
};

export const formatDateString = (dateString) => {
  const date = new Date(dateString); // transforme "2016-01-20" en objet Date
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
}

export const isActive = (startDate, endDate) => {
  if (!startDate || !endDate) return 'upcoming';
  
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) return 'upcoming';
  if (now > end) return 'expired';
  return 'active';
};

export const getStatusVariant = (status) => {
  switch (status) {
    case 'active': return 'success';
    case 'upcoming': return 'warning';
    case 'expired': return 'error';
    default: return 'warning';
  }
};