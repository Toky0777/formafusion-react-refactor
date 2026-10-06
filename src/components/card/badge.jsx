export default function Badge({ data }) {
  if (!data) return null;

  console.log(data.getExpById);

  const progress = data?.getExpById?.total_points ?? 0;
  const currentLevel = data?.getExpById?.libelle_niveau ?? "Niveau inconnu";
  const niveauActuel = data?.getExpById?.niveau ?? 1;
  const niveaux = data?.niveauGamification || [];
  const nextLevel = niveaux.find((n) => n.min_points > progress);
  const badgeImg = data?.getExpById?.url_image || "assets/img/default.png";

  return (
    <div className="flex flex-col items-center gap-3 p-5 bg-white border rounded-lg shadow">
      <div className="relative flex items-center justify-center w-32 h-34">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 blur-xl opacity-30 animate-pulse"></div>
        <img
          src={badgeImg}
          alt={currentLevel}
          className="relative object-contain w-32 h-32 drop-shadow-2xl"
        />
      </div>
      <h2 className="text-xl font-bold text-gray-700">{currentLevel}</h2>
      <p className="text-sm text-gray-500">
        Niveau {niveauActuel} • {progress} XP
      </p>
      {nextLevel ? (
        <div className="px-3 py-2 mt-2 text-sm text-blue-700 rounded bg-blue-50">
          🎯 Prochain objectif : <strong>{nextLevel.classement}</strong> à{" "}
          {nextLevel.min_points} XP
        </div>
      ) : (
        <div className="px-3 py-2 mt-2 text-sm text-green-700 rounded bg-green-50">
          🏆 Félicitations ! Tu es déjà au niveau maximum 🎉
        </div>
      )}
    </div>
  );
}
