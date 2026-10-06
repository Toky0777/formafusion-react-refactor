import { useEffect, useState } from "react";

export function Count({ sumTotal, data, isEdit }) {

  const [reduction, setReduction] = useState(0);
  const [selectedValue, setSelectedValue] = useState("ar");
  const [reductionFinal, setReductionFinal] = useState(0);
  const [selectedTva, setSelectedTva] = useState(0);
  const [tva, setTva] = useState(0);
  const [subTotalAfterReduction, setSubTotalAfterReduction] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [amountInWords, setAmountInWords] = useState('');
  const [openDivReduction, setOpenDivReduction] = useState(false);
  const setting = JSON.parse(sessionStorage.getItem("setting"));

  // Calcul de la réduction
  useEffect(() => {
    let reductionValue = 0;
    if (openDivReduction) {
      if (selectedValue === "ar") {
        reductionValue = reduction;
      } else if (selectedValue === "pourcent") {
        reductionValue = (sumTotal * reduction) / 100;
      }
    }
    const newSubTotal = parseInt(sumTotal - reductionValue);
    setReductionFinal(reductionValue);
    setSubTotalAfterReduction(newSubTotal);
  }, [selectedValue, reduction, sumTotal, openDivReduction]);

  // Calcul de la TVA
  useEffect(() => {
    const tvaValue = (subTotalAfterReduction * selectedTva) / 100;
    setTva(tvaValue);
  }, [selectedTva, subTotalAfterReduction, isEdit, data]);

  // Calcul du total et conversion en lettres
  useEffect(() => {
    const total = parseInt(subTotalAfterReduction + tva);
    setTotalAmount(total);
    setAmountInWords(numberToWords(total));
  }, [subTotalAfterReduction, tva, isEdit]);
  // Mode édition
  useEffect(() => {
    if (isEdit) {
      if (data.invoice.invoice_tva > 0) { setSelectedTva(20) };
      if (data.invoice.invoice_reduction > 0) {
        setReduction(Number(data.invoice.invoice_reduction));
        setSelectedValue("ar");
        setOpenDivReduction(true);
      }

    }
  }, [isEdit, data]);

  return (
    <>
      <div className="flex justify-end w-full px-12 py-4 border-b">
        <div className="flex flex-col gap-3 sm:w-[520px] lg:w-[510px] 2xl:w-[600px]">
          {/* Subtotal */}
          <div className="inline-flex items-center justify-end gap-4">
            <div className="flex justify-end">
              <p className="flex-1 text-base font-semibold text-right text-gray-500">Sous Total</p>
            </div>
            <div className="sm:w-[20%] lg:w-[30%] flex justify-end gap-2">
              <p>{parseFloat(sumTotal).toLocaleString()} {setting?.currency_code}</p>
              <p id="sub_total" className="text-right"></p>
              <input type="number" id="invoice_sub_total" name="invoice_sub_total" className="hidden text-right outline-none" readOnly value={sumTotal} />
            </div>
          </div>
          <div className="border-b border-gray-200"></div>

          {/* Réduction */}
          <div className="flex flex-col gap-2">
            <div id="addDiscount" className="inline-flex items-center justify-center cursor-pointer" >
              <i className="text-xl text-purple-500 bi bi-plus-circle"></i>
              {!openDivReduction ?
                <span className="text-base font-semibold text-purple-500" onClick={() => setOpenDivReduction(true)}>Ajouter une réduction</span>
                :
                <span className="text-base font-semibold text-purple-500" onClick={() => setOpenDivReduction(false)}>Annule la  réduction</span>
              }
            </div>
            <input type="number" id="invoice_reduction" name="invoice_reduction" className="hidden text-right outline-none" readOnly value={reductionFinal} />
            {openDivReduction &&
              <div id="discountContent" className="inline-flex items-center justify-end gap-4" >
                <div className="flex justify-end gap-2">
                  <label className="inline-flex items-center justify-end flex-1 text-base font-semibold">Réduction :</label>
                  <input type="number" id="reductionInput" className="md:w-[15vh] 2xl:w-[14.5vh] p-2 border text-gray-900 text-base rounded-lg focus:outline-none focus:ring-purple-500 focus:ring-1"
                    placeholder="Entrer ici"
                    value={reduction}
                    onChange={(e) => setReduction(e.target.value)} />
                  <select id="reductionType" className="p-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:ring-1"
                    onChange={(e) => setSelectedValue(e.target.value)}>
                    <option value="ar">{setting?.currency_code}</option>
                    <option value="pourcent">%</option>
                  </select>
                </div>
                <div className="sm:w-[20%] lg:w-[30%] flex justify-end gap-2">
                  <p className="text-gray-700"> {setting?.currency_code} {reductionFinal}</p>
                  <p id="reductionResult" className="text-right"></p>
                </div>
              </div>}

          </div>
          <div className="border-b border-gray-200"></div>

          {/* TVA */}
          <div className="inline-flex items-center justify-end gap-4">
            <div className="flex justify-end gap-2">
              <label className="inline-flex items-center justify-end flex-1 text-base font-semibold text-gray-700">Ajouter un TVA :</label>
              <select id="tvaSelect" className="p-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:ring-1"
                onChange={(e) => setSelectedTva(e.target.value)} value={selectedTva}>
                <option value="0">0%</option>
                <option value="20">20%</option>
              </select>
            </div>
            <div className="sm:w-[20%] lg:w-[30%] flex justify-end gap-2">
              <p className="text-gray-700">{setting?.currency_code} {tva}</p>
              <p id="tvaResult" className="text-right"></p>
              <input type="number" id="invoice_tva" name="invoice_tva" className="hidden text-right outline-none" readOnly value={tva} />
            </div>
          </div>
          <div className="border-b border-gray-200"></div>

          {/* Total */}
          <div className="inline-flex items-center justify-end gap-4">
            <div className="flex justify-end gap-2">
              <p className="flex-1 text-base font-semibold text-right text-gray-500">Total</p>
            </div>
            <div className="sm:w-[20%] lg:w-[30%] flex justify-end gap-2">
              <p className="text-gray-700">{setting?.currency_code} {parseFloat(totalAmount).toLocaleString()}</p>
              <p id="invoice_total" className="text-right"></p>
              <input type="number" id="invoice_total_amount" name="invoice_total_amount" className="hidden text-right outline-none" value={totalAmount} readOnly />
            </div>
          </div>
        </div>
      </div>

      {/*Arrets */}
      <div className="px-12 py-8 border-b">
        <p className="text-base font-semibold text-gray-700">Arreté la présente facture à la somme de {amountInWords} <span
          id="totalInWords" className="uppercase"></span>
          <input type="hidden" name="invoice_letter" id="invoice_letter" value={amountInWords} /> {setting?.currency_code}
        </p>
      </div>
    </>
  )
}
function numberToWords(n) {
  n = Math.floor(n); // Coupe les décimales

  if (isNaN(n) || n < 0) return ""; // Cas invalide
  if (n === 0) return "zéro";

  const units = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
  const teens = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
  const tens = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];

  if (n < 10) return units[n];
  if (n < 20) return teens[n - 10];
  if (n < 100) {
    let ten = Math.floor(n / 10);
    let unit = n % 10;

    if (ten === 7) return tens[6] + (unit === 1 ? "-et-" : "-") + teens[unit];
    if (ten === 9) return tens[8] + (unit > 0 ? "-" + teens[unit] : "");

    return tens[ten] + (unit === 1 && ten !== 8 ? "-et-" : (unit > 0 ? "-" : "")) + units[unit];
  }
  if (n < 1000) {
    let hundred = Math.floor(n / 100);
    let rest = n % 100;
    return (hundred > 1 ? units[hundred] + " " : "") + "cent" + (hundred > 1 && rest === 0 ? "s" : "") +
      (rest > 0 ? " " + numberToWords(rest) : "");
  }
  if (n < 1000000) {
    let thousand = Math.floor(n / 1000);
    let rest = n % 1000;
    return (thousand > 1 ? numberToWords(thousand) + " " : "") + "mille" + (rest > 0 ? " " + numberToWords(rest) : "");
  }
  if (n < 1000000000) {
    let million = Math.floor(n / 1000000);
    let rest = n % 1000000;
    return numberToWords(million) + " million" + (million > 1 ? "s" : "") + (rest > 0 ? " " + numberToWords(rest) : "");
  }
  if (n < 1000000000000) {
    let billion = Math.floor(n / 1000000000);
    let rest = n % 1000000000;
    return numberToWords(billion) + " milliard" + (billion > 1 ? "s" : "") + (rest > 0 ? " " + numberToWords(rest) : "");
  }

  return "nombre trop grand"; // sécurité pour ne pas aller au-delà d'un billion
}


