import React, { useState } from "react";
import SpaceService from "../../services/SpaceService";
import AssetService from "../../services/AssetService";
import SpaceType from "../../models/entities/SpaceType";
import { toast } from "sonner";
import "./CreateSpaceForm.css";

interface CreateSpaceFormProps {
  onClose: () => void;
  onSpaceCreated: () => Promise<void>;
  zooId: string;
}

interface SpaceFormData {
  name: string;
  description: string;
  types: SpaceType[];
  capacity: number;
  visitorDuration: number;
  openingHours: number;
  closingHours: number;
}

const CreateSpaceForm: React.FC<CreateSpaceFormProps> = ({ onClose, onSpaceCreated, zooId }) => {
  const [formData, setFormData] = useState<SpaceFormData>({
    name: "",
    description: "",
    types: [],
    capacity: 10,
    visitorDuration: 60,
    openingHours: 600, // 10h00
    closingHours: 1080 // 18h00
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'visitorDuration' || name === 'openingHours' || name === 'closingHours' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleTypeChange = (type: SpaceType) => {
    setFormData(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || formData.types.length === 0) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (formData.openingHours >= formData.closingHours) {
      toast.error("L'heure de fermeture doit être après l'heure d'ouverture.");
      return;
    }

    setSubmitting(true);
    setUploadProgress("");

    try {
      const session = localStorage.getItem("Session");
      if (!session) {
        toast.error("Aucune session trouvée. Veuillez vous reconnecter.");
        return;
      }

      const assetService = new AssetService();
      const spaceService = new SpaceService();
      
      const imageIds: string[] = [];
      if (selectedFiles.length > 0) {
        setUploadProgress("Upload des images...");
        
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          setUploadProgress(`Upload image ${i + 1}/${selectedFiles.length}...`);
          
          try {
            const result = await assetService.addAsset(session, file);
            if (result && result._id) {
              imageIds.push(result._id);
            }
          } catch (error) {
            console.error(`Erreur upload image ${file.name}:`, error);
            toast.error(`Erreur lors de l'upload de ${file.name}`);
          }
        }
      }

      setUploadProgress("Création de l'espace...");
      
      const spaceData = {
        name: formData.name,
        description: formData.description,
        types: formData.types,
        images: imageIds,
        capacity: formData.capacity,
        visitorDuration: formData.visitorDuration,
        openingHours: formData.openingHours,
        closingHours: formData.closingHours
      };

      const newSpace = await spaceService.CreateSpace(session, zooId, spaceData);
      console.log("Espace créé:", newSpace);
      
      toast.success("Espace créé avec succès !");
      await onSpaceCreated();
      
    } catch (error: any) {
      console.error("Erreur lors de la création de l'espace:", error);
      
      switch (error.message) {
        case "INVALID_DATA":
          toast.error("Données invalides. Vérifiez vos informations.");
          break;
        case "SPACE_ALREADY_EXISTS":
          toast.error("Un espace avec ce nom existe déjà.");
          break;
        case "ZOO_NOT_FOUND":
          toast.error("Zoo non trouvé.");
          break;
        default:
          toast.error("Erreur lors de la création de l'espace.");
          break;
      }
    } finally {
      setSubmitting(false);
      setUploadProgress("");
    }
  };

  return (
    <div className="create-space-modal-overlay" onClick={onClose}>
      <div className="create-space-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="create-space-form">
          <div className="create-space-form-header">
            <h2>Créer un nouvel espace</h2>
            <button className="create-space-close-btn" onClick={onClose}>×</button>
          </div>

          <form onSubmit={handleSubmit} className="create-space-form-body">
            <div className="create-space-form-row">
              <div className="create-space-form-group">
                <label htmlFor="name">Nom de l'espace *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nom de l'espace"
                  required
                  className="create-space-form-input"
                />
              </div>
            </div>

            <div className="create-space-form-row">
              <div className="create-space-form-group full-width">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description de l'espace"
                  rows={4}
                  required
                  className="create-space-form-textarea"
                />
              </div>
            </div>

            <div className="create-space-form-row">
              <div className="create-space-form-group">
                <label>Types d'espace *</label>
                <div className="create-space-types">
                  {Object.values(SpaceType).map((type) => (
                    <label key={type} className="create-space-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.types.includes(type)}
                        onChange={() => handleTypeChange(type)}
                        className="create-space-checkbox"
                      />
                      <span className="create-space-checkbox-text">
                        {type === SpaceType.indoor ? "🏢 Intérieur" : "🌳 Extérieur"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="create-space-form-row">
              <div className="create-space-form-group">
                <label htmlFor="capacity">Capacité (personnes) *</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="create-space-form-input"
                />
              </div>
              
              <div className="create-space-form-group">
                <label htmlFor="visitorDuration">Durée de visite (minutes) *</label>
                <input
                  type="number"
                  id="visitorDuration"
                  name="visitorDuration"
                  value={formData.visitorDuration}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="create-space-form-input"
                />
              </div>
            </div>

            <div className="create-space-form-row">
              <div className="create-space-form-group">
                <label htmlFor="openingTime">Heure d'ouverture *</label>
                <input
                  type="time"
                  id="openingTime"
                  value={formatTime(formData.openingHours)}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    openingHours: parseTime(e.target.value)
                  }))}
                  required
                  className="create-space-form-input"
                />
              </div>
              
              <div className="create-space-form-group">
                <label htmlFor="closingTime">Heure de fermeture *</label>
                <input
                  type="time"
                  id="closingTime"
                  value={formatTime(formData.closingHours)}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    closingHours: parseTime(e.target.value)
                  }))}
                  required
                  className="create-space-form-input"
                />
              </div>
            </div>

            <div className="create-space-form-row">
              <div className="create-space-form-group full-width">
                <label htmlFor="images">Images</label>
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="create-space-form-file"
                />
                
                {selectedFiles.length > 0 && (
                  <div className="create-space-selected-files">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="create-space-file-item">
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="create-space-remove-file"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {uploadProgress && (
              <div className="create-space-progress">
                <p>{uploadProgress}</p>
              </div>
            )}

            <div className="create-space-form-actions">
              <button type="button" onClick={onClose} className="create-space-btn-cancel">
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={submitting || formData.types.length === 0}
                className="create-space-btn-submit"
              >
                {submitting ? "Création en cours..." : "Créer l'espace"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSpaceForm;
