import { lazy, Suspense } from "react";

function PageLoader() {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <div className="w-8 h-8 border-4 border-gray-200 rounded-full border-t-indigo-600 animate-spin" />
    </div>
  );
}

/**
 * Charge une page à la demande (code splitting).
 * Chaque page a son propre <Suspense> : le layout reste affiché
 * pendant le chargement de la page.
 *
 *   const Accueil = lazyPage(() => import("../pages/Accueil"));
 */
export default function lazyPage(loader) {
  const LazyComponent = lazy(loader);
  return function LazyPage(props) {
    return (
      <Suspense fallback={<PageLoader />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
