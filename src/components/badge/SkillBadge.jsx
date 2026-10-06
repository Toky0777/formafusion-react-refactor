import { useState } from "react";
import { AlertCircle, Pencil, Target, X, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ButtonSecondary from "../button/ButtonSecondary";
import Button from "../button/Button";
import ButtonDanger from "../button/ButtonDanger";

const Modal = ({ children, onClose, size = "sm" }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[700] overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 "
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative transform overflow-hidden rounded-2xl bg-white shadow-2xl ${
            size === "md" ? "w-full max-w-md" : "w-full max-w-sm"
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200 z-10"
          >
            <X size={20} />
          </button>
          {children}
        </motion.div>
      </div>
    </motion.div>
  </AnimatePresence>
);

export const SkillBadge = ({ skill, onRemove, onUpdate }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [skillName, setSkillName] = useState(skill?.name || "");
  const [errors, setErrors] = useState({});

  const handleRemoveSkill = () => {
    onRemove?.();
    setIsDeleteOpen(false);
  };

  const handleUpdateSkill = () => {
    if (skillName.trim().length < 2) {
      setErrors({
        name: "Le nom du skill doit contenir au moins 2 caractères",
      });
      return;
    }
    setErrors({});
    onUpdate?.(skillName.trim());
    setIsEditOpen(false);
  };

  return (
    <div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative inline-flex items-center gap-2 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200/60 rounded-full px-4 py-1 text-sm font-semibold text-indigo-900  transition-all duration-300 cursor-default"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-indigo-400/10 group-hover:via-purple-400/10 group-hover:to-pink-400/10 rounded-full transition-all duration-300" />

        <Target className="w-4 h-4 text-indigo-600 relative z-10" />
        <span className="relative z-10">{skill?.name || "Sample Skill"}</span>

        <div className="relative z-10 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity duration-200">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSkillName(skill?.name || "");
              setErrors({});
              setIsEditOpen(true);
            }}
            className="p-1.5 rounded-full bg-white hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 shadow-sm transition-all duration-200"
          >
            <Pencil size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDeleteOpen(true)}
            className="p-1.5 rounded-full bg-white hover:bg-red-100 text-red-500 hover:text-red-600 shadow-sm transition-all duration-200"
          >
            <X size={14} />
          </motion.button>
        </div>
      </motion.div>

      {isDeleteOpen && (
        <Modal onClose={() => setIsDeleteOpen(false)}>
          <div className="p-6">
            <div className="flex justify-center items-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle size={32} className="text-red-500" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
              Supprimer le skill ?
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Voulez-vous vraiment supprimer le skill{" "}
              <span className="font-semibold text-gray-900">
                "{skill?.name}"
              </span>{" "}
              ?
              <br />
              <span className="text-sm text-gray-500">
                Cette action est irréversible.
              </span>
            </p>
            <div className="flex justify-end gap-3">
              <ButtonSecondary onClick={() => setIsDeleteOpen(false)}>
                Annuler
              </ButtonSecondary>
              <ButtonDanger onClick={handleRemoveSkill}>Supprimer</ButtonDanger>
            </div>
          </div>
        </Modal>
      )}

      {isEditOpen && (
        <Modal onClose={() => setIsEditOpen(false)} size="md">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full">
                <Sparkles size={28} className="text-indigo-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 mb-6">
              Modifier le skill
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du skill
                </label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => {
                    setSkillName(e.target.value);
                    setErrors({});
                  }}
                  className={`w-full px-4 py-3 border-2 ${
                    errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
                  placeholder="Ex: React, JavaScript, Design..."
                  autoFocus
                />
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle size={14} />
                    {errors.name}
                  </motion.p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <ButtonSecondary onClick={() => setIsEditOpen(false)}>
                Annuler
              </ButtonSecondary>
              <Button onClick={handleUpdateSkill}>Enregistrer</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
