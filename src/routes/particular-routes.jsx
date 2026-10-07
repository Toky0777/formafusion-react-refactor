import ParticularLayout from "../layouts/particular-layout";
import LayoutCalendarApprenant from "../layouts/apprenants/LayoutCalendarApprenant";
import { AttendanceContent } from "../contents/attendance-content";
import { PhotoContent } from "../contents/photoContent";
import { AuthCalendarProvider } from "../contexts/AuthCalendarProvider";
import { SupportContent } from "../contents/support-content";
// import { ContextProvider } from '../pages/Apprenants/evaluationChaud/components/Context/ContextProvider';
import { SearchProviderProject } from "../contexts/cfp/SearchContextProject";
import { TestingContentEmp } from "../contents/testing-content-emp";
import SkillApprenantContent from "../contents/skill-apprenant";
import { Navigate } from "react-router-dom";
import { ModuleProvider } from "../contexts/ModuleContext";
import RefreshLayoutApprenant from "../layouts/apprenants/refresh-layout-apprenant";
import ProtectedRoute from "../components/Common/ProtectedRoute";
import { SPACES } from "../config/roles";
import lazyPage from "./lazyPage";

// Pages chargées à la demande (code splitting)
const DetailsQcm = lazyPage(() => import("../pages/Apprenants/Testing/Qcms/DetailsQcm"));
const ResultQcm = lazyPage(() => import("../pages/Apprenants/Testing/ResultQcm"));
const QCMComponent = lazyPage(() => import("../pages/Apprenants/Testing/Qcms/QCMComponent"));
const TestReviewResponse = lazyPage(() => import("../pages/Apprenants/Testing/TestReviewResponse"));
const TestResults = lazyPage(() => import("../pages/Apprenants/Testing/TestResults"));
const InvitationList = lazyPage(() => import("../pages/Apprenants/Testing/InvitationList"));
const InvitationDetails = lazyPage(() => import("../pages/Apprenants/Testing/InvitationDetails"));
const ProgramList = lazyPage(() => import("../pages/Apprenants/Support/Programme/ProgramList"));
const ProgramDetail = lazyPage(() => import("../pages/Apprenants/Support/Programme/ProgramDetail"));
const QcmIndexEmp = lazyPage(() => import("../pages/Apprenants/Testing/QcmIndexEmp"));
const FolderAppr = lazyPage(() =>
  import("../pages/Apprenants/Photo/folder-appr").then((m) => ({ default: m.FolderAppr }))
);
const ProjectAppr = lazyPage(() =>
  import("../pages/Apprenants/Photo/project-appr").then((m) => ({ default: m.ProjectAppr }))
);
const CrudImageAppr = lazyPage(() =>
  import("../pages/Apprenants/Photo/crud-image-appr").then((m) => ({ default: m.CrudImageAppr }))
);
const SemaineCalendarApprenant = lazyPage(() => import("../pages/Apprenants/agenda/semaines/SemaineCalendarApprenant"));
const AnnuelCalendarApprenant = lazyPage(() => import("../pages/Apprenants/agenda/annuels/AnnuelCalendarApprenant"));
const AttendanceProject = lazyPage(() =>
  import("../pages/Apprenants/Presence/attendance-project").then((m) => ({ default: m.AttendanceProject }))
);
const GamificationPage = lazyPage(() => import("../pages/Apprenants/Gamification/gamification-page"));
const PageProjets = lazyPage(() => import("../pages/Apprenants/Projet/projet"));
const ModuleApprenant = lazyPage(() => import("../pages/Apprenants/Refresh/Module"));
const HomePageApp = lazyPage(() => import("../pages/Apprenants/home"));
const ProjectApprenticeList = lazyPage(() =>
  import("../pages/Apprenants/evaluationChaud/pages/ProjectApprenticeList").then((m) => ({ default: m.ProjectApprenticeList }))
);
const ProjectDetails = lazyPage(() => import("../pages/Apprenants/evaluationChaud/pages/ProjectDetails"));
const EvaluationList = lazyPage(() =>
  import("../pages/Apprenants/EvalFroid/EvaluationList").then((m) => ({ default: m.EvaluationList }))
);
const ProjetParticularDetail = lazyPage(() => import("../pages/Apprenants/Projet/detail"));
const ApprProjectList = lazyPage(() => import("../pages/Apprenants/skill_matrix/ApprProjectList"));
const ApprSkills = lazyPage(() => import("../pages/Apprenants/skill_matrix/ApprSkills"));
const EditProfile = lazyPage(() =>
  import("../pages/Apprenants/Profil").then((m) => ({ default: m.EditProfile }))
);
const ProjectInProgress = lazyPage(() =>
  import("../pages/Apprenants/Projet/in-progress").then((m) => ({ default: m.ProjectInProgress }))
);
const ProjectCanceled = lazyPage(() =>
  import("../pages/Apprenants/Projet/canceled").then((m) => ({ default: m.ProjectCanceled }))
);
const ProjectFinished = lazyPage(() =>
  import("../pages/Apprenants/Projet/finished").then((m) => ({ default: m.ProjectFinished }))
);
const ProjectInPreparation = lazyPage(() =>
  import("../pages/Apprenants/Projet/in_preparation").then((m) => ({ default: m.ProjectInPreparation }))
);
const ProjectPlanned = lazyPage(() =>
  import("../pages/Apprenants/Projet/planned").then((m) => ({ default: m.ProjectPlanned }))
);
const ProjectCloed = lazyPage(() =>
  import("../pages/Apprenants/Projet/closed").then((m) => ({ default: m.ProjectCloed }))
);
const ProjectFenced = lazyPage(() =>
  import("../pages/Apprenants/Projet/fenced").then((m) => ({ default: m.ProjectFenced }))
);

