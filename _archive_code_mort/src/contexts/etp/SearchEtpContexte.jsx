// contexte/SearchEtpContexte.jsx
import React, { createContext, useState } from 'react';

export const SearchEtpContext = createContext();

export const SearchEtpProvider = ({ children }) => {
  const [searchETerm, setSearchETerm] = useState('');

  return (
    <SearchEtpContext.Provider value={{ searchETerm, setSearchETerm }}>
      {children}
    </SearchEtpContext.Provider>
  );
};
