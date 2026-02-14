export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  content: React.ReactNode;
  zIndex: number;
  width?: number;
  height?: number;
  position: { x: number; y: number };
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

export interface ExecutionLog {
  id: string;
  user_id: string | null;
  language: string;
  code_snippet: string;
  output: string | null;
  status: string;
  execution_time_ms: number | null;
  created_at: string;
}

export interface VirtualFile {
  id: string;
  owner_id: string;
  name: string;
  content: string;
  path: string;
  is_directory: boolean;
  size_bytes: number;
  mime_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface NetworkInfo {
  host: string;
  ip?: string;
  latency?: number;
  status: 'online' | 'offline' | 'unknown';
}

export interface DataAnalysis {
  operation: string;
  input: any[];
  output: any;
  timestamp: string;
}

export interface CompilationTarget {
  language: string;
  version?: string;
  supported: boolean;
}

export type TerminalCommand = {
  command: string;
  output: string;
  timestamp: Date;
  success: boolean;
};

export type AppTheme = 'dark' | 'light' | 'auto';

export type FileSystemEntry = VirtualFile & {
  children?: FileSystemEntry[];
};

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface SessionData {
  user_id: string;
  session_id: string;
  connected_at: string;
  last_activity: string;
}

export interface APIError {
  message: string;
  code?: string;
  details?: any;
}

export interface WebSocketMessage {
  type: 'command' | 'response' | 'notification' | 'status';
  payload: any;
  timestamp: string;
}

export interface CodeExecution {
  language: string;
  code: string;
  output?: string;
  error?: string;
  exitCode?: number;
  executionTime?: number;
}

export interface NetworkOperation {
  tool: string;
  target: string;
  output?: string;
  error?: string;
  timestamp: string;
}

export interface FileOperation {
  type: 'create' | 'read' | 'update' | 'delete';
  path: string;
  success: boolean;
  error?: string;
  timestamp: string;
}

export interface LumosCompilation {
  sourceCode: string;
  targetLanguage: string;
  compiledCode?: string;
  error?: string;
  timestamp: string;
}

export interface DatabaseQuery {
  query: string;
  params?: any[];
  result?: any;
  error?: string;
  executionTime?: number;
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: 'running' | 'stopped' | 'sleeping';
}

export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
  };
  network: {
    sent: number;
    received: number;
  };
}

export interface DesktopIcon {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  position: { x: number; y: number };
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  disabled?: boolean;
  submenu?: MenuItem[];
}

export interface ContextMenu {
  items: MenuItem[];
  position: { x: number; y: number };
  visible: boolean;
}

export interface TaskbarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  minimized: boolean;
  notifications?: number;
}

export interface ApplicationConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ComponentType;
  defaultWidth?: number;
  defaultHeight?: number;
  resizable?: boolean;
  maximizable?: boolean;
  minimizable?: boolean;
}
