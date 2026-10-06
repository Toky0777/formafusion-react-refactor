import { motion } from "framer-motion";
import { CircleUserRound, LogOut, Settings, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import GlobalLoading from "../loading/GlobalLoading";
import { useAuthContext } from "@/context/AuthContext";
import Modal from "./Modal";

export default function UserMenu({
  show,
  close,
  setGlobalLoading,
  setShowConfirm,
}) {
  const { user, logout } = useAuthContext();

  const appRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!appRef?.current?.contains(e.target)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  return (
    <>
      {show && (
        <div className="absolute top-18 right-20 w-80 p-4 bg-white rounded-lg shadow-2xl z-100">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            ref={appRef}
          >
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex flex-col items-center mb-10">
                <p className="font-bold text-xl"> {user?.name}</p>
                <p> {user?.email}</p>
              </div>
              <a
                href="https://compte.mg.formafusion.io/"
                className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-50  transition w-full text-left disabled:opacity-50"
              >
                <User />
                <span>Mon compte</span>
              </a>
              <button
                onClick={handleLogout}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md hover:bg-red-50 text-red-600 transition w-full text-left disabled:opacity-50"
              >
                <LogOut />
                <span>Se déconnecter</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
