import { useContext, useEffect, useState } from "react";
import { AttendanceContext } from "../../../contexts/cfp/AttendanceProvider";
import axios from "../../../config/axios";
import { Spinner } from "../../../components/ui/spinner";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  GraduationCap,
  TrendingUp,
  XCircle,
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { AnimatePresence, motion } from "framer-motion";
import { AttendanceDrawerEtp } from "./attendance-drawer-etp";
dayjs.locale("fr");
const formatMonthYear = (dateStr) => {
  return new Date(dateStr + "-01").toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
};
// Fonction utilitaire pour formater les dates
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
export function AttendanceProjectEtp() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [idProjet, setIdProjet] = useState(null);
  const { search } = useContext(AttendanceContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/entreprise/emargements/projets");
        setProjects(response.data.projects.project_items || []);
      } catch (error) {
        console.error(error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const filteredProjects = projects.filter((projet) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      projet.module_name?.toLowerCase().includes(query) ||
      projet.cfp_name?.toLowerCase().includes(query)
    );
  });
  // Regrouper les projets filtrés par mois et année
  const groupedProjects = filteredProjects.reduce((acc, projet) => {
    const monthKey = new Date(projet.start_date).toISOString().slice(0, 7); // YYYY-MM
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(projet);
    return acc;
  }, {});

  const sortedGroups = Object.entries(groupedProjects).sort((a, b) =>
    b[0].localeCompare(a[0])
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  if (sortedGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm">
        <Filter className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-lg text-gray-500 font-medium">Aucun projet trouvé</p>
        <p className="text-sm text-gray-400 mt-1">
          {search
            ? "Aucun résultat ne correspond à votre recherche"
            : "Vous n'avez participé à aucune formation pour le moment"}
        </p>
      </div>
    );
  }
  const handleShow = (idProjet) => {
    setIdProjet(idProjet);
    setShowAttendance(true);
  };
   console.log(sortedGroups);
  
  return (
    <div className="space-y-6">
      <AnimatePresence>
        {sortedGroups.map(([monthKey, projectsInMonth], groupIndex) => (
          <motion.div
            key={monthKey}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: groupIndex * 0.1,
            }}
          >
            {/* En-tête du groupe */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800 capitalize">
                  {formatMonthYear(monthKey)}
                </h2>
                <span className="bg-blue-200 text-blue-700 text-sm font-medium px-2 py-1 rounded-full">
                  {projectsInMonth.length} formation
                  {projectsInMonth.length > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Contenu du tableau */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 w-8">
                      #
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 min-w-[250px]">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} />
                        Formation
                      </div>
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 min-w-[180px]">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        Période
                      </div>
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} />
                        Centre
                      </div>
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Lieu
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Inscrits
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Present
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Absent
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      A saisir
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    {/* <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        Présence
                      </div>
                    </th> */}

                  </tr>
                </thead>
                <tbody>
                  {projectsInMonth.map((projet, index) => (
                    <motion.tr
                      key={projet.idProjet}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
                      onClick={() => handleShow(projet.idProjet)}
                    >
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                        {groupIndex * 10 + index + 1}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {projet.module_name}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {formatDate(projet.start_date)}
                          </div>
                          <div className="text-gray-500">
                            {formatDate(projet.end_date)}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-700 font-bold text-sm">
                            {projet.cfp_name?.charAt(0) || "?"}
                          </div>
                          <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                            {projet.cfp_name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {projet.li_name === "Default" ? "?" : projet.li_name}
                      </td>
                      <td className="px-6 py-4">
                        {projet.nbApprenant?.total_inscrits }
                      </td>

                      <td className="px-6 py-4">
                        {/* <StatusBadge status={projet.modalite} type="modality" /> */}
                        {projet.nbApprenant?.nb_present
 }
                      </td>
                      <td className="px-6 py-4">
                        {/* <StatusBadge status={projet.modalite} type="modality" /> */}
                       {projet.nbApprenant?.nb_absent }
                      </td>
                      <td className="px-6 py-4">
                        {/* <StatusBadge status={projet.modalite} type="modality" /> */}
                       {projet.nbApprenant?.nb_a_saisir }
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <AttendanceBadge pourcentage={projet.pourcentage} />
                          <AttendanceDetails pourcentage={projet.pourcentage} />
                        </div>
                      </td>

                      {/* <td className="px-6 py-4">
                        <button
                          
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                        >
                          <Eye size={16} />
                          Voir détails
                        </button>
                      </td> */}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Drawer pour les détails de présence */}
      {showAttendance && (
        <AttendanceDrawerEtp
          idProjet={idProjet}
          onClose={() => {
            setShowAttendance(false);
            setIdProjet(null);
          }}
        />
      )}
    </div>
  );
}
const AttendanceBadge = ({ pourcentage }) => {
  if (!pourcentage) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        <AlertCircle size={14} />
        <span>Données indisponibles</span>
      </div>
    );
  }

  const present = parseFloat(pourcentage.present.replace(",", "."));
  const partiel = parseFloat(pourcentage.partiel.replace(",", "."));
  const absent = parseFloat(pourcentage.absent.replace(",", "."));

  if (present === 100) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CheckCircle2 size={14} />
        <span>100% Présent 🎉</span>
      </div>
    );
  }

  if (absent === 100) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <XCircle size={14} />
        <span>100% Absent 😞</span>
      </div>
    );
  }

  if (partiel === 100) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        <Clock size={14} />
        <span>100% Partiel</span>
      </div>
    );
  }

  // Cas mixte - on affiche le pourcentage principal
  if (present > partiel && present > absent) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <TrendingUp size={14} />
        <span>{present}% Présent</span>
      </div>
    );
  } else if (absent > present && absent > partiel) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <XCircle size={14} />
        <span>{absent}% Absent</span>
      </div>
    );
  } else {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        <Clock size={14} />
        <span>{partiel}% Partiel</span>
      </div>
    );
  }
};
const AttendanceDetails = ({ pourcentage }) => {
  if (!pourcentage) return null;

  const present = parseFloat(pourcentage.present.replace(",", "."));
  const partiel = parseFloat(pourcentage.partiel.replace(",", "."));
  const absent = parseFloat(pourcentage.absent.replace(",", "."));

  return (
    <div className="flex gap-2 text-xs">
      {present > 0 && (
        <span className="text-green-600 font-medium">{present}% présent</span>
      )}
      {partiel > 0 && (
        <span className="text-yellow-600 font-medium">{partiel}% partiel</span>
      )}
      {absent > 0 && (
        <span className="text-red-600 font-medium">{absent}% absent</span>
      )}
    </div>
  );
};
