'use client';

import React, { useState } from 'react';
import { Wifi, Activity, Search } from 'lucide-react';

const NetworkTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState('ping');
  const [target, setTarget] = useState('8.8.8.8');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const tools = [
    { id: 'ping', name: 'Ping', description: 'Test network connectivity' },
    { id: 'traceroute', name: 'Traceroute', description: 'Trace route to destination' },
    { id: 'nmap', name: 'Nmap', description: 'Network exploration tool' },
    { id: 'ifconfig', name: 'ifconfig', description: 'Display network interfaces' },
    { id: 'netstat', name: 'Netstat', description: 'Network statistics' },
    { id: 'arp', name: 'ARP', description: 'Address Resolution Protocol table' },
  ];

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(`Running ${selectedTool}...\n\n`);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lumos-faoy.onrender.com';
    
    try {
      const response = await fetch(`${API_URL}/network/tool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:admin123'),
        },
        body: JSON.stringify({
          tool: selectedTool,
          target: target || '127.0.0.1',
          options: [],
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        setOutput(result.data.output || 'Tool executed successfully');
      } else {
        setOutput(`Error: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full bg-slate-900 text-white flex">
      <div className="w-64 bg-slate-800 border-r border-slate-700 p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Wifi className="text-cyan-400" size={20} />
          Network Tools
        </h3>
        <div className="space-y-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`w-full text-left p-3 rounded transition ${
                selectedTool === tool.id
                  ? 'bg-cyan-600'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <div className="font-medium text-sm">{tool.name}</div>
              <div className="text-xs text-slate-400 mt-1">{tool.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <Search className="text-cyan-400" size={20} />
            <h3 className="font-semibold">
              {tools.find(t => t.id === selectedTool)?.name}
            </h3>
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Target (IP address or hostname)"
              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:border-cyan-500 focus:outline-none"
              disabled={['ifconfig', 'netstat', 'arp'].includes(selectedTool)}
            />
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Activity size={16} />
              Run
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <div className="bg-[#1a1b26] text-[#a9b1d6] font-mono text-sm p-4 rounded border border-slate-700 h-full whitespace-pre-wrap">
            {output || 'Output will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkTools;
