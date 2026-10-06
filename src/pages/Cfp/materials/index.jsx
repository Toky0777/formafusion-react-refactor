import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Info,
  AlertTriangleIcon,
  XCircle,
  CheckCircle,
  Tag,
} from "lucide-react";
import axios from "../../../config/axios";

export default function MaterialsManagement() {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [materialToUpdate, setMaterialToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [materialCount, setMaterialCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = React.useState({
    message: "",
    type: "",
  });
  const [showNotification, setShowNotification] = React.useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "informatique",
    status: "disponible",
    quantity: 1,
  });

    const getNotificationConfig = (type) => {
      const configs = {
        success: {
          bg: "bg-gradient-to-r from-green-50 to-emerald-50",
          border: "border-green-200",
          text: "text-green-800",
          icon: CheckCircle,
          iconColor: "text-green-600",
          progressBar: "bg-green-500",
        },
        error: {
          bg: "bg-gradient-to-r from-red-50 to-rose-50",
          border: "border-red-200",
          text: "text-red-800",
          icon: XCircle,
          iconColor: "text-red-600",
          progressBar: "bg-red-500",
        },
        warning: {
          bg: "bg-gradient-to-r from-yellow-50 to-amber-50",
          border: "border-yellow-200",
          text: "text-yellow-800",
          icon: AlertTriangleIcon,
          iconColor: "text-yellow-600",
          progressBar: "bg-yellow-500",
        },
        info: {
          bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
          border: "border-blue-200",
          text: "text-blue-800",
          icon: Info,
          iconColor: "text-blue-600",
          progressBar: "bg-blue-500",
        },
      };
      return configs[type] || configs.info;
  };

  const config = getNotificationConfig(notification.type);
  const IconComponent = config.icon;


  useEffect(() => {
    fetchMaterials();
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      setFilteredMaterials(
        materials.filter(
          (m) =>
            (m.name && m.name.toLowerCase().includes(lowerSearch)) ||
            (m.description && m.description.toLowerCase().includes(lowerSearch))
        )
      );
    } else {
      setFilteredMaterials(materials);
    }
  }, [searchTerm, materials]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/cfp/materials");
      if (response.data.status === 200) {
        const data = response.data.materials.material_items.data;
        setMaterials(data);
        setFilteredMaterials(data);
        setMaterialCount(response.data.materials.material_count);
        setTotalPages(response.data.materials.material_items.last_page);
      }
    } catch (error) {
      console.error("Erreur de chargement :", error);
    } finally {
      setLoading(false);
    }
  };

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
      }
    } catch (error) {
      console.error("Erreur d’ajout :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/cfp/materials/${id}`);
      if (response.data.status === 200) {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
        setFilteredMaterials((prev) => prev.filter((m) => m.id !== id));
        setMaterialToDelete(null);
        setShowDeleteModal(false);
      } 
    } catch (error) {
      console.error("Erreur de suppression :", error);
      if (error.response && error.response.status === 500){
        setShowDeleteModal(false);
        setNotification({
          message: "Ce matériel est associé à un projet.",
          type: "error",
        });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    }
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    try {
      const response = await axios.patch(`/cfp/materials/${id}`, {
        name: formData.name,
        description: formData.description,
        stock_number: formData.quantity,
        material_type_id: formData.category,
      });
      if (response.data.status === 200) {
        fetchMaterials();
        setShowUpdateModal(false);
      }
    } catch (err) {
      console.error("Erreur de mise à jour :", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
         {showNotification && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[500] animate-in slide-in-from-top-4 duration-300">
              <div
                className={`
                    relative max-w-md w-full mx-auto
                    ${config.bg} ${config.border} border-2
                    rounded-xl shadow-lg backdrop-blur-sm
                    overflow-hidden
                  `}
              >
                {/* Barre de progression */}
                <div className="absolute top-0 left-0 h-1 w-full bg-gray-200">
                  <div
                    className={`h-full ${config.progressBar} animate-progress`}
                    style={{
                      animation: "progress 4s linear forwards",
                    }}
                  />
                </div>
    
                {/* Contenu */}
                <div className="p-4 flex items-start space-x-3">
                  {/* Icône */}
                  <div className={`flex-shrink-0 ${config.iconColor}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
    
                  {/* Message */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${config.text} leading-5`}>
                      {notification.message}
                    </p>
                  </div>
    
                  {/* Bouton fermer */}
                  <button
                    onClick={() => setShowNotification(false)}
                    className={`flex-shrink-0 ${config.text} hover:opacity-70 transition-opacity`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
    
                {/* Animation de pulsation pour les notifications importantes */}
                {(notification.type === "error" ||
                  notification.type === "warning") && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className={`absolute inset-0 ${config.border} border-2 rounded-xl animate-ping opacity-20`}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <style jsx>{`
            @keyframes progress {
              from {
                width: 100%;
              }
              to {
                width: 0%;
              }
            }
    
            .animate-progress {
              animation: progress 4s linear forwards;
            }
    
            @keyframes slide-in-from-top {
              from {
                opacity: 0;
                transform: translate(-50%, -20px);
              }
              to {
                opacity: 1;
                transform: translate(-50%, 0);
              }
            }
    
            .animate-in {
              animation: slide-in-from-top 0.3s ease-out;
            }
          `}</style>
           <div className="min-h-screen bg-gray-50 p-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                  Gestion des matériels
                </h1>
                <p className="text-gray-500">
                  Gérez facilement vos stocks et équipements.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
                  />
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-gray-200 to-gray-200 text-gray-600 rounded-lg hover:bg-indigo-700 transition-all"
                >
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </div>

              {/* Materials */}
              {loading ? (
                <div className="text-center text-gray-500 py-16">Chargement...</div>
              ) : filteredMaterials.length === 0 ? (
                <div className="text-center text-gray-500 py-16">
                  Aucun matériel trouvé.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredMaterials.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-600" />
                          {m.name}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setMaterialToUpdate(m);
                              setShowUpdateModal(true);
                              setFormData({
                                name: m.name,
                                description: m.description,
                                category: m.material_type_id,
                                quantity: m.stock_number,
                                status: m.status,
                              });
                            }}
                            className="p-1.5 rounded-md hover:bg-gray-100"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => {
                              setMaterialToDelete(m);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 rounded-md hover:bg-gray-100"
                          >
                            <Trash2 className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      <div>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                        {m.description || "Aucune description"}
                      </p>

                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4 text-gray-500" />
                          Quantité : {m.stock_number}
                        </span>
                        <span className="capitalize"></span>
                      </div>
                    </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal Ajout */}
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

              {/* Modal Update */}
              {showUpdateModal && (
                <Modal
                  title="Modifier le matériel"
                  onClose={() => setShowUpdateModal(false)}
                  onConfirm={() => handleUpdate(materialToUpdate.id)}
                  confirmText={loading ? "Enregistrement..." : "Modifier"}
                >
                  <FormContent formData={formData} setFormData={setFormData} />
                </Modal>
              )}

              {/* Modal Delete */}
              {showDeleteModal && (
                <Modal
                  title="Confirmer la suppression"
                  onClose={() => setShowDeleteModal(false)}
                  onConfirm={() => handleDelete(materialToDelete.id)}
                  confirmText="Supprimer"
                  danger
                >
                  <p className="text-gray-600">
                    Êtes-vous sûr de vouloir supprimer{" "}
                    <strong>{materialToDelete.name}</strong> ?
                  </p>
                </Modal>
              )}
            </div>
    </>
  );
}

/* --- Composants réutilisables --- */
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
              setFormData({ ...formData, quantity: parseInt(e.target.value) })
            }
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
