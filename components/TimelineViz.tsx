import React from 'react';
import { AutomationResult } from '../types';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface TimelineVizProps {
  result: AutomationResult;
}

const TimelineViz: React.FC<TimelineVizProps> = ({ result }) => {
  const current = result.current_automation_percent;
  const target = result.target_percent;
  const isTargetReached = current >= target;

  return (
    <div className="w-full bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Projected Horizon
          </h3>
          <div className="text-3xl font-bold text-slate-900">
            {isTargetReached ? "Already Automated" : `${result.years_to_target} Years`}
          </div>
          {!isTargetReached && (
            <p className="text-slate-500 text-sm mt-1">
              Reaches <span className="font-bold text-brand-600">{result.target_percent}% automation</span> by {result.target_date}
            </p>
          )}
        </div>
        <div className="text-right hidden md:block">
          <div className="text-sm text-slate-500">Confidence</div>
          <div className="flex items-center gap-1 justify-end">
             {/* Simple visual bar for confidence */}
             {[...Array(5)].map((_, i) => (
               <div key={i} className={`w-2 h-4 rounded-sm ${i < 4 ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
             ))}
             <span className="ml-2 font-bold text-slate-700">78%</span>
          </div>
        </div>
      </div>

      {/* Timeline Graphic */}
      <div className="relative pt-8 pb-12 select-none">
        {/* Track */}
        <div className="h-4 bg-slate-100 rounded-full w-full overflow-hidden relative">
          {/* Current Progress */}
          <div 
            className="h-full bg-slate-800 absolute top-0 left-0 transition-all duration-1000 ease-out"
            style={{ width: `${current}%` }}
          ></div>
          {/* Projected Growth */}
          <div 
            className="h-full bg-brand-500 opacity-30 absolute top-0 transition-all duration-1000 ease-out"
            style={{ left: `${current}%`, width: `${Math.max(0, target - current)}%` }}
          ></div>
          {/* Ceiling Texture */}
          <div 
            className="h-full absolute top-0 right-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhZWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-20"
            style={{ width: '5%', right: 0 }}
          ></div>
        </div>

        {/* Markers */}
        <div className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center" style={{ left: `${current}%` }}>
          <div className="w-0.5 h-8 bg-slate-800 mb-2"></div>
          <div className="font-bold text-slate-900 text-sm">Today</div>
          <div className="text-xs text-slate-500">{current}%</div>
        </div>

        {!isTargetReached && (
          <div className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center" style={{ left: `${target}%` }}>
            <div className="w-0.5 h-8 bg-brand-500 mb-2 border-l border-dashed border-brand-500 bg-transparent"></div>
            <div className="font-bold text-brand-600 text-sm">{result.target_date}</div>
            <div className="text-xs text-brand-500">{target}%</div>
          </div>
        )}
        
        <div className="absolute top-0 right-0 transform translate-x-1/2 flex flex-col items-center opacity-50">
           <div className="w-0.5 h-8 bg-slate-400 mb-2"></div>
           <div className="font-bold text-slate-400 text-sm">Ceiling</div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
         {result.highest_risk_task && (
           <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-start gap-3">
             <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
             <div>
               <div className="text-xs font-bold text-red-500 uppercase">Highest Risk</div>
               <div className="font-semibold text-slate-800">{result.highest_risk_task.task_name}</div>
               <div className="text-sm text-red-600 mt-1">
                 {result.highest_risk_task.months_to_target === Infinity ? 'Uncertain' : `${Math.round(result.highest_risk_task.months_to_target || 0)} months to automation`}
               </div>
             </div>
           </div>
         )}
         
         {result.most_durable_task && (
           <div className="bg-green-50 border border-green-100 p-4 rounded-lg flex items-start gap-3">
             <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
             <div>
               <div className="text-xs font-bold text-green-500 uppercase">Most Durable</div>
               <div className="font-semibold text-slate-800">{result.most_durable_task.task_name}</div>
               <div className="text-sm text-green-600 mt-1">
                 {result.most_durable_task.months_to_target === Infinity ? 'Safe for foreseeable future' : `${Math.round((result.most_durable_task.months_to_target || 0)/12)} years runway`}
               </div>
             </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default TimelineViz;