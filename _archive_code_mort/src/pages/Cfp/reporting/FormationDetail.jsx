import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "../../../config/axios";
import { useParams, useNavigate } from "react-router-dom";
import DownloadProgramButton from "./DownloadProgramButton";

import {
    Medal,
    DollarSign,
    Clock,
    User,
    ChevronDown,
    ChevronUp,
    Star,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Users,
    Target,
    BookOpen,
    Building,
    Globe,
    CheckCircle,
    Loader2,
    AlertCircle,
    Info
} from "lucide-react";

const IMAGE_BASE_URL = "https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/";
const MODULE_IMAGE_PATH = "modules/";
const ENTREPRISE_IMAGE_PATH = "entreprises/";

const formatMontant = (amount, currencyCode = "MGA") => {
    if (typeof amount !== "number" && typeof amount !== "string") {
        return "N/A";
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
        return "N/A";
    }

    try {
        return new Intl.NumberFormat("fr-MG", {
            style: "currency",
            currency: currencyCode,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(numericAmount);
    } catch (error) {
        return `${numericAmount.toLocaleString("fr-MG")} Ariary`;
    }
};

const StarRating = ({ average, size = 20 }) => {
    const safeAverage = typeof average === "number" && !isNaN(average) ? average : 0;

    return (
        <div className="flex items-center gap-1" title={`Note: ${safeAverage.toFixed(1)}/5`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    className={`${star <= safeAverage
                            ? "fill-yellow-400 text-yellow-400"
                            : star <= Math.ceil(safeAverage)
                                ? "fill-yellow-200 text-yellow-400"
                                : "fill-gray-200 text-gray-300"
                        } transition-colors duration-200`}
                />
            ))}
        </div>
    );
};

const SuggestedFormationCard = ({ formation, currency = "XOF" }) => {
    const {
        idModule,
        module_image,
        logo_cfp,
        module_name,
        description,
        dureeJ,
        dureeH,
        module_level_name,
        prix,
        note = {},
    } = formation;

    const imageUrl = module_image
        ? `${IMAGE_BASE_URL}${MODULE_IMAGE_PATH}${module_image}`
        : "";
    const logoUrl = logo_cfp
        ? `${IMAGE_BASE_URL}${ENTREPRISE_IMAGE_PATH}${logo_cfp}`
        : "";

    return (
        <div className="group bg-white w-80 flex-shrink-0 h-96 overflow-hidden rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-purple-200">
            <a
                href={`/formation/detail/${idModule}`}
                className="hover:text-inherit h-full flex flex-col"
            >
                <div className="h-48 relative bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={module_name || "Image de formation"}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/600x400/F3E8FF/4A5568?text=Image+non+disponible";
                            }}
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                            <BookOpen size={48} className="text-purple-400" />
                        </div>
                    )}

                    {/* Logo overlay */}
                    <div className="absolute top-3 left-3 w-16 h-8 bg-white/95 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm flex items-center justify-center overflow-hidden">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt="Logo entreprise"
                                className="w-full h-full object-contain p-1"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/80x40/E2E8F0/718096?text=Logo";
                                }}
                            />
                        ) : (
                            <Building size={16} className="text-gray-400" />
                        )}
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
                        {module_name || "Nom de formation inconnu"}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                        {description || "Aucune description disponible"}
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock size={16} className="text-purple-600" />
                                <span>{dureeJ || 0}j | {dureeH || 0}h</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Medal size={16} className="text-purple-600" />
                                <span>{module_level_name || "N/A"}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DollarSign size={16} className="text-green-600" />
                                <span className="font-semibold text-gray-900">
                                    {formatMontant(prix, currency)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <StarRating average={note.average || 0} size={16} />
                                <span className="text-sm text-gray-600">
                                    {note.average ? note.average.toFixed(1) : "0.0"}
                                    <span className="text-gray-400 text-xs ml-1">
                                        ({note.totalEmployees || 0})
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
};

