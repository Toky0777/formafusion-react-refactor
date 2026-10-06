
export default function ButtonDanger({ children, ...rest }) {
  return (
    <div>
      <button
        {...rest}
        className="flex gap-2 bg-red-600 text-white font-bold rounded-md py-2 px-4 cursor-pointer transition duration-200 w-full hover:scale-105" 
      >
        {children}
      </button>
    </div>
  );
}
