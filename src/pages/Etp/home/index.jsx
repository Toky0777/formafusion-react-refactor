import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  CircleHelp,
  UsersRound,
} from "lucide-react";
import axios from "../../../config/axios";
import { ProjectsWidgetEtp } from "../../../components/home/projects-widget";
import { Drawer } from "../../../components/ui/drawer";

export default function HomePageEtp() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setLoadError(false);

      try {
        const response = await axios.get("/accueilEtp");
        if (isMounted) setData(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'accueil ETP:", error);
        if (isMounted) setLoadError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const projetsPlanifies = data?.projetsPlanifie?.length || 0;
  const projetsEnCours = data?.projetsEnCours?.length || 0;
  const projetsTermines = data?.recentProjetsTermines?.length || 0;
  const customerName = data?.customer_name;

  return (
    <main className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-600 px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 right-1/4 h-64 w-64 rounded-full bg-indigo-300/10" />
          <div className="relative max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-indigo-100">
              Espace entreprise
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {customerName
                ? `Bienvenue, ${customerName}`
                : "Bienvenue sur Formafusion"}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
              Retrouvez vos projets de formation et suivez simplement les
              prochaines étapes pour inscrire vos collaborateurs.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/etp/projet"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
              >
                Voir mes projets
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => setInstructionsOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                aria-haspopup="dialog"
              >
                <CircleHelp className="h-4 w-4" aria-hidden="true" />
                Comment démarrer ?
              </button>
            </div>
          </div>
        </section>

        {loading ? (
          <div
            className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-12"
            role="status"
          >
            <div className="text-center">
              <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              <p className="text-sm text-slate-600">
                Chargement de vos projets...
              </p>
            </div>
          </div>
        ) : loadError ? (
          <div
            className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
            role="alert"
          >
            <p className="font-semibold text-red-800">
              Impossible de charger vos projets pour le moment.
            </p>
            <p className="mt-1 text-sm text-red-700">
              Vérifiez votre connexion puis réessayez.
            </p>
            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <>
            <section
              aria-label="Résumé des projets"
              className="grid gap-4 sm:grid-cols-3"
            >
              {[
                {
                  label: "Projets à venir",
                  count: projetsPlanifies,
                  icon: ClipboardList,
                  color: "text-violet-700 bg-violet-50",
                },
                {
                  label: "Projets en cours",
                  count: projetsEnCours,
                  icon: BookOpen,
                  color: "text-blue-700 bg-blue-50",
                },
                {
                  label: "Récemment terminés",
                  count: projetsTermines,
                  icon: CheckCircle2,
                  color: "text-emerald-700 bg-emerald-50",
                },
              ].map(({ label, count, icon: Icon, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{count}</p>
                    <p className="text-sm text-slate-600">{label}</p>
                  </div>
                </div>
              ))}
            </section>

            <section aria-labelledby="projects-title" className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2
                    id="projects-title"
                    className="text-xl font-bold text-slate-900"
                  >
                    Vos projets de formation
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Sélectionnez un projet pour consulter son détail et gérer
                    les apprenants.
                  </p>
                </div>
                <Link
                  to="/etp/projet"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                >
                  Tous mes projets
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <ProjectsWidgetEtp data={data} basePath="etp" />
            </section>
          </>
        )}
      </div>
      <Drawer
        isOpen={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
        title="Comment démarrer ?"
      >
        <p className="mb-6 text-sm leading-6 text-slate-600">
          Gérez les inscriptions directement depuis chaque projet de formation.
        </p>
        <div className="space-y-4">
          {[
            {
              number: "01",
              icon: ClipboardList,
              title: "Consultez vos projets",
              description:
                "Retrouvez les formations à venir, en cours et terminées.",
            },
            {
              number: "02",
              icon: BookOpen,
              title: "Ouvrez un projet",
              description:
                "Accédez au détail du projet pour consulter ses informations.",
            },
            {
              number: "03",
              icon: UsersRound,
              title: "Ajoutez vos apprenants",
              description:
                "Depuis le détail, inscrivez les collaborateurs concernés.",
            },
          ].map(({ number, icon: Icon, title, description }) => (
            <div
              key={number}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider text-indigo-600">
                  ÉTAPE {number}
                </p>
                <h3 className="mt-1 font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Drawer>
    </main>
  );
}
