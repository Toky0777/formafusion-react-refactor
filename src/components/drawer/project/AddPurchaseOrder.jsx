import { memo, useCallback, useEffect, useState } from "react";
import Drawer from "../../../components/Common/Drawer";
import axios from "../../../config/axios";

const AddPurchaseOrder = memo(
  ({ open, close, selectedEtpId, managePurchaseOrder }) => {
    /* ---------------------- STATES INTERNES ---------------------- */
    const [entrepriseList, setEntrepriseList] = useState([]);
    const [devisList, setDevisList] = useState([]);

    const [form, setForm] = useState({
      idDevis: "",
      numero: "",
      montant: "",
      date: "",
      date_debut: "",
      date_fin: "",
      modalite: "",
      contact_name: "",
      contact_mail: "",
      contact_phone: "",
    });

    const [formError, setFormError] = useState("");
    const [entreprises, setEntreprises] = useState([]);
    const [formLoading, setFormLoading] = useState(false);

    /* ---------------------- CHARGE DEVIS PAR ENTREPRISE ---------------------- */
    const fetchDevis = useCallback(async () => {
      if (!selectedEtpId) {
        setDevisList([]);
        return;
      }

      try {
        const devis = await axios.get("/cfp/bon-commande/getDevis", {
          params: { etpIds: selectedEtpId },
        });

        const entreprise = await axios.get("/cfp/get-entreprise", {
          params: { etpIds: selectedEtpId },
        });

        setDevisList(devis.data || []);
        setEntreprises(entreprise.data || []);
      } catch (err) {
        setDevisList([]);
      }
    }, [selectedEtpId]);

    useEffect(() => {
      fetchDevis();
      setForm((f) => ({ ...f, idDevis: "" }));
    }, [selectedEtpId]);

    /* ---------------------- HELPERS ---------------------- */
    const updateField = (name, value) =>
      setForm((f) => ({ ...f, [name]: value }));

    const handleClose = () => {
      if (!formLoading) close();
    };

    /* ---------------------- SUBMIT FORM ---------------------- */
    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError("");
      setFormLoading(true);

      try {
        const payload = {
          ...form,
          montant: form.montant ? Number(form.montant) : undefined,
          idDevis: form.idDevis,
          idEtp: selectedEtpId,
        };
        const response = await axios.post("/cfp/bon-commande", payload);

        const data = response.data;
        managePurchaseOrder(data.idBC);

        close();
      } catch (err) {
        setFormError(
          "Erreur lors de l'ajout. Vérifiez les champs obligatoires."
        );
      } finally {
        setFormLoading(false);
      }
    };

    return (
      <Drawer
        open={open}
        onClose={close}
        title="Ajouter un Bon de Commande"
        size="md"
      >
        <form
          className="flex flex-col gap-6 text-sm text-gray-700"
          onSubmit={handleSubmit}
        >
          {/* ENTREPRISE */}
          <SelectField
            label="Entreprise *"
            value={selectedEtpId}
            options={entreprises.map((e) => ({
              value: e.id,
              label: e.name,
            }))}
          />

          {/* DEVIS */}
          <SelectField
            label="Devis *"
            value={form.idDevis}
            onChange={(v) => updateField("idDevis", v)}
            disabled={!selectedEtpId}
            options={devisList.map((d) => ({
              value: d.idDevis,
              label: d.invoice_number,
            }))}
            placeholder={
              !selectedEtpId
                ? "Sélectionnez d'abord une entreprise"
                : devisList.length === 0
                ? "Aucun devis trouvé"
                : "Choisir un devis"
            }
          />

          {/* NUMÉRO BC */}
          <Input
            label="Numéro BC *"
            value={form.numero}
            onChange={(v) => updateField("numero", v)}
            required
            placeholder="Ex: BC-2024-001"
          />

          {/* MONTANT */}
          <Input
            label="Montant BC"
            type="number"
            value={form.montant}
            onChange={(v) => updateField("montant", v)}
            placeholder="0.00"
            unit="Ar"
          />

          {/* DATES */}
          <Section title="Dates">
            <Input
              label="Date BC"
              type="date"
              value={form.date}
              onChange={(v) => updateField("date", v)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date Début"
                type="date"
                value={form.date_debut}
                onChange={(v) => updateField("date_debut", v)}
              />
              <Input
                label="Date Fin"
                type="date"
                value={form.date_fin}
                onChange={(v) => updateField("date_fin", v)}
              />
            </div>

            <Input
              label="Modalité de paiement (jours)"
              type="number"
              placeholder="0 à 90 jours"
              value={form.modalite}
              onChange={(v) => updateField("modalite", v)}
            />
          </Section>

          {/* CONTACT */}
          <Section title="Contact (optionnel)">
            <Input
              label="Nom du contact"
              value={form.contact_name}
              onChange={(v) => updateField("contact_name", v)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={form.contact_mail}
                onChange={(v) => updateField("contact_mail", v)}
              />
              <Input
                label="Téléphone"
                value={form.contact_phone}
                onChange={(v) => updateField("contact_phone", v)}
                placeholder="+261 XX XX XXX XX"
              />
            </div>
          </Section>

          {/* ERREUR */}
          {formError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {formError}
            </div>
          )}

          {/* ACTION */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              className="px-6 py-2.5 border rounded-lg hover:bg-gray-50"
              onClick={handleClose}
              disabled={formLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              disabled={formLoading}
            >
              Ajouter
            </button>
          </div>
        </form>
      </Drawer>
    );
  }
);

AddPurchaseOrder.displayName = "AddPurchaseOrder";

/* ============================================================
   COMPONENTS UTILITAIRES
   ============================================================ */

const Input = ({ label, unit, onChange, ...rest }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium">{label}</label>
    <div className="relative">
      <input
        {...rest}
        className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-400"
        onChange={(e) => onChange(e.target.value)}
      />
      {unit && (
        <span className="absolute right-3 top-2.5 text-gray-500">{unit}</span>
      )}
    </div>
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  ...rest
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium">{label}</label>
    <select
      {...rest}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="px-3 py-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-purple-400"
    >
      <option value="">{placeholder || "-- Choisir --"}</option>
      {options?.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const Section = ({ title, children }) => (
  <div className="pt-4 border-t">
    <h4 className="text-sm font-medium mb-4">{title}</h4>
    <div className="space-y-4">{children}</div>
  </div>
);

export default AddPurchaseOrder;
