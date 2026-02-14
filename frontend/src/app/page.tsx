'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Folder, Code, Monitor, Wifi, BarChart } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lumos-faoy.onrender.com';

export default function LumOSDesktop() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('ja-JP'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center text-slate-100 font-sans">
      
      <div className="absolute top-6 left-6 flex flex-col gap-6 z-10">
        <button className="flex flex-col items-center gap-2 group w-20">
          <div className="w-14 h-14 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-600 group-hover:bg-slate-800/70 transition shadow-lg">
            <Terminal className="text-green-400" size={24} />
          </div>
          <span className="text-xs text-shadow group-hover:text-white transition font-medium">Terminal</span>
        </button>

        <button className="flex flex-col items-center gap-2 group w-20">
          <div className="w-14 h-14 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-600 group-hover:bg-slate-800/70 transition shadow-lg">
            <Code className="text-purple-400" size={24} />
          </div>
          <span className="text-xs text-shadow group-hover:text-white transition font-medium">Lumos</span>
        </button>

        <button className="flex flex-col items-center gap-2 group w-20">
          <div className="w-14 h-14 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-600 group-hover:bg-slate-800/70 transition shadow-lg">
            <Monitor className="text-blue-400" size={24} />
          </div>
          <span className="text-xs text-shadow group-hover:text-white transition font-medium">Monitor</span>
        </button>

        <button className="flex flex-col items-center gap-2 group w-20">
          <div className="w-14 h-14 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-600 group-hover:bg-slate-800/70 transition shadow-lg">
            <Wifi className="text-cyan-400" size={24} />
          </div>
          <span className="text-xs text-shadow group-hover:text-white transition font-medium">Network</span>
        </button>

        <button className="flex flex-col items-center gap-2 group w-20">
          <div className="w-14 h-14 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-600 group-hover:bg-slate-800/70 transition shadow-lg">
            <BarChart className="text-orange-400" size={24} />
          </div>
          <span className="text-xs text-shadow group-hover:text-white transition font-medium">Analytics</span>
        </button>

        <button className="flex flex-col items-center gap-2 group w-20">
          <div className="w-14 h-14 bg-slate-900/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-600 group-hover:bg-slate-800/70 transition shadow-lg">
            <Folder className="text-yellow-400" size={24} />
          </div>
          <span className="text-xs text-shadow group-hover:text-white transition font-medium">Files</span>
        </button>
      </div>

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
        </div>
        
        <div className="text-sm font-mono text-slate-300 bg-slate-800/50 px-3 py-1 rounded border border-slate-700">
          {time || '00:00:00'}
        </div>
      </div>
    </main>
  );
}
