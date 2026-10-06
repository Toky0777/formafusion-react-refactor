// ApprenantContext.js
import { createContext, useState } from 'react';

export const ApprenantContext = createContext();

export const ApprenantProvider = ({ children }) => {
  const [apprenants, setApprenants] = useState([]);
  const [apprFiltre, setApprFiltre] = useState([]);

  return (
    <ApprenantContext.Provider value={{ apprenants, setApprenants, apprFiltre, setApprFiltre }}>
      {children}
    </ApprenantContext.Provider>
  );
};