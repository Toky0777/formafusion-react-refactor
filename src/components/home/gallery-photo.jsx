import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Camera, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export function PhotoGalleryWidget({ data }) {
  const images = data?.images || [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 2 >= images.length ? 0 : prev + 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 2 < 0 ? Math.max(0, images.length - 2) : prev - 2));
  };

  const visiblePhotos = images.slice(currentIndex, currentIndex + 2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Galerie Photos - Dernières Formations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="grid grid-cols-2 gap-3 min-h-[200px]">
            {visiblePhotos.length > 0 ? visiblePhotos.map((photo) => (
              <div
                key={photo.idImages}
                className="relative overflow-hidden transition-all border rounded-lg cursor-pointer group hover:shadow-md"
              >
                <div className="relative aspect-video">
                  <img
                    src={photo.img_url || "/placeholder.svg"}
                    alt={photo.module_name}
                    className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs text-white border-0 bg-black/70">
                      {photo.img_created_human}
                    </Badge>
                  </div>
                </div>
                <div className="p-2">
                  <h4 className="text-sm font-medium truncate">{photo.module_name}</h4>
                  <p className="text-xs truncate text-muted-foreground">{photo.img_description}</p>
                </div>
              </div>
            )) : (
              <div className="col-span-2 py-8 text-center text-muted-foreground">
                Aucune image disponible
              </div>
            )}
          </div>

          {images.length > 2 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute w-8 h-8 -translate-y-1/2 shadow-md left-2 top-1/2 bg-white/90 hover:bg-white"
                onClick={prevSlide}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute w-8 h-8 -translate-y-1/2 shadow-md right-2 top-1/2 bg-white/90 hover:bg-white"
                onClick={nextSlide}
                disabled={currentIndex + 2 >= images.length}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {images.length > 2 && (
          <div className="flex justify-center gap-1 mt-3">
            {Array.from({ length: Math.ceil(images.length / 2) }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${Math.floor(currentIndex / 2) === index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                onClick={() => setCurrentIndex(index * 2)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}