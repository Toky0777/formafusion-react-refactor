import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Crown,
  User,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  Gift,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import axios from "../../config/axios";
import { Link } from "react-router-dom";

export function GlobalHeaderEtp({ onSearch }) {
  const { user, isLoading, logout, customerName } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [suggestions, setSuggestions] = useState([]);
  const [totalReward, setTotalReward] = useState(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        // const { data } = await axios.get(
        //   `/key-suggestion?key=${encodeURIComponent(searchQuery)}`
        // );
        setSuggestions([]);
      } catch (err) {
        console.error("Erreur fetch suggestions:", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const countTotalReward = async () => {
    try {
      const response = await axios.get("/entreprises/rewards/total");
      setTotalReward(response.data);
      console.log(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    countTotalReward();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSuggestions([]);
    }
  };

  const languages = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
  ];

  if (isLoading)
    return (
      <header className="px-6 py-4 bg-white border-b">Chargement...</header>
    );

  return (
    <header className="px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex flex-col">
            <div className="text-xl font-semibold text-gray-800">
              <span className="text-violet-600">{customerName}</span>
            </div>
            <div className="mt-1 text-sm text-gray-600">
              Bonjour {user ? `${user.name} ${user.firstName || ""}` : "Invité"}{" "}
              👋
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative pl-2">
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-9"
            />
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 top-1/2" />
            {searchQuery && suggestions.length > 0 && (
              <div className="absolute left-0 z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md top-full max-h-64">
                {suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setSearchQuery(s.context);
                      onSearch(s.context);
                      setSuggestions([]);
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
          <div className="relative">
            <div
              className="flex items-center gap-2 px-3 py-1 transition-colors bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <span className="text-lg">
                {languages.find((lang) => lang.code === selectedLanguage)?.flag}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {languages
                  .find((lang) => lang.code === selectedLanguage)
                  ?.code.toUpperCase()}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            {showLanguageDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]">
                {languages.map((language) => (
                  <div
                    key={language.code}
                    className="flex items-center gap-3 px-3 py-2 transition-colors cursor-pointer hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setSelectedLanguage(language.code);
                      setShowLanguageDropdown(false);
                    }}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm text-gray-700">
                      {language.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Upgrade Button */}
          <Button className="px-4 py-2 font-medium text-white rounded-lg bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade
          </Button>

          <div className="relative">
            <Link
              to="/etp/loyalty_rewards/list"
              className="flex items-center gap-1 px-3 py-2 transition-colors rounded-lg cursor-pointer bg-green-50 hover:bg-green-100"
            >
              <Gift className="w-5 h-5 text-green-600 animate-pulse" />
              {totalReward > 0 && (
                <Badge className="text-xs text-white bg-green-600">
                  {totalReward}
                </Badge>
              )}
            </Link>
            <div className="absolute flex items-center justify-center w-2 h-2 bg-red-500 rounded-full -top-1 -right-1">
              <span className="text-xs font-bold text-white">5</span>
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* Notifications */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 rounded-lg hover:bg-gray-100"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <Badge className="absolute flex items-center justify-center w-5 h-5 p-0 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start p-3">
                <div className="text-sm font-medium">
                  Nouveau apprenant inscrit
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Marie Dubois s'est inscrite au cours JavaScript
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Il y a 2 minutes
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-3">
                <div className="text-sm font-medium">Formation terminée</div>
                <div className="mt-1 text-xs text-gray-500">
                  Le cours React Avancé a été complété par 15 apprenants
                </div>
                <div className="mt-1 text-xs text-gray-400">Il y a 1 heure</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-3">
                <div className="text-sm font-medium">Rappel évaluation</div>
                <div className="mt-1 text-xs text-gray-500">
                  3 évaluations à chaud en attente de validation
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Il y a 3 heures
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative w-10 h-10 rounded-full"
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
              className="w-64 z-[9999] relative rounded-2xl shadow-lg bg-white text-gray-800 border border-gray-200"
            >
              {/* User Info */}
              <DropdownMenuLabel className="px-4 py-3 font-normal text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-2xl">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none opacity-80">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="my-1" />

              {/* Profil */}
              <Link to="/etp/profile">
                <DropdownMenuItem className="px-4 py-2 transition-colors rounded-lg cursor-pointer hover:bg-indigo-100 hover:text-indigo-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>Profil</span>
                </DropdownMenuItem>
              </Link>

              {/* Paramètres */}
              <DropdownMenuItem className="px-4 py-2 transition-colors rounded-lg cursor-pointer hover:bg-indigo-100 hover:text-indigo-600">
                <Settings className="w-4 h-4 mr-2" />
                <span>Paramètres</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1" />

              {/* Déconnexion */}
              <DropdownMenuItem
                className="px-4 py-2 text-red-600 transition-colors rounded-lg cursor-pointer hover:bg-red-100 hover:text-red-700"
                onClick={logout} // <-- fonction du context
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
