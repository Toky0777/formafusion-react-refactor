
import React from 'react';

import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  const loginAction = async (formData) => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/login`, formData);

      if (data.status === 200) {
        setToken(data.token);
        setUser(data.user);

        localStorage.setItem("rle_d", 3);
        sessionStorage.setItem("setting", { "country_name": "Côte d'Ivoire", "country_code": "CI", "currency_code": "xof", "currency_unit": "CFA Franc", "id_nif_name": 0, "nif_name": "Test", "nif_description": "Test", "id_stat_name": 1, "stat_name": "STAT" });

        return { success: true, role_id: data.role_id };
      }

      if (data.status === 400) {

        return { success: false, error: data.message };
      }
      if (data.status === 404) {

        return { success: false, error: data.message };
      }

    } catch (error) {

      return { success: false, error: error.response?.data?.message || "echec de connexion, verifier votre identifiants" };
    }
  };


  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("token");
    localStorage.removeItem('ID_AGENDA');
    localStorage.removeItem("auth_id");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
export { AuthContext };
