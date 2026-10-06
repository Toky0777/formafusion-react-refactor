import InputForm from "../../../../components/ui/Input-form";
import ButtonSecondary from "../../../../components/button/ButtonSecondary";

export default function SecondStep({
  onChange,
  formData,
  errors,
  onNext,
  onBack,
}) {
  return (
    <div>
      <div className="space-y-6">
        <InputForm
          label="Date de début"
          type="date"
          value={formData.start_date}
          onChange={(e) => onChange("start_date", e.target.value)}
          error={errors.start_date}
        />
        <InputForm
          label="Date de fin"
          type="date"
          value={formData.end_date}
          onChange={(e) => onChange("end_date", e.target.value)}
          error={errors.end_date}
        />
        <InputForm
          label="Montant demandé"
          type="number"
          value={formData.requested_amount}
          onChange={(e) => onChange("requested_amount", e.target.value)}
          error={errors.requested_amount}
        />

        <div className="flex justify-between pt-4">
          <ButtonSecondary onClick={onBack}>Retour</ButtonSecondary>
          <ButtonSecondary onClick={onNext}>Suivant</ButtonSecondary>
        </div>
      </div>
    </div>
  );
}
