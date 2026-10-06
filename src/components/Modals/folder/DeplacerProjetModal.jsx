import { useEffect, useState } from "react";
import axios from "../../../config/axios";
import { toast } from 'react-toastify';

const DeplacerProjetModal = ({ isOpen, idProjet, onClose, onConfirm }) => {
  const [selectedDossierId, setSelectedDossierId] = useState("");
  const [dossiers, setDossiers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Nouveau: pour empêcher double clic

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 50);
    } else {
      setVisible(false);
      setSelectedDossierId("");
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        const response = await axios.get("/cfp/dossier/getOneDocumentByFolder");
        console.log("Dossiers reçus :", response.data.folderdocuments);
        setDossiers(response.data.folderdocuments);
      } catch (error) {
        console.error("Erreur lors de la récupération des dossiers :", error);
      }
    };

    if (isOpen) fetchDossiers();
  }, [isOpen]);

  const handleChange = (e) => {
    setSelectedDossierId(e.target.value);
  };

  const handleConfirm = async () => {
    if (!selectedDossierId || !idProjet) {
      toast.error("Veuillez sélectionner un dossier et un projet avant de valider.");
      return;
    }

    setLoading(true); // Bloque les clics pendant le traitement
    console.log("Appel API pour déplacer le projet...");

    try {
      const response = await axios.post('/cfp/dossier/move-projet', {
        idProjet,
        idDossier: selectedDossierId,
      });

      if (response.status === 200) {
        const message = response.data.message;
        toast.success(message || "Projet déplacé avec succès !");
        onClose(); // Ferme le modal
        onConfirm(idProjet, selectedDossierId); // Mets à jour la vue
      } else {
        throw new Error("Réponse inattendue");
      }
    } catch (error) {
      console.error("Erreur lors du déplacement :", error);
      toast.error("Erreur lors du déplacement du projet.");
    } finally {
      setLoading(false); // Réactive le bouton
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 500);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ease-in-out ${visible ? "bg-black/40 backdrop-blur-sm opacity-100" : "opacity-0 bg-black/0"}`}>
      <div className={`w-full max-w-md p-6 rounded-xl shadow-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 transform transition-all duration-500 ease-in-out ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"}`}>
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Déplacer ce projet vers :</h2>

        <select
          id="dossier-select"
          className="w-full p-3 mb-6 transition border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          value={selectedDossierId}
          onChange={handleChange}
        >
          <option value="">-- Sélectionner un dossier --</option>
          {dossiers.map((dossier, index) => (
            <option key={`${dossier.idDossier}-${index}`} value={dossier.idDossier}>
              {dossier.nomDossier}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleConfirm}
            disabled={!selectedDossierId || loading}
            className={`px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 ease-in-out ${selectedDossierId && !loading
                ? "bg-purple-600 text-white hover:bg-purple-700 focus:ring-4 focus:ring-purple-300"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            {loading ? "Chargement..." : "Valider"}
          </button>

          <button
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:text-black transition-all duration-300 ease-in-out"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeplacerProjetModal;
