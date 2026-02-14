const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lumos-faoy.onrender.com';

export interface ExecResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class LumOSAPI {
  private baseURL: string;

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('admin:admin123'),
    };
  }

  async getStatus() {
    const response = await fetch(`${this.baseURL}/status`, {
      headers: this.getHeaders(),
    });
    return await response.json();
  }

  async executeCode(language: string, code_snippet: string): Promise<ExecResponse> {
    const response = await fetch(`${this.baseURL}/execute`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ language, code_snippet }),
    });
    return await response.json();
  }

  async executeLumos(code: string): Promise<ExecResponse> {
    const response = await fetch(`${this.baseURL}/lumos/execute`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ code, action: 'execute' }),
    });
    return await response.json();
  }

  async compileLumos(code: string, target: string): Promise<ExecResponse> {
    const response = await fetch(`${this.baseURL}/lumos/compile`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ code, action: 'compile', target }),
    });
    return await response.json();
  }
}

export const api = new LumOSAPI();
