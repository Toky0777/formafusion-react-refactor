import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { Plus } from "lucide-react";
import axios from "../../../config/axios";
import BonCommandeEditDrawer from "../../../pages/shared/bon_commande/BonCommandeEditDrawer";
import BonCommandeFilters from "../../../pages/Cfp/bon_commande/BonCommandeFilters";
import BonCommandeTable from "../../../pages/Cfp/bon_commande/BonCommandeTable";

export function PurchaseOrder({ searchQuery }) {
  const [bons, setBons] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [entrepriseList, setEntrepriseList] = useState([]);
  const [devisList, setDevisList] = useState([]);
  const [selectedEtpId, setSelectedEtpId] = useState(""); // Nouveau state pour l'entreprise sélectionnée
  const [form, setForm] = useState({
    numero: "",
    montant: "",
    date: "",
    idDevis: "",
    contact_name: "",
    contact_mail: "",
    contact_phone: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  useEffect(() => {
    fetchBons();
    // eslint-disable-next-line
  }, [perPage, pagination.current_page]);

  useEffect(() => {
    if (drawerOpen) {
      axios.get("/cfp/bon-commande/getAllEtpDevis").then((res) => {
        setEntrepriseList(res.data || []);
      });
    }
  }, [drawerOpen]);

  // Charger les devis quand une entreprise est sélectionnée
  useEffect(() => {
    if (selectedEtpId) {
      axios.get(`/cfp/bon-commande/getDevis/${selectedEtpId}`).then((res) => {
        setDevisList(res.data || []);
      });
    } else {
      setDevisList([]);
    }
  }, [selectedEtpId]);

  const fetchBons = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current_page,
        per_page: perPage,
        key: searchQuery,
      };
      const res = await axios.get("/cfp/search/purchase_order", { params });
      const data = res.data;
      let bonsList = [];
      if (Array.isArray(data)) {
        bonsList = data;
      } else if (Array.isArray(data.data)) {
        bonsList = data.data;
      } else if (Array.isArray(data.bons)) {
        bonsList = data.bons;
      } else if (data.results && Array.isArray(data.results)) {
        bonsList = data.results;
      }
      setBons(bonsList);
      setPagination({
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        total: data.total || bonsList.length,
      });
    } catch (e) {
      setBons([]);
    }
    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    setPagination((p) => ({ ...p, current_page: newPage }));
  };

  const handleDrawerSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      const payload = {
        ...form,
        montant: form.montant ? Number(form.montant) : undefined,
        idDevis: Number(form.idDevis),
      };

      if (editingId) {
        await axios.put(`/cfp/bon-commande/${editingId}`, payload);
      } else {
        await axios.post("/cfp/bon-commande", payload);
      }

      setDrawerOpen(false);
      resetForm();
      fetchBons();
    } catch (err) {
      setFormError(
        editingId
          ? "Erreur lors de la modification. Vérifiez les champs obligatoires."
          : "Erreur lors de l'ajout. Vérifiez les champs obligatoires."
      );
    }
    setFormLoading(false);
  };

  const resetForm = () => {
    setForm({
      numero: "",
      montant: "",
      date: "",
      idDevis: "",
      contact_name: "",
      contact_mail: "",
      contact_phone: "",
    });
    setSelectedEtpId("");
    setDevisList([]);
    setEditingId(null);
  };

  const handleEdit = async (bc) => {
    try {
      const res = await axios.get(`/cfp/bon-commande/${bc.idBC}`);
      const bonCommande = res.data;

      // Charger les devis de l'entreprise correspondante
      let devisListForEdit = [];
      let etpIdForEdit = "";

      if (bonCommande.idEtp) {
        etpIdForEdit = bonCommande.idEtp;
        const devisRes = await axios.get(
          `/cfp/bon-commande/getDevis/${bonCommande.idEtp}`
        );
        devisListForEdit = devisRes.data || [];
      }

      setForm({
        numero: bonCommande.numero_bc || "",
        montant: bonCommande.montant_bc || "",
        date: bonCommande.date_bc
          ? dayjs(bonCommande.date_bc).format("YYYY-MM-DD")
          : "",
        idDevis: bonCommande.idDevis || "",
        contact_name: bonCommande.contact_name || "",
        contact_mail: bonCommande.contact_mail || "",
        contact_phone: bonCommande.contact_phone || "",
      });
      setSelectedEtpId(etpIdForEdit);
      setDevisList(devisListForEdit);
      setEditingId(bonCommande.idBC);
      setDrawerOpen(true);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      // Fallback sur les données de base
      setForm({
        numero: bc.numero_bc || "",
        montant: bc.montant_bc || "",
        date: bc.date_bc ? dayjs(bc.date_bc).format("YYYY-MM-DD") : "",
        idDevis: bc.idDevis || "",
        contact_name: bc.contact_name || "",
        contact_mail: bc.contact_mail || "",
        contact_phone: bc.contact_phone || "",
      });
      setEditingId(bc.idBC);
      setDrawerOpen(true);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer ce bon de commande ?")
    ) {
      try {
        await axios.delete(`/cfp/bon-commande/${id}`);
        fetchBons();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du bon de commande.");
      }
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    resetForm();
  };

  const handleNewClick = () => {
    resetForm();
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-white">
      <BonCommandeEditDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        form={form}
        setForm={setForm}
        formLoading={formLoading}
        formError={formError}
        onSubmit={handleDrawerSubmit}
        entrepriseList={entrepriseList}
        devisList={devisList}
        selectedEtpId={selectedEtpId}
        setSelectedEtpId={setSelectedEtpId}
        isEditing={!!editingId}
      />
      {/* Entête */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-bold text-gray-700">
          Liste des Bons de Commande
        </h2>
        <button
          className="inline-flex gap-1 items-center rounded bg-gray-100 hover:bg-purple-500 hover:text-white px-3 !py-2 transition duration-200 ease-in-out text-gray-600"
          onClick={handleNewClick}
        >
          <Plus className="w-5" />
          <span className="hidden md:inline">Nouveau</span>
        </button>
      </div>
      <BonCommandeFilters
        filters={{}}
        onChange={() => {}}
        onReset={() => {}}
        perPage={perPage}
        setPerPage={setPerPage}
        onSubmit={(e) => {
          e.preventDefault();
          fetchBons();
        }}
      />
      <BonCommandeTable
        bons={bons}
        loading={loading}
        pagination={pagination}
        perPage={perPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() =>
              handlePageChange(Math.max(1, pagination.current_page - 1))
            }
            disabled={pagination.current_page === 1}
            className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="text-sm">
            Page {pagination.current_page} / {pagination.last_page}
          </span>
          <button
            onClick={() =>
              handlePageChange(
                Math.min(pagination.last_page, pagination.current_page + 1)
              )
            }
            disabled={pagination.current_page === pagination.last_page}
            className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
