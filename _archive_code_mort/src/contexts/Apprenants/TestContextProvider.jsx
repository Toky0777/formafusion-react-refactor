import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("TOKEN") || "");
  const [setting, setSetting] = useState(
    JSON.parse(sessionStorage.getItem("setting")) || {}
  );
  const { user } = useAuth();
  console.log(user);
  //   const [user, setUser] = useState(() => {
  //     const savedUser = localStorage.getItem("user");
  //     return savedUser ? JSON.parse(savedUser) : null;
  //   });

  //   const api_base_url = process.env.VITE_BACKEND_URL;

  //   const [infoProfilCfp, setInfoProfilCfp] = useState(() => {
  //     const saveInfoProfilCfp = sessionStorage.getItem("infoProfilCfp");
  //     return saveInfoProfilCfp ? JSON.parse(saveInfoProfilCfp) : null;
  //   });

  const hasRole = (role) => {
    if (user) {
      return user.roles[0].roleName.includes(role);
    }
  };

  // À chaque fois que user change, on met à jour le sessionStorage
  //   useEffect(() => {
  //     if (user) {
  //       sessionStorage.setItem("user", JSON.stringify(user));
  //     } else {
  //       sessionStorage.removeItem("user");
  //     }
  //   }, [user]);

  const saveToken = (newToken) => {
    setToken(newToken);
    sessionStorage.setItem("TOKEN", newToken);
  };

  const removeToken = () => {
    setToken("");
    sessionStorage.removeItem("TOKEN");
  };
  const saveSetting = (newSetting) => {
    setSetting(newSetting);
    sessionStorage.setItem("setting", JSON.stringify(newSetting));
  };

  const removeSetting = () => {
    setSetting({});
    sessionStorage.removeItem("setting");
  };

  return (
    <StateContext.Provider
      value={{
        token,
        saveToken,
        removeToken,
        user,
        // setUser,
        hasRole,
        // infoProfilCfp,
        // setInfoProfilCfp,
        // api_base_url,
        saveSetting,
        setting,
        removeSetting,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
