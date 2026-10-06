import { Trophy } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { formatMonetaire } from "../../utils/global";

export default function TotalRewardCard({ totalPrice }) {
  const { symbol } = useAuth();

  return (
    <div>
      <div className="relative p-3 mb-8 overflow-hidden text-white shadow rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="relative flex items-center justify-center text-center">
          <div>
            <h2 className="flex items-center justify-center mb-2 text-lg font-semibold">
              <Trophy className="w-5 h-5 mr-2" />
              Économies totales réalisables
            </h2>
            <p className="text-2xl font-black">
              {formatMonetaire(totalPrice)} {symbol}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
