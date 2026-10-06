import {
  Minus,
  Package,
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Edit3,
  Trash2,
  Building2,
  Plus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { projectService } from "../../../services/projectService";
import axios from "../../../config/axios";
import toast from "react-hot-toast";

export const MaterialSection = ({
  projectMaterials,
  id,
  setProjectMaterials,
}) => {
  const [showPanel, setShowPanel] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "informatique",
    status: "disponible",
    quantity: 1,
  });

  const handleDeleteMaterial = async (materialId) => {
    try {
      await projectService.deleteMaterial(id, materialId);
      getMaterialAssigned();
      toast.error("Materiel supprimé avec succes!");
    } catch (err) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!showPanel) return;

      await Promise.all([fetchMaterials(), getMaterialAssigned()]);
    };

    fetchData();
  }, [showPanel]);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get("/cfp/materials");
      const data = res.data.materials.material_items.data;
      setMaterials(data);
    } catch (err) {
      console.error("Erreur chargement matériels :", err);
      setMaterials([]);
    }
  };

  const getMaterialAssigned = async () => {
    try {
      const res = await axios.get(`/cfp/project-materials/${id}`);
      if (res.status == 200) {
        setProjectMaterials(res.data.materials.material_items);
      } else {
        setProjectMaterials([]);
      }
    } catch (err) {
      console.error("Erreur chargement des matériels du projet :", err);
    }
  };

  const handleAddMaterial = async (materialId) => {
    try {
      await axios.post(`/cfp/project-materials`, {
        project_id: id,
        material_id: materialId,
        number: 1,
      });
      getMaterialAssigned();
      toast.success("Materiel ajouté avec succes!");
    } catch (err) {
      console.error("Erreur ajout matériel :", err);
    }
  };

  const handleNumberChange = (materialId, newNumber) => {
    try {
      setProjectMaterials((prev) =>
        prev.map((m) =>
          m.material_id === materialId ? { ...m, number: newNumber } : m
        )
      );

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        try {
          await projectService.updateNumberMaterial(id, materialId, newNumber);
        } catch (err) {
          console.error("Erreur API :", err);
        }
      }, 300);
    } catch (err) {
      console.error("Erreur mise à jour du nombre :", err);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setFilteredMaterials(materials);
      return;
    }

    const s = search.toLowerCase();

    const filtered = materials.filter(
      (m) =>
        (m.name?.toLowerCase() || "").includes(s) ||
        (m.description?.toLowerCase() || "").includes(s)
    );

    setFilteredMaterials(filtered);
  }, [search, materials]);

  const getMaterialTypeId = (category) => {
    switch (category) {
      case "informatique":
        return 1;
      case "audiovisuel":
        return 2;
      case "mobilier":
        return 3;
      default:
        return 1;
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) return;
    setLoading(true);
    try {
      const response = await axios.post("/cfp/materials", {
        name: formData.name,
        description: formData.description,
        stock_number: formData.quantity,
        material_type_id: getMaterialTypeId(formData.category),
      });
      if (response.data.status === 200) {
        fetchMaterials();
        setShowAddModal(false);
        setFormData({
          name: "",
          description: "",
          category: "informatique",
          status: "disponible",
          quantity: 1,
        });

        fetchMaterials();
        setSearch("");
        handleAddMaterial(response.data.material_id);
      }
    } catch (error) {
      console.error("Erreur d’ajout :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl p-4 mx-auto">
      <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl">
        {/* Titre */}
        <h2 className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <span className="w-full inline-flex !rounded-xl items-center justify-between">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-3 text-gray-700 transition-colors duration-200 hover:text-purple-600 group"
            >
              <div className="p-2 transition-shadow duration-200 bg-white rounded-lg shadow-sm group-hover:shadow-md">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Matériels
                  </h2>
                  <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                    {projectMaterials?.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Gérez les matériels associés à ce projet
                </p>
              </div>
              <div className="ml-2 transition-transform duration-200 group-hover:scale-110">
                {expanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            <div className="flex justify-end w-full pr-4 mt-2">
              <button
                onClick={() => setShowPanel(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-all duration-300 bg-transparent border-2 border-gray-600 shadow-sm rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-medium">Éditer</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </span>
        </h2>

        {/* Contenu principal */}
        <div className="p-2">
          {expanded && (
            <div className="accordion-body">
              {projectMaterials?.length > 0 ? (
                <ul className="space-y-2">
                  {projectMaterials.map((m, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-gray-700">
                          {m.number} {m.material_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {m.description || "Aucune description"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteMaterial(m.material_id)}
                        className="p-2 transition-colors duration-200 rounded-full hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Aucun matériel associé
                  </h3>
                  <p className="mb-6 text-gray-500">
                    Ajoutez des matériels à votre projet
                  </p>
                  <button
                    onClick={() => setShowPanel(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 text-white transition-colors duration-200 bg-cyan-600 rounded-xl hover:bg-cyan-700"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un matériel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showPanel && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-40"
            onClick={() => setShowPanel(false)}
          />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-5xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Ajouter un matériel au projet
                </h2>
              </div>
              <button
                onClick={() => setShowPanel(false)}
                className="p-2 transition-colors rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-hidden">
              <div className="grid h-full grid-cols-2 gap-px bg-gray-200">
                {/* Colonne gauche - Matériaux disponibles */}
                <div className="flex flex-col bg-white">
                  {/* Search bar */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        placeholder="Rechercher un matériel..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full py-2 pr-4 text-sm border border-gray-300 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700">
                      Matériaux disponibles
                    </h3>
                  </div>

                  {/* List */}
                  <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {filteredMaterials.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-3 transition-all border border-gray-200 rounded-lg group hover:border-blue-300 hover:bg-blue-50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {m.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {m.description}
                          </p>
                          <p className="mt-1 text-xs text-gray-600">
                            Nombre:{" "}
                            <span className="font-medium text-gray-900">
                              {m.stock_number}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddMaterial(m.id)}
                          className="p-2 ml-3 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-blue-600 hover:border-blue-600 group-hover:border-blue-600"
                          title="Ajouter"
                        >
                          <Plus className="w-4 h-4 text-gray-600 transition-colors group-hover:text-blue-600 hover:text-white" />
                        </button>
                      </div>
                    ))}
                    {filteredMaterials.length === 0 && (
                      <div className="py-8 text-sm text-center text-gray-500">
                        Aucun matériel trouvé
                        {search.trim() !== "" && (
                          <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            ➕ Ajouter « {search} »
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Colonne droite - Matériaux sélectionnés */}
                <div className="flex flex-col bg-white">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700">
                      Matériaux sélectionnés ({projectMaterials?.length || 0})
                    </h3>
                  </div>

                  {/* List */}
                  <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {projectMaterials &&
                      projectMaterials.map((m) => (
                        <div
                          key={m.material_id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 bg-gray-50"
                        >
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {m.material_name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {m.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max={m.stock_number}
                              value={m.number || 1}
                              onChange={(e) =>
                                handleNumberChange(
                                  m.material_id,
                                  e.target.value
                                )
                              }
                              className="w-16 px-2 py-1.5 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              onClick={() =>
                                handleDeleteMaterial(m.material_id)
                              }
                              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              title="Supprimer"
                            >
                              <Minus className="w-4 h-4 text-gray-400 hover:text-red-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    {projectMaterials.length === 0 && (
                      <div className="py-8 text-sm text-center text-gray-500">
                        Aucun matériel sélectionné
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {showAddModal && (
              <Modal
                title="Nouveau matériel"
                onClose={() => setShowAddModal(false)}
                onConfirm={handleSubmit}
                confirmText={loading ? "Ajout..." : "Ajouter"}
              >
                <FormContent formData={formData} setFormData={setFormData} />
              </Modal>
            )}
            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPanel(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowPanel(false)}
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Valider
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function FormContent({ formData, setFormData }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700">Nom</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Catégorie</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            <option value="informatique">Informatique</option>
            <option value="audiovisuel">Audiovisuel</option>
            <option value="mobilier">Mobilier</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Quantité</label>
          <input
            type="number"
            value={formData.quantity}
            min="1"
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: parseInt(e.target.value),
              })
            }
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose, onConfirm, confirmText, danger }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">{children}</div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium ${
              danger
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
