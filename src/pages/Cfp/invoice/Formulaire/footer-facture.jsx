export function FooterFacture({ data }) {
  const setting = JSON.parse(sessionStorage.getItem("setting"));

  return (
    <>
      <div className="flex flex-col px-4 ml-12 mr-12 bg-white rounded-md shadow-sm">
        <details className="w-full bg-white hover:bg-indigo-50 p-4 overflow-hidden max-h-[56px] open:!max-h-[400px] transition-[max-height] duration-500">
          <summary className="flex items-center justify-between">
            <h1 className="text-base font-semibold">Footer</h1>
            <i className="text-base bi bi-chevron-double-down"></i>
          </summary>
          <div className="pt-2 text-lg content">
            <div className="flex flex-col gap-2">
              {/* Ligne 1 */}
              <div className="inline-flex justify-center w-full gap-4 px-8">
                <div className="inline-flex items-center justify-center gap-2">
                  <p className="text-lg text-gray-400">
                    {data.customer?.customerName || "Pas de nom"}
                  </p>
                </div>
                |
                <div className="inline-flex items-center justify-center gap-2">
                  <p className="text-lg text-gray-400">{setting?.nif_name} :</p>
                  <p className="text-lg text-gray-400">
                    {data.customer?.nif || "Pas de numéro NIF"}
                  </p>
                </div>
                |
                <div className="inline-flex items-center justify-center gap-2">
                  <p className="text-lg text-gray-400">
                    {setting?.stat_name} :
                  </p>
                  <p className="text-lg text-gray-400">
                    {data.customer?.stat || "Pas de numéro STAT"}
                  </p>
                </div>
                |
                <div className="inline-flex items-center justify-center gap-2">
                  <p className="text-lg text-gray-400">RCS :</p>
                  <p className="text-lg text-gray-400">
                    {data.customer.rcs || "Pas de numéro RCS"}
                  </p>
                </div>
              </div>

              {/* Ligne 2 */}
              <div className="inline-flex justify-center w-full gap-4 px-8">
                <div className="inline-flex items-center justify-center gap-2">
                  <p className="text-lg text-gray-400">MAIL :</p>
                  <p className="text-lg text-gray-400">
                    {data.customer?.customerEmail || "Pas d'adresse email"}
                  </p>
                </div>
                |
                <div className="inline-flex items-center justify-center gap-2">
                  <p className="text-lg text-gray-400">ADRESSE :</p>
                  <p className="text-lg text-gray-400">
                    {data.customer.customer_addr_lot ||
                    data.customer.customer_addr_quartier ||
                    data.customer.customer_addr_code_postal
                      ? `${data.customer.customer_addr_lot || ""} ${
                          data.customer.customer_addr_quartier || ""
                        } ${data.customer.customer_addr_code_postal || ""}`
                      : "Pas d'adresse"}
                  </p>
                </div>
                |
                <div className="inline-flex items-center justify-center gap-2">
                  <p className="text-lg text-gray-400">TÉLÉPHONE :</p>
                  <p className="text-lg text-gray-400">
                    {data.customer.customerPhone || "Pas de numéro téléphone"}
                  </p>
                </div>
                |
                <div className="inline-flex items-center justify-center gap-2">
                  <p className="text-lg text-gray-400">SITE WEB :</p>
                  <p className="text-lg text-gray-400">
                    {data.customer.siteWeb || "Pas de lien site web"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </>
  );
}
