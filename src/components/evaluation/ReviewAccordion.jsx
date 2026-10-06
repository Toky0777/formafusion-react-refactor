import { useState } from 'react';
import StarRating from './StarRating';
import ReviewTable from './ReviewTable';

const ReviewAccordion = ({
  title,
  overallRating,
  totalReviews,
  sections
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="overflow-hidden bg-white border shadow-lg rounded-xl border-slate-200">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-purple-50 to-pink-50 border-slate-200">
          <button
            onClick={toggleAccordion}
            className="w-full p-6 text-left transition-colors duration-200 hover:bg-white/50"
            aria-expanded={isOpen}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-3">
                <StarRating rating={overallRating} size="lg" />
                <span className="text-xl font-bold text-slate-900">
                  {overallRating.toFixed(1)}
                </span>
                <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                  {totalReviews} Avis
                </span>
              </div>
              <h1 className="flex-1 text-xl font-bold sm:text-2xl text-slate-800">
                {title}
              </h1>
              <div className="hidden sm:block">
                <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-slate-500 transition-transform duration-200`}></i>
              </div>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'opacity-100' : 'opacity-0 max-h-0'}`}>
          {isOpen && (
            <div className="p-6 space-y-8">
              {sections.map((section) => (
                <div key={section.id} className="space-y-4">
                  {/* Section Header */}
                  <div className="flex flex-col gap-3 pb-4 border-b sm:flex-row sm:items-center border-slate-200">
                    <div className="flex flex-wrap items-center gap-3">
                      <StarRating rating={section.rating} />
                      <span className="text-lg font-semibold text-slate-900">
                        {section.rating.toFixed(1)}
                      </span>
                      <span className="px-3 py-1 text-sm rounded-full bg-slate-100 text-slate-700">
                        {section.reviewCount} Avis
                      </span>
                    </div>
                    <h2 className="flex-1 text-lg font-semibold text-slate-800">
                      {section.title}
                    </h2>
                  </div>

                  {/* Review Table */}
                  <ReviewTable reviews={section.reviews} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewAccordion;