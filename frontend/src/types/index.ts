export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  content: React.ReactNode;
  zIndex: number;
  width?: number;
  height?: number;
  position?: { x: number; y: number };
}

export interface SystemStatus {
  os: string;
  version: string;
  languages_loaded: string[];
  database: string;
  uptime: string;
}

export interface ExecutionLog {
  id: string;
  user_id: string;
  language: string;
  code_snippet: string;
  output: string;
  status: string;
  created_at: string;
}

export interface VirtualFile {
  id: string;
  owner_id: string;
  name: string;
  content: string;
  path: string;
  is_directory: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
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
