const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lumos-faoy.onrender.com';

export interface ExecRequest {
  language: string;
  code_snippet: string;
  user_id?: string;
}

export interface ExecResponse {
  success: boolean;
  output: string;
  error?: string;
}

export interface LumosRequest {
  code: string;
  action: string;
  target?: string;
}

export interface LumosResponse {
  success: boolean;
  result?: string;
  output?: string;
  compiled?: string;
  error?: string;
}

export interface NetworkPingRequest {
  host: string;
}

export interface DataProcessRequest {
  data: any[];
  operation: string;
}

export class LumOSAPI {
  private baseURL: string;

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL;
  }

  async getStatus(): Promise<any> {
    const response = await fetch(`${this.baseURL}/status`);
    if (!response.ok) throw new Error('Failed to fetch status');
    return response.json();
  }

  async getHealth(): Promise<any> {
    const response = await fetch(`${this.baseURL}/health`);
    if (!response.ok) throw new Error('Failed to fetch health');
    return response.json();
  }

  async executeCode(request: ExecRequest): Promise<ExecResponse> {
    const response = await fetch(`${this.baseURL}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to execute code');
    return response.json();
  }

  async executeLumos(code: string): Promise<LumosResponse> {
    const response = await fetch(`${this.baseURL}/lumos/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, action: 'execute' }),
    });
    if (!response.ok) throw new Error('Failed to execute Lumos code');
    return response.json();
  }

  async compileLumos(code: string, target: string = 'python'): Promise<LumosResponse> {
    const response = await fetch(`${this.baseURL}/lumos/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, action: 'compile', target }),
    });
    if (!response.ok) throw new Error('Failed to compile Lumos code');
    return response.json();
  }

  async ping(host: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/network/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host }),
    });
    if (!response.ok) throw new Error('Failed to ping host');
    return response.json();
  }

  async processData(request: DataProcessRequest): Promise<any> {
    const response = await fetch(`${this.baseURL}/data/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to process data');
    return response.json();
  }

  createWebSocket(): WebSocket {
    const wsURL = process.env.NEXT_PUBLIC_WS_URL || 'wss://lumos-faoy.onrender.com/ws';
    return new WebSocket(wsURL);
  }
}

export const api = new LumOSAPI();
