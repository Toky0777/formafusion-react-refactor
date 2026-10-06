
const Drawer = ({ open, onClose, title, children, width = "w-[45em]" }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
            <div className={`relative ml-auto h-full bg-white shadow-xl flex flex-col ${width}`}>
                <div className="flex flex-col w-full h-full">
                    <div className="inline-flex items-center justify-between w-full px-4 py-2 bg-gray-100">
                        <p className="text-lg font-medium text-gray-500">{title}</p>
                        <button onClick={onClose} className="flex items-center justify-center w-10 h-10 duration-200 rounded-md cursor-pointer hover:text-inherit hover:bg-gray-200">
                            <i className="text-gray-500 fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className="w-full overflow-x-auto p-4 overflow-y-auto h-[100vh] pb-3">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Drawer;
