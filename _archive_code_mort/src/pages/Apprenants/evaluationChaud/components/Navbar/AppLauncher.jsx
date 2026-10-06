import React, { use, useEffect, useRef, useState } from "react";
import { useStateContext } from "../../Context/ContextProvider";
import { Grid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AppLauncherGrid from "./AppLauncherGrid";

export function AppLauncher() {
  const { user, token, api_base_url } = useStateContext();
  const [visibleApp, setVisibleApp] = useState(false);
  const dropdownRef = useRef(null);
  const [ apps, setApps ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false)
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setVisibleApp(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const AppRequest = async() => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${api_base_url}app_launcher`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      setApps(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    AppRequest();
  }, [])

  return (
    <div className="relative lg:m-2.5" ref={dropdownRef}>
      <button
        onClick={() => setVisibleApp(!visibleApp)}
        className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-purple-50 hover:text-purple-600"
        aria-label="Applications"
      >
        <Grid className="w-8 h-8" />
      </button>

      <AnimatePresence>
        {visibleApp && (
          <div className="origin-top-right absolute right-0 mt-3 w-[440px] sm:w-110 rounded-2xl shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-30 p-5 border border-gray-100 dark:border-gray-700">
            <AppLauncherGrid />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}