'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, Server, Database, Wifi } from 'lucide-react';
import { api } from '../lib/api';

const SystemMonitor: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSystemStatus();
    const interval = setInterval(loadSystemStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemStatus = async () => {
    try {
      const status = await api.getStatus();
      setSystemStatus(status);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load system status:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Activity className="animate-pulse mx-auto mb-2" size={32} />
          <p>Loading system information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-900 text-white p-6 overflow-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Activity className="text-blue-400" />
          System Monitor
        </h2>
        <p className="text-slate-400">Real-time system information and status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <Server className="text-purple-400" size={24} />
            <h3 className="font-semibold">System Info</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">OS:</span>
              <span>{systemStatus?.os || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Version:</span>
              <span>{systemStatus?.version || '0.0.0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hostname:</span>
              <span>{systemStatus?.hostname || 'localhost'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Uptime:</span>
              <span>{systemStatus?.uptime || 'Active'}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <Database className="text-green-400" size={24} />
            <h3 className="font-semibold">Database</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Type:</span>
              <span>{systemStatus?.database || 'PostgreSQL'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="text-green-400">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Provider:</span>
              <span>Supabase</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Cpu className="text-orange-400" size={24} />
          <h3 className="font-semibold">Loaded Languages</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {(systemStatus?.languages_loaded || []).map((lang: string) => (
            <span
              key={lang}
              className="px-3 py-1 bg-slate-700 rounded-full text-sm"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <Wifi className="text-cyan-400" size={24} />
          <h3 className="font-semibold">Network Tools</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {(systemStatus?.network_tools_available || []).map((tool: string) => (
            <span
              key={tool}
              className="px-3 py-1 bg-slate-700 rounded-full text-sm"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;
