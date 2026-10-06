import { useState, useEffect } from "react";
import { ProfileHeader } from "../../../components/header/profil-header";
import { AccountsList } from "../../../components/profil/accountList";
import { EditProfileDrawer } from "../../../components/drawer/drawer-profil-edit";
import { CompanyDetails } from "../../../components/profil/company-detail";
import { profilService } from "../../../services/profilService";
import { EditCustomerDrawer } from "../../../components/drawer/drawer-customer-edit";
import { AddBankAccountDrawer } from "../../../components/drawer/add-bank-account";
import { AddMobileAccountDrawer } from "../../../components/drawer/add-mobile-account";
import { EditBankAccountDrawer } from "../../../components/drawer/edit-account-bank";
import { EditMobileAccountDrawer } from "../../../components/drawer/edit-account-mobil";
import { Modal } from "../../../components/Modals/confim-delete-modal";
import toast, { Toaster } from "react-hot-toast"; // 🆕 import toast

const ProfilCfp = () => {
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);

  // --- BANK ---
  const [openAddBankAccount, setOpenAddBankAccount] = useState(false);
  const [isEditBankOpen, setIsEditBankOpen] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);
  const [deleteBankModalOpen, setDeleteBankModalOpen] = useState(false);

  // --- MOBILE MONEY ---
  const [openAddMobileAccount, setOpenAddMobileAccount] = useState(false);
  const [isEditMobileOpen, setIsEditMobileOpen] = useState(false);
  const [selectedMobileAccount, setSelectedMobileAccount] = useState(null);
  const [deleteMobileModalOpen, setDeleteMobileModalOpen] = useState(false);

  // --- DATA ---
  const [customerData, setCustomerData] = useState({});
  const [userData, setUserData] = useState({});
  const [bankAccounts, setBankAccounts] = useState([]);
  const [mobileMoneyAccounts, setMobileMoneyAccounts] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH PROFIL ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profilService.getProfilCfp();
        setCustomerData(data.customer || {});
        setUserData(data.user || {});
        setBankAccounts(data.bankacounts || []);
        setMobileMoneyAccounts(data.mobile_money || []);
        setCities(data.ville_codeds || []);
      } catch (err) {
        toast.error("Erreur lors du chargement du profil");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- UPDATE CUSTOMER ---
  const handleUpdateProfile = async (updatedData) => {
    try {
      const payload = {
        customer_name: updatedData.customerName,
        customer_email: updatedData.customerEmail,
        customer_rcs: updatedData.rcs,
        customer_nif: updatedData.nif,
        customer_stat: updatedData.stat,
        customer_phone: updatedData.customerPhone,
        customer_addr_lot: updatedData.customerAddrLot,
        customer_addr_quartier: updatedData.customerAddrQuartier,
        customer_description: updatedData.description,
        customer_site_web: updatedData.siteWeb,
        customer_slogan: updatedData.customerSlogan,
      };
      await profilService.updateCustomer(payload);
      setCustomerData((prev) => ({ ...prev, ...updatedData }));
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
      console.error("Erreur update profil:", error);
    }
  };

  // --- BANK ---
  const handleAddBank = async (newAccount) => {
    try {
      setBankAccounts((prev) => [...prev, newAccount]);
      setOpenAddBankAccount(false);
      toast.success("Compte bancaire ajouté avec succès");
    } catch (err) {
      toast.error("Erreur lors de l'ajout du compte bancaire");
      console.error(err);
    }
  };

  const handleUpdateBank = async (updated) => {
    try {
      setBankAccounts((prev) =>
        prev.map((acc) => (acc.idAcount === updated.idAcount ? updated : acc))
      );
      setIsEditBankOpen(false);
      toast.success("Compte bancaire modifié");
    } catch (err) {
      toast.error("Erreur lors de la modification");
      console.error(err);
    }
  };

  const handleDeleteBank = async () => {
    try {
      console.log(selectedBankAccount);

      await profilService.deleteBankAccount(selectedBankAccount.idAcount);

      setBankAccounts((prev) =>
        prev.filter((acc) => acc.idAcount !== selectedBankAccount.idAcount)
      );

      setDeleteBankModalOpen(false);
      toast.success("Compte bancaire supprimé");
    } catch (err) {
      toast.error("Erreur suppression compte bancaire");
      console.error(err);
    }
  };

  // --- MOBILE MONEY ---
  const handleAddMobile = async (addedAccount) => {
    try {
      setMobileMoneyAccounts((prev) => [...prev, addedAccount]);
      setOpenAddMobileAccount(false);
      toast.success("Compte Mobile Money ajouté");
    } catch (err) {
      toast.error("Erreur ajout Mobile Money");
      console.error(err);
    }
  };

  const handleUpdateMobile = async (updated) => {
    try {
      setMobileMoneyAccounts((prev) =>
        prev.map((acc) => (acc.id === updated.id ? updated : acc))
      );
      setIsEditMobileOpen(false);
      toast.success("Compte Mobile Money modifié");
    } catch (err) {
      toast.error("Erreur lors de la modification");
      console.error(err);
    }
  };

  const handleDeleteMobile = async () => {
    try {
      await profilService.deleteMobileAccount(selectedMobileAccount);
      setMobileMoneyAccounts((prev) =>
        prev.filter((acc) => acc.id !== selectedMobileAccount)
      );
      setDeleteMobileModalOpen(false);
      toast.success("Compte Mobile Money supprimé");
    } catch (err) {
      toast.error("Erreur suppression Mobile Money");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Chargement du profil...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" /> {/* ✅ Zone de notification */}
      <div className="container mx-auto p-4 bg-white rounded-xl max-w-7xl">
        <ProfileHeader
          customerName={customerData.customerName}
          description={customerData.description}
          refConnected={true}
          onEditProfile={() => setEditProfileOpen(true)}
          onEditUser={() => setEditUserOpen(true)}
        />

        <CompanyDetails {...customerData} />

        <AccountsList
          bankAccounts={bankAccounts}
          mobileMoneyAccounts={mobileMoneyAccounts}
          onAddBankAccount={() => setOpenAddBankAccount(true)}
          onEditBankAccount={(acc) => {
            setSelectedBankAccount(acc);
            setIsEditBankOpen(true);
          }}
          onDeleteBankAccount={(acc) => {
            setSelectedBankAccount(acc);
            setDeleteBankModalOpen(true);
          }}
          onAddMobileMoneyAccounts={() => setOpenAddMobileAccount(true)}
          onEditMobileMoneyAccount={(acc) => {
            setSelectedMobileAccount(acc);
            setIsEditMobileOpen(true);
          }}
          onDeleteMobileMoneyAccount={(acc) => {
            setSelectedMobileAccount(acc);
            setDeleteMobileModalOpen(true);
          }}
        />

        {/* --- DRAWERS --- */}
        <EditProfileDrawer
          isOpen={editProfileOpen}
          onClose={() => setEditProfileOpen(false)}
          profileData={customerData}
          onUpdate={handleUpdateProfile}
          cities={cities}
        />

        <EditCustomerDrawer
          isDrawerOpen={editUserOpen}
          onClose={() => setEditUserOpen(false)}
        />

        <AddBankAccountDrawer
          isOpen={openAddBankAccount}
          onClose={() => setOpenAddBankAccount(false)}
          villes={cities}
          onAdd={handleAddBank}
        />

        <EditBankAccountDrawer
          isOpen={isEditBankOpen}
          onClose={() => setIsEditBankOpen(false)}
          villes={cities}
          account={selectedBankAccount}
          onUpdate={handleUpdateBank}
        />

        <AddMobileAccountDrawer
          isOpen={openAddMobileAccount}
          onClose={() => setOpenAddMobileAccount(false)}
          villes={cities}
          onAdd={handleAddMobile}
        />

        <EditMobileAccountDrawer
          isOpen={isEditMobileOpen}
          onClose={() => setIsEditMobileOpen(false)}
          villes={cities}
          account={selectedMobileAccount}
          onUpdate={handleUpdateMobile}
        />

        {/* --- MODALS --- */}
        {deleteBankModalOpen && (
          <Modal
            title="Supprimer le compte bancaire"
            onClose={() => setDeleteBankModalOpen(false)}
            onConfirm={handleDeleteBank}
          >
            Voulez-vous supprimer le compte bancaire{" "}
            <strong>{selectedBankAccount?.bank_name}</strong> ?
          </Modal>
        )}

        {deleteMobileModalOpen && (
          <Modal
            title="Supprimer le compte Mobile Money"
            onClose={() => setDeleteMobileModalOpen(false)}
            onConfirm={handleDeleteMobile}
          >
            Voulez-vous supprimer le compte Mobile Money{" "}
            <strong>{selectedMobileAccount?.mm_phone}</strong> ?
          </Modal>
        )}
      </div>
    </div>
  );
};

export default ProfilCfp;
