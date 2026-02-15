'use client';

import React, { useState } from 'react';
import { Folder, File, Upload, Download, Trash2, Edit, Plus } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: Date;
  content?: string;
}

const FileExplorer: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'Documents', type: 'folder', modified: new Date() },
    { id: '2', name: 'Projects', type: 'folder', modified: new Date() },
    { id: '3', name: 'hello.lumos', type: 'file', size: 256, modified: new Date(), content: 'print("Hello World")' },
    { id: '4', name: 'script.py', type: 'file', size: 1024, modified: new Date() },
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState('/');

  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file.id);
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
    if (selectedFile === id) {
      setSelectedFile(null);
    }
  };

  const handleNewFile = () => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: 'untitled.txt',
      type: 'file',
      size: 0,
      modified: new Date(),
      content: '',
    };
    setFiles([...files, newFile]);
  };

  const handleNewFolder = () => {
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: 'New Folder',
      type: 'folder',
      modified: new Date(),
    };
    setFiles([...files, newFolder]);
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-full bg-slate-900 text-white flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-slate-400">Path: {currentPath}</div>
          <div className="flex gap-2">
            <button
              onClick={handleNewFile}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm flex items-center gap-2 transition"
            >
              <Plus size={16} />
              New File
            </button>
            <button
              onClick={handleNewFolder}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm flex items-center gap-2 transition"
            >
              <Plus size={16} />
              New Folder
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm flex items-center gap-2 transition">
            <Upload size={16} />
            Upload
          </button>
          <button
            disabled={!selectedFile}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Download
          </button>
          <button
            disabled={!selectedFile}
            onClick={() => selectedFile && handleDelete(selectedFile)}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-slate-800 sticky top-0">
            <tr className="text-left text-sm text-slate-400">
              <th className="p-3">Name</th>
              <th className="p-3">Size</th>
              <th className="p-3">Modified</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => (
              <tr
                key={file.id}
                className={`border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer transition ${
                  selectedFile === file.id ? 'bg-blue-900/30' : ''
                }`}
                onClick={() => handleFileClick(file)}
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {file.type === 'folder' ? (
                      <Folder className="text-yellow-400" size={18} />
                    ) : (
                      <File className="text-blue-400" size={18} />
                    )}
                    <span className="text-sm">{file.name}</span>
                  </div>
                </td>
                <td className="p-3 text-sm text-slate-400">{formatSize(file.size)}</td>
                <td className="p-3 text-sm text-slate-400">{formatDate(file.modified)}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-slate-700 rounded transition">
                      <Edit size={14} className="text-slate-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                      className="p-1.5 hover:bg-red-900/30 rounded transition"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-slate-700 text-sm text-slate-400">
        {files.length} items
      </div>
    </div>
  );
};

export default FileExplorer;
