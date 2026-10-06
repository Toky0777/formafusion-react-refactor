// 1. Créer un composant RoleBasedRoute
import { Navigate } from 'react-router-dom';
import { useStateContext } from './ContextProvider';

export function RoleBasedRoute({ element, allowedRoles, redirectTo = '/unauthorized' }) {
    const { user, hasRole, token } = useStateContext();

    // Vérifier si l'utilisateur est connecté
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Vérifier si l'utilisateur a au moins un des rôles autorisés
    const hasRequiredRole = allowedRoles.some(role => hasRole(role));

    if (!hasRequiredRole) {
        return <Navigate to={redirectTo} replace />;
    }

    return element;
}

// Constantes pour les rôles
export const ROLES = {
    CFP: 'Cfp',
    FORMATEUR: 'Formateur',
    EMPLOYE_CFP: 'EmployeCfp',
    EMPLOYE: 'Employe',
    ETP: 'Referent',
    PARTICULIER: 'Particulier',
};