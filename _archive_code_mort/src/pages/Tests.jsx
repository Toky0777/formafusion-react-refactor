import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Play, Award, BarChart3, Target, BookOpen, TrendingUp } from 'lucide-react';

const Tests = () => {
    const [selectedTest, setSelectedTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const tests = [
        {
            id: 1,
            title: "Évaluation JavaScript Fondamentaux",
            description: "Testez vos connaissances de base en JavaScript",
            category: "Développement Web",
            difficulty: "Débutant",
            duration: 30,
            questions: 20,
            passingScore: 70,
            attempts: 2,
            maxAttempts: 3,
            lastScore: 85,
            status: "completed",
            image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
            id: 2,
            title: "Test de Gestion de Projet Agile",
            description: "Évaluez votre compréhension des méthodologies agiles",
            category: "Gestion",
            difficulty: "Intermédiaire",
            duration: 45,
            questions: 25,
            passingScore: 75,
            attempts: 0,
            maxAttempts: 2,
            lastScore: null,
            status: "available",
            image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
            id: 3,
            title: "Certification Marketing Digital",
            description: "Examen final pour la certification en marketing digital",
            category: "Marketing",
            difficulty: "Avancé",
            duration: 60,
            questions: 30,
            passingScore: 80,
            attempts: 1,
            maxAttempts: 2,
            lastScore: 65,
            status: "failed",
            image: "https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
            id: 4,
            title: "Quiz Python Data Science",
            description: "Testez vos compétences en analyse de données avec Python",
            category: "Data Science",
            difficulty: "Intermédiaire",
            duration: 40,
            questions: 22,
            passingScore: 70,
            attempts: 0,
            maxAttempts: 3,
            lastScore: null,
            status: "locked",
            image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
    ];

    const sampleQuestions = [
        {
            id: 1,
            question: "Quelle est la différence entre 'let' et 'var' en JavaScript ?",
            options: [
                "Il n'y a aucune différence",
                "'let' a une portée de bloc, 'var' a une portée de fonction",
                "'var' est plus récent que 'let'",
                "'let' ne peut pas être redéclaré, 'var' peut l'être"
            ],
            correct: 1
        },
        {
            id: 2,
            question: "Qu'est-ce que le hoisting en JavaScript ?",
            options: [
                "Une méthode pour optimiser le code",
                "Le processus de déplacement des déclarations vers le haut",
                "Une technique de debugging",
                "Un type de boucle"
            ],
            correct: 1
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'failed': return 'bg-red-100 text-red-800';
            case 'available': return 'bg-blue-100 text-blue-800';
            case 'locked': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'failed': return <XCircle className="w-4 h-4" />;
            case 'available': return <Play className="w-4 h-4" />;
            case 'locked': return <Target className="w-4 h-4" />;
            default: return <Target className="w-4 h-4" />;
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Débutant': return 'bg-green-100 text-green-800';
            case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
            case 'Avancé': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const startTest = (test) => {
        if (test.status === 'locked' || test.attempts >= test.maxAttempts) return;
        setSelectedTest(test);
        setCurrentQuestion(0);
        setAnswers({});
        setShowResults(false);
    };

    const handleAnswer = (questionId, answerIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerIndex
        }));
    };

    const nextQuestion = () => {
        if (currentQuestion < sampleQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    const calculateScore = () => {
        let correct = 0;
        sampleQuestions.forEach(question => {
            if (answers[question.id] === question.correct) {
                correct++;
            }
        });
        return Math.round((correct / sampleQuestions.length) * 100);
    };

    if (selectedTest && !showResults) {
        const question = sampleQuestions[currentQuestion];
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Test Header */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">{selectedTest.title}</h1>
                        <button
                            onClick={() => setSelectedTest(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{selectedTest.duration} min</span>
                        </div>
                        <div>Question {currentQuestion + 1} sur {sampleQuestions.length}</div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-2 transition-all duration-300 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
                                style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Question */}
                <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-xl">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">{question.question}</h2>
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(question.id, index)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${answers[question.id] === index
                                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-4 h-4 rounded-full border-2 ${answers[question.id] === index
                                            ? 'border-purple-500 bg-purple-500'
                                            : 'border-gray-300'
                                        }`}>
                                        {answers[question.id] === index && (
                                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                                        )}
                                    </div>
                                    <span>{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-end mt-8">
                        <button
                            onClick={nextQuestion}
                            disabled={answers[question.id] === undefined}
                            className="px-6 py-2 font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {currentQuestion === sampleQuestions.length - 1 ? 'Terminer' : 'Suivant'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showResults) {
        const score = calculateScore();
        const passed = score >= selectedTest.passingScore;

        return (
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Results Header */}
                <div className={`rounded-xl p-8 text-white ${passed ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-pink-600'}`}>
                    <div className="text-center">
                        {passed ? (
                            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                        ) : (
                            <XCircle className="w-16 h-16 mx-auto mb-4" />
                        )}
                        <h1 className="mb-2 text-3xl font-bold">
                            {passed ? 'Félicitations !' : 'Test échoué'}
                        </h1>
                        <p className="text-xl opacity-90">
                            Votre score: {score}% (Minimum requis: {selectedTest.passingScore}%)
                        </p>
                    </div>
                </div>

                {/* Detailed Results */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">Résultats détaillés</h2>
                    <div className="space-y-4">
                        {sampleQuestions.map((question, index) => {
                            const userAnswer = answers[question.id];
                            const isCorrect = userAnswer === question.correct;
                            return (
                                <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-start space-x-3">
                                        {isCorrect ? (
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="mb-2 font-medium text-gray-900">{question.question}</h3>
                                            <div className="space-y-1 text-sm">
                                                <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                                    Votre réponse: {question.options[userAnswer]}
                                                </p>
                                                {!isCorrect && (
                                                    <p className="text-green-700">
                                                        Bonne réponse: {question.options[question.correct]}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => {
                                setSelectedTest(null);
                                setShowResults(false);
                            }}
                            className="px-6 py-2 font-medium text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                            Retour aux tests
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold text-gray-900">Tests et Évaluations</h1>
                <p className="max-w-3xl mx-auto text-xl text-gray-600">
                    Évaluez vos compétences et obtenez des certifications reconnues
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
                <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
                    <BookOpen className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                    <div className="mb-1 text-3xl font-bold text-gray-900">{tests.length}</div>
                    <div className="text-gray-600">Tests disponibles</div>
                </div>
                <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
                    <CheckCircle className="w-8 h-8 mx-auto mb-3 text-green-600" />
                    <div className="mb-1 text-3xl font-bold text-gray-900">
                        {tests.filter(t => t.status === 'completed').length}
                    </div>
                    <div className="text-gray-600">Tests réussis</div>
                </div>
                <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
                    <Award className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
                    <div className="mb-1 text-3xl font-bold text-gray-900">
                        {tests.filter(t => t.lastScore && t.lastScore >= t.passingScore).length}
                    </div>
                    <div className="text-gray-600">Certifications</div>
                </div>
                <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
                    <TrendingUp className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                    <div className="mb-1 text-3xl font-bold text-gray-900">
                        {Math.round(tests.filter(t => t.lastScore).reduce((sum, t) => sum + t.lastScore, 0) / tests.filter(t => t.lastScore).length) || 0}%
                    </div>
                    <div className="text-gray-600">Score moyen</div>
                </div>
            </div>

            {/* Tests Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {tests.map((test) => (
                    <div key={test.id} className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-lg">
                        <div className="flex">
                            <img
                                src={test.image}
                                alt={test.title}
                                className="object-cover w-32 h-32"
                            />
                            <div className="flex-1 p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="mb-1 text-lg font-semibold text-gray-900">{test.title}</h3>
                                        <p className="mb-2 text-sm text-gray-600">{test.description}</p>
                                        <div className="flex items-center mb-2 space-x-2">
                                            <span className="px-2 py-1 text-xs font-medium text-purple-600 rounded bg-purple-50">
                                                {test.category}
                                            </span>
                                            <span className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(test.difficulty)}`}>
                                                {test.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                                        {getStatusIcon(test.status)}
                                        <span className="capitalize">{test.status === 'completed' ? 'Terminé' : test.status === 'failed' ? 'Échoué' : test.status === 'available' ? 'Disponible' : 'Verrouillé'}</span>
                                    </div>
                                </div>

                                <div className="mb-4 space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{test.duration} min</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <BarChart3 className="w-4 h-4" />
                                                <span>{test.questions} questions</span>
                                            </div>
                                        </div>
                                        {test.lastScore && (
                                            <span className={`font-medium ${test.lastScore >= test.passingScore ? 'text-green-600' : 'text-red-600'}`}>
                                                {test.lastScore}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Tentatives: {test.attempts}/{test.maxAttempts}</span>
                                        <span>Score minimum: {test.passingScore}%</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => startTest(test)}
                                    disabled={test.status === 'locked' || test.attempts >= test.maxAttempts}
                                    className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 ${test.status === 'locked' || test.attempts >= test.maxAttempts
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                                        }`}
                                >
                                    {test.status === 'locked' ? 'Verrouillé' :
                                        test.attempts >= test.maxAttempts ? 'Limite atteinte' :
                                            test.status === 'completed' ? 'Refaire le test' : 'Commencer le test'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA Section */}
            <div className="p-8 text-center text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
                <h2 className="mb-4 text-2xl font-bold">Prêt à valider vos compétences ?</h2>
                <p className="max-w-2xl mx-auto mb-6 text-purple-100">
                    Passez nos tests certifiants et obtenez une reconnaissance officielle
                    de vos compétences auprès des employeurs.
                </p>
                <button className="px-8 py-3 font-medium text-purple-600 transition-colors bg-white rounded-lg hover:bg-gray-50">
                    Voir tous les tests
                </button>
            </div>
        </div>
    );
};

export default Tests;