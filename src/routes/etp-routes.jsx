import ProtectedRoute from "../components/Common/ProtectedRoute";
import EtpLayout from "../layouts/etp-layout";
import { ReportingLayoutEtp } from "../layouts/etp/reporting-layout-etp";
import LayoutCalendarEtp from "../layouts/etp/LayoutCalendarEtp";
import LearnerLayoutEtp from "../layouts/etp/learner-layout-etp";
import { AuthCalendarProvider } from "../contexts/AuthCalendarProvider";
import { FolderLayout } from "../layouts/cfp/folder-layout";
import { PhotoContent } from "../contents/photoContent";
import { Navigate } from "react-router-dom";
import SkillEtpContent from "../contents/skillEtp-content";
import { ReferentContent } from "../contents/referent-content";
import LoyaltyRewardsLayout from "../layouts/cfp/loyalty_rewards-layout";
import { AttendanceContent } from "../contents/attendance-content";
import AnalyticEtpContent from "../contents/analyticEtp-content";
import CustomerContent from "../contents/customer-content";
import { SearchProviderProject } from "../contexts/cfp/SearchContextProject";
import ReservationLayout from "../layouts/cfp/reservation-layout";
import FmfpEtpLayout from "../layouts/etp/fmfp-etp-layout";
import { SPACES } from "../config/roles";
import lazyPage from "./lazyPage";

