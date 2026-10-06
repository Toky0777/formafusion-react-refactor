import {
  AlertCircle,
  Thermometer,
  FileX,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card.jsx";
import T from "../../../../components/translate/AutoTranslator.jsx";

export function DashboardCfp({ data, className = "" }) {
    const currentDate = new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Valeurs par défaut si les données ne sont pas disponibles
    const count_attendance_not_finished = data?.count_not_finished?.attendanceNotFinished || 0;
    const evaluationChaudNotFinished = data?.count_not_finished?.evaluationChaudNotFinished || 0;
    const nonCloture = data?.nonCloture || 0;

    // Fonction pour déterminer les couleurs selon la valeur
    const getMetricColor = (value) => {
        if (value === 0) {
            return {
                bgColor: "bg-emerald-50",
                borderColor: "border-emerald-200",
                hoverColor: "hover:border-emerald-300",
                accentColor: "bg-emerald-500",
                textColor: "text-emerald-700",
                iconColor: "text-emerald-600",
                priorityColor: "text-emerald-600"
            };
        } else if (value < 10) {
            return {
                bgColor: "bg-amber-50",
                borderColor: "border-amber-200",
                hoverColor: "hover:border-amber-300",
                accentColor: "bg-amber-500",
                textColor: "text-amber-700",
                iconColor: "text-amber-600",
                priorityColor: "text-amber-600"
            };
        } else {
            return {
                bgColor: "bg-rose-50",
                borderColor: "border-rose-200",
                hoverColor: "hover:border-rose-300",
                accentColor: "bg-rose-600",
                textColor: "text-rose-700",
                iconColor: "text-rose-600",
                priorityColor: "text-rose-600"
            };
        }
    };

    // Fonction pour obtenir l'icône selon la valeur
    const getMetricIcon = (value, IconComponent) => {
        if (value === 0) {
            return CheckCircle;
        } else if (value < 10) {
            return AlertTriangle;
        } else {
            return IconComponent;
        }
    };

    // Configuration des métriques
    const metrics = [
        {
            id: 1,
            title: "Présences en attente",
            value: count_attendance_not_finished,
            baseIcon: AlertCircle,
            link: "#"
        },
        {
            id: 2,
            title: "Évaluations en attente",
            value: evaluationChaudNotFinished,
            baseIcon: Thermometer,
            link: "#"
        },
        {
            id: 3,
            title: "Dossiers non clôturés",
            value: nonCloture,
            baseIcon: FileX,
            link: "/cfp/dossier"
        }
    ];

    return (
        <Card className={`bg-white border-0 shadow-sm ${className}`}>
            <CardHeader className="pb-4 border-b">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            Qualité Managment
                        </CardTitle>
                        <p className="mt-1 text-sm text-gray-500">
                            Pilotez l'excellence de vos formations
                        </p>
                    </div>
                    <div className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                        <T>À traiter aujourd'hui</T>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {metrics.map((metric) => {
                        const colors = getMetricColor(metric.value);
                        const MetricIcon = getMetricIcon(metric.value, metric.baseIcon);

                        return (
                            <Link
                                key={metric.id}
                                to={metric.link}
                                className={`group relative p-5 rounded-xl border ${colors.borderColor} ${colors.hoverColor} transition-all duration-200 hover:shadow-sm overflow-hidden`}
                            >
                                {/* Background accent */}
                                <div className={`absolute top-0 left-0 w-1 h-full ${colors.accentColor}`}></div>

                                {/* Content */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-lg ${colors.accentColor} shadow-sm`}>
                                            <MetricIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className={`text-3xl font-bold ${colors.textColor}`}>
                                                {metric.value}
                                            </p>
                                            <p className="mt-1 text-sm font-medium text-gray-600">
                                                <T>{metric.title}</T>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress indicator (for non-zero values) */}
                                {metric.value > 0 && (
                                    <div className="mt-4">
                                        <div className="flex justify-between mb-1 text-xs text-gray-500">
                                            <span>Niveau d'urgence</span>
                                            <span className={`font-medium ${colors.textColor}`}>
                                                {metric.value < 10 ? "Modéré" : "Élevé"}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`${colors.accentColor} h-1.5 rounded-full transition-all duration-300`}
                                                style={{
                                                    width: `${Math.min(metric.value * (metric.value < 10 ? 7 : 5), 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Success message for zero values */}
                                {metric.value === 0 && (
                                    <div className="flex items-center gap-2 mt-4">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        <span className="text-xs font-medium text-emerald-600">
                                            <T>Toutes les actions sont complétées</T>
                                        </span>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Summary footer */}
                <div className="pt-5 mt-6 border-t border-gray-100">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                <T>Statut global :</T>
                            </span>
                            <span className={`text-sm font-semibold ${metrics.reduce((sum, m) => sum + m.value, 0) === 0
                                ? "text-emerald-600"
                                : metrics.reduce((sum, m) => sum + m.value, 0) < 10
                                    ? "text-amber-600"
                                    : "text-rose-600"
                                }`}>
                                {metrics.reduce((sum, m) => sum + m.value, 0) === 0
                                    ? "✅ Tout est à jour"
                                    : metrics.reduce((sum, m) => sum + m.value, 0) < 10
                                        ? "⚠️  Action modérée requise"
                                        : "🔴 Action urgente requise"
                                }
                            </span>
                        </div>
                        <div className="text-sm">
                            <span className="text-gray-600">
                                <T>Total des actions :</T>
                            </span>
                            <span className="ml-2 font-semibold text-gray-900">
                                {metrics.reduce((sum, metric) => sum + metric.value, 0)}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}