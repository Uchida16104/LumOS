'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Settings, Folder, X, Minus, Square, Database, Code, 
  Network, Activity, FileCode, Wifi, Server, BarChart, Cpu, HardDrive
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
};

interface ExecResponse {
  success: boolean;
  output: string;
  error?: string;
}

interface LumosResponse {
  success: boolean;
  output?: string;
  compiled?: string;
  error?: string;
}

const mockExecuteCommand = async (cmd: string): Promise<string> => {
  await new Promise(r => setTimeout(r, 600));
  
  const lower = cmd.toLowerCase().trim();
  if (lower.startsWith('python')) return `[Python 3.11 Runtime]\n>>> Executing logic inside Rust container...\nResult: Success (Data Analysis complete)`;
  if (lower.startsWith('cobol')) return `[GnuCOBOL Runtime]\n>>> IDENTIFICATION DIVISION found.\n>>> Executing legacy transaction logic... OK.`;
  if (lower.startsWith('rust')) return `[Rust Native]\n>>> Memory safety check passed.\n>>> Borrow checker happy.`;
  if (lower === 'ls') return `laravel_project/\npython_analytics/\ncobol_ledger/\nuser_data/`;
  if (lower === 'help') return `Available Runtimes managed by LumOS:\n- Python (FastAPI)\n- Laravel\n- COBOL\n- C#\n- Go\n- Rust\nType 'python run' or 'cobol exec' to test.`;
  
  return `lumos-shell: command not found: ${cmd}`;
};

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
      className="absolute top-10 left-10 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl overflow-hidden flex flex-col"
      style={{ 
        zIndex: win.zIndex, 
        display: win.isMinimized ? 'none' : 'flex',
        width: win.width || 600,
        height: win.height || 400
      }}
    >
      <div className="h-8 bg-slate-800 flex items-center justify-between px-2 cursor-grab active:cursor-grabbing select-none">
        <span className="text-xs text-slate-300 font-mono flex items-center gap-2">
          <Database size={12} className="text-blue-400" />
          {win.title}
        </span>
        <div className="flex gap-2">
          <button onClick={onMinimize} className="hover:bg-slate-700 p-1 rounded"><Minus size={12} color="white" /></button>
          <button className="hover:bg-slate-700 p-1 rounded"><Square size={12} color="white" /></button>
          <button onClick={onClose} className="hover:bg-red-900 p-1 rounded"><X size={12} color="white" /></button>
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
    'Welcome to LumOS Kernel v2.0.0',
    'Connected to Render Backend (Rust Host)...',
    'Database: Supabase PostgreSQL',
    'Type "help" for available commands'
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleCommand = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input;
      setHistory(prev => [...prev, `$ ${cmd}`]);
      setInput('');
      const response = await mockExecuteCommand(cmd);
      setHistory(prev => [...prev, response]);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 space-y-1">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all text-green-400">{line}</div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700">
        <span className="text-blue-400">root@lumos:~#</span>
        <input 
          autoFocus
          className="bg-transparent outline-none flex-1 text-slate-100"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
        />
      </div>
    </div>
  );
};

