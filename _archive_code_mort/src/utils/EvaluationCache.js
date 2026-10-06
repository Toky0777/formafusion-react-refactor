// utils/evaluationCache.js
class EvaluationCache {
    constructor() {
        this.cache = new Map();
        this.pendingRequests = new Map();
        this.requestTimestamps = new Map();
        this.maxCacheAge = 5 * 60 * 1000; // 5 minutes
    }

    async get(projectId, apprenants, fetchFunction) {
        const cacheKey = `project-${projectId}`;
        
        // Nettoyer le cache périodiquement
        this.cleanup();
        
        // Retourner du cache si disponible et récent
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.maxCacheAge) {
                console.log(`📦 Cache valide pour le projet ${projectId}`);
                return cached.data;
            } else {
                this.cache.delete(cacheKey);
            }
        }

        // Éviter les requêtes en double
        if (this.pendingRequests.has(cacheKey)) {
            console.log(`⏳ Requête en cours pour ${projectId}, attente...`);
            return await this.pendingRequests.get(cacheKey);
        }

        // Contrôle du rate limiting entre projets
        const lastRequestTime = this.requestTimestamps.get('global') || 0;
        const timeSinceLastRequest = Date.now() - lastRequestTime;
        
        if (timeSinceLastRequest < 1500) {
            console.log(`⏳ Délai global de ${1500 - timeSinceLastRequest}ms`);
            await new Promise(resolve => setTimeout(resolve, 1500 - timeSinceLastRequest));
        }

        try {
            const requestPromise = fetchFunction(projectId, apprenants);
            this.pendingRequests.set(cacheKey, requestPromise);
            
            const result = await requestPromise;
            
            // Mettre en cache
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });
            
            this.requestTimestamps.set('global', Date.now());
            return result;
            
        } finally {
            this.pendingRequests.delete(cacheKey);
        }
    }

    clear() {
        this.cache.clear();
        this.pendingRequests.clear();
        this.requestTimestamps.clear();
    }

    cleanup() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.maxCacheAge) {
                this.cache.delete(key);
            }
        }
    }
        clearProject(projectId) {
        const cacheKey = `project-${projectId}`;
        this.cache.delete(cacheKey);
        this.pendingRequests.delete(cacheKey);
        console.log(`🗑️ Cache vidé pour le projet ${projectId}`);
    }
}

export const evaluationCache = new EvaluationCache();