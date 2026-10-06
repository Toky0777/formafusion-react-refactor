import TrainerLayout from "../layouts/trainer-layout";
import LayoutCalendarFormateur from "../layouts/formateurs/LayoutCalendarFormateur";
import { SupportContent } from "../contents/support-content";
import { PhotoContent } from "../contents/photoContent";
import { HomeContentAttendance } from "../contents/home-content";
import { AuthCalendarProvider } from "../contexts/AuthCalendarProvider";
// import QcmIndex from "../pages/Apprenants/Testing/QcmIndex";
// import DetailsQcm from "../pages/Apprenants/Testing/Qcms/DetailsQcm";
// import ResultQcm from "../pages/Apprenants/Testing/ResultQcm";
// import TestReviewResponse from "../pages/Apprenants/Testing/TestReviewResponse";
// import TestResults from "../pages/Apprenants/Testing/TestResults";
// import InvitationList from "../pages/Apprenants/Testing/InvitationList";
// import InvitationDetails from "../pages/Apprenants/Testing/InvitationDetails";
import LayoutCalendarApprenant from "../layouts/apprenants/LayoutCalendarApprenant";
import { SearchProviderProject } from "../contexts/cfp/SearchContextProject";
import { TestingContentForm } from "../contents/TestingContentForm";
import { Navigate } from "react-router-dom";
import LayoutSkillTrainer from "../layouts/layout-skill-trainer";
import { TrainerAttendanceContent } from "../contents/TrainerAttendanceContent";
import { ModuleProvider } from "../contexts/ModuleContext";
import RefreshLayoutFormateur from "../layouts/formateurs/refresh-layout-formateur";
import LearnerLayoutFormateur from "../layouts/formateurs/learner-layout-formateur";
import lazyPage from "./lazyPage";

