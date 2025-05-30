"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, FilePlus, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileAccepted: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileAccepted }) => {
  const [error, setError] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Reset error state
    setError(null);
    
    if (rejectedFiles.length > 0) {
      setError('Please upload a valid PDF file.');
      return;
    }
    
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are supported.');
        return;
      }
      
      onFileAccepted(file);
    }
  }, [onFileAccepted]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-xl">
      <div
        {...getRootProps()}
        className={`
          relative p-8 border-2 border-dashed rounded-xl transition-all duration-300
          ${isDragActive 
            ? 'border-purple-400 bg-purple-900/20 scale-105' 
            : 'border-gray-600 bg-slate-800/40 hover:bg-slate-800/60'
          }
          backdrop-blur-md cursor-pointer group
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className={`
            p-4 rounded-full transition-all duration-300
            ${isDragActive ? 'bg-purple-600/20 text-purple-400' : 'bg-slate-700/50 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'}
          `}>
            {isDragActive ? <FilePlus size={48} /> : <FileUp size={48} />}
          </div>
          
          <div className="text-center">
            <p className="text-xl font-medium mb-2">
              {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF file'}
            </p>
            <p className="text-slate-400 mb-4">
              or click to browse files
            </p>
            <span className="px-4 py-2 bg-slate-800/80 rounded-md text-sm text-slate-300">
              Max file size: 10MB
            </span>
          </div>
        </div>
        
        {/* Glassmorphism overlay effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      </div>
      
      {error && (
        <div className="mt-4 bg-red-900/30 backdrop-blur-md text-red-200 p-3 rounded-lg flex items-center space-x-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};