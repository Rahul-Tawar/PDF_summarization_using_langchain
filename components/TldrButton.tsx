import React from 'react';
import { FileDigit } from 'lucide-react';

interface TldrButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const TldrButton: React.FC<TldrButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-10">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          group relative px-6 py-3 rounded-full flex items-center space-x-2
          ${disabled 
            ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105'
          }
          transition-all duration-300 backdrop-blur-md
        `}
      >
        <FileDigit size={20} />
        <span className="font-bold">TL;DR</span>
        
        {/* Hover effect */}
        {!disabled && (
          <>
            <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600/50 to-pink-600/50 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 -z-10"></span>
          </>
        )}
      </button>
      
      {/* Tooltip */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 text-xs text-white/60 bg-black/40 px-2 py-1 rounded backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Generate a concise summary
      </div>
    </div>
  );
};