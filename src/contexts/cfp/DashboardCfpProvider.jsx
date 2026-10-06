import { useContext, createContext, useState } from "react";
import axios from "../../config/axios";
import { useAuth } from "../AuthContext";

const DashboardCfpContext = createContext({});

export const DashboardCfpProvider = ({ children }) => {
  const [projects, setProjects] = useState(null);
  const [errors, setErrors] = useState(null);
  const { symbol } = useAuth();

  const fetchProjectsByMonth = async () => {
    try {
      const response = await axios.get("home");
      setProjects(response.data.project_by_month);
    } catch (error) {
      console.error("Erreur lors du fetch :", error);
    }
  };

  function formatNumber(num) {
    const intPart = Math.floor(num);

    const formatted = intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    return formatted + " " + symbol;
  }

  function formatNumberWithoutSymbol(num) {
    const intPart = Math.floor(num);

    const formatted = intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    return formatted;
  }

  return (
    <DashboardCfpContext.Provider
      value={{
        fetchProjectsByMonth,
        formatNumberWithoutSymbol,
        projects,
        formatNumber,
        errors,
        symbol,
      }}
    >
      {children}
    </DashboardCfpContext.Provider>
  );
};

export const useDashboardCfp = () => useContext(DashboardCfpContext);
