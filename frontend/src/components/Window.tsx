'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize, Maximize2 } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isMinimized: boolean;
  zIndex: number;
  width?: number;
  height?: number;
  position: { x: number; y: number };
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
}

const Window: React.FC<WindowProps> = ({
  id,
  title,
  children,
  isMinimized,
  zIndex,
  width = 800,
  height = 600,
  position,
  onClose,
  onMinimize,
  onFocus,
}) => {
  const [pos, setPos] = useState(position);
  const [size, setSize] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.window-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - pos.x,
        y: e.clientY - pos.y,
      });
      onFocus();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPos({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className="absolute bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-lg shadow-2xl overflow-hidden"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
      }}
      onMouseDown={() => onFocus()}
    >
      <div
        className="window-header flex items-center justify-between px-4 py-3 bg-slate-800/90 border-b border-slate-700 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <h3 className="text-white font-medium flex-1">{title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onMinimize}
            className="w-8 h-8 rounded-md hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <Minimize size={16} />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="h-[calc(100%-52px)] overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Window;
