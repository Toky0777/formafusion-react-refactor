import { useState, useCallback } from 'react';

export const useNotifications = () => {
    const [notification, setNotification] = useState(null);

    const showSuccess = useCallback((message) => {
        setNotification({ type: 'success', message });
    }, []);

    const showError = useCallback((message) => {
        setNotification({ type: 'error', message });
    }, []);

    const clearNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return {
        notification,
        showSuccess,
        showError,
        clearNotification,
    };
};
