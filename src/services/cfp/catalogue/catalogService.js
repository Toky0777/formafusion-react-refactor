import axios from '../../../config/axios';

class CatalogService {
    async getCatalogCfp() {
        const { data } = await axios.get(`/cfp/modules`);
        return data;
    }
    async getDetailModule(id) {
        const response = await axios.get(`/cfp/modules/${id}/edit`);
        return response.data.module;
    }
    async getDetailObjectif(id) {
        const response = await axios.get(`/cfp/modules/${id}/objectifs`);
        return response.data.objectifs;
    }

    async getDetailPrerequis(id) {
        const response = await axios.get(`/cfp/modules/${id}/prerequis`);
        return response.data.prerequis;
    }

    async getDetailPrestation(id) {
        const response = await axios.get(`/cfp/modules/${id}/prestations`);
        return response.data.prestations;
    }

    async getDetailCibles(id) {
        const response = await axios.get(`/cfp/modules/${id}/cibles`);
        return response.data.cibles;
    }

    async getDetailQualité(id) {
        const response = await axios.get(`/cfp/modules/${id}/quality`);
        console.log(response)
        return response.data.sumQuality;
    }

    async getDetailRessource(id) {
        const response = await axios.get(`/cfp/module/ressources/${id}`);
        return response.data;
    }

    async getDetailProgramme(id) {
        try {
            const response = await axios.get(`/cfp/module-programmes/${id}`);
            const programmes = response.data.programmes;

            if (!programmes || programmes.length === 0) {
                return [];
            }

            // Limitez le nombre de requêtes parallèles
            const BATCH_SIZE = 3; // Maximum 3 requêtes simultanées
            const programmesAvecContenus = [];

            for (let i = 0; i < programmes.length; i += BATCH_SIZE) {
                const batch = programmes.slice(i, i + BATCH_SIZE);

                const batchResults = await Promise.all(
                    batch.map(async (programme) => {
                        try {
                            const contentResponse = await axios.get(
                                `/cfp/module/programmes/${programme.idProgramme}`,
                                { timeout: 5000 } // Timeout de 5 secondes
                            );
                            return {
                                ...programme,
                                contents: contentResponse.data.status === 200
                                    ? contentResponse.data.program_contents
                                    : []
                            };
                        } catch (err) {
                            console.error(`Erreur pour le programme ${programme.idProgramme}:`, err);
                            return { ...programme, contents: [] };
                        }
                    })
                );

                programmesAvecContenus.push(...batchResults);

                // Petit délai entre les batches pour éviter le rate limiting
                if (i + BATCH_SIZE < programmes.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            return programmesAvecContenus;
        } catch (error) {
            console.error("Erreur lors de la récupération des programmes :", error);
            return [];
        }
    }

    async getModulePublicCount(){
        const response = await axios.get('/cfp/modules/get_module_public_count');
        return response.data;
    }

}

export default new CatalogService();