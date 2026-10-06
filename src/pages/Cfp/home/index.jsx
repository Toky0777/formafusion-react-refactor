import { useState } from "react";
import { DailySummaryCfp } from "../../../components/home/daily-summary-cfp";
import { PhotoGalleryWidgetCfp } from "../../../components/home/gallery-photo-cfp";
import { ProjectsWidget } from "../../../components/home/projects-widget";
import { RecentActivityCfp } from "../../../components/home/recent-activity-cfp";
import { SessionsWidgetCfp } from "../../../components/home/sessions-widget-cfp";
import T from "../../../components/translate/AutoTranslator";
import { useAccueilCfp } from "../../../hooks/useAccueilCfp";
import customerService from "../../../services/cfp/customer/customerService";
import ProjectDrawer from "../../../components/drawer/customer/ProjectDrawer";

export default function HomePage() {
  const { data, loading, error, refetch } = useAccueilCfp();
  const [loadingForProject, setLoadingForProject] = useState(false);
  const [dataForEtp, setDataForEtp] = useState({});
  const [showDrawerProject, setShowDrawerProject] = useState(false);
  const account = "cfp";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-background">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
          <p className="text-muted-foreground">
            <T>Chargement des données</T>...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-background">
        <div className="text-center">
          <div className="mb-4 text-6xl text-destructive">⚠️</div>
          <h2 className="mb-2 text-2xl font-bold text-destructive">
            Erreur de chargement
          </h2>
          <p className="mb-4 text-muted-foreground">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const handleShowProject = async (id) => {
    setShowDrawerProject(true);
    setLoadingForProject(true);

    try {
      let res = null;
      if (account === "cfp") {
        res = await customerService.projetCustomer(id);
      } else {
        res = await customerService.getCfpById(id);
      }
      setDataForEtp(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingForProject(false);
    }
  };

  if (data === null) return null;

  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-1 w-full p-4 md:p-8">
        {/* Layout principal: 3/4 gauche + 1/4 droite */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full">
          {/* COLONNE GAUCHE: Contenu principal (3/4) */}
          <div className="space-y-8 xl:col-span-3 flex flex-col h-full">
            <DailySummaryCfp className="w-full flex-1" data={data} />
            <ProjectsWidget
              className="w-full flex-1"
              data={data}
              basePath="cfp"
              handleShowProject={handleShowProject}
            />
            <RecentActivityCfp
              className="w-full flex-1"
              data={data}
              handleShowProject={handleShowProject}
              basePath="cfp"
            />
            <PhotoGalleryWidgetCfp className="w-full flex-1" data={data} />
          </div>

          {/* COLONNE DROITE: Sessions (1/4) */}
          <div className="xl:col-span-1 space-y-4 flex flex-col h-full">
            <SessionsWidgetCfp
              className="w-full flex-1"
              sessions={data.today_sessions}
              title="Sessions du jour"
              basePath="cfp"
              handleShowProject={handleShowProject}
            />
            <SessionsWidgetCfp
              className="w-full flex-1"
              sessions={data.tomorrow_sessions}
              title="Sessions de Demain"
              basePath="cfp"
            />
          </div>
        </div>
      </main>

      {showDrawerProject && (
        <ProjectDrawer
          isLoading={loadingForProject}
          data={dataForEtp}
          account={account}
          isShow={showDrawerProject}
          onClose={() => setShowDrawerProject(false)}
        />
      )}
    </div>
  );
}
