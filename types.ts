export type SkillCategory = 
  | "analytical" 
  | "creative" 
  | "communication" 
  | "physical" 
  | "technical" 
  | "strategic" 
  | "interpersonal";

export type CapabilityKey = 
  | "data_analysis"
  | "code_generation"
  | "creative_writing"
  | "strategic_reasoning"
  | "interpersonal"
  | "physical_manipulation"
  | "document_processing"
  | "financial_modeling"
  | "legal_analysis"
  | "medical_diagnosis";

export interface TaskBreakdown {
  id: string;
  task_name: string;
  time_percentage: number;
  skill_category: SkillCategory;
  ai_capability_mapping: CapabilityKey;
  // Fields calculated later
  current_automation_level?: number; 
  months_to_target?: number;
  will_reach_target?: boolean;
}

export interface CapabilityProfile {
  current_level: number;
  benchmark_proxy: string | null;
  growth_rate: number;
  saturation_ceiling: number;
  chronicle_claims: string[];
}

export interface AutomationResult {
  job_title: string;
  current_automation_percent: number;
  months_to_target: number;
  years_to_target: string;
  target_date: string;
  target_percent: number;
  confidence: number;
  task_breakdown: TaskBreakdown[];
  highest_risk_task: TaskBreakdown | null;
  most_durable_task: TaskBreakdown | null;
}

export type AppStep = 'INPUT' | 'ANALYZING' | 'TASK_REVIEW' | 'RESULTS';