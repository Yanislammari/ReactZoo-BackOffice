import ApiService from "./ApiService";
import Animal from "../models/entities/Animal";

interface CreateAnimalData {
  name: string;
  description: string;
  images: string[];
  species: string;
  space: string;
  bornOn: string;
}

class AnimalsService {
  private readonly apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  public async createAnimal(session: string, zooId: string, animalData: CreateAnimalData): Promise<Animal> {
    try {
      if (!session) {
        throw new Error("NO_SESSION");
      }

      if (!zooId) {
        throw new Error("NO_ZOO_ID");
      }

      const response = await fetch(`${this.apiService.getBaseUrl()}/zoo/${zooId}/animal`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(animalData)
      });

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error("INVALID_DATA");
          case 401:
            throw new Error("INVALID_SESSION");
          case 404:
            throw new Error("ZOO_NOT_FOUND");
          case 409:
            throw new Error("ANIMAL_ALREADY_EXISTS");
          case 500:
            throw new Error("ERROR_SERVOR");
        }
      }

      const animal: Animal = await response.json();
      return animal;
    }
    catch (error) {
      throw error;
    }
  }

  public async getAllAnimals(session: string, zooId: string, spaceId?: string): Promise<Animal[]> {
    try {
      if (!session) {
        throw new Error("NO_SESSION");
      }

      if (!zooId) {
        throw new Error("NO_ZOO_ID");
      }

      // Construire l'URL avec ou sans le paramètre space_id
      let url = `${this.apiService.getBaseUrl()}/zoo/${zooId}/animal`;
      if (spaceId) {
        url += `?space_id=${spaceId}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new Error("INVALID_SESSION");
          case 404:
            throw new Error("ZOO_NOT_FOUND");
          case 500:
            throw new Error("ERROR_SERVOR");
        }
      }

      const animals: Animal[] = await response.json();
      return animals;
    }
    catch (error) {
      throw error;
    }
  }

  public async getAnimalsBySpace(session: string, zooId: string, spaceId: string): Promise<Animal[]> {
    // Méthode helper pour récupérer les animaux d'un espace spécifique
    return this.getAllAnimals(session, zooId, spaceId);
  }
}

export default AnimalsService;
