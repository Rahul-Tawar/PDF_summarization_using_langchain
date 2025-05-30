"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "I've analyzed your PDF. What would you like to know about it?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const generateBotResponse = (message: string): string => {
    const responses = [
      "Based on the PDF content, I can help explain that section in more detail.",
      "The document discusses several key points related to your question.",
      "According to the PDF, there are multiple perspectives on this topic.",
      "Let me analyze that part of the document for you.",
      "I found relevant information in sections 2 and 4 that addresses this.",
      "The author makes a compelling argument about this in the conclusion.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[80%] p-4 rounded-xl
              ${message.sender === 'user' 
                ? 'bg-purple-600/30 backdrop-blur-md ml-12' 
                : 'bg-slate-800/70 backdrop-blur-md mr-12'
              }
            `}>
              <div className="flex items-center space-x-2 mb-1">
                <div className={`
                  p-1 rounded-full 
                  ${message.sender === 'user' ? 'bg-purple-500/30' : 'bg-blue-500/30'}
                `}>
                  {message.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <span className="text-xs text-white/60">
                  {message.sender === 'user' ? 'You' : 'AI Assistant'}
                </span>
                <span className="text-xs text-white/40">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-white whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-4 rounded-xl bg-slate-800/70 backdrop-blur-md mr-12">
              <div className="flex items-center space-x-2 mb-1">
                <div className="p-1 rounded-full bg-blue-500/30">
                  <Bot size={14} />
                </div>
                <span className="text-xs text-white/60">AI Assistant</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-white/10 bg-slate-900/50 backdrop-blur-md">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the PDF content..."
              className="w-full bg-slate-800/70 text-white placeholder-slate-400 p-3 pr-10 rounded-lg border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none h-12 max-h-32 overflow-y-auto"
              style={{ minHeight: '48px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className={`
                absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full
                ${input.trim() && !isLoading 
                  ? 'bg-purple-500 text-white hover:bg-purple-600' 
                  : 'bg-slate-700 text-slate-400'
                }
                transition-colors
              `}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};