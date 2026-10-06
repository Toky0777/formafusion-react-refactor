import { useState, useEffect } from "react";
import { ProfileHeader } from "../../../components/header/profil-header";
import { EditProfileDrawer } from "../../../components/drawer/drawer-profil-edit";
import { CompanyDetails } from "../../../components/profil/company-detail";
import { profilService } from "../../../services/profilService";
import { EditCustomerDrawer } from "../../../components/drawer/drawer-customer-edit";

const ProfilEtp = () => {
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profilService.getProfilEtp();

        setCustomerData(data.customer || {});
        setCities(data.ville_codeds || []);
      } catch (err) {
        console.error(
          err instanceof Error ? err.message : "Erreur lors de la récupération"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

      const result = await profilService.updateCustomerEtp(payload);
      setCustomerData((prev) => ({ ...prev, ...updatedData }));
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Échec de la mise à jour du profil.");
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Chargement du profil...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full h-full py-4">
        <div className="container flex flex-col w-full p-4 mx-auto bg-white rounded-xl">
          <ProfileHeader
            customerName={customerData.customerName}
            description={customerData.description}
            refConnected={true}
            onEditProfile={() => setEditProfileOpen(true)}
            onEditUser={() => setEditUserOpen(true)}
            onSecurity={() => console.log("Security settings")}
          />

          <hr className="my-4 border border-gray-300" />

          <CompanyDetails
            logo={customerData.logo}
            customerName={customerData.customerName}
            customerSlogan={customerData.customer_slogan}
            nif={customerData.nif}
            stat={customerData.stat}
            rcs={customerData.rcs}
            customerPhone={customerData.customerPhone}
            customerEmail={customerData.customerEmail}
            siteWeb={customerData.siteWeb}
            customerAddrLot={customerData.customer_addr_lot}
            customerAddrQuartier={customerData.customer_addr_quartier}
            customerAddrCodePostal={customerData.customer_addr_code_postal}
          />

          {/* Drawers */}
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
        </div>
      </div>
    </div>
  );
};

export default ProfilEtp;
