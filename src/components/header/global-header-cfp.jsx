import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User, LogOut, Search } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import axios from "../../config/axios";
import { Link } from "react-router-dom";
import LanguageSelector from "../translate/LanguageSelector";

export function GlobalHeaderCfp({ onSearch }) {
  const { user, isLoading, logout, customerName } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  // 🔍 Fetch suggestions (debounce)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `/key-suggestion?key=${encodeURIComponent(searchQuery)}`
        );
        setSuggestions(data || []);
      } catch (err) {
        console.error("Erreur fetch suggestions:", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // 👇 Fermer la recherche quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSuggestions([]);
      setShowSearch(false);
    }
  };

  if (isLoading)
    return (
      <header className="px-6 py-4 bg-white border-b">Chargement...</header>
    );

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* ----- Bloc gauche ----- */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col leading-tight">
            <h2 className="text-lg font-semibold text-gray-800">
              Bienvenue,{" "}
              <span className="text-violet-600">
                {user ? `${user?.name} ${user?.firstName || ""}` : "Invité"}
              </span>{" "}
              👋
            </h2>
            <p className="text-sm text-gray-500">{customerName}</p>
          </div>
        </div>

        <nav className="hidden xl:flex items-center gap-3 text-sm font-medium text-gray-600">
          {[
            {
              label: "Créer ou améliorer votre catalogue",
              to: "/cfp/catalogue",
            },
            { label: "Nouveau projet", to: "/cfp/nouveau_projet" },
            { label: "Nouveau devis", to: "/cfp/proforma" },
            { label: "Bon de commande", to: "/cfp/bon-commande" },
            { label: "Nouvelle facture", to: "/cfp/facture" },
            { label: "Recouvrement", to: "/cfp/recouvrement" },
            { label: "Tableau de bord", to: "/cfp/analytic" },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="px-3 py-1 rounded-lg hover:bg-violet-50 hover:text-violet-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div ref={searchRef} className="relative hidden md:block">
            {!showSearch ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                className="hover:bg-gray-100 rounded-full"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </Button>
            ) : (
              <form
                onSubmit={handleSearch}
                className={`relative flex items-center transition-all duration-300 ${
                  showSearch ? "w-72 opacity-100" : "w-0 opacity-0"
                }`}
              >
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  autoFocus
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 h-9 w-full text-sm rounded-lg border-gray-300 focus:ring-violet-500 focus:border-violet-500"
                />

                {searchQuery && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                    {suggestions.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-violet-50 cursor-pointer"
                        onClick={() => {
                          setSearchQuery(s.context);
                          onSearch(s.context);
                          setSuggestions([]);
                          setShowSearch(false);
                        }}
                      >
                        <img
                          src={s.image}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800">
                            {s.context}
                          </span>
                          <span className="text-xs text-gray-500">
                            {s.subContext}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            )}
          </div>

          {/* 🌍 Sélecteur de langue */}
          <LanguageSelector />

          {/* 🟣 Upgrade */}
          {/* <Button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-indigo-600 rounded-lg hover:from-violet-600 hover:to-indigo-700 transition-all">
            <Crown className="w-4 h-4" />
            Upgrade
          </Button> */}

          {/* 🔔 Notifications */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 rounded-full p-2"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-white bg-red-500 rounded-full">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 bg-white shadow-xl rounded-xl border border-gray-100"
            >
              <DropdownMenuLabel className="font-semibold text-gray-700 px-3 py-2">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                {
                  title: "Nouveau apprenant inscrit",
                  desc: "Marie Dubois s'est inscrite au cours JavaScript",
                  time: "Il y a 2 minutes",
                },
                {
                  title: "Formation terminée",
                  desc: "Le cours React Avancé a été complété par 15 apprenants",
                  time: "Il y a 1 heure",
                },
                {
                  title: "Rappel évaluation",
                  desc: "3 évaluations à chaud en attente de validation",
                  time: "Il y a 3 heures",
                },
              ].map((notif, idx) => (
                <DropdownMenuItem
                  key={idx}
                  className="flex flex-col items-start gap-1 p-3 hover:bg-violet-50 rounded-lg"
                >
                  <div className="text-sm font-medium">{notif.title}</div>
                  <div className="text-xs text-gray-500">{notif.desc}</div>
                  <div className="text-xs text-gray-400">{notif.time}</div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* 👤 Profil utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative w-10 h-10 rounded-full hover:ring-2 hover:ring-violet-400 transition"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/professional-headshot.png" alt="Profile" />
                  <AvatarFallback className="text-white bg-gradient-to-br from-violet-500 to-purple-600">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 rounded-xl border border-gray-100 shadow-lg bg-white"
            >
              <DropdownMenuLabel className="px-4 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-t-xl">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs opacity-90">{user?.email}</p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <Link to="/cfp/profile">
                <DropdownMenuItem className="px-4 py-2 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition">
                  <User className="w-4 h-4 mr-2" /> Profil
                </DropdownMenuItem>
              </Link>

              {/* <DropdownMenuItem className="px-4 py-2 hover:bg-violet-50 hover:text-violet-600 rounded-lg transition">
                <Settings className="w-4 h-4 mr-2" /> Paramètres
              </DropdownMenuItem> */}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" /> Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
