import { Trophy } from "lucide-react";

export default function TopLearners({ data }) {
  if (!data) return null;

  const topLearners = data.topFive || [];

  return (
    <div className="p-6 bg-white border rounded-lg shadow">
      <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-gray-700">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Top 5 Apprenants
      </h3>
      <div className="space-y-2">
        {topLearners.map((learner, i) => (
          <LearnerCard key={i} {...learner} />
        ))}
      </div>
    </div>
  );
}

function LearnerCard({ rang, name, firstName, libelle_niveau, total_points }) {
  const rankDisplay =
    rang === 1 ? "🥇" : rang === 2 ? "🥈" : rang === 3 ? "🥉" : `${rang}.`;

  return (
    <div className="flex items-center justify-between px-3 py-2 rounded bg-gray-50">
      <div className="flex items-center gap-2">
        <span className="text-lg">{rankDisplay}</span>
        <div>
          <span className="font-medium text-gray-800">{firstName} {name}</span>
          <span className="block text-xs text-gray-500">{libelle_niveau}</span>
        </div>
      </div>
      <span className="text-xs font-bold text-indigo-700">{total_points} XP</span>
    </div>
  );
}