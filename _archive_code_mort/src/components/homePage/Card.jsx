import React, { useState } from "react";
import { Mail, Phone, Trash2, MapPin, Eye, X, Building } from "lucide-react";
import { endpoint } from "@/utils/fonction";
import ReadCustomer from "../crud/ReadCustomer";
import {
  deleteCustomer,
  deleteParticulier,
  projetCustomer,
  projetParticulier,
} from "@/utils/Cfpfunction/crudfunction";

import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Modal from "../common/Modal";
import { useAuthContext } from "@/context/AuthContext";
import {
  deleteCentreDeFormation,
  getCfpById,
} from "@/utils/Etpfunction.js/crudFunctionEtp";
import ShowDetails from "../crud/ShowDetails";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Card({
  image,
  name,
  type,
  email,
  phone,
  city,
  idCustomer,
  idTypeEtp,
  onDelete,
}) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [data, setData] = useState([]);
  const [detailsCfp, setDetailsCfp] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const { user } = useAuthContext();
  const userRole = user?.roles[0];

  const handleReadProject = async () => {
    setShow(true);
    let results = null;
    try {
      const typeEtp = [1, 2, 3, 4, 5, 6];
      if (typeEtp.includes(idTypeEtp)) {
        results = await projetCustomer(idCustomer);
      } else {
        results = await projetParticulier(idCustomer);
      }
      setData(results);
    } catch (error) {
      console.log(error);
    }
  };

  const showCfp = async () => {
    setShowDetails(true);
    try {
      const details = await getCfpById(idCustomer);
      setDetailsCfp(details);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    let result = null;
    const typeEtp = [1, 2, 3, 4, 5, 6];
    try {
      if (userRole === 3) {
        if (typeEtp.includes(idTypeEtp)) {
          result = await deleteCustomer(idCustomer);
        } else {
          result = await deleteParticulier(idCustomer);
        }
      } else {
        result = await deleteCentreDeFormation(idCustomer);
      }

      if (result.data.status === 401 || result.data.status === 500) {
        setSnackbarMessage(result.data.message);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } else if (result.data.status === 200) {
        setSnackbarMessage(result.data.message);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTimeout(() => {
          onDelete();
        }, 500);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setSnackbarMessage(
        error.response?.data?.message || "Une erreur est survenue"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Gérer la fermeture du Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full group">
      <div className="p-6 flex-1">
        <div className="flex items-center mb-4 gap-4">
          <div className="relative overflow-hidden rounded-lg flex-shrink-0">
            {image ? (
              <img
                src={`${endpoint}/${image}`}
                alt={`${name} logo`}
                className="w-20 h-18 transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <Building />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="flex items-center flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 truncate">{name}</h3>
          </div>
        </div>

        {/* City */}
        <div className="flex items-center mb-3 text-gray-600">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{city ? city : "Aucune localisation"}</span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
            <p className="text-sm">
              {email ? email : "Aucun numéro disponible"}
            </p>
          </div>
          <div className="flex items-center text-gray-600  transition-colors">
            <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
            <a className="text-sm ">{phone ? phone : "Aucun numéro"} </a>
          </div>
          {userRole === 3 && (
            <div className="flex items-center text-gray-600  transition-colors">
              <Building className="w-4 h-4 mr-2 flex-shrink-0" />
              <a className="text-sm ">{type ? type : "Aucun type"} </a>
            </div>
          )}
        </div>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex justify-end gap-2 group-hover:opacity-100 opacity-0 transition-opacity duration-300">
          <button
            onClick={() => {
              userRole === 3 ? handleReadProject() : showCfp();
            }}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            title="Éditer"
          >
            <Eye className="w-5 h-5" />
          </button>

          {show && (
            <ReadCustomer
              idCustomer={idCustomer}
              idTypeEtp={idTypeEtp}
              data={data}
              show={show}
              close={() => {
                setShow(false);
              }}
            />
          )}

          <button
            onClick={() => {
              setOpenModal(true);
            }}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            title="Supprimer"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          {openModal && (
            <Modal
              onClose={() => {
                setOpenModal(false);
              }}
            >
              <button
                onClick={() => {
                  setOpenModal(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Icône d'avertissement */}
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>

              {/* Titre et message */}
              <div className="mt-3 text-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Confirmer la suppression
                </h3>
                <div className="my-5">
                  <p className="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer{" "}
                    <span className="font-bold">{name}</span> ? Cette action est
                    irréversible.
                  </p>
                </div>
                <div className="mt-5 flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setOpenModal(false);
                    }}
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setOpenModal(false);
                    }}
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
        {showDetails && (
          <ShowDetails
            idCfp={idCustomer}
            details={detailsCfp}
            showDetails={showDetails}
            close={() => {
              setShowDetails(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
