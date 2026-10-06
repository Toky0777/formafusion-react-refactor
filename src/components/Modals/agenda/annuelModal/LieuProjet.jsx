import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../contexts/AuthContext';
import { API_URL, IMAGE_URL } from "../../../../config/env";

const LieuProjet = ({ route }) => {
  const auth = useAuth();
  const [module, setModule] = useState([]);
  const [plandereperage, setPlandereperage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    if (route) {
      fetchModules();
    }
  }, [route]);

  const fetchModules = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await axios.get(route, {
        baseURL: API_URL,
        headers: { Authorization: `Bearer ${auth.token}` }
      });


      if (res.data.plandereperage && res.data.module) {
        const { module, plandereperage } = res.data;

        setModule(module);
        setPlandereperage(plandereperage);

      } else {
        setError("Données non trouvées !");
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err); // Log the actual error
      setError("Échec de la récupération des sessions. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (imageName) => {
    const imageUrl = `${IMAGE_URL}/img/salles/${imageName}`;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageName;

    if (imageUrl.startsWith(window.location.origin)) {
      link.click();
    } else {
      axios
        .get(imageUrl, { responseType: 'blob' })
        .then((res) => {
          const objectURL = URL.createObjectURL(res.data);
          link.href = objectURL;
          link.click();
        })
        .catch(() => console.error("Erreur lors du téléchargement de l'image"));
    }
  };

  const openImageInModal = (src) => {
    const modal = document.getElementById("image-modal");
    const modalImage = document.getElementById("modal-image");

    modalImage.src = src;
    modal.classList.remove("hidden");
    modal.onclick = () => modal.classList.add("hidden");
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-800">Chargement des données...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <p className="mb-4 text-red-600">Une erreur s'est produite : {error}</p>
        <button
          onClick={() => fetchModules()}
          className="p-2 text-white transition bg-purple-500 rounded w-28 hover:bg-purple-600"
        >
          Réessayer
        </button>
      </div>
    );
  }




  return (
    <>
      <div className="flex flex-col w-full">
        <div className="relative flex flex-col w-full p-1">
          <div className="w-full p-1 h-30 rounded-3xl">
            <div className="flex items-start justify-start w-full gap-1">
              <div className="w-[116px] h-[77px] rounded-xl p-1">
                {module.module_image ? (
                  <img
                    src={`${IMAGE_URL}/img/modules/${module.module_image}`}
                    className="object-cover w-full h-full rounded-xl"
                    alt="Module"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-3xl text-gray-500 bg-gray-100 rounded-xl">
                    {module.moduleName[0]}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start justify-start gap-1">
                <h3 className="text-2xl font-bold text-gray-700">{module.moduleName}</h3>
                <p className="text-base text-gray-500">{module.module_subtitle || ""}</p>
              </div>

            </div>
          </div>
        </div>

        <div className="flex items-start h-full p-3 bg-white border border-gray-300 rounded-lg" id="previewPane">
          {plandereperage && plandereperage.length > 0 ? (
            plandereperage.map((plan, index) => (
              <div key={index} className="mb-6">
                <h1 className="mb-2 text-sm font-bold text-gray-500">
                  Plan de repérage de la salle
                  <span className="text-sm italic text-slate-400">
                    {` "${plan.salle_name}, ${plan.li_name}, ${plan.li_quartier}, ${plan.ville_name} - ${plan.vi_code_postal}, ${plan.ville}"`}
                  </span>
                  {plan.salle_image && (
                    <i
                      className="ml-2 text-2xl cursor-pointer fa-solid fa-download hover:text-blue-500"
                      title="Télécharger"
                      onClick={() => downloadImage(plan.salle_image)}
                    ></i>
                  )}
                </h1>
                {plan.salle_image ? (
                  <img
                    src={`${IMAGE_URL}/img/salles/${plan.salle_image}`}
                    alt="Salle"
                    className="w-full h-full rounded-lg cursor-pointer"
                    onClick={() => openImageInModal(`${IMAGE_URL}/img/salles/${plan.salle_image}`)}
                  />
                ) : (
                  <p className="text-base text-gray-500">Pas d'image pour le moment.</p>
                )}
              </div>
            ))
          ) : (
            <p className="mt-4 text-gray-500">Aucun plan de repérage trouvé pour ce projet.</p>
          )}
        </div>
      </div>

      <div
        id="image-modal"
        className="fixed inset-0 z-50 flex items-center justify-center hidden bg-black bg-opacity-75"
      >
      </div>
    </>
  );
};

export default LieuProjet;