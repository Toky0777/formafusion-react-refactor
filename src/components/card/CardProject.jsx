import {
  BookOpen,
  Calendar,
  CalendarCheck,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Folder,
  Info,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import {
  FaBoxArchive,
  FaCalendarDays,
  FaCheck,
  FaCircleXmark,
  FaCopy,
  FaEllipsisVertical,
  FaEye,
  FaTrashCan,
  FaTriangleExclamation,
  FaXmark,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import axios from "../../config/axios";
import { API_URL, IMAGE_URL } from "../../config/env";

export const CardProject = ({ projet }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedidProjet, setSelectedidProjet] = useState(null);
  const [showPageApprenant, setShowPageApprenant] = useState(false);
  const [showConfirmSuprimer, setShowConfirmSuprimer] = useState(false);
  const [showConfirmProgramer, setShowConfirmProgramer] = useState(false);
  const [showConfirmDupliquer, setShowConfirmDupliquer] = useState(false);
  const [showConfirmArchiver, setShowConfirmArchiver] = useState(false);
  const [showConfirmAnnuler, setShowConfirmAnnuler] = useState(false);
  const [showConfirmReporter, setShowConfirmReporter] = useState(false);
  const [showConfirmCloturer, setShowConfirmCloturer] = useState(false);
  const [selectedProjetId, setSelectedProjetId] = useState(null);
  const [selectedProjetIdEtp, setSelectedProjetIdEtp] = useState(null);
  const [apprDetail, setApprDetail] = useState([]);
  const [etpDetail, setEtpDetail] = useState([]);
  const [showPage, setShowPage] = useState(false);
  const [etp, setEtp] = useState([]);
  const [formDetail, setFormDetail] = useState([]);
  const [showPageFormateur, setShowPageFormateur] = useState(false);
  const [formateur, setFormateur] = useState([]);
  const [showPageDossier, setShowPageDossier] = useState(false);
  const [apprenants, setApprenants] = useState([]);
  const [tousAppr, setTousAppr] = useState({ apprs: [] });
  const setting = JSON.parse(sessionStorage.getItem("setting"));
  const [selectedProjetIdProjet, setSelectedProjetIdProjet] = useState(null);
  const [heureDetail, setHeureDetail] = useState([]);
  const [showPageHeure, setShowPageHeure] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      "En préparation":
        "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 animate-pulse",
      "En cours":
        "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-pulse",
      Terminé:
        "bg-gradient-to-r from-green-400 via-green-500 to-green-600 animate-pulse",
      Planifié:
        "bg-gradient-to-r from-purple-300 via-purple-400 to-purple-500 animate-pulse",
      Cloturé:
        "bg-gradient-to-r from-red-800 via-red-700 to-red-900 animate-pulse",
    };
    return colors[status] || "bg-gray-500 animate-pulse";
  };

  const formatStatus = (status) => {
    if (status === "En préparation") return "En prep";
    return status;
  };

  const handleShowApprenants = async (idProjet, idEtp) => {
    setSelectedProjetId(idProjet);
    setSelectedProjetIdEtp(idEtp);

    try {
      const response = await axios.get(
        `/cfp/projet/apprenants/getApprenantAdded/${idProjet}`
      );

      const data = response.data;

      setApprDetail(data);

      console.log("detail apprenant:", data);

      setShowPageApprenant(true);

      // 2. Récupération des apprenants du projet
      const apprenantsRes = await axios.get(
        `/cfp/projet/apprenants/getApprenantAdded/${idProjet}`
      );

      const apprenantsData = await apprenantsRes.data;

      console.log("Apprenants du projet:", apprenantsData);

      setApprenants(apprenantsData);

      const tousLesAppr = await axios.get(
        `/cfp/projet/apprenants/getApprenantProjets/${idEtp}`
      );

      const tousLesApprdata = await tousLesAppr.data;

      console.log("tous les apprenant :", tousLesApprdata || []);
      setTousAppr(tousLesApprdata);
    } catch (error) {
      console.error("Erreur lors du chargement de donne :", error);
      alert(`Erreur lors du chargement de donne : ${error.message}`);
    }
  };

  const handleShowHeures = async (idProjet) => {
    setSelectedProjetIdProjet(idProjet);

    try {
      const response = await axios.get(`/cfp/seances/all/${idProjet}`);

      const data = response.data;

      setHeureDetail(data);

      console.log("detail heure:", data);

      setShowPageHeure(true);
    } catch (error) {
      console.error("Erreur lors du chargement de donne :", error);
      alert(`Erreur lors du chargement de donne : ${error.message}`);
    }
  };

  const handleShowEntreprise = async (idEtp, idProjet) => {
    setSelectedProjetId(idProjet);

    try {
      const response = await axios.get(`/cfp/projets/entreprise/${idEtp}`);

      const data = response.data;

      setEtpDetail(data);

      console.log("detail entreprise:", data);

      setShowPage(true);

      const etpProjet = await axios.get(
        `${API_URL}/cfp/projets/${idProjet}/etp/assign`
      );

      const etpProjetData = await etpProjet.data;

      console.log("tous les entreprise de projet:", etpProjetData || []);

      setEtp({
        ...etpProjetData,
        entreprise: [].concat(etpProjetData.entreprise || []),
      });
    } catch (error) {
      console.error("Erreur lors du chargement de donne :", error);
      alert(`Erreur lors du chargement de donne : ${error.message}`);
    }
  };

  const handleShowFormateurs = async (idFormateur, idProjet) => {
    setSelectedProjetId(idProjet);

    try {
      const response = await axios.get(
        `/cfp/projets/formateur/${idFormateur}/mini-cv`
      );

      console.log(idFormateur);

      const data = response.data;

      setFormDetail(data);

      console.log("detail formateur:", data);

      setShowPageFormateur(true);

      const formateurRes = await axios.get(
        `${API_URL}/cfp/projets/${idProjet}/getFormAdded`
      );
      const formateurData = formateurRes.data;
      console.log("Formateurs ajoutés au projet :", formateurData);

      setFormateur(formateurData);
    } catch (error) {
      console.error("Erreur lors du chargement de donne :", error);
      alert(`Erreur lors du chargement de donne : ${error.message}`);
    }
  };

  const toggleMenu = (projetId) => {
    setShowMenu(showMenu === projetId ? null : projetId);
  };

  const askProgramationConfirmation = (idProjet) => {
    setSelectedidProjet(idProjet);
    setShowConfirmProgramer(true);
    setShowMenu(false);
  };

  const askSupressionConfirmation = (idProjet) => {
    setSelectedidProjet(idProjet);
    setShowConfirmSuprimer(true);
    setShowMenu(false);
  };

  const askDuplicationConfirmation = (idProjet) => {
    setSelectedidProjet(idProjet);
    setShowConfirmDupliquer(true);
    setShowMenu(false);
  };

  const askArchiverConfirmation = (idProjet) => {
    setSelectedidProjet(idProjet);
    setShowConfirmArchiver(true);
    setShowMenu(false);
  };

  const askAnnulerConfirmation = (idProjet) => {
    setSelectedidProjet(idProjet);
    setShowConfirmAnnuler(true);
    setShowMenu(false);
  };

  const askReporterConfirmation = (idProjet) => {
    setSelectedidProjet(idProjet);
    setShowConfirmReporter(true);
    setShowMenu(false);
  };

  const askCloturerConfirmation = (idProjet) => {
    setSelectedidProjet(idProjet);
    setShowConfirmCloturer(true);
    setShowMenu(false);
  };

  return (
    <div
      key={projet.idProjet}
      className="w-full p-4 h-[450px] rounded-2xl border border-slate-200 shadow-md hover:shadow-xl duration-300 bg-white transform transition-all group"
    >
      {projet.idSubContractor && (
        <div className="absolute top-0 right-0 z-10 overflow-hidden">
          {/* Ribbon Principal */}
          <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-4 py-3 shadow-lg transform rotate-45 translate-x-4 -translate-y-2">
            <span className="whitespace-nowrap text-[8px]">Sous-traité</span>

            {/* Triangle d'ombre gauche */}
            <div className="absolute -left-2 top-0 w-0 h-0 border-t-[16px] border-b-[16px] border-r-[8px] border-t-transparent border-b-transparent border-r-green-700"></div>

            {/* Triangle d'ombre droite */}
            <div className="absolute -right-2 top-0 w-0 h-0 border-t-[16px] border-b-[16px] border-l-[8px] border-t-transparent border-b-transparent border-l-green-700"></div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-6">
        <div className="col-span-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer line-clamp-2 hover:text-blue-600 transition">
            <BookOpen className="w-4 h-4 text-blue-500" />
            {projet.module_name}
          </h3>
          <p className="italic text-xs text-slate-500">
            Ref : {projet.reference}
          </p>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                alt={i + 1}
                src="/react/image/star/star-off.png"
                className="w-5 h-5"
              />
            ))}
            <p className="font-semibold text-gray-700">0,0</p>
            <span className="text-gray-400 text-sm">(0 avis)</span>
          </div>
        </div>
        <div className="relative flex justify-end col-span-1">
          <button
            onClick={() => toggleMenu(projet.idProjet)}
            className="flex items-center justify-center w-12 h-12 duration-200 rounded-xl hover:bg-slate-100"
          >
            <FaEllipsisVertical />
          </button>

          {showMenu === projet.idProjet && (
            <ul className="absolute right-0 top-14 z-20 w-64 rounded-xl bg-white shadow-lg ring-1 ring-slate-200 divide-y divide-slate-100 text-slate-700">
              {/* Section Actions */}
              <li className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Actions
              </li>
              <li>
                <Link
                  to={`/cfp/projet/detail/${projet.idProjet}`}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 transition rounded-md"
                >
                  <FaEye className="text-indigo-500" /> Aperçu
                </Link>
              </li>
              {(projet.status === "En préparation" ||
                projet.status === "Planifié") && (
                <li>
                  <button
                    onClick={() => askProgramationConfirmation(projet.idProjet)}
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-green-50 transition rounded-md text-green-600"
                  >
                    <FaCheck /> Valider
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => askSupressionConfirmation(projet.idProjet)}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-50 transition rounded-md text-red-600"
                >
                  <FaTrashCan /> Supprimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => askDuplicationConfirmation(projet.idProjet)}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition rounded-md text-slate-600"
                >
                  <FaCopy /> Dupliquer
                </button>
              </li>
              <li>
                <button
                  onClick={() => askArchiverConfirmation(projet.idProjet)}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition rounded-md text-slate-600"
                >
                  <FaBoxArchive /> Archiver
                </button>
              </li>

              {/* Section Statut */}
              <li className="px-4 py-2 mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Statut
              </li>
              <li>
                <button
                  onClick={() => askAnnulerConfirmation(projet.idProjet)}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition rounded-md text-slate-600"
                >
                  <FaXmark /> Annuler
                </button>
              </li>
              <li>
                <button
                  onClick={() => askReporterConfirmation(projet.idProjet)}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition rounded-md text-slate-600"
                >
                  <FaCalendarDays /> Reporter
                </button>
              </li>
              <li>
                <button
                  onClick={() => askCloturerConfirmation(projet.idProjet)}
                  className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 transition rounded-md text-slate-600"
                >
                  <FaCircleXmark /> Clôturer
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Reste du code inchangé */}
      <div className="flex justify-between mt-4 items-center">
        {/* Badges info */}
        <div className="flex gap-2 flex-wrap">
          {/* Type de projet */}
          <span
            className={`px-3 py-1 rounded-2xl text-sm font-medium transition ${
              projet.type === "inter"
                ? "text-purple-700 bg-purple-100 hover:bg-purple-200"
                : "text-blue-700 bg-blue-100 hover:bg-blue-200"
            }`}
          >
            {projet.type}
          </span>

          {/* Modalité */}
          <span className="px-3 py-1 rounded-2xl text-sm font-medium text-cyan-700 bg-cyan-100 hover:bg-cyan-200 transition">
            {projet.modalite}
          </span>

          {/* Paiement */}
          <span className="px-3 py-1 rounded-2xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
            {projet.paiement}
          </span>
        </div>

        {/* Statut projet */}
        <span
          className={`px-3 py-1 rounded-2xl text-sm font-medium text-white ${getStatusColor(
            projet.status
          )} transition`}
        >
          {formatStatus(projet.status)}
        </span>
      </div>

      <div className="mt-4">
        {/* Lieu de formation */}
        <div
          title="Lieu de formation"
          className="inline-flex items-center gap-2 cursor-pointer hover:text-blue-600 transition"
        >
          <MapPin className="w-4 h-4 text-gray-400" />
          <p className="line-clamp-1 underline-offset-4 hover:underline">
            {projet.salle_name} — {projet.ville} ({projet.salle_code_postal})
          </p>
        </div>

        {/* Dossier */}
        <div
          title="Dossier"
          className="inline-flex items-center gap-2 cursor-pointer hover:text-purple-600 transition"
        >
          <Folder className="w-4 h-4 text-gray-400" />
          <p className="underline-offset-4 hover:underline">
            {projet.dossier_name ?? "Pas de dossier"}
          </p>
        </div>
        {/* Description */}
        <div className="flex items-start gap-2 mt-1">
          <Info className="w-4 h-4 text-gray-400 shrink-0 mt-[2px]" />
          <p className="line-clamp-2">
            {projet.project_description?.trim() || "Pas de description"}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div
            className="flex items-center"
            onClick={() => handleShowApprenants(projet.idProjet, projet.idEtp)}
          >
            {projet.apprs && projet.apprs.length > 0 ? (
              <div className="flex items-center space-x-2">
                {/* Photos ou initiales */}
                <div className="flex -space-x-2">
                  {projet.apprs.slice(0, 3).map((apprenant, i) =>
                    apprenant.emp_photo ? (
                      <img
                        key={i}
                        src={`${IMAGE_URL}/img/employes/${apprenant.emp_photo}`}
                        alt="Employé"
                        className="object-cover w-8 h-8 rounded-full ring-2 ring-white"
                        title="Apprenant"
                      />
                    ) : (
                      <div
                        key={i}
                        className="flex items-center justify-center w-8 h-8 font-bold uppercase rounded-full bg-slate-200 ring-2 ring-white text-slate-600"
                      >
                        {apprenant.emp_initial_name || "A"}
                      </div>
                    )
                  )}
                </div>

                {/* +X de plus */}
                {projet.apprs.length > 3 && (
                  <div className="flex items-center justify-center text-sm font-semibold text-gray-700 bg-gray-100 border-2 border-blue-300 rounded-full h-9 w-9 ring-2 ring-white">
                    +{projet.apprs.length - 3}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative" title="Apprenant">
                {/* Icône d'avertissement */}
                <span className="absolute top-0 right-0 rounded-full z-10">
                  <FaTriangleExclamation
                    className="text-lg text-amber-500 animate-pulse"
                    aria-hidden="true"
                  />
                </span>

                {/* Avatars en escalier */}
                <div className="relative flex flex-col gap-1">
                  {[...Array(1)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center w-8 h-8 font-bold uppercase rounded-full ring-2 ring-white bg-slate-200 text-slate-600"
                      style={{ marginLeft: `${i * 8}px` }}
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            onClick={() => handleShowEntreprise(projet.idEtp, projet.idProjet)}
          >
            {projet.etp_logo && projet.etp_logo.length > 0 ? (
              <img
                className="h-[30px] w-[53.2px] rounded-xl ring-2 ring-white grayscale hover:grayscale-0 cursor-pointer"
                src={`${IMAGE_URL}/img/entreprises/${projet.etp_logo}`}
                alt="Entreprise"
                title="Entreprise"
              />
            ) : (
              <div className="relative" title="Entreprise">
                <span className="absolute top-0 right-0 rounded-full z-10">
                  <FaTriangleExclamation
                    className="text-lg text-amber-500 animate-pulse"
                    aria-hidden="true"
                  />
                </span>
                {/* Avatars en escalier */}
                <div className="relative flex flex-col gap-1">
                  {[...Array(1)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center h-8 font-bold uppercase rounded-md w-18 ring-2 ring-white bg-slate-200 text-slate-600"
                      style={{ marginLeft: `${i * 8}px` }} // Décalage horizontal en escalier
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div
            onClick={() =>
              handleShowFormateurs(
                projet?.formateurs[0]?.idFormateur,
                projet.idProjet
              )
            }
          >
            {projet?.formateurs[0]?.form_photo &&
            projet?.formateurs[0]?.form_photo?.length > 0 ? (
              <img
                className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-white"
                src={`${IMAGE_URL}/img/formateurs/${projet.formateurs[0]?.form_photo}`}
                alt="Formateur"
                title="Formateur"
              />
            ) : (
              <div
                className="relative cursor-pointer"
                title="Formateur"
                onClick={() => setShowPageFormateur(true)}
              >
                <span className="absolute top-0 right-0 rounded-full z-10">
                  <FaTriangleExclamation
                    className="text-lg text-amber-500 animate-pulse"
                    aria-hidden="true"
                  />
                </span>
                <div className="relative flex flex-col gap-1">
                  {[...Array(1)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center w-8 h-8 font-bold uppercase rounded-full ring-2 ring-white bg-slate-200 text-slate-600"
                      style={{ marginLeft: `${i * 8}px` }}
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-6 text-sm text-slate-700">
            {/* Heures */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition"
              title="Heure"
              onClick={() => handleShowHeures(projet.idProjet)}
            >
              <Clock className="w-4 h-4 text-blue-500" />
              <span>
                {projet.totalSessionHour}{" "}
                <span className="underline text-slate-400">Hrs</span>
              </span>
            </div>

            {/* Séances */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-green-600 transition"
              title="Séance"
              onClick={() => handleShowHeures(projet.idProjet)}
            >
              <CalendarCheck className="w-4 h-4 text-green-500" />
              <span>
                {projet.seanceCount}{" "}
                <span className="underline text-slate-400">Ses</span>
              </span>
            </div>

            {/* Documents */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-purple-600 transition"
              title="Documents"
              onClick={() => setShowPageDossier(true)}
            >
              <FileText className="w-4 h-4 text-purple-500" />
              <span>
                {projet.nbDocument}{" "}
                <span className="underline text-slate-400">Docs</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 mt-4 divide-x divide-slate-200 text-sm text-slate-600">
          {/* Dates */}
          <div className="grid grid-cols-2 col-span-2 pl-3 gap-2">
            {/* Début */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <div>
                <h5 className="text-xs text-slate-400">Début</h5>
                <p className="font-semibold text-slate-700">
                  {new Date(projet.dateDebut).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Échéance */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              <div>
                <h5 className="text-xs text-slate-400">Échéance</h5>
                <p className="font-semibold text-slate-700">
                  {projet.dateFin
                    ? new Date(projet.dateFin).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Non définie"}
                </p>
              </div>
            </div>
          </div>

          {/* Prix */}
          <div className="pl-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <div>
              <h5 className="text-xs text-slate-400">Prix HT</h5>
              <p className="font-bold text-slate-700">
                {projet.total_ht}
                {setting?.currency_unit}
              </p>
            </div>
          </div>

          {/* Paiement */}
          <div className="pl-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-500" />
            <span className="px-3 py-1 text-xs rounded-xl text-slate-700 bg-slate-100">
              {projet.paymentStatus || "Non défini"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
