import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // on utilise react-icons

export default function StarRating({ rating }) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400 w-4 h-4" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 w-4 h-4" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400 w-4 h-4" />);
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>;
}
