// hooks/useLazyEvaluations.js - Version améliorée
import { useState, useCallback, useEffect, useRef } from 'react';

export const useLazyEvaluations = (project, onFetchEvaluations, refreshTrigger = 0) => {
    const [evaluationData, setEvaluationData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const hasLoadedRef = useRef(false);
    
    const loadEvaluations = useCallback(async () => {
        if (!project?.apprs || project.apprs.length === 0) {
            return;
        }
        
        // Réinitialiser si refreshTrigger change
        if (refreshTrigger > 0) {
            setEvaluationData(null);
            hasLoadedRef.current = false;
        }
        
        if (hasLoadedRef.current) {
            return;
        }
        
        setIsLoading(true);
        setError(null);
        hasLoadedRef.current = true;
        
        try {
            console.log(`🔄 Chargement évaluations pour ${project.idProjet}`);
            const data = await onFetchEvaluations(project.idProjet, project.apprs);
            setEvaluationData(data);
        } catch (err) {
            console.error("Erreur chargement évaluations:", err);
            setError(err.message);
            hasLoadedRef.current = false; // Permettre retry
        } finally {
            setIsLoading(false);
        }
    }, [project, onFetchEvaluations, refreshTrigger]);

    // Réinitialiser quand le projet change
    useEffect(() => {
        if (project?.idProjet) {
            setEvaluationData(null);
            setError(null);
            hasLoadedRef.current = false;
        }
    }, [project?.idProjet]);

    return { 
        evaluationData, 
        isLoading, 
        error, 
        loadEvaluations,
        hasLoaded: hasLoadedRef.current
    };
};