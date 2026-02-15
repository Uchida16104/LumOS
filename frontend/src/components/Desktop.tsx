'use client';

import React, { useState } from 'react';
import Window from './Window';
import Terminal from './Terminal';
import FileExplorer from './FileExplorer';
import LumosEditor from './LumosEditor';
import SystemMonitor from './SystemMonitor';
import NetworkTools from './NetworkTools';
import DataAnalytics from './DataAnalytics';
import { Terminal as TerminalIcon, Folder, Code, Monitor, Wifi, BarChart, X, Minimize } from 'lucide-react';
import type { WindowState } from '../types';

const Desktop: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);

  const openWindow = (app: string) => {
    const existing = windows.find(w => w.title === app);
    if (existing && existing.isOpen) {
      bringToFront(existing.id);
      return;
    }

    const components: Record<string, React.ReactNode> = {
      Terminal: <Terminal />,
      'File Explorer': <FileExplorer />,
      'Lumos Editor': <LumosEditor />,
      'System Monitor': <SystemMonitor />,
      'Network Tools': <NetworkTools />,
      'Data Analytics': <DataAnalytics />,
    };

    const newWindow: WindowState = {
      id: Math.random().toString(36).substring(7),
      title: app,
      isOpen: true,
      isMinimized: false,
      content: components[app],
      zIndex: nextZIndex,
      width: 800,
      height: 600,
      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
    };

    setWindows([...windows, newWindow]);
    setNextZIndex(nextZIndex + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
  };

  const bringToFront = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w));
    setNextZIndex(nextZIndex + 1);
  };

  const apps = [
    { name: 'Terminal', icon: TerminalIcon, color: 'text-green-400', bgColor: 'bg-green-500/20' },
    { name: 'Lumos Editor', icon: Code, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    { name: 'System Monitor', icon: Monitor, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    { name: 'Network Tools', icon: Wifi, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
    { name: 'Data Analytics', icon: BarChart, color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    { name: 'File Explorer', icon: Folder, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
  ];

  return (
    <div className="relative w-full h-full">
      {windows.map(window => (
        window.isOpen && (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            isMinimized={window.isMinimized}
            zIndex={window.zIndex}
            width={window.width}
            height={window.height}
            position={window.position}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onFocus={() => bringToFront(window.id)}
          >
            {window.content}
          </Window>
        )
      ))}

      <div className="absolute left-6 top-6 flex flex-col gap-4 z-10">
        {apps.map(app => (
          <button
            key={app.name}
            onClick={() => openWindow(app.name)}
            className="flex flex-col items-center gap-2 group w-20"
          >
            <div className={`w-14 h-14 ${app.bgColor} backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-600 group-hover:scale-110 transition-transform shadow-lg`}>
              <app.icon className={app.color} size={24} />
            </div>
            <span className="text-xs text-white drop-shadow-lg group-hover:text-white transition font-medium text-center leading-tight">
              {app.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Desktop;
