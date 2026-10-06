import { Search, BookOpenText } from "lucide-react";
import { Outlet } from "react-router-dom";
import NavBarDocumentation from "../../components/navbar-documentation";

export default function DocumentLayouts() {
    return (
        <>
            {/* Barre du haut */}
            <header className="flex items-center lg:px-12 h-16 min-w-0 px-4 shadow-sm bg-white border-b border-gray-200">
                <div className="h-full relative flex-1 flex items-center justify-between">

                    {/* Titre et icône */}
                    <div className="flex items-center gap-x-3">
                        <BookOpenText className="w-6 h-6 text-indigo-600" />
                        <h1 className="text-lg font-semibold text-gray-700">
                            Documentation
                        </h1>
                    </div>

                    {/* Barre de recherche */}
                    <div className="relative hidden lg:flex items-center w-96">
                        <button
                            type="button"
                            className="flex items-center w-full h-10 px-4 text-sm text-gray-600 bg-slate-50 rounded-xl ring-1 ring-gray-300/40 hover:ring-indigo-400 focus:ring-indigo-500"
                        >
                            <Search className="w-5 h-5 text-gray-400 mr-3" />
                            <span className="truncate text-left flex-1">Rechercher un guide...</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenu principal */}
            <div className="min-h-screen bg-white flex ">
                {/* Sidebar */}
                <aside className="w-64 bg-white  p-6 hidden md:block ">
                    <NavBarDocumentation />
                </aside>

                {/* Zone de contenu */}
                <main className="flex-1 overflow-y-auto p-10 text-gray-200">
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl ">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    );
}
