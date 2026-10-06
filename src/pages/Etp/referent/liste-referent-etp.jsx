import { useEffect, useState } from "react";
import axios from "../../../config/axios";
import { Spinner } from "../../../components/ui/spinner";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { CardReferentEtp } from "./card-referent-etp";
import ReferentAddDrawerEtp from "./add-referent-drawer-etp";
import { useOutletContext } from "react-router-dom";

export function ListeReferentEtp() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { open, setOpen } = useOutletContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("etp/referents");
        setData(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  console.log(data);
  return (
    <>
      <div className="flex flex-col w-full bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50">
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            removeDelay: 1000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        ></Toaster>
        {/* <NavbarTrainer setShowModalAjout={setShowModalAjout} search={search} setSearch={setSearch} /> */}
        <div className="w-full min-h-screen p-4 mt-2 bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50">
          <div className="flex flex-col w-full h-full px-4">
            <div className="w-full h-full mx-auto">
              <section id="content" className="p-2 mt-2">
                {loading ? (
                  <div className="flex justify-center">
                    <div className="p-6 text-center w-96">
                      <Spinner />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {data?.referentAll?.data?.map((referent, index) => (
                      <CardReferentEtp
                        key={index}
                        referent={referent}
                        setReferent={setData}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <ReferentAddDrawerEtp
              onClose={() => setOpen(false)}
              isOpen={open}
              setReferent={setData}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
