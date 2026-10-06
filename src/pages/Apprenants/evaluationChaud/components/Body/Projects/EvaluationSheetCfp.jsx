import { useState, useEffect } from 'react';
import { X, Star, BarChart3, Award, Edit3, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import LoadingSpinner from '../LoadingSpinner';
import axios from '../../../../../../config/axios';

// Helper functions for styling (unchanged, they are correct)
const getRatingColor = (rating) => {
    const roundedRating = Math.floor(rating);
    if (roundedRating === 1) return 'text-yellow-800 bg-yellow-100 border-yellow-200';
    if (roundedRating === 2) return 'text-yellow-700 bg-yellow-200 border-yellow-300';
    if (roundedRating === 3) return 'text-amber-700 bg-amber-100 border-amber-200';
    if (roundedRating === 4) return 'text-green-600 bg-green-100 border-green-200';
    if (roundedRating === 5) return 'text-green-700 bg-green-200 border-green-300';
    return 'text-gray-700 bg-gray-100 border-gray-200';
};

const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-700 bg-green-100 border-green-200';
    if (score >= 4) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 3.5) return 'text-amber-600 bg-amber-100 border-amber-200';
    if (score >= 3) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    if (score >= 2) return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    return 'text-yellow-800 bg-yellow-100 border-yellow-200';
};

const getNoteText = (note) => {
    const roundedNote = Math.round(note);
    const noteTexts = {
        0: 'Non évalué',
        1: 'Insatisfaisant',
        2: 'Faible',
        3: 'Moyen',
        4: 'Bien',
        5: 'Excellent'
    };
    return noteTexts[roundedNote] || 'Non évalué';
};

const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => {
                if (index < fullStars) {
                    return <Star key={index} className="w-4 h-4 text-yellow-400 fill-yellow-400" />;
                } else if (index === fullStars && hasHalfStar) {
                    return (
                        <div key={index} className="relative">
                            <Star className="w-4 h-4 text-gray-300" />
                            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            </div>
                        </div>
                    );
                } else {
                    return <Star key={index} className="w-4 h-4 text-gray-300" />;
                }
            })}
            <span className="ml-1 text-sm font-medium text-gray-700">
                ({rating.toFixed(1)})
            </span>
        </div>
    );
};

