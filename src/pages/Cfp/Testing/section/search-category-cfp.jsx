import { useState, useEffect, useRef } from "react";
import axios from "../../../../config/axios";

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const SearchCategoryCfp = ({ sectionIndex, updateCategoryIdInAnswers }) => {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCreateOption, setShowCreateOption] = useState(false);
  const containerRef = useRef(null);
  const handleInputChange = (e) => {
    const value = e.target.value.trim();
    setQuery(value);
    debouncedFetchSuggestions(value);
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 1) {
      setShowSuggestions(false);
      return;
    }
    try {
      const response = await axios.get(`/ct-reponses/search`, {
        params: {
          query,
        },
      });
      setSuggestions(response.data);
      setShowSuggestions(true);

      const exactMatch = response.data.some(
        (cat) => cat.nomCategorie.toLowerCase() === query.toLowerCase()
      );
      setShowCreateOption(!exactMatch);
    } catch (error) {
      console.error("Erreur de recherche:", error);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const handleSelect = (category) => {
    setQuery(category.nomCategorie);
    setCategoryId(category.idCategorie);
    setShowSuggestions(false);
    updateCategoryIdInAnswers(sectionIndex, category.idCategorie);
  };

  const handleCreate = async () => {
    await axios
      .post(`/ct-reponses/create`, { nomCategorie: query }, {})
      .then((response) => {
        setQuery(response.data.nomCategorie);
        setCategoryId(response.data.idCategorie);
        setShowSuggestions(false);
        updateCategoryIdInAnswers(sectionIndex, response.data.idCategorie);
      })
      .catch((error) => {
        console.error("Erreur lors de la création:", error.response?.data);
        alert("Erreur lors de la création de la catégorie");
      });
  };

  // Cacher suggestions si clic à l’extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        name={`sections[${sectionIndex}][categorie_search]`}
        placeholder="Rechercher une section"
        className="flex-1 w-full px-2 py-2 bg-white border-gray-800 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        autoComplete="off"
        value={query}
        onChange={handleInputChange}
        required
      />
      <input
        type="hidden"
        name={`sections[${sectionIndex}][categorie_id]`}
        className="category-id"
        required
        value={categoryId}
      />

      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg category-suggestions">
          <ul className="overflow-y-auto suggestions-list max-h-60">
            {suggestions.map((category) => (
              <li
                key={category.idCategorie}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(category)}
              >
                {category.nomCategorie}
              </li>
            ))}
          </ul>

          {showCreateOption && (
            <div
              className="p-2 border-t cursor-pointer create-option bg-gray-50 hover:bg-gray-100"
              onClick={handleCreate}
            >
              <span className="text-blue-600">
                + Créer "<span className="create-text">{query}</span>"
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchCategoryCfp;
