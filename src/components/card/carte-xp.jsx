export function CarteXp({ data }) {
  if (!data) return null;

  const progress = data?.getExpById?.total_points || 0;
  const niveaux = data?.niveauGamification || [];

  // Trouver le niveau actuel
  const currentLevel = niveaux
    .slice()
    .reverse()
    .find((n) => progress >= n.min_points);

  // Prochain niveau
  const nextLevel = niveaux.find((n) => n.min_points > progress);

  // Calcul du pourcentage dans l’intervalle [min, max]
  const min = currentLevel?.min_points || 0;
  const max = nextLevel?.min_points || min + 100;
  const percent = ((progress - min) / (max - min)) * 100;

  const pointsToNext = nextLevel ? nextLevel.min_points - progress : null;

  return (
    <div className="flex flex-col gap-4 p-5 bg-white border rounded-lg shadow">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-lg font-semibold text-gray-700">
          <span className="text-orange-500">🔥</span>
          {progress} XP
        </span>
        <span className="text-sm text-gray-500">
          {pointsToNext !== null
            ? `${pointsToNext} XP pour le prochain niveau`
            : "Niveau max"}
        </span>
      </div>
      <div className="w-full h-3 overflow-hidden bg-gray-200 rounded-full">
        <div
          className="h-full transition-all bg-gradient-to-r from-blue-500 to-purple-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>
          {currentLevel?.classement || "Débutant"}
        </span>
        <span>
          {nextLevel?.classement || "Max"}
        </span>
      </div>
    </div>
  );
}