// Main component
export function EvaluationSheetCfp({ idProject, idEmploye, project, onClose, onEdit, user }) {
    const [evaluationData, setEvaluationData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [error, setError] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        criteria: true,
        comments: true,
    });

    // We removed the formData state because it was not used and caused bugs.
    // The component is for displaying data, not for editing.

    useEffect(() => {
        // Logique de vérification des paramètres
        if (!idProject || !idEmploye) {
            console.error('❌ Missing required parameters: idProject or idEmploye');
            setError("Paramètres manquants pour charger l'évaluation.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        console.log(`📋 Chargement de l'évaluation pour idProject: ${idProject}, idEmploye: ${idEmploye}`);

        axios.get(`cfp/projet/evaluation/checkEval/${idProject}/${idEmploye}`)
            .then(res => {
                console.log("✅ Données d'évaluation reçues:", res.data);
                setEvaluationData(res.data);
            })
            .catch(err => {
                console.error('❌ API call failed:', err);
                setError("Impossible de charger l'évaluation. Veuillez réessayer.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [idProject, idEmploye]);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const calculateGlobalAverage = () => {
        if (!evaluationData?.notes || evaluationData.notes.length === 0) {
            console.log("📊 Aucune note disponible pour calculer la moyenne");
            return 0;
        }
        const validNotes = evaluationData.notes.filter(note => parseFloat(note.note) > 0);
        if (validNotes.length === 0) {
            console.log("📊 Aucune note valide pour calculer la moyenne");
            return 0;
        }

        const average = validNotes.reduce((sum, note) => sum + parseFloat(note.note), 0) / validNotes.length;
        console.log(`📊 Moyenne calculée: ${average} (sur ${validNotes.length} notes valides)`);
        return average;
    };

    const globalAverage = evaluationData ? calculateGlobalAverage() : 0;

    const generatePDF = () => {
        if (!evaluationData?.one) {
            setError("Aucune donnée d'évaluation disponible pour générer le PDF.");
            return;
        }

        setIsGeneratingPDF(true);
        try {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.setTextColor(75, 0, 130);
            doc.text("FICHE D'ÉVALUATION", 105, 20, { align: "center" });
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(`Projet: ${project?.module_name || 'Non spécifié'}`, 105, 30, { align: "center" });
            doc.text(`Évaluateur: ${user?.name || ''} ${user?.firstname || ''}`, 105, 36, { align: "center" });
            doc.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, 105, 42, { align: "center" });

            // Global Score based on criteria
            doc.setFontSize(16);
            doc.setTextColor(75, 0, 130);
            doc.text("SCORE GLOBAL (basé sur les critères)", 14, 60);
            doc.setFontSize(24);
            doc.setTextColor(0, 0, 0);
            doc.text(`${globalAverage.toFixed(1)}/5`, 14, 70);

            // Evaluation Criteria
            doc.setFontSize(16);
            doc.setTextColor(75, 0, 130);
            doc.text("CRITÈRES D'ÉVALUATION", 14, 90);

            const tableData = (evaluationData.questions || []).map((question, index) => {
                const note = (evaluationData.notes || []).find(n => n.idQuestion === question.idQuestion)?.note || 0;
                return [
                    index + 1,
                    question.question,
                    parseFloat(note).toFixed(1),
                    getNoteText(note)
                ];
            });

            autoTable(doc, {
                startY: 95,
                head: [["#", "Critère", "Note", "Appréciation"]],
                body: tableData,
                theme: "grid",
                headStyles: {
                    fillColor: [75, 0, 130],
                    textColor: 255,
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                },
                columnStyles: {
                    0: { cellWidth: 10 },
                    1: { cellWidth: 100 },
                    2: { cellWidth: 20 },
                    3: { cellWidth: 40 },
                },
            });

            const finalY = doc.lastAutoTable.finalY + 15;
            if (finalY < 250) {
                doc.setFontSize(16);
                doc.setTextColor(75, 0, 130);
                doc.text("COMMENTAIRES", 14, finalY);
                const comments = [
                    { title: "Points forts", content: evaluationData.one?.com1 || "Aucun commentaire" },
                    { title: "Points d'amélioration", content: evaluationData.one?.com2 || "Aucun commentaire" },
                    { title: "Témoignage", content: evaluationData.one?.temoignage || "Aucun témoignage" },
                ];
                let currentY = finalY + 10;
                comments.forEach((comment) => {
                    if (currentY < 280) {
                        doc.setFontSize(12);
                        doc.setTextColor(75, 0, 130);
                        doc.text(comment.title + ":", 14, currentY);
                        doc.setFontSize(10);
                        doc.setTextColor(0, 0, 0);
                        const splitText = doc.splitTextToSize(comment.content, 180);
                        doc.text(splitText, 20, currentY + 5);
                        currentY += splitText.length * 5 + 10;
                    }
                });
            }

            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Généré le ${new Date().toLocaleString("fr-FR")}`, 105, 280, { align: "center" });

            const fileName = `evaluation-projet-${project?.module_name}-employe-${idEmploye}.pdf`;
            doc.save(fileName);
        } catch (err) {
            console.error('Erreur lors de la génération du PDF:', err);
            setError("Impossible de générer le PDF. Veuillez réessayer.");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center">
                    <LoadingSpinner className="w-12 h-12 text-violet-600" />
                    <p className="text-gray-600 mt-4">Chargement de l'évaluation...</p>
                    <p className="text-gray-400 text-sm mt-2">Projet: {idProject}, Employé: {idEmploye}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-hidden">
                <div className="sticky top-0 z-10 bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Feuille d'évaluation</h2>
                                <p className="text-violet-100 text-sm">Projet: {evaluationData?.projet?.project_title}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={generatePDF}
                                disabled={isGeneratingPDF || !evaluationData?.one}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 group disabled:opacity-50"
                                title="Télécharger en PDF"
                            >
                                {isGeneratingPDF ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Download className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
                            >
                                <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {error && (
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                <p className="text-orange-700">{error}</p>
                            </div>
                        )}

                        {!evaluationData?.one ? (
                            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
                                <p className="text-gray-600 font-medium">Aucune évaluation trouvée pour ce projet.</p>
                                {user?.role === 'stagiaire' && (
                                    <button
                                        onClick={onEdit}
                                        className="mt-4 px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl flex items-center gap-2 transition-all duration-200 hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg mx-auto"
                                    >
                                        <Award className="w-4 h-4" />
                                        Faire l'évaluation
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Global Score Section */}
                                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl border border-violet-200 p-6 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-xl shadow">
                                            <Star className="w-8 h-8 text-yellow-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">Note moyenne globale</h3>
                                            <p className="text-gray-600 text-sm">
                                                Basé sur l'ensemble des critères d'évaluation.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {renderStars(globalAverage)}
                                        <div className={`p-4 rounded-full border-4 font-bold text-3xl flex items-center justify-center min-w-[100px] text-center ${getScoreColor(globalAverage)}`}>
                                            {globalAverage.toFixed(1)}/5
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        onClick={onEdit}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg flex items-center gap-2 transition-all duration-200 hover:bg-gray-300"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Modifier
                                    </button>
                                    <button
                                        onClick={generatePDF}
                                        className="px-4 py-2 bg-violet-600 text-white rounded-lg flex items-center gap-2 transition-all duration-200 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isGeneratingPDF}
                                    >
                                        {isGeneratingPDF ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                Génération...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4" />
                                                Exporter en PDF
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Evaluation Criteria Section */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleSection('criteria')}>
                                        <h3 className="text-lg font-semibold text-gray-800">Critères d'évaluation</h3>
                                        {expandedSections.criteria ? <ChevronUp /> : <ChevronDown />}
                                    </div>
                                    {expandedSections.criteria && (
                                        <div className="p-4 border-t border-gray-200 space-y-4">
                                            {(evaluationData.questions || []).map(q => {
                                                const note = (evaluationData.notes || []).find(n => n.idQuestion === q.idQuestion)?.note || 0;
                                                return (
                                                    <div key={q.idQuestion} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                        <p className="text-gray-700 font-medium">{q.question}</p>
                                                        <div className="flex items-center gap-3">
                                                            {renderStars(note)}
                                                            <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${getRatingColor(note)}`}>
                                                                {parseFloat(note).toFixed(1)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Comments Section */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleSection('comments')}>
                                        <h3 className="text-lg font-semibold text-gray-800">Commentaires</h3>
                                        {expandedSections.comments ? <ChevronUp /> : <ChevronDown />}
                                    </div>
                                    {expandedSections.comments && (
                                        <div className="p-4 border-t border-gray-200 space-y-4">
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="font-semibold text-gray-700">Points forts:</p>
                                                <p className="text-gray-600 mt-1">{evaluationData.one?.com1 || "Aucun commentaire."}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="font-semibold text-gray-700">Points à améliorer:</p>
                                                <p className="text-gray-600 mt-1">{evaluationData.one?.com2 || "Aucun commentaire."}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-3">
                                                <p className="font-semibold text-gray-700">Témoignage:</p>
                                                <p className="text-gray-600 mt-1">{evaluationData.one?.temoignage || "Aucun témoignage."}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}