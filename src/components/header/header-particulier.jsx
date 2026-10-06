import { useState } from "react";
import DrawerAddParticulier from "../drawer/particulier/DrawerAddParticulier";
import AddFormParticulier from "../forms/AddFormParticulier";
import { Plus } from "lucide-react";
import ButtonPrimary from "../button/ButtonPrimary";

export default function HeaderParticulier({ onAdd }) {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl">Particuliers</h1>
        <ButtonPrimary onClick={() => setShowDrawer(true)}>
          <Plus />
          Nouveau
        </ButtonPrimary>
      </div>

      {showDrawer && (
        <DrawerAddParticulier
          isOpen={showDrawer}
          onClose={() => setShowDrawer(false)}
        >
          <AddFormParticulier
            onAdd={onAdd}
            onClose={() => setShowDrawer(false)}
          />
        </DrawerAddParticulier>
      )}
    </div>
  );
}
