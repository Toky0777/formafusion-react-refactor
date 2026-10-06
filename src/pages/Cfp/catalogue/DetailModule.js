import icons from "../../../components/icons/icone";
import ModalFormation from "../../../components/Modals/catalog/ModalFormation";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"
import axios from "../../../config/axios";
import { HiOutlineDocument } from "react-icons/hi";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import catalogService from "../../../services/cfp/catalogue/catalogService";
import { Clock, Users, Medal, Info, BookOpen, PackageOpen, Pencil, Trash, Upload, Bookmark, RotateCcw, Save } from 'lucide-react';
import iconeAddCatalogue from "../../../components/icones ajout catalogue/iconeAddCatalogue";

export default function DetailModule() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    // États pour ajout
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isPrerequis, setIsPrerequis] = useState(false);
    const [isMateriel, setIsMateriel] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [isObjectif, setIsObjectif] = useState(false);
    const [isFormationBase, setIsFormationBase] = useState(false);
    const [isRessource, setIsRessource] = useState(null);

    // Etats pour modification objectif,prerequis,matériel,cible,programme contenu,programme titre
    const [editingObjectifId, setEditingObjectifId] = useState(null);
    const [editingObjectifValue, setEditingObjectifValue] = useState("");

    const [editingPrerequisId, setEditingPrerequisId] = useState(null);
    const [editingPrerequisValue, setEditingPrerequisValue] = useState("");

    const [editingPrestationId, setEditingPrestationId] = useState(null);
    const [editingPrestationValue, setEditingPrestationValue] = useState("");

    const [editingCibleId, setEditingCibleId] = useState(null);
    const [editingCibleValue, setEditingCibleValue] = useState("");

    const [editingContentId, setEditingContentId] = useState(null);
    const [editingContentValue, setEditingContentValue] = useState("");
    const [activeProgrammeId, setActiveProgrammeId] = useState(null);
    const [isUpdatingContent, setIsUpdatingContent] = useState(false);
    const [activeModuleForm, setActiveModuleForm] = useState(null);

    const [editingTitreId, setEditingTitreId] = useState(null);
    const [editingTitreValue, setEditingTitreValue] = useState("");


    // États pour les données
    const [moduleData, setModuleData] = useState(null);
    const [objectifs, setObjectifs] = useState([]);
    const [prerequis, setPrerequis] = useState([]);
    const [prestation, setPrestation] = useState([]);
    const [cible, setCible] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [qualityScore, setQualityScore] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // États pour les formulaires
    const [newObjectif, setNewObjectif] = useState("");
    const [newPrerequis, setNewPrerequis] = useState("");
    const [newPrestation, setNewPrestation] = useState("");
    const [newCible, setNewCible] = useState("");
    const [newProgramme, setNewProgramme] = useState({ program_title: '', program_description: '' });
    const [newModuleProgramme, setNewModuleProgramme] = useState({ content_title: '', content_description: '' });
    const [file, setFile] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fonction pour récupérer toutes les données du module
    const fetchAllModuleData = useCallback(async () => {
        if (!id) return;
        try {
            const [
                moduleResponse,
                objectifsResponse,
                prerequisResponse,
                prestationResponse,
                cibleResponse,
                ressourceResponse
            ] = await Promise.all([
                catalogService.getDetailModule(id),
                catalogService.getDetailObjectif(id),
                catalogService.getDetailPrerequis(id),
                catalogService.getDetailPrestation(id),
                catalogService.getDetailCibles(id),
                catalogService.getDetailRessource(id),
            ]);

            // Récupérer le score de qualité séparément avec gestion d'erreur
            let qualityScoreValue = 0;
            try {
                qualityScoreValue = await catalogService.getDetailQualité(id);
            } catch (qualityError) {
                console.warn("Erreur qualité non critique:", qualityError);
            }

            setModuleData(moduleResponse);
            setObjectifs(objectifsResponse);
            setPrerequis(prerequisResponse);
            setPrestation(prestationResponse);
            setCible(cibleResponse);
            setQualityScore(qualityScoreValue);
            setUploadedFiles(ressourceResponse);

            // Programmes chargés séparément
            const programmeResponse = await catalogService.getDetailProgramme(id);
            setProgrammes(programmeResponse);

        } catch (err) {
            console.error("Erreur lors de la récupération des données:", err);
        }
    }, [id]);

    // Utilisation d'un seul useEffect pour charger toutes les données
    useEffect(() => {
        fetchAllModuleData();
    }, [fetchAllModuleData]);

    const fromStatus = location.state?.fromStatus; // online / offline / trash

    // if (error) return <div>{error}</div>;
    if (!moduleData) return (
        <div className="text-center">
            <LoadingSpinner />
        </div>
    );
    // Fonction pour supprimer un contenu
    const handleDeleteContent = async (idProgramme, idContent) => {
        // if (!window.confirm("Voulez-vous vraiment supprimer ce contenu ?")) return;
        try {
            const response = await axios.delete(`/cfp/module/programmes/${idProgramme}/content/${idContent}`);

            if (response.data.status === 200) {
                setProgrammes(prev =>
                    prev.map(prog =>
                        prog.idProgramme === idProgramme
                            ? {
                                ...prog,
                                contents: prog.contents.filter(c => c.id !== idContent)
                            }
                            : prog
                    )
                );

            } else {
                console.error(response.data.message || "Erreur lors de la suppression");
            }
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    // Fonctions pour ajouter des éléments
    const handleAddObjectif = async (e) => {
        e.preventDefault();
        if (!newObjectif.trim()) return;

        let tempId = -Date.now();
        const tempObjectif = {
            idObjectif: tempId,
            objectif: newObjectif,
            idModule: id
        };

        setObjectifs(prev => [...prev, tempObjectif]);
        setNewObjectif("");

        try {
            const response = await axios.post(`/cfp/modules/${id}/objectifs`, { name: newObjectif });

            if (response.data) {
                await fetchAllModuleData();
                console.log("Objectif ajouté avec succès !");
                setIsObjectif(false);
            }
        } catch (error) {
            setObjectifs(prev => prev.filter(obj => obj.idObjectif !== tempId));
            console.error("Erreur lors de l'ajout");
        }
    };

    const handleAddPrerequis = async (e) => {
        e.preventDefault();
        if (!newPrerequis.trim()) return;

        let tempId = -Date.now();
        const tempPrerequis = {
            idPrerequis: tempId,
            prerequis_name: newPrerequis,
            idModule: id
        };

        setPrerequis(prev => [...prev, tempPrerequis]);
        setNewPrerequis("");

        try {
            await axios.post(`/cfp/modules/${id}/prerequis`, { prerequis_name: newPrerequis });
            await fetchAllModuleData();
            console.log("Prerequis ajouté avec succès !");
            setIsPrerequis(false);
        } catch (error) {
            setPrerequis(prev => prev.filter(prer => prer.idPrerequis !== tempId));
            console.error("Erreur lors de l'ajout des prerequis");
        }
    };

    const handleAddMateriels = async (e) => {
        e.preventDefault();
        if (!newPrestation.trim()) return;

        let tempId = -Date.now();
        const tempPrestation = {
            idPrestation: tempId,
            prestation_name: newPrestation,
            idModule: id
        };

        setPrestation(prev => [...prev, tempPrestation]);
        setNewPrestation("");

        try {
            await axios.post(`/cfp/modules/${id}/prestations`, { prestation_name: newPrestation });
            await fetchAllModuleData();
            console.log("Matériel ajouté avec succès !");
            setIsMateriel(false);
        } catch (error) {
            setPrestation(prev => prev.filter(pres => pres.idPrestation !== tempId));
            console.error("Erreur lors de l'ajout des matériels");
        }
    };

    const handleAddCible = async (e) => {
        e.preventDefault();
        if (!newCible.trim()) return;

        let tempId = -Date.now();
        const tempCible = {
            idCible: tempId,
            cible_name: newCible,
            idModule: id
        };

        setCible(prev => [...prev, tempCible]);
        setNewCible("");

        try {
            await axios.post(`/cfp/modules/${id}/cibles`, { cible_name: newCible });
            await fetchAllModuleData();
            console.log("Cible ajouté avec succès !");
            setIsPublic(false);
        } catch (error) {
            setCible(prev => prev.filter(cib => cib.idCible !== tempId));
            console.error("Erreur lors de l'ajout du Cible");
        }
    };

    //Fonctions pour la modification objectif, prerequis,matériel,cible,programme contenu,programme titre
    const handleUpdateObjectif = async (idObjectif) => {
        if (!editingObjectifValue.trim()) {
            console.error("L'objectif ne peut pas être vide");
            return;
        }

        try {
            const response = await axios.put(`/cfp/modules/${id}/objectifs/${idObjectif}`, {
                module_objectif: editingObjectifValue,
            });

            if (response.data.status === 200) {
                // Mettre à jour l'état local
                setObjectifs(prev =>
                    prev.map(obj =>
                        obj.idObjectif === idObjectif
                            ? { ...obj, objectif: editingObjectifValue }
                            : obj
                    )
                );

                setEditingObjectifId(null);
                setEditingObjectifValue("");
                console.log("Objectif modifié avec succès !");
            } else {
                console.error(response.data.message || "Erreur lors de la modification");
            }
        } catch (error) {
            console.error("Erreur lors de la modification:", error);
            console.error("Erreur lors de la modification de l'objectif");
        }
    };
    const handleUpdatePrerequis = async (idPrerequis) => {
        if (!editingPrerequisValue.trim()) {
            console.error("Le prérequis ne peut pas être vide");
            return;
        }

        try {
            const response = await axios.put(`/cfp/modules/${id}/prerequis/${idPrerequis}`, {
                module_requirement: editingPrerequisValue, // adapter selon ton backend
            });

            if (response.data.status === 200) {
                setPrerequis((prev) =>
                    prev.map((p) =>
                        p.idPrerequis === idPrerequis ? { ...p, prerequis_name: editingPrerequisValue } : p
                    )
                );
                setEditingPrerequisId(null);
                setEditingPrerequisValue("");
                console.log("Prérequis modifié avec succès !");
            } else {
                console.error(response.data.message || "Erreur lors de la modification");
            }
        } catch (error) {
            console.error("Erreur lors de la modification:", error);
            console.error("Erreur lors de la modification du prérequis");
        }
    };
    const handleUpdatePrestation = async (idPrestation) => {
        if (!editingPrestationValue.trim()) {
            console.error("Le matériel ne peut pas être vide");
            return;
        }

        try {
            const response = await axios.put(`/cfp/modules/${id}/prestations/${idPrestation}`, {
                module_prestation: editingPrestationValue, // adapter selon ton backend
            });

            if (response.data.status === 200) {
                setPrestation((prev) =>
                    prev.map((p) =>
                        p.idPrestation === idPrestation
                            ? { ...p, prestation_name: editingPrestationValue }
                            : p
                    )
                );
                setEditingPrestationId(null);
                setEditingPrestationValue("");
                console.log("Matériel modifié avec succès !");
            } else {
                console.error(response.data.message || "Erreur lors de la modification");
            }
        } catch (error) {
            console.error("Erreur lors de la modification:", error);
            console.error("Erreur lors de la modification du matériel");
        }
    };
    const handleUpdateCible = async (idCible) => {
        if (!editingCibleValue.trim()) {
            console.error("Le public concerné ne peut pas être vide");
            return;
        }

        try {
            const response = await axios.put(`/cfp/modules/${id}/cibles/${idCible}`, {
                module_cible: editingCibleValue, // adapter selon ton backend
            });

            if (response.data.status === 200) {
                setCible((prev) =>
                    prev.map((c) =>
                        c.idCible === idCible ? { ...c, cible: editingCibleValue } : c
                    )
                );
                setEditingCibleId(null);
                setEditingCibleValue("");
                console.log("Public concerné modifié avec succès !");
            } else {
                console.error(response.data.message || "Erreur lors de la modification");
            }
        } catch (error) {
            console.error("Erreur lors de la modification:", error);
            console.error("Erreur lors de la modification du public concerné");
        }
    };
    const handleUpdateContentInline = async (contentId) => {
        if (!editingContentValue.trim()) {
            console.error("Le contenu ne peut pas être vide");
            return;
        }

        try {
            setIsUpdatingContent(true);
            const response = await axios.put(
                `/cfp/module/programmes/${activeProgrammeId}/content/${contentId}`,
                { content_description: editingContentValue }
            );

            if (response.data.status === 200) {
                setProgrammes((prev) =>
                    prev.map((prog) =>
                        prog.idProgramme === activeProgrammeId
                            ? {
                                ...prog,
                                contents: prog.contents.map((c) =>
                                    c.id === contentId
                                        ? { ...c, description: editingContentValue }
                                        : c
                                ),
                            }
                            : prog
                    )
                );
                console.log("Modification réussie");
                setEditingContentId(null);
                setEditingContentValue("");
                setActiveProgrammeId(null);
            } else {
                console.error(response.data.message || "Erreur lors de la modification");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour", error);
            console.error("Erreur lors de la mise à jour");
        } finally {
            setIsUpdatingContent(false);
        }
    };
    const handleUpdateTitreInline = async (idProgramme) => {
        if (!editingTitreValue.trim()) {
            console.log("Le contenu ne peut pas être vide");
            return
        }
        try {
            const response = await axios.put(`/cfp/module-programmes/${id}/${idProgramme}/update`, {
                program_title: editingTitreValue, // adapter selon ton backend
            });

            if (response.data.status === 200) {
                setProgrammes((prev) =>
                    prev.map((p) =>
                        p.idProgramme === idProgramme ? { ...p, program_title: editingTitreValue } : p
                    )
                );
                setEditingTitreId(null);
                setEditingTitreValue("");
                console.log("Titre de programme modifié avec succès !");
            } else {
                console.error(response.data.message || "Erreur lors de la modification");
            }
        } catch (error) {
            console.error("Erreur lors de la modification:", error);
            console.error("Erreur lors de la modification du public concerné");
        }
    }


    // Fonctions pour supprimer des éléments
    const DeleteProgrammeTitre = async (idProgramme) => {
        if (!idProgramme) return;

        if (idProgramme < 0) {
            setProgrammes(prev => prev.filter(prog => prog.idProgramme !== idProgramme));
            return;
        }

        try {
            await axios.delete(`/cfp/module-programmes/${id}/${idProgramme}`);
            await fetchAllModuleData();
            console.log("Programme supprimé avec succès !");
        } catch (error) {
            console.error("Échec de la suppression:", error);
        }
    }
    const DeleteObjectif = async (idObjectif) => {
        if (!idObjectif) return;

        if (idObjectif < 0) {
            setObjectifs(prev => prev.filter(obj => obj.idObjectif !== idObjectif));
            return;
        }

        try {
            await axios.delete(`/cfp/modules/${id}/objectifs/${idObjectif}`);
            await fetchAllModuleData();
            console.log("Objectif supprimé avec succès !");
        } catch (error) {
            console.error("Échec de la suppression:", error);
            console.error("Échec de la suppression. Veuillez réessayer.");
        }
    };
    const DeletePrerequis = async (idPrerequis) => {
        if (!idPrerequis) return;

        if (idPrerequis < 0) {
            setPrerequis(prev => prev.filter(prer => prer.idPrerequis !== idPrerequis));
            return;
        }

        try {
            await axios.delete(`/cfp/modules/${id}/prerequis/${idPrerequis}`);
            await fetchAllModuleData();
            console.log("Prerequis supprimer avec succès !");
        } catch (error) {
            console.error("Échec de la suppression:", error);
            console.error("Échec de la suppression. Veuillez réessayer.");
        }
    };
    const DeletePrestation = async (idPrestation) => {
        if (!idPrestation) return;

        if (idPrestation < 0) {
            setPrestation(prev => prev.filter(prer => prer.idPrestation !== idPrestation));
            return;
        }

        try {
            await axios.delete(`/cfp/modules/${id}/prestations/${idPrestation}`);
            await fetchAllModuleData();
            console.log("Matériel supprimer avec succès !");
        } catch (error) {
            console.error("Échec de la suppression:", error);
            console.error("Échec de la suppression. Veuillez réessayer.");
        }
    };
    const DeleteCible = async (idCible) => {
        if (!idCible) return;

        if (idCible < 0) {
            setCible(prev => prev.filter(cib => cib.idCible !== idCible));
            return;
        }

        try {
            await axios.delete(`/cfp/modules/${id}/cibles/${idCible}`);
            await fetchAllModuleData();
            console.log("Cible supprimer avec succès !");
        } catch (error) {
            console.error("Échec de la suppression:", error);
            console.error("Échec de la suppression. Veuillez réessayer.");
        }
    };

    // Gestion des programmes sur le titre
    const handleProgrammeInputChange = (e) => {
        const { name, value } = e.target;
        setNewProgramme(prev => ({ ...prev, [name]: value }));
    };
    const handleAddProgramme = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post(`/cfp/module-programmes/${id}`, {
                program_title: newProgramme.program_title.trim(),
            });

            if (response.data.status === 200) {
                await fetchAllModuleData();
                setNewProgramme({ program_title: '' });
                console.log('Programme ajouté avec succès');
                setIsFormVisible(false);
            } else {
                console.error(response.data.message || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du programme:', error);
            console.error('Erreur serveur. Veuillez réessayer plus tard.');
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleAddprogrammeModuleInputChange = (e) => {
        const { name, value } = e.target;
        setNewModuleProgramme(prev => ({ ...prev, [name]: value }));
    };
    const handleAddProgrammeModule = async (e, idProgramme) => {
        e.preventDefault();

        try {
            const response = await axios.post(`/cfp/module/programmes/${idProgramme}`, {
                content_title: null,
                content_description: newModuleProgramme.content_description.trim()
            });

            if (response.data.status === 200) {
                await fetchAllModuleData();
                console.log('Description ajoutée avec succès');
                setNewModuleProgramme({ content_description: '' });
            } else {
                console.error(response.data.message || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du contenu :", error);
            console.error("Erreur serveur. Veuillez réessayer plus tard.");
        }
    };

    // Gestion des ressources
    const handleFileChange = (e) => {
        setFile(Array.from(e.target.files));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || file.length === 0) return;

        const formData = new FormData();
        file.forEach(f => formData.append('module_ressource_file[]', f));

        try {

            const res = await axios.post(`/cfp/module/ressources/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            console.log("Réponse serveur :", res.data);

            if (res.data.status === 200) {

                setUploadedFiles((prev) => [...prev, ...res.data.files]);

                // ✅ Vider l'input
                setFile([]);

                // ✅ Fermer le modal immédiatement
                setIsRessource(false);

                // ✅ Recharger les données pour synchroniser
                await fetchAllModuleData();

                // ✅ Message succès
                console.log("Fichier importé avec succès");
            } else {
                console.error(res.data.message || "Erreur lors de l'importation");
                console.error("Erreur API :", res.data);
            }
        } catch (err) {
            console.error("Erreur Axios :", err.response?.data || err);
            console.error(err.response?.data?.message || "Erreur lors de l'importation");
        }
    };
    const handleDeleteRessource = async (idModuleRessource, fileName) => {

        try {
            const response = await axios.delete(`/cfp/module/ressources/${idModuleRessource}`);

            if (response.data.status === 200) {
                // CORRECTION : Utiliser l'ID correct pour filtrer
                setUploadedFiles(prevFiles =>
                    prevFiles.filter(file => file.idModuleRessource !== idModuleRessource)
                );
                console.log("Fichier supprimé avec succès !");
            } else {
                console.error(response.data.message || "Échec de la suppression");
            }
        } catch (error) {
            console.error("Échec de la suppression:", error.response?.data || error);
            const backendMessage = error?.response?.data?.error || error?.response?.data?.message || "Erreur inconnue";
            console.error(`Erreur : ${backendMessage}`);
        }
    };
    const handDownloadRessource = async (idModuleRessource, nomFichier) => {
        try {
            const response = await axios.get(
                `/cfp/module/ressources/${idModuleRessource}/download`,
                {
                    responseType: "blob", // très important : récupère le fichier brut
                }
            );

            // Vérifie si le serveur renvoie un fichier ou une erreur JSON
            const contentType = response.headers["content-type"];
            console.log("Type de fichier téléchargé :", contentType);

            if (contentType === "application/json") {
                // Si le serveur renvoie une erreur JSON (fichier introuvable)
                const reader = new FileReader();
                reader.onload = () => {
                    console.error("Erreur serveur :", reader.result);
                    alert("Impossible de télécharger le fichier (fichier introuvable).");
                };
                reader.readAsText(response.data);
                return;
            }

            // Création de l'URL temporaire pour le téléchargement
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", nomFichier); // nom du fichier
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            console.log("Téléchargement démarré !");
        } catch (error) {
            console.error("Erreur de téléchargement :", error);
            alert("Impossible de télécharger le fichier.");
        }
    };

    // Changement de statut
    const updateStatus = async (id, action, newStatus) => {
        try {
            const response = await axios.patch(`/cfp/modules/${id}/${action}`, {});

            if (response.status === 200) {
                console.log("Mise à jour avec succès");
                setModuleData(prev => ({ ...prev, status: action }));

                setTimeout(() => {
                    if (newStatus === "online") {
                        navigate("/cfp/catalogue");
                    } else if (newStatus === "offline") {
                        navigate("/cfp/catalogue/preparation");
                    } else if (newStatus === "trash") {
                        navigate("/cfp/catalogue/corbeille");
                    }
                }, 1000);
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error("une erreur est survenue");
        }
    };

    // Calcul du pourcentage de qualité
    const qualityPercentage = qualityScore ? Math.round((qualityScore / 6) * 100) : 0;
    const clampeQualityPercentage = Math.min(Math.max(qualityPercentage, 0), 100);

    const imageName = moduleData.module_image?.trim();
    const IconComponent = imageName ? iconeAddCatalogue[imageName] : null;
    console.log("imageName:", imageName);
    console.log("IconComponent:", IconComponent);
    console.log(module);



    const statusColors = {
        online: 'bg-slate-100 text-gray-500 ',   // couleur spéciale si on vient de "Disponible"
        offline: 'bg-slate-100 text-gray-500 ',  // couleur spéciale si on vient de "Préparation"
        trash: 'bg-slate-100 text-gray-500 '     // couleur spéciale si on vient de "Corbeille"
    };



    return (
        <>
            <div className="flex flex-col w-full mt-8 sm:mt-20">

                <div className="container flex flex-col  gap-4 mx-auto">

                    {/* Qualité - Responsive */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl  p-6 border border-gray-200">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Bouton retour */}
                            <button
                                onClick={() => navigate(-1)}
                                className="text-gray-600 hover:text-gray-900 transition-colors self-start lg:self-center"
                            >
                                <icons.back className="w-6 h-6" />
                            </button>

                            <div className="flex-1 space-y-6 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
                                {/* Section Quality */}
                                <div className="space-y-2">
                                    <p className="text-sm  text-gray-600 uppercase tracking-wide">Quality</p>
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-48 h-2 bg-gray-300 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${clampeQualityPercentage < 30
                                                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                                                    : clampeQualityPercentage < 70
                                                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                                        : 'bg-gradient-to-r from-green-400 to-green-500'
                                                    }`}
                                                style={{ width: `${clampeQualityPercentage}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-lg  ${clampeQualityPercentage < 30
                                            ? 'text-red-600'
                                            : clampeQualityPercentage < 70
                                                ? 'text-yellow-600'
                                                : 'text-green-600'
                                            }`}>
                                            {clampeQualityPercentage}%
                                        </span>
                                    </div>
                                </div>

                                {/* Section Status */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {['online', 'offline', 'trash'].map((status) => {
                                        const isFromPage = fromStatus === status;
                                        const isActive = moduleData?.status === status;

                                        return (
                                            <button
                                                key={status}
                                                className={`px-6 py-2.5 rounded-lg  text-sm transition-all duration-200 transform hover:scale-105 shadow-md
                                ${isFromPage
                                                        ? statusColors[status]
                                                        : isActive
                                                            ? status === 'online'
                                                                ? 'bg-slate-100 text-gray-500 shadow-gray-200'
                                                                : status === 'offline'
                                                                    ? 'bg-slate-100 text-gray-500 shadow-gray-200'
                                                                    : 'bg-slate-100 text-gray-500 shadow-gray-200'
                                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                    }`}
                                                onClick={() => updateStatus(id, status, status)}
                                            >
                                                {status === 'online'
                                                    ? 'Disponible'
                                                    : status === 'offline'
                                                        ? 'En Préparation'
                                                        : 'Corbeille'}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nom et référence - Responsive */}
                    <div className="w-full  flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl  border border-gray-100 ">
                        {/* Icône à gauche */}
                        <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200">
                            {IconComponent && <IconComponent className="w-8 h-8 text-purple-500" />}
                        </div>

                        {/* Contenu texte à droite */}
                        <div className="flex flex-col w-full">
                            {/* Nom du module */}
                            <h2 className="text-base sm:text-lg  text-gray-800">
                                {moduleData.module_name}
                            </h2>

                            {/* Infos : Réf & Dossier */}
                            <div className="flex flex-wrap items-center gap-6 mt-1 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    <p>Réf :</p>{" "}
                                    <span className="px-2 py-1 bg-slate-200 rounded-md">
                                        {moduleData.module_reference}
                                    </span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <p>Domaine :</p>{" "}
                                    <span className="px-2 py-1 bg-slate-200 rounded-md">
                                        {moduleData.module_domain_name}
                                    </span>
                                </span>
                            </div>

                            <p className="text-sm text-gray-500 mt-2">
                                {moduleData.module_subtitle}
                            </p>

                            {/* Description */}
                            <p className="text-sm text-gray-500 mt-2">
                                {moduleData.module_description}
                            </p>
                        </div>
                    </div>

                    {/* Contenu principal - Responsive */}
                    <div className="flex flex-col lg:flex-row gap-4 w-full">

                        {/* Colonne gauche */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-4">
                            {/* Formation de base */}

                            <div className="w-full p-3 bg-slate-100 rounded-xl shadow-sm">

                                <span className="mb-3">
                                    <input type="checkbox" id="drawer-toggle-edit-cours" className="relative hidden sr-only peer" />
                                    <div className="flex items-center justify-center duration-150 rounded-full w-max">
                                        <button
                                            className="flex items-center gap-1 text-[12px]   text-center text-gray-500 px-5 py-2 underline" onClick={() => setIsFormationBase(true)}
                                        >
                                            <Pencil className="text-blue-500 w-4 h-4" />
                                            Modifier les formation de base
                                        </button>
                                    </div>
                                    <ModalFormation
                                        showFormation={isFormationBase}
                                        closeFormation={() => setIsFormationBase(false)}
                                        id={moduleData.id}
                                        moduleData={moduleData}
                                        onUpdate={fetchAllModuleData}
                                    />
                                </span>

                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Clock className="text-base text-gray-500 w-4 h-4" />
                                            </td>
                                            <td className="text-[12px] text-gray-700">
                                                {moduleData.dureeJ}jours ({moduleData.dureeH}h )
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Users className="text-base text-gray-500 w-4 h-4" />
                                            </td>
                                            <td className="text-[12px] text-gray-700">
                                                {moduleData.minApprenant} à {moduleData.maxApprenant} apprenants
                                            </td>

                                        </tr>
                                        <tr>
                                            <td>
                                                <Medal className="text-base text-gray-700 w-4 h-4" />
                                            </td>
                                            <td className="text-[12px] text-gray-700">
                                                {moduleData.module_level_name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Info className="text-lg text-gray-700 w-4 h-4 " />
                                            </td>
                                            <td className="text-[12px] text-gray-700">
                                                {parseInt(moduleData.module_price)}Ar
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <p className="text-[12px] text-gray-400">Prix de formation pour une personne.</p>

                            </div>

                            {/* Section prerequis, matériels, public */}
                            <div className="w-full p-3 gap-2 rounded-xl bg-slate-100 ">

                                {/* Bloc Prérequis */}
                                <div className="flex flex-col gap-2 mb-6">

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2  ">
                                            <BookOpen className="text-gray-500 w-4 h-4" />
                                            <h5 className="text-base text-gray-500 ">Prérequis</h5>
                                        </div>
                                        <div
                                            className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-md cursor-pointer "
                                        >
                                            <icons.plus className="text-gray-500 text-sm" onClick={() => setIsPrerequis(!isPrerequis)} />
                                        </div>
                                    </div>

                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isPrerequis ? "max-h-40 opacity-100 py-3" : "max-h-0 opacity-0"}`}>

                                        <form onSubmit={(e) => handleAddPrerequis(e)} className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-sm text-gray-700"
                                                placeholder="Ajouter un prerequis"
                                                value={newPrerequis}
                                                onChange={(e) => setNewPrerequis(e.target.value)}
                                            />
                                            <button className="bg-slate-100  text-gray-500 p-2 rounded-md text-[12px] cursor-pointer" >
                                                <icons.plus />
                                            </button>
                                        </form>

                                    </div>

                                    <ul className="flex flex-col gap-2 mt-2 w-full">
                                        {prerequis.map((prerequi) => (
                                            <li
                                                key={prerequi.idPrerequis}
                                                className="flex flex-col bg-slate-200 px-3 py-2 rounded-md text-sm text-gray-800"
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    {editingPrerequisId === prerequi.idPrerequis ? (
                                                        // Input inline pour la modification
                                                        <div className="flex gap-2 w-full">
                                                            <input
                                                                type="text"
                                                                value={editingPrerequisValue}
                                                                onChange={(e) => setEditingPrerequisValue(e.target.value)}
                                                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                                                            />
                                                            <button
                                                                className="text-green-600 px-2"
                                                                onClick={() => handleUpdatePrerequis(prerequi.idPrerequis)}
                                                            >
                                                                <Save className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="text-gray-500 px-2"
                                                                onClick={() => setEditingPrerequisId(null)}
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        // Texte normal avec boutons
                                                        <>
                                                            <span>{prerequi.prerequis_name}</span>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    className="text-gray-500 transition p-1"
                                                                    onClick={() => {
                                                                        setEditingPrerequisId(prerequi.idPrerequis);
                                                                        setEditingPrerequisValue(prerequi.prerequis_name); // pré-remplir l'input
                                                                    }}
                                                                >
                                                                    <Pencil className="w-4 h-4 text-blue-500" />
                                                                </button>
                                                                <button
                                                                    onClick={() => DeletePrerequis(prerequi.idPrerequis)}
                                                                    className=" transition p-1"
                                                                >
                                                                    <Trash className="w-4  h-4 text-red-500" />
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                </div>

                                {/* Bloc Matériels */}
                                <div className="flex flex-col gap-2 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 ">
                                            <PackageOpen className="text-gray-500 w-4 h-4" />
                                            <h5 className="text-base text-gray-500 ">Matériels utiles à la formation</h5>
                                        </div>
                                        <div
                                            className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-md cursor-pointer"
                                            onClick={() => setIsMateriel(!isMateriel)}
                                        >
                                            <icons.plus className="text-gray-500 text-sm" />
                                        </div>
                                    </div>

                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMateriel ? "max-h-40 opacity-100 py-3" : "max-h-0 opacity-0"}`}>
                                        <form onSubmit={handleAddMateriels} className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none  text-sm text-gray-700"
                                                placeholder="Ajouter un ou des matériel(s)"
                                                value={newPrestation}
                                                onChange={(e) => setNewPrestation(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                className="bg-slate-100 text-gray-500 p-2 rounded-md text-[12px] cursor-pointer"
                                            >
                                                <icons.plus />
                                            </button>
                                        </form>
                                    </div>

                                    <ul className="flex flex-col gap-2 mt-2 w-full">
                                        {prestation.map((p) => (
                                            <li
                                                key={p.idPrestation}
                                                className="flex flex-col bg-slate-200 px-3 py-2 rounded-md text-sm text-gray-800"
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    {editingPrestationId === p.idPrestation ? (
                                                        // Input inline pour modification
                                                        <div className="flex gap-2 w-full">
                                                            <input
                                                                type="text"
                                                                value={editingPrestationValue}
                                                                onChange={(e) => setEditingPrestationValue(e.target.value)}
                                                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                                                            />
                                                            <button
                                                                className="text-green-600 px-2"
                                                                onClick={() => handleUpdatePrestation(p.idPrestation)}
                                                            >
                                                                <Save className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="text-gray-500 px-2"
                                                                onClick={() => setEditingPrestationId(null)}
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        // Texte normal avec boutons
                                                        <>
                                                            <span>{p.prestation_name}</span>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    className="text-gray-500  transition p-1"
                                                                    onClick={() => {
                                                                        setEditingPrestationId(p.idPrestation);
                                                                        setEditingPrestationValue(p.prestation_name); // pré-remplir l'input
                                                                    }}
                                                                >
                                                                    <Pencil className="w-4 h-4 text-blue-500" />
                                                                </button>
                                                                <button
                                                                    onClick={() => DeletePrestation(p.idPrestation)}
                                                                    className=" transition p-1"
                                                                >
                                                                    <Trash className="w-4 h-4 text-red-500" />
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>


                                {/* Bloc Public concerné */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="text-gray-500 w-4 h-4" />
                                            <h5 className="text-base  text-gray-500">Public concerné</h5>
                                        </div>
                                        <div
                                            className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-md cursor-pointer"
                                            onClick={() => setIsPublic(!isPublic)}
                                        >
                                            <icons.plus className="text-gray-500 text-sm" />
                                        </div>
                                    </div>

                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isPublic ? "max-h-40 opacity-100 py-3" : "max-h-0 opacity-0"}`}>
                                        <form onSubmit={handleAddCible} className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none  text-sm text-gray-700"
                                                placeholder="Ajouter un ou des concerné(e)(s)"
                                                value={newCible}
                                                onChange={(e) => setNewCible(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                className="bg-slate-100  text-gray-500 p-2 rounded-md text-[12px] cursor-pointer"
                                            >
                                                <icons.plus />
                                            </button>
                                        </form>
                                    </div>

                                    <ul className="flex flex-col gap-2 mt-2 w-full">
                                        {cible.map((c) => (
                                            <li key={c.idCible} className="flex flex-col bg-slate-200 px-3 py-2 rounded-md text-sm text-gray-800">
                                                <div className="flex items-center justify-between w-full">
                                                    {editingCibleId === c.idCible ? (
                                                        // Input inline pour modification
                                                        <div className="flex gap-2 w-full">
                                                            <input
                                                                type="text"
                                                                value={editingCibleValue}
                                                                onChange={(e) => setEditingCibleValue(e.target.value)}
                                                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                                                            />
                                                            <button
                                                                className="text-green-600 px-2"
                                                                onClick={() => handleUpdateCible(c.idCible)}
                                                            >
                                                                <Save className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="text-gray-500 px-2"
                                                                onClick={() => setEditingCibleId(null)}
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        // Texte normal avec boutons
                                                        <>
                                                            <span>{c.cible}</span>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    className="text-gray-500 hover:text-[#9B599B] transition p-1"
                                                                    onClick={() => {
                                                                        setEditingCibleId(c.idCible);
                                                                        setEditingCibleValue(c.cible); // pré-remplir l'input
                                                                    }}
                                                                >
                                                                    <Pencil className="w-4 h-4 text-blue-500" />
                                                                </button>
                                                                <button
                                                                    onClick={() => DeleteCible(c.idCible)}
                                                                    className=" transition p-1"
                                                                >
                                                                    <Trash className="w-4  h-4 text-red-500" />
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>

                        </div>

                        {/* Colonne droite */}
                        <div className="w-full lg:w-2/3 flex flex-col gap-4">
                            {/* Objectifs */}
                            <div className="w-full p-3 bg-slate-100 rounded-lg">
                                <div className="flex flex-col gap-2">
                                    {/* Header */}
                                    <div className="inline-flex items-center justify-between">
                                        <div className="inline-flex items-center text-gray-500 gap-2">
                                            <icons.bullseye />
                                            <h5 className="text-xl ">Objectifs</h5>
                                        </div>
                                        <div
                                            className="flex items-center justify-center w-8 h-8 duration-300 bg-slate-100  rounded-md cursor-pointer transition"
                                        >
                                            <icons.plus className="text-gray-500 text-sm" onClick={() => setIsObjectif(!isObjectif)} />
                                        </div>
                                    </div>

                                    {/* Ajout d'objectif */}
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isObjectif ? "max-h-40 opacity-100 py-3" : "max-h-0 opacity-0"}`}>
                                        <form
                                            onSubmit={(e) => { handleAddObjectif(e) }}
                                            className="flex items-center gap-3"
                                        >
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-sm text-gray-700"
                                                placeholder="Ajouter un objectif"
                                                value={newObjectif}
                                                onChange={(e) => setNewObjectif(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddObjectif}
                                                className="bg-slate-100 text-gray-500 p-2 rounded-md text-[12px] cursor-pointer"
                                            >
                                                <icons.plus />
                                            </button>
                                        </form>
                                    </div>

                                    {/* Liste des objectifs */}
                                    <ul className="flex flex-col gap-2 mt-2 w-full">
                                        {objectifs.map((objectif) => (
                                            <li
                                                key={objectif.idObjectif}
                                                className="flex flex-col gap-2 bg-slate-200 px-3 py-2 rounded-md text-sm text-gray-800"
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    {editingObjectifId === objectif.idObjectif ? (
                                                        // Input de modification inline
                                                        <div className="flex gap-2 w-full">
                                                            <input
                                                                type="text"
                                                                value={editingObjectifValue}
                                                                onChange={(e) => setEditingObjectifValue(e.target.value)}
                                                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                                                            />
                                                            <button
                                                                className="text-green-600 px-2"
                                                                onClick={() => handleUpdateObjectif(objectif.idObjectif)}
                                                            >
                                                                <Save className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="text-gray-500 px-2"
                                                                onClick={() => setEditingObjectifId(null)}
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        // Texte normal avec boutons
                                                        <>
                                                            <span>{objectif.objectif}</span>
                                                            <div className="flex items-center space-x-1">
                                                                <button
                                                                    className="text-gray-500  transition p-1"
                                                                    onClick={() => {
                                                                        setEditingObjectifId(objectif.idObjectif);
                                                                        setEditingObjectifValue(objectif.objectif); // Pré-remplir l'input
                                                                    }}
                                                                >
                                                                    <Pencil className="w-4 h-4 text-blue-500" />
                                                                </button>
                                                                <button
                                                                    onClick={() => DeleteObjectif(objectif.idObjectif)}
                                                                    className=" transition p-1"
                                                                >
                                                                    <Trash className="w-4  h-4 text-red-500" />
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>


                                </div>
                            </div>

                            {/* Programme pédagogique */}
                            <div className="w-full p-3 bg-slate-100 rounded-xl">

                                {/* HEADER */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3 ">
                                        <icons.laptop className="text-xl text-gray-500" />
                                        <h5 className="text-lg  text-gray-500">Programme pédagogique</h5>
                                    </div>
                                    <button
                                        onClick={() => setIsFormVisible(!isFormVisible)}
                                        className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-md transition duration-300"
                                    >
                                        <icons.plus className="text-gray-500 text-sm" />
                                    </button>
                                </div>

                                {/* Formulaire d'ajout titre de programme */}
                                <div
                                    className={`overflow-hidden transition-all duration-500 ${isFormVisible
                                        ? "max-h-[300px] opacity-100 py-4"
                                        : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <form className="space-y-4 ml-6" onSubmit={handleAddProgramme}>
                                        <div>
                                            <label className="block text-sm  text-gray-600">
                                                Titre du programme
                                            </label>
                                            <input
                                                type="text"
                                                name="program_title"
                                                value={newProgramme.program_title}
                                                onChange={handleProgrammeInputChange}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg  focus:outline-none"
                                                placeholder="Ex: Introduction à React"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-slate-200 text-gray-500 rounded-md  text-sm"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "En cours..." : "Ajouter"}
                                        </button>
                                    </form>
                                </div>

                                {/* Liste des programmes */}
                                <div className="mt-6 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    {programmes?.length > 0 ? (
                                        programmes.map((programme) => (
                                            <div key={programme.idProgramme} className=" rounded-lg  p-4 border-gray-200 border-2">
                                                {/* En-tête programme */}
                                                <div className="flex justify-between items-center">
                                                    <div className="flex gap-2">
                                                        {editingTitreId === programme.idProgramme ? (
                                                            <>
                                                                {/* Input pour édition inline */}
                                                                <input
                                                                    type="text"
                                                                    value={editingTitreValue}
                                                                    onChange={(e) => setEditingTitreValue(e.target.value)}
                                                                    className="w-full px-2 py-1 border rounded-md focus:outline-none "
                                                                />
                                                                <button
                                                                    className="text-green-600 px-2"
                                                                    onClick={() => {
                                                                        setActiveProgrammeId(programme.idProgramme);
                                                                        handleUpdateTitreInline(programme.idProgramme);
                                                                    }}
                                                                >
                                                                    <Save className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    className="text-gray-500 px-2"
                                                                    onClick={() => setEditingTitreId(null)}
                                                                >
                                                                    <RotateCcw className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {/* Affichage normal */}
                                                                <h2 className=" text-gray-800">
                                                                    {programme.program_title}
                                                                </h2>
                                                                <button
                                                                    className="text-gray-500 text-sm"
                                                                    onClick={() => {
                                                                        setEditingTitreId(programme.idProgramme);
                                                                        setEditingTitreValue(programme.program_title);
                                                                    }}
                                                                >
                                                                    <Pencil className="w-4 h-4 text-blue-500" />
                                                                </button>
                                                                <button
                                                                    className="text-sm"
                                                                    onClick={() => DeleteProgrammeTitre(programme.idProgramme)}
                                                                >
                                                                    <Trash className="w-4  h-4 text-red-500" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                    <button
                                                        className="px-2 py-1 bg-slate-200 rounded-md"
                                                        onClick={() =>
                                                            setActiveModuleForm(
                                                                activeModuleForm === programme.idProgramme
                                                                    ? null
                                                                    : programme.idProgramme
                                                            )
                                                        }
                                                    >
                                                        <icons.plus className="text-gray-500 w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Formulaire ajout contenu */}
                                                {activeModuleForm === programme.idProgramme && (
                                                    <form
                                                        onSubmit={(e) => handleAddProgrammeModule(e, programme.idProgramme)}
                                                        className="mt-3"
                                                    >
                                                        <input
                                                            type="text"
                                                            name="content_description"
                                                            value={newModuleProgramme.content_description || ''}
                                                            onChange={handleAddprogrammeModuleInputChange}
                                                            className="w-full px-3 py-2 border rounded-lg"
                                                            placeholder="Titre du contenu"
                                                            required
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="mt-2 px-4 py-2 bg-slate-200 text-gray-500 rounded-md"
                                                        >
                                                            Ajouter
                                                        </button>
                                                    </form>
                                                )}

                                                {/* Liste des contenus */}
                                                <div className="mt-3">
                                                    {programme.contents && programme.contents.length > 0 ? (
                                                        programme.contents.map((content) => (
                                                            <div
                                                                key={content.id}
                                                                className="bg-slate-200 rounded p-2 mt-1 flex items-center gap-2"
                                                            >
                                                                {editingContentId === content.id ? (
                                                                    <>
                                                                        {/* Input pour édition inline */}
                                                                        <input
                                                                            type="text"
                                                                            value={editingContentValue}
                                                                            onChange={(e) => setEditingContentValue(e.target.value)}
                                                                            className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                                                                        />
                                                                        <button
                                                                            className="text-green-600 px-2"
                                                                            onClick={() => {
                                                                                setActiveProgrammeId(programme.idProgramme);
                                                                                handleUpdateContentInline(content.id);
                                                                            }}
                                                                        >
                                                                            <Save className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            className="text-gray-500 px-2"
                                                                            onClick={() => setEditingContentId(null)}
                                                                        >
                                                                            <RotateCcw className="w-4 h-4" />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {/* Affichage normal */}
                                                                        <h3 className="text-sm  flex-1">{content.description}</h3>
                                                                        <button
                                                                            className="text-gray-500 text-sm"
                                                                            onClick={() => {
                                                                                setEditingContentId(content.id);
                                                                                setEditingContentValue(content.description);
                                                                                setActiveProgrammeId(programme.idProgramme);
                                                                            }}
                                                                        >
                                                                            <Pencil className="w-4 h-4 text-blue-500" />
                                                                        </button>
                                                                        <button
                                                                            className="text-sm "
                                                                            onClick={() =>
                                                                                handleDeleteContent(programme.idProgramme, content.id)
                                                                            }
                                                                        >
                                                                            <Trash className="w-4  h-4 text-red-500" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-400 italic">Aucun contenu ajouté</p>
                                                    )}
                                                </div>

                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-4 text-gray-500">
                                            Aucun programme disponible pour ce module
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Ressources */}
                            <div className="w-full p-3 bg-slate-100 rounded-xl group/right2  gap-3 mt-3">
                                <div className="inline-flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Bookmark className="w-4 h-4" />
                                        <h5 className="text-md ">Vos ressources</h5>
                                    </div>
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 text-gray-500 duration-200 bg-transparent text-md "
                                        data-bs-toggle="modal" data-bs-target="#supportLg"
                                        onClick={() => setIsRessource(true)}
                                    >
                                        <Upload className="w-4 h-4" />
                                        Importer vos ressources
                                    </button>
                                    <div className="modal fade support" id="supportLg" data-bs-backdrop="static"
                                        data-bs-keyboard="false" tabindex="-1">
                                    </div>
                                </div>

                                {/* Affichage fichier importer */}
                                <div className="w-full mt-6 overflow-x-auto">
                                    <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                                        <table className="min-w-full leading-normal">
                                            <thead>
                                                <tr className="bg-slate-100 text-gray-500 text-left border-collapse">
                                                    <th className="px-6 py-3 text-sm ">Nom</th>
                                                    <th className="px-6 py-3 text-sm ">Type</th>
                                                    <th className="px-6 py-3 text-sm ">Taille</th>
                                                    <th className="px-2 py-3 text-sm ">Actions</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {uploadedFiles.map((fichier, index) => (
                                                    <tr key={`${fichier.idModuleRessource}-${index}`} className="bg-white border-b hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 text-gray-800">{fichier.module_ressource_name}</td>
                                                        <td className="px-6 py-4 text-gray-800">{fichier.module_ressource_extension}</td>
                                                        <td className="px-6 py-4 text-gray-800">{fichier.taille} Mo</td>
                                                        <td className="px-2">
                                                            <div className="flex gap-6">
                                                                <button
                                                                    onClick={() => handDownloadRessource(fichier.idModuleRessource, fichier.module_ressource_name)}
                                                                    className="flex items-center text-blue-600 hover:underline"
                                                                    title="Télécharger le fichier"
                                                                >
                                                                    <icons.download className="mr-1  w-4 h-4 text-blue-500" />

                                                                </button>
                                                                <button
                                                                    className="flex items-center text-gray-500 "
                                                                    onClick={() => handleDeleteRessource(fichier.idModuleRessource, fichier.module_ressource_name)}
                                                                    title="Supprimer le fichier"
                                                                >
                                                                    <Trash className="mr-1 w-4 h-4 text-red-500" />

                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </table>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 text-center">Taille maximale autorisée : 10MB</p>

                            </div>

                            {/* Modal importé des fichier */}
                            {isRessource && (
                                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center">
                                    <div className="bg-white shadow-2xl rounded-2xl w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-hidden" data-aos="fade-down" data-aos-delay="300">
                                        {/* Header */}
                                        <div className="flex items-center justify-between px-5 py-3 bg-[#5B345B] border-b">
                                            <p className="text-lg  text-white text-center">Veuillez Selectionner votre Fichier à importer</p>
                                        </div>
                                        {/* Body */}
                                        <div className="p-6 space-y-4 flex flex-col items-center text-center">
                                            {/* Icône dynamique */}
                                            <HiOutlineDocument
                                                className={`w-16 h-16 ${file ? "text-[#5B345B]" : "text-gray-400"
                                                    } transition duration-300`}
                                            />

                                            {/* Input */}
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileChange}
                                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file: file:bg-[#5B345B] file:text-white hover:file:bg-[#472947]"
                                            />

                                            {/* Texte état */}
                                            <p className="text-sm text-gray-700">
                                                {file && file.length > 0
                                                    ? `Fichier(s) sélectionné(s) : ${file.map(f => f.name).join(', ')}`
                                                    : "Aucun fichier sélectionné"}
                                            </p>


                                            <p className="text-xs text-gray-500">Taille de fichier maximum : 10MB</p>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex justify-end gap-3 px-6 py-4 border-t">
                                            <button
                                                onClick={() => setIsRessource(false)}
                                                className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="px-4 py-2 rounded-md bg-[#5B345B] text-white hover:bg-[#472947] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={handleSubmit}
                                            >
                                                Importer
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>
        </>

    );
}