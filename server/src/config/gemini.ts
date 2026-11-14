import { GoogleGenAI } from '@google/genai';
import { ENV, hasGeminiKey } from './env.js';

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!hasGeminiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured or is using placeholder value. ' +
      'Please obtain an API key from Google AI Studio (https://aistudio.google.com) ' +
      'and set GEMINI_API_KEY in your .env file.'
    );
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: ENV.GEMINI_API_KEY,
    });
  }

  return geminiClient;
}

export const GEMINI_MODEL_NAME = ENV.GEMINI_MODEL;
