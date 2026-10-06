import React, { useCallback, useEffect, useState } from "react";
import axios from "../../../config/axios";
import { EvaluationDrawerCfp } from "../../Apprenants/evaluationChaud/components/Body/Projects/EvaluationDrawerCfp";
import { ChevronLeft, Info, User } from "lucide-react";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const helpers = {
  renderStars: (rating = 0) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-lg ${
            i <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  ),
  getRatingColor: (rating = 0) =>
    rating >= 4
      ? "text-green-600"
      : rating >= 2.5
      ? "text-yellow-600"
      : "text-red-600",
  renderAvatar: (learner) => (
    <div
      className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm"
      title={learner.name}
    >
      {learner.name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  ),
};

const EvaluationButton = React.memo(({ learner, onEvaluate }) => (
  <button
    onClick={() => onEvaluate(learner)}
    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm border ${
      learner.note > 0
        ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100"
        : "bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100"
    }`}
  >
    {learner.note > 0 ? "Voir" : "Évaluer"}
  </button>
));

const LearnerRow = React.memo(({ learner, onEvaluate }) => (
  <div className="px-3 py-2 hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      {helpers.renderAvatar(learner)}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900 truncate">
          {learner.name}
        </div>
        {learner.subtitle && (
          <div className="text-xs text-gray-500 truncate">
            {learner.subtitle}
          </div>
        )}
      </div>
    </div>
    <div className="flex items-center gap-3">
      {learner.note > 0 ? (
        <div className="text-center">
          {helpers.renderStars(learner.note)}
          <div
            className={`text-xs font-semibold ${helpers.getRatingColor(
              learner.note
            )}`}
          >
            {learner.note.toFixed(1)}/5
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 text-xs">Non évalué</div>
      )}
      <EvaluationButton learner={learner} onEvaluate={onEvaluate} />
    </div>
  </div>
));

const EntrepriseCard = React.memo(({ etp, onEvaluate }) => (
  <motion.div
    key={etp.id}
    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-900 truncate">
        {etp.name}
      </h3>
      <span className="text-xs text-gray-700 bg-white px-2 py-1 rounded border">
        {etp.learners?.filter((l) => l.note > 0).length || 0}/
        {etp.learners?.length || 0} évalués
      </span>
    </div>
    <div className="divide-y divide-gray-100">
      {etp.learners?.map((learner) => (
        <LearnerRow
          key={learner.id}
          learner={learner}
          onEvaluate={onEvaluate}
        />
      ))}
    </div>
  </motion.div>
));

export function HotEvaluationByProject() {
  const { projectId } = useParams();
  const [entreprises, setEntreprises] = useState([]);
  const [percentageEvaluated, setPercentageEvaluated] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApprenant, setSelectedApprenant] = useState(null);
  const [showEvaluationDrawer, setShowEvaluationDrawer] = useState(false);
  const navigate = useNavigate();

  const fetchLearners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`/cfp/evaluation/projet/${projectId}`);
      setPercentageEvaluated(data?.percentage_evaluated || 0);
      setEntreprises(data.entreprises || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les apprenants pour le moment.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchLearners();
  }, [fetchLearners]);

  const handleOpenEvaluation = useCallback((learner) => {
    setSelectedApprenant(learner);
    setShowEvaluationDrawer(true);
  }, []);

  const handleCloseEvaluation = useCallback(() => {
    setSelectedApprenant(null);
    setShowEvaluationDrawer(false);
  }, []);

  const handleEvaluationSuccess = useCallback(() => {
    fetchLearners();
    handleCloseEvaluation();
  }, [fetchLearners, handleCloseEvaluation]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div>
      <div className="my-10">
        <button
          onClick={() => navigate(-1)}
          className="text-sm inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-all duration-200 "
        >
          <ChevronLeft />
          Retour
        </button>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200">
        {/* Progress */}

        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-gray-600 font-medium text-sm">Progression</div>
          <div
            className={`text-lg font-bold ${
              percentageEvaluated >= 80
                ? "text-green-600"
                : percentageEvaluated >= 50
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {percentageEvaluated}%
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 mx-4 mt-2 rounded-lg p-2 text-xs text-blue-800 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p>
            <strong>Important :</strong> Les évaluations soumises ne peuvent
            plus être modifiées.
          </p>
        </div>

        {/* Entreprises */}
        <div className="flex-1 overflow-y-auto max-h-[70vh] p-4 space-y-4">
          {entreprises.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <User className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-600 mb-1">
                Aucune entreprise trouvée
              </p>
              <p className="text-xs text-gray-500">Aucune donnée disponible.</p>
            </div>
          ) : (
            <AnimatePresence>
              {entreprises.map((etp) => (
                <EntrepriseCard
                  key={etp.id}
                  etp={etp}
                  onEvaluate={handleOpenEvaluation}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Drawer */}
        <AnimatePresence>
          {showEvaluationDrawer && selectedApprenant && (
            <EvaluationDrawerCfp
              project={{
                idProjet: projectId,
                idEmploye: selectedApprenant.id,
                emp_name: selectedApprenant.name,
                emp_firstname: selectedApprenant.subtitle,
              }}
              onClose={handleCloseEvaluation}
              evaluationData={
                selectedApprenant.evaluationDetails ||
                selectedApprenant.evaluation
              }
              onSuccess={handleEvaluationSuccess}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default HotEvaluationByProject;
