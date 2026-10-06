
export default function ButtonSecondary({ children, ...rest }) {
  return (
    <div>
      <button
        {...rest}
        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:scale-105  "
      >
        {children}
      </button>
    </div>
  );
}
