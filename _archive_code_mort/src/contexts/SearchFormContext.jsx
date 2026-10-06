// src/contexte/SearchFormContext.js
import React, { createContext, useState, useContext } from 'react';

const SearchFormContext = createContext();

export const SearchFormProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const filterData = (data, searchFields = []) => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
      return data;
    }

    const filtered = data.filter(item => {
      return searchFields.some(field => {
        const fieldValue = item[field] || '';
        return fieldValue.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });

    setFilteredData(filtered);
    return filtered;
  };

  return (
    <SearchFormContext.Provider value={{ searchTerm, setSearchTerm, filteredData, filterData }}>
      {children}
    </SearchFormContext.Provider>
  );
};

export const useSearchForm = () => {
  const context = useContext(SearchFormContext);
  if (!context) {
    throw new Error('useSearchForm must be used within a SearchFormProvider');
  }
  return context;
};