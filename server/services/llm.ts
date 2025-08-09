import OpenAI from "openai";
import fetch from "node-fetch";

/**
 * Simple LLM provider abstraction.
 * Supports 'openai' via official SDK, and stub adapters for others (gemini/mistral/claude).
 * Select provider via process.env.DEFAULT_LLM_PROVIDER or per-request options.
 */

export type ChatMessage = { role: 'user'|'assistant'|'system', content: string };

const DEFAULT = process.env.DEFAULT_LLM_PROVIDER || 'openai';

// OpenAI client (if key provided)
const openaiKey = process.env.OPENAI_API_KEY || '';
let openaiClient: OpenAI | null = null;
if (openaiKey) {
  openaiClient = new OpenAI({ apiKey: openaiKey });
}

export async function sendChat(messages: ChatMessage[], opts?: { provider?: string, model?: string, temperature?: number }) {
  const provider = (opts && opts.provider) || DEFAULT;

  if (provider === 'openai') {
    if (!openaiClient) throw new Error('OpenAI provider not configured. Set OPENAI_API_KEY.');
    const model = opts?.model || 'gpt-4o';
    const resp = await openaiClient.chat.completions.create({
      model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      temperature: opts?.temperature ?? 0.2,
    });
    const content = resp.choices?.[0]?.message?.content ?? resp.choices?.[0]?.delta?.content ?? '';
    return { content, raw: resp };
  }

  // Stubs for other providers — return helpful error when not configured
  if (provider === 'gemini') {
    // Placeholder: if user supplies GEMINI_API_KEY, you can implement a call here.
    throw new Error('Gemini provider not configured. Please set GEMINI_API_KEY and implement adapter.');
  }

  if (provider === 'mistral') {
    throw new Error('Mistral provider not configured. Please set MISTRAL_API_KEY and implement adapter.');
  }

  if (provider === 'claude') {
    throw new Error('Claude provider not configured. Please set CLAUDE_API_KEY and implement adapter.');
  }

  throw new Error(`Unknown provider: ${provider}`);
}

export default { sendChat };