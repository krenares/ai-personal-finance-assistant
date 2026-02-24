import React, { useState, useCallback } from 'react';
import { UserInput, FullReport, ChatMessage } from './types';
import { generateFinancialReport, getAdvisorResponse } from './services/geminiService';
import InputForm from './components/InputForm';
import ReportDisplay from './components/ReportDisplay';
import { WalletIcon } from './components/icons';

const App: React.FC = () => {
  const [report, setReport] = useState<FullReport | null>(null);
  const [currentUserInput, setCurrentUserInput] = useState<UserInput | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = useCallback(async (userInput: UserInput) => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    setChatHistory([]);
    setCurrentUserInput(userInput);

    try {
      const result = await generateFinancialReport(userInput);
      setReport(result);
      setChatHistory([{ role: 'assistant', content: result.advisor_mode }]);
    } catch (e) {
      console.error(e);
      setError('Failed to generate report. The model may have returned an invalid format. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim() || !currentUserInput || !report) return;

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(newHistory);
    setIsReplying(true);

    try {
      const assistantResponse = await getAdvisorResponse(
        currentUserInput,
        report.calculator_mode,
        newHistory,
        message
      );
      setChatHistory(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
    } catch (e) {
      console.error(e);
      const errorMessage = { role: 'assistant' as const, content: "Sorry, I encountered an error trying to respond. Please try again." };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsReplying(false);
    }

  }, [chatHistory, currentUserInput, report]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-4">
            <WalletIcon className="w-12 h-12 text-sky-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text">
              AI Personal Finance Assistant
            </h1>
          </div>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Input your financial details to receive a comprehensive analysis, and chat with an AI advisor to understand your report better.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <InputForm onSubmit={handleGenerateReport} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-8">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full bg-slate-800/50 rounded-lg p-8">
                <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-semibold text-slate-300">Generating your financial analysis...</p>
                <p className="text-slate-400">This may take a moment.</p>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-full bg-red-900/20 border border-red-500 text-red-300 rounded-lg p-8">
                <p>{error}</p>
              </div>
            )}
            {report && !isLoading && (
              <ReportDisplay 
                report={report} 
                chatHistory={chatHistory}
                onSendMessage={handleSendMessage}
                isReplying={isReplying}
              />
            )}
            {!report && !isLoading && !error && (
                <div className="flex flex-col items-center justify-center h-full bg-slate-800/50 rounded-lg p-8 border-2 border-dashed border-slate-700">
                    <p className="text-xl font-semibold text-slate-400">Your Report Will Appear Here</p>
                    <p className="text-slate-500 mt-2">Fill out the form and click "Generate Report" to start.</p>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
