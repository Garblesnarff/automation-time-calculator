import React, { useState } from 'react';
import { COMMON_JOBS } from '../constants';
import { Search } from 'lucide-react';

interface JobInputProps {
  onSubmit: (job: string) => void;
  isLoading: boolean;
}

const JobInput: React.FC<JobInputProps> = ({ onSubmit, isLoading }) => {
  const [value, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSubmit(value);
  };

  const filteredJobs = COMMON_JOBS.filter(j => 
    j.toLowerCase().includes(value.toLowerCase()) && j.toLowerCase() !== value.toLowerCase()
  );

  return (
    <div className="w-full max-w-2xl mx-auto text-center animate-fade-in-up">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
        When will AI <span className="text-brand-600">automate</span> your job?
      </h1>
      <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto">
        Based on real-time acceleration data and benchmark trajectories. 
        See your personalized horizon.
      </p>

      <div className="relative max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative flex items-center bg-white rounded-lg shadow-xl">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Enter your job title (e.g. Senior Financial Analyst)"
                className="w-full py-4 pl-12 pr-4 text-lg bg-transparent border-none rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none text-slate-900 placeholder-slate-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!value.trim() || isLoading}
                className="absolute right-2 px-6 py-2 bg-brand-600 text-white font-medium rounded-md hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>
        </form>

        {showSuggestions && value && filteredJobs.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden z-20">
            {filteredJobs.slice(0, 5).map(job => (
              <button
                key={job}
                onClick={() => {
                  setValue(job);
                  setShowSuggestions(false);
                  onSubmit(job);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700 transition-colors"
              >
                {job}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 text-sm text-slate-400 flex justify-center gap-6">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> Live Data
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> Gemini Powered
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span> 50k+ Analyzed
        </span>
      </div>
    </div>
  );
};

export default JobInput;