import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Space from '../../models/entities/Space';
import SpaceType from '../../models/entities/SpaceType';
import SpaceAccessibility from '../../models/entities/SpaceAccessibility';
import AssetService from '../../services/AssetService';
import './SpaceCard.css';

interface SpaceCardProps {
  space: Space;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === space.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? space.images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleSpaceClick = () => {
    navigate(`/space/${space._id}/animals`);
  };

  useEffect(() => {
    const loadImages = async () => {
      if (space.images.length === 0) {
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
        
        // Utiliser directement les URLs avec token pour éviter les appels multiples
        const urls = space.images.map(assetId => 
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
  }, [space.images]);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = (type: SpaceType): string => {
    switch (type) {
      case SpaceType.indoor:
        return '🏢';
      case SpaceType.outdoor:
        return '🌳';
      default:
        return '📍';
    }
  };

  const getAccessibilityIcon = (accessibility: SpaceAccessibility): string => {
    switch (accessibility) {
      case SpaceAccessibility.handicapped:
        return '♿';
      default:
        return '🚫';
    }
  };

  return (
    <div className={`space-card ${space.disabled ? 'space-card--disabled' : ''}`} onClick={handleSpaceClick}>
      {/* Carrousel d'images */}
      <div className="space-card__carousel">
        {loadingImages ? (
          <div className="space-card__loading-images">
            <span>🔄</span>
            <p>Chargement des images...</p>
          </div>
        ) : imageUrls.length > 0 ? (
          <>
            <div className="space-card__image-container">
              <img
                src={imageUrls[currentImageIndex]}
                alt={`${space.name} - Image ${currentImageIndex + 1}`}
                className="space-card__image"
                onError={(e) => {
                  console.error("Erreur de chargement de l'image:", imageUrls[currentImageIndex]);
                  e.currentTarget.style.display = 'none';
                }}
              />
              {space.disabled && (
                <div className="space-card__disabled-overlay">
                  <span>Espace fermé</span>
                </div>
              )}
            </div>
            
            {imageUrls.length > 1 && (
              <>
                <button
                  className="space-card__nav space-card__nav--prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Image précédente"
                >
                  &#8249;
                </button>
                <button
                  className="space-card__nav space-card__nav--next"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Image suivante"
                >
                  &#8250;
                </button>
                
                <div className="space-card__indicators">
                  {imageUrls.map((_, index) => (
                    <button
                      key={index}
                      className={`space-card__indicator ${
                        index === currentImageIndex ? 'space-card__indicator--active' : ''
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
          <div className="space-card__no-image">
            <span>📷</span>
            <p>Aucune image disponible</p>
          </div>
        )}
      </div>

      {/* Informations de l'espace */}
      <div className="space-card__content">
        <div className="space-card__header">
          <h3 className="space-card__name">{space.name}</h3>
          <div className="space-card__types">
            {space.types.map((type, index) => (
              <span key={index} className="space-card__type">
                {getTypeIcon(type)} {type}
              </span>
            ))}
          </div>
        </div>

        <p className="space-card__description">{space.description}</p>

        <div className="space-card__details">
          <div className="space-card__detail">
            <span className="space-card__detail-icon">👥</span>
            <span className="space-card__detail-text">Capacité: {space.capacity} personnes</span>
          </div>

          <div className="space-card__detail">
            <span className="space-card__detail-icon">⏱️</span>
            <span className="space-card__detail-text">Durée de visite: {space.visitorDuration} min</span>
          </div>

          <div className="space-card__detail">
            <span className="space-card__detail-icon">🕐</span>
            <span className="space-card__detail-text">
              Horaires: {formatTime(space.openingHours)} - {formatTime(space.closingHours)}
            </span>
          </div>

          {space.accessibility.length > 0 && (
            <div className="space-card__detail">
              <span className="space-card__detail-icon">♿</span>
              <span className="space-card__detail-text">
                Accessibilité: {space.accessibility.map(acc => getAccessibilityIcon(acc)).join(' ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaceCard;
