import { createContext, useState } from "react";

export const PhotoContext = createContext();

export const PhotoProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState(null);
  return (
    <PhotoContext.Provider value={{ searchTerm, setSearchTerm, date, setDate }}>
      {children}
    </PhotoContext.Provider>
  );
};
