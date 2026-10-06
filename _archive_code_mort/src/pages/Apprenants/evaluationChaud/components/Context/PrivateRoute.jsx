import { Navigate } from 'react-router-dom';
import { useStateContext } from './ContextProvider';

export const PrivateRoute = ({ element }) => {
    const { token, user } = useStateContext();  // Récupère le token du contexte

    // Vérifie si le token est présent
    if (!token || !user) {
        // Redirige vers la page de login si pas de token
        return <Navigate to="/login" />;
    }

    return element;
};