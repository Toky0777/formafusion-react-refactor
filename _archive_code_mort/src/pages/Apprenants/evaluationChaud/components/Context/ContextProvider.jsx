import React, { createContext, useContext, useState, useEffect } from 'react';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const api_base_url = import.meta.env.VITE_BASE_URL;

  const [infoProfilCfp, setInfoProfilCfp] = useState(() => {
    const saveInfoProfilCfp = sessionStorage.getItem('infoProfilCfp');
    return saveInfoProfilCfp ? JSON.parse(saveInfoProfilCfp) : null;
  });

  const hasRole = (role) => {
    return user?.roles?.[0]?.roleName?.includes(role);
  };

  // Synchroniser user avec sessionStorage
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  return (
    <StateContext.Provider value={{ 
      user, 
      setUser, 
      hasRole, 
      infoProfilCfp, 
      setInfoProfilCfp, 
      api_base_url 
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
