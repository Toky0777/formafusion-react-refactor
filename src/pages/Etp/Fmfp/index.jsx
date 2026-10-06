import { useEffect, useState } from "react";
import axios from "../../../config/axios";
import { formatNumber } from "../../../utils/objectifs";
import { dateFormat, getStatusFmfpColor } from "../../../utils/global";
import { useAuth } from "../../../contexts/AuthContext";

export default function FmfpIndexEtp({ status_name }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { symbol } = useAuth();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await axios.get("/etp/fmfp");
        setData(res.data.folderFmfp);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProjects = data.filter((p) => {
    if (status_name === "Exécuté") {
      return p.status_name === "Validé" || p.status_name === "Exécuté";
    } else {
      return p.status_name === status_name;
    }
  });

  return (
    <div>
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider">
                #
              </th>
              {status_name !== "En soumission" && status_name !== "Refusé" && (
                <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider">
                  Code
                </th>
              )}

              <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider">
                Type
              </th>

              <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider">
                Formation
              </th>
              <th className="p-4 font-semibold  text-xs uppercase tracking-wider">
                Période du projet
              </th>
              <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider">
                Montant demandé
              </th>

              <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="12" className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-gray-400 italic text-sm">
                      Chargement...
                    </div>
                  </div>
                </td>
              </tr>
            ) : filteredProjects?.length === 0 ? (
              <tr>
                <td colSpan="12" className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <p className="text-lg font-semibold  mb-1">Aucun projet</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProjects?.map((p, index) => (
                <tr key={p.id} style={{ animationDelay: `${index * 50}ms` }}>
                  <td className="p-4 font-medium  ">
                    <span className="text-gray-400 "> {p.id} </span>
                  </td>
                  {status_name !== "En soumission" &&
                    status_name !== "Refusé" && (
                      <td className="p-4 font-medium  ">
                        <span className="text-gray-400 ">{p.code || "-"}</span>
                      </td>
                    )}

                  <td className="p-4 font-medium  ">
                    {p.type_fmfp_description}{" "}
                    <span className="text-gray-400 "> {p.ap_name || ""} </span>
                  </td>
                  <td className="p-4 text-gray-700 ">
                    {p?.modules?.length > 0 ? (
                      p.modules.map((mdl) => (
                        <p className="font-semibold" key={mdl.idModule}>
                          - {mdl.moduleName}{" "}
                        </p>
                      ))
                    ) : (
                      <div>Aucune formation</div>
                    )}{" "}
                  </td>

                  <td>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2 font-semibold">
                        <span>{dateFormat(p.start_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                        <span>{dateFormat(p.end_date)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">
                    {formatNumber(p.requested_amount)} {symbol}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusFmfpColor(
                        p.status_name
                      )}`}
                    >
                      {p.status_name}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