const LumosREPL = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('Lumos Language REPL v2.1.0\nReady to execute code...');
  const [compileTarget, setCompileTarget] = useState('python');
  const [loading, setLoading] = useState(false);

  const executeCode = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/lumos/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, action: 'execute' }),
      });
      const data: LumosResponse = await response.json();
      if (data.success) {
        setOutput(data.output || 'Execution completed');
      } else {
        setOutput(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setOutput(`Connection error: ${error}`);
    }
    setLoading(false);
  };

  const compileCode = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/lumos/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, action: 'compile', target: compileTarget }),
      });
      const data: LumosResponse = await response.json();
      if (data.success) {
        setOutput(`Compiled to ${compileTarget}:\n\n${data.compiled}`);
      } else {
        setOutput(`Compilation error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setOutput(`Connection error: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col gap-2">
      <textarea
        className="flex-1 bg-slate-800 text-slate-100 p-2 rounded font-mono text-sm resize-none outline-none"
        placeholder="Enter Lumos code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <div className="flex gap-2 items-center">
        <button
          onClick={executeCode}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded text-white text-sm"
        >
          {loading ? 'Running...' : 'Execute'}
        </button>
        <select
          value={compileTarget}
          onChange={(e) => setCompileTarget(e.target.value)}
          className="px-3 py-2 bg-slate-800 text-slate-100 rounded text-sm outline-none"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="rust">Rust</option>
          <option value="go">Go</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
        </select>
        <button
          onClick={compileCode}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 rounded text-white text-sm"
        >
          {loading ? 'Compiling...' : 'Compile'}
        </button>
      </div>
      <div className="h-32 bg-slate-800 text-green-400 p-2 rounded font-mono text-xs overflow-auto">
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
};

const SystemMonitor = () => {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/status`);
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 p-3 rounded">
        <h3 className="text-xs text-slate-400 mb-2 flex items-center gap-2">
          <Server size={14} /> BACKEND STATUS (Render)
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>Rust Core: <span className="text-green-400">Active</span></div>
          <div>Lumos Engine: <span className="text-green-400">Active</span></div>
          <div>Python API: <span className="text-green-400">Active</span></div>
          <div>Laravel: <span className="text-yellow-400">Standby</span></div>
        </div>
      </div>
      <div className="bg-slate-800 p-3 rounded">
        <h3 className="text-xs text-slate-400 mb-2 flex items-center gap-2">
          <Database size={14} /> DATABASE (Supabase)
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs">Connection Established (PostgreSQL)</span>
        </div>
      </div>
      {status && (
        <div className="bg-slate-800 p-3 rounded">
          <h3 className="text-xs text-slate-400 mb-2 flex items-center gap-2">
            <Cpu size={14} /> SYSTEM INFO
          </h3>
          <div className="text-xs space-y-1">
            <div>OS: {status.os}</div>
            <div>Version: {status.version}</div>
            <div>Languages: {status.languages_loaded?.length || 0} loaded</div>
          </div>
        </div>
      )}
    </div>
  );
};

const NetworkTools = () => {
  const [host, setHost] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const ping = async () => {
    if (!host) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/network/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host }),
      });
      const data = await response.json();
      setResult(data.success ? data.output : `Error: ${data.error}`);
    } catch (error) {
      setResult(`Connection error: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-400 mb-2 block">Ping Host</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="example.com"
            className="flex-1 px-3 py-2 bg-slate-800 text-slate-100 rounded text-sm outline-none"
          />
          <button
            onClick={ping}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded text-white text-sm"
          >
            {loading ? 'Pinging...' : 'Ping'}
          </button>
        </div>
      </div>
      <div className="bg-slate-800 p-3 rounded font-mono text-xs overflow-auto max-h-64">
        <pre className="whitespace-pre-wrap text-green-400">{result || 'No results yet'}</pre>
      </div>
    </div>
  );
};

