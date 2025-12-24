import { CapabilityProfile, CapabilityKey } from './types';

export const CAPABILITY_MATRIX: Record<CapabilityKey, CapabilityProfile> = {
  "data_analysis": {
    current_level: 0.85,
    benchmark_proxy: "gdpval_data",
    growth_rate: 0.15,
    chronicle_claims: ["GPT-5.2 beats analysts on 70% of tasks"],
    saturation_ceiling: 0.98
  },
  "code_generation": {
    current_level: 0.72,
    benchmark_proxy: "swe_bench_verified",
    growth_rate: 0.20,
    chronicle_claims: ["Claude Opus 4.5: 80.9% SWE-Bench"],
    saturation_ceiling: 0.95
  },
  "creative_writing": {
    current_level: 0.45,
    benchmark_proxy: "creative_human_eval",
    growth_rate: 0.10,
    chronicle_claims: ["AI-generated country song topped Billboard"],
    saturation_ceiling: 0.75
  },
  "strategic_reasoning": {
    current_level: 0.30,
    benchmark_proxy: "metr_autonomy",
    growth_rate: 0.25,
    chronicle_claims: ["Autonomous time horizon doubling monthly"],
    saturation_ceiling: 0.85
  },
  "interpersonal": {
    current_level: 0.15,
    benchmark_proxy: null,
    growth_rate: 0.05,
    chronicle_claims: ["1 in 5 teens in AI relationships"],
    saturation_ceiling: 0.50
  },
  "physical_manipulation": {
    current_level: 0.25,
    benchmark_proxy: "humanoid_deployment",
    growth_rate: 0.12,
    chronicle_claims: ["Figure robots built 30,000 BMWs"],
    saturation_ceiling: 0.90
  },
  "document_processing": {
    current_level: 0.90,
    benchmark_proxy: "document_understanding",
    growth_rate: 0.08,
    chronicle_claims: ["Gemini 3 Pro: 100% video needle-in-haystack"],
    saturation_ceiling: 0.99
  },
  "financial_modeling": {
    current_level: 0.70,
    benchmark_proxy: "math_reasoning",
    growth_rate: 0.18,
    chronicle_claims: ["Quants earning $2M/year with AI arbitrage"],
    saturation_ceiling: 0.95
  },
  "legal_analysis": {
    current_level: 0.65,
    benchmark_proxy: "legal_bench",
    growth_rate: 0.15,
    chronicle_claims: ["Harvey AI: $8B valuation, half of Am Law 100"],
    saturation_ceiling: 0.90
  },
  "medical_diagnosis": {
    current_level: 0.75,
    benchmark_proxy: "medical_benchmarks",
    growth_rate: 0.12,
    chronicle_claims: ["Gemini 3 Pro outperformed radiology residents"],
    saturation_ceiling: 0.92
  }
};

export const COMMON_JOBS = [
  "Software Engineer",
  "Financial Analyst",
  "Marketing Manager",
  "Data Scientist",
  "Graphic Designer",
  "Content Writer",
  "Project Manager",
  "HR Specialist",
  "Customer Support Agent",
  "Legal Associate"
];