import { useState, useEffect } from 'react';
import { X, Star, MessageSquare, BarChart3, User, Award, Edit3, ChevronDown, ChevronUp, Download } from 'lucide-react';
import axios from '../../../../../../config/axios';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import LoadingSpinner from '../LoadingSpinner';
// Couleur selon note entière
const getRatingColor = (rating) => {
    if (rating === 1) return 'text-yellow-800 bg-yellow-100 border-yellow-200';
    if (rating === 2) return 'text-yellow-700 bg-yellow-200 border-yellow-300';
    if (rating === 3) return 'text-amber-700 bg-amber-100 border-amber-200';
    if (rating === 4) return 'text-green-600 bg-green-100 border-green-200';
    if (rating === 5) return 'text-green-700 bg-green-200 border-green-300';
    return 'text-gray-700 bg-gray-100 border-gray-200';
};

// Couleur du score
const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-700 bg-green-100 border-green-200';
    if (score >= 4) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 3.5) return 'text-amber-600 bg-amber-100 border-amber-200';
    if (score >= 3) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    if (score >= 2) return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    return 'text-yellow-800 bg-yellow-100 border-yellow-200';
};

// Texte selon note
const getNoteText = (note) => {
    const noteTexts = {
        0: 'Non évalué',
        1: 'Insatisfaisant',
        2: 'Faible',
        3: 'Moyen',
        4: 'Bien',
        5: 'Excellent'
    };
    return noteTexts[Math.round(note)] || 'Non évalué';
};

