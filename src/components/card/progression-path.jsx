
export default function ProgressionPath({ data }) {
  if (!data) return null;

  const progress = data.getExpById?.total_points ?? 0;
  const currentLevel = data.getExpById?.libelle_niveau ?? "Niveau inconnu";
  const niveaux = data.niveauGamification || [];

  return (
    <div className="flex flex-col gap-6 text-gray-700 bg-white border rounded-lg shadow-sm">
      <div className="p-6">
        <h3 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-700">
          <p className="text-xl">💪</p>
          Parcours de progression
        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
          {niveaux.map((n, i) => {
            const isCurrent = n.classement === currentLevel;
            const isFuture = n.min_points > progress;

            return (
              <Badge
                key={i}
                title={n.classement}
                xp={`${n.min_points}+ XP`}
                img={n.url_image}
                color={n.color} // 🔥 on récupère la couleur renvoyée par l’API
                highlight={isCurrent}
                future={isFuture && !isCurrent}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Badge({ title, xp, img, highlight, future, color }) {
  const colors = {
    green: "border-green-400",
    blue: "border-blue-400",
    yellow: "border-yellow-400",
    orange: "border-orange-400",
    purple: "border-purple-400",
    pink: "border-pink-400",
    red: "border-red-400",
    gray: "border-gray-300",
  };

  // Si futur (non débloqué), la bordure est toujours grise
  const borderColor = future ? colors.gray : colors[color] || colors.gray;

  return (
    <div className="space-y-2 text-center">
      <div
        className={`relative transition-transform duration-300 ${highlight ? "scale-110" : ""
          }`}
      >
        {highlight && (
          <div className="absolute inset-0 rounded-full opacity-50 bg-gradient-to-r from-blue-400 to-purple-400 blur-lg animate-pulse"></div>
        )}

        <div
          className={`w-20 h-20 mx-auto flex items-center justify-center rounded-full border-4 bg-white ${highlight ? "border-purple-500" : borderColor
            }`}
        >
          <img
            src={img}
            alt={title}
            className={`relative w-12 h-12 transition-all duration-300 drop-shadow-lg ${future ? "opacity-30 grayscale" : "opacity-100"
              }`}
          />
        </div>
      </div>

      <div>
        <p
          className={`text-xs font-medium ${future ? "text-gray-400" : "text-gray-900"
            }`}
        >
          {title}
        </p>
        <p className={`text-xs ${future ? "text-gray-400" : "text-gray-600"}`}>
          {xp}
        </p>
      </div>
    </div>
  );
}
