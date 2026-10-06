import { Outlet } from "react-router-dom";
import NavbarReferent from "../components/navbar/navbar-referent";
import { useState } from "react";
import { useReferent } from "../hooks/cfp/useReferent";

export function ReferentContent() {
  const [open, setOpen] = useState(false);
  const {
    referent,
    loading,
    getReferent,
    editReferent,
    updateInfoReferent,
    updatePhotoReferent,
    deleteReferent,
    updatePassword,
    isAdmin,
  } = useReferent();
  return (
    <>
      <NavbarReferent setOpen={setOpen} isAdmin={isAdmin} />
      <Outlet
        context={{
          open,
          setOpen,
          referent,
          loading,
          getReferent,
          editReferent,
          updateInfoReferent,
          updatePhotoReferent,
          deleteReferent,
          updatePassword,
        }}
      />
    </>
  );
}