// Pages chargées à la demande (code splitting)
const HomePageEtp = lazyPage(() => import("../pages/Etp/home"));
const FolderDetailEtp = lazyPage(() => import("../pages/Etp/folder/detailEtp"));
const LearnerReportingEtp = lazyPage(() => import("../pages/Etp/reporting/LearnerEtp"));
const CustomerReportingEtp = lazyPage(() => import("../pages/Etp/reporting/CustomerReportingEtp"));
const CourseReportingEtp = lazyPage(() => import("../pages/Etp/reporting/ProjectReportinEtp"));
const LearnerListEtp = lazyPage(() => import("../pages/Etp/learner/LearnerListEtp"));
const FormationReportEtp = lazyPage(() => import("../pages/Etp/reporting/index"));
const ReportingRevenue = lazyPage(() => import("../pages/Etp/reporting/RevenueByProjectEtp"));
const FolderEtp = lazyPage(() =>
  import("../pages/Etp/photo/folder-etp").then((m) => ({ default: m.FolderEtp }))
);
const ProjectEtp = lazyPage(() =>
  import("../pages/Etp/photo/project-etp").then((m) => ({ default: m.ProjectEtp }))
);
const CrudImageEtp = lazyPage(() =>
  import("../pages/Etp/photo/crud-image-etp").then((m) => ({ default: m.CrudImageEtp }))
);
const Batch = lazyPage(() => import("../pages/Etp/learner/Batch/Batch"));
const AnnuelCalendarEtp = lazyPage(() => import("../pages/Etp/agenda/annuels/AnnuelCalendarEtp"));
const ExcelImport = lazyPage(() => import("../pages/Etp/learner/ExcelImport"));
const FolderListEtp = lazyPage(() => import("../pages/Etp/folder/DossierListEtp"));
const Centres = lazyPage(() => import("../pages/Centres"));
const Formations = lazyPage(() => import("../pages/Formations"));
const Course = lazyPage(() => import("../pages/Course"));
const EtpProjectList = lazyPage(() => import("../pages/Etp/skill_matrix/EtpProjectList"));
const EtpSkills = lazyPage(() => import("../pages/Etp/skill_matrix/EtpSkills"));
const ListeReferentEtp = lazyPage(() =>
  import("../pages/Etp/referent/liste-referent-etp").then((m) => ({ default: m.ListeReferentEtp }))
);
const RewardsEtp = lazyPage(() => import("../pages/Etp/loyalty/RewardsEtp"));
const AttendanceProjectEtp = lazyPage(() =>
  import("../pages/Etp/attendance/project-attendance-etp").then((m) => ({ default: m.AttendanceProjectEtp }))
);
const DashboardEntreprise = lazyPage(() => import("../pages/Etp/analytic/DashboardEntreprise"));
const EtpCustomer = lazyPage(() => import("../pages/Etp/customer/etp-customer"));
const EtpProjet = lazyPage(() => import("../pages/Etp/projet/projetEtp"));
const EtpDetailProjet = lazyPage(() => import("../pages/Etp/projet/detail"));
const ReservationEtp = lazyPage(() => import("../pages/Etp/reservation"));
const EvaluationsFroidsEtp = lazyPage(() => import("../pages/Etp/evaluationFroid"));
const ProfilEtp = lazyPage(() => import("../pages/Etp/Profil"));
const ProjectFinished = lazyPage(() =>
  import("../pages/Etp/projet/finished").then((m) => ({ default: m.ProjectFinished }))
);
const ProjectPlanned = lazyPage(() =>
  import("../pages/Etp/projet/planned").then((m) => ({ default: m.ProjectPlanned }))
);
const ProjectInProgress = lazyPage(() =>
  import("../pages/Etp/projet/In-progess").then((m) => ({ default: m.ProjectInProgress }))
);
const ProjectFenced = lazyPage(() =>
  import("../pages/Etp/projet/fenced").then((m) => ({ default: m.ProjectFenced }))
);
const ProjectInPreparation = lazyPage(() =>
  import("../pages/Etp/projet/in-preparation").then((m) => ({ default: m.ProjectInPreparation }))
);
const ProjectDeferred = lazyPage(() =>
  import("../pages/Etp/projet/deferred").then((m) => ({ default: m.ProjectDeferred }))
);
const ProjectCanceld = lazyPage(() =>
  import("../pages/Etp/projet/canceled").then((m) => ({ default: m.ProjectCanceld }))
);
const Help = lazyPage(() => import("../pages/Etp/help"));
const EvaluationChaud = lazyPage(() => import("../pages/Etp/evaluationChaud"));
const FmfpIndexEtp = lazyPage(() => import("../pages/Etp/Fmfp"));
const ListeBonCommandeEtp = lazyPage(() =>
  import("../pages/Etp/bon_commande").then((m) => ({ default: m.ListeBonCommandeEtp }))
);
const ListeFactureEtp = lazyPage(() =>
  import("../pages/Etp/facture").then((m) => ({ default: m.ListeFactureEtp }))
);
const DetailFactureEtp = lazyPage(() =>
  import("../pages/Etp/facture/detail").then((m) => ({ default: m.DetailFactureEtp }))
);

