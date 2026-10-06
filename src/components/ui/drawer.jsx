import { useEffect } from "react";
import { X } from "lucide-react";

export const Drawer = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl transform transition-transform z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {title && (
            <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
              <h3 className="text-lg font-medium text-gray-500">{title}</h3>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-md hover:bg-gray-200 duration-200 flex items-center justify-center"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </>
  );
};
