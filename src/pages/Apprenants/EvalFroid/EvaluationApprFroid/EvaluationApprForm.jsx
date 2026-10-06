import { useState } from 'react';
import { Star, Send, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import axios from '../../../../config/axios';
import LoadingSpinner from '../../../../components/loading/loading-spinner';
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const EvaluationAppForm = ({ evaluation, user, typeQuestions, questions, notes }) => {
    const [rating, setRating] = useState(0);
    const [recommendation, setRecommendation] = useState('');
    const [aspects, setAspects] = useState('');
    const [suggestions, setSuggestions] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [questionResponses, setQuestionResponses] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Préparer les réponses aux questions
        const idQuizzCold = [];
        const quizzLevel = [];

        Object.entries(questionResponses).forEach(([questionId, value]) => {
            idQuizzCold.push(questionId);
            quizzLevel.push(value);
        });

        const payload = {
            global_satisfaction: rating,
            general_recomand: recommendation,
            quizz_aspect: aspects,
            quizz_suggestion: suggestions,
            idQuizzCold: idQuizzCold,
            quizz_level: quizzLevel
        };

        console.log(JSON.stringify(payload));

        setIsLoading(true)
        try {
            const response = await axios.post(`/employes/evaluations/froids/${evaluation.idProjet}`, payload);
            toastr.success(response.data?.message || "Évaluation soumise avec succès !");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    };

    const handleQuestionResponse = (questionId, value) => {
        setQuestionResponses(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const ratingLabels = [
        'Très mauvais',
        'Mauvais',
        'Moyen',
        'Bon',
        'Excellent'
    ];

    return <>
        <div className="p-8 mx-auto transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header Section */}
                <div className="pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                            <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Évaluation à froid</h1>
                    </div>

                    <div className="grid gap-4 text-sm md:grid-cols-2">
                        <div className="space-y-2">
                            <p className="text-slate-600">
                                <span className="font-medium">Titre:</span>
                                <span className="ml-2 text-slate-900">"Évaluation à froid de la formation"</span>
                            </p>
                            <p className="text-slate-600">
                                <span className="font-medium">Formation:</span>
                                <span className="ml-2 text-slate-900">{evaluation.module_name}</span>
                            </p>
                            <p className="text-slate-600">
                                <span className="font-medium">Dates:</span>
                                <span className="ml-2 text-slate-900">{evaluation.dateDebut} à {evaluation.dateFin}</span>
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-slate-600">
                                <span className="font-medium">Participant:</span>
                                <span className="ml-2 text-slate-900">{`${user.name} ${user.firstName}`}</span>
                            </p>
                            <p className="text-slate-600">
                                <span className="font-medium">Entreprise:</span>
                                <span className="ml-2 text-slate-900">{evaluation.etp_name || 'ENTREPRISESTESTES'}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dynamic Questions Section */}
                {typeQuestions && typeQuestions.map((typeQuestion) => (
                    <div key={typeQuestion.id} className="space-y-6">
                        <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                            <div className="w-2 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
                            {typeQuestion.quizz_name}
                        </h2>

                        <div className="space-y-4">
                            {questions && questions
                                .filter(question => question.idQuizzType === typeQuestion.id)
                                .map((question) => (
                                    <div key={question.id} className="p-6 bg-slate-50 rounded-xl">
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                            <p className="font-medium text-slate-700 lg:flex-1">
                                                {question.quizz_cold_name}
                                            </p>

                                            <div className="flex flex-wrap gap-2 lg:flex-shrink-0">
                                                {notes && notes.map((note) => (
                                                    <label
                                                        key={note.quizz_level_value}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all duration-200
                                                                ${String(questionResponses[question.id]) === String(note.quizz_level_value)
                                                                ? 'border-[1px] border-purple-600 bg-gradient-to-r from-purple-200 to-pink-200 text-purple-900 shadow-lg scale-105'
                                                                : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`quizz_level_${question.id}`}
                                                            value={note.quizz_level_value}
                                                            checked={String(questionResponses[question.id]) === String(note.quizz_level_value)}
                                                            onChange={(e) => handleQuestionResponse(question.id, e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        <span className="text-sm font-medium">
                                                            {note.quizz_level_desc}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}

                {/* Improvement Suggestions Section */}
                <div className="space-y-6">
                    <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                        <div className="w-2 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
                        Améliorations suggérées
                    </h2>

                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <label htmlFor="aspects" className="block text-sm font-medium text-slate-700">
                                Quels aspects de la formation pourraient être améliorés ?
                            </label>
                            <textarea
                                id="aspects"
                                value={aspects}
                                onChange={(e) => setAspects(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 transition-all duration-200 border resize-none border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                placeholder="Partagez vos suggestions pour améliorer cette formation..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="suggestions" className="block text-sm font-medium text-slate-700">
                                Avez-vous des suggestions pour de nouvelles formations ou thématiques ?
                            </label>
                            <textarea
                                id="suggestions"
                                value={suggestions}
                                onChange={(e) => setSuggestions(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 transition-all duration-200 border resize-none border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                placeholder="Proposez de nouvelles thématiques qui vous intéresseraient..."
                            />
                        </div>
                    </div>
                </div>

                {/* Global Satisfaction Section */}
                <div className="space-y-6">
                    <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                        <div className="w-2 h-6 rounded-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
                        Satisfaction globale
                    </h2>

                    {/* Rating Question */}
                    <div className="p-6 space-y-4 bg-slate-50 rounded-xl">
                        <p className="font-medium text-slate-700">
                            Sur une échelle de 1 à 5, comment évaluez-vous l'utilité de la formation ?
                        </p>

                        <div className="flex items-center justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setRating(value)}
                                    onMouseEnter={() => setHoveredRating(value)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className={`w-16 h-16 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-110 ${(hoveredRating >= value || (!hoveredRating && rating >= value))
                                        ? 'border-[1px] border-purple-600 bg-gradient-to-r from-purple-200 to-pink-200 text-purple-900 shadow-lg'
                                        : 'bg-white text-slate-400 border-2 border-slate-200 hover:border-purple-300'
                                        }`}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>

                        {rating > 0 && (
                            <div className="text-center">
                                <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                                    <Star className="w-4 h-4 fill-current" />
                                    {ratingLabels[rating - 1]}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Recommendation Question */}
                    <div className="p-6 space-y-4 bg-slate-50 rounded-xl">
                        <p className="font-medium text-slate-700">
                            Recommanderiez-vous cette formation à un collègue ?
                        </p>

                        <div className="flex justify-center gap-4">
                            <label className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${recommendation === '1'
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-green-300 hover:bg-green-50'
                                }`}>
                                <input
                                    type="radio"
                                    name="recommendation"
                                    value="1"
                                    checked={recommendation === '1'}
                                    onChange={(e) => setRecommendation(e.target.value)}
                                    className="sr-only"
                                />
                                <ThumbsUp className={`w-5 h-5 ${recommendation === '1' ? 'text-green-600' : 'text-slate-400'}`} />
                                <span className="font-medium">Oui</span>
                            </label>

                            <label className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${recommendation === '0'
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50'
                                }`}>
                                <input
                                    type="radio"
                                    name="recommendation"
                                    value="0"
                                    checked={recommendation === '0'}
                                    onChange={(e) => setRecommendation(e.target.value)}
                                    className="sr-only"
                                />
                                <ThumbsDown className={`w-5 h-5 ${recommendation === '0' ? 'text-red-600' : 'text-slate-400'}`} />
                                <span className="font-medium">Non</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-6 pt-6 border-t border-slate-200">
                    <button
                        type="submit"
                        className="flex items-center justify-center w-full gap-2 px-8 py-4 font-semibold text-white transition-all duration-200 transform rounded-md shadow-lg sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-200 hover:scale-105"
                    >
                        <Send className="w-5 h-5" />
                        Valider l'évaluation
                    </button>
                    {isLoading && <LoadingSpinner />}
                </div>
            </form>
        </div>
    </>
}

export default EvaluationAppForm;