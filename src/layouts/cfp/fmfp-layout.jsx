import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ButtonSecondary from "../../components/button/ButtonSecondary";
import { Plus } from "lucide-react";
import { useFmfp } from "../../hooks/cfp/useFmfp";

export default function FmfpLayout() {
  const {
    getAllProjectsFmfp,
    projects,
    status,
    entreprises,
    loading,
    mdls,
    types,
    show,
    deleteFmpf,
    getAllComments,
    commentFolder,
    store,
    update,
    changeStatus,
    deleteComment,
    getAllEtps,
    changeStatusWithCreatingProject,
  } = useFmfp();
  const location = useLocation();
  const navigate = useNavigate();

  const showButton =
    location.pathname.startsWith("/cfp/fmfp") &&
    !location.pathname.startsWith("/cfp/fmfp/nouveau") &&
    location.pathname !== "/cfp/fmfp/details";

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold">Dossier Fmfp</h1>
        <div className="flex">
          {showButton && (
            <ButtonSecondary onClick={() => navigate("/cfp/fmfp/nouveau")}>
              <Plus size={16} />
              Nouveau
            </ButtonSecondary>
          )}
        </div>
      </div>

      <main className="relative mt-10 mx-4">
        <Outlet
          context={{
            getAllProjectsFmfp,
            update,
            store,
            getAllComments,
            commentFolder,
            changeStatus,
            deleteComment,
            types,
            mdls,
            projects,
            loading,
            status,
            entreprises,
            show,
            deleteFmpf,
            getAllEtps,
            changeStatusWithCreatingProject,
          }}
        />
      </main>
    </div>
  );
}
