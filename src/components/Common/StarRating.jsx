import { Star } from 'lucide-react';

const StarRating = ({ rating, reviewCount, size = 'sm' }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    const starSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(
                <Star key={i} className={`${starSize} text-yellow-400 fill-yellow-400`} />
            );
        } else if (i === fullStars && hasHalfStar) {
            stars.push(
                <div key={i} className={`${starSize} relative`}>
                    <Star className={`${starSize} text-gray-300 fill-gray-300 absolute`} />
                    <div className="w-1/2 overflow-hidden">
                        <Star className={`${starSize} text-yellow-400 fill-yellow-400`} />
                    </div>
                </div>
            );
        } else {
            stars.push(
                <Star key={i} className={`${starSize} text-gray-300 fill-gray-300`} />
            );
        }
    }

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {stars}
            </div>
            <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-600 font-medium`}>
                {rating.toFixed(1)}
            </span>

            <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-500`}>
                ({reviewCount} avis)
            </span>
        </div>
    );
};

export default StarRating;