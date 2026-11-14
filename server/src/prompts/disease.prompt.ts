import { z } from 'zod';
import { diseaseAdvisoryInputSchema } from '../schemas/index.js';

export function buildDiseasePrompt(input: z.infer<typeof diseaseAdvisoryInputSchema>): string {
  const languageDirective = input.language === 'hi'
    ? 'IMPORTANT: Output all diagnostics, symptoms, preventive steps, and guidance in Hindi (Devanagari script), keeping JSON keys in English.'
    : 'Output all diagnostics and guidance in English.';

  return `Perform a preliminary agricultural pest/disease symptom analysis based on farmer observations:

OBSERVED SYMPTOMS:
- Crop: ${input.crop_name}
- Affected Plant Part: ${input.affected_part}
- Observed Symptoms: ${input.symptoms}
- Crop Stage: ${input.crop_stage}
- Environmental / Weather Notes: ${input.weather_context || 'None reported'}

CRITICAL SAFETY & ETHICAL RULES:
- Do NOT claim a definitive or confirmed diagnosis from visual/text description alone.
- Label conditions as 'possible' or 'unconfirmed'.
- Prioritize Integrated Pest Management (IPM), biological controls (e.g. neem oil, Trichoderma), cultural sanitation, and resistant varieties.
- Never recommend unverified chemical dosages or hazardous tank mixes.
- Instruct the farmer to consult local extension officer/KVK for severe outbreaks.

${languageDirective}

REQUIRED OUTPUT JSON SCHEMA:
{
  "advisory_type": "disease",
  "summary": "Preliminary evaluation of reported symptoms on ${input.crop_name}",
  "possible_conditions": [
    {
      "name": "Probable Disease or Pest Name",
      "category": "fungal" | "bacterial" | "viral" | "insect" | "nutrient_deficiency" | "environmental_stress" | "unknown",
      "confidence_label": "possible" | "likely" | "unconfirmed",
      "symptoms": [
        "Key characteristic symptom matching farmer's description"
      ],
      "preventive_measures": [
        "Cultural sanitation, seed treatment, crop spacing, or field drainage"
      ],
      "management_guidance": [
        "Safe bio-control or approved IPM management approach"
      ],
      "requires_expert_confirmation": true
    }
  ],
  "integrated_pest_management": [
    "Pheromone / sticky traps, bird perches, beneficial insects conservation"
  ],
  "safety_precautions": [
    "Protective gear warning, waiting periods before harvest, and product label adherence"
  ],
  "expert_consultation_required": true,
  "disclaimer": "This is an AI decision support symptom match, NOT an official laboratory diagnosis. Take an infected sample in a sealed bag to your nearest Krishi Vigyan Kendra (KVK) or Agriculture University Clinic."
}

Return valid JSON only.`;
}
