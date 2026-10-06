import { useState } from "react";
import NameStepCustomer from "../../steps/customer/NameStep";
import DrawerCustomer from "./openDrawer";
import EmailStepCustomer from "../../steps/customer/EmailStep";
import TypeStepCustomer from "../../steps/customer/TypeStep";
import { inviteNewCustomer } from "../../../services/cfp/customer/addCustomerService";
import "toastr/build/toastr.min.css";
import toastr from "toastr";

export default function AddCustomer({ show, close, getAllEtps }) {
  const [isLoading, setIsLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [customerData, setCustomerData] = useState({
    companyName: "",
    email: "",
    clientType: 0,
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setCustomerData({
      companyName: "",
      email: "",
      clientType: 0,
    });
    close();
  };

  const updateCustomerData = (data) => {
    setCustomerData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { data } = await inviteNewCustomer(
        parseInt(customerData.clientType),
        customerData.companyName,
        customerData.email
      );
      if (data.status === 200) {
        toastr.success(data.message);
        getAllEtps();
        close();
      } else {
        toastr.error(data.message.customer_email[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DrawerCustomer isOpen={show} onClose={handleClose}>
      <div className="flex flex-col h-full overflow-auto px-5">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-10">Ajouter un client</h2>

          <div className="flex items-center justify-center mb-20">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-medium ${
                currentStep >= 1
                  ? "bg-[#80558d] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div
              className={`h-1 w-28 mx-2 ${
                currentStep >= 2 ? "bg-[#80558d]" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-medium ${
                currentStep >= 2
                  ? "bg-[#80558d] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <div
              className={`h-1 w-28 mx-2 ${
                currentStep >= 3 ? "bg-[#80558d]" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-medium ${
                currentStep >= 3
                  ? "bg-[#80558d] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              3
            </div>
          </div>
        </div>

        {/* Contenu des étapes */}
        <div className="flex-1">
          {currentStep === 1 && (
            <NameStepCustomer
              customerData={customerData}
              updateCustomerData={updateCustomerData}
              onNext={handleNext}
              allEtps={getAllEtps}
              onClose={close}
            />
          )}
          {currentStep === 2 && (
            <EmailStepCustomer
              customerData={customerData}
              updateCustomerData={updateCustomerData}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          )}
          {currentStep === 3 && (
            <TypeStepCustomer
              isLoading={isLoading}
              customerData={customerData}
              updateCustomerData={updateCustomerData}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </DrawerCustomer>
  );
}
