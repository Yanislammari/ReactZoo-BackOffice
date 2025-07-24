import User from "../models/entities/User";
import ApiService from "./ApiService";

class AuthService {
  private readonly apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  public async login(username: string, password: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiService.getBaseUrl()}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          login: username, 
          password: password
        })
      });

      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new Error("LOGIN_FAILED");
          case 500:
            throw new Error("ERROR_SERVOR");
        }
      }

      const data = await response.json();
      return data.session;
    }
    catch (error) {
      throw error;
    }
  }

  public async getMe(session: string): Promise<User> {
    try {
      if (!session) {
        throw new Error("NO_SESSION");
      }

      const response = await fetch(`${this.apiService.getBaseUrl()}/auth/me`, {
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

      const user: User = await response.json();
      return user;
    }
    catch (error) {
      throw error;
    }
  }
}

export default AuthService;
