import React, { useState, useEffect } from 'react';
import { AppStep, TaskBreakdown, AutomationResult } from './types';
import JobInput from './components/JobInput';
import TaskEditor from './components/TaskEditor';
import ResultsView from './components/ResultsView';
import { decomposeJobToTasks } from './services/geminiService';
import { calculateAutomationTimeline } from './services/calculatorService';
import { parseShareUrl } from './services/shareService';
import { Activity } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<AppStep>('INPUT');
  const [jobTitle, setJobTitle] = useState('');
  const [tasks, setTasks] = useState<TaskBreakdown[]>([]);
  const [result, setResult] = useState<AutomationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for shared URL on mount
  useEffect(() => {
    const sharedData = parseShareUrl();
    if (sharedData) {
      setJobTitle(sharedData.jobTitle);
      setTasks(sharedData.tasks);
      
      // Immediately calculate results for shared view
      const res = calculateAutomationTimeline(sharedData.jobTitle, sharedData.tasks);
      setResult(res);
      setStep('RESULTS');
    }
  }, []);

  const handleJobSubmit = async (title: string) => {
    setIsLoading(true);
    setJobTitle(title);
    try {
      const generatedTasks = await decomposeJobToTasks(title);
      setTasks(generatedTasks);
      setStep('TASK_REVIEW');
    } catch (error) {
      console.error("Failed to analyze job", error);
      alert("Failed to analyze job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculate = () => {
    // Basic validation
    const total = tasks.reduce((sum, t) => sum + t.time_percentage, 0);
    if (total === 0) {
      alert("Please assign percentages to tasks.");
      return;
    }

    const res = calculateAutomationTimeline(jobTitle, tasks);
    setResult(res);
    setStep('RESULTS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    // Clear URL params without refreshing
    window.history.pushState({}, '', window.location.pathname);
    
    setStep('INPUT');
    setJobTitle('');
    setTasks([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900 cursor-pointer" onClick={handleReset}>
            <div className="bg-slate-900 text-white p-1 rounded">
               <Activity size={18} />
            </div>
            Horizon
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Automation Timeline Calculator
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
        {step === 'INPUT' && (
          <JobInput onSubmit={handleJobSubmit} isLoading={isLoading} />
        )}

        {step === 'TASK_REVIEW' && (
          <div className="w-full animate-fade-in-up">
            <TaskEditor 
              jobTitle={jobTitle} 
              tasks={tasks} 
              setTasks={setTasks} 
              onConfirm={handleCalculate}
              onReset={handleReset}
            />
          </div>
        )}

        {step === 'RESULTS' && result && (
           <ResultsView 
             result={result} 
             onReset={handleReset} 
             tasks={tasks}
           />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 mt-auto bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p className="mb-2">© 2025 Horizon Analytics. All rights reserved.</p>
          <p className="max-w-2xl mx-auto">
            Disclaimer: These projections are estimates based on AI capability trajectories and should not be used for employment decisions. Actual automation timelines depend on many factors including regulatory environment and economic conditions.
          </p>
        </div>
      </footer>
    </div>
  );
}