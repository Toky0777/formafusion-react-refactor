import { useState, useEffect } from 'react';

const SuccessAlert = ({ message, duration = 30000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    return (
        <div className="fixed z-50 px-6 py-3 text-white transform -translate-x-1/2 bg-green-500 rounded top-2 left-1/2">
            {message}
        </div>
    );
};

export default SuccessAlert;
