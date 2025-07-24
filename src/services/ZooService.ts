import Zoo from "../models/entities/Zoo";
import ApiService from "./ApiService";

class ZooService {
  private readonly apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  public async getZoos(session: string): Promise<Zoo[]> {
    try {
      if (!session) {
        throw new Error("NO_SESSION");
      }

      const response = await fetch(`${this.apiService.getBaseUrl()}/zoo`, {
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
          case 500:
            throw new Error("ERROR_SERVOR");
        }
      }

      const zoos: Zoo[] = await response.json();
      return zoos;
    }
    catch (error) {
      throw error;
    }
  }

  public async createZoo(session: string, zooData: Partial<Zoo>): Promise<Zoo> {
    try {
      if (!session) {
        throw new Error("NO_SESSION");
      }

      const response = await fetch(`${this.apiService.getBaseUrl()}/zoo`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(zooData)
      });

      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new Error("INVALID_SESSION");
          case 500:
            throw new Error("ERROR_SERVOR");
        }
      }

      const zoo: Zoo = await response.json();
      return zoo;
    }
    catch (error) {
      throw error;
    }
  }

  public async getZooById(session: string, zooId: string): Promise<Zoo> {
    try {
      if (!session) {
        throw new Error("NO_SESSION");
      }

      if (!zooId) {
        throw new Error("NO_ZOO_ID");
      }

      const response = await fetch(`${this.apiService.getBaseUrl()}/zoo/${zooId}`, {
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

      const zoo: Zoo = await response.json();
      return zoo;
    }
    catch (error) {
      throw error;
    }
  }
}

export default ZooService;
