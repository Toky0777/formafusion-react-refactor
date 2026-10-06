import React, { useEffect, useState } from "react";
import useApi from "../../hooks/Api";

export function AddFolder({ clientId, unites, setSumFolder }) {
  const [dossiers, setDossiers] = useState([]);
  const [dossiersId, setDossiersId] = useState(null);
  const [projets, setProjets] = useState([]);
  const [itemProDossier, setItemProDossier] = useState(500);
  const { callApi } = useApi();
  const fetchProjets = async (dossierId) => {
    try {
      const response = await callApi(`/cfp/factures/projets/${dossierId}`, {
        method: "GET",
      });
      setProjets((prevProjets) => [
        ...prevProjets,
        ...response.map((projet, index) => ({
          ...projet,
          key: itemProDossier + index,
          totalPrice: 0,
          qty: 0,
          unitPrice: 0,
        })),
      ]);
      setItemProDossier((prev) => prev + response.length);
    } catch (err) {
      alert("Erreur lors du chargement des projets.", err);
    }
  };
  // Ce hook s’exécute quand dossierId change
  React.useEffect(() => {
    if (dossiersId) {
      fetchProjets(dossiersId);
    }
  }, [dossiersId]);
  useEffect(() => {
    if (!clientId) return;

    const fetchData = async () => {
      try {
        const response = await callApi(`/cfp/factures/dossiers/${clientId}`, {
          method: "GET",
        });

        setDossiers(response);
      } catch (error) {
        alert("Erreur lors du chargement des dossiers.");
        console.error(error);
      }
    };

    fetchData();
  }, [clientId]);

  const handleChange = (event) => {
    const dossierId = event.target.value;
    if (dossierId) {
      setDossiersId(dossierId);
    }
  };

  const removeProjet = (key) => {
    setProjets((prevProjets) => {
      const newProjets = prevProjets.filter((projet) => projet.key !== key);
      const sommeTotale = newProjets.reduce(
        (acc, projet) => acc + (projet.totalPrice || 0),
        0
      );
      setSumFolder(sommeTotale);
      return newProjets;
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...projets];
    updatedItems[index][field] = value;

    if (field === "qty" || field === "unitPrice") {
      const qty = parseFloat(updatedItems[index].qty) || 0;
      const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
      updatedItems[index].totalPrice = qty * unitPrice;
    }

    const sommeTotale = updatedItems.reduce(
      (acc, projet) => acc + (projet.totalPrice || 0),
      0
    );
    setProjets(updatedItems);
    setSumFolder(sommeTotale);
  };

  return (
    <>
      <tr className="border-b bg-slate-50 dossier-row">
        <td className="px-4 text-sm text-gray-700" colSpan={7}>
          <div className="inline-flex items-center gap-2">
            <div className="inline-flex items-center justify-between w-full gap-2">
              <label className="inline-flex items-center flex-1 text-base font-semibold">
                Dossier
              </label>
              <select
                className="p-2 text-base border rounded-md focus:outline-none focus:ring-purple-500 focus:ring-1 w-full"
                defaultValue=""
                onChange={handleChange}
              >
                <option value="" disabled>
                  Sélectionner un Dossier
                </option>
                {dossiers.map((dossier) => (
                  <option key={dossier.idDossier} value={dossier.idDossier}>
                    {dossier.nomDossier}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </td>
      </tr>
      {dossiersId &&
        projets.map((projet, index) => (
          <tr key={projet.key} className="border-b bg-slate-50 item-row">
            <td className="px-4 text-sm text-gray-700">
              <p>
                {projet.module_name} |{" "}
                {projet.project_reference || "Référence inconnue"} |{" "}
                {projet.dateDebut}
              </p>
              <input
                type="number"
                className="hidden"
                name={`items[${projet.key}][idProjet]`}
                id={`idProjet-${projet.key}`}
                value={projet.idProjet}
                readOnly
              />
              <input
                type="number"
                className="hidden"
                name={`items[${projet.key}][idItems]`}
                value="0"
                readOnly
              />
            </td>
            <td className="px-4 text-sm">
              <textarea
                name={`items[${projet.key}][item_description]`}
                className="w-full p-2 text-base text-gray-500 border rounded-md outline-none"
                placeholder="Ecrire votre description"
              />
            </td>
            <td className="px-4 text-sm">
              <input
                type="number"
                name={`items[${projet.key}][item_qty]`}
                min="1"
                value={projet.qty}
                onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                className="w-full p-2 text-base text-center text-gray-500 border rounded-md outline-none item-quantity"
              />
            </td>
            <td className="px-4 text-sm">
              <select
                name={`items[${projet.key}][idUnite]`}
                className="p-2 text-base border rounded-md focus:outline-none focus:ring-purple-500 focus:ring-1"
                required
              >
                {unites.map((unite) => (
                  <option key={unite.idUnite} value={unite.idUnite}>
                    {unite.unite_name}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-4 text-sm">
              <input
                type="number"
                name={`items[${projet.key}][item_unit_price]`}
                required
                value={projet.unitPrice}
                onChange={(e) =>
                  handleItemChange(index, "unitPrice", e.target.value)
                }
                className="w-full p-2 text-base text-right text-gray-500 border rounded-md outline-none item-unit-price"
                placeholder="Prix unitaire"
              />
            </td>
            <td className="px-4 text-sm">
              <p className="w-full p-2 text-base text-right text-gray-500 border rounded-md">
                {projet.totalPrice || "0.00"}
              </p>
              <input
                type="hidden"
                name={`items[${projet.key}][item_total_price]`}
                className="item-total-price"
                value={projet.totalPrice}
                readOnly
              />
            </td>
            <td className="px-4 text-sm text-right cursor-pointer remove-item">
              <i
                onClick={() => removeProjet(projet.key)}
                className="text-base text-red-500 fa-solid fa-trash-can"
              ></i>
            </td>
          </tr>
        ))}
    </>
  );
}
