import React, { useState } from 'react';
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
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200">
          <button
            onClick={toggleAccordion}
            className="w-full p-6 text-left hover:bg-white/50 transition-colors duration-200"
            aria-expanded={isOpen}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <StarRating rating={overallRating} size="lg" />
                <span className="text-xl font-bold text-slate-900">
                  {overallRating.toFixed(1)}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                  {totalReviews} Avis
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex-1">
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
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3 flex-wrap">
                      <StarRating rating={section.rating} />
                      <span className="text-lg font-semibold text-slate-900">
                        {section.rating.toFixed(1)}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">
                        {section.reviewCount} Avis
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800 flex-1">
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