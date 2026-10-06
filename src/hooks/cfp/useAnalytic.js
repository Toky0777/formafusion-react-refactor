import { useState } from "react";
import axios from "../../config/axios";

export const useAnalytic = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [isLoadingBc, setIsLoadingBc] = useState(true);

  const fetchData = async (year) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/analytic/home/${year}`);
      setData(res.data);
    } catch (error) {
      return error.response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectByMonth = async (month, year, type) => {
    setIsLoadingProject(true);
    try {
      const res = await axios.get(
        `/analytic/home/project/${month}/${year}/${type}`
      );
      return res.data;
    } catch (error) {
      return error.response.data;
    } finally {
      setIsLoadingProject(false);
    }
  };

  const getYearRange = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;
    const endYear = currentYear + 3;

    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    return years;
  };

  const fetchLeanerByMonth = async (month, year) => {
    try {
      const res = await axios.get(`/analytic/home/learner/${month}/${year}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBonCommande = async (month, year) => {
    setIsLoadingBc(true);
    try {
      const res = await axios.get(
        `/analytic/home/bon_commandes/${month}/${year}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingBc(false);
    }
  };

  return {
    data,
    isLoading,
    isLoadingBc,
    isLoadingProject,
    fetchData,
    fetchProjectByMonth,
    fetchBonCommande,
    fetchLeanerByMonth,
    getYearRange,
  };
};
