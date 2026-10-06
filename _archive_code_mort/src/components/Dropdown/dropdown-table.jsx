import React from 'react';

const DropdownButton = ({ type = '', route = '', titre = '', id = '', first = '', children }) => {
    if (type === 'simple') {
        return (
            <div className="flex flex-1 btn-group dropdown w-max">
                <div className="inline-flex items-center justify-end w-full">
                    <button
                        className="text-base text-gray-600 px-3 py-1 hover:bg-gray-200 bg-gray-100 transition duration-200 outline-none border-[1px] capitalize"
                        type="button"
                    >
                        <a href={route} className="transition duration-300 hover:text-gray-700">
                            {first}
                        </a>
                    </button>
                    <button
                        type="button"
                        className="text-gray-600 px-3 py-1 h-full hover:bg-gray-200 bg-gray-100 transition-all border-none dropdown-toggle focus:bg-gray-200 border-[1px]"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <span className="visually-hidden">Toggle Dropdown</span>
                    </button>
                    <ul className="bg-white border-none shadow-md dropdown-menu">
                        {children}
                    </ul>
                </div>
            </div>
        );
    }

    if (type === 'modal') {
        return (
            <div className="flex justify-end flex-1 btn-group dropdown w-max">
                {children}
            </div>
        );
    }

    if (type === 'drawer') {
        return (
            <div className="flex flex-1 btn-group dropdown w-max">
                <div className="inline-flex items-center justify-end w-full">
                    <button
                        className="text-base text-gray-600 px-3 py-1 hover:bg-gray-200 bg-gray-100 transition duration-200 outline-none border-[1px] capitalize"
                        type="button"
                    >
                        <a
                            className="text-base text-gray-600 transition duration-150 cursor-pointer dropdown-item"
                            data-bs-toggle="offcanvas"
                            href={`#${id}`}
                            role="button"
                            aria-controls="offcanvas"
                        >
                            {titre}
                        </a>
                    </button>
                    <button
                        type="button"
                        className="text-gray-600 px-3 py-1 h-full hover:bg-gray-200 bg-gray-100 transition-all border-none dropdown-toggle focus:bg-gray-200 border-[1px]"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <span className="visually-hidden">Toggle Dropdown</span>
                    </button>
                    <ul className="bg-white border-none shadow-md dropdown-menu">
                        {children}
                    </ul>
                </div>
            </div>
        );
    }

    return null;
};

export default DropdownButton;
