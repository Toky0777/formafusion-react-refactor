import { Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonPrimary from "../button/ButtonPrimary";
import T from "../translate/AutoTranslator";

export default function HeaderLoyaltyReward() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <div className="flex justify-between p-5">
      <div className="flex gap-2 text-2xl font-bold">
        <h1>
          <T>Loyalty & Rewards</T>
        </h1>
      </div>
      {pathname.includes("/cfp/loyalty_rewards/list") && (
        <ButtonPrimary onClick={() => navigate("/cfp/loyalty_rewards/create")}>
          <Plus />
          <T>Nouveau</T>
        </ButtonPrimary>
      )}
    </div>
  );
}
