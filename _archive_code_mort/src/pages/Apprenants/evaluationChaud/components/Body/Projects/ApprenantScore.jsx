import React from 'react';

const ApprenantScores = ({ apprenant }) => {
  const score1 = apprenant.score1 || 0;
  const score2 = apprenant.score2 || 0;
  const maxScore1 = apprenant.maxScore1 || 100;
  const maxScore2 = apprenant.maxScore2 || 100;

  const percentage1 = maxScore1 > 0 ? (score1 / maxScore1) * 100 : 0;
  const percentage2 = maxScore2 > 0 ? (score2 / maxScore2) * 100 : 0;

  return (
    <div className="inline-flex items-center gap-2">
      {/* Score 1 */}
      <span className="px-2 py-1 h-[35px] w-[27px] border-[1px] border-gray-200 rounded-md text-sm text-center flex items-center justify-center text-gray-800 relative overflow-hidden bg-white shadow-sm">
        {score1}
        <span 
          className="absolute bottom-0 left-0 w-full bg-gray-700/50 z-[-1] rounded-b-md transition-all duration-300"
          style={{ height: `${percentage1}%` }}
        ></span>
      </span>
      
      {/* Score 2 */}
      <span className="px-2 py-1 h-[35px] w-[27px] border-[1px] border-gray-200 rounded-md text-sm text-center flex items-center justify-center text-gray-800 relative overflow-hidden bg-white shadow-sm">
        {score2}
        <span 
          className="absolute bottom-0 left-0 w-full bg-purple-500/50 z-[-1] rounded-b-md transition-all duration-300"
          style={{ height: `${percentage2}%` }}
        ></span>
      </span>
    </div>
  );
};

export default ApprenantScores;