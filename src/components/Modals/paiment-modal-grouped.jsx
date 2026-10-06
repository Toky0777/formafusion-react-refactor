import { useEffect, useState } from "react";
import axios from "../../config/axios";
import { toast } from "react-toastify";

export function PaiementModalGrouped({ invoice, data, closeModal, setIsPaid }) {
  const [invoiceGrouped, setInvoiceGrouped] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const setting = JSON.parse(sessionStorage.getItem("setting"));
  const isValidGroupedPayment = selectedInvoices.length > 1;

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation côté client
  if (!isValidGroupedPayment) {
    toast.error("Le paiement groupé nécessite au moins 2 factures sélectionnées");
    return;
  }

  const formData = new FormData(e.target);    
  try {
    // Préparer les données dans le format demandé avec le montant restant pour chaque facture
    const paymentData = {
      invoices: selectedInvoices.map(inv => ({
        idInvoice: inv.idInvoice,
        amount: calculateRemainingAmount(inv),
        idEntreprise: inv.idEntreprise
      })),
      total_amount: totalAmount,
      payment_date: formData.get("payment_date"),
      payment_method_id: formData.get("payment_method_id"),
      payment_bank_id: formData.get("payment_bank_id"),
      payment_description: formData.get("payment_description")
    };

    console.log("Données envoyées au backend:", paymentData);

    const response = await axios.post(`/payments/groupe`, paymentData);
    
    if (response.data.status === 200) {        
      // SUPPRIMER le setTimeout qui peut causer des problèmes
      toast.success(response.data.message);
      closeModal();
      setIsPaid((prev) => prev + 1);
    }
  } catch (error) {
    console.error("Erreur d'envoi :", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Erreur lors du paiement");
  }
};
  useEffect(() => {
    if (!invoice?.idEntreprise) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`/cfp/factures/grouped/${invoice.idEntreprise}`);
        setInvoiceGrouped(res.data.invoices || []);
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors du chargement des factures groupées");
      }
    };

    fetchData();
  }, [invoice]);

  // Calculer le montant restant pour chaque facture
  const calculateRemainingAmount = (inv) => {
    const totalPayments = Array.isArray(inv.payments) 
      ? inv.payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0)
      : 0;
    
    const remaining = (Number(inv.invoice_total_amount) || 0) - totalPayments;
    return Math.max(0, remaining);
  };

  const isFullyPaid = (inv) => {
    return calculateRemainingAmount(inv) <= 0;
  };

  const getUnpaidInvoices = () => {
    return invoiceGrouped.filter(inv => !isFullyPaid(inv));
  };

  // Obtenir les factures éligibles pour le paiement groupé (au moins 2 factures impayées)
  const getEligibleInvoices = () => {
    const unpaid = getUnpaidInvoices();
    return unpaid.length >= 2 ? unpaid : [];
  };

  const getTotalPaid = (inv) => {
    return Array.isArray(inv.payments) 
      ? inv.payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0)
      : 0;
  };

  // Filtrer les factures selon la recherche
  const filteredInvoices = invoiceGrouped.filter(inv => 
    inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invoice_bc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvoiceSelection = (inv, isSelected) => {
    if (isFullyPaid(inv)) return;
    
    const remainingAmount = calculateRemainingAmount(inv);
    
    if (isSelected) {
      setSelectedInvoices(prev => [...prev, inv]);
      setTotalAmount(prev => prev + remainingAmount);
    } else {
      setSelectedInvoices(prev => prev.filter(item => item.idInvoice !== inv.idInvoice));
      setTotalAmount(prev => prev - remainingAmount);
    }
  };

  const handleSelectAll = (isSelected) => {
    const eligibleInvoices = getEligibleInvoices();
    
    if (isSelected) {
      setSelectedInvoices(eligibleInvoices);
      setTotalAmount(eligibleInvoices.reduce((sum, inv) => sum + calculateRemainingAmount(inv), 0));
    } else {
      setSelectedInvoices([]);
      setTotalAmount(0);
    }
  };

  // Calculer le total des factures sélectionnées (montant initial)
  const getTotalInvoiceAmount = () => {
    return selectedInvoices.reduce((sum, inv) => sum + (Number(inv.invoice_total_amount) || 0), 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header simple */}
        <div className="px-6 py-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Paiement Groupé
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {invoiceGrouped[0]?.entreprise_from_vcollaboration?.etp_name || "Entreprise"}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col h-[calc(90vh-80px)]">
          {/* Section de recherche et sélection */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <i className="fa-solid fa-search absolute left-3 top-3 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Rechercher une facture..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="text-gray-600">
                  {getUnpaidInvoices().length} en attente
                </span>
                <span className="text-gray-600">
                  • {invoiceGrouped.length - getUnpaidInvoices().length} payées
                </span>
                {/* Avertissement si pas assez de factures pour un paiement groupé */}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={selectedInvoices.length === getEligibleInvoices().length && getEligibleInvoices().length > 0}
                  disabled={getEligibleInvoices().length === 0}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="font-medium text-gray-700">
                  Tout sélectionner
                </span>
              </label>
              
              {selectedInvoices.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {selectedInvoices.length} facture(s) sélectionnée(s)
                  </span>
                  {/* Indicateur de validation */}
                  {!isValidGroupedPayment && (
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                      Sélectionnez au moins 2 factures
                    </span>
                  )}
                  {isValidGroupedPayment && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      Paiement groupé valide
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Liste des factures */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <i className="fa-solid fa-file-invoice text-3xl mb-3 opacity-50"></i>
                  <p>Aucune facture trouvée</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredInvoices.map((inv) => {
                    const totalInvoice = Number(inv.invoice_total_amount) || 0;
                    const totalPaid = getTotalPaid(inv);
                    const remainingAmount = calculateRemainingAmount(inv);
                    const fullyPaid = isFullyPaid(inv);
                    const paymentPercentage = totalPaid > 0 ? Math.round((totalPaid / totalInvoice) * 100) : 0;
                    const isSelected = selectedInvoices.some(selected => selected.idInvoice === inv.idInvoice);
                    
                    return (
                      <div
                        key={inv.idInvoice}
                        className={`border rounded-lg transition-colors ${
                          fullyPaid 
                            ? 'bg-gray-50 border-gray-200' 
                            : isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-400'
                        }`}
                      >
                        <label className="flex items-start p-4 cursor-pointer">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="flex items-center mt-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => handleInvoiceSelection(inv, e.target.checked)}
                                disabled={fullyPaid}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className={`font-medium ${fullyPaid ? 'text-gray-500' : 'text-gray-900'}`}>
                                  {inv.invoice_number}
                                </span>
                                <span className="text-sm text-gray-500">BC: {inv.invoice_bc}</span>
                                <span className="text-sm text-gray-500">
                                  Échéance: {new Date(inv.invoice_date_pm).toLocaleDateString('fr-FR')}
                                </span>
                              </div>

                              {totalPaid > 0 && !fullyPaid && (
                                <div className="mb-2">
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Progression</span>
                                    <span>{paymentPercentage}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-green-500 h-1.5 rounded-full"
                                      style={{ width: `${paymentPercentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <span>Total: {totalInvoice.toLocaleString("fr-FR")} {setting?.currency_unit}</span>
                                {totalPaid > 0 && (
                                  <span className="text-blue-600">
                                    Payé: {totalPaid.toLocaleString("fr-FR")} {setting?.currency_unit}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right ml-4 min-w-[120px]">
                            <div className={`text-lg font-semibold ${
                              fullyPaid ? 'text-gray-500' : 'text-green-600'
                            }`}>
                              {remainingAmount.toLocaleString("fr-FR")} {setting?.currency_unit}
                            </div>
                            <div className={`text-xs ${
                              fullyPaid ? 'text-green-600' : 'text-orange-600'
                            }`}>
                              {fullyPaid ? 'Payée' : 'À payer'}
                            </div>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Résumé et formulaire */}
          <div className="border-t bg-white">
            {/* Résumé simple */}
            {selectedInvoices.length > 0 && (
              <div className="p-4 bg-gray-50 border-b">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Factures sélectionnées</div>
                    <div className="font-semibold">{selectedInvoices.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total des factures</div>
                    <div className="font-semibold">
                      {getTotalInvoiceAmount().toLocaleString("fr-FR")} {setting?.currency_unit}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Reste à payer</div>
                    <div className="font-semibold text-green-600">
                      {totalAmount.toLocaleString("fr-FR")} {setting?.currency_unit}
                    </div>
                  </div>
                </div>
                
                {/* Message d'information sur la validation */}
                {!isValidGroupedPayment && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <div className="flex items-center gap-2 text-orange-800">
                      <i className="fa-solid fa-exclamation-triangle"></i>
                      <span className="text-sm font-medium">
                        Le paiement groupé nécessite au moins 2 factures sélectionnées
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit}>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de paiement <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="payment_date"
                        required
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Méthode de paiement <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="payment_method_id"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        {data.pm_types.map((type) => (
                          <option key={type.idTypePm} value={type.idTypePm}>
                            {type.pm_type_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compte bancaire <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="payment_bank_id"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner un compte...</option>
                      {data.ba_accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.ba_titulaire} - {account.ba_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="payment_description"
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Notes optionnelles..."
                      defaultValue={`Paiement groupé ${selectedInvoices.length} factures`}
                    ></textarea>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={!isValidGroupedPayment || totalAmount === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Payer {selectedInvoices.length} facture(s)
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}