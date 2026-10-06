import { memo, useCallback } from "react";
import dayjs from "dayjs";
import Drawer from "../../../components/Common/Drawer";

const BonCommandeEditDrawer = memo(({
    open,
    onClose,
    form,
    setForm,
    formLoading,
    formError,
    onSubmit,
    entrepriseList,
    devisList,
    selectedEtpId,
    setSelectedEtpId,
    isEditing = false
}) => {

    const handleEtpChange = useCallback((etpId) => {
        setSelectedEtpId(etpId);
        setForm(f => ({
            ...f,
            idDevis: "",
            montant: ""
        }));
    }, [setSelectedEtpId, setForm]);

    const handleDevisChange = useCallback((devisId) => {
        const selectedDevis = devisList.find(d => d.idDevis === parseInt(devisId));
        setForm(f => ({
            ...f,
            idDevis: devisId,
            montant: selectedDevis ? selectedDevis.invoice_amount : f.montant
        }));
    }, [devisList, setForm]);

    const handleInputChange = useCallback((field, value) => {
        setForm(f => ({ ...f, [field]: value }));
    }, [setForm]);

    const resetForm = useCallback(() => {
        setForm({
            numero: "",
            montant: "",
            date: "",
            date_debut: "",
            date_fin: "",
            modalite: "",
            idDevis: "",
            contact_name: "",
            contact_mail: "",
            contact_phone: "",
        });
        setSelectedEtpId("");
    }, [setForm, setSelectedEtpId]);

    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [resetForm, onClose]);

    return (
        <Drawer
            open={open}
            onClose={handleClose}
            title={isEditing ? "Modifier le Bon de Commande" : "Ajouter un Bon de Commande"}
            size="md"
        >
            <form
                className="flex flex-col gap-6 text-sm text-gray-700"
                onSubmit={onSubmit}
            >
                {/* Entreprise */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Sélectionner une entreprise <span className="text-red-500">*</span>
                    </label>
                    <select
                        required
                        className="px-3 py-2.5 transition bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        value={selectedEtpId}
                        onChange={e => handleEtpChange(e.target.value)}
                    >
                        <option value="">-- Choisir une entreprise --</option>
                        {entrepriseList.map((etp) => (
                            <option key={etp.idEtp} value={etp.idEtp}>
                                {etp.etp_name}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500">
                        Sélectionnez d'abord l'entreprise pour voir ses devis
                    </p>
                </div>

                {/* Devis */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Sélectionner un devis <span className="text-red-500">*</span>
                    </label>
                    <select
                        required
                        disabled={!selectedEtpId || devisList.length === 0}
                        className="px-3 py-2.5 transition bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        value={form.idDevis}
                        onChange={e => handleDevisChange(e.target.value)}
                    >
                        <option value="">
                            {!selectedEtpId
                                ? "-- Choisissez d'abord une entreprise --"
                                : devisList.length === 0
                                    ? "-- Aucun devis disponible --"
                                    : "-- Choisir un devis --"
                            }
                        </option>
                        {devisList.map((d) => (
                            <option key={d.idDevis} value={d.idDevis} className="max-w-xs truncate">
                                {d.invoice_number} – {dayjs(d.invoice_date).format("DD/MM/YYYY")} - {Number(d.invoice_amount).toLocaleString("fr-FR")} Ar
                                {d.devis_description && ` - ${d.devis_description}`}
                            </option>
                        ))}
                    </select>
                    {selectedEtpId && devisList.length === 0 && (
                        <p className="text-xs text-amber-600">
                            Aucun devis trouvé pour cette entreprise
                        </p>
                    )}
                </div>

                {/* Numéro BC */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Numéro BC <span className="text-red-500">*</span>
                    </label>
                    <input
                        required
                        type="text"
                        placeholder="Ex: BC-2024-001"
                        className="px-3 py-2.5 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        value={form.numero}
                        onChange={e => setForm(f => ({ ...f, numero: e.target.value }))}
                    />
                </div>

                {/* Montant */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        Montant BC
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="w-full pl-3 pr-10 py-2.5 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            value={form.montant}
                            onChange={e => setForm(f => ({ ...f, montant: e.target.value }))}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-gray-500">Ar</span>
                        </div>
                    </div>
                </div>

                {/* Section Dates */}
                <div className="pt-4 border-t border-gray-200">
                    <div className="mb-4">
                        <h4 className="mb-1 text-sm font-medium text-gray-700">
                            Dates
                        </h4>
                        <p className="text-xs text-gray-500">
                            Informations sur les dates du bon de commande
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Date BC */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600">Date BC</label>
                            <input
                                type="date"
                                className="px-3 py-2.5 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                value={form.date}
                                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                            />
                        </div>

                        {/* Dates Début et Fin en ligne */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">Date Début</label>
                                <input
                                    type="date"
                                    className="px-3 py-2.5 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    value={form.date_debut}
                                    onChange={e => setForm(f => ({ ...f, date_debut: e.target.value }))}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">Date Fin</label>
                                <input
                                    type="date"
                                    className="px-3 py-2.5 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    value={form.date_fin}
                                    onChange={e => setForm(f => ({ ...f, date_fin: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600">Modalité de paiement (en jour)</label>
                            <input
                                type="number" placeholder="0 à 90 jours"
                                className="px-3 py-2.5 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                value={form.modalite}
                                onChange={e => setForm(f => ({ ...f, modalite: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Section Contact */}
                <div className="pt-4 border-t border-gray-200">
                    <div className="mb-4">
                        <h4 className="mb-1 text-sm font-medium text-gray-700">
                            Informations de contact (optionnel)
                        </h4>
                        <p className="text-xs text-gray-500">
                            Personne à contacter pour ce bon de commande
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600">Nom du contact</label>
                            <input
                                type="text"
                                placeholder="Nom complet"
                                className="px-3 py-2.5 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                value={form.contact_name}
                                onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))}
                            />
                        </div>

                        {/* Email et Téléphone en ligne */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">Email du contact</label>
                                <input
                                    type="email"
                                    placeholder="email@exemple.com"
                                    className="px-3 py-2.5 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    value={form.contact_mail}
                                    onChange={e => setForm(f => ({ ...f, contact_mail: e.target.value }))}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">Téléphone du contact</label>
                                <input
                                    type="text"
                                    placeholder="+261 XX XX XXX XX"
                                    className="px-3 py-2.5 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    value={form.contact_phone}
                                    onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message d'erreur */}
                {formError && (
                    <div className="p-3 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                        {formError}
                    </div>
                )}

                {/* Boutons d'action */}
                <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-200">
                    <button
                        type="button"
                        className="px-6 py-2.5 text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        onClick={handleClose}
                        disabled={formLoading}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={formLoading}
                        className="px-6 py-2.5 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {formLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                {isEditing ? "Modification..." : "Ajout..."}
                            </div>
                        ) : (
                            isEditing ? "Modifier" : "Ajouter"
                        )}
                    </button>
                </div>
            </form>
        </Drawer>
    );
});

BonCommandeEditDrawer.displayName = 'BonCommandeEditDrawer';
export default BonCommandeEditDrawer;