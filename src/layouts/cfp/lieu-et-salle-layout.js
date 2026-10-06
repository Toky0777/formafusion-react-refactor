
import { Outlet, useParams } from "react-router-dom";
import { FaPlus, FaAngleDown } from "react-icons/fa";
import { MdFilterAlt } from "react-icons/md";
import icons from "../../components/icons/icone";
import { useState, useEffect } from "react";
import ModalLieux from "../../components/Modals/place/ModalLieux";
import axios from "../../config/axios";
import codePostal from "../../components/codePostal/codePostal";

export default function LieuetSalleLayout() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [lieux, setLieux] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  // filtre

  const [filterType, setFilterType] = useState([]);
  const [isFiltre, setIsFiltre] = useState(false);
  const [filterPostal, setFilterPostal] = useState("");
  const [filterRegion, setFilterRegion] = useState("");

  const toogleFiltre = () => {
    setIsFiltre(!isFiltre);
  }

  const getRegionName = (regionCode) => {
    switch (regionCode) {
      case "1": return "Antananarivo";
      case "2": return "Antsirabe";
      case "3": return "Fianarantsoa";
      case "4": return "Mahajanga";
      case "5": return "Toamasina";
      case "6": return "Toliary";
      default: return "Région inconnue";
    }
  };

  //filtre
  const fetchLieux = async () => {
    try {
      let response;
      if (!id || id.trim() === "") {
        // récupérer tous les lieux
        response = await axios.get(`/cfp/lieuxsearch`);
      } else {
        // récupérer les lieux par type
        response = await axios.get(`/cfp/lieux/${id}`);
      }
      // Adapter selon ton API
      const lieuxData = response.data.lieux || response.data.data || [];
      setLieux(lieuxData);      

    } catch (error) {
      console.error("Erreur lors de la récupération des lieux", error);
    }
  };

  const fetchData = async (filtre = ["0"]) => {

    setLoading(true);
    try {
      const url = "/cfp/lieux";

      // Paramètres dynamiques
      let params = {};
      if (filterType.length > 0) {
        params.type = filterType.join(',');
      }
      if (searchTerm) {
        params.search = searchTerm;
      }

      const lieuxRes = await axios.get(url);

      const lieux = lieuxRes.data.lieux_addSalle || [];
      
      const lieuxSalle = lieuxRes.data.lieux_salles || [];
      const type = lieuxRes.data.lieu_types || [];

      setData(lieuxRes.data);

      const lieuxAvecSalles = lieux.map(lieu => {

        const codePostalInfo = codePostal.find(c => Number(c.code) === Number(lieu.vi_code_postal));
        const region = codePostalInfo ? getRegionName(codePostalInfo.region) : "Région inconnue";

        return {
          ...lieu,
          villeRegion: region
        };
      });


      setLieux(lieuxAvecSalles);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchLieux();
  }, [id]);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setFilterType((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const typeLabels = {
    "1": "Public",
    "2": "Privée",
    "3": "Location",
  };

  const filteredLieux = lieux
    .filter(lieu => lieu && lieu.li_name) // élimine les entrées invalides
    .filter(lieu =>
      lieu.li_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType.length === 0 || filterType.includes(String(lieu.idLieuType)))
    );


  return (
    <>
      <header >
        <div className="px-6 py-4">
          <nav className="flex flex-wrap md:flex-nowrap justify-between items-center gap-6">

            {/* Logo/Titre */}
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent tracking-tight">
                Lieu et Salle
              </h1>
            </div>

            {/* Barre de recherche */}
            <div className="flex flex-col md:flex-row gap-6 md:items-center flex-1 md:justify-center">
              <div className="relative flex items-center bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl w-full md:w-[28em] px-5 py-3 shadow-sm">
                <input
                  type="text"
                  placeholder="Rechercher un lieu, une salle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm font-medium"
                />
                <icons.search className="text-gray-400 text-lg group-hover:text-gray-500 transition-colors" />
              </div>
            </div>

            {/* Section Filtres */}
            <div className="relative flex items-center gap-4">
              <div
                className="flex items-center gap-3 px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl cursor-pointer"
                onClick={toogleFiltre}
              >
                <MdFilterAlt className="text-gray-400 text-xl " />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-800 transition-colors">
                  {filterType.length === 0 ? "Filtres" : "Modifier"}
                </span>
                <FaAngleDown className="text-gray-400 group-hover:text-gray-600 transition-all duration-300 group-hover:rotate-180" />
              </div>

            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3">
              {/* Ajout Lieu */}
              <div
                onClick={() => setIsFormOpen(true)}
                className="group flex items-center px-4 py-2.5 gap-2 text-white bg-gradient-to-r bg-slate-200 relative overflow-hidden rounded-md"
              >
                <FaPlus className="text-sm relative z-10" />
                <span className="text-sm relative z-10 text-gray-500">Ajout Lieu</span>
              </div>
            </div>
          </nav>

          {/* Menu Filtre */}
          {isFiltre && (
            <div className=" right-0 mt-6 w-[65%] bg-white/30 backdrop-blur-lg border border-gray-200/65 rounded-lg  p-6 animate-fadeIn z-30 ">

              <div className="flex items-center gap-3">

                <div className="flex gap-7">

                  <label className="flex items-center gap-3 text-sm text-gray-700  cursor-pointer group">
                    <input
                      type="checkbox"
                      value="1"
                      checked={filterType.includes("1")}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 transition-all"
                    />
                    <span className="text-gray-500">Public</span>
                  </label>

                  <label className="flex items-center gap-3 text-sm text-gray-700  cursor-pointer group">
                    <input
                      type="checkbox"
                      value="2"
                      checked={filterType.includes("2")}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 transition-all"
                    />
                    <span className="text-gray-500">Privée</span>
                  </label>

                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer group">
                    <input
                      type="checkbox"
                      value="3"
                      checked={filterType.includes("3")}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 transition-all"
                    />
                    <span className="text-gray-500">Location</span>
                  </label>

                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <input
                    type="text"
                    placeholder="Filtrer par code postal"
                    value={filterPostal}
                    onChange={(e) => setFilterPostal(e.target.value)}
                    className="border p-2 rounded-xl"
                  />

                  <select
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value)}
                    className="border p-2 rounded-xl"
                  >
                    <option value="">Toutes les régions</option>
                    <option value="Antananarivo">Antananarivo</option>
                    <option value="Antsirabe">Antsirabe</option>
                    <option value="Fianarantsoa">Fianarantsoa</option>
                    <option value="Mahajanga">Mahajanga</option>
                    <option value="Toamasina">Toamasina</option>
                    <option value="Toliary">Toliary</option>
                  </select>
                </div>

              </div>

              {/* Filtres sélectionnés */}
              <div className="flex flex-wrap gap-2">
                {filterType.map((type) => (
                  <div
                    key={type}
                    className="flex items-center px-3 py-1.5 bg-slate-200 text-gray-500 rounded-md text-xs shadow-sm  "
                  >
                    {typeLabels[type]}
                    <button
                      onClick={() =>
                        setFilterType((prev) => prev.filter((t) => t !== type))
                      }
                      className="ml-2  text-gray-600 rounded-full w-4 h-4 flex items-center justify-center transition-all duration-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </header>

      {/* Modals */}
      <ModalLieux
        show={isFormOpen}
        handleClose={() => setIsFormOpen(false)}
        onAjoutSuccess={() => fetchData()}
      />

      <main>
        <div className="mt-20 flex flex-col min-h-screen">
          <Outlet context={{
            lieux: filteredLieux, searchTerm, setLieux, filterType, setFilterType, filterPostal, setFilterPostal, filterRegion, setFilterRegion
          }} />
        </div>
      </main>

    </>
  );
}