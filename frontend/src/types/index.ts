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
