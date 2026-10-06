import { forwardRef } from "react";

export const Input = forwardRef(
  (
    {
      label,
      error,
      isTextarea = false,
      required = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 hover:border-purple-300 duration-200";

    const Element = isTextarea ? "textarea" : "input";

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-gray-600">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <Element
          ref={ref}
          className={`${baseClasses} ${
            error
              ? "border-red-300 focus:border-red-300 focus:ring-red-100"
              : ""
          } ${className}`}
          {...(isTextarea ? { rows: 3 } : {})}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);
