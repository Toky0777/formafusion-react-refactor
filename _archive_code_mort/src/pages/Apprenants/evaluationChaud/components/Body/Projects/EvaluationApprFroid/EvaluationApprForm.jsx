import React, { useState } from 'react';
import { Star, Send, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useStateContext } from '../../../Context/ContextProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../../LoadingScreen';

const EvaluationAppForm = ({ evaluation, user, typeQuestions, questions, notes }) => {
    const [rating, setRating] = useState(0);
    const [recommendation, setRecommendation] = useState('');
    const [aspects, setAspects] = useState('');
    const [suggestions, setSuggestions] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [questionResponses, setQuestionResponses] = useState({});
    const { api_base_url, token } = useStateContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async(e) => {
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
            await axios.post(`${api_base_url}employes/evaluations/froids/${evaluation.idProjet}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTimeout(() => {
                navigate('/employe/evaluations/froids');
            }, 500);
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
        {isLoading && <LoadingScreen />}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header Section */}
                <div className="border-b border-slate-200 pb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Évaluation à froid</h1>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <p className="text-slate-600">
                                <span className="font-medium">Titre:</span>
                                <span className="text-slate-900 ml-2">"Évaluation à froid de la formation"</span>
                            </p>
                            <p className="text-slate-600">
                                <span className="font-medium">Formation:</span>
                                <span className="text-slate-900 ml-2">{evaluation.module_name}</span>
                            </p>
                            <p className="text-slate-600">
                                <span className="font-medium">Dates:</span>
                                <span className="text-slate-900 ml-2">{evaluation.dateDebut} à {evaluation.dateFin}</span>
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-slate-600">
                                <span className="font-medium">Participant:</span>
                                <span className="text-slate-900 ml-2">{`${user.name} ${user.firstName}`}</span>
                            </p>
                            <p className="text-slate-600">
                                <span className="font-medium">Entreprise:</span>
                                <span className="text-slate-900 ml-2">{evaluation.etp_name || 'ENTREPRISESTESTES'}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dynamic Questions Section */}
                {typeQuestions && typeQuestions.map((typeQuestion) => (
                    <div key={typeQuestion.id} className="space-y-6">
                        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                            {typeQuestion.quizz_name}
                        </h2>
                        
                        <div className="space-y-4">
                            {questions && questions
                                .filter(question => question.idQuizzType === typeQuestion.id)
                                .map((question) => (
                                    <div key={question.id} className="bg-slate-50 rounded-xl p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <p className="text-slate-700 font-medium lg:flex-1">
                                                {question.quizz_cold_name}
                                            </p>
                                            
                                            <div className="flex flex-wrap gap-2 lg:flex-shrink-0">
                                                {notes && notes.map((note) => (
                                                    <label
                                                        key={note.quizz_level_value}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                            questionResponses[question.id] === note.quizz_level_value
                                                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                                : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:bg-purple-50'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`quizz_level_${question.id}`}
                                                            value={note.quizz_level_value}
                                                            checked={questionResponses[question.id] === note.quizz_level_value}
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
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                        <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
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
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none text-slate-900 placeholder-slate-400"
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
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none text-slate-900 placeholder-slate-400"
                                placeholder="Proposez de nouvelles thématiques qui vous intéresseraient..."
                            />
                        </div>
                    </div>
                </div>

                {/* Global Satisfaction Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                        <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                        Satisfaction globale
                    </h2>
                    
                    {/* Rating Question */}
                    <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                        <p className="text-slate-700 font-medium">
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
                                    className={`w-16 h-16 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-110 ${
                                        (hoveredRating >= value || (!hoveredRating && rating >= value))
                                            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                                            : 'bg-white text-slate-400 border-2 border-slate-200 hover:border-purple-300'
                                    }`}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                        
                        {rating > 0 && (
                            <div className="text-center">
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                    <Star className="w-4 h-4 fill-current" />
                                    {ratingLabels[rating - 1]}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Recommendation Question */}
                    <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                        <p className="text-slate-700 font-medium">
                            Recommanderiez-vous cette formation à un collègue ?
                        </p>
                        
                        <div className="flex gap-4 justify-center">
                            <label className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                recommendation === '1'
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
                            
                            <label className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                recommendation === '0'
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
                <div className="pt-6 border-t border-slate-200">
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-200 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Send className="w-5 h-5" />
                        Valider l'évaluation
                    </button>
                </div>
            </form>
        </div>
    </>
}

export default EvaluationAppForm;