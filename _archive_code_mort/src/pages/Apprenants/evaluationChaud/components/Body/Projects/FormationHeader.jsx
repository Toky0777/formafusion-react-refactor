import React from 'react';

const FormationHeader = ({ formation }) => {
  return (
    <div className="w-full h-40 rounded-3xl p-4">
      <div className="w-full h-full inline-flex items-center gap-2">
        <div className="w-[116px] h-[77px] rounded-xl p-1">
          <div className="photo_formation_4">
            <img 
              src={formation.image || "https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/modules/664ce79918ba6.webp"} 
              alt="Formation" 
              className="object-cover w-full h-full rounded-xl shadow-md" 
            />
          </div>
        </div>
        <div className="ml-3 flex flex-col justify-start gap-y-2 w-full">
          <h3 className="text-2xl font-bold text-gray-700 text-start line-clamp-2">
            {formation.title || "EXCEL NIVEAU I Fondamentaux"}
          </h3>
          <p className="text-base text-gray-500 text-start line-clamp-3">
            {formation.description || "Excel"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormationHeader;