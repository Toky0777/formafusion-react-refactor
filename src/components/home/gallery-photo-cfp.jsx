import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Building, Calendar, Camera, ChevronLeft, ChevronRight, MapPin, ZoomIn } from "lucide-react"
import { useState, useEffect } from "react"

export function PhotoGalleryWidgetCfp({ data }) {
  const images = data?.images || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);

  // Fonction pour formater les dates de manière lisible
  const formatDateRange = (dateDebut, dateFin) => {
    if (!dateDebut && !dateFin) return "Dates non précisées";
    
    const formatDate = (dateString) => {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } catch (error) {
        return dateString;
      }
    };

    const debutFormatted = formatDate(dateDebut);
    const finFormatted = formatDate(dateFin);

    if (debutFormatted && finFormatted) {
      // Si les deux dates sont dans le même mois/année, on simplifie l'affichage
      const debut = new Date(dateDebut);
      const fin = new Date(dateFin);
      
      if (debut.getMonth() === fin.getMonth() && debut.getFullYear() === fin.getFullYear()) {
        return `${debut.getDate()} - ${finFormatted}`;
      }
      
      return `${debutFormatted} - ${finFormatted}`;
    } else if (debutFormatted) {
      return `À partir du ${debutFormatted}`;
    } else if (finFormatted) {
      return `Jusqu'au ${finFormatted}`;
    }
    
    return "Dates non précisées";
  };

  // Déterminer le nombre d'images visibles selon la taille d'écran
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width >= 1536) { // 2xl
        setVisibleCount(6);
      } else if (width >= 1280) { // xl
        setVisibleCount(5);
      } else if (width >= 1024) { // lg
        setVisibleCount(4);
      } else if (width >= 768) { // md
        setVisibleCount(3);
      } else {
        setVisibleCount(2); // sm - mais on garde 4 comme minimum
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // S'assurer qu'on a toujours au minimum 4 images visibles
  const displayCount = Math.max(4, visibleCount);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + displayCount >= images.length ? 0 : prev + displayCount));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - displayCount < 0 ? Math.max(0, images.length - displayCount) : prev - displayCount));
  };

  const visiblePhotos = images.slice(currentIndex, currentIndex + displayCount);

  // Calculer le nombre de colonnes pour la grille
  const getGridCols = () => {
    switch (displayCount) {
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-3";
      case 4: return "grid-cols-2 lg:grid-cols-4";
      case 5: return "grid-cols-2 lg:grid-cols-5";
      case 6: return "grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";
      default: return "grid-cols-2 lg:grid-cols-4";
    }
  };

  // Si aucune image du tout
  if (images.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Camera className="w-5 h-5 text-blue-600" />
            Galerie Photos - Dernières Formations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Camera className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune photo disponible</h3>
            <p className="text-gray-500 max-w-sm">
              Les photos de formation apparaîtront ici une fois qu'elles seront ajoutées.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }


  return (
    <>
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Camera className="w-5 h-5 text-blue-600" />
              Galerie Photos - Dernières Formations
              <Badge variant="outline" className="ml-2 text-xs">
                {images.length} photo{images.length > 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            {/* Grille dynamique - n'affiche que les photos disponibles */}
            <div className={`grid ${getGridCols()} gap-3 min-h-[180px]`}>
              {visiblePhotos.map((photo) => (
                <div
                  key={photo.idImages}
                  className="relative group cursor-pointer bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 overflow-hidden"
                  onClick={() => setSelectedImage(photo)}
                >
                  {/* Image avec overlay au hover */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={photo.img_url || "/placeholder.svg"}
                      alt={photo.module_name}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    />
                    
                    {/* Badge de date */}
                    <div className="absolute top-2 right-2">
                      <Badge className="text-xs bg-black/80 text-white border-0 backdrop-blur-sm">
                        {photo.img_created_human}
                      </Badge>
                    </div>
                    
                    {/* Overlay avec bouton zoom */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <ZoomIn className="w-3 h-3 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contenu texte */}
                  <div className="p-2 bg-gray-100">
                    <h4 className="text-xs font-semibold truncate text-gray-900 mb-1">
                      {photo.module_name}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {photo.img_description || "Formation en cours"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation - seulement si plus de photos que le displayCount */}
            {images.length > displayCount && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute w-8 h-8 -translate-y-1/2 shadow-lg -left-4 top-1/2 bg-white/95 backdrop-blur-sm border-gray-300 hover:bg-white hover:border-blue-400 hover:scale-110 transition-all sm:w-10 sm:h-10"
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute w-8 h-8 -translate-y-1/2 shadow-lg -right-4 top-1/2 bg-white/95 backdrop-blur-sm border-gray-300 hover:bg-white hover:border-blue-400 hover:scale-110 transition-all sm:w-10 sm:h-10"
                  onClick={nextSlide}
                  disabled={currentIndex + displayCount >= images.length}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Indicateurs de pagination - seulement si nécessaire */}
          {images.length > displayCount && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="text-xs text-gray-500">
                {Math.floor(currentIndex / displayCount) + 1} / {Math.ceil(images.length / displayCount)}
              </span>
              <div className="flex gap-1.5">
                {Array.from({ length: Math.ceil(images.length / displayCount) }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      Math.floor(currentIndex / displayCount) === index 
                        ? "bg-blue-600 w-4" 
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    onClick={() => setCurrentIndex(index * displayCount)}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de visualisation */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-full bg-white rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.img_url || "/placeholder.svg"}
              alt={selectedImage.module_name}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{selectedImage.module_name}</h3>
              
              {/* Date avec icône calendrier */}
              <div className="flex items-center text-gray-200 mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDateRange(selectedImage.dateDebut, selectedImage.dateFin)}</span>
              </div>
              
              {/* Centre de formation avec icône bâtiment */}
              <div className="flex items-center text-gray-200 mb-1">
                <Building className="w-4 h-4 mr-2" />
                <span>{selectedImage.cfp_name}</span>
              </div>
              
              {/* Ville avec icône lieu */}
              <div className="flex items-center text-gray-200 mb-3">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{selectedImage.ville}</span>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {selectedImage.img_created_human}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white/30 hover:bg-white/10"
                  onClick={() => setSelectedImage(null)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}