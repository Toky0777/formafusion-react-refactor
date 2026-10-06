
const StarRating = ({ rating, maxRating = 5, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={i} className={`fas fa-star text-yellow-500 ${sizeClasses[size]}`}></i>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i key="half" className={`fas fa-star-half-alt text-yellow-500 ${sizeClasses[size]}`}></i>
      );
    }

    const remainingStars = maxRating - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className={`fas fa-star text-slate-300 ${sizeClasses[size]}`}></i>
      );
    }

    return stars;
  };

  return (
    <div className="inline-flex items-center gap-1">
      {renderStars()}
    </div>
  );
};

export default StarRating;