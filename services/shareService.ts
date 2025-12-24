import { TaskBreakdown } from '../types';

export function generateShareUrl(jobTitle: string, tasks: TaskBreakdown[]): string {
  // Minify data for URL
  const data = {
    j: jobTitle,
    t: tasks.map(t => ({
      n: t.task_name,
      p: t.time_percentage,
      s: t.skill_category,
      c: t.ai_capability_mapping
    }))
  };
  
  try {
    const json = JSON.stringify(data);
    // encodeURIComponent handles UTF-8 characters properly before base64 encoding
    const encoded = btoa(encodeURIComponent(json)); 
    return `${window.location.origin}${window.location.pathname}?d=${encoded}`;
  } catch (e) {
    console.error("Failed to generate share URL", e);
    return window.location.href;
  }
}

export function parseShareUrl(): { jobTitle: string, tasks: TaskBreakdown[] } | null {
  const params = new URLSearchParams(window.location.search);
  const data = params.get('d');
  if (!data) return null;

  try {
    const json = decodeURIComponent(atob(data));
    const parsed = JSON.parse(json);
    
    // Basic validation
    if (!parsed.j || !Array.isArray(parsed.t)) return null;

    const tasks: TaskBreakdown[] = parsed.t.map((t: any, i: number) => ({
      id: `shared-${i}`,
      task_name: t.n,
      time_percentage: t.p,
      skill_category: t.s,
      ai_capability_mapping: t.c
    }));

    return { jobTitle: parsed.j, tasks };
  } catch (e) {
    console.error("Failed to parse share URL", e);
    return null;
  }
}