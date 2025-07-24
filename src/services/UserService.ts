import User from "../models/entities/User";
import UserRole from "../models/entities/UserRole";
import ApiService from "./ApiService";

class UserService {
  private readonly apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  public async GetUsersOfZoo(session: string, zooId: string): Promise<User[]> {
    try {
      if (!session) {
        throw new Error("NO_SESSION");
      }

      if (!zooId) {
        throw new Error("NO_ZOO_ID");
      }

      const response = await fetch(`${this.apiService.getBaseUrl()}/user?zoo_id=${zooId}`, {
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

      const users: User[] = await response.json();
      return users;
    }
    catch (error) {
      throw error;
    }
  }

  public async addAdmin(session: string, adminData: {
    zoo: string;
    lastName: string;
    firstName: string;
    login: string;
    password: string;
    email: string;
  }): Promise<User> {
    try {
      if (!session) {
        throw new Error("NO_SESSION");
      }

      const response = await fetch(`${this.apiService.getBaseUrl()}/user/admin`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(adminData)
      });

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error("INVALID_DATA");
          case 401:
            throw new Error("INVALID_SESSION");
          case 409:
            throw new Error("ADMIN_ALREADY_EXISTS");
          case 500:
            throw new Error("ERROR_SERVOR");
        }
      }

      const user: User = await response.json();
      return user;
    }
    catch (error) {
      throw error;
    }
  }
}

export default UserService;
