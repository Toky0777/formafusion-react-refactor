import { Outlet } from "react-router-dom";
import HeaderLoyaltyReward from "../../components/header/headerLoyalty";

export default function LoyaltyRewardsLayout() {
  return (
    <div>
      <div className="min-h-screen  z-[500]">
        <HeaderLoyaltyReward />
        <Outlet />
      </div>
    </div>
  );
}
