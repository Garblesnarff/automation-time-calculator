import React from 'react';
import { AutomationResult, TaskBreakdown } from '../types';
import TimelineViz from './TimelineViz';
import { Lock, ArrowRight, Share2, Download } from 'lucide-react';
import { CAPABILITY_MATRIX } from '../constants';

interface ResultsViewProps {
  result: AutomationResult;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">{result.job_title}</h2>
        <p className="text-slate-500">Automation Horizon Report</p>
      </div>

      <TimelineViz result={result} />

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-900">Task-by-Task Analysis</h3>
          <span className="text-xs font-medium px-2 py-1 bg-brand-50 text-brand-700 rounded-full">
            Powered by Chronicle Data
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {result.task_breakdown.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
        
        {/* Paywall Teaser */}
        <div className="bg-slate-50 p-6 md:p-8 text-center border-t border-slate-200">
          <div className="max-w-md mx-auto">
             <div className="flex justify-center mb-4">
               <div className="h-12 w-12 bg-slate-900 rounded-full flex items-center justify-center text-white">
                 <Lock className="w-5 h-5" />
               </div>
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Get the Detailed Career Strategy</h3>
             <p className="text-slate-500 mb-6">
               Unlock the full 15-page PDF report with detailed pivot recommendations, skill gap analysis, and specific upskilling paths for {result.job_title}.
             </p>
             <button className="w-full bg-slate-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
               Unlock Full Report <span className="text-slate-400 line-through font-normal text-sm">$29</span> $19
             </button>
             <p className="text-xs text-slate-400 mt-4">
               30-day money back guarantee. Trusted by 10k+ professionals.
             </p>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-center gap-4 z-50">
        <button 
           onClick={onReset}
           className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full transition-colors"
        >
          Check Another Job
        </button>
        <button className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-full flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all">
          <Share2 className="w-4 h-4" /> Share Result
        </button>
      </div>
    </div>
  );
};

const TaskRow: React.FC<{ task: TaskBreakdown }> = ({ task }) => {
  const capability = CAPABILITY_MATRIX[task.ai_capability_mapping];
  const progress = task.current_automation_level! * 100;
  
  return (
    <div className="p-6 hover:bg-slate-50 transition-colors group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
        <div>
          <h4 className="font-semibold text-slate-900">{task.task_name}</h4>
          <p className="text-sm text-slate-500 mt-1">
             {task.time_percentage}% of workload • {task.skill_category}
          </p>
        </div>
        <div className="text-right">
           <div className={`font-mono font-bold ${task.months_to_target! < 24 ? 'text-red-600' : 'text-slate-600'}`}>
             {task.months_to_target === Infinity ? 'Durable' : `${Math.round(task.months_to_target!)} months`}
           </div>
           <div className="text-xs text-slate-400">to automation threshold</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
        <div 
          className={`absolute top-0 left-0 h-full ${task.months_to_target! < 24 ? 'bg-red-500' : 'bg-brand-500'}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Evidence */}
      {capability.chronicle_claims[0] && (
        <div className="flex items-start gap-2 text-xs text-slate-500 bg-white border border-slate-100 p-2 rounded">
           <span className="font-bold text-brand-600 shrink-0">EVIDENCE:</span> 
           {capability.chronicle_claims[0]}
        </div>
      )}
    </div>
  );
};

export default ResultsView;