import { useState } from "react";
import { Loader2, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { EntrepriseStep } from "../../../components/project/new-project/entreprise_step";
import { projectService } from "../../../services/projectService";
import { CourseStep } from "../../../components/project/new-project/course_step";
import { FolderStep } from "../../../components/project/new-project/folder_step";
import { ParticularStep } from "../../../components/project/new-project/particular_step";
import { PurchaseStep } from "../../../components/project/new-project/purchase-step";
import { useNavigate } from "react-router-dom";

const NewProject = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [purchaseOrdersList, setPurchaseOrdersList] = useState([]);

  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    project_type: "",
    title: "",
    description: "",
    enterprise_id: null,
    individual_id: [],
    purchase_order_id: null,
    course_id: "",
    folder_id: "",
    modality: "",
    date_begin: "",
    date_end: "",
  });

  // const handleAddFolder = async (name) => {
  //   const newItem = await projectService.addFolder(name);
  //   setFolders([...folders, newItem]);
  //   setFormData((prev) => ({ ...prev, folder_id: newItem.id }));
  //   return newItem;
  // };

  const handleAddPurchaseOrder = async (po) => {
    if (!purchaseOrdersList.find((p) => p.id === po.id)) {
      setPurchaseOrdersList([...purchaseOrdersList, po]);
    }
    setFormData((prev) => ({ ...prev, purchase_order_id: po.id }));
  };

  const canProceed = () => {
    if (currentStep === 1) return !!formData.project_type;
    if (currentStep === 2) return !!formData.title;
    if (currentStep === 3) return true;
    if (currentStep === 4) return true;
    if (currentStep === 5 && formData.project_type === "Individual")
      return (
        !!formData.modality && !!formData.date_begin && !!formData.date_end
      );
    if (currentStep === 5 && formData.project_type !== "Individual")
      if (currentStep === 6 && formData.project_type !== "Individual")
        return true;
    if (currentStep === 7 && formData.project_type !== "Individual")
      return (
        !!formData.modality && !!formData.date_begin && !!formData.date_end
      );
    return true;
  };

  const totalSteps = formData.project_type === "Individual" ? 5 : 7;

  const handleSubmitProject = async () => {
    setSubmitting(true);
    const payload = {
      project_type: formData.project_type,
      title: formData.title,
      description: formData.description,
      enterprise_id: formData.enterprise_id,
      individual_id: formData.individual_id,
      purchase_order_id: formData.purchase_order_id,
      folder_id: formData.folder_id,
      course_id: formData.course_id,
      modality: formData.modality,
      date_begin: formData.date_begin,
      date_end: formData.date_end,
    };

    try {
      await projectService.createProject(payload);
      setSuccessMessage("Project created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      navigate("/cfp/projet/preparation");
    } catch (err) {
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Création de nouveau projet</h1>

      {successMessage && (
        <div className="p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 mb-6">
          {successMessage}
        </div>
      )}

      {/* Stepper */}
      <div className="relative mb-10">
        <div className="absolute inset-0 top-4 h-1 bg-gray-200 rounded-full"></div>
        <div
          className="absolute inset-0 top-4 h-1 bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
        <div className="flex justify-between relative z-10">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                currentStep >= step
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-gray-300 text-gray-500"
              }`}
            >
              {currentStep > step ? <Check size={18} /> : step}
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-white shadow rounded-xl p-8 overflow-hidden"
      >
        {currentStep === 1 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold mb-4">
              Choisir le type de projet
            </h2>
            {[
              { label: "Projet inter entreprise", value: "Inter" },
              { label: "Projet intra entreprise", value: "Intra" },
              { label: "Projet particulier", value: "Individual" },
            ].map((t) => (
              <label
                key={t.value}
                className={`p-4 border rounded-lg flex items-center gap-3 cursor-pointer transition ${
                  formData.project_type === t.value
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="project_type"
                  value={t.value}
                  checked={formData.project_type === t.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      project_type: e.target.value,
                      enterprise_id: t.value === "Inter" ? [] : null,
                      individual_id: [],
                      purchase_order_id: null,
                    })
                  }
                />
                {t.label}
              </label>
            ))}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Détail de projet</h2>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Titre du projet"
              className="w-full border p-3 rounded-lg"
            />
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description de projet"
              rows={4}
              className="w-full border p-3 rounded-lg"
            />
          </div>
        )}

        {currentStep === 3 && (
          <>
            {formData.project_type === "Individual" ? (
              <ParticularStep
                value={formData.individual_id}
                onChange={(ids) =>
                  setFormData({ ...formData, individual_id: ids })
                }
                multiple={true}
                placeholder="Selectionner les particuliers..."
              />
            ) : (
              <EntrepriseStep
                value={
                  formData.project_type === "Inter"
                    ? formData.enterprise_id || []
                    : formData.enterprise_id || null
                }
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    enterprise_id: val,
                  }))
                }
                multiple={formData.project_type === "Inter"}
                placeholder="Selectionner l'entreprise..."
              />
            )}
          </>
        )}

        {currentStep === 4 &&
          (formData.project_type === "Individual" ? (
            <CourseStep
              value={formData.course_id}
              onChange={(v) => setFormData({ ...formData, course_id: v })}
              multiple={false}
              placeholder="Selectionner le cours..."
            />
          ) : (
            <PurchaseStep
              etpIds={formData.enterprise_id}
              value={formData.purchase_order_id}
              onChange={(id) =>
                setFormData({ ...formData, purchase_order_id: id })
              }
              placeholder="Selectionner le bon de commande..."
              multiple={false}
              onAdd={handleAddPurchaseOrder}
            />
          ))}

        {formData.project_type !== "Individual" && currentStep === 5 && (
          <CourseStep
            value={formData.course_id}
            onChange={(v) => setFormData({ ...formData, course_id: v })}
            // onAdd={handleAddCourse}
            multiple={false}
            placeholder="Selectionner le cours..."
          />
        )}
        {formData.project_type !== "Individual" && currentStep === 6 && (
          <FolderStep
            value={formData.folder_id}
            onChange={(v) => setFormData({ ...formData, folder_id: v })}
            // onAdd={handleAddFolder}
            multiple={false}
            placeholder="Selectionner le dossier..."
          />
        )}

        {/* Modality & Dates */}
        {((formData.project_type === "Individual" && currentStep === 5) ||
          (formData.project_type !== "Individual" && currentStep === 7)) && (
          <>
            <h2 className="text-xl font-semibold mb-4">Modalité et dates</h2>
            <select
              value={formData.modality}
              onChange={(e) =>
                setFormData({ ...formData, modality: e.target.value })
              }
              className="w-full border p-3 rounded-lg mb-4"
            >
              <option value="">Selectionner la modalité</option>
              <option value="1">Présentielle</option>
              <option value="2">En ligne</option>
              <option value="3">Blended</option>
            </select>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="border p-3 rounded-lg"
                value={formData.date_begin}
                onChange={(e) =>
                  setFormData({ ...formData, date_begin: e.target.value })
                }
              />
              <input
                type="date"
                className="border p-3 rounded-lg"
                value={formData.date_end}
                onChange={(e) =>
                  setFormData({ ...formData, date_end: e.target.value })
                }
              />
            </div>

            <button
              type="button"
              onClick={handleSubmitProject}
              disabled={submitting || !canProceed()}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {submitting ? "Creation de votre projet..." : "Créer"}
            </button>
          </>
        )}

        {/* Navigation */}
        {currentStep < totalSteps && (
          <div className="sticky bottom-0 bg-white p-4 border-t flex justify-between border-gray-200">
            <button
              type="button"
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-gray-100 px-5 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ChevronLeft /> Retour
            </button>

            <button
              type="button"
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Suivant <ChevronRight />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewProject;
