import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "../config/axios";
import Axios from "axios";
import { API_ORIGIN } from "../config/env";

const AuthContext = createContext({
  user: null,
  userType: null,
  token: null,
  symbol: null,
  customerName: null,
  etpType: null,
  currencyUnit: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
  isLoading: false,
  error: null,
  clearError: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [currencyUnit, setCurrencyUnit] = useState(null);
  const hasFetchedUser = useRef(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [etpType, setEtpType] = useState(null);

  // 🔹 Chargement automatique de l'utilisateur si token présent
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      hasFetchedUser.current = true;
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
      setUserType(response.data.user_type);
      setSymbol(response.data.symbol);
      setCustomerName(response.data.customer_name);
      setEtpType(response.data.etp_type);
      setCurrencyUnit(response.data.setting?.currency_unit || "MGA");
      sessionStorage.setItem("setting", JSON.stringify(response.data.setting));
    } catch (err) {
      console.error("Erreur récupération user :", err);
      localStorage.removeItem("token");
      setUser(null);
      setUserType(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      await Axios.get(`${API_ORIGIN}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      const response = await axios.post("/login", credentials);

      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
        setUserType(response.data.user_type);
        setSymbol(response.data.symbol);
        setCustomerName(response.data.customer_name);
        setEtpType(response.data.etp_type);

        // 🔍 DEBUG : Vérifiez ce qui est stocké
        const currencyFromAPI = response.data.setting?.currency_unit;
        setCurrencyUnit(currencyFromAPI || "MGA");

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("rle_d", response.data.role_id);
        sessionStorage.setItem(
          "setting",
          JSON.stringify(response.data.setting)
        );

        return {
          success: true,
          role_id: response.data.role_id,
          user_type: response.data.user_type,
        };
      }

      return {
        success: false,
        error: response.data.message || "Erreur de connexion",
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Échec de connexion, vérifiez vos identifiants";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setIsLoggingOut(true);

    try {
      await axios.post("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Nettoyage du contexte et stockage
      localStorage.removeItem("token");
      sessionStorage.clear();
      setUser(null);
      setUserType(null);
      setToken("");
      setIsLoading(false);
      setIsLoggingOut(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        token,
        symbol,
        customerName,
        etpType,
        currencyUnit,
        setUser,
        login,
        logout,
        isLoading,
        isLoggingOut,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour accéder au contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