const particularRoutes = {
  path: "/particulier",
  element: (
    <ProtectedRoute allowedUserTypes={SPACES.particulier.userTypes}>
      <ParticularLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <HomePageApp />,
    },
    {
      path: "presence",
      // path: "presence",
      element: <AttendanceContent />,
      children: [
        {
          index: true,
          element: <AttendanceProject />,
        },
      ],
    },
    {
      path: "support",
      element: <SupportContent />,
      children: [
        {
          index: true,
          element: <ProgramList />,
        },
        {
          path: "programmes/:id",
          element: <ProgramDetail />,
        },
      ],
    },
    {
      path: "profile",
      element: <EditProfile />,
    },
    {
      path: "photo",
      element: <PhotoContent />,
      children: [
        {
          index: true,
          element: <FolderAppr />,
        },
        {
          path: "projets",
          element: <ProjectAppr />,
        },
        {
          path: "ajout",
          element: <CrudImageAppr />,
        },
      ],
    },
    {
      path: "test",
      element: <TestingContentEmp />,
      children: [
        {
          index: true,
          element: <QcmIndexEmp />,
        },
        {
          path: "qcm/show/:id",
          element: <DetailsQcm />,
        },
        {
          path: "qcm/:id/list-apprenants/results",
          element: <ResultQcm />,
        },
        {
          path: "qcm/solve/:id/respond",
          element: <QCMComponent />,
        },
        {
          path: "qcm/solve/:id/review",
          element: <TestReviewResponse />,
        },
        {
          path: "qcm/solve/:id/results",
          element: <TestResults />,
        },
        {
          path: "qcm/invitations-index",
          element: <InvitationList />,
        },
        {
          path: "qcm/invitations/:id",
          element: <InvitationDetails />,
        },
      ],
    },
    {
      path: "gamification",
      element: <GamificationPage />,
    },
    //projet
    {
      path: "projet",
      element: <SearchProviderProject />,
      children: [
        {
          index: true,
          element: <PageProjets />,
        },
        { path: "detail/:id", element: <ProjetParticularDetail /> },
        { path: "termine", element: <ProjectFinished /> },
        { path: "annule", element: <ProjectCanceled /> },
        { path: "en_cours", element: <ProjectInProgress /> },
        { path: "preparation", element: <ProjectInPreparation /> },
        { path: "planifie", element: <ProjectPlanned /> },
        { path: "cloture", element: <ProjectCloed /> },
        { path: "reporte", element: <ProjectFenced /> },
      ],
    },
    {
      path: "/particulier/refresh",
      element: (
        <ModuleProvider>
          {" "}
          <RefreshLayoutApprenant />{" "}
        </ModuleProvider>
      ),
      children: [
        {
          index: true,
          // element: <Navigate to="module" />,
          element: <ModuleApprenant />,
        },
      ],
    },
    {
      path: "agenda",
      element: <AuthCalendarProvider />,
      children: [
        {
          element: <LayoutCalendarApprenant />,
          children: [
            {
              index: true,
              element: <AnnuelCalendarApprenant />,
            },
            {
              path: "annuel",
              element: <AnnuelCalendarApprenant />,
            },
            {
              path: "semaine",
              element: <SemaineCalendarApprenant />,
            },
          ],
        },
      ],
    },
    //evaluation
    {
      path: "evaluations/chaud",
      element: <ProjectApprenticeList />,
    },
    {
      path: "evaluations/projetsEmp/:idProjet/detailEmp",
      element: <ProjectDetails />,
    },
    {
      path: "evaluations/froid",
      element: <EvaluationList />,
    },
    {
      path: "skill_matrix",
      element: <SkillApprenantContent />,
      children: [
        {
          index: true,
          element: <Navigate to="projets" />,
        },
        {
          path: "projets",
          element: <ApprProjectList />,
        },
        {
          path: "projets/:idProjet",
          element: <ApprSkills />,
        },
      ],
    },
  ],
};

export default particularRoutes;
