import { User, Star } from "lucide-react";
import { linkImageFormateurs } from "../../utils/global";

const CardFormateur = ({
  id,
  name,
  firstname,
  image,
  note,
  onselect,
  isactive,
  sumHourSession,
}) => {
  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.round(rating);
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3 h-3 ${
            i <= filledStars
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      );
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  return (
    <div
      key={id}
      onClick={onselect}
      className={`
        relative group cursor-pointer rounded-xl overflow-hidden
        transition-all duration-300 ease-out border border-gray-200
        ${
          isactive
            ? "shadow-lg  scale-[1.02]"
            : "bg-white hover:shadow-lg hover:scale-[1.01] "
        }
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar Section */}
          <div className="relative flex-shrink-0">
            <div className="relative w-14 h-14 rounded-full overflow-hidden transition-all">
              {image ? (
                <img
                  src={`${linkImageFormateurs}/${image}`}
                  alt={`${firstname} ${name}`}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-7 h-7" />
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-grow min-w-0">
            {/* Name */}
            <div className="mb-2">
              <h3
                className="
                font-semibold text-base leading-tight truncate"
              >
                {firstname}
              </h3>
              <p
                className="
                text-sm truncate"
              >
                {name}
              </p>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between gap-3">
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                {renderStars(note)}
                {note && (
                  <span
                    className="
                    text-xs font-medium"
                  >
                    {note}
                  </span>
                )}
              </div>
              {/* Hours
              <div
                className="
                flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              >
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{sumHourSession}h</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFormateur;
