import { useState, useEffect } from "react";
import axios from "../../../config/axios";
import { BarChart3, ChevronDown, ChevronUp, Download } from "lucide-react";

export default function EvaluationsFroidsEtp() {
    const [projectResults, setProjectResults] = useState([]);
    const [apprenantResults, setApprenantResults] = useState({});
    const [openProjects, setOpenProjects] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`/etp/eval-froid`)
            .then((res) => setProjectResults(res.data.projectResults || []))
            .catch(() => setProjectResults([]))
            .finally(() => setLoading(false));
    }, []);

    const getApprenantByProjectResult = (idProjet) => {
        axios
            .get(`/etp/eval-froid/detail/${idProjet}`)
            .then((res) => {
                setApprenantResults((prev) => ({
                    ...prev,
                    [idProjet]: res.data.status === 200 ? res.data.apprenants : [],
                }));
            });
    };

    const toggleProject = (idProjet) => {
        setOpenProjects((prev) => ({
            ...prev,
            [idProjet]: !prev[idProjet],
        }));

        if (!openProjects[idProjet] && !apprenantResults[idProjet]) {
            getApprenantByProjectResult(idProjet);
        }
    };

    const downloadResult = (idProjet, idEmploye) => {
        axios({
            url: `/etp/eval-froid/result/${idProjet}/${idEmploye}`,
            method: "GET",
            responseType: "blob",
        })
            .then((res) => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `Resultat_${idEmploye}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            })
            .catch((err) => console.error("Erreur lors du téléchargement :", err));
    };

    if (loading) return <p className="mt-10 text-center text-gray-500">Chargement…</p>;

    return (
        <div className="max-w-6xl px-4 py-8 mx-auto">
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 mb-8 bg-white shadow-sm rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-3 shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-700">Résultats des Évaluations</h1>
                        <p className="text-sm text-gray-500">Suivi et export des évaluations à froid</p>
                    </div>
                </div>
            </div>

            {/* Résultats */}
            {projectResults.length > 0 ? (
                <div className="space-y-6">
                    {projectResults.map((pr) => {
                        const isOpen = openProjects[pr.idProjet];
                        const apprenants = apprenantResults[pr.idProjet] || [];

                        return (
                            <div
                                key={pr.idProjet}
                                className="transition bg-white border shadow-sm rounded-2xl hover:shadow-md"
                            >
                                {/* Header du projet */}
                                <button
                                    onClick={() => toggleProject(pr.idProjet)}
                                    className="flex items-center justify-between w-full px-6 py-4 text-left"
                                >
                                    <div>
                                        <h2 className="text-lg font-semibold text-indigo-700">{pr.module_name}</h2>
                                        <p className="text-sm text-gray-500">
                                            {pr.etp_name} • {pr.projet_date_debut} – {pr.projet_date_fin}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-400">
                                            {apprenants.length > 0
                                                ? `${apprenants.length} apprenant(s)`
                                                : isOpen
                                                    ? "Chargement…"
                                                    : "Voir"}
                                        </span>
                                        {isOpen ? (
                                            <ChevronUp className="w-5 h-5 text-gray-500" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-500" />
                                        )}
                                    </div>
                                </button>

                                {/* Liste des apprenants */}
                                {isOpen && (
                                    <div className="px-6 pb-6">
                                        {apprenants.length > 0 ? (
                                            <div className="grid gap-3 mt-3 sm:grid-cols-2">
                                                {apprenants.map((val) => (
                                                    <div
                                                        key={val.idEmploye}
                                                        className="flex items-center justify-between p-4 border rounded-xl bg-gray-50 hover:bg-gray-100"
                                                    >
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {val.emp_name} {val.emp_firstname}
                                                        </span>
                                                        <button
                                                            onClick={() => downloadResult(pr.idProjet, val.idEmploye)}
                                                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-700 bg-emerald-100 rounded-md hover:bg-emerald-200"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Télécharger
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="py-4 text-sm italic text-gray-500">
                                                Aucun apprenant trouvé.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-gray-500">Aucun résultat disponible.</p>
            )}
        </div>
    );
}
