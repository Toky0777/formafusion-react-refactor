import { Outlet } from "react-router-dom";

export default function FmfpEtpLayout() {
  return (
    <div className="flex flex-col min-h-screen ">
      <div className="sticky top-0 z-30 px-4 py-3 mb-8 border-b border-gray-200 shadow-sm bg-white/90 backdrop-blur-sm rounded-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-600">Dossier Fmfp</h1>
              <p className="text-gray-600">Suivi des dossiers fmfp</p>
            </div>
          </div>
        </div>
      </div>

      <main className="relative mt-10 mx-4">
        <Outlet />
      </main>
    </div>
  );
}
