import SelectForm from "../../../../components/ui/SelectForm";
import InputForm from "../../../../components/ui/Input-form";
import SelectMultiple from "../../../../components/ui/SelectMultiple";
import ButtonSecondary from "../../../../components/button/ButtonSecondary";

export default function FirstStep({
  onChange,
  errors,
  types,
  mdls,
  formData,
  onNext,
}) {
  return (
    <div>
      <div>
        <div className="space-y-6">
          <SelectForm
            label="Type"
            value={formData.type}
            onChange={(e) => onChange("type", e.target.value)}
            optionLabel="type_description"
            optionValue="idType"
            data={types}
            error={errors.type}
          />
          {Number(formData.type) === 3 && (
            <InputForm
              placeholder="AP-21, AP-18"
              label="Type de AP"
              value={formData.ap_name}
              onChange={(e) => onChange("ap_name", e.target.value)}
              error={errors.ap_name}
            />
          )}

          <SelectMultiple
            label="Formation(s)"
            data={mdls}
            optionLabel="moduleName"
            optionValue="idModule"
            value={formData.idModule}
            onChange={(newValues) => onChange("idModule", newValues)}
            error={errors.module}
          />

          <div className="flex justify-end pt-4">
            <ButtonSecondary onClick={onNext}>Suivant</ButtonSecondary>
          </div>
        </div>
      </div>
    </div>
  );
}
