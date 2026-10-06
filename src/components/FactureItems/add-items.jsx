import { useEffect } from "react";

export function AddItems({ items2, setItems2, unites, setSumItems, isNature, isEdit }) {
  const calculerSommeTotale = (items) =>
    items.reduce((acc, item) => acc + (parseFloat(item.item_total_price) || 0), 0);

  
  useEffect(() => {
    setSumItems(calculerSommeTotale(items2));
  }, [isEdit, items2,setSumItems]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items2];
    const updatedItem = { ...updatedItems[index], [field]: value };

    if (field === "qty" || field === "unitPrice") {
      const qty = parseFloat(updatedItem.qty) || 0;
      const unitPrice = parseFloat(updatedItem.unitPrice) || 0;
      const total = qty * unitPrice;
      updatedItem.item_total_price = total;
    }

    updatedItems[index] = updatedItem;
    setItems2(updatedItems);
    setSumItems(calculerSommeTotale(updatedItems));
  };

  const handleRemoveItem = (index) => {
    const newItems = items2.filter((_, i) => i !== index);
    setItems2(newItems);
    setSumItems(calculerSommeTotale(newItems));
  };

  return (
    <>
      {items2.map((item, index) => (
        <tr key={ index} className="border-b bg-slate-50 item-row">
          <td className="px-4 text-sm text-gray-700">
            <div className="inline-flex items-center gap-2">
              <p className="text-base font-semibold text-gray-700 capitalize">{item.frais}</p>
              <input type="hidden" name={`items[${item.id}][idItems]`} value={item.idFrais} />

              {(isNature==="proforma" || isEdit==="proforma") ? (
                <input
                  type="hidden"
                  className="hidden"
                  name={`items[${item.id}][idModule]`}
                />
              ) : (
                <input type="hidden" name={`items[${item.id}][idProjet]`} />
              )}
            </div>
          </td>
          <td className="px-4 text-sm">
            <textarea
              name={`items[${item.id}][item_description]`}
              className="w-full p-2 text-base text-gray-500 border rounded-md outline-none"
              required
              value={item.description}
              onChange={(e) => handleItemChange(index, "description", e.target.value)}
            />
          </td>
          <td className="px-4 text-sm">
            <input
              type="number"
              name={`items[${item.id}][item_qty]`}
              min="0"
              className="w-full p-2 text-base text-center text-gray-500 border rounded-md outline-none item-quantity"
              value={item.qty}
              onChange={(e) => handleItemChange(index, "qty", e.target.value)}
              required
            />
          </td>
          <td className="px-4 text-sm">
            <select
              name={`items[${item.id}][idUnite]`}
              className="p-2 text-base border rounded-md focus:outline-none focus:ring-purple-500 focus:ring-1"
              value={item.idUnite}
              onChange={(e) => handleItemChange(index, "idUnite", e.target.value)}
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
              name={`items[${item.id}][item_unit_price]`}
              placeholder="Prix unitaire"
              className="w-full p-2 text-base text-right text-gray-500 border rounded-md outline-none item-unit-price"
              value={item.unitPrice}
              onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
              required
            />
          </td>
          <td className="px-4 text-sm">
            <p className="w-full p-2 text-base text-right text-gray-500 border rounded-md">
              {item.item_total_price || "0.00"}
            </p>
            <input
              type="hidden"
              name={`items[${item.id}][item_total_price]`}
              value={item.item_total_price}
              readOnly
              required
            />
          </td>
          <td
            className="px-4 text-sm text-right cursor-pointer remove-item"
            onClick={() => handleRemoveItem(index)}
          >
            <i className="text-base text-red-500 fa-solid fa-trash-can"></i>
          </td>
        </tr>
      ))}
    </>
  );
}
