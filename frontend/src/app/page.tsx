'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Folder, X, Minus, Square, Database, Code, 
  FileCode, Wifi, BarChart, Monitor, HardDrive, Cpu, Activity
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lumos-faoy.onrender.com';

type WindowState = {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  content: React.ReactNode;
  zIndex: number;
  width?: number;
  height?: number;
  position: { x: number; y: number };
};

interface ExecResponse {
  success: boolean;
  data?: {
    output?: string;
    stdout?: string;
    stderr?: string;
    result?: string;
    compiled?: string;
  };
  error?: string;
}

const WindowFrame = ({ 
  win, 
  onClose, 
  onMinimize, 
  onFocus 
}: { 
  win: WindowState; 
  onClose: () => void; 
  onMinimize: () => void; 
  onFocus: () => void;
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      drag
      dragMomentum={false}
      onPointerDown={onFocus}
      className="absolute bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl overflow-hidden flex flex-col"
      style={{ 
        zIndex: win.zIndex, 
        display: win.isMinimized ? 'none' : 'flex',
        width: win.width || 600,
        height: win.height || 400,
        left: win.position.x,
        top: win.position.y
      }}
    >
      <div className="h-8 bg-slate-800 flex items-center justify-between px-2 cursor-grab active:cursor-grabbing select-none">
        <span className="text-xs text-slate-300 font-mono flex items-center gap-2">
          <Database size={12} className="text-blue-400" />
          {win.title}
        </span>
        <div className="flex gap-2">
          <button onClick={onMinimize} className="hover:bg-slate-700 p-1 rounded transition">
            <Minus size={12} color="white" />
          </button>
          <button className="hover:bg-slate-700 p-1 rounded transition">
            <Square size={12} color="white" />
          </button>
          <button onClick={onClose} className="hover:bg-red-900 p-1 rounded transition">
            <X size={12} color="white" />
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-auto font-mono text-sm text-slate-200">
        {win.content}
      </div>
    </motion.div>
  );
};

const TerminalApp = () => {
  const [history, setHistory] = useState<string[]>([
    'Welcome to LumOS Kernel v2.1.0',
    'Connected to Render Backend (Rust Host)',
    'Database: Supabase PostgreSQL',
    'Lumos Language Engine: Active',
    'Type "help" for available commands'
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleCommand = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      const cmd = input.trim();
      if (!cmd) return;

      setHistory(prev => [...prev, `$ ${cmd}`]);
      setInput('');
      setLoading(true);

      try {
        if (cmd === 'help') {
          setHistory(prev => [...prev, `
Available Commands:
  help              - Show this help message
  status            - Show system status
  ls                - List files
  pwd               - Print working directory
  clear             - Clear terminal
  lumos [code]      - Execute Lumos Language code
  python [code]     - Execute Python code
  ruby [code]       - Execute Ruby code
  php [code]        - Execute PHP code
  rust [code]       - Execute Rust code
          `]);
        } else if (cmd === 'clear') {
          setHistory([]);
        } else if (cmd === 'status') {
          const response = await fetch(`${API_URL}/status`);
          const data = await response.json();
          setHistory(prev => [...prev, JSON.stringify(data, null, 2)]);
        } else if (cmd.startsWith('lumos ')) {
          const code = cmd.substring(6);
          const response = await fetch(`${API_URL}/lumos/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, action: 'execute' }),
          });
          const data: ExecResponse = await response.json();
          setHistory(prev => [...prev, data.success ? (data.data?.output || 'Success') : `Error: ${data.error}`]);
        } else if (cmd.startsWith('python ')) {
          const code = cmd.substring(7);
          const response = await fetch(`${API_URL}/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: 'python', code_snippet: code }),
          });
          const data: ExecResponse = await response.json();
          setHistory(prev => [...prev, data.success ? (data.data?.stdout || data.data?.output || 'Success') : `Error: ${data.error}`]);
        } else {
          setHistory(prev => [...prev, `lumos-shell: command not found: ${cmd}`]);
        }
      } catch (error) {
        setHistory(prev => [...prev, `Error: ${error}`]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="h-full flex flex-col bg-terminal-bg text-terminal-text">
      <div className="flex-1 space-y-1 overflow-auto p-2">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all text-green-400 font-mono text-sm">
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 p-2 border-t border-slate-700 bg-slate-800">
        <span className="text-blue-400">root@lumos:~#</span>
        <input 
          autoFocus
          disabled={loading}
          className="bg-transparent outline-none flex-1 text-slate-100 disabled:opacity-50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          placeholder={loading ? 'Executing...' : 'Type a command...'}
        />
      </div>
    </div>
  );
};

