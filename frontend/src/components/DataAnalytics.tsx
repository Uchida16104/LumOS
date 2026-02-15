'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

const DataAnalytics: React.FC = () => {
  const [data, setData] = useState('[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]');
  const [operation, setOperation] = useState('sum');
  const [result, setResult] = useState('');

  const operations = [
    { id: 'sum', name: 'Sum', description: 'Calculate total sum' },
    { id: 'average', name: 'Average', description: 'Calculate average' },
    { id: 'count', name: 'Count', description: 'Count elements' },
  ];

  const handleProcess = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lumos-faoy.onrender.com';

    try {
      const parsedData = JSON.parse(data);
      
      const response = await fetch(`${API_URL}/data/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:admin123'),
        },
        body: JSON.stringify({
          data: parsedData,
          operation: operation,
        }),
      });

      const apiResult = await response.json();
      
      if (apiResult.success && apiResult.data) {
        setResult(JSON.stringify(apiResult.data, null, 2));
      } else {
        setResult(`Error: ${apiResult.error || 'Unknown error'}`);
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div className="h-full bg-slate-900 text-white p-6 overflow-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="text-orange-400" />
          Data Analytics
        </h2>
        <p className="text-slate-400">Process and analyze data in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-blue-400" size={20} />
            <h3 className="font-semibold">Quick Stats</h3>
          </div>
          <div className="text-3xl font-bold text-blue-400">0</div>
          <div className="text-sm text-slate-400">Total Operations</div>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-400" size={20} />
            <h3 className="font-semibold">Success Rate</h3>
          </div>
          <div className="text-3xl font-bold text-green-400">100%</div>
          <div className="text-sm text-slate-400">Processing Success</div>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="text-purple-400" size={20} />
            <h3 className="font-semibold">Data Points</h3>
          </div>
          <div className="text-3xl font-bold text-purple-400">0</div>
          <div className="text-sm text-slate-400">Analyzed</div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-4">
        <h3 className="font-semibold mb-4">Data Processing</h3>
        
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-2">Input Data (JSON Array)</label>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-3 font-mono text-sm focus:border-orange-500 focus:outline-none resize-none"
            placeholder='[1, 2, 3, 4, 5]'
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-2">Operation</label>
          <div className="grid grid-cols-3 gap-2">
            {operations.map(op => (
              <button
                key={op.id}
                onClick={() => setOperation(op.id)}
                className={`p-3 rounded transition ${
                  operation === op.id
                    ? 'bg-orange-600'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <div className="font-medium text-sm">{op.name}</div>
                <div className="text-xs text-slate-400 mt-1">{op.description}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleProcess}
          className="w-full py-3 bg-orange-600 hover:bg-orange-700 rounded font-medium transition"
        >
          Process Data
        </button>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <h3 className="font-semibold mb-4">Result</h3>
        <div className="bg-[#1a1b26] text-[#a9b1d6] font-mono text-sm p-4 rounded border border-slate-700 min-h-32 whitespace-pre-wrap">
          {result || 'Result will appear here...'}
        </div>
      </div>
    </div>
  );
};

export default DataAnalytics;