// Pages chargées à la demande (code splitting)
const AnnuelCalendarFormateur = lazyPage(() => import("../pages/Formateur/agenda/annuels/AnnuelCalendarFormateur"));
const SemaineCalendarFormateur = lazyPage(() => import("../pages/Formateur/agenda/semaines/SemaineCalendarFormateur"));
const ProjectFormList = lazyPage(() => import("../pages/Formateur/evaluation/ProjectFormList"));
const ProjectFormDetails = lazyPage(() => import("../pages/Formateur/evaluation/ProjectFormDetails"));
const LeanerListFormateur = lazyPage(() => import("../pages/Formateur/learner"));
const Attendance = lazyPage(() =>
  import("../pages/Cfp/attendance").then((m) => ({ default: m.Attendance }))
);
const Accueil = lazyPage(() => import("../pages/Apprenants/Support/Accueil"));
const CentreList = lazyPage(() => import("../pages/Apprenants/Support/Centre/CentreList"));
const ProgramList = lazyPage(() => import("../pages/Apprenants/Support/Programme/ProgramList"));
const CentreDetail = lazyPage(() => import("../pages/Apprenants/Support/Centre/CentreDetail"));
const ProgramDetail = lazyPage(() => import("../pages/Apprenants/Support/Programme/ProgramDetail"));
const GamificationPage = lazyPage(() => import("../pages/Apprenants/Gamification/gamification-page"));
const PageProjets = lazyPage(() => import("../pages/Apprenants/Projet/projet"));
const Refresh = lazyPage(() => import("../pages/Apprenants/Refresh/Refresh"));
const SemaineCalendarApprenant = lazyPage(() => import("../pages/Apprenants/agenda/semaines/SemaineCalendarApprenant"));
const AnnuelCalendarApprenant = lazyPage(() => import("../pages/Apprenants/agenda/annuels/AnnuelCalendarApprenant"));
const HomePageForm = lazyPage(() => import("../pages/Formateur/home"));
const ProjectTrainer = lazyPage(() => import("../pages/Formateur/projet/index"));
const ProjectTrainerDetail = lazyPage(() => import("../pages/Formateur/projet/detail"));
const FolderFormateurs = lazyPage(() =>
  import("../pages/Formateur/photo/folder-formateur.").then((m) => ({ default: m.FolderFormateurs }))
);
const ProjectFormateur = lazyPage(() =>
  import("../pages/Formateur/photo/project-formateur").then((m) => ({ default: m.ProjectFormateur }))
);
const CrudImageFormateur = lazyPage(() =>
  import("../pages/Formateur/photo/crud-image-formateur").then((m) => ({ default: m.CrudImageFormateur }))
);
const FormateurProjectList = lazyPage(() => import("../pages/Formateur/skill_matrix/FormateurProjectList"));
const FormateurSkills = lazyPage(() => import("../pages/Formateur/skill_matrix/FormateurSkills"));
const EvaluationsFroids = lazyPage(() => import("../pages/Cfp/evaluationFroid"));
const QcmIndexFormateur = lazyPage(() => import("../pages/Formateur/Testing/QcmIndexFormateur"));
const DetailsQcmFormateur = lazyPage(() => import("../pages/Formateur/Testing/show-details-formateur"));
const ResultQcmFormateur = lazyPage(() => import("../pages/Formateur/Testing/result-qcm-formateur"));
const RapportFormateur = lazyPage(() => import("../pages/Formateur/Testing/rapport-formateur"));
const BaremeFormateur = lazyPage(() => import("../pages/Formateur/Testing/bareme-formateur"));
const EvaluationFormateur = lazyPage(() => import("../pages/Formateur/Testing/evaluation-formateur"));
const CreateQcmFormateur = lazyPage(() => import("../pages/Formateur/Testing/qcm-create-formateur"));
const CampaignListFormateur = lazyPage(() => import("../pages/Formateur/Testing/Campaign/campaign-list-formateur"));
const InvitationListFormateur = lazyPage(() => import("../pages/Formateur/Testing/invitations/invitation-list-formateur"));
const InvitationDetailsFormateur = lazyPage(() => import("../pages/Formateur/Testing/invitations/invitations-details-formateur"));
const CampaignStepOneFormateur = lazyPage(() => import("../pages/Formateur/Testing/Campaign/create-step-one"));
const CampaignStepTwoFormateur = lazyPage(() => import("../pages/Formateur/Testing/Campaign/create-step-two-formateur"));
const CampaignStepThreeFormateur = lazyPage(() => import("../pages/Formateur/Testing/Campaign/create-step-three"));
const CampaignStepFourFormateur = lazyPage(() => import("../pages/Formateur/Testing/Campaign/create-step-four"));
const GlobalResultsFormateur = lazyPage(() => import("../pages/Formateur/Testing/global-results-formateur"));
const DetailsResultsFormateur = lazyPage(() => import("../pages/Formateur/Testing/details-results-formateur"));
const EditQcmFormateur = lazyPage(() => import("../pages/Formateur/Testing/qcm-edit-formateur"));
const CreateInvitationFormateur = lazyPage(() => import("../pages/Formateur/Testing/Campaign/create-invitation-Formateur"));
const Profile = lazyPage(() => import("../pages/Formateur/Profile"));
const ManageSkillTrainer = lazyPage(() => import("../pages/Formateur/skill_matrix/ManageSkillTrainer"));
const ProjectFinished = lazyPage(() =>
  import("../pages/Formateur/projet/finished").then((m) => ({ default: m.ProjectFinished }))
);
const ProjectInProgress = lazyPage(() =>
  import("../pages/Formateur/projet/in-progress").then((m) => ({ default: m.ProjectInProgress }))
);
const ProjectInPreparation = lazyPage(() =>
  import("../pages/Formateur/projet/in-preparation").then((m) => ({ default: m.ProjectInPreparation }))
);
const ProjectCanceled = lazyPage(() =>
  import("../pages/Formateur/projet/canceled").then((m) => ({ default: m.ProjectCanceled }))
);
const ProjectFenced = lazyPage(() =>
  import("../pages/Formateur/projet/fenced").then((m) => ({ default: m.ProjectFenced }))
);
const ProjectDeferred = lazyPage(() =>
  import("../pages/Formateur/projet/deferred").then((m) => ({ default: m.ProjectDeferred }))
);
const ProjectPlanned = lazyPage(() =>
  import("../pages/Formateur/projet/planned").then((m) => ({ default: m.ProjectPlanned }))
);
const Module = lazyPage(() => import("../pages/Formateur/refresh/Module"));
const Liste = lazyPage(() => import("../pages/Formateur/refresh/Liste"));
const Create = lazyPage(() => import("../pages/Formateur/refresh/Create"));
const AttendanceTrainer = lazyPage(() =>
  import("../pages/Formateur/attendance").then((m) => ({ default: m.AttendanceTrainer }))
);
const EmargementTrainer = lazyPage(() => import("../pages/Formateur/attendance/emargementTrainer"));

