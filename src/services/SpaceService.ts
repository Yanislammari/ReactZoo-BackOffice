import Space from "../models/entities/Space";
import SpaceType from "../models/entities/SpaceType";
import ApiService from "./ApiService";

interface CreateSpaceData {
  name: string;
  description: string;
  types: SpaceType[];
  images: string[];
  capacity: number;
  visitorDuration: number;
  openingHours: number;
  closingHours: number;
}

class SpaceService {
  private readonly apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  public async GetAllSpacesOfZoo(session: string, zooId: string): Promise<Space[]> {
    try {
      if (!session) {
        throw new Error("NO_SESSION");
      }

      if (!zooId) {
        throw new Error("NO_ZOO_ID");
      }

      const response = await fetch(`${this.apiService.getBaseUrl()}/zoo/${zooId}/space`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session}`,
          "Content-Type": "application/json"
        },
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

      const spaces: Space[] = await response.json();
      return spaces;
    }
    catch (error) {
      throw error;
    }
  }

  public async CreateSpace(session: string, zooId: string, spaceData: CreateSpaceData): Promise<Space> {
    try {
      if (!session) {
        throw new Error("NO_SESSION");
      }

      if (!zooId) {
        throw new Error("NO_ZOO_ID");
      }

      const response = await fetch(`${this.apiService.getBaseUrl()}/zoo/${zooId}/space`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(spaceData)
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
            throw new Error("SPACE_ALREADY_EXISTS");
          case 500:
            throw new Error("ERROR_SERVOR");
        }
      }

      const space: Space = await response.json();
      return space;
    }
    catch (error) {
      throw error;
    }
  }
}

export default SpaceService;
