"use client";

import React, { useState, useRef } from 'react';
import { FileUploader } from '../components/FileUploader';
import { ChatInterface } from '../components/ChatInterface';
import { TldrButton } from '../components/TldrButton';
import { LoadingIndicator } from '../components/LoadingIndicator';

type AppState = 'upload' | 'chat';

const HomePage: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  
  const handleFileAccepted = (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setAppState('chat');
    }, 2000);
  };
  
  const handleReset = () => {
    setAppState('upload');
    setFileName('');
  };
  
  const handleGenerateSummary = () => {
    setIsProcessing(true);
    
    // Simulate summary generation
    setTimeout(() => {
      setIsProcessing(false);
      // In a real app, this would trigger the summary generation
    }, 1500);
  };
  
  return (
    <div className="relative w-full max-w-4xl mx-auto h-full flex flex-col">
        {appState === 'upload' && (
          <div className="flex-1 flex items-center justify-center p-4">
            <FileUploader onFileAccepted={handleFileAccepted} />
          </div>
        )}
        
        {appState === 'chat' && (
          <>
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <div className="bg-slate-800/70 backdrop-blur-lg px-4 py-2 rounded-lg">
                <span className="text-white font-medium">{fileName}</span>
              </div>
              <button 
                onClick={handleReset}
                className="bg-slate-800/70 backdrop-blur-lg text-white px-4 py-2 rounded-lg transition-all hover:bg-slate-700/70"
              >
                Upload New PDF
              </button>
            </div>
            <div className="flex-1 mt-16">
              <ChatInterface />
            </div>
          </>
        )}
        
        {isProcessing && <LoadingIndicator />}
        
        {appState === 'chat' && (
          <TldrButton onClick={handleGenerateSummary} disabled={isProcessing} />
        )}
      </div>

  );
};

export default HomePage;