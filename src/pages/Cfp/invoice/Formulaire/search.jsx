import { useEffect, useState, useRef } from "react";
import { AddFolder } from "../../../../components/FactureItems/add-folder";
import { AddItems } from "../../../../components/FactureItems/add-items";
import { AddCours } from "../../../../components/FactureItems/add-cours";
import { AddProject } from "../../../../components/FactureItems/add-project";

export function Search({
  idEtp,
  data,
  setSumFolder,
  setSumItems,
  setSumProject,
  setSumCours,
  isNature,
  isEdit,
  isAcompte,
}) {
  const [items, setItems] = useState([]);
  const [itemsCours, setItemsCours] = useState([]);
  const [items2, setItems2] = useState([]);

  const [OpenFolder, setOpenFolder] = useState(false);
  const [OpenProject, setOpenProject] = useState(false);
  const [OpenItem, setOpenItem] = useState(false);
  const [OpenCours, setOpenCours] = useState(false);

  const [itemCount, setItemCount] = useState(0);
  const [itemCountProjet, setItemCountProjet] = useState(0);
  const [itemCountCours, setItemCountCours] = useState(0);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // État pour la ligne d'acompte
  const [acompteItem, setAcompteItem] = useState({
    item_description: "",
    item_qty: 1,
    idUnite: "",
    item_unit_price: 0,
    item_total_price: 0,
  });

  // Calcul du total pour l'acompte
  useEffect(() => {
    if (isAcompte) {
      const total = acompteItem.item_qty * acompteItem.item_unit_price;
      setAcompteItem(prev => ({ ...prev, item_total_price: total }));
      setSumItems(total); // Utiliser setSumItems pour le total de l'acompte
    }
  }, [acompteItem.item_qty, acompteItem.item_unit_price, isAcompte, setSumItems]);

  // Fermer le dropdown au clic en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // initialisation si edition
  useEffect(() => {
    if (isEdit === "facture") {
      let currentIndex = itemCountProjet;
      const updatedItems = data.invoiceDetailsProjets.map((details) => ({
        id: currentIndex++,
        idProjet: details.idProjet,
        idItems: 0,
        item_description: details.item_description || "",
        item_qty: details.item_qty,
        idUnite: details.idUnite,
        unit_name: details.unit_name,
        item_unit_price: parseInt(details.item_unit_price),
        item_total_price: parseInt(details.item_total_price),
      }));
      setItems(updatedItems);
      setItemCountProjet(currentIndex);
      setOpenProject(true);

      let currentIndexFrais = itemCount;
      const updatedFrais = data.invoiceDetails.map((details) => ({
        id: currentIndexFrais++,
        idFrais: details.idItems,
        frais: details.Frais,
        description: details.item_description || "",
        qty: details.item_qty,
        idUnite: details.idUnite,
        unitPrice: parseInt(details.item_unit_price),
        unit_name: details.unit_name,
        item_total_price: parseInt(details.item_total_price),
      }));
      setItems2(updatedFrais);
      setItemCount(currentIndexFrais);
      setOpenItem(true);
    }

    if (isEdit === "proforma") {
      let currentIndexFrais = itemCount;
      const updatedFrais = data.invoiceDetails.map((details) => ({
        id: currentIndexFrais++,
        idFrais: details.idItems,
        frais: details.Frais,
        description: details.item_description || "",
        qty: details.item_qty,
        idUnite: details.idUnite,
        unitPrice: parseInt(details.item_unit_price),
        unit_name: details.unit_name,
        item_total_price: parseInt(details.item_total_price),
      }));
      setItems2(updatedFrais);
      setItemCount(currentIndexFrais);
      setOpenItem(true);

      let currentIndexCours = itemCountCours;
      const updatedCours = data.invoiceDetailsCours.map((details) => ({
        id: currentIndexCours++,
        idModule: details.idModule,
        idItems: details.idItems,
        item_description: details.item_description || "",
        item_qty: details.item_qty,
        idUnite: details.idUnite,
        item_unit_price: parseInt(details.item_unit_price),
        unit_name: details.unit_name,
        item_total_price: parseInt(details.item_total_price),
      }));
      setItemsCours(updatedCours);
      setItemCountCours(currentIndexCours);
      setOpenCours(true);
    }

    // Initialisation pour les acomptes en édition
    if (isEdit === "acompte" && data.invoiceDetails && data.invoiceDetails.length > 0) {
      const acompteDetail = data.invoiceDetails[0]; // Prendre le premier détail
      setAcompteItem({
        item_description: acompteDetail.item_description || "Acompte",
        item_qty: acompteDetail.item_qty || 1,
        idUnite: acompteDetail.idUnite || "",
        item_unit_price: parseFloat(acompteDetail.item_unit_price) || 0,
        item_total_price: parseFloat(acompteDetail.item_total_price) || 0,
      });
    }
  }, [isEdit, data]);

  const addItem = (type) => {
    if (!idEtp) {
      alert("Veuillez sélectionner un client d'abord");
      return;
    }
    if (type === "addFolder") setOpenFolder(true);
    if (type === "addProject") {
      setItems((prev) => [
        ...prev,
        {
          id: itemCountProjet,
          idProjet: "",
          item_description: "",
          item_qty: 0,
          idUnite: "",
          item_unit_price: 0,
          item_total_price: 0,
        },
      ]);
      setItemCountProjet((prev) => prev + 1);
      setOpenProject(true);
    }
  };

  const handleAddCours = () => {
    setItemsCours((prev) => [
      ...prev,
      {
        id: itemCountCours,
        idProjet: "",
        item_description: "",
        item_qty: 0,
        idUnite: "",
        item_unit_price: 0,
        item_total_price: 0,
        unit_name: "",
      },
    ]);
    setItemCountCours((prev) => prev + 1);
    setOpenCours(true);
  };

  const handleAddItem = (fraisData) => {
    setItems2((prev) => [
      ...prev,
      {
        id: itemCount,
        idProjet: "",
        idFrais: fraisData.idFrais,
        frais: fraisData.frais,
        description: fraisData.description,
        qty: 1,
        idUnite: "",
        unitPrice: "",
        item_total_price: "",
        unit_name: "",
      },
    ]);
    setItemCount((prev) => prev + 1);
    setOpenItem(true);
  };

  // Gestion des changements pour l'acompte
  const handleAcompteChange = (field, value) => {
    setAcompteItem(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div id="projectInvoicesContainer">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="w-1/4 p-2 font-semibold text-center text-gray-500">
              Services
            </th>
            <th className="w-1/4 p-2 font-semibold text-center text-gray-500">
              Description
            </th>
            <th className="w-1/12 p-2 font-semibold text-center text-gray-500">
              Quantité
            </th>
            <th className="w-1/12 p-2 font-semibold text-center text-gray-500">
              Unité
            </th>
            <th className="p-2 font-semibold text-center text-gray-500">
              Prix unitaire
            </th>
            <th className="p-2 font-semibold text-center text-gray-500">
              Montant
            </th>
            {!isAcompte && (
              <th className="p-2 font-semibold text-center text-gray-500">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {/* Afficher seulement le dropdown si ce n'est pas un acompte */}
          {!isAcompte && (
            <tr className="border-b">
              <td className="px-4 py-2">
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 font-semibold text-purple-600"
                  >
                    Ajouter un service <span className="text-red-500">*</span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-50 w-56 mt-2 bg-white border rounded shadow-lg">
                      {(isNature === "facture" || isEdit === "facture") && (
                        <>
                          <div
                            onClick={() => addItem("addFolder")}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          >
                            <span className="font-semibold">Dossier</span>
                            <br />
                            <span className="text-sm text-gray-500">
                              Projet / Entreprise
                            </span>
                          </div>
                          <div
                            onClick={() => addItem("addProject")}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          >
                            <span className="font-semibold">Projet</span>
                            <br />
                            <span className="text-sm text-gray-500">
                              Cours / Formation
                            </span>
                          </div>
                        </>
                      )}
                      {(isNature === "proforma" || isEdit === "proforma") && (
                        <div
                          onClick={handleAddCours}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          <span className="font-semibold">Cours</span>
                          <br />
                          <span className="text-sm text-gray-500">
                            Catalogue / Formation
                          </span>
                        </div>
                      )}
                      {data.fv.map((fraisv) => (
                        <div
                          key={fraisv.idFrais}
                          onClick={() =>
                            handleAddItem({
                              frais: fraisv.Frais,
                              description: fraisv.exemple,
                              idFrais: fraisv.idFrais,
                            })
                          }
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold uppercase">
                              {fraisv.Frais}
                            </span>
                            <span className="text-sm text-gray-500">
                              {fraisv.exemple}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          )}

          {/* Ligne unique pour les acomptes */}
          {isAcompte && (
            <tr className="border-b bg-slate-50">
              <td className="px-4 py-2">
                <p className="text-base font-semibold text-gray-700 capitalize">Acompte</p>
                <input type="hidden" name="service" value="Acompte" />
              </td>
              <td className="px-4 py-2">
                <textarea
                  type="text"
                  name="item_description"
                  value={acompteItem.item_description}
                  onChange={(e) => handleAcompteChange('item_description', e.target.value)}
                  placeholder="Description de l'acompte"
                  className="w-full p-2 text-base text-gray-500 border rounded-md outline-none"
                  required
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  name="item_qty"
                  value={acompteItem.item_qty}
                  onChange={(e) => handleAcompteChange('item_qty', parseInt(e.target.value) || 0)}
                  min="1"
                  className="w-full p-2 text-base text-center text-gray-500 border rounded-md outline-none"
                  required
                />
              </td>
              <td className="px-4 py-2">
                <select
                  name="idUnite"
                  value={acompteItem.idUnite}
                  onChange={(e) => handleAcompteChange('idUnite', e.target.value)}
                  className="p-2 text-base border rounded-md focus:outline-none focus:ring-purple-500 focus:ring-1"
                  required
                >
                  <option value="">Sélectionner</option>
                  {data.unites.map((unite) => (
                    <option key={unite.idUnite} value={unite.idUnite}>
                      {unite.unite_name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  name="item_unit_price"
                  value={acompteItem.item_unit_price}
                  onChange={(e) => handleAcompteChange('item_unit_price', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  className="w-full p-2 text-base text-right text-gray-500 border rounded-md outline-none"
                  required
                />
              </td>
              <td className="px-4 text-right">
                <p className="w-full p-2 text-base text-right text-gray-500 border rounded-md">
                  {acompteItem.item_total_price || "0.00"}
                </p>
                <input
                  type="hidden"
                  name="item_total_price"
                  value={acompteItem.item_total_price}
                  readOnly
                />
              </td>
            </tr>
          )}

          {/* Les autres composants ne s'affichent pas pour les acomptes */}
          {!isAcompte && (
            <>
              {OpenFolder && (
                <AddFolder
                  clientId={idEtp}
                  unites={data.unites}
                  setSumFolder={setSumFolder}
                />
              )}
              {OpenProject && (
                <AddProject
                  items={items}
                  setItems={setItems}
                  unites={data.unites}
                  clientId={idEtp}
                  setSumProject={setSumProject}
                  isEdit={isEdit}
                />
              )}
              {OpenItem && (
                <AddItems
                  items2={items2}
                  setItems2={setItems2}
                  unites={data.unites}
                  setSumItems={setSumItems}
                  isNature={isNature}
                  isEdit={isEdit}
                />
              )}
              {OpenCours && (
                <AddCours
                  items={itemsCours}
                  setItems={setItemsCours}
                  data={data}
                  setSumCours={setSumCours}
                  isEdit={isEdit}
                />
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}