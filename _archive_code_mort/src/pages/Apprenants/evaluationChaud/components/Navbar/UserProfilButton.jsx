import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../Context/ContextProvider";
import { LogOut, Settings, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { LoadingScreen } from "../Body/LoadingScreen";

export function UserProfilButton() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, token, removeToken, setUser, api_base_url, removeSetting, hasRole } = useStateContext();
  const dropdownUserRef = useRef(null);
  const [InfoCfpOrEtp , setInfoProfilCfp] = useState(null)
  const imageUrl = user?.photo
    ? `https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/referents/${user.photo}`
    : "https://ui-avatars.com/api/?name=Utilisateur";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownUserRef.current && !dropdownUserRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedInfo = sessionStorage.getItem("InfoProfilCfp");
    if (storedInfo !== null && storedInfo !== undefined) {
      try {
        setInfoProfilCfp(JSON.parse(storedInfo));
      } catch (error) {
        console.error("Erreur lors du parsing des données sessionStorage:", error);
        sessionStorage.removeItem("InfoProfilCfp"); // Nettoyer les données corrompues
      }
    }
  }, []);
  
  const logoutButton = () => {
    if (!token) {
      console.log("Token is missing");
      return;
    }
    setIsLoading(true);
    axios
      .get(`${api_base_url}logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        removeToken();
        removeSetting();
        setUser(null);
        setInfoProfilCfp(null);
        sessionStorage.removeItem("infoProfilCfp");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response?.data || error.message);
      })
      .finally(() => setIsLoading(false));
  };

  const fullName = (InfoCfpOrEtp && hasRole('Referent'))
    ? InfoCfpOrEtp.customerName
    : `${user?.name ?? ""} ${user?.firstName ?? ""}`;

  return <>
    {isLoading ? <LoadingScreen /> : <div className="relative" ref={dropdownUserRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 transition-colors rounded-lg hover:bg-purple-50 group"
      >
        {(user?.photo || InfoCfpOrEtp?.logo) ? (
          <img
            src={imageUrl}
            alt="Profile"
            className="object-cover w-8 h-8 rounded-full ring-2 ring-purple-100 group-hover:ring-purple-200"
          />
        ) : (
          <div className="flex items-center justify-center w-8 h-8 text-sm font-medium text-purple-600 bg-purple-100 rounded-full group-hover:bg-purple-200">
            {user?.name?.[0] || "U"}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 capitalize group-hover:text-purple-600">
          {fullName}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 w-64 mt-2 overflow-hidden bg-white border border-gray-100 shadow-xl rounded-xl"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-medium text-gray-900">{fullName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            
            <div className="py-1">
              <a
                href="cfp/profils/2/index"
                target="_blank"
                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-purple-50 hover:text-purple-600"
              >
                <Settings className="w-4 h-4 mr-3" />
                Gérer mon compte
              </a>
              
              <button
                onClick={logoutButton}
                disabled={isLoading}
                className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Déconnexion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>}
  </>
}