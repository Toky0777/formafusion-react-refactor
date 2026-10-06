import { useEffect, useState } from "react";
import RewardCard from "../../../components/card/RewardCard";
import axios from "../../../config/axios";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { Gift } from "lucide-react";
import T from "../../../components/translate/AutoTranslator";

export default function RewardsList() {
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/cfp/rewards/allRewards");
        setRewards(res.data.rewards.reward_items);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const handleDeleleReward = async (id) => {
    try {
      const res = await axios.delete(`/cfp/rewards/delete/${id}`);
      setRewards((prev) => prev.filter((p) => p.id_module_reward !== id));
      toastr.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-9xl mx-auto sm:px-6 lg:px-8 py-8 relative z-10">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      ) : rewards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Gift className="w-16 h-16 mb-4 text-gray-400" />
          <p className="text-lg font-medium">
            <T>Aucune récompense</T>
          </p>
          <p className="text-sm text-gray-400">
            <T>Cliquez sur "Nouveau" pour ajouter</T>
          </p>
        </div>
      ) : (
        <div>
          <div className="flex flex-col space-y-10">
            {rewards.map((r, i) => (
              <div key={i}>
                <RewardCard
                  code="cfp"
                  reward={r}
                  onDelete={() => handleDeleleReward(r.id_module_reward)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
