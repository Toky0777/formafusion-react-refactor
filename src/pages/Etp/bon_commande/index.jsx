

import BonCommandeEditDrawer from "./BonCommandeEditDrawer";
import DocumentsModal from "./DocumentsModal";
import { BonCommandeDashboardETP } from "./BonCommandeDashboardEtp";
import BonCommandeFiltersETP from "./BonCommandeFiltersEtp";
import BonCommandeTableEtp from "./BonCommandeTableEtp";
import { BonCommandePaginationEtp } from "./BonCommandePaginationEtp";
import { BonCommandeHeaderETP } from "./BonCommandeHeaderEtp";
import { useBonCommandeETP } from "./hooks/useBonCommandeETP";

export function ListeBonCommandeEtp() {
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
  } = useBonCommandeETP();

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

      <BonCommandeHeaderETP onNewClick={handleNewClick} />

      <BonCommandeDashboardETP totals={totals} />

      <BonCommandeFiltersETP
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
        perPage={perPage}
        setPerPage={setPerPage}
        onSubmit={handleFilterSubmit}
      />

      <BonCommandeTableEtp
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

      <BonCommandePaginationEtp
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}