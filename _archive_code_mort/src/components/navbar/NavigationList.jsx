import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  Plus,
  List,
  Coins,
  History,
  Mail,
  Home,
  ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NavigationList({ isMobile = false, onItemClick }) {
  const { t } = useTranslation();

  const dropdownMenuRef = useRef(null);
  const [titleMenu, setTitleMenu] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const menus = [
    {
      menu_title: "Accueil",
      menu_icon: "house",
      menu: 1,
      label: t("navigation.home"),
      endpoint: "qcm/index",
      route: "/particulier/test",
      icon: "home",
    },
  ];

  //particulier
  // menus.push(
  //   {
  //     menu_title: t("navigation.buyCredits"),
  //     menu_icon: "credit-card",
  //     menu: 2,
  //     label: t("navigation.purchaseHistoryCredits"),
  //     endpoint: "/credits-pack/buy",
  //     route: "/credits-pack/buy",
  //     icon: "shopping-cart",
  //   },
  //   {
  //     menu_title: t("navigation.purchaseHistory"),
  //     menu_icon: "list",
  //     menu: 3,
  //     label: t("navigation.purchaseHistoryCredits"),
  //     endpoint: "/credits-payments",
  //     route: "/credits-payments",
  //     icon: "list",
  //   }
  // );
  //employe
  menus.push({
    menu_title: "Campagnes et invitations",
    menu_icon: "envelope",
    menu: 1,
    label: t("navigation.campaignList"),
    endpoint: "qcm/invitations-index",
    route: "/particulier/test/qcm/invitations-index",
    icon: "list",
  });

  function groupMenusByLabelTC(menus) {
    return menus.reduce((grouped, menu) => {
      const title = menu.menu_title;
      if (!grouped[title]) {
        grouped[title] = {
          items: [],
          icon: menu.menu_icon || null,
        };
      }
      grouped[title].items.push(menu);
      return grouped;
    }, {});
  }

  const groupMenus = groupMenusByLabelTC(menus);

  const toggleDropdown = (title) => {
    if (isMobile) {
      setTitleMenu(titleMenu === title ? null : title);
      setOpenMenu(titleMenu !== title);
    } else {
      setTitleMenu(titleMenu === title ? null : title);
      setOpenMenu(!openMenu);
    }
  };

  useEffect(() => {
    if (!isMobile) {
      const handleClickOutside = (event) => {
        if (
          dropdownMenuRef.current &&
          !dropdownMenuRef.current.contains(event.target)
        ) {
          setOpenMenu(false);
          setTitleMenu(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobile]);

  const getIcon = (iconName) => {
    switch (iconName) {
      case "home":
        return <Home className="w-4 h-4" />;
      case "plus":
        return <Plus className="w-4 h-4" />;
      case "list":
        return <List className="w-4 h-4" />;
      case "coins":
        return <Coins className="w-4 h-4" />;
      case "history":
        return <History className="w-4 h-4" />;
      case "mail":
        return <Mail className="w-4 h-4" />;
      case "shopping-cart":
        return <ShoppingCart className="w-4 h-4" />;
      default:
        return <i className="w-4 h-4" data-lucide={iconName}></i>;
    }
  };

  const handleItemClick = () => {
    if (isMobile && onItemClick) {
      onItemClick();
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-2">
        {Object.entries(groupMenus).map(([menuTitle, group]) =>
          group.items.length > 1 ? (
            <div key={menuTitle} className="space-y-1">
              <button
                onClick={() => toggleDropdown(menuTitle)}
                className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-700 transition-colors rounded-lg hover:bg-purple-50 hover:text-purple-600"
              >
                <div className="flex items-center">
                  {getIcon(group.items[0].icon)}
                  <span className="ml-3 font-medium">{menuTitle}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openMenu && titleMenu === menuTitle ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {titleMenu === menuTitle && openMenu && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 space-y-1 overflow-hidden"
                  >
                    {group.items.map((menu, index) => (
                      <Link
                        key={index}
                        to={menu.route}
                        onClick={handleItemClick}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-600 transition-colors rounded-lg hover:bg-purple-50 hover:text-purple-600"
                      >
                        {getIcon(menu.icon)}
                        <span className="ml-3">{menu.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              key={menuTitle}
              to={group.items[0].route}
              onClick={handleItemClick}
              className="flex items-center px-4 py-3 text-gray-700 transition-colors rounded-lg hover:bg-purple-50 hover:text-purple-600"
            >
              {getIcon(group.items[0].icon)}
              <span className="ml-3 font-medium">{menuTitle}</span>
            </Link>
          )
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="items-center hidden space-x-1 lg:flex">
      {Object.entries(groupMenus).map(([menuTitle, group]) =>
        group.items.length > 1 ? (
          <div key={menuTitle} className="relative" ref={dropdownMenuRef}>
            <button
              onClick={() => toggleDropdown(menuTitle)}
              className="flex items-center px-3 py-2 text-sm text-gray-600 transition-colors rounded-lg hover:bg-purple-50 hover:text-purple-600"
            >
              <span>{menuTitle}</span>
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                  openMenu && titleMenu === menuTitle ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {titleMenu === menuTitle && openMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 w-56 mt-1 bg-white border border-gray-100 shadow-xl rounded-xl"
                >
                  {group.items.map((menu, index) => (
                    <Link
                      key={index}
                      to={menu.route}
                      className="flex items-center px-4 py-2.5 text-gray-600 transition-colors hover:bg-purple-50 hover:text-purple-600 first:rounded-t-xl last:rounded-b-xl"
                    >
                      {getIcon(menu.icon)}
                      <span className="ml-3 text-sm">{menu.label}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            key={menuTitle}
            to={group.items[0].route}
            className="flex items-center px-3 py-2 text-sm text-gray-600 transition-colors rounded-lg hover:bg-purple-50 hover:text-purple-600"
          >
            {getIcon(group.items[0].icon)}
            <span className="ml-2">{menuTitle}</span>
          </Link>
        )
      )}
    </div>
  );
}
