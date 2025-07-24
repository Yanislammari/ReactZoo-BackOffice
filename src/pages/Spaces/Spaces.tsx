import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SpaceCard from "../../components/SpaceCard/SpaceCard";
import CreateSpaceForm from "../../components/CreateSpaceForm/CreateSpaceForm";
import "./Space.css";
import SpaceService from "../../services/SpaceService";
import Space from "../../models/entities/Space";
import User from "../../models/entities/User";
import { toast } from "sonner";

const Spaces: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [zooId, setZooId] = useState<string>("");

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const userString = localStorage.getItem("User");
        if (!userString) {
          toast.error("Utilisateur non trouvé. Veuillez vous reconnecter.");
          setLoading(false);
          return;
        }

        const userData: User = JSON.parse(userString);
        setUser(userData);

        let currentZooId: string;
        if (typeof userData.zoo === 'string') {
          currentZooId = userData.zoo;
        } else if (userData.zoo && typeof userData.zoo === 'object' && userData.zoo._id) {
          currentZooId = userData.zoo._id;
        } else {
          toast.error("Aucun zoo assigné à votre compte.");
          setLoading(false);
          return;
        }
        
        setZooId(currentZooId);

        // Récupérer la session
        const session = localStorage.getItem("Session");
        if (!session) {
          toast.error("Aucune session trouvée. Veuillez vous reconnecter.");
          setLoading(false);
          return;
        }

        const spaceService = new SpaceService();
        console.log("Récupération des espaces du zoo:", currentZooId);
        
        const spacesList = await spaceService.GetAllSpacesOfZoo(session, currentZooId);
        console.log("Espaces récupérés:", spacesList);
        
        setSpaces(spacesList);
      } catch (error) {
        console.error("Erreur lors de la récupération des espaces:", error);
        toast.error("Erreur lors du chargement des espaces.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  const handleCreateSpace = () => {
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
  };

  const handleSpaceCreated = async () => {
    // Refetch les espaces après création
    try {
      const session = localStorage.getItem("Session");
      if (session && zooId) {
        const spaceService = new SpaceService();
        const spacesList = await spaceService.GetAllSpacesOfZoo(session, zooId);
        setSpaces(spacesList);
        setShowCreateForm(false);
      }
    } catch (error) {
      toast.error("Erreur lors du rafraîchissement de la liste.");
    }
  };

  if (loading) {
    return (
      <div className="Spaces">
        <Navbar />
        <div className="SpacesPage">
          <div className="loading">Chargement des espaces...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="Spaces">
      <Navbar />
      <div className="SpacesPage">
        <div className="spaces-header">
          <h1>Espaces - {typeof user?.zoo === 'object' && user?.zoo?.name ? user.zoo.name : "Zoo"}</h1>
          <p>Gestion des espaces de votre zoo</p>
        </div>
        
        <div className="spaces-grid">
          {spaces.length === 0 ? (
            <div className="no-spaces">
              <p>Aucun espace trouvé pour ce zoo.</p>
            </div>
          ) : (
            spaces.map((space) => (
              <SpaceCard key={space._id} space={space} />
            ))
          )}
        </div>
        
        <button className="floating-add-btn" onClick={handleCreateSpace}>
          +
        </button>
        
        {showCreateForm && zooId && (
          <CreateSpaceForm 
            onClose={handleCloseForm} 
            onSpaceCreated={handleSpaceCreated}
            zooId={zooId}
          />
        )}
      </div>
    </div>
  );
}

export default Spaces;
