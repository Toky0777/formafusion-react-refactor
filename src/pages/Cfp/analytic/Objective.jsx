import Table from "../../../components/table/Table";
import { allModule, saveGoal } from "../../../utils/objectifs";
import { ChevronDown, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import "toastr/build/toastr.min.css";
import toastr from "toastr";

export default function Objectives() {
  const setting = JSON.parse(sessionStorage.getItem("setting"));

  const symbol = setting?.currency_code;
  const [modules, setModules] = useState([]);
  const [isEditing, setIsEditing] = useState({
    idModule: null,
    idMonth: null,
  });
  const [totalGoal, setTotalGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDomain, setOpenDomain] = useState(null);

  useEffect(() => {
    const fetchAllModule = async () => {
      setIsLoading(true);
      try {
        const res = await allModule();
        setTotalGoal(
          parseInt(res.data.totalGoal.replace(/\s/g, "").replace(",", "."))
            .toLocaleString("fr-FR")
            .replace(/\u202f/g, " ")
        );
        setModules(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllModule();
  }, []);

  const groupedData = modules.data?.reduce((acc, module) => {
    if (!acc[module.domaineName]) {
      acc[module.domaineName] = [];
    }
    acc[module.domaineName].push(module);

    return acc;
  }, {});

  const handleClick = (idModule, idMonth) => {
    setIsEditing({ idModule, idMonth });
  };

  const calculateTotalGoal = (modulesData) => {
    const total = modulesData.reduce((sum, mod) => {
      const moduleTotal = Object.values(mod.moduleGoal || {}).reduce(
        (acc, val) => acc + (parseInt(val) || 0),
        0
      );
      return sum + moduleTotal;
    }, 0);

    return total.toLocaleString("fr-FR").replace(/\u202f/g, " ");
  };

  const handleValueChange = async (idModule, monthIndex, newValue) => {
    const year = new Date().getFullYear();
    const amount = parseInt(newValue, 10);
    const module = modules.data.find((mod) => mod.idModule === idModule);
    const currentValue = module?.moduleGoal?.[monthIndex + 1] || 0;

    if (amount === currentValue) {
      setIsEditing({ idModule: null, idMonth: null });
      return;
    }

    try {
      await saveGoal({
        year,
        month: monthIndex + 1,
        idModule,
        amount,
      });
      setModules((prevModules) => {
        const updatedData = prevModules.data.map((mod) => {
          if (mod.idModule === idModule) {
            const updatedGoals = {
              ...mod.moduleGoal,
              [monthIndex + 1]: amount,
            };
            return { ...mod, moduleGoal: updatedGoals };
          }
          return mod;
        });
        setTotalGoal(calculateTotalGoal(updatedData));

        return { ...prevModules, data: updatedData };
      });

      toastr.success("Modifié avec succès");
      setIsEditing({ idModule: null, idMonth: null });
    } catch (error) {
      toastr.error("Erreur lors de la sauvegarde");
    }
  };

  const handleShowTable = (domaineName) => {
    setOpenDomain(openDomain === domaineName ? null : domaineName);
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="mb-20 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-xl p-4 text-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Target className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-100 mb-1">
                      Année : {modules.currentYear}
                    </p>

                    <p className="text-indigo-100 text-sm">
                      Montant en {symbol}
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl px-8 py-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-5 h-5 text-indigo-200" />
                    <p className="text-sm text-indigo-100">Objectif total</p>
                  </div>
                  <p className="text-4xl font-black">
                    {totalGoal} <span className="text-2xl">{symbol}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Domain Cards */}
            <div className="space-y-8">
              {groupedData &&
                Object.entries(groupedData).map(
                  ([domainName, domainModules]) => {
                    const totalDomain = domainModules.reduce((sum, mod) => {
                      const moduleTotal = Object.values(
                        mod.moduleGoal || {}
                      ).reduce((acc, val) => acc + (parseInt(val) || 0), 0);
                      return sum + moduleTotal;
                    }, 0);

                    const isOpen = openDomain === domainName;

                    return (
                      <div
                        key={domainName}
                        className="bg-white rounded-xl  transition-all duration-300 overflow-hidden border border-gray-100"
                      >
                        <div
                          onClick={() => handleShowTable(domainName)}
                          className="flex items-center justify-between px-6 py-2 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <h2
                              className={`text-lg font-semibold transition-colors ${
                                isOpen
                                  ? "text-indigo-600"
                                  : "text-gray-800 group-hover:text-indigo-400"
                              }`}
                            >
                              {domainName}
                            </h2>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <span className="text-lg font-bold text-gray-900">
                                {totalDomain
                                  .toLocaleString("fr-FR")
                                  .replace(/\u202f/g, " ")}{" "}
                                <span className="text-lg text-gray-600">
                                  {symbol}
                                </span>
                              </span>
                            </div>

                            <div
                              className={`p-2 rounded-lg transition-all ${
                                isOpen
                                  ? "bg-indigo-100 text-indigo-600 rotate-180"
                                  : "bg-gray-100 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                              }`}
                            >
                              <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="border-t border-gray-100 bg-gray-50/50">
                            <Table
                              domainModules={domainModules}
                              isEditing={isEditing}
                              handleClick={handleClick}
                              handleValueChange={handleValueChange}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
