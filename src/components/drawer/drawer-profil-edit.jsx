import { useState, useRef, useEffect } from "react";
import { Pen } from "lucide-react";
import { Drawer } from "../ui/drawer";
import { ImageCropper } from "../image-cropper/image-cropper";
import { Input } from "../ui/input-with-label";
import { Button } from "../ui/button-customized";
import { IMAGE_URL } from "../../config/env";

export const EditProfileDrawer = ({
  isOpen,
  onClose,
  profileData,
  cities,
  onUpdate,
}) => {
  const [formData, setFormData] = useState(profileData || {});
  const [formErrors, setFormErrors] = useState({});
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData(profileData || {});
    setFormErrors({});
  }, [profileData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempImageUrl(url);
      setCropperOpen(true);
    }
  };

  const handleCrop = (croppedImage) => {
    setFormData((prev) => ({ ...prev, logo: croppedImage }));
    setCropperOpen(false);
  };

  const handleSubmit = () => {
    const errors = {};
    if (!formData.customerName?.trim())
      errors.customerName = "The customer name field is required.";
    if (!formData.customerEmail?.trim())
      errors.customerEmail = "The customer email field is required.";
    if (!formData.rcs?.trim())
      errors.rcs = "The customer rcs field is required.";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // 🔥 Appelle le parent (ProfilCfp) qui va gérer l’API et le state
    onUpdate(formData);
    onClose();
  };

  const urlPath = IMAGE_URL + "/img/entreprises/";

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} title="Edit Company Profile">
        <div className="space-y-6">
          {/* Logo Section */}
          <div className="grid grid-cols-9 gap-4">
            <div className="col-span-3 flex flex-col items-center gap-2">
              <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                {formData.logo ? (
                  <img
                    src={urlPath + formData.logo}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-semibold">
                    {formData.customerName?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={Pen}
                onClick={() => fileInputRef.current?.click()}
              >
                Change Logo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="col-span-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="NIF"
                  value={formData.nif || ""}
                  onChange={(e) => handleInputChange("nif", e.target.value)}
                />
                <Input
                  label="STAT"
                  value={formData.stat || ""}
                  onChange={(e) => handleInputChange("stat", e.target.value)}
                />
              </div>
              <div>
                <Input
                  label="RCS"
                  value={formData.rcs || ""}
                  onChange={(e) => handleInputChange("rcs", e.target.value)}
                />
                {formErrors.rcs && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.rcs}</p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-400" />

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-600">
              Company Information
            </h3>
            <div>
              <Input
                label="Company Name"
                value={formData.customerName || ""}
                onChange={(e) =>
                  handleInputChange("customerName", e.target.value)
                }
              />
              {formErrors.customerName && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.customerName}
                </p>
              )}
            </div>
            <Input
              label="Slogan"
              value={formData.customerSlogan || ""}
              onChange={(e) =>
                handleInputChange("customerSlogan", e.target.value)
              }
            />
            <Input
              label="Description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              isTextarea
            />
          </div>

          <hr className="border-gray-400" />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-600">Contact</h3>
            <Input
              label="Phone"
              type="tel"
              value={formData.customerPhone || ""}
              onChange={(e) =>
                handleInputChange("customerPhone", e.target.value)
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  label="Email"
                  type="email"
                  value={formData.customerEmail || ""}
                  onChange={(e) =>
                    handleInputChange("customerEmail", e.target.value)
                  }
                />
                {formErrors.customerEmail && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.customerEmail}
                  </p>
                )}
              </div>
              <Input
                label="Website"
                value={formData.siteWeb || ""}
                onChange={(e) => handleInputChange("siteWeb", e.target.value)}
              />
            </div>
          </div>

          <hr className="border-gray-400" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-600">Location</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Lot"
                value={formData.customerAddrLot || ""}
                onChange={(e) =>
                  handleInputChange("customerAddrLot", e.target.value)
                }
              />
              <Input
                label="District"
                value={formData.customerAddrQuartier || ""}
                onChange={(e) =>
                  handleInputChange("customerAddrQuartier", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="city-select"
                className="text-sm font-medium text-gray-600"
              >
                Postal Code - City
              </label>
              <select
                id="city-select"
                value={formData.customerAddrCodePostal || ""}
                onChange={(e) => {
                  const selectedCity = cities.find(
                    (city) => city.vi_code_postal === e.target.value
                  );
                  if (selectedCity)
                    handleInputChange(
                      "customerAddrCodePostal",
                      selectedCity.vi_code_postal
                    );
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.vi_code_postal}>
                    {city.vi_code_postal} - {city.ville_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </div>
        </div>
      </Drawer>

      <ImageCropper
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        onCrop={handleCrop}
        imageUrl={tempImageUrl}
        title="Crop Company Logo"
      />
    </>
  );
};
