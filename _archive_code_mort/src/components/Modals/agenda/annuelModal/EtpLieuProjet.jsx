import React, { useState, useEffect } from 'react';
import axios from '../../../../config/axios';


const EtpLieuProjet = ({ route }) => {
  
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
            const res = await  axios.get(route);


            if (res.data.plandereperage && res.data.module ) {
                const {  module, plandereperage } = res.data;

                setModule(module);
                setPlandereperage(plandereperage);
               
            } else {
                setError("Données non trouvées !");
            }
        } catch (err) {
            console.warn("Failed to fetch sessions:", err); // Log the actual error
            setError("Échec de la récupération des sessions. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

  const downloadImage = (imageName) => {
    const imageUrl = `https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/salles/${imageName}`;

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
        .catch(() => console.warn("Erreur lors du téléchargement de l'image"));
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
    return <div className="text-center p-4 text-gray-800">Chargement des données...</div>;
  }

if (error) {
  return (
    <div className="flex flex-col justify-center items-center text-center p-4">
      <p className="text-red-600 mb-4">Une erreur s'est produite : {error}</p>
      <button
        onClick={() => fetchModules()}
        className="bg-purple-500 text-white w-28 rounded p-2 hover:bg-purple-600 transition"
      >
        Réessayer
      </button>
    </div>
  );
}




  return (
    <>
      <div className="flex flex-col w-full">
        <div className="w-full flex flex-col p-1 relative">
          <div className="w-full h-30 rounded-3xl p-1">
            <div className="w-full  flex justify-start items-start gap-1">
              <div className="w-[116px] h-[77px] rounded-xl p-1">
                {module.module_image ? (
                  <img
                    src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/modules/${module.module_image}`}
                    className="object-cover w-full h-full rounded-xl"
                    alt="Module"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-3xl text-gray-500 bg-gray-100 rounded-xl">
                    {module.moduleName[0]}
                  </div>
                )}
              </div>
               <div className="flex flex-col justify-start items-start gap-1">
                <h3 className="text-2xl font-bold text-gray-700">{module.moduleName}</h3>
                <p className="text-base text-gray-500">{module.module_subtitle || ""}</p>
              </div>
              
            </div>
          </div>
        </div>

        <div className="h-full bg-white border flex items-start border-gray-300 rounded-lg p-3" id="previewPane">
          {plandereperage && plandereperage.length > 0 ? (
            plandereperage.map((plan, index) => (
              <div key={index} className="mb-6">
                <h1 className="font-bold text-gray-500 text-sm mb-2">
                  Plan de repérage de la salle
                  <span className="italic text-sm text-slate-400">
                    {` "${plan.salle_name}, ${plan.li_name}, ${plan.li_quartier}, ${plan.ville_name} - ${plan.vi_code_postal}, ${plan.ville}"`}
                  </span>
                  {plan.salle_image && (
                    <i
                      className="fa-solid fa-download text-2xl ml-2 cursor-pointer hover:text-blue-500"
                      title="Télécharger"
                      onClick={() => downloadImage(plan.salle_image)}
                    ></i>
                  )}
                </h1>
                {plan.salle_image ? (
                  <img
                    src={`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/salles/${plan.salle_image}`}
                    alt="Salle"
                    className="w-full h-full rounded-lg cursor-pointer"
                    onClick={() => openImageInModal(`https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/salles/${plan.salle_image}`)}
                  />
                ) : (
                  <p className="text-base text-gray-500">Pas d'image pour le moment.</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-4">Aucun plan de repérage trouvé pour ce projet.</p>
          )}
        </div>
      </div>

      <div
        id="image-modal"
        className="hidden fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      >
      </div>
    </>
  );
};

export default EtpLieuProjet;