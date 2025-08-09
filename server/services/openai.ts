import llm, { ChatMessage } from './llm';
import { searchRelevantTopics } from './rag';

export interface TutorResponse {
  message: string;
  suggestions?: string[];
  resources?: Array<{ title: string; url: string; type: string }>;
  sources?: Array<{ topicId: string; topicTitle: string; lessonId?: string; lessonTitle?: string; snippet?: string }>;
}

/**
 * Original route helpers keep signature generateTutorResponse(message, options)
 * message: string
 * options: { userId?, previousMessages? }
 */
export async function generateTutorResponse(message: string, options?: any): Promise<TutorResponse> {
  try {
    // First, perform a lightweight semantic search (RAG) over topics to gather sources
    const sources = await searchRelevantTopics(message, 4);

    // Compose context passages
    const contextPassages = sources.map(s => `Topic: ${s.topicTitle}\nLesson: ${s.lessonTitle || ''}\nSnippet: ${s.snippet}`).join('\n---\n');

    const systemPrompt = 'You are a helpful AI tutor. Use the provided context passages from the course material to answer the user. If insufficient, answer succinctly and recommend lessons to study.';
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Context passages:\n${contextPassages}` },
      { role: 'user', content: `Question: ${message}` }
    ];

    const resp = await llm.sendChat(messages, { provider: process.env.DEFAULT_LLM_PROVIDER, model: process.env.DEFAULT_LLM_MODEL });
    const content = resp.content || '';

    return { message: content, sources };
  } catch (err) {
    console.error('Tutor error', err);
    return { message: 'Sorry — the tutor encountered an error. Try again later.' };
  }
}

// keep other helpers similar to before but using llm abstraction
export async function assessUserKnowledge(responses: any): Promise<{ level: 'beginner'|'intermediate'|'advanced', strengths: string[], weaknesses: string[] }> {
  try {
    const prompt = `Given these assessment responses, classify the user's overall level (beginner/intermediate/advanced) and list strengths and weaknesses. Responses: ${JSON.stringify(responses)}`;
    const resp = await llm.sendChat([{ role: 'user', content: prompt }]);
    const content = resp.content || '';
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (e) {
      return { level: 'beginner', strengths: [], weaknesses: [] };
    }
  } catch (err) {
    console.error('Assess error', err);
    throw err;
  }
}

export async function generateLearningPath(goals: string[], level: string): Promise<any> {
  try {
    const prompt = `Create a personalized learning path for goals: ${JSON.stringify(goals)} at level ${level}. Provide a JSON array of topics with id,title,lessons[].`;
    const resp = await llm.sendChat([{ role: 'user', content: prompt }]);
    const content = resp.content || '';
    try {
      return JSON.parse(content);
    } catch (e) {
      // If parsing fails, return a simple path
      return [
        { id: 'ml-basics', title: 'Machine Learning Basics', lessons: [{ id: 'ml-intro', title: 'Intro to ML' }] }
      ];
    }
  } catch (err) {
    console.error('Learning path error', err);
    throw err;
  }
}

export async function summarizeResearchPaper(title: string, abstract: string) {
  try {
    const prompt = `Summarize this paper for a learner: Title: ${title}\nAbstract: ${abstract}\nProvide JSON: {summary,keyPoints[],relevantTopics[],difficulty}`;
    const resp = await llm.sendChat([{ role: 'user', content: prompt }]);
    const content = resp.content || '';
    try {
      return JSON.parse(content);
    } catch (e) {
      return { summary: content, keyPoints: [], relevantTopics: [], difficulty: 'intermediate' };
    }
  } catch (err) {
    console.error('Summarize error', err);
    throw err;
  }
}

export function getResourcesForContent(content: string) {
  const resources = [];
  if (content.toLowerCase().includes('tensorflow') || content.toLowerCase().includes('pytorch')) {
    resources.push({ title: 'Official PyTorch Tutorials', url: 'https://pytorch.org/tutorials/', type: 'article' });
  }
  if (content.toLowerCase().includes('practice') || content.toLowerCase().includes('exercise')) {
    resources.push({ title: 'Interactive Coding Exercise', url: '/sandbox', type: 'exercise' });
  }
  return resources.slice(0,2);
}
