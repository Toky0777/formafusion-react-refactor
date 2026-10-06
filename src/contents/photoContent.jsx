import { Outlet } from "react-router-dom";
import { NavBarPhoto } from "../components/navbar/navbar-photo";
import { PhotoProvider } from "../contexts/Apprenants/PhotoProvider";

export function PhotoContent() {
  return (
    <PhotoProvider>
      <div className=" min-h-screen bg-gray-100">
        <NavBarPhoto />
        <div className="flex-grow  ">
          <Outlet />
        </div>
        {/* <Footer /> */}
      </div>
    </PhotoProvider>
  );
}
