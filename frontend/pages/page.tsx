'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Motion One integration equivalent
import { Terminal, Settings, Folder, X, Minus, Square, Database, Code } from 'lucide-react';

// --- Type Definitions ---

type WindowState = {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  content: React.ReactNode;
  zIndex: number;
};

// --- Mock Backend API Client (Simulating Rust/Polyglot calls) ---
const mockExecuteCommand = async (cmd: string): Promise<string> => {
  await new Promise(r => setTimeout(r, 600)); // Simulate latency
  
  const lower = cmd.toLowerCase().trim();
  if (lower.startsWith('python')) return `[Python 3.11 Runtime]\n>>> Executing logic inside Rust container...\nResult: Success (Data Analysis complete)`;
  if (lower.startsWith('cobol')) return `[GnuCOBOL Runtime]\n>>> IDENTIFICATION DIVISION found.\n>>> Executing legacy transaction logic... OK.`;
  if (lower.startsWith('rust')) return `[Rust Native]\n>>> Memory safety check passed.\n>>> Borrow checker happy.`;
  if (lower === 'ls') return `laravel_project/\npython_analytics/\ncobol_ledger/\nuser_data/`;
  if (lower === 'help') return `Available Runtimes managed by LumOS:\n- Python (FastAPI)\n- Laravel\n- COBOL\n- C#\n- Go\n- Rust\nType 'python run' or 'cobol exec' to test.`;
  
  return `lumos-shell: command not found: ${cmd}`;
};

// --- Components ---

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
      className="absolute top-10 left-10 w-[600px] h-[400px] bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl overflow-hidden flex flex-col"
      style={{ zIndex: win.zIndex, display: win.isMinimized ? 'none' : 'flex' }}
    >
      {/* Title Bar */}
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
      {/* Content */}
      <div className="flex-1 p-4 overflow-auto font-mono text-sm text-slate-200">
        {win.content}
      </div>
    </motion.div>
  );
};

const TerminalApp = () => {
  const [history, setHistory] = useState<string[]>(['Welcome to LumOS Kernel v1.0', 'Connected to Render Backend (Rust Host)...']);
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

const SystemMonitor = () => (
  <div className="space-y-4">
    <div className="bg-slate-800 p-3 rounded">
      <h3 className="text-xs text-slate-400 mb-2">BACKEND STATUS (Render)</h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>Rust Core: <span className="text-green-400">Active</span></div>
        <div>Python API: <span className="text-green-400">Active</span></div>
        <div>Laravel: <span className="text-yellow-400">Standby</span></div>
        <div>COBOL: <span className="text-yellow-400">Standby</span></div>
      </div>
    </div>
    <div className="bg-slate-800 p-3 rounded">
      <h3 className="text-xs text-slate-400 mb-2">DATABASE (Supabase)</h3>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs">Connection Established (PostgreSQL)</span>
      </div>
    </div>
  </div>
);

// --- Main Desktop Component ---

export default function LumOSDesktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZ, setNextZ] = useState(10);
  const [time, setTime] = useState('');

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const openWindow = (id: string, title: string, content: React.ReactNode) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        return prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: nextZ } : w);
      }
      return [...prev, { id, title, isOpen: true, isMinimized: false, content, zIndex: nextZ }];
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
      
      {/* Embedding Required Scripts (Simulated for Next.js App Router) */}
      <script src="https://unpkg.com/htmx.org@1.9.10" async></script>
      <script src="//unpkg.com/alpinejs" defer></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.12" async></script>

      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-6">
        <button 
          onClick={() => openWindow('terminal', 'LumOS Terminal (Rust/Polyglot)', <TerminalApp />)}
          className="flex flex-col items-center gap-1 group w-20"
        >
          <div className="w-12 h-12 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-600 group-hover:bg-slate-800 transition backdrop-blur-sm">
            <Terminal className="text-green-400" />
          </div>
          <span className="text-xs text-shadow group-hover:text-white/80">Terminal</span>
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

        <button className="flex flex-col items-center gap-1 group w-20">
          <div className="w-12 h-12 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-600 group-hover:bg-slate-800 transition backdrop-blur-sm">
            <Folder className="text-yellow-400" />
          </div>
          <span className="text-xs text-shadow group-hover:text-white/80">Files</span>
        </button>
      </div>

      {/* Window Area */}
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

      {/* Taskbar */}
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
