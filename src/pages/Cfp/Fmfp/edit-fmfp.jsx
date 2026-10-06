import { useState, useEffect } from "react";
import DrawerParent from "../../../components/drawer/drawer-parent";
import InputForm from "../../../components/ui/Input-form";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import { Loader2 } from "lucide-react";
import SelectMultiple from "../../../components/ui/SelectMultiple";

export default function EditFmfp({
  onClose,
  isOpen,
  data,
  mdls,
  isLoading,
  onUpdate,
  status_name,
}) {
  const [formData, setFormData] = useState({
    code: "",
    requested_amount: "",
    approved_amount: "",
    start_date: "",
    end_date: "",
    first_deposit: "",
    date_first_deposit: "",
    second_deposit: "",
    date_second_deposit: "",
    idModule: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      const moduleIds = data.modules
        ? data.modules.map((module) => module.idModule)
        : [];
      setFormData({
        requested_amount: data.requested_amount || "",
        approved_amount: data.approved_amount || "",
        start_date: data.start_date || "",
        end_date: data.end_date || "",
        code: data.code || "",
        first_deposit: data.first_deposit || "",
        date_first_deposit: data.date_first_deposit || "",
        second_deposit: data.second_deposit || "",
        date_second_deposit: data.date_second_deposit || "",
        idModule: moduleIds,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModuleChange = (selectedModules) => {
    setFormData((prev) => ({
      ...prev,
      idModule: selectedModules,
    }));
  };
  const validateForm = () => {
    const newErrors = {};

    if (formData.first_deposit && !formData.date_first_deposit) {
      newErrors.date_first_deposit = "La date du premier acompte est requis";
    }

    if (formData.second_deposit && !formData.date_second_deposit) {
      newErrors.date_second_deposit = "La date du deuxième acompte est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return null;
    const newData = {
      code: formData.code,
      approved_amount: formData.approved_amount,
      start_date: formData.start_date,
      end_date: formData.end_date,
      requested_amount: formData.requested_amount,
      first_deposit: Number(formData.first_deposit),
      date_first_deposit: formData.date_first_deposit,
      second_deposit: Number(formData.second_deposit),
      date_second_deposit: formData.date_second_deposit,
      idModule: formData.idModule,
    };

    setSubmitting(true);

    try {
      const res = await onUpdate(newData, data.id);

      if (res.status === 200) {
        toastr.success(res.data.message);
        onClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DrawerParent title="Éditer" onClose={onClose} isOpen={isOpen}>
      {isLoading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <span className="p-6 text-center text-gray-400 italic text-sm">
            Chargement...
          </span>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-2 ">
          <div>
            <InputForm
              label="Code"
              name="code"
              type="text"
              value={formData.code}
              onChange={handleChange}
            />
          </div>
          <div>
            <SelectMultiple
              label="Formation(s)"
              data={mdls}
              optionLabel="moduleName"
              optionValue="idModule"
              onChange={handleModuleChange}
              value={formData.idModule}
              error={errors.module}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <InputForm
              label="Date de début"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
            />
            <InputForm
              label="Date de fin"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>

          <InputForm
            label="Montant demandé"
            name="requested_amount"
            type="number"
            value={formData.requested_amount}
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-2">
            <InputForm
              label="Premier acompte "
              name="first_deposit"
              type="number"
              value={formData.first_deposit}
              onChange={handleChange}
              placeholder="1 200 000 "
            />
            <InputForm
              label="Date premier acompte"
              name="date_first_deposit"
              type="date"
              value={formData.date_first_deposit}
              onChange={handleChange}
              disabled={!formData.first_deposit}
              error={errors.date_first_deposit}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <InputForm
              label="Deuxième acompte"
              name="second_deposit"
              type="number"
              value={formData.second_deposit}
              onChange={handleChange}
              placeholder="1 200 000 "
            />
            <InputForm
              label="Date deuxième acompte"
              name="date_second_deposit"
              type="date"
              value={formData.date_second_deposit}
              onChange={handleChange}
              disabled={!formData.second_deposit}
              error={errors.date_second_deposit}
            />
          </div>

          <InputForm
            label="Montant approuvé"
            name="approved_amount"
            type="number"
            value={formData.approved_amount}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-200 disabled:opacity-70 flex items-center disabled:cursor-not-allowed"
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting && <Loader2 className="animate-spin" size={18} />}
              <span className="ml-2">
                {submitting ? "Enregistrement..." : "Enregistrer"}
              </span>
            </button>
          </div>
        </form>
      )}
    </DrawerParent>
  );
}
