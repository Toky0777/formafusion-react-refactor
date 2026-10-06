import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import "toastr/build/toastr.min.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import FirstStep from "./step/FirstStep";
import SecondStep from "./step/SecondStep";
import ThirdStep from "./step/ThirdStep";
import "toastr/build/toastr.min.css";
import toastr from "toastr";

export default function NewFmfp() {
  const { getAllEtps, getAllProjectsFmfp, store } = useOutletContext();
  const [etps, setEtps] = useState([]);
  const [types, setTypes] = useState([]);
  const [mdls, setMdls] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllProjectsFmfp();
        setEtps(res.entreprises);
        setTypes(res.types);
        setMdls(res.modules);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    idEtp: "",
    idModule: "",
    start_date: "",
    end_date: "",
    requested_amount: "",
    ap_name: "",
  });

  const navigate = useNavigate();

  const handleEtpAdded = async () => {
    try {
      const updatedEtps = await getAllEtps();
      setEtps(updatedEtps);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement de la liste:", error);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1 && formData.type && formData.idModule) {
      setCurrentStep(2);
    } else if (
      currentStep === 2 &&
      formData.start_date &&
      formData.end_date &&
      formData.requested_amount
    ) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateForm = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.type) {
        newErrors.type = "Le type de projet est requis";
      }

      if (Number(formData.type) === 3) {
        if (!formData.ap_name) {
          newErrors.ap_name = "L'AP type est requis";
        }
      }
      if (!formData.idEtp) {
        newErrors.entreprise = "L'entreprise est requis";
      }
      if (!formData.idModule || formData.idModule.length === 0) {
        newErrors.module = "Le module de formation est requis";
      }
    } else {
      if (!formData.start_date) {
        newErrors.start_date = "La date de début est requise";
      } else {
        const startDate = new Date(formData.start_date);

        if (formData.end_date) {
          const expirationDate = new Date(formData.end_date);
          if (startDate >= expirationDate) {
            newErrors.start_date =
              "La date de début doit être avant la date de fin";
          }
        }
      }
      if (!formData.end_date) {
        newErrors.end_date = "La date d'expiration est requise";
      }
      if (!formData.requested_amount) {
        newErrors.requested_amount = "Le montant à demandé est requis";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    const newData = {
      requested_amount: Number(formData.requested_amount),
      start_date: formData.start_date,
      end_date: formData.end_date,
      type: Number(formData.type),
      ap_name: formData.ap_name,
      idEtp: Number(formData.idEtp),
      idModule: formData.idModule,
    };
    try {
      const res = await store(newData);
      if (res.status === 201) {
        toastr.success(res.message);
        setFormData({
          type: "",
          idEtp: "",
          idModule: "",
          start_date: "",
          end_date: "",
          requested_amount: "",
          ap_name: "",
        });
        navigate("/cfp/fmfp/en_soumission");
      }
    } catch (error) {
      console.log();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto p-6 max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div className="flex justify-center items-center mb-4">
        {/* Étape 1 */}
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            <span className="font-semibold text-xl">1</span>
          </div>
          <div
            className={`w-16 h-[3px] mx-2 ${
              currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"
            }`}
          ></div>
        </div>

        {/* Étape 2 */}
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= 2
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            <span className="font-semibold text-xl">2</span>
          </div>
          <div
            className={`w-16 h-[3px] mx-2 ${
              currentStep >= 3 ? "bg-blue-600" : "bg-gray-300"
            }`}
          ></div>
        </div>

        {/* Étape 3 */}
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= 3
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            <span className="font-semibold text-xl">3</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <FirstStep
            onChange={handleChange}
            types={types}
            errors={errors}
            formData={formData}
            onNext={handleNext}
            mdls={mdls}
          />
        )}

        {/* Étape 2 */}
        {currentStep === 2 && (
          <SecondStep
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}

        {currentStep === 3 && (
          <ThirdStep
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onBack={handleBack}
            etps={etps}
            isSubmitting={submitting}
            onEtpAdded={handleEtpAdded}
          />
        )}
      </form>
    </div>
  );
}