const FormationDetail = () => {
    const { idModule, idProjet } = useParams();
    const navigate = useNavigate();
    const [formationData, setFormationData] = useState(null);
    const [showObjectives, setShowObjectives] = useState(false);
    const [showPrograms, setShowPrograms] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const scrollContainerRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const { currencyUnit } = useAuth();
    const currency = currencyUnit || "XOF";

    useEffect(() => {
        const fetchFormationData = async () => {
            if (!idModule || !idProjet) {
                setError("IDs de module ou de projet manquants dans l'URL.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(
                    `/cfp/reporting/formation_inter/detail/${idModule}/${idProjet}`
                );

                if (!response.data) {
                    throw new Error("Aucune donnée reçue de l'API");
                }

                const processedData = {
                    ...response.data,
                    module: {
                        ...response.data.module,
                        module_image: response.data.module?.module_image
                            ? `${IMAGE_BASE_URL}${MODULE_IMAGE_PATH}${response.data.module.module_image}`
                            : null,
                    },
                    cfp: {
                        ...response.data.cfp,
                        logo: response.data.cfp?.logo
                            ? `${IMAGE_BASE_URL}${ENTREPRISE_IMAGE_PATH}${response.data.cfp.logo}`
                            : null,
                    },
                    onlineModules: response.data.onlineModules?.map((domain) => ({
                        ...domain,
                        modules: domain.modules?.map((mod) => ({
                            ...mod,
                            module_image: mod.module_image
                                ? `${IMAGE_BASE_URL}${MODULE_IMAGE_PATH}${mod.module_image}`
                                : null,
                            logo_cfp: mod.logo_cfp
                                ? `${IMAGE_BASE_URL}${ENTREPRISE_IMAGE_PATH}${mod.logo_cfp}`
                                : null,
                        })),
                    })),
                };

                setFormationData(processedData);
            } catch (err) {
                console.error("❌ Erreur API:", err);

                if (err.response?.status === 404) {
                    setError("La formation demandée n'a pas été trouvée.");
                } else if (err.response?.status === 500) {
                    setError("Erreur serveur. Veuillez réessayer plus tard.");
                } else {
                    setError("Impossible de charger les détails de la formation.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFormationData();
    }, [idModule, idProjet]);

    // Auto-scroll logic
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer || !formationData) return;

        let autoScrollInterval;

        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                if (!isPaused && scrollContainer) {
                    const cardWidth = 320;
                    const scrollAmount = cardWidth;

                    const currentScroll = scrollContainer.scrollLeft;
                    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

                    let nextScrollPosition = currentScroll + scrollAmount;

                    if (nextScrollPosition >= maxScroll - scrollAmount / 2) {
                        nextScrollPosition = 0;
                    }

                    scrollContainer.scrollTo({
                        left: nextScrollPosition,
                        behavior: "smooth",
                    });
                }
            }, 5000);
        };

        const stopAutoScroll = () => {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
            }
        };

        stopAutoScroll();
        startAutoScroll();

        const handleMouseEnter = () => setIsPaused(true);
        const handleMouseLeave = () => setIsPaused(false);

        scrollContainer.addEventListener("mouseenter", handleMouseEnter);
        scrollContainer.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            stopAutoScroll();
            if (scrollContainer) {
                scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
                scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
            }
        };
    }, [isPaused, formationData]);

    // Scroll position logic
    useEffect(() => {
        const checkScrollPosition = () => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                setShowLeftArrow(scrollLeft > 0);
                setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", checkScrollPosition);
            checkScrollPosition();
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", checkScrollPosition);
            }
        };
    }, [formationData]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const cardWidth = 320;
            const scrollAmount = cardWidth;
            const currentScroll = scrollContainerRef.current.scrollLeft;

            scrollContainerRef.current.scrollTo({
                left: direction === "left"
                    ? Math.max(0, currentScroll - scrollAmount)
                    : currentScroll + scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const handleRetry = () => {
        setLoading(true);
        setError(null);
        setFormationData(null);
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={64} className="animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-xl text-gray-700 font-medium">Chargement des détails de la formation...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-red-100">
                    <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur !</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleRetry}
                            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
                        >
                            <Loader2 size={20} className="animate-spin" />
                            Réessayer
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!formationData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-purple-100">
                    <Info size={64} className="text-purple-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Information</h2>
                    <p className="text-gray-600 mb-6">Aucune donnée disponible pour cette formation.</p>
                    <button
                        onClick={handleRetry}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    const {
        module,
        cfp,
        cibles,
        prerequis,
        objectifs,
        prog,
        note,
        onlineModules,
    } = formationData;

    const safeNote = note || { average: 0, totalEmployees: 0 };
    const safeModule = module || {};
    const safeCfp = cfp || {};

    const suggestedModules = (onlineModules || [])
        .flatMap((domain) => domain.modules || [])
        .filter((mod) => mod.idModule !== parseInt(idModule));

    const infoCards = [
        {
            icon: Clock,
            label: "Durée",
            value: `${safeModule.dureeJ || 0} jours | ${safeModule.dureeH || 0} heures`,
            color: "purple"
        },
        {
            icon: Medal,
            label: "Niveau",
            value: safeModule.module_level_name || "Non spécifié",
            color: "blue"
        },
        {
            icon: DollarSign,
            label: "Prix",
            value: formatMontant(safeModule.prix, currency),
            color: "green"
        },
        {
            icon: Users,
            label: "Participants",
            value: safeModule.maxApprenant === null ? "Illimité" : `Max ${safeModule.maxApprenant}`,
            color: "orange"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête de la formation */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-200 backdrop-blur-sm">
                    <div className="flex flex-col lg:flex-row">
                        {/* Image */}
                        <div className="lg:w-1/4 h-48 lg:h-auto relative">
                            {safeModule.module_image ? (
                                <img
                                    src={safeModule.module_image}
                                    alt={safeModule.moduleName || "Image de formation"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "https://placehold.co/400x300/F3E8FF/4A5568?text=Image+non+disponible";
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                                    <BookOpen size={40} className="text-purple-400" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Contenu */}
                        <div className="lg:w-3/4 p-4 lg:p-6 flex flex-col justify-center">
                            <div className="mb-4">
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-snug">
                                    {safeModule.moduleName || "Nom de module inconnu"}
                                </h1>
                                <p className="text-base text-gray-600 leading-relaxed">
                                    {safeModule.module_subtitle || "Pas de sous-titre disponible"}
                                </p>
                            </div>

                            {/* Note */}
                            <div className="flex items-center gap-2 mb-4">
                                <StarRating average={safeNote.average} size={18} />
                                <div>
                                    <span className="text-lg font-bold text-gray-900">
                                        {safeNote.average.toFixed(1)}
                                    </span>
                                    <span className="text-gray-500 ml-1 text-sm">
                                        ({safeNote.totalEmployees} avis)
                                    </span>
                                </div>
                            </div>

                            {/* Cartes d'information */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {infoCards.map((card, index) => {
                                    const Icon = card.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="bg-gradient-to-br from-white to-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-lg bg-${card.color}-100`}>
                                                    <Icon size={16} className={`text-${card.color}-600`} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">{card.label}</p>
                                                    <p className="font-semibold text-gray-900 text-sm">{card.value}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Contenu détaillé */}
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3 space-y-8">
                        {/* Public cible */}
                        {cibles && cibles.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <Users className="text-purple-600" size={28} />
                                    Public cible
                                </h2>
                                <div className="grid gap-3">
                                    {cibles.map((cible, index) => (
                                        <div key={index} className="flex items-start gap-3 text-gray-700">
                                            <CheckCircle size={20} className="text-green-500 mt-1 flex-shrink-0" />
                                            <p className="leading-relaxed">{cible}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Objectifs */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <Target className="text-purple-600" size={28} />
                                    Objectifs de la formation
                                </h2>
                                {objectifs && objectifs.length > 0 && (
                                    <button
                                        onClick={() => setShowObjectives(!showObjectives)}
                                        className="text-purple-600 hover:text-purple-800 transition-colors duration-200 flex items-center gap-2 font-medium"
                                    >
                                        {showObjectives ? (
                                            <>
                                                <ChevronUp size={20} />
                                                Réduire
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown size={20} />
                                                Voir plus
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                            <div className={`space-y-4 ${showObjectives ? "" : "max-h-96 overflow-hidden"}`}>
                                {objectifs && objectifs.length > 0 ? (
                                    objectifs.map((objectif, index) => (
                                        <div key={index} className="flex items-start gap-3 text-gray-700">
                                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <CheckCircle size={14} className="text-green-600" />
                                            </div>
                                            <p className="leading-relaxed">{objectif.objectif}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Aucun objectif renseigné.</p>
                                )}
                            </div>
                        </div>

                        {/* Programme détaillé */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <BookOpen className="text-purple-600" size={28} />
                                    Programme détaillé
                                </h2>
                                {prog && prog.length > 0 && (
                                    <button
                                        onClick={() => setShowPrograms(!showPrograms)}
                                        className="text-purple-600 hover:text-purple-800 transition-colors duration-200 flex items-center gap-2 font-medium"
                                    >
                                        {showPrograms ? (
                                            <>
                                                <ChevronUp size={20} />
                                                Réduire
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown size={20} />
                                                Voir plus
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                            <div className={`space-y-6 ${showPrograms ? "" : "max-h-96 overflow-hidden"}`}>
                                {prog && prog.length > 0 ? (
                                    prog.map((item, index) => (
                                        <div
                                            key={index}
                                            className="border-l-4 border-purple-500 pl-6 py-2 bg-gradient-to-r from-purple-50 to-transparent rounded-r-2xl"
                                        >
                                            <h3
                                                className="text-lg font-semibold text-gray-900 mb-2"
                                                dangerouslySetInnerHTML={{ __html: item.program_title }}
                                            />
                                            {item.program_description && (
                                                <div
                                                    className="text-gray-700 prose max-w-none"
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.program_description,
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Aucun programme renseigné.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3 space-y-8">
                        {/* Documentation */}
                        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-8 text-white shadow-xl">
                            <h2 className="text-2xl  mb-4 flex items-center gap-3">
                                <BookOpen size={28} />
                                Documentation
                            </h2>
                            <p className="text-purple-100 mb-6">
                                Téléchargez le programme complet de la formation
                            </p>
                            <DownloadProgramButton moduleId={idModule} variant="light" />
                        </div>

                        {/* Organisme de formation */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <Building className="text-purple-600" size={28} />
                                Organisme de formation
                            </h2>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    {safeCfp.logo ? (
                                        <img
                                            className="h-20 w-20 rounded-2xl object-cover border-2 border-gray-200 shadow-sm bg-white"
                                            src={safeCfp.logo}
                                            alt={`Logo ${safeCfp.customerName}`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://placehold.co/80x80/E2E8F0/718096?text=Logo";
                                            }}
                                        />
                                    ) : (
                                        <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                                            <Building size={32} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-gray-900 truncate">
                                        {safeCfp.customerName || "Nom du centre inconnu"}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                        {safeCfp.customer_slogan || "Slogan non disponible"}
                                    </p>
                                    {safeCfp.siteWeb && (
                                        <a
                                            href={
                                                safeCfp.siteWeb.startsWith("http")
                                                    ? safeCfp.siteWeb
                                                    : `https://${safeCfp.siteWeb}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 mt-3 text-purple-600 hover:text-purple-800 text-sm transition-colors duration-200"
                                        >
                                            <Globe size={16} />
                                            {safeCfp.siteWeb.replace(/^https?:\/\//, "")}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Formations suggérées */}
                        {suggestedModules && suggestedModules.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 relative">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <BookOpen className="text-purple-600" size={28} />
                                    Autres formations
                                </h2>

                                <div
                                    ref={scrollContainerRef}
                                    className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100"
                                    style={{ scrollBehavior: "smooth" }}
                                    onMouseEnter={() => setIsPaused(true)}
                                    onMouseLeave={() => setIsPaused(false)}
                                >
                                    {suggestedModules.map((mod) => (
                                        <SuggestedFormationCard
                                            key={mod.idModule}
                                            formation={mod}
                                            currency={currency}
                                        />
                                    ))}
                                </div>

                                {showLeftArrow && (
                                    <button
                                        onClick={() => scroll("left")}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-purple-50 transition-colors z-10 border border-gray-200"
                                    >
                                        <ChevronLeft size={20} className="text-purple-600" />
                                    </button>
                                )}

                                {showRightArrow && (
                                    <button
                                        onClick={() => scroll("right")}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-purple-50 transition-colors z-10 border border-gray-200"
                                    >
                                        <ChevronRight size={20} className="text-purple-600" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormationDetail;