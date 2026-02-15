'use client';

import React, { useState } from 'react';
import { Play, Code2, Save, FileCode } from 'lucide-react';
import { api } from '../lib/api';

const LumosEditor: React.FC = () => {
  const [code, setCode] = useState(`let message = "Hello, Lumos Language!"

print(message)

for i = 1 to 5 {
  print("Count: " + str(i))
}
`);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState('python');

  const compileTargets = [
    'python', 'javascript', 'rust', 'go', 'java', 'cpp', 'csharp', 'php',
    'ruby', 'swift', 'kotlin', 'typescript'
  ];

  const handleExecute = async () => {
    setIsExecuting(true);
    setOutput('Executing...\n');

    try {
      const result = await api.executeLumos(code);
      
      if (result.success && result.data) {
        setOutput(result.data.output || result.data.result || 'Executed successfully');
      } else {
        setOutput(`Error: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCompile = async () => {
    setIsExecuting(true);
    setOutput(`Compiling to ${selectedTarget}...\n`);

    try {
      const result = await api.compileLumos(code, selectedTarget);
      
      if (result.success && result.data) {
        setOutput(`Compiled to ${selectedTarget}:\n\n${result.data.compiled}`);
      } else {
        setOutput(`Compilation error: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="h-full bg-slate-900 text-white flex">
      <div className="flex-1 flex flex-col">
        <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="text-purple-400" size={20} />
            <span className="font-medium">Lumos Editor</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center gap-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={16} />
              Execute
            </button>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition"
            >
              {compileTargets.map(target => (
                <option key={target} value={target}>
                  {target.charAt(0).toUpperCase() + target.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={handleCompile}
              disabled={isExecuting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Code2 size={16} />
              Compile
            </button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded flex items-center gap-2 text-sm transition">
              <Save size={16} />
              Save
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row">
          <div className="flex-1 p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-[#1a1b26] text-[#a9b1d6] font-mono text-sm p-4 rounded border border-slate-700 focus:border-purple-500 focus:outline-none resize-none"
              placeholder="Write your Lumos code here..."
              spellCheck={false}
            />
          </div>

          <div className="flex-1 p-4 border-l border-slate-700">
            <div className="h-full bg-[#1a1b26] text-[#a9b1d6] font-mono text-sm p-4 rounded border border-slate-700 overflow-auto whitespace-pre-wrap">
              {output || 'Output will appear here...'}
            </div>
          </div>
        </div>
      </div>

      <div className="w-64 bg-slate-800 border-l border-slate-700 p-4">
        <h3 className="font-medium mb-3 text-purple-400">Quick Reference</h3>
        <div className="space-y-3 text-sm">
          <div>
            <div className="text-slate-400 mb-1">Variables</div>
            <code className="text-xs bg-slate-900 p-1 rounded">let x = 10</code>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Print</div>
            <code className="text-xs bg-slate-900 p-1 rounded">print(message)</code>
          </div>
          <div>
            <div className="text-slate-400 mb-1">For Loop</div>
            <code className="text-xs bg-slate-900 p-1 rounded block whitespace-pre">
for i = 1 to 10 {'{\n  print(i)\n}'}
            </code>
          </div>
          <div>
            <div className="text-slate-400 mb-1">Function</div>
            <code className="text-xs bg-slate-900 p-1 rounded block whitespace-pre">
function add(a, b) {'{\n  return a + b\n}'}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LumosEditor;
