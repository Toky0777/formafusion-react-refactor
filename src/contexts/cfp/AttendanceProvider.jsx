// DataContext.js
import { createContext, useState } from "react";
export const AttendanceContext = createContext();

export function AttendanceProvider({ children }) {
  //const [countProject, setCountProject] = useState(null);
  const [selected, setSelected] = useState("En cours");
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  return (
    <AttendanceContext.Provider
      value={{
        selected,
        setSelected,
        isAdvancedFiltersOpen,
        setIsAdvancedFiltersOpen,
        search,
        setSearch,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}
