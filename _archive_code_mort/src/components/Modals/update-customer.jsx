import React from "react";
import InputField from "./InputField"; // composant personnalisé
import { FaXmark } from "react-icons/fa6";

const UpdateCustomer = ({ client, villeCodeds, onClose, onUpdate, onChange }) => {
  return (
    <div className="fixed top-0 right-0 h-full w-[45em] bg-white shadow-xl z-50 overflow-y-auto">
      <div className="flex flex-col w-full">
        <div className="inline-flex items-center justify-between w-full px-4 py-2 bg-gray-100">
          <p className="text-lg font-medium text-gray-500">Modifier un client</p>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-200"
          >
            <FaXmark className="text-gray-500" />
          </button>
        </div>

        <div className="w-full p-4 overflow-x-auto overflow-y-auto h-full pb-20">
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center gap-3">
              <InputField name="etp_nif_edit" label="NIF" value={client.etp_nif} onChange={onChange} />
              <InputField name="etp_stat_edit" label="STAT" value={client.etp_stat} onChange={onChange} />
            </div>
            <InputField name="etp_rcs_edit" label="RCS" value={client.etp_rcs} onChange={onChange} />

            <hr className="border-[1px] border-gray-400 mt-2" />

            <div className="flex flex-col gap-2">
              <input type="hidden" id="id_entreprise_hidden" value={client.idEtp} />

              <label className="text-lg font-medium text-gray-600">Informations de base</label>
              <InputField name="etp_name_edit" label="Nom de l'entreprise" value={client.etp_name} onChange={onChange} />

              <div className="grid grid-cols-2 gap-3">
                <InputField name="etp_email_edit" type="email" label="Mail" value={client.etp_email} onChange={onChange} />
                <InputField name="etp_phone_edit" type="tel" label="Téléphone" value={client.etp_phone} onChange={onChange} />
              </div>

              <hr className="border-[1px] border-gray-400 mt-4" />
              <label className="text-lg font-medium text-gray-600">Localisation</label>

              <div className="grid grid-cols-2 gap-3">
                <InputField name="etp_lot_edit" label="Lot" value={client.etp_addr_lot} onChange={onChange} />
                <InputField name="etp_qrt_edit" label="Quartier" value={client.etp_addr_quartier} onChange={onChange} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="etp_ville_edit" className="text-gray-600">
                    Code postal et Ville
                  </label>
                  <select
                    name="etp_ville_edit"
                    id="etp_ville_edit"
                    value={client.etp_ville_edit}
                    onChange={onChange}
                    className="bg-white outline-none w-full pl-2 h-12 border border-slate-200 rounded-md hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 text-gray-700"
                  >
                    {villeCodeds.map((ville) => (
                      <option key={ville.id} value={ville.id}>
                        {ville.vi_code_postal} - {ville.ville_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="inline-flex items-end justify-end w-full pt-3 mb-10 gap-2">
              <button onClick={onClose} className="btn btn-ghost text-gray-700 hover:text-inherit">
                Annuler
              </button>
              <button onClick={onUpdate} className="btn btn-primary bg-[#A462A4] text-white">
                Sauvegarder les modifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCustomer;
