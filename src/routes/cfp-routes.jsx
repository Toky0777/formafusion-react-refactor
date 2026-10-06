import { Navigate } from "react-router-dom";
import ProtectedRoute from "../components/Common/ProtectedRoute";
import { FolderLayout } from "../layouts/cfp/folder-layout";
import { ReportingLayout } from "../layouts/cfp/reporting-layout";
import LearnerLayout from "../layouts/cfp/learner-layout";
import DashboardLayout from "../layouts/cfp/dashboard-layout";
import { DashboardCfpProvider } from "../contexts/cfp/DashboardCfpProvider";
import ReservationLayout from "../layouts/cfp/reservation-layout";
import ProformaLayout from "../layouts/proforma-layout";
import CustomerLayout from "../layouts/cfp/customer-layout";
import CatalogLayout from "../layouts/cfp/catalog-layout";
import InvoiceLayout from "../layouts/invoice-layout";
import LayoutCalendarCfp from "../layouts/cfp/agenda-layout";
import CfpLayout from "../layouts/cfp-layout";
import { SearchCatalogProvider } from "../contexts/SearchCatalogContext";
import { ContextProvider } from "../contexts/ContextcatalogProvider";
import { PhotoContent } from "../contents/photoContent";
import { HomeContentAttendance } from "../contents/home-content";
import { AuthCalendarProvider } from "../contexts/AuthCalendarProvider";
import { TestingContent } from "../contents/testing-content";
import { ReferentContent } from "../contents/referent-content";
import LoyaltyRewardsLayout from "../layouts/cfp/loyalty_rewards-layout";
import ParticulierLayout from "../layouts/cfp/particulier-layout";
import { ModuleProvider } from "../contexts/ModuleContext";
import RefreshLayout from "../layouts/refresh-layout";
import LieuetSalleLayout from "../layouts/cfp/lieu-et-salle-layout";
import CatalogOnlineLayout from "../layouts/cfp/cataloque_online_layout";
import LayoutSkill from "../layouts/layout-skill";
import { CaLayout } from "../layouts/cfp/ca-layout";
import FmfpLayout from "../layouts/cfp/fmfp-layout";
import DocumentLayouts from "../layouts/cfp/layouts-documents";
import lazyPage from "./lazyPage";

// Pages chargées à la demande (code splitting)
const Centres = lazyPage(() => import("../pages/Centres"));
const Formations = lazyPage(() => import("../pages/Formations"));
const Course = lazyPage(() => import("../pages/Course"));
const LearnerReporting = lazyPage(() => import("../pages/Cfp/reporting/Learner"));
const CustomerReporting = lazyPage(() => import("../pages/Cfp/reporting/CustomerReporting"));
const CourseReporting = lazyPage(() => import("../pages/Cfp/reporting/ProjectReporting"));
const RevenueByProject = lazyPage(() => import("../pages/Cfp/reporting/revenue/RevenueByProject"));
const RevenueByCourse = lazyPage(() => import("../pages/Cfp/reporting/revenue/RevenueByCourse"));
const RevenueByClient = lazyPage(() => import("../pages/Cfp/reporting/revenue/RevenueByClient"));
const RevenueByMonth = lazyPage(() => import("../pages/Cfp/reporting/revenue/RevenueByMonth"));
const RevenueByFolder = lazyPage(() => import("../pages/Cfp/reporting/revenue/RevenueByFolder"));
const RevenueByReference = lazyPage(() => import("../pages/Cfp/reporting/revenue/RevenueByReference"));
const RevenueByCity = lazyPage(() => import("../pages/Cfp/reporting/revenue/RevenueByCity"));
const FolderDetail = lazyPage(() => import("../pages/Cfp/folder/detail"));
const Reporting = lazyPage(() => import("../pages/Cfp/reporting/index"));
const TrainerList = lazyPage(() => import("../pages/Cfp/trainers/index"));
const DashboardCfp = lazyPage(() => import("../pages/Cfp/analytic/DashboardCfp"));
const Objectives = lazyPage(() => import("../pages/Cfp/analytic/Objective"));
const Trainer = lazyPage(() => import("../pages/Cfp/analytic/Trainer"));
const CfpReservation = lazyPage(() => import("../pages/Cfp/reservation/index"));
const Evaluation = lazyPage(() => import("../pages/Cfp/evaluation/index"));
const Notice = lazyPage(() => import("../pages/Cfp/evaluation/notice"));
const LeanerList = lazyPage(() => import("../pages/Cfp/learner/index"));
const SubcontractorList = lazyPage(() => import("../pages/Cfp/subcontractor/index"));
const Place = lazyPage(() => import("../pages/Cfp/place/index"));
const FolderCfp = lazyPage(() =>
  import("../pages/Cfp/photo/folder-cfp").then((m) => ({ default: m.FolderCfp }))
);
const ProjetCfp = lazyPage(() =>
  import("../pages/Cfp/photo/project-cfp").then((m) => ({ default: m.ProjetCfp }))
);
const CrudImageCfp = lazyPage(() =>
  import("../pages/Cfp/photo/crud-image-cfp").then((m) => ({ default: m.CrudImageCfp }))
);
const NewInvoice = lazyPage(() =>
  import("../pages/Cfp/invoice/Formulaire/new-invoice").then((m) => ({ default: m.NewInvoice }))
);
const VoirDetails = lazyPage(() =>
  import("../pages/Cfp/invoice/Details/voir-details").then((m) => ({ default: m.VoirDetails }))
);
const EditInvoice = lazyPage(() =>
  import("../pages/Cfp/invoice/Formulaire/edit-invoice").then((m) => ({ default: m.EditInvoice }))
);
const DetailModule = lazyPage(() => import("../pages/Cfp/catalogue/DetailModule"));
const ProjectDetail = lazyPage(() => import("../pages/Cfp/project/detail"));
const GererCompte = lazyPage(() =>
  import("../pages/Cfp/invoice/Compte/gestion-compte").then((m) => ({ default: m.GererCompte }))
);
const Proforma = lazyPage(() =>
  import("../pages/Cfp/invoice/Proforma/Liste/proforma-list").then((m) => ({ default: m.Proforma }))
);
const NewProforma = lazyPage(() =>
  import("../pages/Cfp/invoice/Proforma/formulaire/new-proforma").then((m) => ({ default: m.NewProforma }))
);
const EditProforma = lazyPage(() =>
  import("../pages/Cfp/invoice/Proforma/formulaire/edit-proforma").then((m) => ({ default: m.EditProforma }))
);
const CustomerList = lazyPage(() => import("../pages/Cfp/customer/index"));
const Draft = lazyPage(() =>
  import("../pages/Cfp/invoice/Proforma/Liste/draft-all").then((m) => ({ default: m.Draft }))
);
const ConvertiAll = lazyPage(() =>
  import("../pages/Cfp/invoice/Proforma/Liste/converti-all").then((m) => ({ default: m.ConvertiAll }))
);
const HomePage = lazyPage(() => import("../pages/Cfp/home/index"));
const QcmIndexCfp = lazyPage(() => import("../pages/Cfp/Testing/QcmIndexCfp"));
const EditQcmCfp = lazyPage(() => import("../pages/Cfp/Testing/qcm-edit-cfp"));
const DetailsQcmCfp = lazyPage(() => import("../pages/Cfp/Testing/show-details-cfp"));
const ResultQcmCpf = lazyPage(() => import("../pages/Cfp/Testing/result-qcm-cfp"));
const RapportCfp = lazyPage(() => import("../pages/Cfp/Testing/rapport-cfp"));
const BaremeCfp = lazyPage(() => import("../pages/Cfp/Testing/bareme-cfp"));
const EvaluationCfp = lazyPage(() => import("../pages/Cfp/Testing/evaluation-cfp"));
const CreateQcmCfp = lazyPage(() => import("../pages/Cfp/Testing/qcm-create-cfp"));
const ProjectListSkill = lazyPage(() => import("../pages/Cfp/skill_matrix/ProjectListSkill"));
const Skills = lazyPage(() => import("../pages/Cfp/skill_matrix/Skills"));
const ManageSkill = lazyPage(() => import("../pages/Cfp/skill_matrix/ManageSkill"));
const FormateurCalendar = lazyPage(() => import("../pages/Cfp/agenda/formateurs/FormateurCalendar"));
const SemaineNewCalendar = lazyPage(() => import("../pages/Cfp/agenda/semaines/SemaineNewCalendar"));
const Catalogue = lazyPage(() => import("../pages/Cfp/catalogue/catalogue"));
const PreparationCatalog = lazyPage(() => import("../pages/Cfp/catalogue/Preparation"));
const CorbeilleCatalog = lazyPage(() => import("../pages/Cfp/catalogue/Corbeille"));
const Attendance = lazyPage(() =>
  import("../pages/Cfp/attendance").then((m) => ({ default: m.Attendance }))
);
const Attribut = lazyPage(() => import("../pages/Cfp/badge/Attribut"));
const CreateBadge = lazyPage(() => import("../pages/Cfp/badge/Create"));
const Badge = lazyPage(() => import("../pages/Cfp/badge/Badge"));
const ListeFacture = lazyPage(() =>
  import("../pages/Cfp/invoice/liste-facture").then((m) => ({ default: m.ListeFacture }))
);
const TableauDeBord = lazyPage(() =>
  import("../pages/Cfp/invoice/tableau-de-bord").then((m) => ({ default: m.TableauDeBord }))
);
const AnnuelCalendar = lazyPage(() => import("../pages/Cfp/agenda/annuels/AnnuelCalendar"));
const FolderList = lazyPage(() => import("../pages/Cfp/folder/index"));
const ListReferentCfp = lazyPage(() => import("../pages/Cfp/referent/liste-referent-cfp"));
const RewardsList = lazyPage(() => import("../pages/Cfp/loyalty/RewardsList"));
const RewardsForm = lazyPage(() => import("../pages/Cfp/loyalty/RewardsForm"));
const ParticuliersList = lazyPage(() => import("../pages/Cfp/particulier/ParticuliersList"));
const Module = lazyPage(() => import("../pages/Cfp/refresh/Module"));
const Create = lazyPage(() => import("../pages/Cfp/refresh/Create"));
const Liste = lazyPage(() => import("../pages/Cfp/refresh/Liste"));
const CampaignListCfp = lazyPage(() => import("../pages/Cfp/Testing/Campaign/campaign-list-cfp"));
const CreateInvitationCfp = lazyPage(() => import("../pages/Cfp/Testing/Campaign/create-invitation-cfp"));
const InvitationListCfp = lazyPage(() => import("../pages/Cfp/Testing/invitations/invitation-list-cfp"));
const InvitationDetailsCfp = lazyPage(() => import("../pages/Cfp/Testing/invitations/invitations-details-cfp"));
const CampaignStepOneCfp = lazyPage(() => import("../pages/Cfp/Testing/Campaign/create-step-one"));
const CampaignStepTwoCfp = lazyPage(() => import("../pages/Cfp/Testing/Campaign/create-step-two-cfp"));
const CampaignStepThreeCfp = lazyPage(() => import("../pages/Cfp/Testing/Campaign/create-step-three"));
const CampaignStepFourCfp = lazyPage(() => import("../pages/Cfp/Testing/Campaign/create-step-four"));
const GlobalResultsCfp = lazyPage(() => import("../pages/Cfp/Testing/global-results-cfp"));
const DetailsResultsCfp = lazyPage(() => import("../pages/Cfp/Testing/details-results-cfp"));
const CatalogueOnlineActive = lazyPage(() => import("../pages/Cfp/catalogue_public/is_active"));
const CatalogueInPreparationOnline = lazyPage(() => import("../pages/Cfp/catalogue_public/Preparation"));
const CatalogueInDeleteOnline = lazyPage(() => import("../pages/Cfp/catalogue_public/Corbeille"));
const EvaluationsFroids = lazyPage(() => import("../pages/Cfp/evaluationFroid"));
const ProfilCfp = lazyPage(() => import("../pages/Cfp/Profil"));
const ChangePassword = lazyPage(() => import("../pages/Cfp/passeword"));
const ProjectFinished = lazyPage(() =>
  import("../pages/Cfp/project/finished").then((m) => ({ default: m.ProjectFinished }))
);
const ProjectPlanned = lazyPage(() =>
  import("../pages/Cfp/project/planned").then((m) => ({ default: m.ProjectPlanned }))
);
const ProjectCanceled = lazyPage(() =>
  import("../pages/Cfp/project/canceled").then((m) => ({ default: m.ProjectCanceled }))
);
const ProjectFenced = lazyPage(() =>
  import("../pages/Cfp/project/fenced").then((m) => ({ default: m.ProjectFenced }))
);
const ProjectInProgress = lazyPage(() =>
  import("../pages/Cfp/project/in-progress").then((m) => ({ default: m.ProjectInProgress }))
);
const ListeBonCommande = lazyPage(() =>
  import("../pages/Cfp/bon_commande").then((m) => ({ default: m.ListeBonCommande }))
);
const ProjectDeferred = lazyPage(() =>
  import("../pages/Cfp/project/deferred").then((m) => ({ default: m.ProjectDeferred }))
);
const ProjectInPreparation = lazyPage(() =>
  import("../pages/Cfp/project/in-preparation").then((m) => ({ default: m.ProjectInPreparation }))
);
const ProjectDleted = lazyPage(() =>
  import("../pages/Cfp/project/Deleted").then((m) => ({ default: m.ProjectDleted }))
);
const Recovery = lazyPage(() =>
  import("../pages/Cfp/recovery/index").then((m) => ({ default: m.Recovery }))
);
const LayoutDispForm = lazyPage(() => import("../pages/Cfp/agenda/dispoFormateur/LayoutDispForm"));
const MaterialsManagement = lazyPage(() => import("../pages/Cfp/materials"));
const FmfpIndex = lazyPage(() => import("../pages/Cfp/Fmfp"));
const DetailsFmfp = lazyPage(() => import("../pages/Cfp/Fmfp/details-fmfp"));
const AideFmfp = lazyPage(() => import("../pages/Cfp/Fmfp/aide-fmfp"));
const HotEvaluationByProject = lazyPage(() => import("../pages/Cfp/evaluation/evaluation_by_project"));
const BonCommandeView = lazyPage(() => import("../pages/Cfp/bon_commande/pages/BonCommandeView"));
const NewProject = lazyPage(() => import("../pages/Cfp/project/new-project"));
const LayoutDispoMateriel = lazyPage(() => import("../pages/Cfp/agenda/dispoMateriel/LayoutDispoMateriel"));
const FormateurAncien = lazyPage(() => import("../pages/Cfp/trainers/FormateurAncien"));
const NewAcompte = lazyPage(() =>
  import("../pages/Cfp/invoice/Acompte/new-acompte").then((m) => ({ default: m.NewAcompte }))
);
const Acompte = lazyPage(() =>
  import("../pages/Cfp/invoice/Acompte/Liste/acompte-list").then((m) => ({ default: m.Acompte }))
);
const EditAcompte = lazyPage(() =>
  import("../pages/Cfp/invoice/Acompte/formulaire/edit-acompte").then((m) => ({ default: m.EditAcompte }))
);
const NewFmfp = lazyPage(() => import("../pages/Cfp/Fmfp/new-fmfp"));
const Accueil = lazyPage(() => import("../pages/Cfp/Documentation/Accueil"));
const DocCatalogue = lazyPage(() => import("../pages/Cfp/Documentation/Catalogue/DocCatalogue"));
const DocProjet = lazyPage(() => import("../pages/Cfp/Documentation/Projet/DocProjet"));
const DocDevis = lazyPage(() => import("../pages/Cfp/Documentation/Devis/DocDevis"));
const DocCatalogueAjout = lazyPage(() => import("../pages/Cfp/Documentation/Catalogue/DocCatalogueAjout"));
const DocCatalogueDetail = lazyPage(() => import("../pages/Cfp/Documentation/Catalogue/DocCatalogueDetail"));
const EmargementCfp = lazyPage(() => import("../pages/Cfp/attendance/emargement"));
const DocCreationIntra = lazyPage(() => import("../pages/Cfp/Documentation/Projet/DocCreationIntra"));
const DocCreationInter = lazyPage(() => import("../pages/Cfp/Documentation/Projet/DocCreationInter"));
const DocStatus = lazyPage(() => import("../pages/Cfp/Documentation/Projet/DocStatus"));
const DocDetails = lazyPage(() => import("../pages/Cfp/Documentation/Projet/DocDetails"));
const PorteFeuilleClientDashboard = lazyPage(() => import("../pages/Cfp/analyse_portefeuille/PorteFeuilleClientDashboard"));
const DocDevisAjout = lazyPage(() => import("../pages/Cfp/Documentation/Devis/DocDevisAjout"));
const DocDevisStatut = lazyPage(() => import("../pages/Cfp/Documentation/Devis/DocDevisStatut"));
const DocPlace = lazyPage(() => import("../pages/Cfp/Documentation/Lieu_et_Salle/DocPlace"));
const DocPlaceAdd = lazyPage(() => import("../pages/Cfp/Documentation/Lieu_et_Salle/DocPlaceAdd"));
const DocPlace_Salle_Contact = lazyPage(() => import("../pages/Cfp/Documentation/Lieu_et_Salle/DocPlace_Salle_Contact"));
const CatalogueEnLigne = lazyPage(() => import("../pages/Cfp/Documentation/Catalogue_en_ligne/catalogue_en_ligen"));
const CatalogueEnLigneDetail = lazyPage(() => import("../pages/Cfp/Documentation/Catalogue_en_ligne/catalogue_en_ligne_detail"));
const DocFacture = lazyPage(() => import("../pages/Cfp/Documentation/Facture/DocFacture"));
const DocFactureAdd = lazyPage(() => import("../pages/Cfp/Documentation/Facture/DocFactureAdd"));
const NewSolde = lazyPage(() =>
  import("../pages/Cfp/invoice/Solde/new-solde").then((m) => ({ default: m.NewSolde }))
);
const EditSolde = lazyPage(() =>
  import("../pages/Cfp/invoice/Solde/formulaire/edit-solde").then((m) => ({ default: m.EditSolde }))
);
const DocAnalytics = lazyPage(() => import("../pages/Cfp/Documentation/Analytics/Doc_analytics"));
const DocAnalyticsPresentation = lazyPage(() => import("../pages/Cfp/Documentation/Analytics/Doc_analytics_presentation"));
const DocAnalyticsObjectif = lazyPage(() => import("../pages/Cfp/Documentation/Analytics/Doc_analytics_objectif"));
const Doc_Commande = lazyPage(() => import("../pages/Cfp/Documentation/BDC/Commande"));
const Formateur = lazyPage(() => import("../pages/Cfp/Documentation/Formateur/formateur"));
const FormateurAdd = lazyPage(() => import("../pages/Cfp/Documentation/Formateur/formateur_add"));
const Espace = lazyPage(() => import("../pages/Cfp/marketplace/Espace"));
const Profile = lazyPage(() => import("../pages/Cfp/marketplace/profile"));
const Regulation = lazyPage(() => import("../pages/Cfp/marketplace/regulation"));
const Gestion_Formateur = lazyPage(() => import("../pages/Cfp/Documentation/Formateur/Gestion_Formateur"));
const CommandePresentation = lazyPage(() => import("../pages/Cfp/Documentation/BDC/commandePresentation"));
const CommandeAdd = lazyPage(() => import("../pages/Cfp/Documentation/BDC/commande_add"));
const Apprenants = lazyPage(() => import("../pages/Cfp/Documentation/Apprenants/apprenants"));
const ApprenantsAdd = lazyPage(() => import("../pages/Cfp/Documentation/Apprenants/apprenantsAdd"));
const ApprenantsGestion = lazyPage(() => import("../pages/Cfp/Documentation/Apprenants/apprenantGestion"));
const Clients = lazyPage(() => import("../pages/Cfp/Documentation/Clients/clients"));
const ClientsAdd = lazyPage(() => import("../pages/Cfp/Documentation/Clients/clientsAdd"));
const ClientsGestion = lazyPage(() => import("../pages/Cfp/Documentation/Clients/clientsGestion"));
const Particulier = lazyPage(() => import("../pages/Cfp/Documentation/Particulier/particulier"));
const ParticulierAdd = lazyPage(() => import("../pages/Cfp/Documentation/Particulier/particulierAdd"));
const ParticulierGestion = lazyPage(() => import("../pages/Cfp/Documentation/Particulier/particulierGestion"));
const Admin = lazyPage(() => import("../pages/Cfp/Documentation/Admin/admin"));
const AdminAdd = lazyPage(() => import("../pages/Cfp/Documentation/Admin/adminAdd"));
const AdminGestion = lazyPage(() => import("../pages/Cfp/Documentation/Admin/adminGestion"));
const SousTraitant = lazyPage(() => import("../pages/Cfp/Documentation/SousTraitant/soustraitant"));
const SousTraitantAdd = lazyPage(() => import("../pages/Cfp/Documentation/SousTraitant/soustraitantAdd"));
const Qualiopi = lazyPage(() => import("../pages/Cfp/qualiopi"));
const AIPredictionPage = lazyPage(() => import("../pages/Cfp/Rentabilite/AIPredictionPage"));

