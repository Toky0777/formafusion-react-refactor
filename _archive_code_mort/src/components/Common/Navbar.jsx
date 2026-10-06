import { Plus } from "lucide-react";
import React, { useEffect, useReducer, useState } from "react";

import UserMenu from "./UserMenu";
import { useAuthContext } from "@/context/AuthContext";

import { appLauncher, reducerNavbar } from "@/utils/fonction";
import AddCustomer from "../crud/AddCustomer";
import SearchInput from "./SearchIput";
import { Link } from "react-router-dom";
import AppLauncher from "./AppLauncher";

export default function Navbar({ setGlobalLoading, setShowConfirm }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchDataAppLauncher = async () => {
      try {
        const response = await appLauncher();

        setItems(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataAppLauncher();
  }, []);

  const [state, dispatch] = useReducer(reducerNavbar, {
    menu: false,
    appLauncher: false,
    new: false,
  });

  const { token, user } = useAuthContext();
  const userRole = user?.roles[0];

  return (
    <div>
      <nav className="fixed top-0 z-[600] w-full bg-white text-slate-600 backdrop-blur-lg shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button
              className="mr-3 p-2 md:hidden"
              onClick={() => dispatch({ type: "TOGGLE_MOBILE_MENU" })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex items-center space-x-5 rtl:space-x-reverse">
              <Link to="/" className="flex space-x-2">
                <img
                  alt=""
                  width="30"
                  height="30"
                  src="https://clients.forma-fusion.com/img/icones/Clients.png"
                />
                <span className="self-center text-2xl font-semibold whitespace-nowrap">
                  {token && userRole !== 3
                    ? "Vos centre de formation"
                    : "Clients"}
                </span>
              </Link>

              <a
                href="https://forma-fusion.com/contact"
                className="cursor-pointer text-sm px-2 py-0.5 bg-green-500 text-white rounded-full "
              >
                Beta
              </a>
            </div>
          </div>

          {/* Desktop navigation - hidden on mobile */}
          <div className="hidden  md:flex space-x-8 items-center">
           

            <button
              onClick={() => {
                dispatch({ type: "SHOW_APPLAUNCHER" });
              }}
              className="cursor-pointer hover:scale-125 transition duration-300"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.5 1A1.5 1.5 0 0 0 17 2.5v3A1.5 1.5 0 0 0 18.5 7h3A1.5 1.5 0 0 0 23 5.5v-3A1.5 1.5 0 0 0 21.5 1h-3zm0 8a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 21.5 9h-3zm-16 8A1.5 1.5 0 0 0 1 18.5v3A1.5 1.5 0 0 0 2.5 23h3A1.5 1.5 0 0 0 7 21.5v-3A1.5 1.5 0 0 0 5.5 17h-3zm8 0A1.5 1.5 0 0 0 9 18.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5h-3zm8 0a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5h-3zm-16-8A1.5 1.5 0 0 0 1 10.5v3A1.5 1.5 0 0 0 2.5 15h3A1.5 1.5 0 0 0 7 13.5v-3A1.5 1.5 0 0 0 5.5 9h-3zm0-8A1.5 1.5 0 0 0 1 2.5v3A1.5 1.5 0 0 0 2.5 7h3A1.5 1.5 0 0 0 7 5.5v-3A1.5 1.5 0 0 0 5.5 1h-3zm8 0A1.5 1.5 0 0 0 9 2.5v3A1.5 1.5 0 0 0 10.5 7h3A1.5 1.5 0 0 0 15 5.5v-3A1.5 1.5 0 0 0 13.5 1h-3zm0 8A1.5 1.5 0 0 0 9 10.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 13.5 9h-3z" />
              </svg>
            </button>

            {token && (
              <div
                className="flex bg-gray-400 shadow-xl text-white font-bold items-center w-10 h-10 justify-center rounded-full cursor-pointer hover:scale-125 transition duration-300"
                onClick={() => {
                  dispatch({ type: "SHOW_MENU" });
                }}
              >
                <h1> {user?.name.charAt(0)} </h1>
              </div>
            )}
          </div>

          {/* Mobile icons - only show on small screens */}
          <div className="flex space-x-4 md:hidden">
            {token && user && (
              <>
                <button
                  onClick={() => {
                    dispatch({ type: "SHOW_DRAWER" });
                  }}
                  className="p-2"
                >
                  <Plus size={20} />
                </button>

                <div
                  className="flex items-center bg-[#A462b8] text-white w-10 h-10 justify-center rounded-full cursor-pointer"
                  onClick={() => {
                    dispatch({ type: "SHOW_MENU" });
                  }}
                >
                  <h1>H</h1>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu - only shows when toggled */}
        {state?.mobileMenu && (
          <div className="md:hidden bg-white py-2 px-4 shadow-md">
            {token && user && (
              <div className="mb-4">
                <SearchInput />
              </div>
            )}
            <button
              className="w-full flex items-center p-2 hover:bg-gray-100 rounded"
              onClick={() => {
                dispatch({ type: "SHOW_APPLAUNCHER" });
                dispatch({ type: "HIDE_MOBILE_MENU" });
              }}
            >
              App Launcher
            </button>
          </div>
        )}

        {/* Rest of your existing popups/modals */}
        {state?.appLauncher && (
          <AppLauncher
            items={items}
            show={state.appLauncher}
            close={() => {
              dispatch({ type: "HIDE_APPLAUNCHER" });
            }}
          />
        )}

        {state?.menu && (
          <UserMenu
            setShowConfirm={setShowConfirm}
            setGlobalLoading={setGlobalLoading}
            show={state.menu}
            close={() => {
              dispatch({ type: "HIDE_MENU" });
            }}
          />
        )}
        
      </nav>
    </div>
  );
}
