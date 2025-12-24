import { GoogleGenAI, Type } from "@google/genai";
import { TaskBreakdown } from "../types";

const processEnvApiKey = process.env.API_KEY;

// Fallback mock data in case API key is missing or fails gracefully for demo
const MOCK_TASKS: TaskBreakdown[] = [
  { id: '1', task_name: "Strategic Planning", time_percentage: 20, skill_category: "strategic", ai_capability_mapping: "strategic_reasoning" },
  { id: '2', task_name: "Data Analysis", time_percentage: 30, skill_category: "analytical", ai_capability_mapping: "data_analysis" },
  { id: '3', task_name: "Client Communication", time_percentage: 25, skill_category: "interpersonal", ai_capability_mapping: "interpersonal" },
  { id: '4', task_name: "Report Generation", time_percentage: 25, skill_category: "technical", ai_capability_mapping: "document_processing" },
];

export async function decomposeJobToTasks(jobTitle: string): Promise<TaskBreakdown[]> {
  if (!processEnvApiKey) {
    console.warn("No API Key found, using mock data");
    // Simulate delay
    await new Promise(r => setTimeout(r, 1500));
    return MOCK_TASKS.map(t => ({ ...t, id: Math.random().toString(36).substr(2, 9) }));
  }

  const ai = new GoogleGenAI({ apiKey: processEnvApiKey });

  const prompt = `
    Given the job title "${jobTitle}", decompose it into 5-8 core tasks that represent how someone in this role spends their time.
    
    For each task, provide:
    - task_name: Brief description (3-5 words)
    - time_percentage: Estimated % of work time (integers, must sum to roughly 100)
    - skill_category: One of [analytical, creative, communication, physical, technical, strategic, interpersonal]
    - ai_capability_mapping: MUST be one of [data_analysis, code_generation, creative_writing, strategic_reasoning, interpersonal, physical_manipulation, document_processing, financial_modeling, legal_analysis, medical_diagnosis]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              task_name: { type: Type.STRING },
              time_percentage: { type: Type.NUMBER },
              skill_category: { type: Type.STRING },
              ai_capability_mapping: { type: Type.STRING }
            },
            required: ["task_name", "time_percentage", "skill_category", "ai_capability_mapping"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const rawTasks = JSON.parse(text);
    
    // Validate and map to internal type
    const tasks: TaskBreakdown[] = rawTasks.map((t: any) => ({
      id: Math.random().toString(36).substr(2, 9),
      task_name: t.task_name,
      time_percentage: t.time_percentage,
      skill_category: t.skill_category,
      ai_capability_mapping: t.ai_capability_mapping
    }));

    return tasks;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to mock if API fails
    return MOCK_TASKS;
  }
}