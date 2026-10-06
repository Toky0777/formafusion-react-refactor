import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";

export default function ManageButton({
  editingCell,
  onCancel,
  onSave,
  isSaving,
}) {
  const isEditing =
    editingCell.idProjet != null &&
    editingCell.idEmploye != null &&
    editingCell.idSkill !== null;

  return (
    <div>
      {isEditing && (
        <div>
          <div className="flex gap-2">
            <ButtonPrimary onClick={onSave} disabled={isSaving}>
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Enregistrement...
                </div>
              ) : (
                "Enregistrer"
              )}
            </ButtonPrimary>

            <ButtonSecondary onClick={onCancel} disabled={isSaving}>
              Annuler
            </ButtonSecondary>
          </div>
        </div>
      )}
    </div>
  );
}
