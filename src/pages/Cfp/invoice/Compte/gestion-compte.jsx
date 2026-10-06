import { useEffect, useState } from "react";
import { MobileMoney } from "./type/mobile-money";
import { ListeFacturation } from "./type/liste-facturation";
import { ListeCarteBancaire } from "./type/liste-carte-bancaire";
import { ListeInvoiceContacts } from "./type/liste-invoice-contacts";
import useApi from "../../../../hooks/Api";
import { Spinner } from "../../../../components/ui/spinner";
import { useAuth } from "../../../../contexts/AuthContext";
export function GererCompte() {
  const setting = JSON.parse(sessionStorage.getItem("setting"));
  const [data, setData] = useState(null);
  const { loading, error, callApi } = useApi();
  const { user } = useAuth();
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const fetchData = async (user) => {
      try {
        const response = await callApi(`/cfp/invoice-account`);
        setData(response);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(user);
  }, [callApi, user, reload]);

  if (loading || data === null) return <Spinner />;
  if (error) return <p>Erreur : {error.message}</p>;
  <style>
    {`
    img {
        display: block;
        max-width: 100%;
    }

    .previewRef {
        text-align: center;
        overflow: hidden;
        width: 160px;
        height: 160px;
        margin: 10px;
        border: 1px solid red;
    }

    .modal-lg {
        max-width: 1000px;
    }
`}
  </style>;

  return (
    <>
      <div className="w-full h-full my-4">
        <div className="flex flex-col w-full max-w-screen-xl p-4 mx-auto bg-white rounded-xl">
          <ListeCarteBancaire data={data} setReload={setReload} />
          <MobileMoney data={data} setReload={setReload} />
          <ListeFacturation data={data} setReload={setReload} />
          <ListeInvoiceContacts contacts={data?.contacts || []} reload={reload} setReload={setReload} />
        </div>
      </div>
    </>
  );
}
export const InputField = ({ label, name, defaultValue, required, obli }) => (
  <div className="flex flex-col w-full gap-1">
    <div className="flex flex-col w-full gap-1">
      <span className="inline-flex items-center w-full gap-2">
        <label className="text-slate-700  after:content-['*'] after:ml-0.5 after:text-red-500 ">
          {label}
        </label>
        <p for="" className="text-sm italic text-slate-500">
          {obli ? "Ce champ est obligatoire !" : ""}
        </p>
      </span>
      <div className="relative inline-flex w-full">
        <input
          type="text"
          name={name}
          defaultValue={defaultValue}
          required={required}
          className="w-full px-2 py-1 border rounded"
        />
      </div>
    </div>
  </div>
);
