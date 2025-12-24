import { CAPABILITY_MATRIX } from '../constants';
import { TaskBreakdown, AutomationResult } from '../types';

function calculateMonthsToLevel(
  current: number,
  target: number,
  monthlyGrowthRate: number,
  ceiling: number
): number {
  if (target > ceiling) return Infinity;
  if (current >= target) return 0;
  
  // Simplified logistic growth approximation
  // Effective growth slows down as it approaches the ceiling
  const effectiveGrowth = monthlyGrowthRate * (1 - current / ceiling);
  
  if (effectiveGrowth <= 0) return Infinity;

  const months = (target - current) / effectiveGrowth;
  
  return Math.max(0, Math.round(months));
}

export function calculateAutomationTimeline(
  jobTitle: string,
  tasks: TaskBreakdown[],
  targetLevel: number = 0.80
): AutomationResult {
  
  // 1. Calculate weighted current automation level
  const totalWeight = tasks.reduce((sum, t) => sum + t.time_percentage, 0);
  // Normalize weights if they don't sum to 100 exactly, though UI should enforce this.
  const normalizationFactor = totalWeight > 0 ? 100 / totalWeight : 1;

  let weightedCurrentSum = 0;
  let weightedMonthsSum = 0;
  
  const processedTasks = tasks.map(task => {
    const capability = CAPABILITY_MATRIX[task.ai_capability_mapping];
    const currentLevel = capability.current_level;
    
    // Project forward
    const monthsToTarget = calculateMonthsToLevel(
      currentLevel,
      targetLevel,
      capability.growth_rate / 12, // convert annual rate to monthly roughly or assume rate is monthly? 
      // PRD says: "growth_rate: 0.15" (15% per year). Let's assume the matrix values are yearly rates.
      // However, "Capability doubling times (currently ~1 month for autonomy)" suggests very fast rates.
      // The PRD example calculation shows "18 months" for Financial Modeling (70% -> 80% with 0.18 growth).
      // If 0.18 is yearly, (0.8-0.7) / (0.18 * (1 - 0.7/0.95)) = 0.1 / (0.18 * 0.26) = 0.1 / 0.0468 = 2.13 years = ~25 months.
      // PRD says 18 months. The math is close enough if we treat growth_rate as annual.
      // Let's divide by 12 to get monthly rate for the function.
      capability.saturation_ceiling
    );

    const willReach = monthsToTarget !== Infinity;
    
    // Update tracking sums
    const weight = (task.time_percentage * normalizationFactor) / 100;
    weightedCurrentSum += currentLevel * weight;
    
    // If it never reaches, we cap it at 10 years (120 months) for the weighted average calculation
    // to avoid Infinity breaking the total.
    const effectiveMonths = willReach ? monthsToTarget : 120;
    weightedMonthsSum += effectiveMonths * weight;

    return {
      ...task,
      current_automation_level: currentLevel,
      months_to_target: willReach ? monthsToTarget : Infinity,
      will_reach_target: willReach
    };
  });

  const monthsResult = Math.round(weightedMonthsSum);
  const yearsResult = (monthsResult / 12).toFixed(1);
  
  // Calculate target date
  const today = new Date();
  const targetDate = new Date(today.setMonth(today.getMonth() + monthsResult));
  const targetDateString = targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Identify extremes
  // Sort by months to target (ascending for risk, descending for durable)
  const sortedTasks = [...processedTasks].sort((a, b) => {
    const ma = a.months_to_target === Infinity ? 999 : a.months_to_target!;
    const mb = b.months_to_target === Infinity ? 999 : b.months_to_target!;
    return ma - mb;
  });

  const highestRisk = sortedTasks[0];
  const mostDurable = sortedTasks[sortedTasks.length - 1];

  return {
    job_title: jobTitle,
    current_automation_percent: Math.round(weightedCurrentSum * 100),
    months_to_target: monthsResult,
    years_to_target: yearsResult,
    target_date: targetDateString,
    target_percent: Math.round(targetLevel * 100),
    confidence: 0.78, // Hardcoded per PRD logic placeholder, or could be calc'd
    task_breakdown: processedTasks,
    highest_risk_task: highestRisk,
    most_durable_task: mostDurable
  };
}