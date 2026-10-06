import { useOthersContext } from "@/context/OthersContext";
import { useSearchContext } from "@/context/SearchContext";
import { reducerNavbar } from "@/utils/fonction";
import { Plus } from "lucide-react";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import SearchInput from "../common/SearchIput";
import AddCustomer from "../crud/AddCustomer";
import Button from "../ui/Button";
import ButtonSecondary from "../ui/ButtonSecondary";
import AllFilter from "./AllFilter";
import FilterComponent from "./FilterComponent";

export default function Titre() {
  const { etps, setFilteredEtps, isAdvancedFiltersOpen } = useOthersContext();
  const [villeFilter, setVilleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { searchTerm } = useSearchContext();

  const applyFilters = useCallback(() => {
    let filtered = [...etps];

    // Appliquer le filtre de recherche
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (item) =>
          item.etp_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.etp_ville?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.part_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.type_etp_desc?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Appliquer le filtre ville
    if (villeFilter && villeFilter !== "all") {
      filtered = filtered.filter((e) => e.etp_ville === villeFilter);
    }

    // Appliquer le filtre type
    if (typeFilter && typeFilter !== "all") {
      filtered = filtered.filter((e) => e.type_etp_desc === typeFilter);
    }

    return filtered;
  }, [etps, searchTerm, villeFilter, typeFilter]);

  const handleFilterChange = useCallback(({ ville, type }) => {
    setVilleFilter(ville);
    setTypeFilter(type);
  }, []);

  const [state, dispatch] = useReducer(reducerNavbar, {
    new: false,
  });

  const villes = [
    "all",
    ...new Set(
      etps.map((e) => e.etp_ville).filter((ville) => ville !== undefined)
    ),
  ];

  const types = [
    "all",
    ...new Set(
      etps.map((e) => e.type_etp_desc).filter((type) => type !== undefined)
    ),
  ];

  // Appliquer les filtres à chaque changement
  useEffect(() => {
    const filtered = applyFilters();
    setFilteredEtps(filtered);
  }, [applyFilters]);

  return (
    <div>
      <div className="flex justify-between mb-10 relative ">
        <h1 className="text-2xl font-bold">Clients</h1>
        <div className="flex gap-5 ">
          <SearchInput />
          <Button
            className="hidden sm:flex"
            onClick={() => {
              dispatch({ type: "SHOW_DRAWER" });
            }}
          >
            <Plus size={20} />
            <p className="ml-2"> Nouveau </p>
          </Button>
          <FilterComponent
            villes={villes}
            types={types}
            villeFilter={villeFilter}
            typeFilter={typeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>

        {state?.new && (
          <AddCustomer
            show={state.new}
            close={() => {
              dispatch({ type: "HIDE_DRAWER" });
            }}
          />
        )}
      </div>
      {isAdvancedFiltersOpen && (
        <AllFilter
          villes={villes}
          types={types}
          villeFilter={villeFilter}
          typeFilter={typeFilter}
          setVilleFilter={setVilleFilter}
          setTypeFilter={setTypeFilter}
        />
      )}
    </div>
  );
}
