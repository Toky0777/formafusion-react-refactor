import { Gift } from "lucide-react"; // Icône cadeau

export default function Rewards({ data }) {
  if (!data) return null;

  const progress = data.getExpById?.total_points ?? 0;

  // 👉 On construit la liste depuis ton API
  const rewards = (data.niveauGamification || []).map((n) => ({
    xp: n.min_points,
    label: n.classement,
    icon: n.url_image,
    color: getColorByLevel(n.numero), // fonction helper pour colorer
    special: n.numero === 7, // exemple : dernier niveau = cadeau mystère
    downloadUrl: n.lien_recomponse,
  }));

  return (
    <div className="flex flex-col gap-6 bg-white border rounded-lg shadow-sm">
      <div className="p-6">
        <h3 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-700">
          <Gift className="w-6 h-6 text-indigo-600" />
          Récompenses Mystères
        </h3>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rewards.map((reward, i) => (
            <RewardCard key={i} {...reward} unlocked={progress >= reward.xp} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 🎨 Fonction pour affecter des couleurs dynamiques selon le niveau
function getColorByLevel(level) {
  switch (level) {
    case 1:
    case 2:
    case 3:
      return "green";
    case 4:
      return "purple";
    case 5:
      return "yellow";
    case 6:
      return "pink";
    case 7:
      return "red"; // tu peux inventer une couleur spéciale pour le "mystère"
    default:
      return "gray";
  }
}

// function RewardCard({ xp, label, icon, unlocked, color, special }) {
//   const colors = {
//     green: {
//       border: "border-green-200",
//       bg: "bg-green-50",
//       text: "text-green-600",
//     },
//     gray: {
//       border: "border-gray-200",
//       bg: "bg-gray-100",
//       text: "text-gray-500",
//     },
//     purple: {
//       border: "border-purple-200",
//       bg: "bg-purple-50",
//       text: "text-purple-600",
//     },
//     yellow: {
//       border: "border-yellow-200",
//       bg: "bg-yellow-50",
//       text: "text-yellow-600",
//     },
//     pink: {
//       border: "border-pink-200",
//       bg: "bg-pink-50",
//       text: "text-pink-600",
//     },
//     red: {
//       border: "border-red-200",
//       bg: "bg-red-50",
//       text: "text-red-600",
//     },
//   };

//   const style = unlocked ? colors[color] || colors.gray : colors.gray;

//   return (
//     <div
//       className={`p-4 rounded-lg border-2 transition-all duration-300 shadow-sm ${style.border} ${style.bg}`}
//     >
//       <div className="flex items-center gap-3">
//         <img src={icon} alt={label} className="w-8 h-8" />
//         <div>
//           <p className="text-sm font-medium">{xp}+ XP</p>
//           <p className={`text-sm ${style.text}`}>
//             {special ? "🎁 " : unlocked ? "✅ " : "🔒 "} {label}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
function RewardCard({
  xp,
  label,
  icon,
  unlocked,
  color,
  special,
  downloadUrl,
}) {
  const colors = {
    green: {
      border: "border-green-200",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    gray: {
      border: "border-gray-200",
      bg: "bg-gray-100",
      text: "text-gray-500",
    },
    purple: {
      border: "border-purple-200",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    yellow: {
      border: "border-yellow-200",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    pink: {
      border: "border-pink-200",
      bg: "bg-pink-50",
      text: "text-pink-600",
    },
    red: { border: "border-red-200", bg: "bg-red-50", text: "text-red-600" },
  };

  const style = unlocked ? colors[color] || colors.gray : colors.gray;

  // Si verrouillé, pas de lien
  const Wrapper = ({ children }) =>
    unlocked ? (
      <a href={downloadUrl} download={label} className="block">
        {children}
      </a>
    ) : (
      <div className="block cursor-not-allowed">{children}</div>
    );

  return (
    <Wrapper>
      <div
        className={`p-4 rounded-lg border-2 transition-all duration-300 shadow-sm ${style.border
          } ${style.bg} ${unlocked ? "cursor-pointer hover:scale-105" : ""}`}
      >
        <div className="flex items-center gap-3">
          <img src={icon} alt={label} className="w-8 h-8" />
          <div>
            <p className="text-sm font-medium">{xp}+ XP</p>
            <p className={`text-sm ${style.text}`}>
              {special ? "🎁 " : unlocked ? "✅ " : "🔒 "} {label}
            </p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
