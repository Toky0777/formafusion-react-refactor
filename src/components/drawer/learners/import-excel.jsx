import { ChevronLeft, Loader2, Save, Upload } from "lucide-react";
import { useState, useRef } from "react";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import SelectForm from "../../ui/SelectForm";
import T from "../../translate/AutoTranslator";

export default function ImportExcelApprenant({
  entreprises,
  onPrevious,
  addExcel,
  closeModal,
}) {
  const [formData, setFormData] = useState({
    idEntrepriseExcel: "",
    data: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
    setError(null);
  };

  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!formData.idEntrepriseExcel || !formData.data) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formDataToSend = new FormData();
      formDataToSend.append("idEntrepriseExcel", formData.idEntrepriseExcel);
      formDataToSend.append("data", formData.data);

      const res = await addExcel(formDataToSend);
      if (res.status === 200) {
        toastr.success(res.message);
        closeModal();
      } else {
        toastr.error("Erreur d'importation");
      }

      setFormData({
        idEntrepriseExcel: "",
        data: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toastr.error(
        error?.response?.data.error || "Erreur lors de l'importation"
      );

      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className="flex gap-2 items-center text-sm cursor-pointer"
        onClick={onPrevious}
      >
        <ChevronLeft />
        <span>
          <T>Retour</T>
        </span>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p className="text-sm text-blue-800">
          <T>
            Importez plusieurs apprenants à la fois en utilisant un fichier
            Excel
          </T>
        </p>
      </div>

      <div className="space-y-2">
        <SelectForm
          label="Entreprise"
          name="idEntrepriseExcel"
          value={formData.idEntrepriseExcel}
          onChange={handleChange}
          optionLabel="etp_name"
          optionValue="idEtp"
          data={entreprises}
        />
      </div>

      <div
        className={`border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors ${
          loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        onClick={!loading ? handleClickUpload : undefined}
      >
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-gray-600 mb-2">
          <T>Glissez votre fichier Excel ici</T>
        </p>
        <p className="text-sm text-gray-400">
          <T>ou cliquez pour parcourir</T>
        </p>

        <input
          type="file"
          name="data"
          accept=".xls,.xlsx"
          ref={fileInputRef}
          className="hidden"
          onChange={handleChange}
          disabled={loading}
        />

        {formData.data && (
          <p className="mt-4 text-sm text-green-600 font-medium">
            <T> Fichier sélectionné</T> : {formData.data.name}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-70 flex items-center disabled:cursor-not-allowed"
          disabled={!formData.data || !formData.idEntrepriseExcel || loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          <span className="ml-2">
            {loading ? <T>Ajout...</T> : <T>Ajouter</T>}
          </span>
        </button>
      </div>
    </div>
  );
}
