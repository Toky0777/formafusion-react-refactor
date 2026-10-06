import { useState, useEffect } from 'react';
import { X, Star, MessageSquare, BarChart3, Send, ArrowLeft, HelpCircle } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';
import axios from '../../../../../../config/axios';

const EvaluationForm = ({ user, onClose, evaluation, evaluationData, isLoading, isEditing = false, onSuccess, onBack }) => {
    const [formData, setFormData] = useState({
        idProjet: evaluation?.idProjet || '',
        idEmploye: user?.id || '',
        generalApreciate: 5,
        eval_note: {},
        idValComment: evaluationData?.one?.idValComment || '',
        com1: evaluationData?.one?.com1 || '',
        com2: evaluationData?.one?.com2 || '',
        temoignage: evaluationData?.one?.temoignage || '',
        idQuestion: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isLoading && evaluationData?.questions?.length > 0) {
            const initialQuestions = {};
            const questionIds = [];

            evaluationData.questions.forEach(question => {
                questionIds.push(question.idQuestion);

                if (isEditing && evaluationData.notes) {
                    const existingNote = evaluationData.notes.find(note => note.idQuestion === question.idQuestion);
                    initialQuestions[question.idQuestion] = existingNote?.note ?? 5;
                } else {
                    initialQuestions[question.idQuestion] = 5;
                }
            });

            setFormData(prev => ({
                ...prev,
                idProjet: evaluation?.idProjet || prev.idProjet,
                eval_note: initialQuestions,
                idQuestion: questionIds,
                generalApreciate: isEditing ? evaluationData.one?.generalApreciate ?? 5 : 5,
                idValComment: isEditing ? evaluationData.one?.idValComment ?? '' : '',
                com1: isEditing ? evaluationData.one?.com1 ?? '' : '',
                com2: isEditing ? evaluationData.one?.com2 ?? '' : '',
                temoignage: isEditing ? evaluationData.one?.temoignage ?? '' : ''
            }));
        }
    }, [evaluation, evaluationData, isLoading, isEditing, user]);

    const handleRatingClick = (questionId, rating) => {
        setFormData(prev => ({
            ...prev,
            eval_note: {
                ...prev.eval_note,
                [questionId]: rating
            }
        }));
    };

    const handleGeneralRatingClick = (rating) => {
        setFormData(prev => ({ ...prev, generalApreciate: rating }));
    };

    const handleTextareaChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Préparer les données dans le format attendu par le backend
            const submitData = {
                idProjet: parseInt(formData.idProjet),
                idEmploye: parseInt(formData.idEmploye),
                idQuestion: formData.idQuestion,        // tableau d'IDs
                eval_note: Object.values(formData.eval_note), // notes correspondantes
                generalApreciate: parseInt(formData.generalApreciate),
                com1: formData.com1 || 'Pas de réponse',
                com2: formData.com2 || 'Pas de réponse',
                temoignage: formData.temoignage || 'Pas de commentaire', // important
                idValComment: formData.idValComment || 'Pas de réponse'
            };

            console.log('Données envoyées:', submitData);

            // Vérification des données requises
            if (!submitData.idValComment && isEditing) {
                throw new Error("Impossible de modifier: idValComment manquant");
            }

            if (isEditing) {
                await axios.patch(`employe/projet/evaluation/editEval`, submitData);
            } else {
                await axios.post(`employe/projet/evaluation/chaud`, submitData);
            }

            if (onSuccess) {
                onSuccess();
            } else {
                onClose();
            }

        } catch (err) {
            console.error('Erreur lors de la sauvegarde:', err);
            setError(err.response?.data?.error || err.message || 'Une erreur est survenue');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fonction pour obtenir la couleur progressive basée sur la note
    const getRatingColor = (rating, currentRating) => {
        if (rating <= currentRating) {
            // Palette de couleurs progressive sans rouge
            if (rating === 1) return 'bg-yellow-200 text-gray-800 shadow-sm hover:bg-yellow-300';
            if (rating === 2) return 'bg-yellow-300 text-gray-800 shadow-sm hover:bg-yellow-400';
            if (rating === 3) return 'bg-yellow-400 text-white shadow-sm hover:bg-yellow-500';
            if (rating === 4) return 'bg-green-400 text-white shadow-sm hover:bg-green-500';
            if (rating === 5) return 'bg-green-600 text-white shadow-sm hover:bg-green-700';
        }
        return 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600';
    };

    // Fonction pour obtenir la couleur de fond du badge de note
    const getBadgeColor = (rating) => {
        if (rating === 1) return 'bg-yellow-200 text-gray-800';
        if (rating === 2) return 'bg-yellow-300 text-gray-800';
        if (rating === 3) return 'bg-yellow-400 text-white';
        if (rating === 4) return 'bg-green-400 text-white';
        if (rating === 5) return 'bg-green-600 text-white';
        return 'bg-gray-200 text-gray-600';
    };

    const getRatingLabel = (rating) => {
        const labels = {
            1: 'Insatisfaisant',
            2: 'Faible',
            3: 'Moyen',
            4: 'Bien',
            5: 'Excellent'
        };
        return labels[rating] || '';
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-8 shadow-2xl">
                    <LoadingSpinner className="w-12 h-12 text-violet-600 mx-auto" />
                    <p className="text-gray-600 text-center mt-4">Chargement du formulaire...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />

            <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {isEditing && (
                                <button
                                    onClick={onBack}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
                                >
                                    <ArrowLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                                </button>
                            )}
                            <div className="p-2 bg-white/20 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {isEditing ? "Modifier l'évaluation" : "Évaluation à chaud"}
                                </h2>
                                <p className="text-violet-100 text-sm">Module(s): {evaluation?.module_name}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
                        >
                            <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Message d'erreur */}
                        {error && (
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                <p className="text-orange-700">{error}</p>
                            </div>
                        )}

                        {/* Section évaluation générale */}
                        <div className="bg-gradient-to-r from-yellow-50 to-green-50 rounded-2xl border border-yellow-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-xl">
                                        <Star className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Appréciation générale</h3>
                                        <p className="text-gray-600 text-sm">Note globale de la formation</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${getBadgeColor(formData.generalApreciate)} px-3 py-1 rounded-full`}>
                                        {formData.generalApreciate}/5
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {getRatingLabel(formData.generalApreciate)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => handleGeneralRatingClick(star)}
                                        className="relative group"
                                    >
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                                            ${star <= formData.generalApreciate ? getRatingColor(star, 5) : 'bg-gray-100 text-gray-400'}
                                        `}>
                                            <span className="font-bold text-sm">{star}</span>
                                        </div>
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black text-white text-xs px-2 py-1 rounded">
                                            {getRatingLabel(star)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sections de questions */}
                        {evaluationData?.typeQuestions?.map(typeQuestion => {
                            const relatedQuestions = evaluationData.questions.filter(q => q.idTypeQuestion === typeQuestion.idTypeQuestion);
                            return (
                                <div key={typeQuestion.idTypeQuestion} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-3 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            {typeQuestion.typeQuestion}
                                        </h3>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        {relatedQuestions.map(question => (
                                            <div key={question.idQuestion} className="space-y-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-gray-700 font-medium flex-1 pr-2">
                                                        {question.question}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-500">
                                                            {getRatingLabel(formData.eval_note[question.idQuestion])}
                                                        </span>
                                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getBadgeColor(formData.eval_note[question.idQuestion])}`}>
                                                            {formData.eval_note[question.idQuestion]}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {[1, 2, 3, 4, 5].map(rating => (
                                                        <button
                                                            type="button"
                                                            key={rating}
                                                            onClick={() => handleRatingClick(question.idQuestion, rating)}
                                                            className={`
                                                                w-8 h-8 rounded-full font-bold transition-all duration-200
                                                                flex items-center justify-center text-xs
                                                                ${getRatingColor(rating, formData.eval_note[question.idQuestion])}
                                                                hover:scale-105 transform
                                                            `}
                                                            title={getRatingLabel(rating)}
                                                        >
                                                            {rating}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Section commentaires */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-3 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-violet-600" />
                                    Commentaires et feedback
                                </h3>
                            </div>
                            <div className="p-4 space-y-4">
                                {[
                                    {
                                        id: 'com1',
                                        label: 'Points forts de la formation',
                                        placeholder: 'Quels aspects de la formation vous ont le plus marqué positivement ?',
                                        value: formData.com1
                                    },
                                    {
                                        id: 'com2',
                                        label: 'Points à améliorer',
                                        placeholder: 'Quels éléments pourraient être améliorés selon vous ?',
                                        value: formData.com2
                                    },
                                    {
                                        id: 'temoignage',
                                        label: 'Témoignage personnel',
                                        placeholder: 'Partagez votre expérience globale et vos recommandations...',
                                        value: formData.temoignage
                                    }
                                ].map((field, index) => (
                                    <div key={field.id} className="space-y-2">
                                        <label htmlFor={field.id} className="block font-semibold text-gray-800 flex items-center gap-2">
                                            {field.label}
                                            <HelpCircle
                                                className="w-4 h-4 text-gray-400 cursor-help"
                                                onMouseEnter={() => setActiveTooltip(field.id)}
                                                onMouseLeave={() => setActiveTooltip(null)}
                                            />
                                            {activeTooltip === field.id && (
                                                <div className="absolute bg-black text-white text-xs px-2 py-1 rounded mt-6 ml-4">
                                                    {field.placeholder}
                                                </div>
                                            )}
                                        </label>
                                        <textarea
                                            id={field.id}
                                            value={field.value}
                                            onChange={(e) => handleTextareaChange(field.id, e.target.value)}
                                            className="w-full h-24 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 resize-none"
                                            placeholder={field.placeholder}
                                            rows={3}
                                            maxLength={500}
                                        />
                                        <div className="text-xs text-gray-500 text-right">
                                            {field.value.length}/500 caractères
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl flex items-center gap-2 transition-all duration-200 hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <LoadingSpinner className="w-4 h-4" />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        {isEditing ? 'Mettre à jour' : 'Soumettre l\'évaluation'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EvaluationForm;