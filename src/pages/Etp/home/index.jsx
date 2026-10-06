import { useEffect, useState } from "react";
import axios from "../../../config/axios";
import { PhotoGalleryWidget } from "../../../components/home/gallery-photo";
import { DailySummaryEtp } from "../../../components/home/daily-summary";
import { ProjectsWidgetEtp } from "../../../components/home/projects-widget";
import { SessionsWidget } from "../../../components/home/sessions-widget";

export default function HomePageEtp() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/accueilEtp")
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="container p-8 mx-auto space-y-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
          <div className="space-y-8 xl:col-span-3">
            <DailySummaryEtp data={data} />
            <PhotoGalleryWidget data={data} />
          </div>
          <div className="xl:col-span-1">
            <SessionsWidget data={data} basePath="etp" />
          </div>
        </div>
        <ProjectsWidgetEtp data={data} basePath="etp" />
      </main>
    </div>
  );
}
