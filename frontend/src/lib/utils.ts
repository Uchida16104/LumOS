import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

export function getLanguageFromExtension(ext: string): string {
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'rb': 'ruby',
    'php': 'php',
    'rs': 'rust',
    'go': 'go',
    'c': 'c',
    'cpp': 'cpp',
    'java': 'java',
    'cs': 'csharp',
    'sh': 'bash',
    'lumos': 'lumos',
  };

  return languageMap[ext.toLowerCase()] || 'plaintext';
}

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator === 'undefined') {
    return Promise.reject(new Error('Navigator not available'));
  }

  return navigator.clipboard.writeText(text);
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseCommandOutput(output: string): { success: boolean; message: string } {
  if (output.includes('Error:') || output.includes('error')) {
    return { success: false, message: output };
  }
  return { success: true, message: output };
}

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const LANGUAGE_EXTENSIONS: Record<string, string[]> = {
  'python': ['.py', '.pyw'],
  'javascript': ['.js', '.mjs', '.cjs'],
  'typescript': ['.ts', '.tsx'],
  'rust': ['.rs'],
  'go': ['.go'],
  'c': ['.c', '.h'],
  'cpp': ['.cpp', '.cc', '.cxx', '.hpp', '.hxx'],
  'java': ['.java'],
  'csharp': ['.cs'],
  'php': ['.php'],
  'ruby': ['.rb'],
  'lumos': ['.lumos', '.lm'],
};

export const COMPILE_TARGETS = [
  'python',
  'javascript',
  'typescript',
  'rust',
  'go',
  'c',
  'cpp',
  'java',
  'csharp',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'scala',
  'haskell',
  'elixir',
  'erlang',
  'clojure',
  'lisp',
  'lua',
  'perl',
  'r',
  'julia',
  'dart',
  'fortran',
  'cobol',
  'assembly',
  'sql',
  'html',
  'css',
];
