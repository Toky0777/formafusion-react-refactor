import React, { useState, useEffect } from 'react';

const PageTransition = ({
    children,
    isLoading = false,
    loadingMessage = "Loading..."
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 100);

            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isLoading]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="space-y-4 text-center">
                    <div className="w-8 h-8 mx-auto border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <p className="text-sm text-gray-600 animate-pulse">{loadingMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`transition-all duration-500 ease-in-out ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
        >
            {children}
        </div>
    );
};

export default PageTransition;
