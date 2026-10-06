/**
 * Hook commun de chargement des projets par statut (Etp, Formateur, ...).
 * Chaque rôle fournit uniquement l'endpoint (voir useProjectEtpData / useProjectFormData).
 */

import { useState, useEffect } from "react";
import axios from "../config/axios";

export const useProjectStatusData = (endpoint, status) => {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projetCounts, setProjetCounts] = useState(null);
  const [filteredProjets, setFilteredProjets] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  

  const toggleShowAll = () => {
      setShowAllProjects(!showAllProjects);
  };

  const fetchProjetsByStatus = async (status) => {
    try {
      setLoading(true);

      const response = await axios.get(endpoint, {
        params: {
          status: status,
        },
      });

      if (response.status !== 200) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }

      const data = response.data;
      setProjets(data.projets || []);

    } catch (error) {
      console.error("Détails de l'erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupesParMois = Array.isArray(projets)
  ? projets.reduce((acc, projet) => {
      const date = new Date(projet.dateDebut);
      const moisAnnee = date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
      });

      if (!acc[moisAnnee]) acc[moisAnnee] = [];
      acc[moisAnnee].push({ ...projet, parsedDate: date });
      return acc;
    }, {})
  : {};

  const groupesTries = Object.entries(groupesParMois || {}).sort(
    ([_, projetsA], [__, projetsB]) => {
      const dateA = projetsA[0].parsedDate;
      const dateB = projetsB[0].parsedDate;
      return dateB - dateA;
    }
  );

  const searchTerm = "";

  useEffect(() => {
      const lowerSearch = searchTerm.toLowerCase();
      if (lowerSearch === "") {
          setFilteredProjets([]);
          return;
      }

      const results = projets.filter((projet) =>
          projet.module_name?.toLowerCase().includes(lowerSearch) ||
          projet.project_reference?.toLowerCase().includes(lowerSearch) ||
          projet.cfp_name?.toLowerCase().includes(lowerSearch) ||
          projet.paiement?.toLowerCase().includes(lowerSearch) ||
          projet.modalite?.toLowerCase().includes(lowerSearch) ||
          projet.ville?.toLowerCase().includes(lowerSearch) ||
          projet.salle_name?.toLowerCase().includes(lowerSearch) ||
          projet.etp_name_in_situ?.toLowerCase().includes(lowerSearch) ||
          projet.headDate?.toLowerCase().includes(lowerSearch) ||
          projet.project_description?.toLowerCase().includes(lowerSearch)
      );

      setFilteredProjets(results);

      
  }, [searchTerm, projets]);



  useEffect(() => {
    fetchProjetsByStatus(status); 
  }, []);

  return {
    projets,
    loading,
    projetCounts,
    searchTerm,
    filteredProjets,
    groupesTries,
    showAllProjects,
    setShowAllProjects,
  };
};