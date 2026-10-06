import { Outlet } from "react-router-dom";
import { PhotoProvider } from "../contexts/Apprenants/PhotoProvider";
import { NavBarPhotoFormateur } from "../components/navbar/navbar-photo-formateur";
import { useState } from "react";

export function PhotoContentFormateur() {
  const [date, setDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <PhotoProvider>
      <div className=" min-h-screen bg-gray-100">
        <NavBarPhotoFormateur
          date={date}
          setDate={setDate}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <div className="flex-grow  ">
          <Outlet context={{ date, setDate, searchTerm, setSearchTerm }} />
        </div>
        {/* <Footer /> */}
      </div>
    </PhotoProvider>
  );
}
