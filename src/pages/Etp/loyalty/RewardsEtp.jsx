import { useEffect, useState } from "react";
import RewardCard from "../../../components/card/RewardCard";
import TotalRewardCard from "../../../components/card/TotalRewardCard";
import axios from "../../../config/axios";
import LoadingSpinner from "../../../components/ui/loading-spinner";

export default function RewardsEtp() {
  const [rewardsEtp, setRewardsEtp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/entreprises/rewards");
        setRewardsEtp(res.data.rewards.reward_items);
        console.log(res.data.rewards.reward_items);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const totalPrice = rewardsEtp.reduce((total, item) => {
    return total + (parseInt(item.price_with_reduction) || 0);
  }, 0);

  return (
    <div className="relative z-10 max-w-5xl py-4 mx-auto sm:px-6 lg:px-8">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      ) : rewardsEtp.length === 0 ? (
        <div className="flex items-center justify-center text-2xl font-bold text-gray-500">
          Aucune récompense n'est disponible pour le moment.
        </div>
      ) : (
        <div>
          {/* Intro marketing */}
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 drop-shadow-lg">
              Vos avantages exclusifs offerts par nos centres de formation
              partenaires
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-700">
              Profitez d'opportunités uniques&nbsp;:{" "}
              <span className="font-bold text-pink-600">
                formations gratuites
              </span>{" "}
              ou{" "}
              <span className="font-bold text-yellow-600">
                réductions exceptionnelles
              </span>{" "}
              spécialement négociées pour votre entreprise. Valorisez vos
              équipes tout en réalisant des économies substantielles&nbsp;!
            </p>
          </div>

          <TotalRewardCard totalPrice={totalPrice} />

          <div className="flex flex-col mt-8 space-y-14">
            {rewardsEtp.map((r, i) => (
              <div key={i}>
                <RewardCard code="etp" reward={r} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
