import { BonCommandeHeader } from "./BonCommandeHeader";
import { BonCommandeDashboard } from "../../shared/bon_commande/BonCommandeDashboard";
import { BonCommandePagination } from "../../shared/bon_commande/BonCommandePagination";
import { useBonCommande } from "./hooks/useBonCommande";
import BonCommandeEditDrawer from "../../shared/bon_commande/BonCommandeEditDrawer";
import BonCommandeFilters from "./BonCommandeFilters";
import BonCommandeTable from "./BonCommandeTable";
import DocumentsModal from "./DocumentsModal";

export function ListeBonCommande() {
  const {
    // State
    bons,
    totals,
    drawerOpen,
    entrepriseList,
    devisList,
    selectedEtpId,
    form,
    formLoading,
    formError,
    loading,
    perPage,
    pagination,
    filters,
    editingId,
    documents,
    uploadLoading,
    selectedBC,

    // Setters
    setForm,
    setSelectedEtpId,
    setPerPage,

    // Handlers
    handleFilterChange,
    handleFilterReset,
    handleFilterSubmit,
    handlePageChange,
    handleDrawerSubmit,
    handleEdit,
    handleDelete,
    handleDrawerClose,
    handleNewClick,

    // Functions
    fetchBons,
    uploadDocument,
    downloadDocument,
    deleteDocument,
    openDocumentsModal,
    closeDocumentsModal,
    previewDocument,
  } = useBonCommande();

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

      <DocumentsModal
        isOpen={!!selectedBC}
        onClose={closeDocumentsModal}
        selectedBC={selectedBC}
        documents={documents}
        uploadLoading={uploadLoading}
        onUpload={uploadDocument}
        onDownload={downloadDocument}
        onDelete={deleteDocument}
        onPreview={previewDocument}
      />

      <BonCommandeHeader onNewClick={handleNewClick} />

      <BonCommandeDashboard totals={totals} />

      <BonCommandeFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
        perPage={perPage}
        setPerPage={setPerPage}
        onSubmit={handleFilterSubmit}
      />

      <BonCommandeTable
        bons={bons}
        loading={loading}
        pagination={pagination}
        perPage={perPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={(bonCommandeId, newStatusId) => {
          console.log(`Statut changé: BC ${bonCommandeId} -> ${newStatusId}`);
          fetchBons();
        }}
        onDocumentsClick={openDocumentsModal}
      />

      <BonCommandePagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}