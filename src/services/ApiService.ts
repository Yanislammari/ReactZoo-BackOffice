class ApiService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_BASE_URL!;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }
}

export default ApiService;
