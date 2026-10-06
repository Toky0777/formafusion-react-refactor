import { useState } from "react";
import { Outlet } from "react-router-dom";
import LoadingSpinner from "../../components/ui/loading-spinner";
import Titre from "../../components/Common/Titre";

export default function DashboardLayout() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      {isLoading && <LoadingSpinner />}

      <div className=" min-h-screen   z-[500]">
        <Titre />
        <Outlet />
      </div>
    </div>
  );
}