// Distribution des notes
const RatingDistribution = ({ questionsWithNotes }) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    questionsWithNotes.forEach(q => {
        const roundedScore = Math.round(q.score);
        if (roundedScore >= 1 && roundedScore <= 5) {
            distribution[roundedScore]++;
        }
    });

    const maxCount = Math.max(...Object.values(distribution));

    return (
        <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-3">
                    <div className="w-8 text-right font-medium text-gray-600">{rating}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${rating === 5 ? 'bg-green-500' : rating === 4 ? 'bg-green-400' : rating === 3 ? 'bg-yellow-400' : rating === 2 ? 'bg-yellow-500' : 'bg-yellow-600'
                                }`}
                            style={{ width: maxCount > 0 ? `${(distribution[rating] / maxCount) * 100}%` : '0%' }}
                        />
                    </div>
                    <div className="w-8 text-left text-sm text-gray-500">{distribution[rating]}</div>
                </div>
            ))}
        </div>
    );
};

export function EvaluationSheet({ idProject, onClose, onEdit, user }) {
    const [evaluationData, setEvaluationData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [error, setError] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        criteria: true,
        comments: true,
        stats: true
    });

    // Charger les données
    useEffect(() => {
        const fetchEvaluationData = async () => {
            if (!idProject || !user?.id) return;
            try {
                setIsLoading(true);
                const response = await axios.get(`employe/projet/evaluation/checkEval/${idProject}/${user.id}`);
                setEvaluationData(response.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.error || 'Erreur de chargement');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvaluationData();
    }, [idProject, user]);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const generatePDF = () => {
        if (!evaluationData) return;

        try {
            setIsGeneratingPDF(true);

            const doc = new jsPDF();

            // En-tête du document
            doc.setFontSize(20);
            doc.setTextColor(75, 0, 130);
            doc.text("FICHE D'ÉVALUATION", 105, 20, { align: "center" });

            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(`Projet: ${idProject}`, 105, 30, { align: "center" });
            doc.text(
                `Évaluateur: ${user?.name} ${user?.firstname}`,
                105,
                36,
                { align: "center" }
            );
            doc.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, 105, 42, {
                align: "center",
            });

            // Préparer les données pour le tableau
            const questionsWithNotes = (evaluationData.questions || []).map((q) => {
                const noteData = (evaluationData.notes || []).find(
                    (n) => n.idQuestion === q.idQuestion
                );
                const score = noteData?.note || 0;
                return { ...q, score, rating: getNoteText(score) };
            });

            const validScores = questionsWithNotes.filter((q) => q.score > 0);
            const averageScore = validScores.length
                ? validScores.reduce((sum, q) => sum + q.score, 0) /
                validScores.length
                : 0;

            // Score global
            doc.setFontSize(16);
            doc.setTextColor(75, 0, 130);
            doc.text("SCORE GLOBAL", 14, 60);

            doc.setFontSize(24);
            doc.setTextColor(0, 0, 0);
            doc.text(`${averageScore.toFixed(1)}/5`, 14, 70);

            // Critères d'évaluation
            doc.setFontSize(16);
            doc.setTextColor(75, 0, 130);
            doc.text("CRITÈRES D'ÉVALUATION", 14, 90);

            const tableData = questionsWithNotes.map((criterion, index) => [
                index + 1,
                criterion.question,
                criterion.score.toString(),
                criterion.rating,
            ]);

            // Table avec autoTable
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

            // Commentaires
            const finalY = doc.lastAutoTable.finalY + 15;
            if (finalY < 250) {
                doc.setFontSize(16);
                doc.setTextColor(75, 0, 130);
                doc.text("COMMENTAIRES", 14, finalY);

                const comments = [
                    {
                        title: "Points forts",
                        content: evaluationData.one?.com1 || "Aucun commentaire",
                    },
                    {
                        title: "Points d'amélioration",
                        content: evaluationData.one?.com2 || "Aucun commentaire",
                    },
                    {
                        title: "Témoignage",
                        content: evaluationData.one?.temoignage || "Aucun témoignage",
                    },
                ];

                let currentY = finalY + 10;

                comments.forEach((comment) => {
                    if (currentY < 280) {
                        doc.setFontSize(12);
                        doc.setTextColor(75, 0, 130);
                        doc.text(comment.title + ":", 14, currentY);

                        doc.setFontSize(10);
                        doc.setTextColor(0, 0, 0);

                        // Gestion du texte multiligne
                        const splitText = doc.splitTextToSize(comment.content, 180);
                        doc.text(splitText, 20, currentY + 5);

                        currentY += splitText.length * 5 + 10;
                    }
                });
            }

            // Pied de page
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                `Généré le ${new Date().toLocaleString("fr-FR")}`,
                105,
                280,
                { align: "center" }
            );

            // Sauvegarde du PDF
            doc.save(
                `evaluation-projet-${idProject}-${user?.name}-${user?.firstname}.pdf`
            );
        } catch (error) {
            console.error("Erreur lors de la génération du PDF:", error);
            setError("Erreur lors du téléchargement du PDF");
        } finally {
            setIsGeneratingPDF(false);
        }
    };




    if (isLoading) return <LoadingSpinner message="Chargement de l'évaluation..." />;
    if (error) return <ErrorModal message={error} onClose={onClose} />;
    if (!evaluationData) return <ErrorModal message="Aucune donnée d'évaluation disponible" onClose={onClose} />;

    // Préparer questions avec notes pour l'affichage
    const questionsWithNotes = (evaluationData.questions || []).map(q => {
        const noteData = (evaluationData.notes || []).find(n => n.idQuestion === q.idQuestion);
        const score = noteData?.note || 0;
        return { ...q, score, rating: getNoteText(score) };
    });

    const validScores = questionsWithNotes.filter(q => q.score > 0);
    const averageScore = validScores.length ? validScores.reduce((sum, q) => sum + q.score, 0) / validScores.length : 0;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 shadow-lg flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-6 h-6 text-white" />
                        <div>
                            <h2 className="text-xl font-bold text-white">Fiche d'évaluation</h2>
                            <p className="text-violet-100 text-sm">Projet: {evaluationData?.projet?.project_title}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={generatePDF}
                            disabled={isGeneratingPDF || evaluationData.checkEval === 0}
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

                <div className="h-[calc(100vh-80px)] overflow-y-auto p-6 space-y-6">
                    {/* User Info */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{user?.name} {user?.firstname}</p>
                                <p className="text-gray-600 text-sm">Évaluateur</p>
                            </div>
                        </div>
                        {evaluationData.checkEval === 1 && (
                            <button onClick={() => onEdit(evaluationData)} className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl flex items-center gap-2">
                                <Edit3 className="w-4 h-4" /> Modifier
                            </button>
                        )}
                    </div>

                    {/* Évaluation non complétée */}
                    {evaluationData.checkEval === 0 && (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"><Star className="w-6 h-6 text-yellow-600" /></div>
                                <div>
                                    <h3 className="font-semibold text-yellow-800">Évaluation en attente</h3>
                                    <p className="text-yellow-600">Cette évaluation n'a pas encore été complétée.</p>
                                </div>
                            </div>
                            <button onClick={() => onEdit(evaluationData)} className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl">Commencer l'évaluation</button>
                        </div>
                    )}

                    {/* Évaluation complétée */}
                    {evaluationData.checkEval === 1 && (
                        <>
                            {/* Score global */}
                            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200 p-6 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                                        <Award className="w-6 h-6 text-violet-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Score global</h3>
                                        <p className="text-gray-600">Performance moyenne</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-violet-600">{averageScore.toFixed(1)}<span className="text-lg text-gray-500">/5</span></div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} className={`w-4 h-4 ${star <= Math.round(averageScore) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Critères d'évaluation */}
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <button onClick={() => toggleSection('criteria')} className="w-full bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-3">
                                        <Award className="w-5 h-5 text-violet-600" /> Critères d'évaluation ({questionsWithNotes.length})
                                    </h3>
                                    {expandedSections.criteria ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                </button>
                                {expandedSections.criteria && (
                                    <div className="p-6 space-y-4">
                                        {questionsWithNotes.map((criterion, index) => (
                                            <div key={criterion.idQuestion || index} className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100">
                                                <div className="col-span-8"><p className="text-gray-700 font-medium">{criterion.question}</p></div>
                                                <div className="col-span-2 flex justify-center">
                                                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${getScoreColor(criterion.score)}`}>{criterion.score}</span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRatingColor(criterion.score)}`}>{criterion.rating}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Distribution */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="font-semibold text-gray-800 mb-4">Distribution des notes</h3>
                                <RatingDistribution questionsWithNotes={questionsWithNotes} />
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => toggleSection('comments')}
                                    className="w-full bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between hover:bg-violet-100 transition-colors duration-200"
                                >
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-3">
                                        <MessageSquare className="w-5 h-5 text-violet-600" />
                                        Commentaires
                                    </h3>
                                    {expandedSections.comments ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>

                                {expandedSections.comments && (
                                    <div className="p-6 space-y-6">
                                        {[
                                            {
                                                question: "Points forts",
                                                answer: evaluationData.one?.com1 || "Aucun commentaire",
                                                icon: '👍'
                                            },
                                            {
                                                question: "Points d'amélioration",
                                                answer: evaluationData.one?.com2 || "Aucun commentaire",
                                                icon: '📝'
                                            },
                                            {
                                                question: "Témoignage",
                                                answer: evaluationData.one?.temoignage || "Aucun témoignage",
                                                icon: '💬'
                                            }
                                        ].map((comment, index) => (
                                            <div key={index} className="border-l-4 border-violet-300 pl-4">
                                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                                    <span className="text-xl">{comment.icon}</span>
                                                    {comment.question}
                                                </h4>
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <p className="text-gray-600 leading-relaxed">
                                                        {comment.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// // Composants modals réutilisables
// const LoadingModal = ({ message }) => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//         <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
//             <p className="text-gray-600">{message}</p>
//         </div>
//     </div>
// );

const ErrorModal = ({ message, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-red-600 font-semibold mb-4">{message}</p>
            <button onClick={onClose} className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors">Fermer</button>
        </div>
    </div>
);