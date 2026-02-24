import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon } from './icons';

interface AdvisorViewProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isReplying: boolean;
}

const AdvisorView: React.FC<AdvisorViewProps> = ({ messages, onSendMessage, isReplying }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isReplying) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };
  
  // Simple markdown-like formatter for paragraphs
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-2 last:mb-0">
        {paragraph}
      </p>
    ));
  };


  return (
    <div className="flex flex-col h-full">
        <div className="flex-grow space-y-4 pr-2">
            {messages.map((message, index) => (
            <div key={index} className={`flex items-end gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">AI</div>}
                <div className={`max-w-md md:max-w-lg rounded-lg px-4 py-2 text-white ${message.role === 'user' ? 'bg-sky-700' : 'bg-slate-700'}`}>
                   {formatContent(message.content)}
                </div>
            </div>
            ))}
            {isReplying && (
                <div className="flex items-end gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">AI</div>
                    <div className="max-w-md rounded-lg px-4 py-3 bg-slate-700">
                        <div className="flex items-center justify-center space-x-1">
                           <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                           <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                           <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      <div className="mt-4 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={isReplying}
            className="flex-grow bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white disabled:bg-slate-800"
          />
          <button
            type="submit"
            disabled={isReplying || !inputValue.trim()}
            className="p-2 bg-sky-600 rounded-md text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdvisorView;
