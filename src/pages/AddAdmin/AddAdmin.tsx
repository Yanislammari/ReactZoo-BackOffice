import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import UserService from "../../services/UserService";
import ZooService from "../../services/ZooService";
import Zoo from "../../models/entities/Zoo";
import { toast } from "sonner";
import "./AddAdmin.css";

interface AdminFormData {
  zoo: string;
  lastName: string;
  firstName: string;
  login: string;
  password: string;
  email: string;
}

const AddAdmin: React.FC = () => {
  const [zoos, setZoos] = useState<Zoo[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<AdminFormData>({
    zoo: "",
    lastName: "",
    firstName: "",
    login: "",
    password: "",
    email: ""
  });

  useEffect(() => {
    const fetchZoos = async () => {
      try {
        const session = localStorage.getItem("Session");
        if (!session) {
          toast.error("Aucune session trouvée. Veuillez vous reconnecter.");
          return;
        }

        const zooService = new ZooService();
        console.log("Récupération des zoos...");
        const zoosList = await zooService.getZoos(session);
        console.log("Zoos récupérés:", zoosList);
        setZoos(zoosList);
      } catch (error) {
        console.error("Erreur lors de la récupération des zoos:", error);
        toast.error("Erreur lors du chargement des zoos.");
      } finally {
        setLoading(false);
      }
    };

    fetchZoos();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.zoo || !formData.lastName || !formData.firstName || 
        !formData.login || !formData.password || !formData.email) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    setSubmitting(true);
    
    try {
      const session = localStorage.getItem("Session");
      if (!session) {
        toast.error("Aucune session trouvée. Veuillez vous reconnecter.");
        return;
      }

      const userService = new UserService();
      console.log("Création de l'admin:", formData);
      
      const newAdmin = await userService.addAdmin(session, formData);
      console.log("Admin créé:", newAdmin);
      
      toast.success("Administrateur créé avec succès !");
      
      setFormData({
        zoo: "",
        lastName: "",
        firstName: "",
        login: "",
        password: "",
        email: ""
      });
      
    } catch (error: any) {
      console.error("Erreur lors de la création de l'admin:", error);
      
      switch (error.message) {
        case "INVALID_DATA":
          toast.error("Données invalides. Vérifiez vos informations.");
          break;
        case "ADMIN_ALREADY_EXISTS":
          toast.error("Un admin avec ce login ou email existe déjà.");
          break;
        case "INVALID_SESSION":
          toast.error("Session invalide. Veuillez vous reconnecter.");
          break;
        default:
          toast.error("Erreur lors de la création de l'administrateur.");
          break;
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="AddAdmin">
        <Navbar />
        <div className="AddAdminPage">
          <div className="loading">Chargement des zoos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="AddAdmin">
      <Navbar />
      <div className="AddAdminPage">
        <div className="add-admin-form-container">
          <div className="add-admin-form-header">
            <h1>Ajouter un Administrateur</h1>
            <p>Créer un nouveau compte administrateur pour un zoo</p>
          </div>
          
          <form onSubmit={handleSubmit} className="add-admin-form">
            <div className="add-admin-form-row">
              <div className="add-admin-form-group">
                <label htmlFor="zoo">Zoo *</label>
                <select
                  id="zoo"
                  name="zoo"
                  value={formData.zoo}
                  onChange={handleInputChange}
                  required
                  className="add-admin-form-select"
                >
                  <option value="">Sélectionnez un zoo</option>
                  {zoos.map((zoo) => (
                    <option key={zoo._id} value={zoo._id}>
                      {zoo.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="add-admin-form-row">
              <div className="add-admin-form-group">
                <label htmlFor="firstName">Prénom *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Entrez le prénom"
                  required
                  className="add-admin-form-input"
                />
              </div>
              
              <div className="add-admin-form-group">
                <label htmlFor="lastName">Nom *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Entrez le nom"
                  required
                  className="add-admin-form-input"
                />
              </div>
            </div>

            <div className="add-admin-form-row">
              <div className="add-admin-form-group">
                <label htmlFor="login">Login *</label>
                <input
                  type="text"
                  id="login"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  placeholder="Nom d'utilisateur"
                  required
                  className="add-admin-form-input"
                />
              </div>
              
              <div className="add-admin-form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@zoo.com"
                  required
                  className="add-admin-form-input"
                />
              </div>
            </div>

            <div className="add-admin-form-row">
              <div className="add-admin-form-group">
                <label htmlFor="password">Mot de passe *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mot de passe"
                  required
                  className="add-admin-form-input"
                />
              </div>
            </div>

            <div className="add-admin-form-actions">
              <button 
                type="submit" 
                disabled={submitting}
                className="add-admin-submit-btn"
              >
                {submitting ? "Création en cours..." : "Créer l'administrateur"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
