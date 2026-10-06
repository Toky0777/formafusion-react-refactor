import axios from "../../../config/axios";
import { useEffect, useState } from "react";
import { HeaderEvaluation } from "./EvaluationApprFroid/HeaderEvaluation";

export function EvaluationList() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`/employes/evaluations/froids`)
            .then((res) => setData(res.data))
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
                    <p className="text-muted-foreground">Chargement des données...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <main className="container py-8 mx-auto space-y-8">
                    {(!data || !data.projets || data.projets.length === 0) ? (
                        <div className="flex items-center justify-center text-center">
                            <p className="text-sm text-gray-500">Aucun projet à évaluer pour le moment...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {data.projets.map((project) => (
                                <div key={project.id} className="row min-w-[80vh]">
                                    <HeaderEvaluation projet={project} user={data.user} typeQuestions={data.typeQuestions} questions={data.questions} notes={data.notes} />
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}