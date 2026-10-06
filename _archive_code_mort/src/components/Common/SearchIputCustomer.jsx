import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSearchContextCustomer } from "../../contexts/cfp/SearchContextCustomer";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchInputCustomer() {
  const { searchTerm, handleSearchChange, setSearchTerm } =
    useSearchContextCustomer();
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      setIsExpanded(true);
    }
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        if (searchTerm == "") {
          setIsExpanded(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchTerm]);

  return (
    <div ref={containerRef} className="relative ">
      {/* Icône seule - état réduit */}
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-0 right-0 p-2 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => {
            setIsExpanded(true);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
        >
          <Search className="w-5 h-5" />
        </motion.div>
      )}

      {/* Champ de recherche - état étendu */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center border border-gray-300 rounded-lg px-3 py-2 shadow-sm bg-white overflow-hidden"
          >
            <Search className="text-gray-500 w-5 h-5 mr-2 flex-shrink-0" />
            <motion.input
              ref={inputRef}
              value={searchTerm}
              onChange={handleSearchChange}
              type="text"
              className="outline-none w-full text-sm text-gray-700 bg-transparent"
              placeholder="Rechercher"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            />
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-shrink-0"
              >
                <X
                  className="cursor-pointer w-5 h-5 text-gray-500 hover:text-gray-700"
                  onClick={() => setSearchTerm("")}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
