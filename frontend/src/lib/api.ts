const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lumos-faoy.onrender.com';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://lumos-faoy.onrender.com/ws';

export interface ExecRequest {
  language: string;
  code_snippet: string;
  user_id?: string;
}

export interface ExecResponse {
  success: boolean;
  data?: {
    stdout?: string;
    stderr?: string;
    output?: string;
    exit_code?: number;
    result?: string;
    compiled?: string;
  };
  error?: string;
  message?: string;
}

export interface LumosRequest {
  code: string;
  action: string;
  target?: string;
}

export interface NetworkRequest {
  tool: string;
  target?: string;
  options?: string[];
}

export interface DataProcessRequest {
  data: any[];
  operation: string;
}

export interface SystemStatus {
  os: string;
  version: string;
  languages_loaded: string[];
  database: string;
  uptime: string;
  hostname: string;
  network_tools_available: string[];
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    session_id: string;
    username: string;
  };
  error?: string;
}

class LumOSAPI {
  private baseURL: string;
  private wsURL: string;
  private sessionId: string | null = null;

  constructor(baseURL: string = API_URL, wsURL: string = WS_URL) {
    this.baseURL = baseURL;
    this.wsURL = wsURL;
    
    if (typeof window !== 'undefined') {
      this.sessionId = localStorage.getItem('lumos_session_id');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.sessionId) {
      headers['X-Session-ID'] = this.sessionId;
    } else {
      headers['Authorization'] = 'Basic ' + btoa('admin:admin123');
    }

    return headers;
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.data?.session_id) {
        this.sessionId = data.data.session_id;
        if (typeof window !== 'undefined') {
          localStorage.setItem('lumos_session_id', data.data.session_id);
        }
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  async logout(): Promise<ExecResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      const data: ExecResponse = await response.json();

      if (data.success) {
        this.sessionId = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('lumos_session_id');
        }
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      };
    }
  }

  async getStatus(): Promise<SystemStatus | null> {
    try {
      const response = await fetch(`${this.baseURL}/status`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch status');
      }

      return await response.json();
    } catch (error) {
      console.error('Status fetch error:', error);
      return null;
    }
  }

  async getHealth(): Promise<{ status: string; timestamp: string } | null> {
    try {
      const response = await fetch(`${this.baseURL}/health`);

      if (!response.ok) {
        throw new Error('Failed to fetch health');
      }

      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      return null;
    }
  }

  async executeCode(request: ExecRequest): Promise<ExecResponse> {
    try {
      const response = await fetch(`${this.baseURL}/execute`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Code execution failed',
      };
    }
  }

  async executeCommand(command: string, osType?: string): Promise<ExecResponse> {
    try {
      const response = await fetch(`${this.baseURL}/command`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ command, os_type: osType }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Command execution failed',
      };
    }
  }

  async executeLumos(code: string): Promise<ExecResponse> {
    try {
      const response = await fetch(`${this.baseURL}/lumos/execute`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ code, action: 'execute' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lumos execution failed',
      };
    }
  }

  async compileLumos(code: string, target: string = 'python'): Promise<ExecResponse> {
    try {
      const response = await fetch(`${this.baseURL}/lumos/compile`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ code, action: 'compile', target }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Lumos compilation failed',
      };
    }
  }

  async executeNetworkTool(request: NetworkRequest): Promise<ExecResponse> {
    try {
      const response = await fetch(`${this.baseURL}/network/tool`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network tool execution failed',
      };
    }
  }

  async processData(request: DataProcessRequest): Promise<ExecResponse> {
    try {
      const response = await fetch(`${this.baseURL}/data/process`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Data processing failed',
      };
    }
  }

  createWebSocket(): WebSocket | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const ws = new WebSocket(this.wsURL);

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };

      return ws;
    } catch (error) {
      console.error('WebSocket creation failed:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.sessionId !== null;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }
}

export const api = new LumOSAPI();

export default LumOSAPI;
