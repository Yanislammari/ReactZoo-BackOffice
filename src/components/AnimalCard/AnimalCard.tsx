import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Animal from '../../models/entities/Animal';
import AssetService from '../../services/AssetService';
import './AnimalCard.css';

interface AnimalCardProps {
  animal: Animal;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    const loadImages = async () => {
      if (animal.images.length === 0) {
        setLoadingImages(false);
        return;
      }

      try {
        const session = localStorage.getItem("Session");
        if (!session) {
          setLoadingImages(false);
          return;
        }

        const assetService = new AssetService();
        
        const urls = animal.images.map(assetId => 
          assetService.getAssetUrl(session, assetId)
        );
        
        setImageUrls(urls);
      } catch (error) {
        console.error("Erreur lors du chargement des images:", error);
      } finally {
        setLoadingImages(false);
      }
    };

    loadImages();
  }, [animal.images]);

  const handleClick = () => {
    // Récupérer l'ID de l'espace
    const spaceId = typeof animal.space === 'string' ? animal.space : animal.space._id;
    navigate(`/space/${spaceId}/animals`);
  };

  const calculateAge = (bornOn: string): string => {
    const birthDate = new Date(bornOn);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                        (today.getMonth() - birthDate.getMonth());
    
    if (ageInMonths < 12) {
      return `${ageInMonths} mois`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      return `${years} an${years > 1 ? 's' : ''}`;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="animal-card" onClick={handleClick}>
      {/* Carrousel d'images */}
      <div className="animal-card__carousel">
        {loadingImages ? (
          <div className="animal-card__loading-images">
            <span>🔄</span>
            <p>Chargement des images...</p>
          </div>
        ) : imageUrls.length > 0 ? (
          <>
            <div className="animal-card__image-container">
              <img
                src={imageUrls[currentImageIndex]}
                alt={`${animal.name} - Image ${currentImageIndex + 1}`}
                className="animal-card__image"
                onError={(e) => {
                  console.error("Erreur de chargement de l'image:", imageUrls[currentImageIndex]);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            
            {imageUrls.length > 1 && (
              <>
                <button
                  className="animal-card__nav animal-card__nav--prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Image précédente"
                >
                  &#8249;
                </button>
                <button
                  className="animal-card__nav animal-card__nav--next"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Image suivante"
                >
                  &#8250;
                </button>
                
                <div className="animal-card__indicators">
                  {imageUrls.map((_, index) => (
                    <button
                      key={index}
                      className={`animal-card__indicator ${
                        index === currentImageIndex ? 'animal-card__indicator--active' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToImage(index);
                      }}
                      aria-label={`Aller à l'image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="animal-card__no-image">
            <span>🐾</span>
            <p>Aucune image disponible</p>
          </div>
        )}
      </div>

      {/* Informations de l'animal */}
      <div className="animal-card__content">
        <div className="animal-card__header">
          <h3 className="animal-card__name">{animal.name}</h3>
          <div className="animal-card__age">{calculateAge(animal.bornOn)}</div>
        </div>

        <p className="animal-card__description">{animal.description}</p>

        <div className="animal-card__details">
          <div className="animal-card__detail">
            <span className="animal-card__detail-icon">🎂</span>
            <span className="animal-card__detail-text">Né le {formatDate(animal.bornOn)}</span>
          </div>

          <div className="animal-card__detail">
            <span className="animal-card__detail-icon">🧬</span>
            <span className="animal-card__detail-text">Espèce: {animal.species}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;