const etpRoutes = {
  path: "/etp",
  element: (
    <ProtectedRoute allowedUserTypes={SPACES.etp.userTypes}>
      <EtpLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <HomePageEtp />,
    },
    {
      path: "dossier",
      element: <FolderLayout />,
      children: [
        {
          index: true,
          element: <FolderListEtp />,
        },
        {
          path: "detail/:idDossier",
          element: <FolderDetailEtp />,
        },
      ],
    },
    { path: "centre", element: <Centres /> },
    { path: "annuaire", element: <Formations /> },
    { path: "cours", element: <Course /> },
    {
      path: "reporting",
      element: <ReportingLayoutEtp />,
      children: [
        {
          index: true,
          element: <FormationReportEtp />,
        },
        {
          path: "employe",
          element: <LearnerReportingEtp />,
        },
        {
          path: "client",
          element: <CustomerReportingEtp />,
        },
        {
          path: "cours",
          element: <CourseReportingEtp />,
        },
        {
          path: "cout",
          element: <ReportingRevenue />,
        },
      ],
    },

    {
      path: "employe",
      element: <LearnerLayoutEtp />,
      children: [
        {
          index: true,
          element: <LearnerListEtp />,
        },
        {
          path: "batch",
          element: <Batch />,
        },
        {
          path: "excel",
          element: <ExcelImport />,
        },
      ],
    },
    {
      path: "skill_matrix",
      element: <SkillEtpContent />,
      children: [
        {
          index: true,
          element: <Navigate to="projets" />,
        },
        {
          path: "projets",
          element: <EtpProjectList />,
        },
        {
          path: "projets/:idProjet",
          element: <EtpSkills />,
        },
      ],
    },
    {
      path: "photos",
      element: <PhotoContent />,
      children: [
        {
          index: true,
          element: <FolderEtp />,
        },
        {
          path: "projets",
          element: <ProjectEtp />,
        },
        {
          path: "ajout",
          element: <CrudImageEtp />,
        },
      ],
    },
    {
      path: "agenda",
      element: <AuthCalendarProvider />,
      children: [
        {
          element: <LayoutCalendarEtp />,
          children: [
            {
              index: true,
              element: <AnnuelCalendarEtp />,
            },
            {
              path: "annuel",
              element: <AnnuelCalendarEtp />,
            },
          ],
        },
      ],
    },
    {
      path: "utilisateurs",
      element: <ReferentContent />,
      children: [{ index: true, element: <ListeReferentEtp /> }],
    },
    {
      path: "analytic",
      element: <AnalyticEtpContent />,
      children: [{ index: true, element: <DashboardEntreprise /> }],
    },
    {
      path: "client",
      element: <CustomerContent />,
      children: [{ index: true, element: <EtpCustomer /> }],
    },
    {
      path: "loyalty_rewards",
      element: <LoyaltyRewardsLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="list" />,
        },
        {
          path: "list",
          element: <RewardsEtp />,
        },
      ],
    },
    {
      path: "presence",
      element: <AttendanceContent />,
      children: [{ index: true, element: <AttendanceProjectEtp /> }],
    },
    {
      path: "projet",
      element: <SearchProviderProject />,
      children: [
        {
          index: true,
          element: <EtpProjet />,
        },
        { path: "detail/:id", element: <EtpDetailProjet /> },
        { path: "termine", element: <ProjectFinished /> },
        { path: "en_cours", element: <ProjectInProgress /> },
        { path: "preparation", element: <ProjectInPreparation /> },
        { path: "planifie", element: <ProjectPlanned /> },
        { path: "annule", element: <ProjectCanceld /> },
        { path: "cloture", element: <ProjectFenced /> },
        { path: "reporte", element: <ProjectDeferred /> },
      ],
    },
    {
      path: "reservation",
      element: <ReservationLayout />,
      children: [{ index: true, element: <ReservationEtp /> }],
    },
    {
      path: "evaluation/froids",
      element: <EvaluationsFroidsEtp />,
    },
    {
      path: "evaluation_chaud",
      element: <EvaluationChaud />,
    },
    {
      path: "profile",
      element: <ProfilEtp />,
    },
    {
      path: "aide",
      element: <Help />,
    },
    {
      path: "fmfp",
      element: <FmfpEtpLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="en_soumission" />,
        },
        {
          path: "en_soumission",
          element: <FmfpIndexEtp status_name="En soumission" />,
        },
        {
          path: "en_execution",
          element: <FmfpIndexEtp status_name="Exécuté" />,
        },
        {
          path: "cloture",
          element: <FmfpIndexEtp status_name="Cloturé" />,
        },
        {
          path: "refuse",
          element: <FmfpIndexEtp status_name="Refusé" />,
        },
      ],
    },
    {
      path: "bon-commande",
      element: <ListeBonCommandeEtp />,
    },
    {
      path: "facture",
      element: <ListeFactureEtp />,
    },
    {
      path: "facture/details/:invoiceId",
      element: <DetailFactureEtp />,
    },
    // {
    //   path: "bon-commande/view/:id",
    //   element: <BonCommandeView />,
    // },
  ],
};

export default etpRoutes;
