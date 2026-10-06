import React, { createContext, useContext, useState } from "react";

const SearchContextCustomer = createContext();

export const useSearchContextCustomer = () => useContext(SearchContextCustomer);

export const SearchContextCustomerProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <SearchContextCustomer.Provider
      value={{
        searchTerm,
        setSearchTerm,
        handleSearchChange,
      }}
    >
      {children}
    </SearchContextCustomer.Provider>
  );
};
