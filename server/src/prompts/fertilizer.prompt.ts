import { z } from 'zod';
import { fertilizerAdvisoryInputSchema } from '../schemas/index.js';

export function buildFertilizerPrompt(input: z.infer<typeof fertilizerAdvisoryInputSchema>): string {
  const languageDirective = input.language === 'hi'
    ? 'IMPORTANT: Generate all recommendations and guidance in Hindi (Devanagari script), while keeping JSON keys in English.'
    : 'Generate all recommendations in English.';

  return `Generate nutrient and fertilizer management guidance for the following crop:

CROP & SOIL DETAILS:
- Target Crop: ${input.crop_name}
- Current Growth Stage: ${input.growth_stage}
- Soil Type: ${input.soil_type}
- Soil pH: ${input.ph ?? 'Unknown'}
- Nitrogen (N) Status: ${input.nitrogen ?? 'Unknown'}
- Phosphorus (P) Status: ${input.phosphorus ?? 'Unknown'}
- Potassium (K) Status: ${input.potassium ?? 'Unknown'}
- Farming Practice: ${input.farming_type}

RULES:
- Do not prescribe exact chemical fertilizer dosages without laboratory soil test confirmation.
- Provide stage-specific nutrient requirements (basal vs top dressing).
- Emphasize organic inputs, compost, biofertilizers (Azotobacter, PSB, Rhizobium), and balanced NPK.

${languageDirective}

REQUIRED OUTPUT JSON SCHEMA:
{
  "advisory_type": "fertilizer",
  "summary": "Nutrient management strategy overview for ${input.crop_name}",
  "crop_name": "${input.crop_name}",
  "nutrient_guidance": {
    "nitrogen": "Role, timing and balanced application principles for Nitrogen at ${input.growth_stage}",
    "phosphorus": "Role, timing and root development principles for Phosphorus",
    "potassium": "Role, timing and disease resistance/grain filling principles for Potassium"
  },
  "organic_options": [
    "Well-decomposed FYM or vermicompost application details",
    "Bio-fertilizers and green manuring options"
  ],
  "application_guidance": [
    "Basal application recommendations",
    "Split application and top-dressing timing",
    "Soil moisture requirement during application"
  ],
  "soil_testing_required": ${input.nitrogen === null || input.phosphorus === null},
  "limitations": [
    "Limitations of uncalibrated fertilizer application"
  ],
  "precautions": [
    "Safety instructions: wear gloves, avoid excess urea, do not mix incompatible fertilizers"
  ],
  "disclaimer": "Dosage guidance is general. Follow state university package of practices and verified soil health test cards."
}

Return valid JSON only.`;
}
