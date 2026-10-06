import axios from "../../../config/axios";
import { useEffect, useState } from "react";
import { SessionsWidget } from "../../../components/home/sessions-widget";
import GamificationPage from "../Gamification/gamification-page";

export default function HomePageApp() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/accueilApp")
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
    <div className="min-h-screen bg-gray-50">
      <main className="container py-8 mx-auto space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-4">
          <div className="space-y-8 xl:col-span-3">
            <GamificationPage />
          </div>
          <div className="space-y-6 xl:col-span-1">
            <SessionsWidget
              data={data}
              basePath="particulier"
              sessionType="today_sessions"
            />
            <SessionsWidget
              data={data}
              basePath="particulier"
              sessionType="upcoming_sessions"
            />
          </div>
        </div>
        {/* <ProjectsWidgetEtp data={data} basePath="etp" /> */}
      </main>
    </div>
  );
}
