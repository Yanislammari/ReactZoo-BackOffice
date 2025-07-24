import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import AnimalCard from "../../components/AnimalCard/AnimalCard";
import "./Animals.css";
import AnimalsService from "../../services/AnimalsService";
import SpaceService from "../../services/SpaceService";
import Animal from "../../models/entities/Animal";
import Space from "../../models/entities/Space";
import User from "../../models/entities/User";
import { toast } from "sonner";

const Animals: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimalsAndSpace = async () => {
      if (!spaceId) {
        toast.error("ID de l'espace manquant dans l'URL.");
        setLoading(false);
        return;
      }

      try {
        const userString = localStorage.getItem("User");
        if (!userString) {
          toast.error("Utilisateur non trouvé. Veuillez vous reconnecter.");
          setLoading(false);
          return;
        }

        const userData: User = JSON.parse(userString);
        let zooId: string;
        
        if (typeof userData.zoo === 'string') {
          zooId = userData.zoo;
        } else if (userData.zoo && typeof userData.zoo === 'object' && userData.zoo._id) {
          zooId = userData.zoo._id;
        } else {
          toast.error("Aucun zoo assigné à votre compte.");
          setLoading(false);
          return;
        }

        // Récupérer la session
        const session = localStorage.getItem("Session");
        if (!session) {
          toast.error("Aucune session trouvée. Veuillez vous reconnecter.");
          setLoading(false);
          return;
        }

        const animalsService = new AnimalsService();
        const spaceService = new SpaceService();

        console.log("Récupération des animaux de l'espace:", spaceId);
        
        const [animalsList, allSpaces] = await Promise.all([
          animalsService.getAnimalsBySpace(session, zooId, spaceId),
          spaceService.GetAllSpacesOfZoo(session, zooId)
        ]);

        // Trouver l'espace correspondant
        const currentSpace = allSpaces.find(s => s._id === spaceId);
        
        if (!currentSpace) {
          toast.error("Espace non trouvé.");
          return;
        }

        console.log("Animaux récupérés:", animalsList);
        console.log("Espace récupéré:", currentSpace);
        
        setAnimals(animalsList);
        setSpace(currentSpace);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast.error("Erreur lors du chargement des animaux.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimalsAndSpace();
  }, [spaceId]);

  if (loading) {
    return (
      <div className="Animals">
        <Navbar />
        <div className="AnimalsPage">
          <div className="loading">Chargement des animaux...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="Animals">
      <Navbar />
      <div className="AnimalsPage">
        <div className="animals-header">
          <h1>Animaux - {space?.name || "Espace"}</h1>
          <p>Liste de tous les animaux de cet espace</p>
          {space?.description && (
            <div className="space-description">
              <p>{space.description}</p>
            </div>
          )}
        </div>
        
        <div className="animals-grid">
          {animals.length === 0 ? (
            <div className="no-animals">
              <p>Aucun animal trouvé dans cet espace.</p>
            </div>
          ) : (
            animals.map((animal) => (
              <AnimalCard key={animal._id} animal={animal} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Animals;