const INVOICE_TYPES = {
  ALL: 1,
  UNPAID: 2,
  OVERDUE: 3,
  DRAFTS: 4,
  SAINE: 5,
  PERDU: 6,
  douteuse: 11,
  en_litige: 12,
  irrecouvrable: 13,
  transmis_huissier: 14,
  poursuite_judiciaire: 15,
};

const cfpRoutes = {
  path: "/cfp",
  element: (
    <ProtectedRoute allowedUserTypes={["superAdminCfp", "adminCfp"]}>
      <CfpLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: "ai_rentabilite",
      element: <AIPredictionPage />,
    },
    {
      path: "profile",
      element: <ProfilCfp />,
    },
    {
      path: "lieu_salle",
      element: <LieuetSalleLayout />,
      children: [{ index: true, element: <Place /> }],
    },
    {
      path: "reporting",
      element: <ReportingLayout />,
      children: [
        { index: true, element: <Reporting /> },
        { path: "apprenant", element: <LearnerReporting /> },
        { path: "client", element: <CustomerReporting /> },
        { path: "cours", element: <CourseReporting /> },
      ],
    },
    {
      path: "ca",
      element: <CaLayout />,
      children: [
        { index: true, element: <Navigate to="ca_projet" /> },
        { path: "ca_projet", element: <RevenueByProject /> },
        { path: "ca_cours", element: <RevenueByCourse /> },
        { path: "ca_client", element: <RevenueByClient /> },
        { path: "ca_mois", element: <RevenueByMonth /> },
        { path: "ca_dossier", element: <RevenueByFolder /> },
        { path: "ca_reference", element: <RevenueByReference /> },
        { path: "ca_ville", element: <RevenueByCity /> },
      ],
    },
    {
      path: "fmfp",
      element: <FmfpLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="en_soumission" />,
        },
        {
          path: "nouveau",
          element: <NewFmfp />,
        },
        {
          path: "en_soumission",
          element: <FmfpIndex status_name="En soumission" />,
        },
        {
          path: "en_execution",
          element: <FmfpIndex status_name="Exécuté" />,
        },
        {
          path: "service_fait",
          element: <FmfpIndex status_name="Service fait" />,
        },
        {
          path: "cloture",
          element: <FmfpIndex status_name="Cloturé" />,
        },
        {
          path: "refuse",
          element: <FmfpIndex status_name="Refusé" />,
        },
        {
          path: "aide",
          element: <AideFmfp />,
        },
        { path: "details/:id", element: <DetailsFmfp /> },
      ],
    },
    {
      path: "refresh",
      element: (
        <ModuleProvider>
          {" "}
          <RefreshLayout />{" "}
        </ModuleProvider>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="module" />,
        },
        {
          path: "module",
          element: <Module />,
        },
        {
          path: "creer",
          element: <Create />,
        },
        {
          path: "liste",
          element: <Liste />,
        },
      ],
    },
    {
      path: "skill_matrix",
      element: <LayoutSkill />,
      children: [
        {
          index: true,
          element: <Navigate to="projets" />,
        },
        {
          path: "projets",
          element: <ProjectListSkill />,
        },
        {
          path: "projets/:idProjet",
          element: <Skills />,
        },
        {
          path: "gestion-skill",
          element: <ManageSkill />,
        },
      ],
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
          element: <RewardsList />,
        },
        {
          path: "create",
          element: <RewardsForm />,
        },
      ],
    },
    {
      path: "particulier",
      element: <ParticulierLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="list" />,
        },
        {
          path: "list",
          element: <ParticuliersList />,
        },
      ],
    },
    {
      path: "client",
      element: <CustomerLayout />,
      children: [
        {
          index: true,
          element: <CustomerList />,
        },
      ],
    },
    { path: "centre", element: <Centres /> },
    { path: "annuaire", element: <Formations /> },
    { path: "formateur", element: <TrainerList /> },
    { path: "formateur/ancien", element: <FormateurAncien /> },
    { path: "sous_traitant", element: <SubcontractorList /> },
    { path: "projet/en_cours", element: <ProjectInProgress /> },
    { path: "projet/preparation", element: <ProjectInPreparation /> },
    { path: "projet/termine", element: <ProjectFinished /> },
    { path: "projet/reporte", element: <ProjectDeferred /> },
    { path: "projet/planifie", element: <ProjectPlanned /> },
    { path: "projet/annule", element: <ProjectCanceled /> },
    { path: "projet/cloture", element: <ProjectFenced /> },
    { path: "projet/corbeille", element: <ProjectDleted /> },
    { path: "projet/detail/:id", element: <ProjectDetail /> },
    { path: "nouveau_projet", element: <NewProject /> },
    {
      path: "apprenant",
      element: <LearnerLayout />,
      children: [
        {
          index: true,
          element: <LeanerList />,
        },
      ],
    },
    {
      path: "evaluation_a_chaud",
      element: <Evaluation />,
    },
    {
      path: "evaluation_a_chaud/detail/:projectId",
      element: <HotEvaluationByProject />,
    },
    {
      path: "evaluation/froids",
      element: <EvaluationsFroids />,
    },
    {
      path: "evaluation/avis",
      element: <Notice />,
    },
    {
      path: "reservation",
      element: <ReservationLayout />,
      children: [{ index: true, element: <CfpReservation /> }],
    },
    {
      path: "analytic",
      element: (
        <DashboardCfpProvider>
          <DashboardLayout />
        </DashboardCfpProvider>
      ),
      children: [
        {
          index: true,
          element: <DashboardCfp />,
        },
        {
          path: "objectif",
          element: <Objectives />,
        },
        {
          path: "formateur",
          element: <Trainer />,
        },
      ],
    },
    {
      path: "dossier",
      element: <FolderLayout />,
      children: [
        { index: true, element: <FolderList /> },
        { path: "detail/:idDossier", element: <FolderDetail /> },
      ],
    },
    {
      path: "materiel",
      children: [{ index: true, element: <MaterialsManagement /> }],
    },
    {
      path: "presence",
      element: <HomeContentAttendance />,
      children: [
        { index: true, element: <Attendance /> },
        { path: "emargement/:id", element: <EmargementCfp /> },
      ],
    },
    {
      path: "catalogue",
      element: (
        <ContextProvider>
          <SearchCatalogProvider>
            <CatalogLayout />
          </SearchCatalogProvider>
        </ContextProvider>
      ),
      children: [
        { index: true, element: <Catalogue /> },
        { path: "preparation", element: <PreparationCatalog /> },
        { path: "corbeille", element: <CorbeilleCatalog /> },
        { path: ":id/edit", element: <DetailModule /> },
      ],
    },
    {
      path: "cours_en_ligne",
      element: <CatalogOnlineLayout />,
      children: [
        { index: true, element: <CatalogueOnlineActive /> },
        { path: "preparation", element: <CatalogueInPreparationOnline /> },
        { path: "corbeille", element: <CatalogueInDeleteOnline /> },
        { path: ":id/edit", element: <DetailModule /> },
      ],
    },
    { path: "cours", element: <Course /> },
    {
      path: "agenda",
      element: <AuthCalendarProvider />,
      children: [
        {
          element: <LayoutCalendarCfp />,
          children: [
            { index: true, element: <AnnuelCalendar /> },
            { path: "annuel", element: <AnnuelCalendar /> },
            { path: "formateur", element: <FormateurCalendar /> },
            { path: "semaine", element: <SemaineNewCalendar /> },
          ],
        },
      ],
    },
    {
      path: "disponibilite_de_formateur",
      element: <LayoutDispForm />,
    },
    {
      path: "disponibilite_de_materiel",
      element: <LayoutDispoMateriel />,
    },
    {
      path: "analyse_portefeullie_client",
      element: <PorteFeuilleClientDashboard />,
    },
    {
      path: "facture",
      element: <InvoiceLayout />,
      children: [
        {
          index: true,
          element: <ListeFacture idInvoice={INVOICE_TYPES.ALL} />,
        },
        { path: "tableau-de-bord", element: <TableauDeBord /> },
        {
          path: "non-paye",
          element: <ListeFacture idInvoice={INVOICE_TYPES.UNPAID} />,
        },
        {
          path: "echue",
          element: <ListeFacture idInvoice={INVOICE_TYPES.OVERDUE} />,
        },
        {
          path: "brouillons",
          element: <ListeFacture idInvoice={INVOICE_TYPES.DRAFTS} />,
        },
        {
          path: "saine",
          element: <ListeFacture idInvoice={INVOICE_TYPES.SAINE} />,
        },
        {
          path: "perdu",
          element: <ListeFacture idInvoice={INVOICE_TYPES.PERDU} />,
        },
        {
          path: "douteuse",
          element: <ListeFacture idInvoice={INVOICE_TYPES.douteuse} />,
        },
        {
          path: "en_litige",
          element: <ListeFacture idInvoice={INVOICE_TYPES.en_litige} />,
        },
        {
          path: "irrecouvrable",
          element: <ListeFacture idInvoice={INVOICE_TYPES.irrecouvrable} />,
        },
        {
          path: "transmis_huissier",
          element: <ListeFacture idInvoice={INVOICE_TYPES.transmis_huissier} />,
        },
        {
          path: "poursuite_judiciaire",
          element: (
            <ListeFacture idInvoice={INVOICE_TYPES.poursuite_judiciaire} />
          ),
        },
        {
          path: "nouveau-facture",
          element: <NewInvoice />,
        },
        {
          path: "details/:id",
          element: <VoirDetails />,
        },
        {
          path: "modifie-facture/:id",
          element: <EditInvoice />,
        },
        {
          path: "compte",
          element: <GererCompte />,
        },
        {
          path: "nouveau-facture-acompte",
          element: <NewAcompte />,
        },
        {
          path: "facture-acompte",
          element: <Acompte />,
        },
        {
          path: "modifie-acompte/:id",
          element: <EditAcompte />,
        },
        {
          path: "nouveau-facture-solde",
          element: <NewSolde />,
        },
        {
          path: "modifie-solde/:id",
          element: <EditSolde />,
        },
      ],
    },
    {
      path: "utilisateurs",
      element: <ReferentContent />,
      children: [
        {
          index: true,
          element: <ListReferentCfp />,
        },
      ],
    },
    {
      path: "proforma",
      element: <ProformaLayout />,
      children: [
        {
          index: true,
          element: <Proforma />,
        },
        {
          path: "details/:id",
          element: <VoirDetails />,
        },
        {
          path: "brouillons",
          element: <Draft />,
        },
        {
          path: "converti",
          element: <ConvertiAll />,
        },

        {
          path: "nouveau-proforma",
          element: <NewProforma />,
        },
        {
          path: "modifie-proforma/:id",
          element: <EditProforma />,
        },
      ],
    },
    { path: "badge", element: <Badge /> },
    { path: "badge/attribut", element: <Attribut /> },
    { path: "badge/creer", element: <CreateBadge /> },
    {
      path: "photos",
      element: <PhotoContent />,
      children: [
        {
          index: true,
          element: <FolderCfp />,
        },
        {
          path: "projets",
          element: <ProjetCfp />,
        },
        {
          path: "ajout/:idProjet",
          element: <CrudImageCfp />,
        },
      ],
    },
    {
      path: "mot_de_passe",
      element: <ChangePassword />,
    },
    {
      path: "prequal",
      element: <TestingContent />,
      children: [
        {
          index: true,
          element: <QcmIndexCfp />,
        },
        {
          path: "qcm/:id/edit",
          element: <EditQcmCfp />,
        },
        {
          path: "qcm/show/:id",
          element: <DetailsQcmCfp />,
        },
        {
          path: "qcm/:id/list-apprenants/results",
          element: <ResultQcmCpf />,
        },
        {
          path: "qcm/:id/apprenant/:idApprenant/session/:idSession/rapport",
          element: <RapportCfp />,
        },
        {
          path: "qcm/bareme/create/:id",
          element: <BaremeCfp />,
        },
        {
          path: "qcm/:id/category-evaluations",
          element: <EvaluationCfp />,
        },
        {
          path: "qcm/create",
          element: <CreateQcmCfp />,
        },
        {
          path: "qcm/invitation/campaign",
          element: <CampaignListCfp />,
        },
        {
          path: "qcm/invitation/create",
          element: <CreateInvitationCfp />,
        },
        {
          path: "qcm/invitations-index",
          element: <InvitationListCfp />,
        },
        {
          path: "qcm/invitations/:id",
          element: <InvitationDetailsCfp />,
        },
        {
          path: "qcm/campaign/create-1",
          element: <CampaignStepOneCfp />,
        },
        {
          path: "qcm/campaign/create-2",
          element: <CampaignStepTwoCfp />,
        },
        {
          path: "qcm/campaign/create-3",
          element: <CampaignStepThreeCfp />,
        },
        {
          path: "qcm/campaign/create-4",
          element: <CampaignStepFourCfp />,
        },
        {
          path: "global-results",
          element: <GlobalResultsCfp />,
        },
        {
          path: "qcm/:id/appr/:idAppr/session/:idSession/result",
          element: <DetailsResultsCfp />,
        },
      ],
    },
    {
      path: "bon-commande",
      element: <ListeBonCommande />,
    },
    {
      path: "bon-commande/view/:id",
      element: <BonCommandeView />,
    },
    {
      path: "recouvrement",
      element: <Recovery />,
    },
    {
      path: "documentation",
      element: <DocumentLayouts />,
      children: [
        {
          index: true,
          element: <Accueil />,
        },

        {
          path: "doc_catalogue",
          element: <DocCatalogue />,
        },
        {
          path: "doc_catalogue/ajout",
          element: <DocCatalogueAjout />,
        },
        {
          path: "doc_catalogue/detail",
          element: <DocCatalogueDetail />,
        },

        {
          path: "doc_catalogue_en_ligne",
          element: <CatalogueEnLigne />,
        },
        {
          path: "doc_catalogue_en_ligne/detail",
          element: <CatalogueEnLigneDetail />,
        },

        {
          path: "doc_projet",
          element: <DocProjet />,
        },
        {
          path: "doc_projet/creation/intra",
          element: <DocCreationIntra />,
        },
        {
          path: "doc_projet/status",
          element: <DocStatus />,
        },
        {
          path: "doc_projet/detail",
          element: <DocDetails />,
        },
        {
          path: "doc_projet/creation/inter",
          element: <DocCreationInter />,
        },

        {
          path: "doc_devis",
          element: <DocDevis />,
        },
        {
          path: "doc_devis/ajout",
          element: <DocDevisAjout />,
        },
        {
          path: "doc_devis/statut",
          element: <DocDevisStatut />,
        },

        {
          path: "doc_lieu",
          element: <DocPlace />,
        },
        {
          path: "doc_lieu/creation",
          element: <DocPlaceAdd />,
        },
        {
          path: "doc_lieu/gestion",
          element: <DocPlace_Salle_Contact />,
        },

        {
          path: "doc_facture",
          element: <DocFacture />,
        },
        {
          path: "doc_facture/add",
          element: <DocFactureAdd />,
        },

        {
          path: "doc_analytics",
          element: <DocAnalytics />,
        },
        {
          path: "doc_analytics/presentation",
          element: <DocAnalyticsPresentation />,
        },
        {
          path: "doc_analytics/objectif",
          element: <DocAnalyticsObjectif />,
        },

        {
          path: "doc_commande",
          element: <Doc_Commande />,
        },
        {
          path: "doc_commande/presentation",
          element: <CommandePresentation />,
        },
        {
          path: "doc_commande/add",
          element: <CommandeAdd />,
        },

        {
          path: "doc_formateur",
          element: <Formateur />,
        },
        {
          path: "doc_formateur/add",
          element: <FormateurAdd />,
        },
        {
          path: "doc_formateur/gestion",
          element: <Gestion_Formateur />,
        },

        {
          path: "doc_apprenants",
          element: <Apprenants />,
        },
        {
          path: "doc_apprenants/add",
          element: <ApprenantsAdd />,
        },
        {
          path: "doc_apprenants/gestion",
          element: <ApprenantsGestion />,
        },

        {
          path: "doc_clients",
          element: <Clients />,
        },
        {
          path: "doc_clients/add",
          element: <ClientsAdd />,
        },
        {
          path: "doc_clients/gestion",
          element: <ClientsGestion />,
        },

        {
          path: "doc_particulier",
          element: <Particulier />,
        },
        {
          path: "doc_particulier/particulier",
          element: <ParticulierAdd />,
        },
        {
          path: "doc_particulier/gestion",
          element: <ParticulierGestion />,
        },

        {
          path: "doc_admin",
          element: <Admin />,
        },
        {
          path: "doc_admin/admin",
          element: <AdminAdd />,
        },
        {
          path: "doc_admin/gestion",
          element: <AdminGestion />,
        },

        {
          path: "doc_soustraitants",
          element: <SousTraitant />,
        },
        {
          path: "doc_soustraitants/add",
          element: <SousTraitantAdd />,
        },
      ],
    },
    {
      path: "profile-marketplace",
      element: <Espace />,
    },
    {
      path: "espace/profil",
      element: <Profile />,
    },
    {
      path: "espace/reglement",
      element: <Regulation />,
    },
    {
      path: "qualite",
      element: <Qualiopi />,
    },
  ],
};

export default cfpRoutes;
