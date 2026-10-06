// LoadingModal.jsx
export default function LoadingModal({ visible, message = "" }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center gap-6 w-[400px] max-w-full">
        <svg
          className="animate-spin h-10 w-10 text-purple-600"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <p className="text-slate-700 font-medium text-lg">{message}</p>
      </div>
    </div>
  );
}
