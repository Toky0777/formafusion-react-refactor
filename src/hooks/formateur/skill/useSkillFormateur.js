import { useState } from "react";
import {
  getProjectFormById,
  updateSkillEmployeForm,
  getSkillLevelForm,
  saveSkillEmployeForm
} from "../../../services/skillService";
export const useSkillFormateur = () => {
  const [emps, setEmps] = useState([]);
  const [skillItems, setSkillItems] = useState([]);
  const [skillLevel, setSkillLevel] = useState([]);
  const [projectDetails, setProjetctDetails] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [editingCell, setEditingCell] = useState({
    idProjet: null,
    idEmploye: null,
    idSkill: null,
  });

  const [inputData, setInputData] = useState({});

  const handleClick = (emp, skill, skillData) => {
    const cellKey = `${emp.idEmploye}-${skill.skill_id}`;

    if (!inputData[cellKey]) {
      setInputData((prev) => ({
        ...prev,
        [cellKey]: {
          before: skillData?.skill_score_before || 0,
          after: skillData?.skill_score_after || 0,
        },
      }));
    }

    setEditingCell({
      idProjet: emp.idProjet,
      idEmploye: emp.idEmploye,
      idSkill: skill.skill_id,
    });
  };

  const handleCancel = () => {
    setEditingCell({
      idProjet: null,
      idEmploye: null,
      idSkill: null,
    });
  };

  const handleEditChange = (name, value, idEmploye, idSkill) => {
    const numericValue = isNaN(value) ? value : Number(value);
    const cellKey = `${idEmploye}-${idSkill}`;

    setInputData((prev) => ({
      ...prev,
      [cellKey]: {
        ...prev[cellKey],
        [name]: numericValue,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Pour chaque cellule modifiée
      for (const cellKey in inputData) {
        const [idEmployeStr, idSkillStr] = cellKey.split("-");
        const idEmploye = parseInt(idEmployeStr);
        const idSkill = parseInt(idSkillStr);

        const cellData = inputData[cellKey];

        const emp = emps.find((e) => e.idEmploye === idEmploye);
        if (!emp) continue;

        if (cellData.before !== undefined && cellData.after !== undefined) {
          const dataToSave = {
            idProjet: editingCell.idProjet,
            idEmploye: idEmploye,
            skillId: idSkill,
            before: cellData.before,
            after: cellData.after,
          };

          const existingSkill = skillLevel?.find(
            (s) => s.idEmploye === idEmploye && s.id_module_skill === idSkill
          );

          if (existingSkill) {
            await updateSkillEmployeForm(dataToSave);
          } else {
            await saveSkillEmployeForm(dataToSave);
          }
        }
      }

      // Recharger les données après sauvegarde
      await getSkillLevelInProject(editingCell.idProjet);

      // Réinitialiser l'état d'édition
      setEditingCell({
        idProjet: null,
        idEmploye: null,
        idSkill: null,
      });

      // Vider les données d'édition
      setInputData({});
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getAllEmployeInProjects = async (idProjet) => {
    setIsLoading(true);
    try {
      const result = await getProjectFormById(idProjet);
      setEmps(result.learners.learner_items);
      setSkillItems(result.skills.skill_items);
      setProjetctDetails(result.project);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSkillLevelInProject = async (idProjet) => {
    try {
      const res = await getSkillLevelForm(idProjet);
      setSkillLevel(res.skill_levels);
    } catch (error) {
      console.log(error);
    }
  };

  const getInputDataForCell = (idEmploye, idSkill) => {
    const cellKey = `${idEmploye}-${idSkill}`;
    return inputData[cellKey] || {};
  };

  return {
    getAllEmployeInProjects,
    getSkillLevelInProject,
    emps,
    skillItems,
    skillLevel,
    projectDetails,
    handleClick,
    handleCancel,
    handleEditChange,
    handleSave,
    editingCell,
    getInputDataForCell,
    inputData,
    isSaving,
    isLoading,
  };
};
