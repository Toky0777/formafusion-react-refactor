import React, { useState } from "react";
import { MapPin, Calendar, Users, ChevronRight, Star } from 'lucide-react';
import { Link } from "react-router-dom";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star 
          key={i} 
          className="w-4 h-4 text-yellow-400" 
          fill="#FACC15" 
          aria-hidden="true" 
        />
      );
    } else {
      stars.push(
        <Star 
          key={i} 
          className="w-4 h-4 text-gray-300" 
          aria-hidden="true" 
        />
      );
    }
  }
  
  return (
    <div className="flex" aria-label={`Note de ${rating} sur 5`}>
      {stars}
    </div>
  );
};

const DEFAULT_PLACEHOLDER_IMAGE = "/api/placeholder/400/320";

const EventCard = ({ project }) => {
    const [imageError, setImageError] = useState(false);
    
    if (!project) {
      return null;
    }
  
    const {
      name,
      image,
      domaine,
      idCustomer,
      customer,
      description,
      price,
      ville,
      dateDebut,
      available_place,
      idProjet
    } = project;
    
    const { average, totalEmployees } = project.note || { average: 0, totalEmployees: 0 };
    
    const imageUrl = imageError 
      ? DEFAULT_PLACEHOLDER_IMAGE 
      : `https://formafusionmg.ams3.cdn.digitaloceanspaces.com/formafusionmg/img/modules/${image}`;
  
    return (
        <article className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
            <div className="relative h-48 overflow-hidden">
                <img 
                    src={imageUrl}
                    alt={name || "Image de l'évenement"}
                    className="object-cover w-full h-full"
                    onError={() => setImageError(true)}
                />
                {domaine && (
                    <div className="absolute top-0 right-0 px-3 py-1 m-2 text-sm font-medium bg-gray-600 text-white rounded-full">
                    {domaine}
                    </div>
                )}
            </div>
            <div className="p-3">
                <div className="mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">
                        {name || "Sans titre"}
                        </h3>
                        {customer && (
                        <p className="text-sm text-purple-600">
                            Par <a 
                            className="hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded" 
                            href={`/formation/${idCustomer}`}
                            >
                            {customer}
                            </a>
                        </p>
                        )}
                </div>
                <div className="flex items-center mb-2">
                    <StarRating rating={average} />
                    <span className="ml-1 text-sm text-gray-600">
                    {average} ({totalEmployees})
                    </span>
                </div>
                <p className="mb-4 text-gray-600 line-clamp-2">{description}</p>
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" aria-hidden="true" />
                        <span>{dateDebut}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" aria-hidden="true" />
                        <span>{ville}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" aria-hidden="true" />
                        <span>{available_place} places restantes</span>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                    <span className="font-medium text-gray-600">MGA {Number(price).toLocaleString('fr-FR', { maximumFractionDigits: 0 })}</span>
                    <Link className="flex items-center gap-2 px-4 py-1 text-white transition-colors bg-purple-600 rounded-md hover:bg-purple-700"
                        to={`/evenement/detail/${idProjet}`}>Détails
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default EventCard;