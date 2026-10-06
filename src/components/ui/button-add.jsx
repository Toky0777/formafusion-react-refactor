
export default function ButtonAdd({ children, disabled, ...rest }) {
  return (
    <div>
      <button
        disabled={disabled}
        {...rest}
        className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transitions-colors hover:scale-105 transition duration-150 ${
          !disabled
            ? "bg-[#A462b8] text-white hover:bg-[#A462b8] focus:outline-none focus:ring-2 focus:ring-[#ae89b9]"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        } `}
      >
        {children}
      </button>
    </div>
  );
}
