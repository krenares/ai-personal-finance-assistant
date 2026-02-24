import React, { useState } from 'react';
import type { FullReport, ChatMessage } from '../types';
import CalculatorView from './CalculatorView';
import AdvisorView from './AdvisorView';

interface ReportDisplayProps {
  report: FullReport;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isReplying: boolean;
}

type ViewMode = 'calculator' | 'advisor';

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, chatHistory, onSendMessage, isReplying }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('calculator');

  return (
    <div className="bg-slate-800/50 rounded-lg shadow-lg border border-slate-700 animate-fade-in flex flex-col h-full max-h-[80vh]">
      <div className="p-4 border-b border-slate-700 flex-shrink-0">
        <div className="flex space-x-2 bg-slate-900 p-1 rounded-lg max-w-xs mx-auto">
          <button
            onClick={() => setViewMode('calculator')}
            className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
              viewMode === 'calculator'
                ? 'bg-sky-600 text-white'
                : 'bg-transparent text-slate-300 hover:bg-slate-700'
            }`}
          >
            Dashboard Report
          </button>
          <button
            onClick={() => setViewMode('advisor')}
            className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
              viewMode === 'advisor'
                ? 'bg-sky-600 text-white'
                : 'bg-transparent text-slate-300 hover:bg-slate-700'
            }`}
          >
            AI Advisor
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4 md:p-6">
        {viewMode === 'calculator' && <CalculatorView data={report.calculator_mode} />}
        {viewMode === 'advisor' && (
            <AdvisorView 
                messages={chatHistory}
                onSendMessage={onSendMessage}
                isReplying={isReplying}
            />
        )}
      </div>
    </div>
  );
};

export default ReportDisplay;
