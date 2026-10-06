
export default function ButtonSecondary({ children, ...rest }) {
  return (
    <div>
      <button
        {...rest}
        className="inline-flex justify-center items-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700  hover:bg-gray-50 focus:outline-none  hover:scale-105 cursor-pointer transition duration-200 disabled:cursor-not-allowed disabled:bg-gray-50"
      >
        {children}
      </button>
    </div>
  );
}
