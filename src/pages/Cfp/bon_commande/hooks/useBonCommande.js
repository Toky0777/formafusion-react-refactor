import { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import axios from "../../../../config/axios";

export function useBonCommande() {
    const [bons, setBons] = useState([]);
    const [totals, setTotals] = useState({
        total_devis: 0,
        total_bc: 0,
        total_new_bc: 0,
    });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [entrepriseList, setEntrepriseList] = useState([]);
    const [devisList, setDevisList] = useState([]);
    const [selectedEtpId, setSelectedEtpId] = useState("");
    const [form, setForm] = useState({
        numero: "",
        montant: "",
        date: "",
        date_debut: "",
        date_fin: "",
        modalite: "",
        idDevis: "",
        contact_name: "",
        contact_mail: "",
        contact_phone: "",
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(true);
    const [perPage, setPerPage] = useState(10);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });
    const [filters, setFilters] = useState({
        numero_bc: "",
        etp_name: "",
        date_bc_fin: "",
        status: ""
    });
    const [documents, setDocuments] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [selectedBC, setSelectedBC] = useState(null);

    const fetchBons = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.current_page,
                per_page: perPage,
                ...filters
            };

            // Nettoyer les paramètres vides
            Object.keys(params).forEach(key => {
                if (params[key] === "" || params[key] === null || params[key] === undefined) {
                    delete params[key];
                }
            });

            const res = await axios.get("/cfp/bon-commande", { params });
            const data = res.data;

            setBons(data.bon_commandes || []);
            setTotals({
                total_devis: data.total_devis || 0,
                total_bc: data.total_bc || 0,
                total_new_bc: data.total_new_bc || 0
            });
            setPagination({
                current_page: data.current_page || 1,
                last_page: data.last_page || 1,
                total: data.total || 0,
                from: data.from || 0,
                to: data.to || 0,
            });
        } catch (e) {
            console.error("Erreur lors du chargement des bons de commande:", e);
            setBons([]);
            setTotals({ total_devis: 0, total_bc: 0, total_new_bc: 0 });
        } finally {
            setLoading(false);
        }
    }, [perPage, pagination.current_page, filters]);

    useEffect(() => {
        fetchBons();
    }, [fetchBons]);

    const handleFilterChange = useCallback((name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleFilterReset = useCallback(() => {
        setFilters({
            numero_bc: "",
            etp_name: "",
            date_bc_fin: "",
            status: ""
        });
        setPagination(prev => ({ ...prev, current_page: 1 }));
    }, []);

    const handleFilterSubmit = useCallback((e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, current_page: 1 }));
        fetchBons();
    }, [fetchBons]);

    // Charger les données du drawer
    useEffect(() => {
        if (drawerOpen) {
            const loadDrawerData = async () => {
                try {
                    const [entreprisesRes, devisRes] = await Promise.all([
                        axios.get("/cfp/bon-commande/getAllEtpDevis"),
                        selectedEtpId ? axios.get(`/cfp/bon-commande/getDevis`, {params: {
                    etpIds: selectedEtpId
                }}) : Promise.resolve({ data: [] })
                    ]);

                    setEntrepriseList(entreprisesRes.data || []);
                    if (selectedEtpId) {
                        setDevisList(devisRes.data || []);
                    }
                } catch (error) {
                    console.error("Erreur chargement données drawer:", error);
                }
            };

            loadDrawerData();
        }
    }, [drawerOpen, selectedEtpId]);

    // Optimiser le chargement des devis avec debounce
    useEffect(() => {
        if (selectedEtpId && drawerOpen) {
            const timer = setTimeout(() => {
                axios.get('/cfp/bon-commande/getDevis', {params: {
                    etpIds: selectedEtpId
                }})
                    .then((res) => {
                        setDevisList(res.data || []);
                    })
                    .catch(console.error);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [selectedEtpId, drawerOpen]);

    const handlePageChange = useCallback((newPage) => {
        setPagination((p) => ({ ...p, current_page: newPage }));
    }, []);

    const resetForm = useCallback(() => {
        setForm({
            numero: "",
            montant: "",
            date: "",
            date_debut: "",
            date_fin: "",
            modalite: "",
            idDevis: "",
            contact_name: "",
            contact_mail: "",
            contact_phone: "",
        });
        setSelectedEtpId("");
        setDevisList([]);
        setEditingId(null);
        setFormError("");
    }, []);

    const handleDrawerSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError("");

        try {
            const payload = {
                ...form,
                montant: form.montant ? Number(form.montant) : undefined,
                idDevis: Number(form.idDevis),
                // Nettoyer les dates vides
                date: form.date || null,
                date_debut: form.date_debut || null,
                date_fin: form.date_fin || null,
                modalite: form.modalite || null,
            };

            if (editingId) {
                await axios.put(`/cfp/bon-commande/${editingId}`, payload);
            } else {
                await axios.post("/cfp/bon-commande", payload);
            }

            setDrawerOpen(false);
            resetForm();
            fetchBons();
        } catch (err) {
            setFormError(
                editingId
                    ? "Erreur lors de la modification. Vérifiez les champs obligatoires."
                    : "Erreur lors de l'ajout. Vérifiez les champs obligatoires."
            );
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = useCallback(async (bc) => {
        try {
            setDrawerOpen(true);
            setEditingId(bc.idBC);

            setForm({
                numero: bc.numero_bc || "",
                montant: bc.montant_bc || "",
                date: bc.date_bc ? dayjs(bc.date_bc).format("YYYY-MM-DD") : "",
                date_debut: bc.date_debut ? dayjs(bc.date_debut).format("YYYY-MM-DD") : "",
                date_fin: bc.date_fin ? dayjs(bc.date_fin).format("YYYY-MM-DD") : "",
                modalite: bc.modalite || "",
                idDevis: bc.idDevis || "",
                contact_name: bc.contact_name || "",
                contact_mail: bc.contact_mail || "",
                contact_phone: bc.contact_phone || "",
            });

            if (bc.idEtp) {
                setSelectedEtpId(bc.idEtp);

                Promise.all([
                    axios.get("/cfp/bon-commande/getAllEtpDevis"),
                    axios.get(`/cfp/bon-commande/getDevis`,  {params: {
                    etpIds: bc.idEtp
                }})
                ]).then(([entreprisesRes, devisRes]) => {
                    setEntrepriseList(entreprisesRes.data || []);
                    setDevisList(devisRes.data || []);
                }).catch(console.error);
            } else {
                axios.get("/cfp/bon-commande/getAllEtpDevis")
                    .then((res) => setEntrepriseList(res.data || []))
                    .catch(console.error);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des données:", error);
        }
    }, []);

    const handleDelete = useCallback(async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce bon de commande ?")) {
            try {
                await axios.delete(`/cfp/bon-commande/${id}`);
                fetchBons();
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
                alert("Erreur lors de la suppression du bon de commande.");
            }
        }
    }, [fetchBons]);

    const handleDrawerClose = useCallback(() => {
        setDrawerOpen(false);
        resetForm();
    }, [resetForm]);

    const handleNewClick = useCallback(() => {
        resetForm();
        setDrawerOpen(true);
    }, [resetForm]);

    // Gestion des documents
    const fetchDocuments = useCallback(async (idBC) => {
        try {
            const res = await axios.get(`/bon-commandes/doc/${idBC}/documents`);
            setDocuments(res.data || []);
        } catch (error) {
            console.error("Erreur lors du chargement des documents:", error);
            setDocuments([]);
        }
    }, []);

    const uploadDocument = useCallback(async (idBC, file) => {
        setUploadLoading(true);
        try {
            const formData = new FormData();
            formData.append('document', file);

            await axios.post(`/bon-commandes/doc/${idBC}/upload-document`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Recharger les documents après upload
            await fetchDocuments(idBC);
            return { success: true };
        } catch (error) {
            console.error("Erreur lors de l'upload:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Erreur lors de l'upload"
            };
        } finally {
            setUploadLoading(false);
        }
    }, [fetchDocuments]);

    const downloadDocument = useCallback(async (idDocument) => {
        try {
            const response = await axios.get(`/bon-commandes/doc/${idDocument}/download`, {
                responseType: 'blob'
            });

            // Créer un URL temporaire pour le téléchargement
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Extraire le nom du fichier depuis les headers
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'document';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch.length === 2) {
                    filename = filenameMatch[1];
                }
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erreur lors du téléchargement:", error);
            throw error;
        }
    }, []);

    const deleteDocument = useCallback(async (idDocument, idBC) => {
        try {
            await axios.delete(`/bon-commandes/doc/${idDocument}/documents`);
            // Recharger les documents après suppression
            await fetchDocuments(idBC);
            return { success: true };
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Erreur lors de la suppression"
            };
        }
    }, [fetchDocuments]);

    const openDocumentsModal = useCallback(async (bonCommande) => {
        setSelectedBC(bonCommande);
        await fetchDocuments(bonCommande.idBC);
    }, [fetchDocuments]);

    const closeDocumentsModal = useCallback(() => {
        setSelectedBC(null);
        setDocuments([]);
    }, []);

    // Dans useBonCommande.js
    const previewDocument = useCallback(async (idDocument) => {
        try {
            // Appeler la route via axios pour récupérer le blob
            const response = await axios.get(`/bon-commandes/doc/${idDocument}/preview`, {
                responseType: 'blob'
            });

            // Créer une URL blob pour le fichier
            const blob = new Blob([response.data], {
                type: response.headers['content-type']
            });
            const blobUrl = URL.createObjectURL(blob);

            // Ouvrir dans un nouvel onglet
            window.open(blobUrl, '_blank');

            // Nettoyer l'URL après un délai
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 1000);

            return { success: true };

        } catch (error) {
            console.error("Erreur lors de la prévisualisation:", error);

            // Si c'est une erreur blob, essayer de récupérer le message d'erreur
            if (error.response && error.response.data instanceof Blob) {
                const errorText = await error.response.data.text();
                const errorData = JSON.parse(errorText);
                return {
                    success: false,
                    error: errorData.error || "Erreur lors de l'ouverture du document"
                };
            }

            return {
                success: false,
                error: error.response?.data?.error || "Impossible d'ouvrir le document"
            };
        }
    }, []);

    return {
        // State
        bons,
        totals,
        drawerOpen,
        editingId,
        entrepriseList,
        devisList,
        selectedEtpId,
        form,
        formLoading,
        formError,
        loading,
        perPage,
        pagination,
        filters,
        documents,
        uploadLoading,
        selectedBC,

        // Setters
        setForm,
        setSelectedEtpId,
        setPerPage,

        // Handlers
        handleFilterChange,
        handleFilterReset,
        handleFilterSubmit,
        handlePageChange,
        handleDrawerSubmit,
        handleEdit,
        handleDelete,
        handleDrawerClose,
        handleNewClick,

        // Functions
        fetchBons,
        fetchDocuments,
        uploadDocument,
        downloadDocument,
        deleteDocument,
        openDocumentsModal,
        closeDocumentsModal,
        previewDocument,
    };
}