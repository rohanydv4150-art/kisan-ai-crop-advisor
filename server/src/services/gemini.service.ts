import { z } from 'zod';
import { getGeminiClient, GEMINI_MODEL_NAME } from '../config/gemini.js';
import { SYSTEM_PROMPT } from '../prompts/system.prompt.js';
import { hasGeminiKey } from '../config/env.js';

export class GeminiService {
  /**
   * Generates structured JSON output from Gemini and validates against a Zod schema.
   */
  public static async generateStructuredResponse<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    retryOnInvalid: boolean = true
  ): Promise<T> {
    if (!hasGeminiKey) {
      throw new Error(
        'GEMINI_CONFIG_REQUIRED: GEMINI_API_KEY is not set in environment variables. ' +
        'Please add your key from https://aistudio.google.com to the .env file.'
      );
    }

    const client = getGeminiClient();

    try {
      const modelsToTry = [GEMINI_MODEL_NAME, GEMINI_MODEL_NAME, 'gemini-2.5-flash-lite'];
      let response: any;
      let lastError: any;

      for (const modelName of modelsToTry) {
        try {
          response = await client.models.generateContent({
            model: modelName,
            contents: [
              {
                role: 'user',
                parts: [{ text: `${SYSTEM_PROMPT}\n\n---\n\n${prompt}` }],
              },
            ],
            config: {
              responseMimeType: 'application/json',
              temperature: 0.2,
              maxOutputTokens: 3500,
            },
          });
          if (response) break;
        } catch (err: any) {
          lastError = err;
          if (err?.status === 503 || String(err?.message).includes('503')) {
            await new Promise((r) => setTimeout(r, 2000));
            continue;
          }
          throw err;
        }
      }

      if (!response) throw lastError;

      // Extract generated text
      const rawText = response.text || '';
      if (!rawText.trim()) {
        throw new Error('Gemini returned an empty response.');
      }

      // Clean any accidental markdown code fences
      const cleaned = GeminiService.cleanJsonString(rawText);
      const parsed = JSON.parse(cleaned);

      // Validate with Zod
      const validation = schema.safeParse(parsed);
      if (validation.success) {
        return validation.data;
      }

      // If invalid and retry allowed, attempt one controlled repair
      if (retryOnInvalid) {
        console.warn('Initial Gemini JSON did not pass schema validation. Attempting controlled repair...', validation.error.issues);
        return await GeminiService.repairAndValidate(rawText, schema);
      }

      throw new Error(`Schema validation failed: ${validation.error.message}`);
    } catch (error: any) {
      if (error?.message?.includes('GEMINI_CONFIG_REQUIRED')) {
        throw error;
      }
      console.error('Gemini Generation Error:', error);
      throw new Error(`Failed to generate agricultural advisory: ${error?.message || 'Unknown provider error'}`);
    }
  }

  /**
   * Attempts one repair prompt to fix schema discrepancies.
   */
  private static async repairAndValidate<T>(
    malformedOutput: string,
    schema: z.ZodSchema<T>
  ): Promise<T> {
    const client = getGeminiClient();

    const repairPrompt = `The previous response failed schema validation. Correct the JSON below to strictly match the requested schema with all required fields. Return pure JSON only without markdown:\n\n${malformedOutput}`;

    const repairResponse = await client.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: repairPrompt }] }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const repairedText = repairResponse.text || '';
    const cleaned = GeminiService.cleanJsonString(repairedText);
    const parsed = JSON.parse(cleaned);
    return schema.parse(parsed);
  }

  /**
   * Cleans potential ```json markdown fences or leading/trailing whitespace.
   */
  private static cleanJsonString(str: string): string {
    let clean = str.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/i, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/i, '');
    }
    if (clean.endsWith('```')) {
      clean = clean.replace(/\s*```$/i, '');
    }
    return clean.trim();
  }
}
