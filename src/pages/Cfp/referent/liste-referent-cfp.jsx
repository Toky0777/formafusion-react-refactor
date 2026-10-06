import { useEffect } from "react";
import CardReferent from "./card-referent";
import LoadingSpinner from "../../../components/ui/loading-spinner";
import { Users } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import ReferentAddModal from "./add-referent-drawer";

export default function ListReferentCfp() {
  const {
    referent,
    loading,
    getReferent,
    editReferent,
    updateInfoReferent,
    updatePhotoReferent,
    deleteReferent,
    updatePassword,
  } = useOutletContext();

  const { open, setOpen } = useOutletContext();

  useEffect(() => {
    getReferent();
  }, []);
  return (
    <div>
      <div>
        {loading ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : referent.length === 0 ? (
          <div className="flex justify-center items-center h-[30vh] gap-5">
            <Users size={30} />
            <h1 className="">Aucune résulat trouvée</h1>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-3 gap-5">
              {referent?.map((r, index) => (
                <div key={index}>
                  <CardReferent
                    referent={r}
                    editReferent={editReferent}
                    onUpdateInfoReferent={updateInfoReferent}
                    onUpdatePhotoReferent={updatePhotoReferent}
                    onUpdatePassword={updatePassword}
                    onRemove={deleteReferent}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {open && (
        <ReferentAddModal
          isOpen={open}
          onClose={() => setOpen(false)}
          getReferent={getReferent}
        />
      )}
    </div>
  );
}
