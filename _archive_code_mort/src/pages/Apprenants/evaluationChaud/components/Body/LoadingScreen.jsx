export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50 backdrop-blur">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full border-t-purple-600 animate-spin"></div>
        <p className="mt-4 font-medium text-white">Chargement...</p>
      </div>
    </div>
  );
}