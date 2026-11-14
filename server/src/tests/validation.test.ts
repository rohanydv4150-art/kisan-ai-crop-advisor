import { describe, it, expect } from 'vitest';
import { 
  cropAdvisorySchema, 
  cropResultSchema, 
  soilAdvisoryInputSchema,
  fertilizerAdvisoryInputSchema,
  irrigationAdvisoryInputSchema,
  diseaseAdvisoryInputSchema,
  chatbotResponseSchema
} from '../schemas/index.js';

describe('Agricultural Zod Validation Schemas', () => {
  describe('Crop Advisory Input Schema', () => {
    it('should validate a valid crop advisory submission', () => {
      const validData = {
        location: {
          state: 'Karnataka',
          district: 'Bengaluru Rural',
          village: 'Hoskote',
        },
        soil: {
          type: 'Red Soil',
          ph: 6.5,
          nitrogen: 240,
          phosphorus: 25,
          potassium: 190,
          testing_available: true,
        },
        land: {
          area: 3.5,
          unit: 'acre' as const,
        },
        water_availability: 'Moderate' as const,
        irrigation_method: 'Drip',
        season: 'Kharif' as const,
        language: 'en' as const,
      };

      const result = cropAdvisorySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing required location fields', () => {
      const invalidData = {
        location: {
          state: '',
          district: '',
        },
        soil: { type: 'Black Soil' },
        land: { area: 2, unit: 'acre' },
        water_availability: 'High',
        irrigation_method: 'Flood',
        season: 'Rabi',
        language: 'en',
      };

      const result = cropAdvisorySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid soil pH (< 0 or > 14)', () => {
      const invalidData = {
        location: { state: 'Punjab', district: 'Ludhiana' },
        soil: { type: 'Alluvial', ph: 16.5 },
        land: { area: 5, unit: 'acre' },
        water_availability: 'High',
        irrigation_method: 'Tubewell',
        season: 'Rabi',
        language: 'en',
      };

      const result = cropAdvisorySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept null/unknown soil nutrient parameters without failing', () => {
      const dataWithUnknowns = {
        location: { state: 'Odisha', district: 'Puri' },
        soil: {
          type: 'Coastal Alluvium',
          ph: null,
          nitrogen: null,
          phosphorus: null,
          potassium: null,
        },
        land: { area: 1.5, unit: 'acre' as const },
        water_availability: 'Seasonal' as const,
        irrigation_method: 'Rainfed',
        season: 'Kharif' as const,
        language: 'en' as const,
      };

      const result = cropAdvisorySchema.safeParse(dataWithUnknowns);
      expect(result.success).toBe(true);
    });
  });

  describe('AI Recommendation Result Schema', () => {
    it('should validate structured Gemini crop result', () => {
      const validAiOutput = {
        advisory_type: 'crop',
        summary: 'Excellent agro-climatic conditions for Kharif pulses and millets.',
        data_completeness: 'complete',
        missing_information: [],
        recommendations: [
          {
            crop_name: 'Finger Millet (Ragi)',
            crop_category: 'Cereals',
            suitability_score: 92,
            suitability_label: 'High',
            reason: 'Adapted to red loam soil and tolerant to dry spells.',
            soil_compatibility: 'Optimal compatibility with slightly acidic pH 6.5.',
            water_requirement: '350 - 400 mm total requirement.',
            season_suitability: 'July sowing aligns with monsoon rains.',
            cultivation_notes: ['Line sowing at 22.5 cm row spacing.'],
            limitations: ['Sensitive to waterlogging during early seedling stage.'],
          },
        ],
        general_guidance: ['Maintain field drainage during heavy showers.'],
        precautions: ['Use certified seed and Trichoderma treatment.'],
        expert_consultation_required: false,
        disclaimer: 'AI agricultural decision support.',
      };

      const result = cropResultSchema.safeParse(validAiOutput);
      expect(result.success).toBe(true);
    });

    it('should reject AI recommendations with invalid suitability score (> 100)', () => {
      const invalidAiOutput = {
        advisory_type: 'crop',
        summary: 'Invalid score test',
        data_completeness: 'complete',
        missing_information: [],
        recommendations: [
          {
            crop_name: 'Paddy',
            crop_category: 'Cereals',
            suitability_score: 150, // invalid
            suitability_label: 'High',
            reason: 'High score',
            soil_compatibility: 'Good',
            water_requirement: 'High',
            season_suitability: 'Kharif',
            cultivation_notes: [],
            limitations: [],
          },
        ],
        general_guidance: [],
        precautions: [],
        expert_consultation_required: false,
        disclaimer: 'Disclaimer',
      };

      const result = cropResultSchema.safeParse(invalidAiOutput);
      expect(result.success).toBe(false);
    });
  });

  describe('Chatbot Response Schema', () => {
    it('should validate structured agricultural chatbot response', () => {
      const chatbotReply = {
        message: 'To manage stem borer in paddy, release Trichogramma egg parasitoids at 1 lakh/ha.',
        category: 'pest_disease_control',
        language: 'en',
        follow_up_questions: [
          'What is the threshold for pheromone trap catches?',
          'Which neem formulations are recommended?',
        ],
        requires_expert: false,
        disclaimer: 'Advisory guidance for informational support.',
      };

      const result = chatbotResponseSchema.safeParse(chatbotReply);
      expect(result.success).toBe(true);
    });
  });
});
