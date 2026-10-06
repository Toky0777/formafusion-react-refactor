// EmployeContext.js
import { createContext, useState } from 'react';

export const EmployeContext = createContext();

export const EmployeProvider = ({ children }) => {
  const [employes, setEmployes] = useState([]);
  const [emplFiltre, setEmplFiltre] = useState([]);

  return (
    <EmployeContext.Provider value={{ employes, setEmployes, emplFiltre, setEmplFiltre}}>
      {children}
    </EmployeContext.Provider>
  );
};