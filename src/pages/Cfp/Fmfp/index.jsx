import { useEffect, useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { formatNumber } from "../../../utils/objectifs";
import { useAuth } from "../../../contexts/AuthContext";
import {
  EllipsisVertical,
  Pencil,
  Trash2,
  Eye,
  Phone,
  Mail,
  Briefcase,
  DollarSign,
  X,
  Check,
  Lock,
  Settings,
  MessageCircleMore,
  Send,
  Loader,
} from "lucide-react";
import EditFmfp from "./edit-fmfp";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import { getStatusFmfpColor, dateFormat } from "../../../utils/global";
import axios from "../../../config/axios";
import ProjectDrawer from "../../../components/drawer/customer/ProjectDrawer";
import Search from "../../../components/search/search";
import { useSearch } from "../../../hooks/cfp/skill/useSearch";
import CommentsFmfp from "./comments-fmfp";

export default function FmfpIndex({ status_name }) {
  const {
    getAllProjectsFmfp,
    projects,
    show,
    deleteFmpf,
    loading,
    update,
    status,
    mdls,
    getAllComments,
    deleteComment,
    commentFolder,
    changeStatus,
    changeStatusWithCreatingProject,
    entreprises,
  } = useOutletContext();
  const { searchTerm, setSearchTerm, handleChange } = useSearch();
  const [dataEtp, setDataEtp] = useState({});
  const [showDrawer, setShowDrawer] = useState(false);
  const [load, setLoad] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDrawerComments, setShowDrawerComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pendingStatusId, setPendingStatusId] = useState(null);
  const [pendingProjectId, setPendingProjectId] = useState(null);

  const menuStatus = [
    {
      id: 1,
      label: "Validé",
      in_status: "En soumission",
      idStatus: 4,
      icon: <Check size={16} className="text-green-500 mr-2" />,
    },
    {
      id: 2,
      label: "Refusé",
      in_status: "En soumission",
      idStatus: 2,
      icon: <X size={16} className="text-red-500 mr-2" />,
    },
    {
      id: 3,
      label: "En soumission",
      in_status: "Refusé",
      idStatus: 1,
      icon: <Settings size={16} className="text-gray-500 mr-2" />,
    },
    {
      id: 4,
      label: "En soumission",
      in_status: "Cloturé",
      idStatus: 1,
      icon: <Settings size={16} className="text-gray-500 mr-2" />,
    },
    {
      id: 5,
      label: "Cloturé",
      in_status: "Service fait",
      idStatus: 5,
      icon: <Lock size={16} className="text-red-500 mr-2" />,
    },
    {
      id: 6,
      label: "Fait",
      in_status: "Validé" || "Exécuté",
      idStatus: 6,
      icon: <Send size={16} className="text-green-500 mr-2" />,
    },
  ];

  const { symbol } = useAuth();

  const [selectedMenu, setSelectedMenu] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setSelectedMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    getAllProjectsFmfp();
  }, []);

  useEffect(() => {
    setSearchTerm("");
  }, [status_name]);

  const handleEdit = async (project) => {
    setSelectedProject(project);
    setShowEdit(true);
    setIsLoading(true);
    try {
      const res = await show(project.id);
      setDetails(res.fmfp);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const statusFilteredProjects = projects.filter((p) => {
    if (status_name === "Exécuté") {
      return p.status_name === "Validé" || p.status_name === "Exécuté";
    } else {
      return p.status_name === status_name;
    }
  });
  const filteredProjects = statusFilteredProjects.filter((p) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    const matchEtp = p.etp_name?.toLowerCase().includes(term);
    const matchModules = p.modules?.some((mdl) =>
      mdl.moduleName?.toLowerCase().includes(term)
    );

    return matchEtp || matchModules;
  });

  const totalRequetedAmount = statusFilteredProjects.reduce(
    (total, projet) => total + (projet.requested_amount || 0),
    0
  );

  const handleDelete = async (id) => {
    try {
      const res = await deleteFmpf(id);
      if (res.status === 200) {
        toastr.success(res.message);
      }

      setSelectedMenu(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = (project) => {
    setSelectedMenu(null);
    return navigate(`/cfp/fmfp/details/${project.id}`);
  };

  const toggleMenu = (projectId) => {
    setSelectedMenu(selectedMenu === projectId ? null : projectId);
  };

  const handleClick = async (idEtp) => {
    setLoad(true);
    setShowDrawer(true);
    try {
      const res = await axios.get(`/cfp/etp-drawer/${idEtp}`);
      setDataEtp(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  const changeFolderStatus = (menuStatus, project) => {
    setSelectedProject(project);
    setSelectedMenu(null);

    if (menuStatus.id == 1) {
      setPendingStatusId(menuStatus.idStatus);
      setPendingProjectId(project.id);
      setShowModal(true);
    } else {
      cancelCreatingProject(menuStatus.idStatus, project.id);
    }
  };

  const createProject = async () => {
    try {
      await changeStatusWithCreatingProject(pendingStatusId, pendingProjectId);
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
    }
  };

  const cancelCreatingProject = async (statusId, projectId) => {
    try {
      setShowModal(false);
      await changeStatus(statusId, projectId);
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setSelectedMenu(null);
    }
  };

  const handleShowComments = async (folderId) => {
    setShowDrawerComments(true);
    setSelectedProject(folderId);
    setIsLoadingComments(true);
    try {
      const res = await getAllComments(folderId);
      setComments(res.comments);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3  mb-10 gap-5">
        <div className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-xl">
          <div>
            <h1 className="font-semibold">Total dossier fmfp </h1>
            <p className="text-2xl font-semibold">
              {statusFilteredProjects.length}
            </p>
          </div>
          <div className="bg-blue-500 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex justify-between items-center  bg-white border border-gray-200 p-4 rounded-xl">
          <div>
            <h1 className="font-semibold"> Total montant demandé </h1>
            <p className="text-2xl font-semibold">
              {formatNumber(totalRequetedAmount)} {symbol}
            </p>
          </div>
          <div className="bg-emerald-500 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-5">
        <Search
          value={searchTerm}
          onChange={handleChange}
          placeholder="Recherche..."
        />
      </div>
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
              <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider">
                Période du projet
              </th>
              <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider">
                Montant demandé
              </th>
              <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider">
                Entreprise
              </th>
              {status_name !== "En soumission" && status_name !== "Refusé" && (
                <>
                  <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider">
                    Premier acompte
                  </th>
                  {status_name !== "Exécuté" && (
                    <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider">
                      Deuxième acompte
                    </th>
                  )}
                </>
              )}

              <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider">
                Statut
              </th>
              <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider">
                Changer le status
              </th>
              <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider">
                Commentaires
              </th>

              <th className="p-4 font-semibold text-left text-xs uppercase tracking-wider w-20">
                Actions
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
                    <div className="flex flex-col">
                      <span
                        onClick={() => handleClick(p.idEtp)}
                        className="font-semibold text-gray-900 text-sm cursor-pointer "
                      >
                        {p.etp_name || "Aucun nom"}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Mail size={12} />
                        <span>{p.etp_email || "Aucun email"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Phone size={12} />
                        <span>
                          {p?.etp_phone ? p.etp_phone : "Aucun numéro"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {status_name !== "En soumission" &&
                    status_name !== "Refusé" && (
                      <>
                        <td>
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold">
                              <span>
                                {p.first_deposit !== null &&
                                p.first_deposit !== "" &&
                                p.first_deposit !== 0
                                  ? `${formatNumber(p.first_deposit)} ${symbol}`
                                  : "-"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 font-semibold">
                              <span>
                                {p.date_first_deposit
                                  ? dateFormat(p.date_first_deposit)
                                  : "-"}
                              </span>
                            </div>
                          </div>
                        </td>
                        {status_name != "Exécuté" && (
                          <td>
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold">
                                <span>
                                  {p.second_deposit !== null &&
                                  p.second_deposit !== 0 &&
                                  p.second_deposit !== ""
                                    ? `${formatNumber(
                                        p.second_deposit
                                      )} ${symbol}`
                                    : "-"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 font-semibold">
                                <span>
                                  {p.date_second_deposit
                                    ? dateFormat(p.date_second_deposit)
                                    : "-"}
                                </span>
                              </div>
                            </div>
                          </td>
                        )}
                      </>
                    )}

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusFmfpColor(
                        p.status_name
                      )}`}
                    >
                      {p.status_name}
                    </span>
                  </td>
                  <td>
                    {menuStatus
                      .filter((menu) => menu.in_status === p.status_name)
                      .map((menu) => {
                        return (
                          <button
                            key={menu.id}
                            value={menu.idStatus}
                            onClick={() => changeFolderStatus(menu, p)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-full "
                          >
                            {menu.icon}
                            {menu.label}
                          </button>
                        );
                      })}
                  </td>
                  <td className="p-4 relative">
                    <span className="flex justify-center">
                      <button
                        onClick={() => handleShowComments(p.id)}
                        className="p-2 rounded-lg hover:bg-blue-100 transition-all duration-200 "
                      >
                        <MessageCircleMore
                          size={18}
                          className={`${
                            p.comment_count > 0
                              ? "text-green-500 font-bold"
                              : "text-gray-300"
                          } group-hover:text-blue-600`}
                        />
                      </button>
                    </span>
                  </td>

                  <td className="p-4 relative">
                    <span className="flex justify-center">
                      <button
                        onClick={() => toggleMenu(p.id)}
                        className="p-2 rounded-lg hover:bg-blue-100 transition-all duration-200 "
                      >
                        <EllipsisVertical
                          size={18}
                          className="text-gray-400 group-hover:text-blue-600"
                        />
                      </button>
                    </span>
                  </td>

                  {selectedMenu === p.id && (
                    <div
                      ref={menuRef}
                      className="absolute right-4  mt-20 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden animate-in fade-in-0 zoom-in-95"
                    >
                      {(status_name === "Service fait" ||
                        status_name === "Cloturé") && (
                        <button
                          onClick={() => cancelCreatingProject(4, p.id)}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          <Settings size={16} className="mr-3 text-blue-500" />
                          Remettre en exécution
                        </button>
                      )}

                      {status_name === "Exécuté" && (
                        <button
                          onClick={() => cancelCreatingProject(1, p.id)}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          <Loader size={16} className="mr-3 text-blue-500" />
                          Remettre en soumission
                        </button>
                      )}

                      <button
                        onClick={() => handleView(p)}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        <Eye size={16} className="mr-3 text-blue-500" />
                        Voir les détails
                      </button>
                      <button
                        onClick={() => handleEdit(p)}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        <Pencil size={16} className="mr-3 text-green-500" />
                        Modifier
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 bg-red-50 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} className="mr-3" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          {/* semi-transparent backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={cancelCreatingProject}
          />

          {/* modal panel */}
          <div className="relative z-10 w-full max-w-md mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-slate-900 dark:text-slate-100"
                >
                  Voulez vous que je cree les projets
                </h2>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  Confirmez votre choix : créer le(s) projet(s) maintenant ?
                </p>

                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    onClick={cancelCreatingProject}
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    Non
                  </button>

                  <button
                    onClick={createProject}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Oui
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEdit && selectedProject && (
        <EditFmfp
          status_name={status_name}
          isLoading={isLoading}
          entreprises={entreprises}
          status={status}
          data={details}
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          onUpdate={update}
          mdls={mdls}
        />
      )}
      {showDrawer && (
        <ProjectDrawer
          data={dataEtp}
          isLoading={load}
          isShow={showDrawer}
          onClose={() => setShowDrawer(false)}
          account="cfp"
        />
      )}

      {showDrawerComments && (
        <CommentsFmfp
          isOpen={showDrawerComments}
          onClose={() => setShowDrawerComments(false)}
          comments={comments}
          idFolder={selectedProject}
          onComment={commentFolder}
          onDelete={deleteComment}
          isLoading={isLoadingComments}
        />
      )}
    </div>
  );
}
