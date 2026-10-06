import { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, Users, GraduationCap } from 'lucide-react';
import EvaluationAppForm from './EvaluationApprForm';

export function HeaderEvaluation({ projet, user, typeQuestions, questions, notes }) {
  const [evaluationOpen, setEvaluationOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div
        className="transition-all duration-300 bg-white border shadow-md cursor-pointer rounded-xl hover:shadow-lg group border-slate-200"
        onClick={() => setEvaluationOpen(!evaluationOpen)}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center shadow-lg w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <GraduationCap className="text-white w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold transition-colors duration-200 text-slate-900 group-hover:text-purple-600">
                  {projet.module_name}
                </h3>

                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{projet.dateDebut} - {projet.dateFin}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>avec {projet.cfp_name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${evaluationOpen
                ? 'bg-purple-100 text-purple-700'
                : 'bg-slate-100 text-slate-600 group-hover:bg-purple-50 group-hover:text-purple-600'
                }`}>
                <div className="w-2 h-2 bg-current rounded-full"></div>
                {evaluationOpen ? 'Ouvert' : 'Évaluer'}
              </div>

              <div className={`p-2 rounded-lg transition-all duration-200 ${evaluationOpen
                ? 'bg-purple-100 text-purple-600'
                : 'bg-slate-100 text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-500'
                }`}>
                {evaluationOpen ? (
                  <ChevronDown className="w-5 h-5 transition-transform duration-200 transform" />
                ) : (
                  <ChevronRight className="w-5 h-5 transition-transform duration-200 transform group-hover:translate-x-1" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-100">
          <div className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ${evaluationOpen ? 'w-full' : 'w-0 group-hover:w-1/4'
            }`}></div>
        </div>
      </div>

      {/* Evaluation Form */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${evaluationOpen
        ? 'max-h-[2000px] opacity-100'
        : 'max-h-0 opacity-0'
        }`}>
        {evaluationOpen && (
          <div className="transition-all duration-300 transform translate-y-0">
            <EvaluationAppForm evaluation={projet} user={user} typeQuestions={typeQuestions} questions={questions} notes={notes} />
          </div>
        )}
      </div>
    </div>
  );
}