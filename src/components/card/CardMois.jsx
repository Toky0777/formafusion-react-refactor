import { Calendar } from "lucide-react";

const CardMois = ({ dataParMois }) => {
  return (
    <>
      <div className="bg-blue-500 flex items-center text-white gap-2 px-5 py-2 rounded">
        <Calendar className="h-5 w-5" />
        <h1 className="font-bold  text-lg">Mois</h1>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {dataParMois?.map((item, index) => (
          <div
            key={index}
            className={` bg-white border border-gray-200 rounded-lg  duration-300 h-20 p-2 ${
              item?.heures <= 0 ? "!bg-slate-100" : ""
            }`}
          >
            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-500"> {item?.mois}</span>
              <div className="inline-flex items-center w-full justify-between">
                <p className="text-slate-800 font-medium text-sm">
                  {" "}
                  {item?.heures} hrs
                </p>
                <p className="text-xs">
                  <i
                    className="fa-solid fa-star text-yellow-500"
                    aria-hidden="true"
                  ></i>{" "}
                  {item?.note}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CardMois;
