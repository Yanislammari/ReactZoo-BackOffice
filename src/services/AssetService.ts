import ApiService from "./ApiService";

class AssetService {
  private readonly apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  public async getAsset(session: string, assetId: string): Promise<string> {
    try {
      if (!session) {
        throw new Error("NO_SESSION");
      }

      if (!assetId) {
        throw new Error("NO_ASSET_ID");
      }

      const response = await fetch(`${this.apiService.getBaseUrl()}/asset/${assetId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session}`,
        },
      });

      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new Error("INVALID_SESSION");
          case 404:
            throw new Error("ASSET_NOT_FOUND");
          case 500:
            throw new Error("ERROR_SERVOR");
        }
      }

      // Convertir la réponse en blob puis en URL
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
    }
    catch (error) {
      throw error;
    }
  }

  public getAssetUrl(session: string, assetId: string): string {
    // Méthode pour générer directement l'URL avec l'auth
    return `${this.apiService.getBaseUrl()}/asset/${assetId}?token=${session}`;
  }

  public async addAsset(session: string, file: File): Promise<any> {
    try {
      if (!session) {
        throw new Error("NO_SESSION");
      }

      if (!file) {
        throw new Error("NO_FILE");
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.apiService.getBaseUrl()}/asset`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session}`,
        },
        body: formData
      });

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error("INVALID_FILE");
          case 401:
            throw new Error("INVALID_SESSION");
          case 413:
            throw new Error("FILE_TOO_LARGE");
          case 415:
            throw new Error("UNSUPPORTED_FILE_TYPE");
          case 500:
            throw new Error("ERROR_SERVOR");
        }
      }

      const result = await response.json();
      return result;
    }
    catch (error) {
      throw error;
    }
  }
}

export default AssetService;