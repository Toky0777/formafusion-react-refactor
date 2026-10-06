import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { ModalImageCropper } from "../Modals/modal-image-cropper";

export const ImageCropper = ({
  isOpen,
  onClose,
  onCrop,
  imageUrl,
  aspectRatio = 1,
  title = "Crop Image",
}) => {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [cropData, setCropData] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (rect) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCropData((prev) => ({
      ...prev,
      x: Math.max(0, Math.min(x - prev.width / 2, rect.width - prev.width)),
      y: Math.max(0, Math.min(y - prev.height / 2, rect.height - prev.height)),
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    canvas.width = cropData.width;
    canvas.height = cropData.height;

    ctx?.drawImage(
      img,
      cropData.x,
      cropData.y,
      cropData.width,
      cropData.height,
      0,
      0,
      cropData.width,
      cropData.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onCrop(reader.result);
          onClose();
        };
        reader.readAsDataURL(blob);
      }
    });
  };

  return (
    <ModalImageCropper
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4 h-96">
          <div className="col-span-3 relative overflow-hidden border rounded-lg">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop preview"
              className="w-full h-full object-contain"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />

            {/* Crop overlay */}
            <div
              className="absolute border-2 border-red-500 bg-black bg-opacity-25"
              style={{
                left: cropData.x,
                top: cropData.y,
                width: cropData.width,
                height: cropData.height,
                cursor: isDragging ? "grabbing" : "grab",
              }}
            />
          </div>

          <div className="col-span-1 flex justify-center">
            <div className="w-40 h-40 border border-red-500 overflow-hidden rounded-lg">
              <div
                className="bg-contain bg-no-repeat bg-center w-full h-full"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: `${
                    (imageRef.current?.offsetWidth || 1) *
                    (160 / cropData.width)
                  }px auto`,
                  backgroundPosition: `${
                    -cropData.x * (160 / cropData.width)
                  }px ${-cropData.y * (160 / cropData.height)}px`,
                }}
              />
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCrop}>Crop Image</Button>
        </div>
      </div>
    </ModalImageCropper>
  );
};
