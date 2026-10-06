
const Button = ({ variant, size, icon: Icon, children, ...props }) => {
  const baseStyles =
    "inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none";

  const variantStyles = {
    primary: "bg-blue-600 text-white border-transparent hover:bg-blue-700",
    secondary: "bg-gray-500 text-white border-transparent hover:bg-gray-600",
    danger: "bg-red-600 text-white border-transparent hover:bg-red-700",
    link: "bg-transparent text-blue-600 border-transparent hover:bg-blue-50", // ✅ plus de virgule après cette ligne
  };

  const sizeStyles = {
    sm: "text-xs py-1 px-3",
    md: "text-sm py-2 px-4",
    lg: "text-lg py-3 px-6",
  };

  return (
    <button
      className={`${baseStyles} ${
        variantStyles[variant] || variantStyles.primary
      } ${sizeStyles[size] || sizeStyles.md}`}
      {...props}
    >
      {Icon && <Icon className="mr-2 w-5 h-5" />}
      {children}
    </button>
  );
};

export default Button;
