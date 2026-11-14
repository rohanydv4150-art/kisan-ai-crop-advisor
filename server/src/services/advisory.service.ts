import { z } from 'zod';
import { 
  cropAdvisorySchema, 
  cropResultSchema,
  soilAdvisoryInputSchema,
  soilResultSchema,
  fertilizerAdvisoryInputSchema,
  fertilizerResultSchema,
  irrigationAdvisoryInputSchema,
  irrigationResultSchema,
  diseaseAdvisoryInputSchema,
  diseaseResultSchema,
} from '../schemas/index.js';
import { GeminiService } from './gemini.service.js';
import { WeatherService } from './weather.service.js';
import { DatabaseService } from './database.service.js';
import { buildCropPrompt } from '../prompts/crop.prompt.js';
import { buildSoilPrompt } from '../prompts/soil.prompt.js';
import { buildFertilizerPrompt } from '../prompts/fertilizer.prompt.js';
import { buildIrrigationPrompt } from '../prompts/irrigation.prompt.js';
import { buildDiseasePrompt } from '../prompts/disease.prompt.js';
import { GEMINI_MODEL_NAME } from '../config/gemini.js';
import { AdvisoryReportRecord } from '../types/index.js';
import { ENV } from '../config/env.js';

export class AdvisoryService {
  /**
   * Generates Crop Advisory, validates with Zod, and persists report.
   */
  public static async generateCropAdvisory(
    userId: string,
    input: z.infer<typeof cropAdvisorySchema>
  ): Promise<AdvisoryReportRecord> {
    // 1. Fetch live agricultural weather if available
    const weather = await WeatherService.getWeatherForLocation(
      input.location.state,
      input.location.district,
      input.location.latitude,
      input.location.longitude
    );

    // 2. Build contextual agricultural prompt
    const prompt = buildCropPrompt(input, weather, ENV.DEFAULT_RECOMMENDATION_COUNT);

    // 3. Generate structured AI output with Gemini and validate with Zod
    const aiResult = await GeminiService.generateStructuredResponse(prompt, cropResultSchema);

    // 4. Persist advisory report
    const record = await DatabaseService.saveAdvisoryReport({
      user_id: userId,
      advisory_type: 'crop',
      location: input.location as unknown as Record<string, unknown>,
      input_data: input as unknown as Record<string, unknown>,
      ai_response: aiResult as unknown as Record<string, unknown>,
      status: 'completed',
      model_name: GEMINI_MODEL_NAME,
    });

    // 5. Send confirmation notification to farmer
    await DatabaseService.addNotification(
      userId,
      'Crop Advisory Ready',
      `Your crop recommendation for ${input.location.district}, ${input.location.state} (${input.season} season) is ready.`,
      'crop_advisory'
    );

    return record;
  }

  /**
   * Generates Soil Advisory, validates with Zod, and persists report.
   */
  public static async generateSoilAdvisory(
    userId: string,
    input: z.infer<typeof soilAdvisoryInputSchema>
  ): Promise<AdvisoryReportRecord> {
    const prompt = buildSoilPrompt(input);
    const aiResult = await GeminiService.generateStructuredResponse(prompt, soilResultSchema);

    const record = await DatabaseService.saveAdvisoryReport({
      user_id: userId,
      advisory_type: 'soil',
      location: (input.location || {}) as unknown as Record<string, unknown>,
      input_data: input as unknown as Record<string, unknown>,
      ai_response: aiResult as unknown as Record<string, unknown>,
      status: 'completed',
      model_name: GEMINI_MODEL_NAME,
    });

    return record;
  }

  /**
   * Generates Fertilizer Advisory, validates with Zod, and persists report.
   */
  public static async generateFertilizerAdvisory(
    userId: string,
    input: z.infer<typeof fertilizerAdvisoryInputSchema>
  ): Promise<AdvisoryReportRecord> {
    const prompt = buildFertilizerPrompt(input);
    const aiResult = await GeminiService.generateStructuredResponse(prompt, fertilizerResultSchema);

    const record = await DatabaseService.saveAdvisoryReport({
      user_id: userId,
      advisory_type: 'fertilizer',
      location: {},
      input_data: input as unknown as Record<string, unknown>,
      ai_response: aiResult as unknown as Record<string, unknown>,
      status: 'completed',
      model_name: GEMINI_MODEL_NAME,
    });

    return record;
  }

  /**
   * Generates Irrigation Advisory, validates with Zod, and persists report.
   */
  public static async generateIrrigationAdvisory(
    userId: string,
    input: z.infer<typeof irrigationAdvisoryInputSchema>
  ): Promise<AdvisoryReportRecord> {
    const weather = input.location
      ? await WeatherService.getWeatherForLocation(
          input.location.state,
          input.location.district,
          input.location.latitude,
          input.location.longitude
        )
      : null;

    const prompt = buildIrrigationPrompt(input, weather);
    const aiResult = await GeminiService.generateStructuredResponse(prompt, irrigationResultSchema);

    const record = await DatabaseService.saveAdvisoryReport({
      user_id: userId,
      advisory_type: 'irrigation',
      location: (input.location || {}) as unknown as Record<string, unknown>,
      input_data: input as unknown as Record<string, unknown>,
      ai_response: aiResult as unknown as Record<string, unknown>,
      status: 'completed',
      model_name: GEMINI_MODEL_NAME,
    });

    return record;
  }

  /**
   * Generates Disease & Pest Advisory, validates with Zod, and persists report.
   */
  public static async generateDiseaseAdvisory(
    userId: string,
    input: z.infer<typeof diseaseAdvisoryInputSchema>
  ): Promise<AdvisoryReportRecord> {
    const prompt = buildDiseasePrompt(input);
    const aiResult = await GeminiService.generateStructuredResponse(prompt, diseaseResultSchema);

    const record = await DatabaseService.saveAdvisoryReport({
      user_id: userId,
      advisory_type: 'disease',
      location: {},
      input_data: input as unknown as Record<string, unknown>,
      ai_response: aiResult as unknown as Record<string, unknown>,
      status: 'completed',
      model_name: GEMINI_MODEL_NAME,
    });

    return record;
  }
}