const trainerRoutes = {
  path: "/formateur",
  element: <TrainerLayout />,
  children: [
    {
      index: true,
      element: <HomePageForm />,
    },
    {
      path: "photos",
      element: <PhotoContent />,
      children: [
        {
          index: true,
          element: <FolderFormateurs />,
        },
        {
          path: "projets",
          element: <ProjectFormateur />,
        },
        {
          path: "ajout/:idProjet",
          element: <CrudImageFormateur />,
        },
      ],

    },
    {
      path: "agenda",
      element: <AuthCalendarProvider />,
      children: [
        {
          element: <LayoutCalendarFormateur />,
          children: [
            {
              index: true,
              element: <AnnuelCalendarFormateur />,
            },
            {
              path: "annuel",
              element: <AnnuelCalendarFormateur />,
            },
            {
              path: "semaine",
              element: <SemaineCalendarFormateur />,
            },
          ],
        },
        {
          // path: "presence",
          element: <HomeContentAttendance />,
          children: [
            {
              index: true,
              element: <Attendance />,
            },
          ],
        },
        {
          path: "support",
          element: <SupportContent />,
          children: [
            {
              index: true,
              element: <Accueil />,
            },
            {
              path: "centre",
              element: <CentreList />,
            },
            {
              path: "centre/:id",
              element: <CentreDetail />,
            },
            {
              path: "programmes",
              element: <ProgramList />,
            },
            {
              path: "programmes/:id",
              element: <ProgramDetail />,
            },
          ],
        },
        // {
        //   path: "photo",
        //   element: <PhotoContent />,
        //   children: [
        //     {
        //       index: true,
        //       element: <FolderFormateurs />,
        //     },
        //     {
        //       path: "projets",
        //       element: <ProjectFormateur />,
        //     },
        //     {
        //       path: "ajout/:idProjet",
        //       element: <CrudImageFormateur />,
        //     },
        //   ],
        // },

        {
          path: "gamification",
          element: <GamificationPage />,
        },
        //projet
        {
          path: "projet",
          element: <PageProjets />,
        },
        {
          path: "refreshd",
          element: <Refresh />,
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
      ],
    },


    {
      path: "/formateur/refresh",
      element: (
        <ModuleProvider>
          {" "}
          <RefreshLayoutFormateur />{" "}
        </ModuleProvider>
      ),
      children: [
        {
          index: true,
          // element: <Navigate to="module" />,
          element: <Module />,
        },
        {
          path: "liste",
          // element: <Module />,
          element: <Liste />,
        },
        {
          path: "creer",
          element: <Create />,
        },
      ],
    },

    {
      path: "presence",
      element: <TrainerAttendanceContent />,
      children: [
        {
          index: true,
          element: <AttendanceTrainer />,
        },
        {
          path: "emargement/:id",
          element: <EmargementTrainer />,
        },
      ],
    },
    {
      path: "evaluations",
      element: <ProjectFormList />,
    },
    {
      path: "evaluations-froid",
      element: <EvaluationsFroids apiUrl="formateur/eval-froid" />,
    },
    {
      path: "evaluations/projetsForm/:idProjet/detailForm",
      element: <ProjectFormDetails />,
    },
    // {
    //   path: "apprenant",
    //   element: <LeanerListFormateur />,
    // },
    {
      path: "apprenant",
      element: <LearnerLayoutFormateur />,
      children: [
        {
          index: true,
          element: <LeanerListFormateur />,
        },
      ],
    },
    {
      path: "projects",
      element: <SearchProviderProject />,
      children: [
        {
          index: true,
          element: <ProjectTrainer />,
        },
        {
          path: "detail/:id",
          element: <ProjectTrainerDetail />,
        },
        { path: "termine", element: <ProjectFinished /> },
        { path: "en_cours", element: <ProjectInProgress /> },
        { path: "preparation", element: <ProjectInPreparation /> },
        { path: "planifie", element: <ProjectPlanned /> },
        { path: "annule", element: <ProjectCanceled /> },
        { path: "cloture", element: <ProjectFenced /> },
        { path: "reporte", element: <ProjectDeferred /> },
      ],
    },
    {
      path: "skill_matrix",
      element: <LayoutSkillTrainer />,
      children: [
        {
          index: true,
          element: <Navigate to="projets" />,
        },
        {
          path: "projets",
          element: <FormateurProjectList />,
        },
        {
          path: "projets/:idProjet",
          element: <FormateurSkills />,
        },
        {
          path: "gestion-skill",
          element: <ManageSkillTrainer />,
        },
      ],
    },
    {
      path: "testing",
      element: <TestingContentForm />,
      children: [
        {
          index: true,
          element: <QcmIndexFormateur />,
        },
        {
          path: "qcm/:id/edit",
          element: <EditQcmFormateur />,
        },
        {
          path: "qcm/show/:id",
          element: <DetailsQcmFormateur />,
        },
        {
          path: "qcm/:id/list-apprenants/results",
          element: <ResultQcmFormateur />,
        },
        {
          path: "qcm/:id/apprenant/:idApprenant/session/:idSession/rapport",
          element: <RapportFormateur />,
        },
        {
          path: "qcm/bareme/create/:id",
          element: <BaremeFormateur />,
        },
        {
          path: "qcm/:id/category-evaluations",
          element: <EvaluationFormateur />,
        },
        {
          path: "qcm/create",
          element: <CreateQcmFormateur />,
        },
        {
          path: "qcm/invitation/campaign",
          element: <CampaignListFormateur />,
        },
        {
          path: "qcm/invitation/create",
          element: <CreateInvitationFormateur />,
        },
        {
          path: "qcm/invitations-index",
          element: <InvitationListFormateur />,
        },
        {
          path: "qcm/invitations/:id",
          element: <InvitationDetailsFormateur />,
        },
        {
          path: "qcm/campaign/create-1",
          element: <CampaignStepOneFormateur />,
        },
        {
          path: "qcm/campaign/create-2",
          element: <CampaignStepTwoFormateur />,
        },
        {
          path: "qcm/campaign/create-3",
          element: <CampaignStepThreeFormateur />,
        },
        {
          path: "qcm/campaign/create-4",
          element: <CampaignStepFourFormateur />,
        },
        {
          path: "global-results",
          element: <GlobalResultsFormateur />,
        },
        {
          path: "qcm/:id/appr/:idAppr/session/:idSession/result",
          element: <DetailsResultsFormateur />,
        },
      ],
    },
    {
      path: "profile",
      element: <Profile />,
    },
  ],
};

export default trainerRoutes;