const DataAnalytics = () => {
  const [data, setData] = useState('[10, 20, 30, 40, 50]');
  const [operation, setOperation] = useState('sum');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const processData = async () => {
    setLoading(true);
    try {
      const parsedData = JSON.parse(data);
      const response = await fetch(`${API_URL}/data/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsedData, operation }),
      });
      const responseData = await response.json();
      setResult(JSON.stringify(responseData, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-400 mb-2 block">Data (JSON Array)</label>
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full px-3 py-2 bg-slate-800 text-slate-100 rounded text-sm outline-none font-mono h-24"
          placeholder='[10, 20, 30, 40, 50]'
        />
      </div>
      <div className="flex gap-2">
        <select
          value={operation}
          onChange={(e) => setOperation(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-800 text-slate-100 rounded text-sm outline-none"
        >
          <option value="sum">Sum</option>
          <option value="average">Average</option>
          <option value="count">Count</option>
        </select>
        <button
          onClick={processData}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 rounded text-white text-sm"
        >
          {loading ? 'Processing...' : 'Process'}
        </button>
      </div>
      <div className="bg-slate-800 p-3 rounded font-mono text-xs overflow-auto">
        <pre className="text-green-400">{result || 'No results yet'}</pre>
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
      return [...prev, { id, title, isOpen: true, isMinimized: false, content, zIndex: nextZ, width, height }];
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
      
      <div className="absolute top-4 left-4 flex flex-col gap-6">
        <button 
          onClick={() => openWindow('terminal', 'LumOS Terminal (Bash/Polyglot)', <TerminalApp />)}
          className="flex flex-col items-center gap-1 group w-20"
        >
          <div className="w-12 h-12 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-600 group-hover:bg-slate-800 transition backdrop-blur-sm">
            <Terminal className="text-green-400" />
          </div>
          <span className="text-xs text-shadow group-hover:text-white/80">Terminal</span>
        </button>

        <button 
          onClick={() => openWindow('lumos', 'Lumos Language REPL', <LumosREPL />, 700, 500)}
          className="flex flex-col items-center gap-1 group w-20"
        >
          <div className="w-12 h-12 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-600 group-hover:bg-slate-800 transition backdrop-blur-sm">
            <FileCode className="text-purple-400" />
          </div>
          <span className="text-xs text-shadow group-hover:text-white/80">Lumos</span>
        </button>

        <button 
          onClick={() => openWindow('monitor', 'System Monitor', <SystemMonitor />)}
          className="flex flex-col items-center gap-1 group w-20"
        >
          <div className="w-12 h-12 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-600 group-hover:bg-slate-800 transition backdrop-blur-sm">
            <Code className="text-blue-400" />
          </div>
          <span className="text-xs text-shadow group-hover:text-white/80">SysMon</span>
        </button>

        <button 
          onClick={() => openWindow('network', 'Network Tools', <NetworkTools />, 600, 450)}
          className="flex flex-col items-center gap-1 group w-20"
        >
          <div className="w-12 h-12 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-600 group-hover:bg-slate-800 transition backdrop-blur-sm">
            <Wifi className="text-cyan-400" />
          </div>
          <span className="text-xs text-shadow group-hover:text-white/80">Network</span>
        </button>

        <button 
          onClick={() => openWindow('analytics', 'Data Analytics', <DataAnalytics />, 600, 500)}
          className="flex flex-col items-center gap-1 group w-20"
        >
          <div className="w-12 h-12 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-600 group-hover:bg-slate-800 transition backdrop-blur-sm">
            <BarChart className="text-orange-400" />
          </div>
          <span className="text-xs text-shadow group-hover:text-white/80">Analytics</span>
        </button>

        <button className="flex flex-col items-center gap-1 group w-20">
          <div className="w-12 h-12 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-600 group-hover:bg-slate-800 transition backdrop-blur-sm">
            <Folder className="text-yellow-400" />
          </div>
          <span className="text-xs text-shadow group-hover:text-white/80">Files</span>
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

      <div className="absolute bottom-0 w-full h-12 bg-slate-900/80 backdrop-blur-xl border-t border-slate-700 flex items-center px-4 justify-between z-50">
        <div className="flex items-center gap-4">
          <div className="font-bold text-xl tracking-tighter bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            LumOS
          </div>
          <div className="h-6 w-[1px] bg-slate-700 mx-2" />
          {windows.map(win => (
            <button
              key={win.id}
              onClick={() => win.isMinimized ? minimizeWindow(win.id) : focusWindow(win.id)}
              className={`px-3 py-1 rounded text-xs flex items-center gap-2 transition ${
                !win.isMinimized ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              {win.title}
            </button>
          ))}
        </div>
        <div className="text-xs font-mono text-slate-400">
          {time}
        </div>
      </div>
    </main>
  );
}
