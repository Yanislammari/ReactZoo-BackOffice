import React, { useState } from "react";
import "./CreateZooForm.css";
import ZooService from "../../services/ZooService";
import { toast }  from "sonner";

interface CreateZooFormProps {
  onClose: () => void;
  onZooCreated: () => Promise<void>;
}

const CreateZooForm: React.FC<CreateZooFormProps> = ({ onClose, onZooCreated }) => {
  const [zooName, setZooName] = useState<string>("");
  const zooService = new ZooService();

  const AddZoo = async (name: string) => {
    try {
      const session = localStorage.getItem("Session");
      await zooService.createZoo(session!, { name: name});
      toast.success("Zoo créé avec succès !");
      onZooCreated();
    }
    catch (error) {
      toast.error("Erreur lors de la création du zoo. Veuillez réessayer.");
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    AddZoo(zooName);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="CreateZooForm">
          <h2>Créer un nouveau zoo</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="zooName">Nom du zoo</label>
              <input
                type="text"
                id="zooName"
                value={zooName}
                onChange={(e) => setZooName(e.target.value)}
                placeholder="Entrez le nom du zoo"
                required
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Annuler
              </button>
              <button type="submit" className="btn-submit">
                Créer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateZooForm;
