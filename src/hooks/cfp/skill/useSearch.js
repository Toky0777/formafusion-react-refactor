import { useState } from "react";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return {
    searchTerm,
    handleChange,
    setSearchTerm,
  };
};
