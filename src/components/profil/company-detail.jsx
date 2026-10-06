import { IMAGE_URL } from "../../config/env";

export const CompanyDetails = ({
  logo,
  customerName,
  customerSlogan,
  nif,
  stat,
  rcs,
  customerPhone,
  customerEmail,
  siteWeb,
  customerAddrLot,
  customerAddrQuartier,
  customerAddrCodePostal,
}) => {
  const formatAddress = () => {
    const parts = [
      customerAddrLot,
      customerAddrQuartier,
      customerAddrCodePostal,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" - ") : "--";
  };

  const urlPath = IMAGE_URL + "/img/entreprises/";

  return (
    <section className="flex flex-col m-4">
      <div className="grid grid-cols-1 p-3 border border-gray-100 bg-white rounded-xl">
        <div className="grid col-span-1 p-2">
          <h3 className="text-lg font-medium text-gray-600">Company Details</h3>
        </div>
        <hr className="border border-gray-300 my-2" />

        <div className="grid col-span-1 p-2">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Logo + Name + Slogan */}
            <div className="grid col-span-1">
              <div className="grid grid-cols-1 gap-2">
                {logo ? (
                  <img
                    src={urlPath + logo}
                    alt="logo"
                    className="w-full h-auto md:w-80 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-full md:w-80 h-32 bg-gray-200 rounded-xl flex items-center justify-center">
                    <span className="text-gray-500 text-lg">
                      {customerName}
                    </span>
                  </div>
                )}
                <h2 className="text-lg font-medium text-gray-700">
                  {customerName}
                </h2>
                <h3 className="text-gray-500">
                  {customerSlogan || <span className="text-gray-600">--</span>}
                </h3>
              </div>
            </div>

            {/* Infos */}
            <div className="grid col-span-1 lg:col-span-2">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-3">
                  <DetailRow label="NIF" value={nif || "--"} />
                  <DetailRow label="STAT" value={stat || "--"} />
                  <DetailRow label="RCS" value={rcs || "--"} />
                  <DetailRow label="Address" value={formatAddress()} />
                </div>

                <div className="flex flex-col gap-3">
                  <DetailRow label="Phone" value={customerPhone || "--"} />
                  <DetailRow label="Email" value={customerEmail || "--"} />
                  <DetailRow label="Website" value={siteWeb || "--"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="grid grid-cols-5 gap-1">
    <div className="col-span-1">
      <span className="text-gray-400 text-sm">{label}</span>
    </div>
    <div className="col-span-4">
      <span className="font-medium text-gray-600 text-sm break-all">
        {value}
      </span>
    </div>
  </div>
);
