import { createContext, useState } from 'react';

export const LearnerContext = createContext();

export const LearnerProvider = ({ children }) => {
    const [apprenants, setApprenants] = useState([]);
    const [apprFiltre, setApprFiltre] = useState([]);

    return (
        <LearnerContext.Provider value={{ apprenants, setApprenants, apprFiltre, setApprFiltre }}>
            {children}
        </LearnerContext.Provider>
    );
};