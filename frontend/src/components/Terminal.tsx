'use client';

import React, { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api';

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>([
    'LumOS Terminal v2.1.0',
    'Type "help" for available commands',
    '',
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = async (command: string) => {
    if (!command.trim()) return;

    setHistory(prev => [...prev, `$ ${command}`]);
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    const cmd = command.trim().toLowerCase();

    if (cmd === 'help') {
      setHistory(prev => [...prev,
        'Available commands:',
        '  help       - Show this help message',
        '  clear      - Clear terminal',
        '  echo <msg> - Echo message',
        '  date       - Show current date/time',
        '  lumos <code> - Execute Lumos code',
        '  status     - Show system status',
        '',
      ]);
      return;
    }

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    if (cmd === 'date') {
      setHistory(prev => [...prev, new Date().toString(), '']);
      return;
    }

    if (cmd.startsWith('echo ')) {
      const message = command.substring(5);
      setHistory(prev => [...prev, message, '']);
      return;
    }

    if (cmd.startsWith('lumos ')) {
      const code = command.substring(6);
      try {
        const result = await api.executeLumos(code);
        if (result.success && result.data) {
          setHistory(prev => [...prev, result.data.output || 'Executed successfully', '']);
        } else {
          setHistory(prev => [...prev, `Error: ${result.error}`, '']);
        }
      } catch (error) {
        setHistory(prev => [...prev, `Error: ${error}`, '']);
      }
      return;
    }

    if (cmd === 'status') {
      try {
        const status = await api.getStatus();
        setHistory(prev => [...prev,
          `OS: ${status.os}`,
          `Version: ${status.version}`,
          `Hostname: ${status.hostname}`,
          `Languages: ${status.languages_loaded.join(', ')}`,
          '',
        ]);
      } catch (error) {
        setHistory(prev => [...prev, `Error: ${error}`, '']);
      }
      return;
    }

    try {
      const result = await api.executeCode('bash', command);
      if (result.success && result.data) {
        const output = result.data.output || result.data.stdout || 'Command executed';
        setHistory(prev => [...prev, output, '']);
      } else {
        setHistory(prev => [...prev, `Error: ${result.error}`, '']);
      }
    } catch (error) {
      setHistory(prev => [...prev, `Command not found: ${command}`, '']);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="h-full bg-[#1a1b26] text-[#a9b1d6] font-mono text-sm p-4 flex flex-col">
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto mb-2 whitespace-pre-wrap break-words"
      >
        {history.map((line, i) => (
          <div key={i} className={line.startsWith('$') ? 'text-green-400' : ''}>
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-green-400">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-[#a9b1d6]"
          autoFocus
        />
      </form>
    </div>
  );
};

export default Terminal;