const LumosEditor = () => {
  const [code, setCode] = useState(`let message = "Hello, LumOS!"
print(message)

for i = 1 to 5 {
  print("Count: " + str(i))
}
`);
  const [output, setOutput] = useState('Lumos Language REPL v2.1.0\nReady to execute code...');
  const [compileTarget, setCompileTarget] = useState('python');
  const [loading, setLoading] = useState(false);

  const executeCode = async () => {
    setLoading(true);
    setOutput('Executing...');
    try {
      const response = await fetch(`${API_URL}/lumos/execute`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:admin123')
        },
        body: JSON.stringify({ code, action: 'execute' }),
      });
      const data: ExecResponse = await response.json();
      if (data.success) {
        setOutput(data.data?.output || data.data?.result || 'Execution completed successfully');
      } else {
        setOutput(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setOutput(`Connection error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const compileCode = async () => {
    setLoading(true);
    setOutput('Compiling...');
    try {
      const response = await fetch(`${API_URL}/lumos/compile`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:admin123')
        },
        body: JSON.stringify({ code, action: 'compile', target: compileTarget }),
      });
      const data: ExecResponse = await response.json();
      if (data.success) {
        setOutput(`Compiled to ${compileTarget}:\n\n${data.data?.compiled || 'Success'}`);
      } else {
        setOutput(`Compilation error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setOutput(`Connection error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex gap-2 items-center bg-slate-800 p-2 rounded">
        <button
          onClick={executeCode}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded text-white text-sm font-medium transition"
        >
          {loading ? 'Running...' : 'Execute'}
        </button>
        <select
          value={compileTarget}
          onChange={(e) => setCompileTarget(e.target.value)}
          className="px-3 py-2 bg-slate-700 text-slate-100 rounded text-sm outline-none border border-slate-600"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="rust">Rust</option>
          <option value="go">Go</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
        </select>
        <button
          onClick={compileCode}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 rounded text-white text-sm font-medium transition"
        >
          {loading ? 'Compiling...' : 'Compile'}
        </button>
      </div>
      <textarea
        className="flex-1 bg-slate-800 text-slate-100 p-3 rounded font-mono text-sm resize-none outline-none border border-slate-700 focus:border-blue-500 transition"
        placeholder="Enter Lumos code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <div className="h-40 bg-slate-800 text-green-400 p-3 rounded font-mono text-xs overflow-auto border border-slate-700">
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
};

const SystemMonitor = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/status`);
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        }
      } catch (error) {
        console.error('Failed to fetch status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-sm text-slate-400 mb-3 flex items-center gap-2 font-semibold">
          <Cpu size={16} className="text-blue-400" /> SYSTEM INFORMATION
        </h3>
        {status && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col">
              <span className="text-slate-500">Operating System</span>
              <span className="text-slate-200 font-medium">{status.os || 'LumOS'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500">Version</span>
              <span className="text-slate-200 font-medium">{status.version || '2.1.0'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500">Hostname</span>
              <span className="text-slate-200 font-medium">{status.hostname || 'lumos-backend'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500">Uptime</span>
              <span className="text-slate-200 font-medium">{status.uptime || 'Active'}</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-sm text-slate-400 mb-3 flex items-center gap-2 font-semibold">
          <Activity size={16} className="text-green-400" /> BACKEND STATUS
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Rust Core: <span className="text-green-400 font-medium">Active</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Lumos Engine: <span className="text-green-400 font-medium">Active</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Python API: <span className="text-green-400 font-medium">Active</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span>PHP/Laravel: <span className="text-yellow-400 font-medium">Standby</span></span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-sm text-slate-400 mb-3 flex items-center gap-2 font-semibold">
          <Database size={16} className="text-purple-400" /> DATABASE
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Provider</span>
            <span className="text-slate-200 font-medium">Supabase PostgreSQL</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Connection</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-green-400 font-medium">Connected</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Database</span>
            <span className="text-slate-200 font-medium">{status?.database || 'postgres'}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-sm text-slate-400 mb-3 flex items-center gap-2 font-semibold">
          <Code size={16} className="text-orange-400" /> LOADED LANGUAGES
        </h3>
        <div className="flex flex-wrap gap-2">
          {(status?.languages_loaded || ['Lumos', 'Python', 'Ruby', 'PHP', 'Rust', 'Go', 'JavaScript', 'COBOL']).map((lang: string) => (
            <span key={lang} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 border border-slate-600">
              {lang}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const NetworkTools = () => {
  const [host, setHost] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [tool, setTool] = useState('ping');

  const executeTool = async () => {
    if (!host.trim()) {
      setResult('Error: Please enter a target host');
      return;
    }

    setLoading(true);
    setResult('Executing...');
    
    try {
      const response = await fetch(`${API_URL}/network/tool`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:admin123')
        },
        body: JSON.stringify({ 
          tool, 
          target: host,
          options: []
        }),
      });
      const data: ExecResponse = await response.json();
      
      if (data.success) {
        setResult(data.data?.output || 'Operation completed');
      } else {
        setResult(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setResult(`Connection error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-400 mb-2 block font-medium">Network Tool</label>
          <select
            value={tool}
            onChange={(e) => setTool(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded text-sm outline-none border border-slate-600 focus:border-blue-500 transition"
          >
            <option value="ping">Ping</option>
            <option value="traceroute">Traceroute</option>
            <option value="nmap">Nmap</option>
            <option value="ifconfig">Ifconfig</option>
            <option value="arp">ARP</option>
            <option value="netstat">Netstat</option>
          </select>
        </div>
        
        <div>
          <label className="text-xs text-slate-400 mb-2 block font-medium">Target Host</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="example.com or 192.168.1.1"
              className="flex-1 px-3 py-2 bg-slate-800 text-slate-100 rounded text-sm outline-none border border-slate-600 focus:border-blue-500 transition"
              onKeyDown={(e) => e.key === 'Enter' && executeTool()}
            />
            <button
              onClick={executeTool}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded text-white text-sm font-medium transition"
            >
              {loading ? 'Running...' : 'Execute'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-800 p-3 rounded font-mono text-xs overflow-auto border border-slate-700">
        <pre className="whitespace-pre-wrap text-green-400">{result || 'No results yet. Enter a host and click Execute.'}</pre>
      </div>
    </div>
  );
};

const DataAnalytics = () => {
  const [data, setData] = useState('[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]');
  const [operation, setOperation] = useState('sum');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const processData = async () => {
    setLoading(true);
    setResult('Processing...');
    
    try {
      const parsedData = JSON.parse(data);
      
      if (!Array.isArray(parsedData)) {
        setResult('Error: Data must be a JSON array');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/data/process`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:admin123')
        },
        body: JSON.stringify({ data: parsedData, operation }),
      });
      const responseData: ExecResponse = await response.json();
      
      if (responseData.success) {
        setResult(JSON.stringify(responseData.data, null, 2));
      } else {
        setResult(`Error: ${responseData.error}`);
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-400 mb-2 block font-medium">Data (JSON Array)</label>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded text-sm outline-none font-mono h-24 resize-none border border-slate-600 focus:border-blue-500 transition"
            placeholder='[10, 20, 30, 40, 50]'
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-800 text-slate-100 rounded text-sm outline-none border border-slate-600 focus:border-blue-500 transition"
          >
            <option value="sum">Sum</option>
            <option value="average">Average</option>
            <option value="count">Count</option>
            <option value="min">Minimum</option>
            <option value="max">Maximum</option>
          </select>
          <button
            onClick={processData}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 rounded text-white text-sm font-medium transition"
          >
            {loading ? 'Processing...' : 'Process'}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-800 p-3 rounded font-mono text-xs overflow-auto border border-slate-700">
        <pre className="text-green-400">{result || 'No results yet. Enter data and click Process.'}</pre>
      </div>
    </div>
  );
};

const FileExplorer = () => {
  const [currentPath] = useState('/');

  return (
    <div className="h-full flex flex-col">
      <div className="bg-slate-800 p-2 border-b border-slate-700 flex items-center gap-2">
        <HardDrive size={16} className="text-blue-400" />
        <span className="text-sm font-mono text-slate-300">{currentPath}</span>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="text-slate-400 text-sm text-center py-8">
          File Explorer - Coming Soon
          <div className="mt-2 text-xs">
            Upload, browse, and manage files
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LumOSDesktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZ, setNextZ] = useState(10);
  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('ja-JP'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const openWindow = (id: string, title: string, content: React.ReactNode, width?: number, height?: number) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        return prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: nextZ } : w);
      }
      
      const windowCount = prev.length;
      const offset = windowCount * 30;
      
      return [...prev, { 
        id, 
        title, 
        isOpen: true, 
        isMinimized: false, 
        content, 
        zIndex: nextZ, 
        width, 
        height,
        position: { x: 100 + offset, y: 50 + offset }
      }];
    });
    setNextZ(prev => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZ } : w));
    setNextZ(prev => prev + 1);
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      
      <div className="absolute top-6 left-6 flex flex-col gap-6 z-10">
        <button 
          onClick={() => openWindow('terminal', 'LumOS Terminal', <TerminalApp />, 700, 500)}
          className="flex flex-col items-center gap-2 group w-20"
        >
          <div className="w-14 h-14 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-600 group-hover:bg-slate-800/70 group-hover:border-blue-500 transition shadow-lg">
            <Terminal className="text-green-400" size={24} />
          </div>
          <span className="text-xs text-shadow group-hover:text-white transition font-medium">Terminal</span>
        </button>

        <button 
          onClick={() => openWindow('lumos', 'Lumos Editor', <LumosEditor />, 800, 600)}
          className="flex flex-col items-center gap-2 group w-20"
        >
          <div className="w-14 h-14 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-600 group-hover:bg-slate-800/70 group-hover:border-purple-500 transition shadow-lg">
            <FileCode className="text-purple-400" size={24} />
          </div>
          <span className="text-xs text-shadow group-hover:text-white transition font-medium">Lumos</span>
        </button>

        <button 
          onClick={() => openWindow('monitor', 'System Monitor', <SystemMonitor />, 650, 550)}
          className="flex flex-col items-center gap-2 group w-20"
        >
          <div className="w-14 h-14 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-600 group-hover:bg-slate-800/70 group-hover:border-blue-500 transition shadow-lg">
            <Monitor className="text-blue-400" size={24} />
          </div>
          <span className="text-xs text-shadow group-hover:text-white transition font-medium">Monitor</span>
        </button>

        <button 
          onClick={() => openWindow('network', 'Network Tools', <NetworkTools />, 700, 550)}
          className="flex flex-col items-center gap-2 group w-20"
        >
          <div className="w-14 h-14 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-600 group-hover:bg-slate-800/70 group-hover:border-cyan-500 transition shadow-lg">
            <Wifi className="text-cyan-400" size={24} />
          </div>
          <span className="text-xs text-shadow group-hover:text-white transition font-medium">Network</span>
        </button>

        <button 
          onClick={() => openWindow('analytics', 'Data Analytics', <DataAnalytics />, 700, 550)}
          className="flex flex-col items-center gap-2 group w-20"
        >
          <div className="w-14 h-14 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-600 group-hover:bg-slate-800/70 group-hover:border-orange-500 transition shadow-lg">
            <BarChart className="text-orange-400" size={24} />
          </div>
          <span className="text-xs text-shadow group-hover:text-white transition font-medium">Analytics</span>
        </button>

        <button 
          onClick={() => openWindow('files', 'File Explorer', <FileExplorer />, 700, 550)}
          className="flex flex-col items-center gap-2 group w-20"
        >
          <div className="w-14 h-14 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-600 group-hover:bg-slate-800/70 group-hover:border-yellow-500 transition shadow-lg">
            <Folder className="text-yellow-400" size={24} />
          </div>
          <span className="text-xs text-shadow group-hover:text-white transition font-medium">Files</span>
        </button>
      </div>

      <AnimatePresence>
        {windows.map(win => (
          <WindowFrame 
            key={win.id} 
            win={win} 
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
          />
        ))}
      </AnimatePresence>

      <div className="absolute bottom-0 w-full h-14 bg-slate-900/85 backdrop-blur-xl border-t border-slate-700 flex items-center px-6 justify-between z-50 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div className="font-bold text-xl tracking-tight bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              LumOS
            </div>
          </div>
          
          <div className="h-8 w-[1px] bg-slate-700" />
          
          <div className="flex gap-2">
            {windows.map(win => (
              <button
                key={win.id}
                onClick={() => win.isMinimized ? minimizeWindow(win.id) : focusWindow(win.id)}
                className={`px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition font-medium ${
                  !win.isMinimized 
                    ? 'bg-slate-700/80 text-white shadow-md border border-slate-600' 
                    : 'hover:bg-slate-800/50 text-slate-400 border border-transparent'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${!win.isMinimized ? 'bg-blue-500' : 'bg-slate-600'}`} />
                <span className="max-w-[120px] truncate">{win.title}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Database size={14} className="text-green-400" />
            <span className="text-green-400">Connected</span>
          </div>
          <div className="text-sm font-mono text-slate-300 bg-slate-800/50 px-3 py-1 rounded border border-slate-700">
            {time || '00:00:00'}
          </div>
        </div>
      </div>
    </main>
  );
}
