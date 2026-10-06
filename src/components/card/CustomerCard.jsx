import { useState } from "react";
import {
  Mail,
  Phone,
  Trash2,
  MapPin,
  Eye,
  Building,
  Pencil,
  User,
  Folder,
} from "lucide-react";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import ModalDeleteCustomer from "../Modals/customer/modal-delete-customer";
import ModalEditCustomer from "../Modals/customer/modal-edit-customer";
import ProjectDrawer from "../drawer/customer/ProjectDrawer";
import customerService from "../../services/cfp/customer/customerService";
import { IMAGE_URL } from "../../config/env";

export default function CustomerCard({
  data,
  account,
  handleEdit,
  handleUpdate,
  handleDelete,
  updateLogo,
}) {
  const imgUrl = IMAGE_URL + "/img/entreprises";
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showDrawerProject, setShowDrawerProject] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({});
  const [dataForEtp, setDataForEtp] = useState({});
  const [loadingForProject, setLoadingForProject] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const handleEditEtp = async (idEtp) => {
    setShowModalEdit(true);
    setIsLoading(true);
    try {
      const res = await handleEdit(idEtp);
      setEditData(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEtp = async (idEtp, data) => {
    setLoadingUpdate(true);
    try {
      const res = await handleUpdate(idEtp, data);
      toastr.success(res.message);
      setShowModalEdit(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleShowProject = async (id) => {
    setShowDrawerProject(true);
    setLoadingForProject(true);

    try {
      let res = null;
      if (account === "cfp") {
        res = await customerService.projetCustomer(id);
      } else {
        res = await customerService.getCfpById(id);
      }

      setDataForEtp(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingForProject(false);
    }
  };

  const handleDeleteEtp = async (idEtp) => {
    try {
      const res = await handleDelete(idEtp);
      if (res.data?.status === 200) {
        toastr.success(res.data?.message);
      } else {
        toastr.error(res.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden transition-all duration-300 bg-white shadow rounded-xl hover:shadow-xl group border border-gray-100">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center min-w-0 flex-1 mr-2">
              <div className="relative group w-24 h-24 flex-shrink-0">
                {data?.etp_logo || data?.cfp_logo ? (
                  <img
                    src={`${imgUrl}/${data?.etp_logo || data?.cfp_logo}`}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 shadow-sm">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-end gap-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              {account === "cfp" && (
                <button
                  onClick={() => handleEditEtp(data?.idEtp)}
                  className="p-2 text-gray-500 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                  title="Voir"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              )}
              {account === "cfp" && (
                <button
                  onClick={() => handleShowProject(data?.idEtp || data?.idCfp)}
                  className="p-2 text-gray-500 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                  title="Voir"
                >
                  <Eye className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={() => {
                  setShowModalDelete(true);
                }}
                className="p-2 text-gray-500 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-3 flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {data?.etp_name || data?.cfp_name}
          </h3>
        </div>

        {/* City */}
        <div className="flex items-center mb-3 text-gray-600">
          <MapPin className="flex-shrink-0 w-4 h-4 mr-2" />
          <span className="text-sm">
            {data?.etp_ville ? data?.etp_ville : "Aucune localisation"}
          </span>
        </div>

        {/* Contact Info */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-gray-600">
            <Mail className="flex-shrink-0 w-4 h-4 mr-2" />
            <p className="text-sm">
              {data?.etp_email || data?.cfp_email || "Aucun email"}
            </p>
          </div>
          <div className="flex items-center text-gray-600 transition-colors">
            <Phone className="flex-shrink-0 w-4 h-4 mr-2" />
            <a className="text-sm ">
              {data?.etp_phone || data?.cfp_phone || "Aucun numéro"}
            </a>
          </div>
          {account === "cfp" && (
            <div className="flex items-center text-gray-600 transition-colors">
              <Building className="flex-shrink-0 w-4 h-4 mr-2" />
              <a className="text-sm ">
                {data?.type_etp_desc ? data?.type_etp_desc : "Aucun type"}{" "}
              </a>
            </div>
          )}
          {account === "etp" && (
            <div className="flex items-center text-gray-600  transition-colors duration-200">
              <Folder className="flex-shrink-0 w-4 h-4 mr-2" />
              <span className="text-sm">
                {data?.project && data.project > 0
                  ? `${data.project} ${
                      data.project === 1 ? "projet" : "projets"
                    } réalisés`
                  : "Aucun projet réalisé"}
              </span>
            </div>
          )}
        </div>
      </div>

      {showModalEdit && (
        <ModalEditCustomer
          updateEtp={handleUpdateEtp}
          editData={editData}
          isLoading={isLoading}
          onClose={() => setShowModalEdit(false)}
          loadingUpdate={loadingUpdate}
          updateLogo={updateLogo}
        />
      )}
      {showModalDelete && (
        <ModalDeleteCustomer
          handleDelete={() => handleDeleteEtp(data?.idEtp)}
          onClose={() => setShowModalDelete(false)}
          customer={data}
        />
      )}

      {showDrawerProject && (
        <ProjectDrawer
          isLoading={loadingForProject}
          data={dataForEtp}
          account={account}
          isShow={showDrawerProject}
          onClose={() => setShowDrawerProject(false)}
        />
      )}
    </div>
  );
}
