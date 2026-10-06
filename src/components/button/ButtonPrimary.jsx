
export default function ButtonPrimary({ children, ...rest }) {
  return (
    <div>
      <button
        {...rest}
        className="flex items-center gap-2 bg-black/90 text-white font-bold rounded-md py-3 px-4 cursor-pointer transition duration-200 w-full hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-200"
      >
        {children}
      </button>
    </div>
  );
}
