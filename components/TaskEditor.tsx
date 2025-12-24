import React from 'react';
import { TaskBreakdown } from '../types';
import { Trash2, GripVertical, CheckCircle, RotateCcw } from 'lucide-react';

interface TaskEditorProps {
  jobTitle: string;
  tasks: TaskBreakdown[];
  setTasks: React.Dispatch<React.SetStateAction<TaskBreakdown[]>>;
  onConfirm: () => void;
  onReset: () => void;
}

const TaskEditor: React.FC<TaskEditorProps> = ({ jobTitle, tasks, setTasks, onConfirm, onReset }) => {
  const totalPercentage = tasks.reduce((sum, t) => sum + t.time_percentage, 0);
  const isValid = Math.abs(totalPercentage - 100) <= 5; // Allow small margin of error

  const updatePercentage = (id: string, newVal: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, time_percentage: newVal } : t));
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
      <div className="p-6 md:p-8 border-b border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-slate-900">Breakdown: {jobTitle}</h2>
          <button onClick={onReset} className="text-slate-400 hover:text-brand-600 transition-colors" title="Regenerate">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
        <p className="text-slate-500">
          We used AI to identify your core tasks. Adjust the time percentages to get an accurate timeline.
        </p>
      </div>

      <div className="p-6 md:p-8 bg-slate-50/50">
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-3 flex-1 w-full">
                <GripVertical className="w-5 h-5 text-slate-300 cursor-grab" />
                <div>
                  <h3 className="font-semibold text-slate-800">{task.task_name}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-500 uppercase tracking-wider">
                    {task.skill_category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex-1 md:w-48">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={task.time_percentage}
                    onChange={(e) => updatePercentage(task.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                </div>
                <div className="w-12 text-right font-mono font-bold text-slate-700">
                  {task.time_percentage}%
                </div>
                <button 
                  onClick={() => removeTask(task.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className={`text-sm font-medium ${isValid ? 'text-green-600' : 'text-amber-600'}`}>
            Total Time: {totalPercentage}% {isValid ? <CheckCircle className="w-4 h-4 inline ml-1"/> : '(Should aim for ~100%)'}
          </div>
          <button
            onClick={onConfirm}
            className="w-full md:w-auto px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-lg hover:shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
          >
            Calculate Horizon
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditor;